import React, { useEffect, useRef } from 'react';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Expose for Headless Recorder
    (window as any).__FACTORY_CANVAS__ = canvas;
    (window as any).renderFrame = (t: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = '#130F26'; // Space theme
      ctx.fillRect(0, 0, width, height);

      // Animation time based on global `t`
      const timeInSeconds = t / 1000;

      // Draw Neural Network Nodes
      const nodes = [
        { x: width * 0.2, y: height * 0.3, label: 'Input' },
        { x: width * 0.2, y: height * 0.7, label: 'Tokens' },
        { x: width * 0.5, y: height * 0.2, label: 'MoE 64' },
        { x: width * 0.5, y: height * 0.5, label: 'Gemma 2' },
        { x: width * 0.5, y: height * 0.8, label: 'Llama 3' },
        { x: width * 0.8, y: height * 0.5, label: 'Output' },
      ];

      // Draw Connections
      ctx.lineWidth = 2;
      nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
          if (i !== j && nodeA.x < nodeB.x) {
             const opacity = 0.1 + Math.sin(timeInSeconds * 2 + i + j) * 0.5 + 0.5;
             ctx.strokeStyle = `rgba(242, 201, 76, ${opacity})`; // Gold
             ctx.beginPath();
             ctx.moveTo(nodeA.x, nodeA.y);
             ctx.lineTo(nodeB.x, nodeB.y);
             ctx.stroke();
          }
        });
      });

      // Draw Nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(timeInSeconds * 3 + i) * 5;
        const radius = 30 + pulse;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
        gradient.addColorStop(0, '#F2C94C');
        gradient.addColorStop(1, '#EB5757');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y + radius + 20);
      });

      // Draw Title / Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 40px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GEMMA EVOLUTION: NEURAL ARCHITECTURE', width / 2, height * 0.1);
      
      ctx.fillStyle = '#F2C94C';
      ctx.font = '24px monospace';
      ctx.fillText('ACTIVE PARAMETERS: 27B', width / 2, height * 0.9);

      // Time debug
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`T: ${timeInSeconds.toFixed(2)}s`, 20, 30);
    };

    // Trigger first frame
    (window as any).renderFrame(0);

  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <canvas
        id="video-canvas"
        ref={canvasRef}
        width={1080}
        height={1080}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default App;
