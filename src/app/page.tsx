'use client';

import { motion } from 'framer-motion';
import Countdown from '@/components/Countdown';
import NomadCard from '@/components/NomadCard';
import HoloButton from '@/components/HoloButton';
import GlitchText from '@/components/GlitchText';
import { nomads } from '@/data/nomads';

const container = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: i * 0.02 },
  }),
};
const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

/** Fixed teaser order so server and client render the same (avoids hydration mismatch from Math.random). */
const teaserNomads = nomads.slice(0, 8);

export default function HomePage() {

  return (
    <div className="relative">
      {/* Hero — animated title, countdown with cosmic feel */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-8">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-center font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          style={{
            textShadow: '0 0 40px rgba(255,0,255,0.9), 0 0 80px rgba(160,32,240,0.6), 0 0 120px rgba(0,255,255,0.3)',
          }}
        >
          <GlitchText glitchOnHover className="animate-glitch">
            Join the Nebula Nomads
          </GlitchText>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-5 text-center text-lg text-slate-300 sm:text-xl glow-text-cyan"
        >
          AI-Powered Explorers Conquering the Cosmos
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 w-full max-w-xl"
        >
          <div className="futuristic-panel rounded-2xl p-6">
            <Countdown />
            <p className="mt-3 text-center text-sm text-neon-cyan/80">Mint opens Q2 2026</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <HoloButton href="/mint" variant="gradient" size="lg" pulse>
            Connect Wallet & Mint
          </HoloButton>
          <HoloButton href="/ar-viewer" variant="pink" size="lg" pulse>
            View in AR
          </HoloButton>
          <HoloButton href="/explore" variant="cyan" size="lg">
            Explore All 30
          </HoloButton>
        </motion.div>
      </section>

      {/* Teaser grid — random 8 NFTs, staggered fade-in */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-3xl font-bold text-white sm:text-4xl"
          style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
        >
          Explore Nomads
        </motion.h2>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teaserNomads.map((nomad, i) => (
            <motion.div key={nomad.id} variants={item}>
              <NomadCard nomad={nomad} index={i} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <HoloButton href="/explore" variant="gradient" size="md">
            View Full Collection (30)
          </HoloButton>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-slate-400"
        >
          Each Nomad is unique. Mint on-chain or buy from the collection — own your cosmic echo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          <HoloButton href="/mint-1-20" variant="purple" size="md">
            Mint 1–20
          </HoloButton>
          <HoloButton href="/buy-21-30" variant="orange" size="md">
            Buy 21–30
          </HoloButton>
        </motion.div>
      </section>
    </div>
  );
}
