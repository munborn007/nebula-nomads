'use client';

import Link from 'next/link';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ZERO_ADDR;

/**
 * Shows a "Live on Sepolia" badge in the header when the contract is configured.
 * Builds trust and signals that real minting is available.
 */
export default function LiveOnSepoliaBadge() {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === ZERO_ADDR) return null;

  return (
    <Link
      href="/mint"
      className="live-on-sepolia-badge hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/70 hover:bg-emerald-500/20"
      title="Minting is live on Sepolia testnet"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Live on Sepolia
    </Link>
  );
}
