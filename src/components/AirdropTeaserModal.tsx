'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'nebula-airdrop-teaser-seen';

export default function AirdropTeaserModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
  };

  // Show modal on first visit (localStorage) or when triggered via button
  useEffect(() => {
    if (!mounted || open) return;
    const seen = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(t);
    }
  }, [mounted, open]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs text-neon-cyan/80 hover:text-neon-cyan transition"
        aria-label="Airdrop teaser"
      >
        ✦ Airdrop
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="holo-modal rounded-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
              <h3
                className="text-xl font-bold text-neon-cyan"
                style={{ textShadow: '0 0 20px rgba(0,255,255,0.6)' }}
              >
                Airdrop Coming
              </h3>
              <p className="mt-3 text-slate-400 text-sm">
                Hold Nebula Nomads to qualify for our upcoming airdrop. Join our Discord and follow on X for announcements.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://x.com/NomadsOfNebula"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2 text-center text-sm text-neon-cyan hover:bg-neon-cyan/20"
                >
                  Follow on X
                </a>
                <a
                  href="https://discord.gg/nebula-nomads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg border border-neon-purple/50 bg-neon-purple/10 px-4 py-2 text-center text-sm text-neon-purple hover:bg-neon-purple/20"
                >
                  Join Discord
                </a>
              </div>
              <p className="mt-4 text-xs text-slate-500">Connect your wallet and mint Nomads to participate.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
