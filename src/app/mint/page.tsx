'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchSupply, fetchMintFeed } from '@/utils/api';
import type { SupplyResponse } from '@/utils/api';
import WalletConnectButton from '@/components/WalletConnectButton';
import {
  getWeb3,
  getWalletStateIfConnected,
  getMintedSupply,
  mintNomads,
  getExplorerTxUrl,
  CONTRACT_ADDRESS,
  MAX_SUPPLY,
  type Web3State,
} from '@/utils/web3';

const DUTCH_START_ETH = 0.2;
const DUTCH_DECREASE_PER_HOUR = 0.01;
const DUTCH_FLOOR_ETH = 0.05;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const DEMO_STORAGE_KEY = 'nebula-demo-mints';
/** On-chain mint price (contract enforces 0.1 ETH when CONTRACT_ADDRESS is set). */
const ON_CHAIN_MINT_PRICE_ETH = 0.1;

/** Only this wallet can mint during test phase; it mints for free (0 ETH). */
const ALLOWED_TEST_WALLET = '0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b';
function isAllowedTestWallet(account: string | null): boolean {
  return !!account && account.toLowerCase() === ALLOWED_TEST_WALLET.toLowerCase();
}

/** Get demo mint state from localStorage (supply + feed). */
function getDemoMintState(): { minted: number; feed: { address: string; quantity: number; time: string }[] } {
  if (typeof window === 'undefined') return { minted: 0, feed: [] };
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return { minted: 0, feed: [] };
    const parsed = JSON.parse(raw) as { minted: number; feed: { address: string; quantity: number; time: string }[] };
    return { minted: parsed.minted ?? 0, feed: Array.isArray(parsed.feed) ? parsed.feed : [] };
  } catch {
    return { minted: 0, feed: [] };
  }
}

/** Save demo mint to localStorage. */
function addDemoMint(address: string, quantity: number): void {
  if (typeof window === 'undefined') return;
  const { minted, feed } = getDemoMintState();
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const newFeed = [{ address: truncated, quantity, time: new Date().toISOString() }, ...feed.slice(0, 49)];
  const newMinted = minted + quantity;
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ minted: newMinted, feed: newFeed }));
  } catch {
    // ignore
  }
}

function getDutchPrice(): number {
  const start = new Date('2026-06-01').getTime();
  const now = Date.now();
  const elapsedHours = Math.max(0, (now - start) / (1000 * 60 * 60));
  const decrease = elapsedHours * DUTCH_DECREASE_PER_HOUR;
  return Math.max(DUTCH_FLOOR_ETH, DUTCH_START_ETH - decrease);
}

function ethToWei(eth: number): string {
  const web3 = getWeb3();
  return web3 ? web3.utils.toWei(eth.toFixed(18), 'ether') : '0';
}

async function refreshSupplyFromChain(): Promise<SupplyResponse> {
  const minted = await getMintedSupply();
  return { total: MAX_SUPPLY, minted };
}

export default function MintPage() {
  const [supply, setSupply] = useState<SupplyResponse | null>(null);
  const [feed, setFeed] = useState<{ address: string; quantity: number; time: string }[]>([]);
  const [walletState, setWalletState] = useState<Web3State | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txError, setTxError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [priceEth, setPriceEth] = useState(DUTCH_START_ETH);
  const contractConfigured = CONTRACT_ADDRESS !== ZERO_ADDRESS;

  const loadSupply = useCallback(() => {
    if (contractConfigured) {
      refreshSupplyFromChain().then(setSupply).catch(() => fetchSupply().then(setSupply).catch(() => setSupply({ total: MAX_SUPPLY, minted: 0 })));
    } else {
      const demo = getDemoMintState();
      setSupply({ total: MAX_SUPPLY, minted: demo.minted });
    }
  }, [contractConfigured]);

  const loadFeed = useCallback(() => {
    if (contractConfigured) {
      fetchMintFeed(15).then(setFeed);
    } else {
      setFeed(getDemoMintState().feed);
    }
  }, [contractConfigured]);

  useEffect(() => {
    loadSupply();
    loadFeed();
  }, [loadSupply, loadFeed]);

  useEffect(() => {
    getWalletStateIfConnected().then((s) => {
      if (s.account) setWalletState(s);
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPriceEth(getDutchPrice()), 10000);
    return () => clearInterval(t);
  }, []);

  const isTestWallet = isAllowedTestWallet(walletState?.account ?? null);
  const pricePerMint = contractConfigured ? ON_CHAIN_MINT_PRICE_ETH : priceEth;
  const totalCostEth = isTestWallet ? 0 : pricePerMint * quantity;
  const balanceNum = walletState?.account ? parseFloat(walletState.balance) : 0;
  const insufficientBalance = !isTestWallet && balanceNum < totalCostEth;
  const notAllowedToMint = !contractConfigured && !!walletState?.account && !isTestWallet;

  const handleMint = useCallback(async () => {
    if (!walletState?.account) return;
    if (!isTestWallet) return;
    if (insufficientBalance) return;
    setTxError(null);
    setTxHash(null);
    setTxStatus('pending');
    try {
      if (!contractConfigured) {
        await new Promise((r) => setTimeout(r, 2000));
        addDemoMint(walletState.account, quantity);
        setTxStatus('success');
        loadSupply();
        loadFeed();
        getWalletStateIfConnected().then((s) => s.account && setWalletState(s));
        return;
      }
      const valueWei = isTestWallet ? '0' : ethToWei(pricePerMint * quantity);
      const result = await mintNomads(quantity, valueWei, walletState.account);
      if (result.success) {
        setTxHash(result.txHash);
        setTxStatus('success');
        loadSupply();
        loadFeed();
        getWalletStateIfConnected().then((s) => s.account && setWalletState(s));
      } else {
        setTxError(result.error);
        setTxStatus('error');
      }
    } catch (e) {
      setTxError(e instanceof Error ? e.message : 'Mint failed');
      setTxStatus('error');
    }
  }, [walletState?.account, quantity, pricePerMint, isTestWallet, insufficientBalance, contractConfigured, loadSupply, loadFeed]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
        style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
      >
        Mint Your Nomad
      </motion.h1>

      {!contractConfigured && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-6 max-w-xl rounded-xl border border-amber-500/50 bg-amber-950/40 px-4 py-3 text-center"
        >
          <p className="text-sm font-medium text-amber-200">
            Demo mode — NFTs are simulated locally, not minted on-chain
          </p>
          <p className="mt-1 text-xs text-amber-300/80">
            Set <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_CONTRACT_ADDRESS</code> in .env.local to mint real NFTs. See MINTING.md.
          </p>
        </motion.div>
      )}

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
        {/* Gift box-style mint card — gaming dashboard inspired */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="holo-card flex-1 rounded-2xl p-6 shadow-[0_0_40px_rgba(160,32,240,0.25)] relative overflow-hidden"
          style={{ borderColor: 'rgba(0,255,255,0.5)' }}
        >
          <div
            className="absolute -right-8 -top-8 text-6xl opacity-20"
            style={{ textShadow: '0 0 20px rgba(255,0,255,0.5)' }}
          >
            🎁
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Supply</span>
              {supply && (
                <span className="font-mono text-white" style={{ textShadow: '0 0 10px rgba(0,255,255,0.6)' }}>
                  {supply.minted} / {supply.total}
                </span>
              )}
            </div>
            {supply && (
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(supply.minted / supply.total) * 100}%` }}
                  style={{
                    background: 'linear-gradient(90deg, #a020f0, #ff00ff)',
                    boxShadow: '0 0 15px rgba(160,32,240,0.6)',
                  }}
                />
              </div>
            )}
          </div>
          <div className="mb-6">
            <WalletConnectButton onConnect={setWalletState} displayState={walletState} />
          </div>
          {walletState?.account && (
            <>
              <p className="mb-2 text-sm text-slate-400">Balance: {walletState.balance} ETH</p>
              <label className="mb-2 block text-sm text-slate-400">Quantity (1–10)</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <p className="mb-4 text-slate-300">
                Price: <span className="font-mono text-neon-cyan">{pricePerMint.toFixed(3)} ETH</span> each
                {contractConfigured ? ' (on-chain)' : ' (Dutch auction)'}
              </p>
              <p className="mb-4 text-sm text-slate-500">
                Total: {totalCostEth.toFixed(3)} ETH {isTestWallet && <span className="text-emerald-400">(free — test wallet)</span>}
              </p>
              {notAllowedToMint && (
                <p className="mb-3 text-sm text-amber-400">
                  Demo mode: minting is restricted to the test wallet only. Set contract address for real mint.
                </p>
              )}
              {!contractConfigured && (
                <p className="mb-3 text-xs text-amber-400">
                  Simulated mint — stored locally. No on-chain NFT created.
                </p>
              )}
              {insufficientBalance && (
                <p className="mb-3 text-sm text-red-400">
                  Insufficient balance (need {totalCostEth.toFixed(3)} ETH).
                </p>
              )}
              {txError && (
                <p className="mb-3 text-sm text-red-400">{txError}</p>
              )}
              {txStatus === 'success' && txHash && (
                <p className="mb-3 text-sm">
                  <a
                    href={getExplorerTxUrl(walletState?.chainId ?? null, txHash) ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan underline hover:text-neon-purple"
                  >
                    View transaction on block explorer →
                  </a>
                </p>
              )}
              {txStatus === 'success' && !txHash && !contractConfigured && (
                <p className="mb-3 text-sm text-emerald-400">
                  Demo mint saved. Supply and feed updated locally.
                </p>
              )}
              <motion.button
                type="button"
                whileHover={txStatus !== 'pending' && (isTestWallet || !notAllowedToMint) && !insufficientBalance ? { scale: 1.02 } : undefined}
                whileTap={txStatus !== 'pending' && isTestWallet && !insufficientBalance ? { scale: 0.98 } : undefined}
                onClick={handleMint}
                disabled={txStatus === 'pending' || insufficientBalance || !!notAllowedToMint}
                className="w-full rounded-lg border-2 border-neon-purple bg-gradient-to-r from-neon-purple/40 to-neon-pink/40 py-3 font-medium text-white hover:shadow-[0_0_30px_rgba(160,32,240,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {txStatus === 'pending' && 'Minting...'}
                {txStatus === 'idle' && 'Mint'}
                {txStatus === 'success' && 'Minted!'}
                {txStatus === 'error' && 'Retry'}
              </motion.button>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="holo-card flex-1 rounded-2xl p-4"
        >
          <h3 className="mb-3 font-medium text-white">Live mint feed</h3>
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {feed.map((item, i) => (
              <li key={i} className="flex justify-between text-sm text-slate-400">
                <span>{item.address}</span>
                <span className="text-neon-cyan">×{item.quantity}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
