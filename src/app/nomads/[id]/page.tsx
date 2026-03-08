'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNomadById, getNomadReview, nomads } from '@/data/nomads';
import type { NomadRarity } from '@/data/nomads';
import dynamic from 'next/dynamic';
import HoloButton from '@/components/HoloButton';
import HoloStatBar from '@/components/HoloStatBar';
import RadarChart from '@/components/RadarChart';
import type { RadarStat } from '@/components/RadarChart';

const Nomad3DViewer = dynamic(() => import('@/components/three/Nomad3DViewer'), { ssr: false });

const RARITY_STYLES: Record<NomadRarity, string> = {
  Common: 'bg-gray-600 rarity-common',
  Rare: 'bg-blue-600 rarity-rare',
  Epic: 'bg-purple-600 rarity-epic',
  Legendary: 'bg-yellow-600 rarity-legendary',
};

const STAT_TOOLTIPS: Record<string, string> = {
  Attack: 'Raw offensive output in void combat.',
  Defense: 'Resistance to damage and debuffs.',
  Speed: 'Mobility and initiative in nebula zones.',
  Intelligence: 'Ability cooldown and effect scaling.',
  Energy: 'Sustain and energy pool for abilities.',
  Special: 'Unique ability strength and synergy.',
  Durability: 'Survivability under sustained fire.',
  Versatility: 'Adaptability across environments.',
};

function SectionDivider() {
  return (
    <div className="my-6 border-t border-neon-cyan/20 flex items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/40" />
      <span className="text-neon-cyan/60 text-xs font-mono">◆</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/40" />
    </div>
  );
}

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="futuristic-panel rounded-xl overflow-hidden border border-neon-cyan/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-slate-200 hover:text-neon-cyan transition-colors"
      >
        <span className="font-medium">{title}</span>
        <span className="text-neon-cyan text-lg">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-neon-purple/20"
          >
            <div className="px-4 py-3 text-slate-400 text-sm space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const videoFallbackUrl = (id: number) =>
  `/nfts/thumbs/nomad-${String(id).padStart(4, '0')}.png.mp4`;

/** Local thumb path: we have .png.mp4 videos, so try video first so NFT #1 etc. load reliably. */
const isLocalThumb = (src: string) =>
  src?.startsWith('/nfts/thumbs/') && src?.endsWith('.png');

export default function NomadDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? parseInt(params.id, 10) : NaN;
  const nomad = Number.isFinite(id) ? getNomadById(id) : undefined;
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<'api' | 'static' | 'video'>('api');

  useEffect(() => {
    setImageError(false);
    const n = Number.isFinite(id) ? getNomadById(id) : undefined;
    setImageSource(n && isLocalThumb(n.image) ? 'video' : 'api');
  }, [id]);

  if (!nomad) notFound();

  const imageSrc =
    imageSource === 'api' ? `/api/nft-image/${nomad.id}` : nomad.image;

  const handleImageError = () => {
    if (imageSource === 'api') {
      setImageSource('static');
    } else if (imageSource === 'static') {
      setImageSource('video');
    } else {
      setImageError(true);
    }
  };

  const review = getNomadReview(nomad, nomads);
  const isVideoFromData = nomad.video || (nomad.image && nomad.image.endsWith('.mp4'));
  const showVideoFallback = imageSource === 'video' && !imageError;

  const handleVideoError = () => {
    setImageSource('api');
  };

  const radarStats: RadarStat[] = Object.entries(review.powerLevels).map(([label, value]) => ({ label: label.slice(0, 4), value }));
  const siteBase = typeof window !== 'undefined' ? window.location.origin : 'https://nebula-nomads-ci2j.vercel.app';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `${siteBase}/nomads/${nomad.id}`;
  const twitterText = encodeURIComponent(`${nomad.name} — Nebula Nomad #${nomad.id}. Mint cosmic AI NFTs.`);
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(shareUrl)}`;
  const openseaUrl = `https://opensea.io/assets/sepolia/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0'}/${nomad.id}`;
  const share = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: nomad.name, url: shareUrl, text: nomad.lore });
    } else {
      navigator.clipboard?.writeText(shareUrl);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8 md:flex-row md:items-start"
      >
        {/* Left: NFT image + overall rating */}
        <div className="flex-shrink-0 w-full md:w-80 space-y-4">
          <div className="aspect-square w-full min-h-[200px] rounded-xl overflow-hidden futuristic-panel border border-neon-cyan/40 relative bg-black/40">
            {isVideoFromData ? (
              <video
                src={nomad.video ?? nomad.image}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : showVideoFallback ? (
              <video
                key={`video-${nomad.id}`}
                src={videoFallbackUrl(nomad.id)}
                muted
                loop
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleVideoError}
                onLoadedData={() => setImageError(false)}
              />
            ) : imageError ? (
              /* Placeholder when both API and static image 404 */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neon-purple/20 to-neon-cyan/10 p-4 text-center">
                <span className="text-4xl opacity-50">◆</span>
                <p className="mt-2 text-sm font-medium text-white/90">{nomad.name}</p>
                <p className="mt-1 text-xs text-slate-400 font-mono">nomad-{String(nomad.id).padStart(4, '0')}.png</p>
                <p className="mt-2 text-xs text-slate-500 max-w-[280px]">
                  Put this file in: <span className="block mt-1 font-mono text-neon-cyan/90 text-[11px] break-all">public\nfts\thumbs\</span>
                  (inside the folder that contains <span className="font-mono">package.json</span>)
                </p>
                <a
                  href={`/api/debug-nft-paths?id=${nomad.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-xs text-neon-cyan/80 hover:text-neon-cyan underline"
                >
                  See exact path the server is looking for →
                </a>
              </div>
            ) : (
              /* Try API route first, then static path /nfts/thumbs/nomad-0001.png */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${nomad.id}-${imageSource}`}
                src={imageSrc}
                alt={nomad.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleImageError}
                onLoad={() => setImageError(false)}
              />
            )}
          </div>
          <div className="mt-4 w-full aspect-square max-w-[200px] mx-auto">
            <Nomad3DViewer nomadId={nomad.id} color={nomad.rarity === 'Legendary' ? '#eab308' : nomad.rarity === 'Epic' ? '#a855f7' : '#00ffff'} />
          </div>
          <div className="futuristic-panel rounded-xl p-4 text-center border border-neon-cyan/30 mt-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Overall Rating</p>
            <motion.p
              className="text-4xl font-bold text-white mt-1"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ textShadow: '0 0 20px rgba(0,255,255,0.6)' }}
            >
              {review.overallRating}/10
            </motion.p>
            <p className="text-xs text-slate-400 mt-1">Rarity: {nomad.rarity}</p>
          </div>
        </div>

        {/* Right: Header + lore + ability/weapon */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(160,32,240,0.6)' }}>
            {nomad.name}
          </h1>
          <span className={`mt-2 inline-block px-3 py-1 rounded text-sm font-medium text-white ${RARITY_STYLES[nomad.rarity]}`}>
            {nomad.rarity}
          </span>
          {nomad.lore && (
            <p className="mt-6 text-slate-300 leading-relaxed">{nomad.lore}</p>
          )}
          {(nomad.ability || nomad.weapon) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {nomad.ability && (
                <p><span className="text-slate-400">Ability:</span> <span className="text-neon-cyan">{nomad.ability}</span></p>
              )}
              {nomad.weapon && (
                <p><span className="text-slate-400">Weapon:</span> <span className="text-neon-purple">{nomad.weapon}</span></p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <HoloButton href="/mint" variant="gradient" size="md">
              Mint a Nomad
            </HoloButton>
            <Link href="/ar-viewer" className="inline-flex items-center rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2 text-sm text-neon-cyan hover:bg-neon-cyan/20">
              View in AR
            </Link>
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
            >
              Share on X
            </a>
            <a
              href={openseaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
            >
              OpenSea
            </a>
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
            >
              Copy link
            </button>
            <Link href="/explore" className="inline-flex items-center rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-400 hover:text-white">
              ← Explore all
            </Link>
          </div>
        </div>
      </motion.div>

      <SectionDivider />

      {/* Detailed traits */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4" style={{ textShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
          Detailed Traits
        </h2>
        <ul className="space-y-2">
          {review.detailedTraits.map((t) => (
            <li key={t.name} className="futuristic-panel rounded-lg px-4 py-3 border border-neon-cyan/20 flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-neon-cyan font-medium text-sm">{t.name}</span>
              <span className="text-slate-400 text-sm">— {t.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider />

      {/* Power levels: bars + radar */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4" style={{ textShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
          Power Levels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            {Object.entries(review.powerLevels).map(([key, value], i) => (
              <HoloStatBar
                key={key}
                label={key}
                value={value as number}
                rarity={nomad.rarity}
                tooltip={STAT_TOOLTIPS[key]}
                delay={i}
              />
            ))}
          </div>
          <div className="flex flex-col items-center justify-center">
            <RadarChart
              stats={radarStats}
              max={100}
              color={nomad.rarity === 'Legendary' ? 'rgba(234, 179, 8, 0.6)' : nomad.rarity === 'Rare' || nomad.rarity === 'Epic' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(0, 255, 255, 0.6)'}
              size={220}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Specialty */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3" style={{ textShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
          Specialty
        </h2>
        <p className="text-slate-400 leading-relaxed futuristic-panel rounded-xl p-4 border border-neon-cyan/20">
          {review.specialty}
        </p>
      </section>

      <SectionDivider />

      {/* Strengths / Weaknesses */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-neon-cyan mb-3">Strengths</h2>
          <ul className="space-y-2">
            {review.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                <span className="text-neon-cyan mt-0.5">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-neon-orange mb-3">Weaknesses</h2>
          <ul className="space-y-2">
            {review.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                <span className="text-neon-orange mt-0.5">−</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SectionDivider />

      {/* Compatibility */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4" style={{ textShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
          Compatibility
        </h2>
        <ul className="space-y-2">
          {review.compatibility.map((c) => {
            const other = nomads.find((n) => n.id === c.nomadId);
            return (
              <li key={c.nomadId} className="futuristic-panel rounded-lg px-4 py-3 border border-neon-purple/20 flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-300 text-sm">
                  {c.note}
                  {other && (
                    <Link href={`/nomads/${c.nomadId}`} className="ml-2 text-neon-cyan hover:underline text-xs">
                      View →
                    </Link>
                  )}
                </span>
                <span className="text-yellow-400 text-sm">
                  {'★'.repeat(c.stars)}{'☆'.repeat(5 - c.stars)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <SectionDivider />

      {/* Upgrade path: accordion */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4" style={{ textShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
          Upgrade Potential
        </h2>
        <AccordionSection title="Evolution path" defaultOpen={true}>
          <ul className="list-disc list-inside space-y-1">
            {review.upgradePath.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </AccordionSection>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <HoloButton href="/mint-1-20" variant="purple" size="md">
          Mint 1–20
        </HoloButton>
        <HoloButton href="/buy-21-30" variant="orange" size="md">
          Buy 21–30
        </HoloButton>
      </div>
    </div>
  );
}
