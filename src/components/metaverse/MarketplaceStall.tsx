'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-state';
import Link from 'next/link';

/** In-world marketplace: trade shards for upgrades, link to NFT market. On-chain swaps via contract when live. */
export default function MarketplaceStall() {
  const { shards, level, addShards } = useGameStore();
  const [tab, setTab] = useState<'upgrades' | 'nfts'>('upgrades');

  const upgrades = [
    { id: 'aura', name: 'Level 2 Aura', cost: 50, minLevel: 2, desc: 'Unlock glow effect in 3D' },
    { id: 'trail', name: 'Level 4 Trail', cost: 120, minLevel: 4, desc: 'Cosmic trail behind avatar' },
    { id: 'zone', name: 'Level 6 Zone Pass', cost: 200, minLevel: 6, desc: 'Access AI-generated zones' },
    { id: 'skin', name: 'Level 10 Skin', cost: 350, minLevel: 10, desc: 'Legendary aura trail' },
  ];

  const handlePurchase = (cost: number, _id: string) => {
    if (shards < cost) return;
    useGameStore.setState((s) => ({ shards: Math.max(0, s.shards - cost) }));
    // In production: contract call to burn shards + grant upgrade
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-card rounded-2xl p-6 border border-neon-cyan/30"
    >
      <h2 className="text-lg font-bold text-neon-cyan mb-2">Marketplace</h2>
      <p className="text-slate-400 text-sm mb-4">
        Spend shards on progression unlocks. NFT trades on OpenSea when connected.
      </p>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTab('upgrades')}
          className={`rounded-lg px-3 py-1.5 text-sm ${tab === 'upgrades' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          Upgrades
        </button>
        <button
          type="button"
          onClick={() => setTab('nfts')}
          className={`rounded-lg px-3 py-1.5 text-sm ${tab === 'nfts' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          NFTs
        </button>
      </div>
      {tab === 'upgrades' && (
        <ul className="space-y-3">
          {upgrades.map((u) => {
            const canBuy = shards >= u.cost && level >= u.minLevel;
            const locked = level < u.minLevel;
            return (
              <li key={u.id} className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2">
                <div>
                  <p className="text-white font-medium">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neon-cyan font-mono text-sm">{u.cost} shards</span>
                  {locked ? (
                    <span className="text-xs text-slate-500">Lv{u.minLevel}+</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePurchase(u.cost, u.id)}
                      disabled={!canBuy}
                      className="rounded border border-neon-cyan/50 px-2 py-1 text-xs text-neon-cyan disabled:opacity-50"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {tab === 'nfts' && (
        <div className="space-y-2">
          <p className="text-slate-400 text-sm">
            List/sell Nomad NFTs in-world. On-chain via contract when live.
          </p>
          <div className="rounded-lg bg-black/30 px-3 py-2 text-xs text-slate-500">
            List for sale • Min price (NEBULA) • Fee 2.5%
          </div>
          <Link href="/explore" className="inline-block text-neon-cyan text-sm hover:underline">OpenSea →</Link>
        </div>
      )}
      <Link href="/explore" className="mt-4 inline-block text-sm text-neon-cyan hover:underline">
        Explore Nomads →
      </Link>
    </motion.div>
  );
}
