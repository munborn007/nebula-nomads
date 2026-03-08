'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import StakingScene3D from './StakingScene3D';

export default function Staking3DBlock() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-neon-cyan/30 bg-black/40">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <StakingScene3D />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
