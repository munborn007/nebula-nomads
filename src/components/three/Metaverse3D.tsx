'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import MetaverseSceneR3F from './MetaverseSceneR3F';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

export default function Metaverse3D() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden border border-neon-cyan/30">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        onCreated={({ gl, scene }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          scene.background = new THREE.Color('#050510');
          scene.fog = new THREE.Fog('#050510', 10, 50);
        }}
      >
        <Suspense fallback={null}>
          <MetaverseSceneR3F />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
