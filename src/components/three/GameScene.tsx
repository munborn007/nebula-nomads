'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/lib/game-state';

const MOVE_SPEED = 0.15;
const SHARD_COLLECT_RADIUS = 1.2;
const SHARD_POSITIONS: { id: string; x: number; y: number; z: number }[] = [];
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2 + i * 0.4;
  const r = 3 + (i % 4) * 1.5;
  SHARD_POSITIONS.push({
    id: `shard-${i}`,
    x: Math.cos(angle) * r,
    y: 0.3 + (i % 3) * 0.4,
    z: Math.sin(angle) * r,
  });
}

/** Game scene: avatar (Nomad), WASD movement, collect shards, ability FX. */
export default function GameScene({
  onReady,
  className = '',
  ownedNomadIds = [],
}: {
  onReady?: () => void;
  className?: string;
  ownedNomadIds?: number[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const storeRef = useRef(useGameStore.getState());

  useEffect(() => {
    useGameStore.subscribe((s) => { storeRef.current = s; });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth <= 768;
    const starCount = isMobile ? 800 : 2000;
    const nebulaCount = isMobile ? 300 : 600;
    const islandCount = isMobile ? 3 : 6;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050510');
    scene.fog = new THREE.FogExp2('#050510', 0.035);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    let controls: { update: () => void; dispose: () => void } | null = null;
    import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls: OC }) => {
      controls = new OC(camera, renderer.domElement);
      (controls as InstanceType<typeof OC>).enableZoom = true;
      (controls as InstanceType<typeof OC>).enablePan = false;
      (controls as InstanceType<typeof OC>).minPolarAngle = Math.PI / 6;
      (controls as InstanceType<typeof OC>).maxPolarAngle = Math.PI / 2;
      (controls as InstanceType<typeof OC>).autoRotate = false;
    });

    scene.add(new THREE.AmbientLight(0x333355, 0.6));
    const p1 = new THREE.PointLight(0xa020f0, 1.5, 30);
    p1.position.set(4, 3, 2);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x00ffff, 1, 25);
    p2.position.set(-3, 2, 4);
    scene.add(p2);
    const pulsar = new THREE.PointLight(0x00ffff, 0.8, 15);
    pulsar.position.set(0, 1, 0);
    scene.add(pulsar);

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.08, color: 0xffffff, transparent: true, opacity: 0.85, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false })));

    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      nebulaPos[i * 3] = (Math.random() - 0.5) * 40;
      nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      nebulaPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    scene.add(new THREE.Points(nebulaGeo, new THREE.PointsMaterial({ size: 0.2, color: 0x00ffff, transparent: true, opacity: 0.35, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false })));

    const nexusGeo = new THREE.CylinderGeometry(2, 2.5, 0.6, 16);
    const nexus = new THREE.Mesh(nexusGeo, new THREE.MeshStandardMaterial({ color: 0xa020f0, transparent: true, opacity: 0.85, emissive: 0xa020f0, emissiveIntensity: 0.4 }));
    nexus.position.set(0, -0.8, 0);
    scene.add(nexus);

    const islandColors = [0xa020f0, 0x00ffff, 0xff4500, 0xff00ff];
    const islands: THREE.Mesh[] = [];
    for (let i = 0; i < islandCount; i++) {
      const radius = 1.5 + Math.random() * 1;
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.3, radius, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: islandColors[i % islandColors.length], transparent: true, opacity: 0.8, emissive: islandColors[i % islandColors.length], emissiveIntensity: 0.3 })
      );
      const angle = (i / islandCount) * Math.PI * 2 + Math.random() * 0.5;
      const r = 4 + Math.random() * 3;
      const baseY = -0.5 + Math.random() * 1;
      mesh.position.set(Math.cos(angle) * r, baseY, Math.sin(angle) * r);
      (mesh as THREE.Mesh & { baseY?: number }).baseY = baseY;
      scene.add(mesh);
      islands.push(mesh);
    }

    // Player avatar (Nomad)
    const avatarGeo = new THREE.SphereGeometry(0.35, 20, 16);
    const avatarMat = new THREE.MeshStandardMaterial({ color: 0xa020f0, emissive: 0xa020f0, emissiveIntensity: 0.4 });
    const playerAvatar = new THREE.Mesh(avatarGeo, avatarMat);
    playerAvatar.position.set(0, 0.5, 0);
    scene.add(playerAvatar);

    // Cosmic shards (collectibles)
    const shardMeshes: { id: string; mesh: THREE.Mesh }[] = [];
    SHARD_POSITIONS.forEach(({ id, x, y, z }) => {
      const geo = new THREE.OctahedronGeometry(0.15, 0);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { shardId: id };
      scene.add(mesh);
      shardMeshes.push({ id, mesh });
    });

    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const ground = new THREE.Mesh(groundGeo, new THREE.MeshBasicMaterial({ color: 0x0a001a, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let raf: number;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const store = storeRef.current;

      // WASD movement
      let dx = 0, dz = 0, dy = 0;
      if (keysRef.current['w']) dz -= 1;
      if (keysRef.current['s']) dz += 1;
      if (keysRef.current['a']) dx -= 1;
      if (keysRef.current['d']) dx += 1;
      if (keysRef.current[' ']) dy += 1;
      if (keysRef.current['shift']) dy -= 1;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const nx = store.x + (dx / len) * MOVE_SPEED;
      const nz = store.z + (dz / len) * MOVE_SPEED;
      const ny = Math.max(0.1, Math.min(4, store.y + (dy / len) * MOVE_SPEED));
      useGameStore.getState().setPosition(nx, ny, nz);

      playerAvatar.position.set(nx, ny, nz);
      if (dx !== 0 || dz !== 0) playerAvatar.rotation.y = Math.atan2(-dx, -dz);

      // Collect shards
      shardMeshes.forEach(({ id, mesh }) => {
        if (!mesh.visible) return;
        const dx2 = mesh.position.x - nx;
        const dy2 = mesh.position.y - ny;
        const dz2 = mesh.position.z - nz;
        const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2);
        if (dist < SHARD_COLLECT_RADIUS && useGameStore.getState().collectShard(id)) {
          mesh.visible = false;
        }
      });

      useGameStore.getState().tickAbilities();

      nexus.position.y = -0.8 + Math.sin(t * 0.4) * 0.08;
      pulsar.intensity = 0.6 + Math.sin(t * 2) * 0.2;
      islands.forEach((m, i) => {
        const baseY = (m as THREE.Mesh & { baseY?: number }).baseY ?? m.position.y;
        m.position.y = baseY + Math.sin(t * 0.5 + i) * 0.15;
        m.rotation.y += 0.002;
      });
      shardMeshes.forEach(({ mesh }, i) => {
        if (mesh.visible) {
          mesh.rotation.y += 0.02;
          mesh.position.y += Math.sin(t + i * 0.5) * 0.001;
        }
      });

      if (controls) controls.update();
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

    onReady?.();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      controls?.dispose?.();
      renderer.dispose();
      if (container?.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [onReady, ownedNomadIds]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-neon-cyan/30 ${className}`}
      style={{ minHeight: 450 }}
      tabIndex={0}
    />
  );
}
