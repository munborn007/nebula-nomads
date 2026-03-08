'use client';

import { Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  position?: [number, number, number];
  width?: number;
  height?: number;
};

/** Interactive 3D button with hover scale and glow. */
export default function GlowButton({
  children,
  onClick,
  position = [0, 0, 0],
  width = 2,
  height = 0.8,
}: Props) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered ? 1.15 : 1;

  useFrame(() => {
    if (ref.current) {
      ref.current.scale.lerp(
        new THREE.Vector3().setScalar(targetScale),
        0.1
      );
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={hovered ? '#00ffff' : '#0ea5e9'}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Html center>
        <button
          type="button"
          className="text-white font-bold px-8 py-4 pointer-events-none select-none"
          style={{ fontFamily: 'var(--font-orbitron), system-ui, sans-serif' }}
        >
          {children}
        </button>
      </Html>
    </group>
  );
}
