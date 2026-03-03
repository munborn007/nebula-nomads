'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { NomadRarity } from '@/data/nomads';
import HoloTooltip from '@/components/HoloTooltip';

const RARITY_BAR_COLOR: Record<NomadRarity, string> = {
  Common: 'rgba(107, 114, 128, 0.9)',
  Rare: 'rgba(59, 130, 246, 0.95)',
  Epic: 'rgba(168, 85, 247, 0.95)',
  Legendary: 'rgba(234, 179, 8, 0.95)',
};

const RARITY_GLOW: Record<NomadRarity, string> = {
  Common: '0 0 12px rgba(107, 114, 128, 0.5)',
  Rare: '0 0 16px rgba(59, 130, 246, 0.6)',
  Epic: '0 0 18px rgba(168, 85, 247, 0.6)',
  Legendary: '0 0 20px rgba(234, 179, 8, 0.8)',
};

interface HoloStatBarProps {
  label: string;
  value: number;
  max?: number;
  rarity: NomadRarity;
  tooltip?: string;
  delay?: number;
}

/**
 * Holographic stat bar (1–100): neon fill by rarity, animated on load, optional tooltip.
 */
export default function HoloStatBar({ label, value, max = 100, rarity, tooltip, delay = 0 }: HoloStatBarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const bar = (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span className="text-white font-mono">{value}</span>
      </div>
      <div className="holo-stat-bar-track h-2 rounded-full overflow-hidden bg-black/60 border border-white/10">
        <motion.div
          className="h-full rounded-full holostat-fill"
          initial={{ width: 0 }}
          animate={mounted ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay: delay * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundColor: RARITY_BAR_COLOR[rarity],
            boxShadow: RARITY_GLOW[rarity],
          }}
        />
      </div>
    </div>
  );

  if (tooltip) {
    return (
      <HoloTooltip content={tooltip} side="top">
        <div className="cursor-help">{bar}</div>
      </HoloTooltip>
    );
  }
  return bar;
}
