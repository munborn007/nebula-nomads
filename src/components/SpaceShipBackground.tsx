'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

/** 3D starfield + spaceship fly-by for mint-1-20 / buy-21-30. Raw Three.js to avoid R3F JSX type issues. */
export default function SpaceShipBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.Fog('#030712', 5, 25);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Starfield
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Ship (cone + box)
    const ship = new THREE.Group();
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.2, 8),
      new THREE.MeshBasicMaterial({ color: 0xa020f0, transparent: true, opacity: 0.9 })
    );
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.3, 0.6),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.85 })
    );
    box.position.z = -0.8;
    ship.add(cone);
    ship.add(box);
    ship.add(new THREE.PointLight(0x00ffff, 2, 5));
    scene.add(ship);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      stars.rotation.y = t * 0.02;
      ship.position.x = Math.sin(t * 0.15) * 8 - 4;
      ship.position.z = ((t * 0.15 * 3) % 20) - 10;
      ship.position.y = Math.sin(t * 0.105) * 2;
      ship.rotation.y = -t * 0.075;
      ship.rotation.x = Math.sin(t * 0.075) * 0.2;
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
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
