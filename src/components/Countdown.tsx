'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MINT_DATE = new Date('2026-06-01T00:00:00Z');

function useCountdown() {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      const d = MINT_DATE.getTime() - now.getTime();
      if (d <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setDiff({
        days: Math.floor(d / (1000 * 60 * 60 * 24)),
        hours: Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((d % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((d % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return mounted ? diff : { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown();

  const units = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Min' },
    { value: seconds, label: 'Sec' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="holo-card relative flex flex-wrap justify-center gap-6 rounded-2xl p-8 shadow-[0_0_40px_rgba(160,32,240,0.3),inset_0_0_30px_rgba(0,255,255,0.05)]"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {units.map((u) => (
        <motion.div
          key={u.label}
          className="flex flex-col items-center"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: units.indexOf(u) * 0.1 }}
        >
          <span
            className="font-mono text-3xl font-bold sm:text-4xl"
            style={{
              color: '#fff',
              textShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(160,32,240,0.5)',
            }}
          >
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase tracking-widest text-neon-cyan/80">{u.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
