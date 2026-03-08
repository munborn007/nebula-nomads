'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchUserNFTs } from '@/utils/api';
import { getWalletStateIfConnected, type Web3State } from '@/utils/web3';
import WalletConnectButton from '@/components/WalletConnectButton';
import HoloButton from '@/components/HoloButton';
import { getNomadById } from '@/data/nomads';
import AIGeneratorForm from '@/components/AIGeneratorForm';

const Staking3DBlock = dynamic(
  () => import('@/components/three/Staking3DBlock'),
  { ssr: false }
);

/** Mock staking rewards — placeholder for on-chain integration */
const MOCK_STAKED_COUNT = 0;
const MOCK_APY = '12.5';
const MOCK_EST_DAILY = '0.00';

/** Stagger animation for grid items */
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const [walletState, setWalletState] = useState<Web3State | null>(null);
  const [nfts, setNfts] = useState<{ tokenId: string; metadata?: unknown }[]>([]);

  useEffect(() => {
    getWalletStateIfConnected().then((s) => setWalletState(s));
  }, []);

  useEffect(() => {
    if (walletState?.account) {
      fetchUserNFTs(walletState.account).then(setNfts);
    } else {
      setNfts([]);
    }
  }, [walletState?.account]);

  const isConnected = !!walletState?.account;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <h1
          className="font-display text-3xl font-bold text-white sm:text-4xl"
          style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
        >
          Dashboard
        </h1>
        {!isConnected && <WalletConnectButton />}
      </motion.div>

      {!isConnected ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="holo-card mt-10 rounded-2xl p-10 text-center"
        >
          <p className="text-slate-300">Connect your wallet to view owned Nomads, staking, and breeding.</p>
          <WalletConnectButton />
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-10 space-y-8"
        >
          {/* Owned NFTs */}
          <motion.section variants={item} className="futuristic-panel rounded-2xl p-6 data-grid-bg">
            <h2 className="text-xl font-bold text-neon-cyan mb-4" style={{ textShadow: '0 0 15px rgba(0,255,255,0.5)' }}>
              Owned Nomads
            </h2>
            {nfts.length === 0 ? (
              <p className="text-slate-400 py-6">No Nomads in this wallet yet. Mint one to get started.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {nfts.map((n, i) => {
                  const id = parseInt(n.tokenId, 10);
                  const nomad = Number.isFinite(id) ? getNomadById(id) : undefined;
                  return (
                    <motion.div key={n.tokenId} variants={item}>
                      <Link
                        href={`/nomads/${n.tokenId}`}
                        className="block nomad-card holo-card-depth rounded-xl overflow-hidden border border-neon-cyan/30 transition hover:border-neon-cyan/60"
                      >
                        <div className="aspect-square relative bg-black/40">
                          {nomad ? (
                            <img
                              src={`/api/nft-image/${nomad.id}`}
                              alt={nomad.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-neon-cyan/60 font-mono text-sm">
                              #{n.tokenId}
                            </div>
                          )}
                        </div>
                        <p className="p-2 text-center text-xs text-slate-300 truncate">{nomad?.name ?? `Nomad #${n.tokenId}`}</p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
            <div className="mt-4">
              <HoloButton href="/mint-1-20" variant="gradient" size="sm">Mint more</HoloButton>
            </div>
          </motion.section>

          {/* Staking teaser — 3D lock + stats */}
          <motion.section variants={item} className="holo-card rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40">
              <Staking3DBlock />
            </div>
            <div className="flex-1">
            <h2 className="text-xl font-bold text-neon-purple mb-2" style={{ textShadow: '0 0 15px rgba(160,32,240,0.5)' }}>
              Staking
            </h2>
            <p className="text-slate-400 text-sm mb-4">Lock Nomads to earn test rewards. (Mock data — contract integration placeholder.)</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-slate-500">Staked</span>
                <p className="text-neon-cyan font-mono text-lg">{MOCK_STAKED_COUNT}</p>
              </div>
              <div>
                <span className="text-slate-500">APY</span>
                <p className="text-neon-purple font-mono text-lg">{MOCK_APY}%</p>
              </div>
              <div>
                <span className="text-slate-500">Est. daily</span>
                <p className="text-white font-mono text-lg">{MOCK_EST_DAILY} NN</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 border border-neon-purple/30 rounded-lg px-3 py-2 inline-block">
              🔒 Staking contract coming soon. You will lock NFTs to earn test tokens.
            </p>
            </div>
          </motion.section>

          {/* Breeding teaser */}
          <motion.section variants={item} className="holo-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-neon-orange mb-2" style={{ textShadow: '0 0 15px rgba(255,69,0,0.5)' }}>
              Breeding
            </h2>
            <p className="text-slate-400 text-sm mb-4">Combine two Nomads to preview offspring. Coming Q3 2026.</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-neon-cyan/40 flex items-center justify-center text-neon-cyan/60 text-xs">Nomad A</div>
              <span className="text-neon-orange">+</span>
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-neon-cyan/40 flex items-center justify-center text-neon-cyan/60 text-xs">Nomad B</div>
              <span className="text-slate-400">→</span>
              <div className="w-16 h-16 rounded-lg border-2 border-neon-purple/50 flex items-center justify-center text-neon-purple/80 text-xs">Preview</div>
            </div>
            <p className="mt-4 text-xs text-slate-500">Select 2 owned Nomads to see a trait preview. Full breeding mechanic in development.</p>
          </motion.section>

          {/* Develop — AI custom Nomad generator */}
          <motion.section variants={item}>
            <AIGeneratorForm />
          </motion.section>
        </motion.div>
      )}
    </div>
  );
}
