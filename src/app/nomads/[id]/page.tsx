'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getNomadById } from '@/data/nomads';
import type { NomadRarity } from '@/data/nomads';
import HoloButton from '@/components/HoloButton';

const RARITY_STYLES: Record<NomadRarity, string> = {
  Common: 'bg-gray-600',
  Rare: 'bg-blue-600',
  Epic: 'bg-purple-600',
  Legendary: 'bg-yellow-600',
};

export default function NomadDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? parseInt(params.id, 10) : NaN;
  const nomad = Number.isFinite(id) ? getNomadById(id) : undefined;

  if (!nomad) notFound();

  const isVideo = nomad.video || (nomad.image && nomad.image.endsWith('.mp4'));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8 md:flex-row md:items-start"
      >
        <div className="flex-shrink-0 w-full md:w-80 aspect-square rounded-xl overflow-hidden border border-neon-cyan/30 bg-black/40">
          {isVideo ? (
            <video
              src={nomad.video ?? nomad.image}
              muted
              loop
              playsInline
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={nomad.image}
              alt={nomad.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(160,32,240,0.6)' }}>
            {nomad.name}
          </h1>
          <span
            className={`mt-2 inline-block px-3 py-1 rounded text-sm font-medium text-white ${RARITY_STYLES[nomad.rarity]}`}
          >
            {nomad.rarity}
          </span>
          {nomad.lore && (
            <p className="mt-6 text-slate-300 leading-relaxed">{nomad.lore}</p>
          )}
          {nomad.traits && nomad.traits.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-slate-400 mb-2">Traits</h2>
              <ul className="flex flex-wrap gap-2">
                {nomad.traits.map((t) => (
                  <li
                    key={t.name}
                    className="rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm"
                  >
                    <span className="text-slate-400">{t.name}:</span>{' '}
                    <span className="text-white">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <HoloButton href="/mint" variant="gradient" size="lg">
              Mint a Nomad
            </HoloButton>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-white hover:bg-slate-700/50"
            >
              ← Explore all
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
