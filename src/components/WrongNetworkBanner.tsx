'use client';

import { useState, useEffect } from 'react';
import { getWalletStateIfConnected } from '@/utils/web3';

const SEPOLIA_CHAIN_ID = 11155111;
const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ZERO_ADDR;

/**
 * When contract is set and user is connected on wrong network (e.g. mainnet instead of Sepolia),
 * show a dismissible banner with "Switch to Sepolia" CTA.
 */
export default function WrongNetworkBanner() {
  const [show, setShow] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === ZERO_ADDR) return;
    getWalletStateIfConnected().then((state) => {
      if (state.account && state.chainId !== null && state.chainId !== SEPOLIA_CHAIN_ID) {
        setChainId(state.chainId);
        setShow(true);
      }
    });
  }, []);

  const switchToSepolia = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    try {
      await (window.ethereum as { request: (args: unknown) => Promise<unknown> }).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
      setShow(false);
    } catch {
      // User rejected or chain not added; could prompt to add Sepolia
    }
  };

  if (!show) return null;

  return (
    <div
      className="relative z-[100] flex flex-wrap items-center justify-center gap-3 bg-amber-500/20 border-b border-amber-500/50 px-4 py-2.5 text-sm text-amber-200"
      role="alert"
    >
      <span>
        Wrong network (chain ID: {chainId}). Mint and buy work on <strong>Sepolia</strong>.
      </span>
      <button
        type="button"
        onClick={switchToSepolia}
        className="rounded-lg bg-amber-500/80 px-3 py-1.5 font-semibold text-black hover:bg-amber-400 transition"
      >
        Switch to Sepolia
      </button>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="text-amber-300/80 hover:text-amber-200 ml-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
