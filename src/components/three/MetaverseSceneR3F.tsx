'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = [0xa020f0, 0x00ffff, 0xff4500, 0xff00ff];

/** Nomad avatars as glowing spheres — placeholder for glb. */
function NomadAvatars({ count = 12 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (i * 0.1) % 0.5;
      const r = 2 + (i % 3) * 0.6;
      return {
        x: Math.cos(angle) * r,
        y: (i % 5) * 0.1,
        z: Math.sin(angle) * r,
        size: 0.25 + (i % 4) * 0.03,
        color: COLORS[i % COLORS.length],
      };
    });
  }, [count]);

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((c, i) => {
        (c as THREE.Mesh).position.y = positions[i].y + Math.sin(state.clock.elapsedTime + i) * 0.1;
      });
    }
  });

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 16, 12]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function MetaverseSceneR3F() {
  return (
    <>

      <ambientLight intensity={0.6} color="#333355" />
      <pointLight position={[4, 3, 2]} color="#a020f0" intensity={1.5} distance={30} />
      <pointLight position={[-3, 2, 4]} color="#00ffff" intensity={1} distance={25} />

      <NomadAvatars count={12} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0a001a" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls
        enableZoom
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}
