/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ScatterChart, Scatter, ZAxis,
  XAxis, YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Cell as ReCell,
  Tooltip
} from 'recharts';
import { motion } from 'motion/react';
import { THEME } from '../constants';

const SPRING_CONFIG = THEME.animation.physics.organic;

interface ChartProps {
  data: any[];
  type: 'bar' | 'line' | 'radar' | 'scatter';
  title?: string;
}

export const SemanticChart: React.FC<ChartProps> = ({ data, type, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ type: "spring", ...SPRING_CONFIG }}
    className="w-full h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col"
  >
    {title && <h3 className="text-brand-gold font-bold text-xl mb-6 uppercase tracking-wider">{title}</h3>}
    <div className="flex-1 w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        {type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: THEME.colors.space, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: THEME.colors.gold }}
            />
            <Bar 
              dataKey="value" 
              radius={[10, 10, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((_, index) => (
                <ReCell key={`cell-${index}`} fill={index % 2 === 0 ? THEME.colors.gold : THEME.colors.gold + '99'} />
              ))}
            </Bar>
          </BarChart>
        ) : type === 'radar' ? (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
            <Radar
              name="Gemma 4"
              dataKey="A"
              stroke={THEME.colors.gold}
              fill={THEME.colors.gold}
              fillOpacity={0.6}
              isAnimationActive={false}
            />
            <Radar
              name="Previous Gen"
              dataKey="B"
              stroke="#666"
              fill="#666"
              fillOpacity={0.3}
              isAnimationActive={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: THEME.colors.space, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
          </RadarChart>
        ) : type === 'scatter' ? (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" dataKey="x" name="Parameters" unit="B" stroke="rgba(255,255,255,0.3)" />
            <YAxis type="number" dataKey="y" name="Score" stroke="rgba(255,255,255,0.3)" />
            <ZAxis type="number" dataKey="z" range={[60, 400]} name="Efficiency" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Models" data={data} fill={THEME.colors.gold} isAnimationActive={false}>
              {data.map((entry, index) => (
                <ReCell key={`cell-${index}`} fill={entry.color || THEME.colors.gold} />
              ))}
            </Scatter>
          </ScatterChart>
        ) : (
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={THEME.colors.gold} 
              strokeWidth={4} 
              dot={{ fill: THEME.colors.gold, r: 6, strokeWidth: 0 }}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  </motion.div>
);
