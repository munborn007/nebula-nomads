'use client';

import dynamic from 'next/dynamic';

/**
 * Lazy-load NebulaParticles after hydration for performance.
 * Renders behind CosmicBackground for extra nebula spark depth.
 */
const NebulaParticles = dynamic(() => import('@/components/NebulaParticles'), {
  ssr: false,
  loading: () => null,
});

export default function NebulaParticlesWrapper() {
  return <NebulaParticles />;
}
