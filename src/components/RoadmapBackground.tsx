'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Roadmap page 3D background: dense nebula, galaxy-style particles,
 * floating debris, mouse parallax. Raw Three.js for stability (no R3F).
 * Optimized for 60fps; reduced particles on mobile.
 */
export default function RoadmapBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 768px)');
    queueMicrotask(() => setReduced(m.matches));
    const fn = () => setReduced(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.02);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Dense starfield
    const starCount = reduced ? 2000 : 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      const r = Math.random();
      starCol[i * 3] = 0.4 + r * 0.6;
      starCol[i * 3 + 1] = 0.3 + r * 0.5;
      starCol[i * 3 + 2] = 0.9 + r * 0.1;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: reduced ? 0.04 : 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Nebula clouds (blue / purple / orange)
    const nebulaCount = reduced ? 600 : 1200;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaCol = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      nebulaPos[i * 3] = (Math.random() - 0.5) * 45;
      nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      nebulaPos[i * 3 + 2] = (Math.random() - 0.5) * 35;
      const pick = Math.floor(Math.random() * 3);
      if (pick === 0) {
        nebulaCol[i * 3] = 0.2; nebulaCol[i * 3 + 1] = 0.5; nebulaCol[i * 3 + 2] = 1;
      } else if (pick === 1) {
        nebulaCol[i * 3] = 0.6; nebulaCol[i * 3 + 1] = 0.2; nebulaCol[i * 3 + 2] = 1;
      } else {
        nebulaCol[i * 3] = 1; nebulaCol[i * 3 + 1] = 0.35; nebulaCol[i * 3 + 2] = 0.1;
      }
    }
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaCol, 3));
    const nebulaMat = new THREE.PointsMaterial({
      size: reduced ? 0.15 : 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(nebulaGeo, nebulaMat));

    // Floating debris / asteroids (low-poly planes)
    const debrisCount = reduced ? 10 : 18;
    const debrisGroup = new THREE.Group();
    for (let i = 0; i < debrisCount; i++) {
      const w = 0.4 + Math.random() * 1.2;
      const geo = new THREE.PlaneGeometry(w, w * 0.7);
      const hue = i % 3 === 0 ? 0xa020f0 : i % 3 === 1 ? 0xff4500 : 0x00ffff;
      const mat = new THREE.MeshBasicMaterial({
        color: hue,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 25);
      mesh.rotation.set(Math.random() * 6, Math.random() * 6, 0);
      debrisGroup.add(mesh);
    }
    scene.add(debrisGroup);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      debrisGroup.rotation.y = t * 0.015;
      debrisGroup.rotation.x = t * 0.008;
      const mx = (mouseRef.current.x - 0.5) * 0.8;
      const my = (mouseRef.current.y - 0.5) * 0.8;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, my, 0.02);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [reduced]);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />;
}
