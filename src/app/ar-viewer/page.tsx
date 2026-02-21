'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HoloButton from '@/components/HoloButton';
import WalletConnectButton from '@/components/WalletConnectButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getNomadRarityFromWallet, type NomadRarity } from '@/lib/utils';
import { getWalletStateIfConnected, type Web3State } from '@/utils/web3';

const NomadARViewer = dynamic(() => import('@/components/NomadARViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-neon-cyan/80">Loading AR Viewer...</p>
    </div>
  ),
});

export default function ARViewerPage() {
  const [rarity, setRarity] = useState<NomadRarity>('common');
  const [walletState, setWalletState] = useState<Web3State | null>(null);

  useEffect(() => {
    getWalletStateIfConnected().then((s) => {
      if (s.account) setWalletState(s);
    });
  }, []);

  useEffect(() => {
    if (walletState?.account) {
      setRarity(getNomadRarityFromWallet(walletState.account));
    } else {
      setRarity('common');
    }
  }, [walletState?.account]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <NomadARViewer rarity={rarity} className="min-h-screen" />
        </ErrorBoundary>
      </div>
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between p-4 pt-20">
        {/* Holo personalization card with wallet + rarity */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="holo-card flex flex-wrap items-center justify-center gap-3 rounded-xl px-5 py-3 animate-float"
          style={{ boxShadow: '0 0 40px rgba(160,32,240,0.3)' }}
        >
          <span className="text-sm text-slate-300">Personalize with wallet:</span>
          <WalletConnectButton onConnect={setWalletState} displayState={walletState} />
          {walletState?.account && (
            <span
              className="text-xs font-medium capitalize"
              style={{ color: '#00ffff', textShadow: '0 0 10px rgba(0,255,255,0.6)' }}
            >
              Rarity: {rarity}
            </span>
          )}
        </motion.div>
        <Link href="/">
          <HoloButton variant="cyan" size="sm" pulse={false}>
            ← Back
          </HoloButton>
        </Link>
      </div>
    </div>
  );
}
