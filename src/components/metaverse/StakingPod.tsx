'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMetaverse } from '@/lib/metaverse-state';
import { useGameStore } from '@/lib/game-state';

/** Staking vault — lock Nomads in pods, earn NEBULA yield. Claim adds shards to game store. On-chain when staking contract is live. */
export default function StakingPod() {
  const { stakedCount } = useMetaverse();
  const { addShards } = useGameStore();
  const [pendingYield, setPendingYield] = useState(0);

  // Simulated yield: ~12.5% APY → ~0.0004% per second
  useEffect(() => {
    const staked = Math.max(0, stakedCount);
    if (staked === 0) return;
    const t = setInterval(() => {
      setPendingYield((p) => p + staked * 0.000004);
    }, 1000);
    return () => clearInterval(t);
  }, [stakedCount]);

  const handleClaim = () => {
    const toClaim = Math.floor(pendingYield);
    if (toClaim > 0) {
      addShards(toClaim);
      setPendingYield(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="holo-card rounded-2xl p-6 border border-neon-purple/30"
    >
      <h2 className="text-lg font-bold text-neon-purple mb-2">Staking Pod</h2>
      <p className="text-slate-400 text-sm mb-4">
        Lock Nomads in nebula pods — passive NEBULA yield. Rarity boosts APY. Claim shards below.
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
        <div>
          <span className="text-slate-500">Pending</span>
          <p className="text-neon-purple font-mono">{Math.floor(pendingYield)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleClaim}
          disabled={Math.floor(pendingYield) <= 0}
          className="rounded-lg border border-neon-purple/50 bg-neon-purple/10 px-4 py-2 text-sm text-neon-purple hover:bg-neon-purple/20 disabled:opacity-50"
        >
          Claim yield
        </button>
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg border border-slate-500 px-4 py-2 text-sm text-slate-400 hover:text-white"
        >
          Dashboard
        </Link>
      </div>
    </motion.div>
  );
}
