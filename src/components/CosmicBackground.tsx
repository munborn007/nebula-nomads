'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/** Particle counts: reduced on mobile for 60fps. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 768px)');
    queueMicrotask(() => setReduced(m.matches));
    const fn = () => setReduced(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);
  return reduced;
}

/**
 * Advanced 3D cosmic background: nebula starfield, bloom postprocessing,
 * floating debris, optional parallax on scroll. Optimized for 60fps.
 */
export default function CosmicBackground({ variant = 'default' }: { variant?: 'default' | 'withShip' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.028);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    const starCount = reduced ? 1200 : 2500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      const c = Math.random();
      starCol[i * 3] = c * 0.5 + 0.5;
      starCol[i * 3 + 1] = c * 0.3 + 0.7;
      starCol[i * 3 + 2] = 1;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    const nebulaCount = reduced ? 400 : 800;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      nebulaPos[i * 3] = (Math.random() - 0.5) * 35;
      nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      nebulaPos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    const nebulaMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(nebulaGeo, nebulaMat));

    const debrisCount = reduced ? 6 : 12;
    const debrisGroup = new THREE.Group();
    for (let i = 0; i < debrisCount; i++) {
      const w = 0.3 + Math.random() * 0.8;
      const geo = new THREE.PlaneGeometry(w, w * 0.6);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xa020f0 : i % 3 === 1 ? 0xff4500 : 0x00ffff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 20);
      mesh.rotation.set(Math.random() * 6, Math.random() * 6, 0);
      debrisGroup.add(mesh);
    }
    scene.add(debrisGroup);

    let ship: THREE.Group | null = null;
    if (variant === 'withShip') {
      ship = new THREE.Group();
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.7, 6),
        new THREE.MeshBasicMaterial({ color: 0xa020f0, transparent: true, opacity: 0.8 })
      );
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.4),
        new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 })
      );
      box.position.z = -0.5;
      ship.add(cone);
      ship.add(box);
      ship.position.set(3, 0, -2);
      scene.add(ship);
    }

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      debrisGroup.rotation.y = t * 0.02;
      debrisGroup.rotation.x = t * 0.01;
      if (ship) {
        ship.position.x = 3 + Math.sin(t * 0.2) * 2;
        ship.position.z = -2 + (t * 0.15) % 6 - 3;
        ship.rotation.y = -t * 0.15;
      }
      const parallaxY = Math.min(scrollY * 0.0002, 1.2);
      camera.position.y = parallaxY;
      camera.lookAt(0, parallaxY, 0);
      camera.updateProjectionMatrix();
      bloomPass.resolution.set(window.innerWidth, window.innerHeight);
      composer.render();
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      bloomPass.resolution.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      composer.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [variant, reduced]);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />;
}
