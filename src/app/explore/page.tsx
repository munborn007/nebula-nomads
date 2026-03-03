'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import NomadCard from '@/components/NomadCard';
import HoloTooltip from '@/components/HoloTooltip';
import { nomads } from '@/data/nomads';
import type { NomadRarity } from '@/data/nomads';

const RARITIES: NomadRarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<NomadRarity | 'All'>('All');

  const filtered = useMemo(() => {
    return nomads.filter((n) => {
      const matchSearch =
        !search.trim() ||
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        (n.lore && n.lore.toLowerCase().includes(search.toLowerCase()));
      const matchRarity = rarityFilter === 'All' || n.rarity === rarityFilter;
      return matchSearch && matchRarity;
    });
  }, [search, rarityFilter]);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
        style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
      >
        Explore All Nomads
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-2 text-center text-slate-400"
      >
        30 unique cosmic NFTs — filter by rarity or search.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <input
          type="search"
          placeholder="Search by name or lore..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="futuristic-panel w-full sm:w-72 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
        />
        <div className="flex flex-wrap justify-center gap-2">
          {(['All', ...RARITIES] as const).map((r) => (
            <HoloTooltip key={r} content={`Filter by ${r}`} side="bottom">
              <button
                type="button"
                onClick={() => setRarityFilter(r)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  rarityFilter === r
                    ? 'bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                    : 'bg-white/5 text-slate-400 border border-slate-600 hover:border-neon-purple/50 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            </HoloTooltip>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {filtered.map((nomad, i) => (
          <motion.div
            key={nomad.id}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          >
            <NomadCard nomad={nomad} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center text-slate-500"
        >
          No Nomads match your filters.
        </motion.p>
      )}
    </div>
  );
}
