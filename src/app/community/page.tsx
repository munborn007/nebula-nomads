'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchUserNFTs } from '@/utils/api';
import { getWalletStateIfConnected, type Web3State } from '@/utils/web3';
import WalletConnectButton from '@/components/WalletConnectButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getNomadRarityFromWallet, type NomadRarity } from '@/lib/utils';

const NomadARViewer = dynamic(() => import('@/components/NomadARViewer'), { 
  ssr: false,
  loading: () => <div className="min-h-[200px] flex items-center justify-center text-slate-500">Loading...</div>,
});

const TWITTER_URL = 'https://x.com/NomadsOfNebula';

const SOCIAL = [
  { label: 'Discord', href: 'https://discord.gg/nebula-nomads', icon: 'Discord' },
];

export default function CommunityPage() {
  const [walletState, setWalletState] = useState<Web3State | null>(null);
  const [nfts, setNfts] = useState<{ tokenId: string; metadata?: unknown }[]>([]);

  useEffect(() => {
    getWalletStateIfConnected().then((s) => {
      if (s.account) setWalletState(s);
    });
  }, []);

  useEffect(() => {
    if (walletState?.account) {
      fetchUserNFTs(walletState.account).then(setNfts);
    } else {
      setNfts([]);
    }
  }, [walletState?.account]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
        style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
      >
        Community
      </motion.h1>

      {/* Prominent Join on X card */}
      <motion.a
        href={TWITTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="holo-card mx-auto mt-10 block max-w-xl rounded-2xl px-8 py-6 text-center transition hover:shadow-[0_0_50px_rgba(160,32,240,0.5),0_0_80px_rgba(0,255,255,0.2)]"
      >
        <span className="text-3xl" style={{ textShadow: '0 0 20px rgba(0,255,255,0.9)' }}>𝕏</span>
        <p className="mt-2 font-bold text-white" style={{ textShadow: '0 0 15px rgba(160,32,240,0.6)' }}>
          Join the Conversation on X
        </p>
        <p className="mt-1 text-neon-cyan">@NomadsOfNebula</p>
      </motion.a>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-10 flex flex-wrap justify-center gap-6"
      >
        {SOCIAL.map((s) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="holo-card rounded-xl px-6 py-4 text-white transition hover:shadow-[0_0_30px_rgba(160,32,240,0.5)]"
          >
            {s.icon} {s.label}
          </motion.a>
        ))}
      </motion.section>

      {walletState?.account && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 rounded-2xl holo-card p-6"
        >
          <h2 className="mb-4 font-semibold text-white">Your Nomads</h2>
          <div className="mb-4">
            <WalletConnectButton onConnect={setWalletState} displayState={walletState} />
          </div>
          {/* Mini AR viewer: personalized by wallet rarity */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-slate-300">AR Nomad Preview</h3>
            <ErrorBoundary>
              <NomadARViewer
                rarity={getNomadRarityFromWallet(walletState.account) as NomadRarity}
                compact
                className="min-h-[200px]"
              />
            </ErrorBoundary>
          </div>
          <ul className="space-y-2">
            {nfts.map((nft) => (
              <li
                key={nft.tokenId}
                className="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-2"
              >
                <span className="text-slate-300">{(nft.metadata as { name?: string })?.name ?? `#${nft.tokenId}`}</span>
                <button
                  type="button"
                  className="rounded border border-neon-purple bg-neon-purple/40 px-3 py-1 text-sm text-white hover:shadow-[0_0_15px_rgba(160,32,240,0.5)]"
                >
                  Evolve Trait
                </button>
              </li>
            ))}
          </ul>
          {nfts.length === 0 && (
            <p className="text-slate-500">No Nomads in this wallet yet. Mint on the Mint page.</p>
          )}
        </motion.section>
      )}

      {!walletState?.account && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center gap-3 rounded-2xl holo-card p-6"
        >
          <p className="text-center text-slate-400">Connect your wallet to see your Nomads.</p>
          <WalletConnectButton onConnect={setWalletState} displayState={walletState} />
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10 rounded-xl holo-card p-6"
      >
        <h3 className="font-medium text-white">Discord / Forum</h3>
        <p className="mt-2 text-slate-400">Join the conversation. Discord widget placeholder.</p>
      </motion.section>
    </div>
  );
}
