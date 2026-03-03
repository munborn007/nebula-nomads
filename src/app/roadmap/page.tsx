'use client';

import { motion } from 'framer-motion';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';

const PHASES = [
  {
    title: 'Phase 1: Teaser Drop',
    date: 'Q1 2026',
    desc: 'AI art reveals, community teasers, and Cosmic Echo preview.',
    icon: '🖼️',
  },
  {
    title: 'Phase 2: Mint & Community Build',
    date: 'Q2 2026',
    desc: 'Launch mint, DAO setup, and holder rewards.',
    icon: '🚀',
  },
  {
    title: 'Phase 3: Metaverse Launch & Utilities',
    date: 'Q3 2026',
    desc: 'Virtual events, metaverse integrations, and utilities.',
    icon: '🌐',
  },
  {
    title: 'Phase 4: IP Expansions',
    date: '2027+',
    desc: 'Games, series, and broader IP expansions.',
    icon: '⭐',
  },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
        style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
      >
        Roadmap
      </motion.h1>
      <div className="mt-12">
        <VerticalTimeline lineColor="rgba(0,255,255,0.4)">
          {PHASES.map((phase) => (
            <VerticalTimelineElement
              key={phase.title}
              contentStyle={{
                background: 'linear-gradient(160deg, rgba(2,4,8,0.95), rgba(10,0,26,0.85))',
                border: '1px solid rgba(0, 255, 255, 0.25)',
                borderRadius: '12px',
                boxShadow: '0 0 30px rgba(0,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
              }}
              contentArrowStyle={{ borderRight: '7px solid rgba(160, 32, 240, 0.6)' }}
              date={phase.date}
              dateClassName="text-neon-cyan"
              iconStyle={{
                background: 'linear-gradient(135deg, #a020f0, #ff00ff)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(160,32,240,0.6)',
              }}
              icon={<span>{phase.icon}</span>}
            >
              <h3 className="font-semibold text-white">{phase.title}</h3>
              <p className="mt-1 text-slate-400">{phase.desc}</p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
}
