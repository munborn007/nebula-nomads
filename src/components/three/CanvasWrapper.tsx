'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';

type Props = {
  children: ReactNode;
  className?: string;
  camera?: Partial<{
    position: [number, number, number];
    fov: number;
    near: number;
    far: number;
  }>;
  controls?: boolean;
  /** "always" for animated scenes (cosmic bg), "demand" for interactive-only (NFT viewer) */
  frameloop?: 'always' | 'demand';
  /** Adaptive DPR 1-1.5 per 2026 best practices */
  flat?: boolean;
};

export default function CanvasWrapper({
  children,
  className = '',
  camera = { position: [0, 0, 5], fov: 50 },
  controls = false,
  frameloop = 'always',
  flat,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => ref.current?.dispatchEvent(new Event('resize'));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={ref} className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={camera}
        frameloop={frameloop}
        flat={flat}
        onCreated={({ gl, scene }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          scene.background = new THREE.Color('#020408');
          scene.fog = new THREE.Fog('#020408', 10, 50);
        }}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
