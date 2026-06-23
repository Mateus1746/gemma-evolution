/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';

export interface ScriptStep {
  time: number;
  text: string;
  highlight: string;
  scene: 'biology' | 'data' | 'process' | 'neural' | 'architecture';
  meta?: any;
}

interface UseSemanticSequenceProps {
  script: ScriptStep[];
  duration?: number;
  fps?: number;
}

export function useSemanticSequence({ script }: UseSemanticSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneStartTime, setSceneStartTime] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimer(prev => prev + 0.016);
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const advance = () => {
    if (currentStep < script.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSceneStartTime(timer);
    } else {
      setIsPlaying(false);
    }
  };

  const start = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const reset = () => {
    setCurrentStep(0);
    setTimer(0);
    setSceneStartTime(0);
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    setTimer(time);

    // Find appropriate step based on time
    let stepIndex = 0;
    for (let i = script.length - 1; i >= 0; i--) {
      if (time >= script[i].time) {
        stepIndex = i;
        break;
      }
    }

    if (stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
    }
    setSceneStartTime(script[stepIndex].time);
  };

  return {
    timer,
    currentStep,
    elapsedInScene: timer - sceneStartTime,
    activeStep: script[currentStep],
    isPlaying,
    advance,
    start,
    pause,
    reset,
    seek
  };
}
