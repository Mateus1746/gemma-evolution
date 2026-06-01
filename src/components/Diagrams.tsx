/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { THEME } from '../constants';

const SPRING_CONFIG = THEME.animation.physics.organic;

interface NodeProps {
  x: number;
  y: number;
  label: string;
  active?: boolean;
}

export const SemanticDiagramNode: React.FC<NodeProps> = ({ x, y, label, active }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1, x, y }}
    transition={{ type: "spring", ...SPRING_CONFIG }}
    className={`absolute px-4 py-2 rounded-xl border-2 transition-colors duration-500 flex items-center justify-center font-bold text-sm ${
      active 
        ? 'bg-brand-gold/20 border-brand-gold text-brand-gold shadow-[0_0_20px_rgba(242,201,76,0.3)]' 
        : 'bg-white/5 border-white/10 text-white/40'
    }`}
    style={{ left: -60, top: -20, width: 120 }}
  >
    {label}
  </motion.div>
);

export const SemanticConnection: React.FC<{ from: [number, number], to: [number, number], active?: boolean }> = ({ from, to, active }) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: length, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className={`absolute h-[2px] origin-left transition-colors duration-500 ${
        active ? 'bg-brand-gold' : 'bg-white/10'
      }`}
      style={{
        left: from[0],
        top: from[1],
        transform: `rotate(${angle}deg)`
      }}
    />
  );
};
