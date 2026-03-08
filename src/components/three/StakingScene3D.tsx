'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Animated lock icon + floating particles for staking dashboard. */
function LockIcon() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.2]} />
        <meshBasicMaterial color="#a020f0" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/** Reward particles burst. */
function RewardParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 32;
  const [positions] = (() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return [pos] as const;
  })();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * 0.2;
      ref.current.rotation.x = t * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00ffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function StakingScene3D() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[2, 2, 2]} color="#00ffff" intensity={1} />
      <pointLight position={[-2, -1, 2]} color="#a020f0" intensity={0.5} />
      <LockIcon />
      <RewardParticles />
    </>
  );
}
