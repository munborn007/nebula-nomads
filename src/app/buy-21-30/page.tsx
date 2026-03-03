'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { nomads } from '@/data/nomads';
import NomadCard from '@/components/NomadCard';
import WalletConnectButton from '@/components/WalletConnectButton';
import {
  getWeb3,
  getWalletStateIfConnected,
  sendEth,
  getExplorerTxUrl,
  type Web3State,
} from '@/utils/web3';

const BUY_PRICE_ETH = 0.2;
const PAYMENT_WALLET =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PAYMENT_WALLET) ||
  '0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b';

const nomads21to30 = nomads.filter((n) => n.id >= 21 && n.id <= 30);

function ethToWei(eth: number): string {
  const web3 = getWeb3();
  return web3 ? web3.utils.toWei(eth.toFixed(18), 'ether') : '0';
}

export default function Buy2130Page() {
  const [walletState, setWalletState] = useState<Web3State | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txError, setTxError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const balanceNum = walletState?.account ? parseFloat(walletState.balance) : 0;
  const insufficientBalance = balanceNum < BUY_PRICE_ETH;

  useEffect(() => {
    getWalletStateIfConnected().then((s) => {
      if (s.account) setWalletState(s);
    });
  }, []);

  const handleBuy = useCallback(async () => {
    if (!walletState?.account) return;
    setTxError(null);
    setTxHash(null);
    setTxStatus('pending');
    try {
      const valueWei = ethToWei(BUY_PRICE_ETH);
      const result = await sendEth(PAYMENT_WALLET, valueWei, walletState.account);
      if (result.success) {
        setTxHash(result.txHash);
        setTxStatus('success');
        getWalletStateIfConnected().then((s) => s.account && setWalletState(s));
      } else {
        setTxError(result.error);
        setTxStatus('error');
      }
    } catch (e) {
      setTxError(e instanceof Error ? e.message : 'Payment failed');
      setTxStatus('error');
    }
  }, [walletState]);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
          style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
        >
          Buy NFTs 21–30
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-center text-slate-400"
        >
          {BUY_PRICE_ETH} ETH per NFT. Payment sent to project wallet; ownership transfer confirmed manually / off-chain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="futuristic-panel holo-card mx-auto mt-8 max-w-md rounded-2xl p-6"
        >
          <WalletConnectButton onConnect={setWalletState} displayState={walletState} />
          {walletState?.account && (
            <>
              <p className="mt-3 text-sm text-slate-400">Balance: {walletState.balance} ETH</p>
              <p className="mt-1 text-sm text-neon-cyan">Price: {BUY_PRICE_ETH} ETH per NFT</p>
              {insufficientBalance && (
                <p className="mt-2 text-sm text-red-400">Insufficient balance.</p>
              )}
              {txError && <p className="mt-2 text-sm text-red-400">{txError}</p>}
              {txHash && (
                <a
                  href={getExplorerTxUrl(walletState.chainId, txHash) ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-neon-cyan underline"
                >
                  View transaction →
                </a>
              )}
              <motion.button
                type="button"
                onClick={handleBuy}
                disabled={txStatus === 'pending' || insufficientBalance}
                className="mt-4 w-full rounded-lg border-2 border-neon-purple bg-neon-purple/60 py-3 font-medium text-white transition hover:shadow-[0_0_25px_rgba(160,32,240,0.5)] disabled:opacity-50"
              >
                {txStatus === 'pending' && 'Sending...'}
                {txStatus === 'idle' && `Pay ${BUY_PRICE_ETH} ETH to Buy`}
                {txStatus === 'success' && 'Paid!'}
                {txStatus === 'error' && 'Retry'}
              </motion.button>
            </>
          )}
        </motion.div>

        <div className="mt-12">
          <h2 className="mb-4 text-center text-xl font-semibold text-white">Collection 21–30</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nomads21to30.map((nomad, i) => (
              <NomadCard key={nomad.id} nomad={nomad} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
