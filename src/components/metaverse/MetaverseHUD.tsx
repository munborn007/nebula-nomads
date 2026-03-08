'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchUserNFTs } from '@/utils/api';
import { getWalletStateIfConnected } from '@/utils/web3';
import { useMetaverse } from '@/lib/metaverse-state';
import { useMultiplayerSim } from '@/lib/colyseus-client';
import WalletConnectButton from '@/components/WalletConnectButton';

/** Holographic HUD overlay — stats, minimap, chat toggle, zone info. */
export default function MetaverseHUD() {
  const { zone, hudVisible, chatOpen, setChatOpen, ownedCount, setOwnedCount, stakedCount } = useMetaverse();
  const { userCount } = useMultiplayerSim();
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    getWalletStateIfConnected().then((s) => {
      if (s?.account) setAccount(s.account);
    });
  }, []);

  useEffect(() => {
    if (account) {
      fetchUserNFTs(account).then((nfts) => setOwnedCount(nfts.length));
    }
  }, [account, setOwnedCount]);

  if (!hudVisible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-between p-4 sm:p-6">
      {/* Bottom-left: stats */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="holo-card rounded-xl px-4 py-3 pointer-events-auto"
      >
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-slate-500">Owned</span>
            <p className="text-neon-cyan font-mono text-lg">{ownedCount}</p>
          </div>
          <div>
            <span className="text-slate-500">Staked</span>
            <p className="text-neon-purple font-mono text-lg">{stakedCount}</p>
          </div>
          <div>
            <span className="text-slate-500">Zone</span>
            <p className="text-white font-mono text-sm">{zone ?? 'Nexus'}</p>
          </div>
          <div>
            <span className="text-slate-500">Online</span>
            <p className="text-neon-cyan font-mono text-sm">{userCount}</p>
          </div>
        </div>
      </motion.div>

      {/* Bottom-right: actions */}
      <div className="flex flex-col gap-2 items-end pointer-events-auto">
        <WalletConnectButton />
        <button
          type="button"
          onClick={() => setChatOpen(!chatOpen)}
          className="holo-card rounded-lg px-4 py-2 text-sm text-neon-cyan hover:bg-neon-cyan/10 transition"
        >
          {chatOpen ? 'Close Chat' : 'Chat'}
        </button>
        <Link
          href="/ar-viewer"
          className="holo-card rounded-lg px-4 py-2 text-sm text-neon-cyan hover:bg-neon-cyan/10 transition"
        >
          View in AR
        </Link>
        <Link href="/mint" className="futuristic-panel rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-neon-cyan transition">
          Mint
        </Link>
        <button
          type="button"
          onClick={() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
              const dataUrl = canvas.toDataURL('image/png');
              const w = window.open('', '_blank');
              if (w) {
                w.document.write(`<img src="${dataUrl}" alt="Nebula Metaverse" style="max-width:100%"/>`);
                w.document.title = 'Nebula Nomads Metaverse';
              }
            }
          }}
          className="futuristic-panel rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-neon-cyan transition"
        >
          📸 Share
        </button>
      </div>

      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-24 left-4 right-4 sm:left-auto sm:right-24 sm:w-72 holo-modal rounded-xl p-4 pointer-events-auto"
        >
          <p className="text-xs text-slate-500 mb-2">Multiplayer chat — coming soon</p>
          <p className="text-slate-400 text-sm">Connect wallet and join Discord for live updates.</p>
        </motion.div>
      )}
    </div>
  );
}
