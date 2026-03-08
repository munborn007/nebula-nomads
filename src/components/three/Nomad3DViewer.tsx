'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/** 3D NFT viewer — rotate/zoom with OrbitControls. Glowing sphere placeholder (glb coming soon). */
function NomadModel({ color = '#a020f0' }: { color?: string }) {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

type Props = {
  nomadId: number;
  color?: string;
  className?: string;
};

export default function Nomad3DViewer({ nomadId, color = '#a020f0', className = '' }: Props) {
  return (
    <div className={`w-full aspect-square rounded-xl overflow-hidden border border-neon-cyan/30 bg-black/40 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <NomadModel color={color} />
          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={1.5}
            maxDistance={6}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
