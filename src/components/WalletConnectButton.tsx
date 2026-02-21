'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  connectWallet,
  connectWithProvider,
  discoverEIP6963Providers,
  formatAddress,
  type Web3State,
  type EIP6963ProviderDetail,
} from '@/utils/web3';
import { getNomadRarityFromWallet } from '@/lib/utils';

export default function WalletConnectButton({
  onConnect,
  displayState,
}: {
  onConnect?: (state: Web3State) => void;
  displayState?: Web3State | null;
}) {
  const [state, setState] = useState<Web3State>({
    account: null,
    balance: '0',
    chainId: null,
    isConnecting: false,
    error: null,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);

  const connectWith = useCallback(
    async (provider: EIP6963ProviderDetail['provider']) => {
      setState((s) => ({ ...s, isConnecting: true, error: null }));
      setShowPicker(false);
      try {
        const result = await connectWithProvider(provider);
        setState(result);
        onConnect?.(result);
      } catch (error) {
        const errorState: Web3State = {
          account: null,
          balance: '0',
          chainId: null,
          isConnecting: false,
          error: error instanceof Error ? error.message : 'Failed to connect wallet',
        };
        setState(errorState);
        onConnect?.(errorState);
      }
    },
    [onConnect]
  );

  const handleConnect = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      const discovered = await discoverEIP6963Providers();
      if (discovered.length > 1) {
        setProviders(discovered);
        setShowPicker(true);
        setState((s) => ({ ...s, isConnecting: false }));
        return;
      }
      if (discovered.length === 1) {
        await connectWith(discovered[0].provider);
        return;
      }
      const result = await connectWallet();
      setState(result);
      onConnect?.(result);
    } catch (error) {
      const errorState: Web3State = {
        account: null,
        balance: '0',
        chainId: null,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      };
      setState(errorState);
      onConnect?.(errorState);
    }
  }, [onConnect, connectWith]);

  const connected = displayState?.account ?? state.account;
  const balance = (displayState ?? state).balance;
  const rarity = connected ? getNomadRarityFromWallet(connected) : null;
  if (connected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 rounded-full border border-neon-orange/50 bg-[#0a001a]/80 px-4 py-2 backdrop-blur-md animate-pulse-glow"
        style={{ boxShadow: '0 0 20px rgba(255,69,0,0.4)' }}
      >
        <span className="text-xs text-neon-cyan">{balance.slice(0, 6)} ETH</span>
        <span className="font-mono text-sm text-slate-200">{formatAddress(connected)}</span>
        {rarity && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold capitalize"
            style={{
              background: 'rgba(255,69,0,0.3)',
              color: '#ff4500',
              textShadow: '0 0 8px rgba(255,69,0,0.8)',
            }}
          >
            {rarity}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative flex flex-col items-end gap-1">
      {showPicker && providers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-neon-purple/40 bg-[#0a001a]/98 p-2 shadow-[0_0_30px_rgba(160,32,240,0.3)] backdrop-blur-xl"
        >
          <p className="mb-2 px-2 text-xs text-neon-cyan/80">Choose a wallet</p>
          {providers.map((p) => (
            <button
              key={p.info.uuid}
              type="button"
              onClick={() => connectWith(p.provider)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-neon-purple/20 hover:text-neon-purple"
            >
              {p.info.icon && (
                <img
                  src={p.info.icon}
                  alt=""
                  className="h-8 w-8 rounded-full bg-slate-700 object-contain"
                  width={32}
                  height={32}
                />
              )}
              <span className="font-medium">{p.info.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="mt-2 w-full rounded-lg border border-neon-purple/30 py-1.5 text-xs text-slate-400 hover:bg-neon-purple/10"
          >
            Cancel
          </button>
        </motion.div>
      )}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleConnect}
        disabled={state.isConnecting}
        className="rounded-full border border-neon-purple bg-neon-purple/60 px-5 py-2.5 font-medium text-white backdrop-blur transition hover:border-neon-pink hover:bg-neon-purple/80 hover:shadow-[0_0_25px_rgba(160,32,240,0.5)] disabled:opacity-60"
      >
        {state.isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </motion.button>
      {state.error && (
        <div className="max-w-[240px] text-right">
          <p className="text-xs text-red-400">{state.error}</p>
          <p className="mt-1 text-[10px] text-slate-500">
            Try choosing your wallet from the list above, or use incognito with one wallet.
          </p>
        </div>
      )}
    </div>
  );
}
