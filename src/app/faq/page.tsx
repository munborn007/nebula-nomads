'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    q: 'What is Nebula Nomads?',
    a: 'Nebula Nomads is an AI-powered space exploration NFT project inspired by xAI. Each NFT is an AI-curated cosmic explorer. Holders get access to the Cosmic Echo experience, metaverse utilities, and future IP expansions.',
  },
  {
    q: 'When is the mint?',
    a: 'Mint opens in Q2 2026. Join our Twitter and Discord for the exact date.',
  },
  {
    q: 'What is the supply and price?',
    a: 'Total supply is 10,000. Pricing uses a Dutch auction starting at 0.2 ETH, decreasing over time until a floor is reached.',
  },
  {
    q: 'What are royalties?',
    a: 'Secondary sales have a 5% royalty to support the project and community.',
  },
  {
    q: 'What is the $NOMAD token?',
    a: '$NOMAD is the utility token planned for the ecosystem—metaverse access, merch, and governance. Details in the whitepaper.',
  },
];

const TOKENOMICS = [
  { category: 'Team & Dev', percentage: '20%', description: 'Development and operations' },
  { category: 'Community', percentage: '30%', description: 'Rewards, airdrops, DAO' },
  { category: 'Treasury', percentage: '25%', description: 'Ecosystem growth' },
  { category: 'Liquidity', percentage: '15%', description: 'DEX and liquidity' },
  { category: 'Advisors', percentage: '10%', description: 'Strategic partners' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
        style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
      >
        FAQ & Whitepaper
      </motion.h1>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-10"
      >
        <h2 className="mb-4 font-semibold text-white">FAQ</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl holo-card overflow-hidden transition hover:shadow-[0_0_25px_rgba(160,32,240,0.3)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-slate-200 hover:text-neon-cyan transition-colors"
              >
                {item.q}
                <span className="text-neon-cyan" style={{ textShadow: '0 0 10px rgba(0,255,255,0.6)' }}>{openIndex === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-neon-purple/30 px-4 py-3 text-slate-400"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="mb-4 font-semibold text-white">Tokenomics</h2>
        <div className="overflow-x-auto rounded-xl holo-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neon-purple/30 bg-[#0a001a]/60">
                <th className="px-4 py-3 text-slate-300">Category</th>
                <th className="px-4 py-3 text-slate-300">Percentage</th>
                <th className="px-4 py-3 text-slate-300">Description</th>
              </tr>
            </thead>
            <tbody>
              {TOKENOMICS.map((row) => (
                <tr key={row.category} className="border-b border-slate-800">
                  <td className="px-4 py-3 text-slate-200">{row.category}</td>
                  <td className="px-4 py-3 text-neon-cyan">{row.percentage}</td>
                  <td className="px-4 py-3 text-slate-400">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-center"
      >
        <a
          href="#"
          className="inline-block rounded-lg border-2 border-neon-purple bg-gradient-to-r from-neon-purple/50 to-neon-pink/50 px-6 py-3 text-white hover:shadow-[0_0_30px_rgba(160,32,240,0.6)] transition-shadow"
        >
          Download Whitepaper (PDF)
        </a>
        <p className="mt-2 text-xs text-slate-500">Placeholder link. Supply 10k, royalties 5%, $NOMAD token.</p>
      </motion.section>
    </div>
  );
}
