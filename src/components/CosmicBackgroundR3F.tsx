'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import CosmicScene from './three/CosmicScene';
import PostProcessing from './three/PostProcessing';
import * as THREE from 'three';

/** R3F cosmic background — replaces raw Three.js CosmicBackground. */
function CosmicCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
      onCreated={({ gl, scene }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        scene.background = new THREE.Color('#020408');
        scene.fog = new THREE.Fog('#020408', 10, 50);
      }}
    >
      <Suspense fallback={null}>
        <CosmicScene />
        <PostProcessing />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

export default function CosmicBackgroundR3F() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
      style={{ background: '#020408' }}
    >
      <CosmicCanvas />
    </div>
  );
}
