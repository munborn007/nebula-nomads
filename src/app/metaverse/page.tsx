'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MetaverseProvider } from '@/lib/metaverse-state';
import MetaverseHUD from '@/components/metaverse/MetaverseHUD';
import GameHUD from '@/components/metaverse/GameHUD';
import BattleArena from '@/components/metaverse/BattleArena';
import StakingPod from '@/components/metaverse/StakingPod';
import AIGenerator from '@/components/metaverse/AIGenerator';
import OnboardingTeaser from '@/components/metaverse/OnboardingTeaser';
import QuestPanel from '@/components/metaverse/QuestPanel';
import MarketplaceStall from '@/components/metaverse/MarketplaceStall';
import LeaderboardPanel from '@/components/metaverse/LeaderboardPanel';
import EventScheduler from '@/components/metaverse/EventScheduler';
import ShareButton from '@/components/metaverse/ShareButton';
import { useGameStore } from '@/lib/game-state';
import { fetchUserNFTs } from '@/utils/api';
import { getWalletStateIfConnected } from '@/utils/web3';
import { getNomadById } from '@/data/nomads';

/** Game scene: avatars, WASD, shards, abilities. */
const GameScene = dynamic(
  () => import('@/components/three/GameScene'),
  { ssr: false, loading: () => <div className="w-full h-[500px] sm:h-[600px] rounded-2xl bg-slate-900/50 flex items-center justify-center text-slate-400">Loading game...</div> }
);

export default function MetaversePage() {
  const [ownedNomadIds, setOwnedNomadIds] = useState<number[]>([]);
  const setNomad = useGameStore((s) => s.setNomad);

  useEffect(() => {
    getWalletStateIfConnected().then((s) => {
      if (!s?.account) {
        setNomad(0, 'Phase Shift', 'Cosmic Blade');
        setOwnedNomadIds([]);
        return;
      }
      fetchUserNFTs(s.account).then((nfts) => {
        const ids = nfts.map((n) => parseInt(String(n.tokenId), 10)).filter((id) => id >= 1 && id <= 30);
        setOwnedNomadIds(ids);
        if (ids.length > 0) {
          const nomad = getNomadById(ids[0]);
          if (nomad) setNomad(nomad.id, nomad.ability ?? 'Phase Shift', nomad.weapon ?? 'Cosmic Blade', nomad.rarity);
        } else setNomad(0, 'Phase Shift', 'Cosmic Blade');
      });
    });
  }, [setNomad]);
  return (
    <MetaverseProvider>
      <div className="relative min-h-screen">
        {/* Hero + 3D canvas */}
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-8">
          <OnboardingTeaser />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1
              className="font-display text-3xl font-bold text-white sm:text-4xl"
              style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
            >
              Nebula Metaverse
            </h1>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
              Play as your Nomad — WASD, Q/E/R abilities, collect shards, complete quests, battle, stake. Levels 1–50, daily bonus, share to Twitter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="relative rounded-2xl overflow-hidden border border-neon-cyan/30 futuristic-panel"
          >
            <Suspense fallback={<div className="w-full h-[500px] sm:h-[600px] rounded-2xl bg-slate-900/50 flex items-center justify-center text-slate-400">Loading game...</div>}>
              <GameScene className="block" ownedNomadIds={ownedNomadIds} />
            </Suspense>
            <GameHUD />
            <MetaverseHUD />
          </motion.div>

          {/* Zone cards — mint, staking, battle, events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <Link href="/mint" className="holo-card rounded-xl p-4 text-center hover:shadow-[0_0_30px_rgba(160,32,240,0.4)] transition">
              <span className="text-2xl">✦</span>
              <p className="mt-2 font-medium text-neon-cyan">Mint Zone</p>
              <p className="text-xs text-slate-500 mt-1">Mint Nomads</p>
            </Link>
            <Link href="/dashboard" className="holo-card rounded-xl p-4 text-center hover:shadow-[0_0_30px_rgba(160,32,240,0.4)] transition">
              <span className="text-2xl">🔒</span>
              <p className="mt-2 font-medium text-neon-purple">Staking Vault</p>
              <p className="text-xs text-slate-500 mt-1">Lock NFTs, earn</p>
            </Link>
            <div className="holo-card rounded-xl p-4 text-center opacity-80">
              <span className="text-2xl">⚔</span>
              <p className="mt-2 font-medium text-neon-orange">Battle Arena</p>
              <p className="text-xs text-slate-500 mt-1">Coming Q3 2026</p>
            </div>
            <EventScheduler />
          </motion.div>

          {/* Battle Arena + Staking Pod */}
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <BattleArena />
            <StakingPod />
          </div>

          {/* Quests + Marketplace + Leaderboard */}
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            <QuestPanel />
            <MarketplaceStall />
            <LeaderboardPanel />
          </div>

          {/* AI Zone Generator */}
          <div className="mt-8">
            <AIGenerator />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 items-center">
            <ShareButton />
            <Link href="/ar-viewer" className="holo-card rounded-xl px-6 py-3 text-neon-cyan hover:text-white transition">
              View in AR
            </Link>
            <Link href="/explore" className="futuristic-panel rounded-xl px-6 py-3 text-slate-300 hover:text-neon-cyan transition">
              Explore Nomads
            </Link>
            <Link href="/dashboard" className="futuristic-panel rounded-xl px-6 py-3 text-slate-300 hover:text-neon-cyan transition">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </MetaverseProvider>
  );
}
