'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const RoadmapBackground = dynamic(() => import('@/components/RoadmapBackground'), {
  ssr: false,
  loading: () => null,
});

type PhaseStatus = 'completed' | 'ongoing' | 'future';

interface RoadmapPhase {
  id: number;
  title: string;
  date: string;
  status: PhaseStatus;
  bullets: string[];
  icon: string;
}

const PHASES: RoadmapPhase[] = [
  {
    id: 1,
    title: 'Teaser Drop',
    date: 'Q4 2025',
    status: 'completed',
    icon: '◆',
    bullets: [
      'AI art reveals and community teasers.',
      'Cosmic Echo preview and site launch.',
      '30 NFTs (Explore, detail pages, AR) live.',
    ],
  },
  {
    id: 2,
    title: 'Mint & Community Build',
    date: 'Q1 2026',
    status: 'ongoing',
    icon: '◈',
    bullets: [
      'Launch mint (1–20) and buy (21–30) pages live.',
      'DAO setup and holder rewards.',
      'Airdrops and Discord/Twitter growth.',
    ],
  },
  {
    id: 3,
    title: 'Metaverse Launch & Utilities',
    date: 'Q2 2026',
    status: 'future',
    icon: '⬡',
    bullets: [
      'Virtual events and AR/metaverse integrations.',
      'NFT utilities: staking, breeding new Nomads.',
    ],
  },
  {
    id: 4,
    title: 'IP Expansions',
    date: 'Q3 2026',
    status: 'future',
    icon: '⚔',
    bullets: [
      'Games: Nomad battles and series collabs.',
      'Merch drops and broader IP.',
    ],
  },
  {
    id: 5,
    title: 'Global Adoption',
    date: '2027',
    status: 'future',
    icon: '◉',
    bullets: [
      'Mainnet migration and partnerships.',
      'Mobile app for AR viewing.',
    ],
  },
  {
    id: 6,
    title: 'Legacy Phase',
    date: '2028+',
    status: 'future',
    icon: '✦',
    bullets: [
      'Broader IP: films, books, charity auctions.',
      'Ecosystem expansions.',
    ],
  },
];

const statusStyles: Record<PhaseStatus, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'roadmap-status-completed' },
  ongoing: { label: 'Ongoing', className: 'roadmap-status-ongoing' },
  future: { label: 'Future', className: 'roadmap-status-future' },
};

const container = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: i * 0.05 },
  }),
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function RoadmapPage() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="relative min-h-screen">
      <RoadmapBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 pt-28">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1
            className="font-display text-4xl sm:text-5xl font-bold text-white"
            style={{ textShadow: '0 0 40px rgba(160,32,240,0.7), 0 0 80px rgba(0,255,255,0.3)' }}
          >
            Roadmap
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            From teaser drop to legacy — a realistic path for Nebula Nomads over the next 3–5 years.
          </p>
        </motion.header>

        {/* Vertical timeline path with nodes */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Vertical warp line through node centers (left-6 = center of node column w-12) */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px roadmap-path"
            aria-hidden
          />

          {PHASES.map((phase, index) => {
            const isExpanded = expandedId === phase.id;
            const status = statusStyles[phase.status];

            return (
              <motion.div
                key={phase.id}
                variants={item}
                transition={{ duration: 0.4 }}
                className="relative flex gap-4 sm:gap-8 mb-8 sm:mb-10"
              >
                {/* Node on the line */}
                <div className="flex-shrink-0 flex flex-col items-center w-12 sm:w-16">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : phase.id)}
                    className={`roadmap-node ${status.className} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neon-cyan/60`}
                    aria-expanded={isExpanded}
                    aria-label={`${phase.title} — ${status.label}. ${isExpanded ? 'Collapse' : 'Expand'}`}
                  >
                    {phase.icon}
                  </button>
                  {index < PHASES.length - 1 && (
                    <div className="w-px flex-1 min-h-[2rem] bg-gradient-to-b from-neon-cyan/40 to-transparent mt-2" />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 min-w-0 pb-2">
                  <motion.div
                    layout
                    className={`roadmap-card futuristic-panel rounded-xl border overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? 'border-neon-cyan/60 shadow-[0_0_30px_rgba(0,255,255,0.15)]'
                        : 'border-neon-cyan/25 hover:border-neon-cyan/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : phase.id)}
                      className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex flex-wrap items-center gap-3"
                    >
                      <span className="text-lg sm:text-xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(160,32,240,0.5)' }}>
                        Phase {phase.id}: {phase.title}
                      </span>
                      <span className="text-slate-400 text-sm font-mono">{phase.date}</span>
                      <span className={`roadmap-status-pill ${status.className} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                        {status.label}
                      </span>
                      <span className="ml-auto text-neon-cyan text-lg">{isExpanded ? '−' : '+'}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-neon-cyan/20"
                        >
                          <ul className="px-5 py-4 sm:px-6 sm:py-5 space-y-2 text-slate-300 text-sm sm:text-base">
                            {phase.bullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-neon-cyan mt-1">▸</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center text-slate-500 text-xs"
        >
          <p>Sepolia contract live • Mint 1–20 & Buy 21–30 pages live • 30 NFTs • Join the journey.</p>
        </motion.footer>
      </div>
    </div>
  );
}
