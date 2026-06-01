/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Cell, ProcessorCore, NeuralNode } from './Assets';
import { THEME } from '../constants';

interface SceneProps {
  currentStep: number;
}

export const ArchitectureScene: React.FC<SceneProps> = ({ currentStep }) => (
  <motion.div 
    key="scene-architecture"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0"
  >
    <ProcessorCore x={400} y={300} />
    <NeuralNode x={200} y={150} active={currentStep >= 1} />
    <NeuralNode x={600} y={150} active={currentStep >= 1} />
    <NeuralNode x={200} y={450} active={currentStep >= 1} />
    <NeuralNode x={600} y={450} active={currentStep >= 1} />
  </motion.div>
);

export const BiologyScene: React.FC<SceneProps> = ({ currentStep }) => (
  <motion.div 
    key="scene-biology"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0"
  >
    <Cell x={400} y={300} size={180} color={THEME.colors.gold} key="core-cell" />
    <Cell x={200} y={150} size={80} color={THEME.colors.gold} key="cell-s1" />
  </motion.div>
);
