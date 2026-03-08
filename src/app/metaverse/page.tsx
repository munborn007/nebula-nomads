'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Metaverse3D = dynamic(() => import('@/components/three/Metaverse3D'), { ssr: false });

export default function MetaversePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1
          className="font-display text-3xl font-bold text-white sm:text-4xl"
          style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
        >
          Metaverse Preview
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
          Walk through the cosmic void. Nomad avatars (placeholder spheres) — full 3D world & glb avatars coming Q3 2026.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="futuristic-panel rounded-2xl p-4 sm:p-6 data-grid-bg"
      >
        <Metaverse3D />
        <p className="mt-4 text-xs text-slate-500 text-center">
          Use AR Viewer for mobile AR. GLB 3D models placeholder — add <code className="text-neon-cyan/80">public/models/nomad.glb</code> for full avatars.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/ar-viewer" className="holo-card rounded-xl px-6 py-3 text-neon-cyan hover:text-white transition">
          View in AR
        </Link>
        <Link href="/explore" className="futuristic-panel rounded-xl px-6 py-3 text-slate-300 hover:text-neon-cyan transition">
          Explore Nomads
        </Link>
      </div>
    </div>
  );
}
