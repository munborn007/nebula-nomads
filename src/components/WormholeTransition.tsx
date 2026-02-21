'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WormholeTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="wormhole"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9998] flex items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0a001a 50%, #000 100%)',
            }}
          >
            {/* Neon pulse ring */}
            <motion.div
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute h-32 w-32 rounded-full border-2"
              style={{ borderColor: '#a020f0', boxShadow: '0 0 40px #a020f0, 0 0 80px #ff00ff' }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="h-24 w-24 rounded-full border-2 border-t-[#00ffff] border-r-[#ff00ff] border-b-[#a020f0] border-l-[#00ffff]"
              style={{ boxShadow: '0 0 30px rgba(0,255,255,0.5), 0 0 60px rgba(255,0,255,0.3)' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute h-36 w-36 rounded-full border border-dashed"
              style={{ borderColor: 'rgba(160,32,240,0.5)', boxShadow: '0 0 20px rgba(160,32,240,0.3)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
