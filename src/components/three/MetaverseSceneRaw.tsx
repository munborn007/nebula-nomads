'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/** Raw Three.js metaverse scene — no R3F (React 19 compatible). */
export default function MetaverseSceneRaw({
  onReady,
  className = '',
}: {
  onReady?: () => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth <= 768;
    const starCount = isMobile ? 800 : 2000;
    const nebulaCount = isMobile ? 300 : 600;
    const islandCount = isMobile ? 3 : 6;
    const avatarCount = isMobile ? 4 : 10;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050510');
    scene.fog = new THREE.FogExp2('#050510', 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // OrbitControls for walkthrough feel (dynamic import for SSR)
    let controls: { update: () => void; dispose: () => void } | null = null;
    import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls: OC }) => {
      controls = new OC(camera, renderer.domElement);
      (controls as InstanceType<typeof OC>).enableZoom = true;
      (controls as InstanceType<typeof OC>).enablePan = false;
      (controls as InstanceType<typeof OC>).minPolarAngle = Math.PI / 4;
      (controls as InstanceType<typeof OC>).maxPolarAngle = Math.PI / 2;
      (controls as InstanceType<typeof OC>).autoRotate = true;
      (controls as InstanceType<typeof OC>).autoRotateSpeed = 0.3;
    });

    // Lights
    scene.add(new THREE.AmbientLight(0x333355, 0.6));
    const p1 = new THREE.PointLight(0xa020f0, 1.5, 30);
    p1.position.set(4, 3, 2);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x00ffff, 1, 25);
    p2.position.set(-3, 2, 4);
    scene.add(p2);
    const p3 = new THREE.PointLight(0xff4500, 0.5, 20);
    p3.position.set(-2, 4, -3);
    scene.add(p3);
    // Pulsar light (Nebula Nexus)
    const pulsar = new THREE.PointLight(0x00ffff, 0.8, 15);
    pulsar.position.set(0, 1, 0);
    scene.add(pulsar);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Nebula particles
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      nebulaPos[i * 3] = (Math.random() - 0.5) * 40;
      nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      nebulaPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    const nebulaMat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(nebulaGeo, nebulaMat));

    // Nebula Nexus — central hub (larger platform)
    const nexusGeo = new THREE.CylinderGeometry(2, 2.5, 0.6, 16);
    const nexusMat = new THREE.MeshStandardMaterial({
      color: 0xa020f0,
      transparent: true,
      opacity: 0.85,
      emissive: 0xa020f0,
      emissiveIntensity: 0.4,
    });
    const nexus = new THREE.Mesh(nexusGeo, nexusMat);
    nexus.position.set(0, -0.8, 0);
    nexus.userData = { type: 'nexus' };
    scene.add(nexus);

    // Floating islands (battle arena, mint zone, social lounge)
    const islandColors = [0xa020f0, 0x00ffff, 0xff4500, 0xff00ff];
    const islands: THREE.Mesh[] = [];
    for (let i = 0; i < islandCount; i++) {
      const radius = 1.5 + Math.random() * 1;
      const geo = new THREE.CylinderGeometry(radius * 0.3, radius, 0.5, 8);
      const mat = new THREE.MeshStandardMaterial({
        color: islandColors[i % islandColors.length],
        transparent: true,
        opacity: 0.8,
        emissive: islandColors[i % islandColors.length],
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / islandCount) * Math.PI * 2 + Math.random() * 0.5;
      const r = 4 + Math.random() * 3;
      mesh.position.set(Math.cos(angle) * r, -0.5 + Math.random() * 1, Math.sin(angle) * r);
      mesh.rotation.x = Math.random() * 0.2;
      mesh.rotation.z = Math.random() * 0.2;
      mesh.userData = { type: 'island', id: i };
      scene.add(mesh);
      islands.push(mesh);
    }

    // Nomad avatars (placeholder spheres — glb coming)
    const avatarColors = [0xa020f0, 0x00ffff, 0xff4500, 0xff00ff, 0xeab308];
    const avatars: THREE.Mesh[] = [];
    for (let i = 0; i < avatarCount; i++) {
      const geo = new THREE.SphereGeometry(0.25 + (i % 3) * 0.05, 16, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: avatarColors[i % avatarColors.length],
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / avatarCount) * Math.PI * 2 + (i * 0.3) % 1;
      const r = 2.5 + (i % 3) * 0.8;
      mesh.position.set(Math.cos(angle) * r, 0.2 + (i % 5) * 0.1, Math.sin(angle) * r);
      mesh.userData = { type: 'avatar', id: i };
      scene.add(mesh);
      avatars.push(mesh);
    }

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x0a001a,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    let raf: number;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (controls) controls.update();
      // Nexus + islands gentle float
      nexus.position.y = -0.8 + Math.sin(t * 0.4) * 0.08;
      pulsar.intensity = 0.6 + Math.sin(t * 2) * 0.2;
      islands.forEach((m, i) => {
        m.position.y = -0.5 + Math.sin(t * 0.5 + i) * 0.15;
        m.rotation.y += 0.002;
      });
      // Avatars gentle float
      avatars.forEach((m, i) => {
        m.position.y = 0.2 + Math.sin(t * 0.6 + i * 0.5) * 0.1;
      });
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      if (!container?.parentElement) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    setLoaded(true);
    onReady?.();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      controls?.dispose?.();
      renderer.dispose();
      if (container?.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [onReady]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden border border-neon-cyan/30 ${className}`}
      style={{ minHeight: 400 }}
    />
  );
}
