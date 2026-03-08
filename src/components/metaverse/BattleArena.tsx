'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/** Battle Arena zone card — P2E physics-based combat placeholder. */
export default function BattleArena() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-card rounded-2xl p-6 border border-neon-orange/30"
    >
      <h2 className="text-lg font-bold text-neon-orange mb-2">Battle Arena</h2>
      <p className="text-slate-400 text-sm mb-4">
        P2E battles — physics-based combat using Nomad abilities. Wager ETH/NFTs. Coming Q3 2026.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/explore"
          className="rounded-lg border border-neon-orange/50 bg-neon-orange/10 px-4 py-2 text-sm text-neon-orange hover:bg-neon-orange/20"
        >
          Pick Nomad
        </Link>
        <span className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-500">
          Arena: Closed
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">Connect wallet to enter when live.</p>
    </motion.div>
  );
}
