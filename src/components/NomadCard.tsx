'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Nomad, NomadRarity } from '@/data/nomads';

const RARITY_STYLES: Record<NomadRarity, string> = {
  Common: 'bg-gray-600',
  Rare: 'bg-blue-600',
  Epic: 'bg-purple-600',
  Legendary: 'bg-yellow-600',
};

/** Tiny base64 PNG used as blur placeholder while Next/Image loads — avoids layout shift and improves perceived speed. */
const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

function getPlaceholderSvg(): string {
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#a020f0"/><stop offset="100%" style="stop-color:#00ffff"/></linearGradient></defs><rect width="300" height="300" fill="url(#pl)"/><circle cx="150" cy="150" r="50" fill="white" opacity="0.3"/><text x="150" y="160" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Nomad</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface NomadCardProps {
  nomad: Nomad;
  index?: number;
}

export default function NomadCard({ nomad, index = 0 }: NomadCardProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isVideo = nomad.video || (nomad.image && nomad.image.endsWith('.mp4'));
  const showFallback = videoError || imageError;
  const showSkeleton = !loaded && !showFallback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/nomads/${nomad.id}`}>
        <motion.div
          className="nomad-card relative group overflow-hidden rounded-xl border border-neon-cyan/30 bg-black/40 backdrop-blur-md transition-all duration-300"
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 25px rgba(0,255,255,0.6)',
            y: -4,
          }}
          whileTap={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="aspect-square relative w-full overflow-hidden rounded-t-xl">
            {/* Loading skeleton — pulse until image/video loads */}
            {showSkeleton && (
              <div
                className="absolute inset-0 z-10 w-full h-full bg-gray-800/50 animate-pulse rounded-t-xl"
                aria-hidden
              />
            )}
            {showFallback ? (
              <div
                className="h-full w-full bg-gradient-to-br from-neon-purple/30 to-neon-cyan/20 flex items-center justify-center"
                style={{ minHeight: 200 }}
              >
                {/* Fallback when video/image fails — plain img is fine for data URI placeholder */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPlaceholderSvg()}
                  alt={nomad.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : isVideo ? (
              <video
                src={nomad.video ?? nomad.image}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
                onLoadedData={() => setLoaded(true)}
              />
            ) : (
              /* Next/Image: auto WebP, lazy load; priority for first 6 for LCP; onLoad hides skeleton */
              <Image
                src={nomad.image}
                alt={nomad.name}
                width={300}
                height={300}
                sizes="(max-width: 768px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="w-full h-auto object-cover rounded-t-xl"
                priority={nomad.id < 6}
                loading={nomad.id < 6 ? undefined : 'lazy'}
                onError={() => setImageError(true)}
                onLoad={() => setLoaded(true)}
              />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="font-sans text-sm font-medium text-white truncate">{nomad.name}</p>
            <span
              className={`mt-1 inline-block text-xs px-2 py-1 rounded ${RARITY_STYLES[nomad.rarity]} text-white font-medium`}
            >
              {nomad.rarity}
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
