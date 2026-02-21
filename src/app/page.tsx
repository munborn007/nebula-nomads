'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Countdown from '@/components/Countdown';
import NomadCard from '@/components/NomadCard';
import HoloButton from '@/components/HoloButton';
import { nomads } from '@/data/nomads';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl animate-glitch"
          style={{ textShadow: '0 0 30px rgba(255,0,255,0.9), 0 0 60px rgba(160,32,240,0.5)' }}
        >
          Join the Nebula Nomads
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="animate-glitch mt-4 text-center text-lg text-slate-300 sm:text-xl"
          style={{ textShadow: '0 0 15px rgba(0,255,255,0.5)' }}
        >
          AI-Powered Explorers Conquering the Cosmos
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 w-full max-w-xl"
        >
          <Countdown />
          <p className="mt-3 text-center text-sm text-neon-cyan/70">Mint opens Q2 2026</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <HoloButton href="/mint" variant="gradient" size="lg" pulse>
            Connect Wallet & Personalize
          </HoloButton>
          <HoloButton href="/ar-viewer" variant="pink" size="lg" pulse>
            View in AR
          </HoloButton>
        </motion.div>
      </section>

      {/* Parallax spacer */}
      <motion.section
        className="relative py-24"
        style={{ y: 0 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { opacity: 1 }, hidden: { opacity: 0.3 } }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-1/4 top-1/4 h-2 w-2 rounded-full bg-neon-cyan/80"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-1/3 top-1/2 h-1 w-1 rounded-full bg-neon-pink/80"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-2 w-2 rounded-full bg-neon-purple/60"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </motion.section>

      {/* Explore Nomads — real NFT grid from /public/nfts/thumbs/ */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-3xl font-bold text-white sm:text-4xl"
          style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
        >
          Explore Nomads
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
          {nomads.map((nomad, i) => (
            <NomadCard key={nomad.id} nomad={nomad} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-slate-400"
        >
          Each Nomad is unique. Personalize the nebula with your wallet to see your cosmic echo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-center"
        >
          <HoloButton href="/mint" variant="orange" size="md">
            Go to Mint
          </HoloButton>
        </motion.div>
      </section>
    </div>
  );
}
