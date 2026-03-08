'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMetaverse } from '@/lib/metaverse-state';

/** Staking vault zone — lock NFTs in nebula pods, animated yields. */
export default function StakingPod() {
  const { stakedCount } = useMetaverse();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="holo-card rounded-2xl p-6 border border-neon-purple/30"
    >
      <h2 className="text-lg font-bold text-neon-purple mb-2">Staking Pod</h2>
      <p className="text-slate-400 text-sm mb-4">
        Lock Nomads in nebula pods — passive ETH/points. Animated energy crystals. Rarity boosts yield.
      </p>
      <div className="flex gap-4 text-sm mb-4">
        <div>
          <span className="text-slate-500">APY</span>
          <p className="text-neon-cyan font-mono">12.5%</p>
        </div>
        <div>
          <span className="text-slate-500">Staked</span>
          <p className="text-white font-mono">{stakedCount}</p>
        </div>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex rounded-lg border border-neon-purple/50 bg-neon-purple/10 px-4 py-2 text-sm text-neon-purple hover:bg-neon-purple/20"
      >
        Go to Dashboard
      </Link>
    </motion.div>
  );
}
