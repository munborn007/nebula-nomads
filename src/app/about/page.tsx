'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
        style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
      >
        About Nebula Nomads
      </motion.h1>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-invert mt-12 max-w-none"
      >
        <p className="text-lg text-slate-300">
          Born from Grok&apos;s xAI vision, Nebula Nomads are AI-curated space explorers roaming
          infinite nebulae. Each NFT evolves with holder interactions, unlocking cosmic utilities.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-white" style={{ textShadow: '0 0 15px rgba(0,255,255,0.4)' }}>AI Integration</h2>
        <p className="text-slate-400">
          Our collection is powered by AI at every step: from procedural nebula generation to
          trait evolution. The Cosmic Echo feature turns your wallet or wish into a unique,
          living nebula experience.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-white" style={{ textShadow: '0 0 15px rgba(0,255,255,0.4)' }}>xAI Inspiration</h2>
        <p className="text-slate-400">
          Inspired by xAI&apos;s cosmic and exploratory ethos, Nebula Nomads bridge AI and Web3 in a
          first-of-its-kind multisensory experience—visual nebula and space soundscapes that respond
          to you in real time.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-white" style={{ textShadow: '0 0 15px rgba(0,255,255,0.4)' }}>Nomad Souls (Soulbound)</h2>
        <p className="text-slate-400">
          Conceptually, Nomad Souls are soulbound personalizations secured by ZK proofs: your
          on-chain identity ties to a unique &quot;cosmic soul&quot; that can unlock future utilities
          without transferring the soul itself. Details will be expanded in the whitepaper.
        </p>
      </motion.section>

      {/* Our Creations — Midjourney-style grid of holo-cards */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="mb-6 text-xl font-semibold text-white" style={{ textShadow: '0 0 15px rgba(0,255,255,0.4)' }}>
          Our Creations
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Cosmic Explorer', desc: 'AI-curated space nomad with procedural nebula' },
            { title: 'Rare Voyager', desc: 'Limited edition explorer with unique traits' },
            { title: 'Legendary Pioneer', desc: 'One-of-a-kind cosmic pioneer' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="holo-card rounded-xl p-5 transition hover:shadow-[0_0_40px_rgba(160,32,240,0.3)]"
            >
              <div
                className="mb-2 h-24 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/10"
                style={{ boxShadow: 'inset 0 0 20px rgba(0,255,255,0.05)' }}
              />
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 aspect-video w-full overflow-hidden rounded-xl holo-card"
      >
        <div className="flex h-full w-full items-center justify-center text-slate-500">
          Teaser video placeholder (YouTube embed)
        </div>
      </motion.section>
    </div>
  );
}
