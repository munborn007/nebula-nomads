'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/** Immersive onboarding teaser — guided tour, referral hint. */
export default function OnboardingTeaser() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="holo-card rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm text-neon-cyan font-medium">Welcome to Nebula Nexus</p>
          <p className="text-xs text-slate-400 mt-1">
            Explore zones, connect wallet for owned Nomads. Invite friends for bonus shards.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/explore"
            className="rounded-lg border border-neon-cyan/50 px-3 py-1.5 text-xs text-neon-cyan hover:bg-neon-cyan/10"
          >
            Explore
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
