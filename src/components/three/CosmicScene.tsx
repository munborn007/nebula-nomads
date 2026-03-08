'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Particle counts: reduced on mobile for 60fps. */
const useMobileStars = () => {
  if (typeof window === 'undefined') return 1200;
  return window.innerWidth <= 768 ? 1200 : 2500;
};

const useMobileNebula = () => {
  if (typeof window === 'undefined') return 400;
  return window.innerWidth <= 768 ? 400 : 800;
};

/** Instanced starfield for performance. */
function StarField() {
  const count = useMobileStars();
  const mesh = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      const c = Math.random();
      col[i * 3] = c * 0.5 + 0.5;
      col[i * 3 + 1] = c * 0.3 + 0.7;
      col[i * 3 + 2] = 1;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }, [count]);

  return <primitive object={mesh} />;
}

/** Nebula glow particles. */
function NebulaParticles() {
  const count = useMobileNebula();
  const mesh = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }, [count]);

  return <primitive object={mesh} />;
}

/** Floating debris planes. */
function Debris({ count = 12 }: { count?: number }) {
  const group = useMemo(() => {
    const g = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const w = 0.3 + (i % 5) * 0.15;
      const geo = new THREE.PlaneGeometry(w, w * 0.6);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xa020f0 : i % 3 === 1 ? 0xff4500 : 0x00ffff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set((i * 1.2 - 6) * 2, (i % 4 - 2) * 4, (i * 0.8 - 5) * 3);
      m.rotation.set((i * 0.5) % 6, (i * 0.7) % 6, 0);
      g.add(m);
    }
    return g;
  }, [count]);

  useFrame((_, delta) => {
    group.rotation.y += delta * 0.02;
    group.rotation.x += delta * 0.01;
  });

  return <primitive object={group} />;
}

/** Rotating spaceship (placeholder geometry). */
function Spaceship() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const ship = useMemo(() => {
    const g = new THREE.Group();
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.7, 6),
      new THREE.MeshBasicMaterial({ color: 0xa020f0, transparent: true, opacity: 0.8 })
    );
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.2, 0.4),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 })
    );
    box.position.z = -0.5;
    g.add(cone);
    g.add(box);
    g.position.set(3, 0, -2);
    return g;
  }, []);

  useFrame((state) => {
    if (!isMobile && ship) {
      const t = state.clock.elapsedTime;
      ship.position.x = 3 + Math.sin(t * 0.2) * 2;
      ship.position.z = -2 + ((t * 0.15) % 6) - 3;
      ship.rotation.y = -t * 0.15;
    }
  });

  if (isMobile) return null;
  return <primitive object={ship} />;
}

/** Parallax camera from scroll (injected via useThree / store). */
function ParallaxCamera() {
  useFrame(({ camera }) => {
    if (typeof window === 'undefined') return;
    const parallaxY = Math.min(window.scrollY * 0.0002, 1.2);
    camera.position.y = parallaxY;
    camera.lookAt(0, parallaxY, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function CosmicScene() {
  return (
    <>
      <StarField />
      <NebulaParticles />
      <Debris />
      <Spaceship />
      <ParallaxCamera />
    </>
  );
}
