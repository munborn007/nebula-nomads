'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NeonCard from './NeonCard';
import HoloButton from './HoloButton';

function generateNomadPlaceholder(id: number): string {
  const colors = [
    { bg: '#a020f0', text: '#ffffff' },
    { bg: '#ff00ff', text: '#ffffff' },
    { bg: '#00ffff', text: '#0a001a' },
    { bg: '#7c3aed', text: '#ffffff' },
  ];
  const color = colors[id % colors.length];
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" /><stop offset="100%" style="stop-color:${color.bg}99;stop-opacity:1" /></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="400" fill="url(#g${id})" /><circle cx="200" cy="150" r="40" fill="${color.text}" opacity="0.4" filter="url(#glow)" /><circle cx="150" cy="250" r="25" fill="${color.text}" opacity="0.3" /><circle cx="250" cy="250" r="30" fill="${color.text}" opacity="0.35" /><text x="200" y="320" font-family="Arial" font-size="32" font-weight="bold" fill="${color.text}" text-anchor="middle" opacity="0.95">Nomad #${id}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  src: generateNomadPlaceholder(i + 1),
  alt: `Nomad #${i + 1}`,
  traits: ['Cosmic', 'Rare', 'Explorer', 'AI-Curated'][i % 4],
}));

export default function TeaserGallery() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center text-3xl font-bold text-white sm:text-4xl"
        style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
      >
        Explore Nomads
      </motion.h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {PLACEHOLDERS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className="group"
          >
            <NeonCard delay={i * 0.05} glowColor={i % 4 === 0 ? 'cyan' : i % 4 === 1 ? 'pink' : 'purple'} yoyo={true}>
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-pink/20">
                <motion.div
                  className="aspect-square"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-end rounded-lg bg-gradient-to-t from-black/95 to-transparent p-3 opacity-0 transition-opacity duration-300 ${
                    hovered === item.id ? 'opacity-100' : 'group-hover:opacity-100'
                  }`}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: '#00ffff', textShadow: '0 0 10px rgba(0,255,255,0.8)' }}
                  >
                    Rarity: {item.traits}
                  </span>
                  <HoloButton href="/mint" variant="orange" size="sm" pulse={false} className="mt-2">
                    Bid Now
                  </HoloButton>
                </div>
                <div
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold opacity-0 transition-opacity ${
                    hovered === item.id ? 'opacity-100' : 'group-hover:opacity-100'
                  }`}
                  style={{
                    background: 'rgba(160,32,240,0.8)',
                    color: '#fff',
                    boxShadow: '0 0 10px rgba(255,0,255,0.6)',
                  }}
                >
                  #{item.id}
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
