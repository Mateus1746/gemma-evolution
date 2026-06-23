/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import { LayoutGrid, Activity, Database, Share2, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { THEME, SAMPLE_SCRIPT } from './constants';
import { Cell, Pathogen, NeuralNode, ProcessorCore, DataToken } from './components/Assets';
import { SemanticChart } from './components/Charts';
import { SemanticDiagramNode, SemanticConnection } from './components/Diagrams';
import { ArchitectureScene, BiologyScene } from './components/Scenes';
import { useSemanticSequence } from './hooks/useSemanticSequence';
import { synthesizeSpeech, playPCM } from './lib/gemini';
import { useCollisionManager } from './hooks/useCollisionManager';

// Registry of scenes for cleaner dispatch
const SceneRegistry: Record<string, React.FC<{ currentStep: number; meta?: any }>> = {
  architecture: ArchitectureScene,
  biology: BiologyScene,
  data: ({ meta }) => (
    <motion.div key="scene-data" className="relative w-[600px] h-[450px] flex items-center justify-center">
      {/* Background Data Matrix Effect */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1 opacity-10 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div 
            key={`matrix-${i}`}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
            className="w-full h-full bg-brand-gold/20 rounded-sm"
          />
        ))}
      </div>
      
      <div className="relative z-10 w-full h-full">
        <SemanticChart 
          type={meta?.chartType || 'bar'} 
          data={meta?.chartData || []} 
          title={meta?.chartType === 'scatter' ? "Performance vs Scale" : "Multimodal Capability Matrix"}
        />
      </div>
    </motion.div>
  ),
  neural: () => (
    <motion.div key="scene-neural" className="absolute inset-0">
      {[...Array(6)].map((_, i) => (
        <NeuralNode key={`neuron-${i}`} x={200 + (i % 2) * 400} y={100 + i * 80} active={Math.random() > 0.3} />
      ))}
      <SemanticConnection from={[200, 100]} to={[600, 180]} active />
      <SemanticConnection from={[600, 180]} to={[200, 260]} active />
      <SemanticConnection from={[200, 260]} to={[600, 340]} active />
    </motion.div>
  ),
  process: ({ meta }) => (
    <motion.div key="scene-process" className="absolute inset-0">
      <SemanticConnection from={[100, 300]} to={[700, 300]} active={true} />
      {meta?.tokens?.map((token: string, i: number) => (
        <DataToken key={`token-${i}`} x={150 + i * 120} y={280} label={token} />
      ))}
      <SemanticDiagramNode x={400} y={400} label="CONTEXT WINDOW" active={true} />
    </motion.div>
  ),
};

// Componente de Efeito de Lente para Transições
const LensEffect = ({ step }: { step: number }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={step}
      initial={{ opacity: 0, scale: 1.1, backdropFilter: 'blur(10px)' }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [1.1, 1, 1],
        backdropFilter: ['blur(10px)', 'blur(0px)', 'blur(0px)']
      }}
      transition={{ duration: 1.2, times: [0, 0.2, 1], ease: "circOut" }}
      className="absolute inset-0 z-40 pointer-events-none bg-white/5"
    />
  </AnimatePresence>
);

// Painel de Telemetria de Retenção
const RetentionTelemetry = ({ scene, elapsed, timer }: { scene: string, elapsed: number, timer: number }) => {
  const efficiency = Math.sin(timer * 2) * 10 + 85 + (scene === 'neural' ? 5 : 0);
  
  return (
    <div className="absolute top-24 left-8 z-50 flex flex-col gap-2 font-mono text-[10px] text-brand-gold/60 uppercase tracking-tighter collidable-element">
      <div className="bg-brand-space/40 backdrop-blur-sm p-3 border border-white/5 rounded-lg flex flex-col gap-1">
        <div className="flex justify-between gap-8">
          <span>Active Scene:</span>
          <span className="text-white">{scene}</span>
        </div>
        <div className="flex justify-between">
          <span>Neural Efficiency:</span>
          <span className="text-brand-gold">{efficiency.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Dwell Time:</span>
          <span className="text-white">{elapsed.toFixed(2)}s</span>
        </div>
      </div>
      
      <div className="bg-brand-space/40 backdrop-blur-sm p-3 border border-white/5 rounded-lg flex flex-col gap-1">
        <div className="flex justify-between">
          <span>Processing Load:</span>
          <span className={elapsed < 1 ? "text-brand-coral" : "text-brand-gold"}>
            {elapsed < 1 ? "PEAK_SYMMETRY" : "STABLE"}
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 mt-1">
          <motion.div 
            className="h-full bg-brand-gold shadow-[0_0_10px_#f2c94c]"
            animate={{ width: `${efficiency}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const sceneId = urlParams.get('scene');

  // In a real scenario, we might fetch a different script based on sceneId
  // For now, we use SAMPLE_SCRIPT but acknowledge the parameterization
  const { currentStep, activeStep, elapsedInScene, timer, isPlaying, start, pause, reset, advance, seek } = useSemanticSequence({
    script: SAMPLE_SCRIPT
  });

  useEffect(() => {
    (window as any).renderFrame = async (timeMs: number) => {
      seek(timeMs / 1000);
    };
    (window as any).__appReady = true;
    console.log("Autonomous Execution API Initialized: window.renderFrame and window.__appReady are set.");
  }, [seek]);

  const { containerRef, forceRecalculate } = useCollisionManager('.collidable-element', 15);
  const [debugActive, setDebugActive] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'd') {
        setDebugActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    forceRecalculate();
  }, [currentStep, forceRecalculate]);

  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const processedStepRef = React.useRef<number>(-1);

  // Física da Câmera
  const camX = useSpring(0, THEME.animation.physics.organic);
  const camY = useSpring(0, THEME.animation.physics.organic);
  const camZoom = useSpring(1, { stiffness: 80, damping: 25, mass: 1 });

  useEffect(() => {
    camX.set(activeStep.meta?.camera?.x || 0);
    camY.set(activeStep.meta?.camera?.y || 0);
    // Apply zoom-out if transitioning
    const baseZoom = activeStep.meta?.camera?.zoom || 1;
    camZoom.set(isTransitioning ? baseZoom * 0.8 : baseZoom);
  }, [activeStep, camX, camY, camZoom, isTransitioning]);

  // Motor de Narração (Gemini Alta Fidelidade)
  useEffect(() => {
    if (!isPlaying || processedStepRef.current === currentStep) return;

    let isCancelled = false;
    processedStepRef.current = currentStep;

    const performNarration = async () => {
      const audioData = await synthesizeSpeech(activeStep.text);
      
      if (audioData && !isCancelled) {
        await playPCM(audioData);
        if (!isCancelled) {
          // Iniciar zoom-out de transição
          setIsTransitioning(true);
          setTimeout(() => {
            if (!isCancelled) {
              advance();
              setIsTransitioning(false);
            }
          }, 800);
        }
      } else if (!isCancelled) {
        setIsTransitioning(true);
        setTimeout(() => {
          if (!isCancelled) {
            advance();
            setIsTransitioning(false);
          }
        }, 1500);
      }
    };

    performNarration();

    return () => {
      isCancelled = true;
    };
  }, [isPlaying, currentStep, activeStep.text, advance]);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-brand-space selection:bg-brand-gold/30 ${debugActive ? 'debug-active' : ''}`} ref={containerRef}>
      <canvas id="video-canvas" style={{ display: 'none' }} width="1080" height="1080" />
      {/* Background Overlays */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(242,201,76,0.05)_0%,transparent_70%)]" />
      <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none z-10" />
      <div className="absolute inset-0 vignette pointer-events-none z-20" />
      
      <LensEffect step={currentStep} />

      <RetentionTelemetry 
        scene={activeStep.scene} 
        elapsed={elapsedInScene} 
        timer={timer} 
      />

      {/* Controles de Reprodução */}
      <div className="absolute bottom-8 right-8 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-xl p-4 border border-white/10 rounded-2xl shadow-2xl collidable-element">
        <button 
          onClick={reset}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
        <button 
          onClick={isPlaying ? pause : start}
          className="w-12 h-12 flex items-center justify-center bg-brand-gold rounded-full text-brand-space hover:scale-110 active:scale-95 transition-all shadow-lg"
          title={isPlaying ? "Pause" : "Play Narration"}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
    <div className="flex flex-col pr-2">
          <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">Narration Engine</span>
          <div className="flex items-center gap-2 text-white/40">
            <Volume2 size={12} />
            <span className="text-[10px] font-mono">GEMINI HIGH-FIDELITY</span>
          </div>
        </div>
      </div>

      {/* Model Spec Badge */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-50 flex flex-col gap-1 collidable-element"
      >
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-xs font-mono text-white/80 tracking-tighter">GEMMA 4.0 // ARCHITECTURE: MOE-64</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Database size={12} className="text-brand-gold" />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">27B Parameters Active</span>
        </div>
      </motion.div>
      <motion.div 
        style={{ 
          x: useTransform(camX, value => -value), 
          y: useTransform(camY, value => -value),
          scale: camZoom 
        }}
        className="absolute inset-0 flex items-center justify-center z-30"
      >
        <div className="relative w-[800px] h-[600px] flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            {(() => {
              const SceneComponent = SceneRegistry[activeStep.scene] || BiologyScene;
              return <SceneComponent currentStep={currentStep} meta={activeStep.meta} />;
            })()}
          </AnimatePresence>

          {/* Partículas de Background Noise Otimizadas */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={`noise-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ 
                  left: `${(i * 137) % 100}%`,
                  top: `${(i * 251) % 100}%` 
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interface de Legenda Semântica */}
      <div className="absolute bottom-16 left-0 right-0 px-8 flex flex-col items-center z-50">
        <motion.div 
          key={`caption-${currentStep}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-2xl text-center"
        >
          <p className="text-3xl font-bold tracking-tight leading-tight">
            {activeStep.text.split(' ').map((word, i) => {
              const cleanedWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
              const isHighlight = cleanedWord.includes(activeStep.highlight.toLowerCase());
              return (
                <span 
                  key={`word-${currentStep}-${i}`} 
                  className={isHighlight ? "text-brand-gold" : "text-white transition-colors duration-300"}
                  style={{ color: isHighlight ? THEME.colors.gold : 'white' }}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </motion.div>
      </div>

      {/* Scene Indicators */}
      <div className="absolute top-8 right-8 flex gap-3 z-50">
        {[
          { id: 'biology', icon: Activity },
          { id: 'data', icon: Database },
          { id: 'process', icon: Share2 }
        ].map(({ id, icon: Icon }) => (
          <motion.div 
            key={id}
            animate={{ 
              backgroundColor: activeStep.scene === id ? THEME.colors.gold : 'rgba(255,255,255,0.05)',
              color: activeStep.scene === id ? THEME.colors.space : 'rgba(255,255,255,0.4)',
              scale: activeStep.scene === id ? 1.1 : 1
            }}
            className="p-3 rounded-xl backdrop-blur-md border border-white/10"
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        ))}
      </div>

      {/* Overlay de Protocolo */}
      <div className="absolute top-8 left-8 flex items-center gap-4 text-xs font-mono text-white/40 uppercase tracking-widest pointer-events-none">
        <LayoutGrid className="w-4 h-4" />
        <span>Protocol: Semantic Saturation v0.40.0</span>
        <span className="ml-4 opacity-20">|</span>
        <span>Output: 60 FPS</span>
      </div>
      {debugActive && (
        <>
          {/* Action-Safe Zone (93%) */}
          <div style={{
            position: 'absolute',
            top: '3.5%',
            left: '3.5%',
            width: '93%',
            height: '93%',
            border: '1px dashed rgba(0, 242, 255, 0.3)',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            zIndex: 9999
          }}>
            <span style={{ 
              position: 'absolute', 
              top: '4px', 
              left: '6px', 
              fontSize: '8px', 
              color: 'rgba(0, 242, 255, 0.5)', 
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '1px 4px',
              borderRadius: '2px'
            }}>
              ACTION-SAFE (93%)
            </span>
          </div>

          {/* Title-Safe Zone (90%) */}
          <div style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '90%',
            height: '90%',
            border: '1px dashed rgba(188, 19, 254, 0.3)',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            zIndex: 9999
          }}>
            <span style={{ 
              position: 'absolute', 
              bottom: '4px', 
              right: '6px', 
              fontSize: '8px', 
              color: 'rgba(188, 19, 254, 0.5)', 
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '1px 4px',
              borderRadius: '2px'
            }}>
              TITLE-SAFE (90%)
            </span>
          </div>
        </>
      )}
    </div>
  );
}

