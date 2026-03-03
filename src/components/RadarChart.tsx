'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export type RadarStat = { label: string; value: number };

interface RadarChartProps {
  stats: RadarStat[];
  max?: number;
  color?: string;
  size?: number;
  className?: string;
}

/**
 * SVG radar chart for power stats. Animated fill on mount.
 */
export default function RadarChart({ stats, max = 100, color = 'rgba(0, 255, 255, 0.6)', size = 200, className = '' }: RadarChartProps) {
  const n = stats.length;
  const center = size / 2;
  const radius = center - 20;

  const points = useMemo(() => {
    return stats.map((s, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const r = (s.value / max) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        label: s.label,
      };
    });
  }, [stats, n, max, radius, center]);

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const axisPoints = stats.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, label: stats[i].label };
  });

  return (
    <div className={className}>
      <motion.svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto"
      >
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={radius * r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {axisPoints.map((a, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={a.x}
            y2={a.y}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        ))}
        {/* Data polygon fill */}
        <motion.polygon
          points={polyPoints}
          fill={color}
          fillOpacity={0.35}
          stroke={color}
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        {/* Labels */}
        {axisPoints.map((a, i) => (
          <text
            key={i}
            x={a.x * 1.08}
            y={a.y * 1.08}
            textAnchor={a.x >= center ? 'start' : 'end'}
            fill="rgba(255,255,255,0.7)"
            fontSize="10"
          >
            {a.label}
          </text>
        ))}
      </motion.svg>
    </div>
  );
}
