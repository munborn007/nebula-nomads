'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDrag } from '@use-gesture/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { Nomad, NomadRarity } from '@/data/nomads';

/** Local NFT thumbs: use plain img so 404 reliably triggers onError and we can fall back to .png.mp4 video. */
const isLocalNftThumb = (src: string) => /^\/nfts\/thumbs\/nomad-\d+\.png$/.test(src);

const RARITY_STYLES: Record<NomadRarity, string> = {
  Common: 'bg-gray-600 rarity-common',
  Rare: 'bg-blue-600 rarity-rare',
  Epic: 'bg-purple-600 rarity-epic',
  Legendary: 'bg-yellow-600 rarity-legendary',
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
  const [tryVideoFallback, setTryVideoFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const isVideo = nomad.video || (nomad.image && nomad.image.endsWith('.mp4')) || tryVideoFallback;
  const videoSrc = tryVideoFallback && nomad.image?.endsWith('.png')
    ? nomad.image.replace(/\.png$/, '.png.mp4')
    : (nomad.video ?? nomad.image);
  const showFallback = videoError || (imageError && !tryVideoFallback);
  const showSkeleton = !loaded && !showFallback;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) / rect.width);
    y.set((e.clientY - cy) / rect.height);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const bindDrag = useDrag(({ movement: [mx, my], last }) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const scale = 2 / Math.min(rect.width, rect.height);
    if (last) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(Math.max(-0.5, Math.min(0.5, mx * scale * 0.5)));
    y.set(Math.max(-0.5, Math.min(0.5, my * scale * 0.5)));
  }, { pointer: { touch: true }, mouse: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/nomads/${nomad.id}`} className="block">
        <div {...bindDrag()} className="touch-pan-y">
          <motion.div
            ref={cardRef}
            className="nomad-card relative group overflow-hidden rounded-xl border border-neon-cyan/40 futuristic-panel transition-shadow duration-300"
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 35px rgba(0,255,255,0.4), 0 0 60px rgba(160,32,240,0.2)',
              y: -6,
            }}
            whileTap={{ scale: 1.01 }}
            transition={{ duration: 0.25 }}
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
                src={videoSrc}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
                onLoadedData={() => setLoaded(true)}
              />
            ) : isLocalNftThumb(nomad.image) ? (
              /* Plain img for local thumbs so 404 reliably fires onError → fallback to .png.mp4 video (e.g. NFT #1) */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={nomad.image}
                alt={nomad.name}
                className="w-full h-full object-cover"
                onError={() => setTryVideoFallback(true)}
                onLoad={() => setLoaded(true)}
              />
            ) : (
              <Image
                src={nomad.image}
                alt={nomad.name}
                width={300}
                height={300}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="w-full h-auto object-cover rounded-t-xl"
                priority={nomad.id <= 12}
                loading={nomad.id <= 12 ? undefined : 'lazy'}
                fetchPriority={nomad.id <= 8 ? 'high' : undefined}
                onError={() => {
                  if (nomad.image?.endsWith('.png')) setTryVideoFallback(true);
                  else setImageError(true);
                }}
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
        </div>
      </Link>
    </motion.div>
  );
}
