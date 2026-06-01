/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { THEME } from '../constants';

const SPRING_CONFIG = THEME.animation.physics.organic;

interface AssetProps {
  x: number;
  y: number;
  size?: number;
  color?: string;
}

export const Cell: React.FC<AssetProps> = ({ x, y, size = 60, color = THEME.colors.gold }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, x, y }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: "spring", ...SPRING_CONFIG }}
    className="absolute rounded-full flex items-center justify-center pointer-events-none"
    style={{ 
      width: size, 
      height: size, 
      backgroundColor: color,
      boxShadow: `0 0 20px ${color}33`,
      left: -size/2,
      top: -size/2
    }}
  >
    <div className="w-1/2 h-1/2 rounded-full border-2 border-white/20" />
  </motion.div>
);

export const Pathogen: React.FC<AssetProps> = ({ x, y }) => (
  <motion.div
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: 1, rotate: 0, x, y }}
    exit={{ scale: 0, scaleY: 0 }}
    transition={{ type: "spring", ...SPRING_CONFIG }}
    className="absolute bg-brand-coral w-12 h-12 rounded-lg flex items-center justify-center pointer-events-none"
    style={{ left: -24, top: -24 }}
  >
    <Target className="text-white w-6 h-6" />
    {[0, 90, 180, 270].map(deg => (
      <div 
        key={deg}
        className="absolute w-2 h-4 bg-brand-coral rounded-full"
        style={{ transform: `rotate(${deg}deg) translateY(-20px)` }}
      />
    ))}
  </motion.div>
);

export const NeuralNode: React.FC<AssetProps & { active?: boolean }> = ({ x, y, size = 40, active }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ 
      scale: active ? [1, 1.05, 1] : 1, 
      x, y,
      backgroundColor: active ? THEME.colors.gold : 'rgba(255,255,255,0.1)',
      borderColor: active ? THEME.colors.gold : 'rgba(255,255,255,0.2)'
    }}
    exit={{ scale: 0 }}
    transition={{ 
      type: "spring", 
      ...SPRING_CONFIG,
      scale: active ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { type: "spring", ...SPRING_CONFIG }
    }}
    className="absolute rounded-lg border-2 flex items-center justify-center pointer-events-none"
    style={{ 
      width: size, 
      height: size, 
      left: -size/2,
      top: -size/2,
      boxShadow: active ? `0 0 20px ${THEME.colors.gold}88` : 'none'
    }}
  >
    <div className={`w-1 h-1 rounded-full ${active ? 'bg-brand-space' : 'bg-white/40'}`} />
  </motion.div>
);

export const DataToken: React.FC<AssetProps & { label: string }> = ({ x, y, label }) => (
  <motion.div
    initial={{ y: y + 20, opacity: 0 }}
    animate={{ y, x, opacity: 1 }}
    exit={{ y: y - 20, opacity: 0 }}
    className="absolute bg-brand-gold text-brand-space px-2 py-1 rounded-md text-[10px] font-mono font-bold tracking-tighter"
    style={{ left: -20, top: -10 }}
  >
    {label}
  </motion.div>
);

export const ProcessorCore: React.FC<AssetProps> = ({ x, y, size = 120 }) => (
  <motion.div
    initial={{ scale: 0, rotate: 45 }}
    animate={{ scale: 1, rotate: 0, x, y }}
    transition={{ type: "spring", ...THEME.animation.physics.heavy }}
    className="absolute border-4 border-brand-gold bg-brand-space/80 backdrop-blur-xl flex items-center justify-center pointer-events-none"
    style={{ 
      width: size, 
      height: size, 
      left: -size/2, 
      top: -size/2,
      borderRadius: '24%'
    }}
  >
    <div className="absolute inset-2 border border-brand-gold/30 rounded-[20%]" />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-1/3 h-1/3 bg-brand-gold rounded-full blur-xl" 
    />
    <div className="relative z-10 font-mono text-[10px] font-bold text-brand-gold opacity-60">
      G4_CORE
    </div>
  </motion.div>
);
