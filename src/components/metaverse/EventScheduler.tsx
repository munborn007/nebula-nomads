'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BOSS_INTERVAL_MS = 60 * 60 * 1000;
const AIRDROP_INTERVAL_MS = 45 * 60 * 1000;

function useNextEvent(intervalMs: number, label: string) {
  const [countdown, setCountdown] = useState('—');
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const next = Math.ceil(now / intervalMs) * intervalMs;
      const left = Math.max(0, next - now);
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      setCountdown(left > 0 ? `${m}m ${s}s` : 'Now!');
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [intervalMs]);
  return { label, countdown };
}

/** Next scheduled events: boss fight (hourly), airdrop rain. */
export default function EventScheduler() {
  const boss = useNextEvent(BOSS_INTERVAL_MS, 'Boss Fight');
  const airdrop = useNextEvent(AIRDROP_INTERVAL_MS, 'Airdrop Rain');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-card rounded-xl p-4 border border-neon-pink/30"
    >
      <p className="font-medium text-neon-pink text-sm">Live Events</p>
      <p className="text-xs text-slate-500 mt-1">Boss: {boss.countdown} · Airdrop: {airdrop.countdown}</p>
    </motion.div>
  );
}
