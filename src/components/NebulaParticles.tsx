'use client';

import { useEffect, useState } from 'react';
import type { ISourceOptions } from '@tsparticles/engine';

type ParticlesComponent = React.ComponentType<{
  id: string;
  options: ISourceOptions;
  className?: string;
}>;

/**
 * Lazy-loaded nebula spark particles (tsparticles) for background depth.
 * Renders behind content; reduced on mobile for performance.
 */
export default function NebulaParticles() {
  const [Particles, setParticles] = useState<ParticlesComponent | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(max-width: 768px)');
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    import('@tsparticles/react').then(({ initParticlesEngine, default: P }) => {
      initParticlesEngine(async (engine) => {
        const { loadSlim } = await import('@tsparticles/slim');
        await loadSlim(engine);
      }).then(() => setParticles(() => P));
    });
  }, []);

  if (!Particles) return null;

  const options: ISourceOptions = {
    fullScreen: { enable: true, zIndex: 0 },
    particles: {
      number: { value: reduced ? 40 : 80 },
      color: { value: ['#00ffff', '#a020f0', '#ff4500'] },
      opacity: { value: { min: 0.1, max: 0.4 } },
      size: { value: { min: 0.5, max: 1.5 } },
      move: {
        enable: true,
        speed: 0.3,
        direction: 'none',
        random: true,
        outModes: { default: 'out' },
      },
      links: { enable: false },
    },
    background: { color: 'transparent' },
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Particles id="nebula-particles" options={options} className="w-full h-full" />
    </div>
  );
}
