'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getWalletStateIfConnected, type Web3State } from '@/utils/web3';
import { fetchUserNFTs } from '@/utils/api';
import { getDemoTokenIdsForAddress } from '@/lib/demo-mint';
import WalletConnectButton from '@/components/WalletConnectButton';
import { getNomadById } from '@/data/nomads';
import type { NomadRarity } from '@/data/nomads';

const RARITY_COLORS: Record<NomadRarity, string> = {
  Common: 'bg-slate-500/90 text-slate-100 border-slate-400/50',
  Rare: 'bg-blue-600/90 text-blue-100 border-blue-400/50',
  Epic: 'bg-purple-600/90 text-purple-100 border-purple-400/50',
  Legendary: 'bg-amber-500/90 text-amber-100 border-amber-400/50',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

/** Canonical path for NFT thumb: same as data/nomads. File lives at public/nfts/thumbs/nomad-0001.png */
function nftThumbPath(id: number): string {
  return `/nfts/thumbs/nomad-${String(id).padStart(4, '0')}.png`;
}

/** Fallback image when PNG is missing: unique avatar per token so the minted NFT shows a distinct image */
function nftFallbackImageUrl(tokenId: string): string {
  return `https://api.dicebear.com/7.x/identicon/png?seed=nebula-nomad-${tokenId}&size=300`;
}

/** Inline SVG placeholder: always visible so the minted NFT card shows an image even without a PNG file */
function NomadPlaceholderSvg({ name, tokenId }: { name: string; tokenId: string }) {
  const shortName = name.length > 20 ? name.slice(0, 18) + '…' : name;
  const gradId = `profile-grad-${tokenId}`;
  return (
    <svg
      className="h-full w-full object-cover"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill={`url(#${gradId})`} />
      <circle cx="150" cy="110" r="45" fill="white" opacity="0.2" />
      <text x="150" y="185" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13" fontFamily="system-ui, sans-serif" fontWeight="600">
        {shortName}
      </text>
      <text x="150" y="208" textAnchor="middle" fill="rgba(6,182,212,0.95)" fontSize="12" fontFamily="monospace" fontWeight="500">
        #{tokenId}
      </text>
    </svg>
  );
}

/** Single NFT card: exact minted NFT with canonical image path and guaranteed visible fallback */
function ProfileNomadCard({
  tokenId,
  nomad,
  rarity,
  rarityColors,
}: {
  tokenId: string;
  nomad: { id: number; name: string; ability?: string } | undefined;
  rarity: import('@/data/nomads').NomadRarity;
  rarityColors: Record<import('@/data/nomads').NomadRarity, string>;
}) {
  const [imageError, setImageError] = useState(false);
  const displayName = nomad?.name ?? `Nomad #${tokenId}`;
  const id = nomad?.id ?? parseInt(tokenId, 10);
  const imageSrc = Number.isFinite(id) ? nftThumbPath(id) : '';
  const showRealImage = nomad && imageSrc && !imageError;

  return (
    <div className="group block overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/40 transition-all duration-300 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]">
      <Link href={`/nomads/${tokenId}`} className="block">
        <div
          className="relative w-full overflow-hidden bg-slate-900"
          style={{ aspectRatio: '1', minHeight: 200 }}
        >
          {/* SVG placeholder (backdrop when no image loads) */}
          <div className="absolute inset-0 h-full w-full" style={{ minHeight: 200 }} aria-hidden>
            <NomadPlaceholderSvg name={displayName} tokenId={tokenId} />
          </div>
          {/* Try real PNG first: add nomad-0001.png to public/nfts/thumbs/ for your actual NFT art */}
          {showRealImage && (
            <img
              src={imageSrc}
              alt={displayName}
              className="absolute inset-0 z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              width={300}
              height={300}
              onError={() => setImageError(true)}
            />
          )}
          {/* When PNG is missing: unique identicon per token so the minted NFT shows an image */}
          {imageError && (
            <img
              src={nftFallbackImageUrl(tokenId)}
              alt={displayName}
              className="absolute inset-0 z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              width={300}
              height={300}
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <span
            className={`absolute top-2 left-2 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${rarityColors[rarity]}`}
          >
            {rarity}
          </span>
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-medium text-white">{displayName}</p>
          {nomad?.ability && (
            <p className="mt-0.5 truncate text-xs text-slate-400" title={nomad.ability}>
              {nomad.ability}
            </p>
          )}
        </div>
      </Link>
      <div className="mt-2 flex gap-3 px-3 pb-3 text-xs">
        <Link href={`/nomads/${tokenId}`} className="text-neon-cyan/90 hover:underline">
          View
        </Link>
        <Link href={`/ar-viewer?tokenId=${tokenId}`} className="text-neon-purple/90 hover:underline">
          AR
        </Link>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [walletState, setWalletState] = useState<Web3State | null>(null);
  const [nfts, setNfts] = useState<{ tokenId: string; metadata?: unknown }[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync wallet state on mount and when user connects (e.g. from header or this page)
  useEffect(() => {
    let cancelled = false;
    function updateState(s: Web3State) {
      if (!cancelled) setWalletState(s);
    }
    getWalletStateIfConnected().then(updateState);
    // Retry once after a short delay in case provider wasn't ready on first paint
    const t = setTimeout(() => {
      getWalletStateIfConnected().then(updateState);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // Listen for account changes (e.g. user connected in header or switched wallet)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const provider = window.ethereum as Window['ethereum'] & {
      on?: (event: string, cb: (accounts: string[]) => void) => void;
      removeListener?: (event: string, cb: (accounts: string[]) => void) => void;
    };
    if (!provider.on) return;
    const handleAccounts = () => {
      getWalletStateIfConnected().then((s) => setWalletState(s));
    };
    provider.on('accountsChanged', handleAccounts);
    return () => {
      provider.removeListener?.('accountsChanged', handleAccounts);
    };
  }, []);

  const isDemoMode =
    typeof process !== 'undefined' &&
    (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000');

  // Load minted NFTs when wallet is connected (demo: from localStorage; otherwise from API)
  useEffect(() => {
    if (!walletState?.account) {
      setNfts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (isDemoMode) {
      const tokenIds = getDemoTokenIdsForAddress(walletState.account);
      const list = tokenIds.map((tokenId) => ({ tokenId, metadata: { name: `Nomad #${tokenId}` } }));
      setNfts(list);
      setLoading(false);
    } else {
      fetchUserNFTs(walletState.account)
        .then(setNfts)
        .finally(() => setLoading(false));
    }
  }, [walletState?.account, isDemoMode]);

  // Fallback: if connected in demo mode and nfts still empty, re-read from localStorage (e.g. after navigation)
  useEffect(() => {
    if (!walletState?.account || !isDemoMode || nfts.length > 0) return;
    const tokenIds = getDemoTokenIdsForAddress(walletState.account);
    if (tokenIds.length > 0) {
      setNfts(tokenIds.map((tokenId) => ({ tokenId, metadata: { name: `Nomad #${tokenId}` } })));
    }
  }, [walletState?.account, isDemoMode, nfts.length]);

  const isConnected = !!walletState?.account;
  const shortAddress = walletState?.account
    ? `${walletState.account.slice(0, 6)}…${walletState.account.slice(-4)}`
    : '';

  // Rarity breakdown for stats
  const rarityCounts = isConnected && nfts.length > 0
    ? nfts.reduce(
        (acc, n) => {
          const id = parseInt(n.tokenId, 10);
          const nomad = Number.isFinite(id) ? getNomadById(id) : undefined;
          const r = nomad?.rarity ?? 'Common';
          acc[r] = (acc[r] ?? 0) + 1;
          return acc;
        },
        {} as Record<NomadRarity, number>
      )
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        {/* Hero: single title, no duplicate wallet button — header has the only Connect Wallet when needed */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h1
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
            style={{ textShadow: '0 0 40px rgba(160,32,240,0.5), 0 0 80px rgba(0,255,255,0.2)' }}
          >
            Your Profile
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            {isConnected ? 'Your Nebula Nomads collection and stats' : 'Connect your wallet to see your NFTs'}
          </p>
        </motion.header>

        {!isConnected ? (
          /* Single connect CTA: only inside the card — no second button next to title */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl border border-neon-cyan/30 bg-gradient-to-b from-[#0d0220]/95 to-[#050010]/95 p-10 sm:p-14 text-center shadow-[0_0_60px_rgba(0,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,255,255,0.06),transparent)]" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-cyan/40 bg-neon-cyan/10 text-4xl shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                ✦
              </div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                See your collection
              </h2>
              <p className="mt-2 max-w-md mx-auto text-slate-400 text-sm">
                Connect your wallet to view all Nebula Nomads you own. One place for your NFTs, stats, and quick actions.
              </p>
              <div className="mt-8">
                <WalletConnectButton onConnect={setWalletState} displayState={walletState} />
              </div>
              <div className="mt-8 pt-8 border-t border-slate-700/60">
                <Link
                  href="/explore"
                  className="text-neon-cyan/90 hover:text-neon-cyan text-sm font-medium transition hover:underline"
                >
                  Explore all 30 Nomads →
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Single wallet summary: compact read-only bar (not a second Connect pill) */}
            <motion.section
              variants={container}
              initial="hidden"
              animate="show"
              className="rounded-2xl border border-slate-700/60 bg-slate-900/40 px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon-purple/40 bg-neon-purple/10 text-lg">
                    👤
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-slate-500">Wallet</p>
                    <p className="font-mono text-sm font-medium text-white">{shortAddress}</p>
                  </div>
                </div>
                {walletState?.balance != null && (
                  <div className="border-l border-slate-700/80 pl-6">
                    <p className="text-[11px] uppercase tracking-widest text-slate-500">Balance</p>
                    <p className="font-mono text-sm text-neon-cyan">{walletState.balance || '0'} ETH</p>
                  </div>
                )}
                <div className="border-l border-slate-700/80 pl-6">
                  <p className="text-[11px] uppercase tracking-widest text-slate-500">Nomads</p>
                  <p className="font-mono text-lg font-semibold text-white">{nfts.length}</p>
                </div>
              </div>
            </motion.section>

            {/* Stats row when user has NFTs */}
            {rarityCounts && Object.keys(rarityCounts).length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {(['Common', 'Rare', 'Epic', 'Legendary'] as const).map((r) => {
                  const count = rarityCounts[r] ?? 0;
                  if (count === 0) return null;
                  return (
                    <motion.div
                      key={r}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-xl border border-slate-700/60 bg-slate-900/30 px-4 py-3 text-center"
                    >
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{r}</p>
                      <p className="mt-0.5 font-mono text-xl font-bold text-white">{count}</p>
                    </motion.div>
                  );
                })}
              </motion.section>
            )}

            {/* Your collection */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2
                    className="text-xl font-bold text-white sm:text-2xl"
                    style={{ textShadow: '0 0 20px rgba(0,255,255,0.4)' }}
                  >
                    Your collection
                  </h2>
                  {isDemoMode && nfts.length > 0 && (
                    <p className="mt-1 text-xs text-amber-400/90">
                      Demo mode — showing NFTs from your local mints. Set contract + RPC for on-chain NFTs.
                    </p>
                  )}
                </div>
                {nfts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/mint"
                      className="rounded-lg border border-neon-cyan/50 px-4 py-2 text-sm font-medium text-neon-cyan transition hover:bg-neon-cyan/10 hover:border-neon-cyan/70"
                    >
                      Mint more
                    </Link>
                    <Link
                      href="/dashboard"
                      className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/metaverse"
                      className="rounded-lg border border-neon-purple/50 px-4 py-2 text-sm text-neon-purple transition hover:bg-neon-purple/10"
                    >
                      Metaverse
                    </Link>
                  </div>
                )}
              </div>

              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/30 py-16"
                >
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-neon-cyan/50 border-t-neon-cyan" />
                  <p className="mt-4 text-slate-400">Loading your NFTs…</p>
                </motion.div>
              ) : nfts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/20 p-12 text-center"
                >
                  <p className="text-slate-400 mb-6">No Nomads in this wallet yet.</p>
                  <Link
                    href="/mint"
                    className="inline-flex items-center gap-2 rounded-xl border border-neon-cyan/50 bg-neon-cyan/10 px-5 py-2.5 text-neon-cyan font-medium transition hover:bg-neon-cyan/20 hover:border-neon-cyan/70"
                  >
                    Mint your first Nomad
                  </Link>
                  <p className="mt-6">
                    <Link href="/explore" className="text-slate-500 hover:text-neon-cyan text-sm transition">
                      Explore collection →
                    </Link>
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {nfts.map((n) => {
                    const id = parseInt(n.tokenId, 10);
                    const nomad = Number.isFinite(id) ? getNomadById(id) : undefined;
                    const rarity = nomad?.rarity ?? 'Common';
                    return (
                      <div key={n.tokenId}>
                        <ProfileNomadCard
                          tokenId={n.tokenId}
                          nomad={nomad ?? undefined}
                          rarity={rarity}
                          rarityColors={RARITY_COLORS}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          </>
        )}
      </motion.div>
    </div>
  );
}
