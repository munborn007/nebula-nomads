'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import type { NomadRarity } from '@/lib/utils';

const FALLBACK_GLB = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

function getModelUrls(rarity: NomadRarity) {
  const base = `/models/nomad-${rarity}`;
  return { glb: `${base}.glb`, usdz: `${base}.usdz` };
}

function CosmicParticlesOverlay({
  glowIntensity,
  particleSpeed,
  className,
}: {
  glowIntensity: number;
  particleSpeed: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const neonPurple = new THREE.Color(0xa020f0);
    const neonCyan = new THREE.Color(0x00ffff);
    const neonPink = new THREE.Color(0xff00ff);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      const c = i % 3 === 0 ? neonPurple : i % 3 === 1 ? neonCyan : neonPink;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      transparent: true,
      size: 0.08,
      sizeAttenuation: true,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.6,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frameId = 0;
    let startTime = Date.now();
    let currentGlow = glowIntensity;
    let currentSpeed = particleSpeed;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      currentGlow += (glowIntensity - currentGlow) * 0.05;
      currentSpeed += (particleSpeed - currentSpeed) * 0.05;
      const elapsed = (Date.now() - startTime) / 1000;
      material.size = 0.08 * (0.5 + currentGlow);
      material.opacity = 0.4 + currentGlow * 0.4;
      points.rotation.y = elapsed * currentSpeed * 0.2;
      points.rotation.x = Math.sin(elapsed * 0.5) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [glowIntensity, particleSpeed]);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
}

export type NomadARViewerProps = {
  rarity?: NomadRarity;
  className?: string;
  compact?: boolean;
};

export default function NomadARViewer({
  rarity = 'common',
  className = '',
  compact = false,
}: NomadARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const [modelViewerReady, setModelViewerReady] = useState(false);
  const [awaken, setAwaken] = useState(false);
  const [instructions, setInstructions] = useState(true);
  const [orientation, setOrientation] = useState({ alpha: 0.5, beta: 0.5, gamma: 0.5 });
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    setShareSupported(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function'
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    import('@google/model-viewer').then(() => {
      if (cancelled) return;
      setModelViewerReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!modelViewerReady || !containerRef.current) return;
    const { glb, usdz } = getModelUrls(rarity);
    let cancelled = false;
    fetch(glb, { method: 'HEAD' })
      .then((r) => {
        if (cancelled) return null;
        return r.ok ? glb : null;
      })
      .catch(() => null)
      .then((src) => {
        if (cancelled || !containerRef.current) return;
        const el = document.createElement('model-viewer');
        el.setAttribute('src', src ?? FALLBACK_GLB);
        if (src) el.setAttribute('ios-src', usdz);
        el.setAttribute('ar', '');
        el.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
        el.setAttribute('ar-scale', 'auto');
        el.setAttribute('camera-controls', '');
        el.setAttribute('auto-rotate', '');
        el.setAttribute('shadow-intensity', '1');
        el.setAttribute('xr-environment', '');
        el.setAttribute('alt', 'AR Nebula Nomad');
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.minHeight = compact ? '200px' : '70vh';
        el.addEventListener('error', () => {
          el.setAttribute('src', FALLBACK_GLB);
          el.removeAttribute('ios-src');
        });
        containerRef.current.appendChild(el);
        modelViewerRef.current = el;
      });
    return () => {
      cancelled = true;
      const el = modelViewerRef.current;
      if (el && el.parentNode) el.remove();
      modelViewerRef.current = null;
    };
  }, [modelViewerReady, rarity, compact]);

  useEffect(() => {
    const el = modelViewerRef.current;
    if (!el) return;
    if (awaken) el.classList.add('nomad-breathe');
    else el.classList.remove('nomad-breathe');
  }, [awaken]);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const a = e.alpha != null ? e.alpha / 360 : 0.5;
      const b = e.beta != null ? e.beta / 180 : 0.5;
      const g = e.gamma != null ? (e.gamma / 90) * 0.5 + 0.5 : 0.5;
      setOrientation({ alpha: a, beta: b, gamma: g });
    };
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handler);
      return () => window.removeEventListener('deviceorientation', handler);
    }
  }, []);

  const glowIntensity = 0.5 + (orientation.alpha + orientation.beta + orientation.gamma) / 6;
  const particleSpeed = 0.5 + orientation.gamma;

  const handleShare = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#030712',
        scale: 0.75,
      });
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, 'image/png', 0.9)
      );
      if (blob && shareSupported) {
        const file = new File([blob], 'ar-nomad.png', { type: 'image/png' });
        await navigator.share({
          title: 'My AR Nomad | Nebula Nomads',
          text: 'My AR Nomad from @NomadsOfNebula! #NebulaNomads',
          files: [file],
        });
      } else {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          'My AR Nomad from @NomadsOfNebula! #NebulaNomads'
        )}`;
        window.open(url, '_blank');
      }
    } catch {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        'My AR Nomad from @NomadsOfNebula! #NebulaNomads'
      )}`;
      window.open(url, '_blank');
    }
  }, [shareSupported]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 ${className}`}
      style={{
        minHeight: compact ? 200 : '70vh',
        borderColor: 'rgba(160,32,240,0.5)',
        boxShadow: '0 0 40px rgba(160,32,240,0.3), inset 0 0 30px rgba(0,255,255,0.02)',
        background: 'rgba(10,0,26,0.4)',
      }}
    >
      <div
        ref={containerRef}
        className="relative h-full w-full"
        style={{ minHeight: compact ? 200 : '70vh' }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <CosmicParticlesOverlay
          glowIntensity={glowIntensity}
          particleSpeed={particleSpeed}
          className="w-full h-full"
        />
      </div>
      {instructions && !compact && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#0a001a]/70 backdrop-blur-sm"
          role="button"
          tabIndex={0}
          onClick={() => setInstructions(false)}
          onKeyDown={(e) => e.key === 'Enter' && setInstructions(false)}
        >
          <p
            className="text-center text-lg px-4"
            style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 0 20px rgba(0,255,255,0.6)' }}
          >
            Tap to place your Nomad in the real world (AR) or explore in 3D.
          </p>
        </div>
      )}
      {!compact && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
          <motion.button
            type="button"
            onClick={() => setAwaken((a) => !a)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border-2 px-4 py-2 text-sm font-medium backdrop-blur"
            style={{
              borderColor: awaken ? '#00ffff' : '#ff00ff',
              color: awaken ? '#00ffff' : '#ff00ff',
              background: 'rgba(10,0,26,0.8)',
              boxShadow: awaken
                ? '0 0 25px rgba(0,255,255,0.6)'
                : '0 0 25px rgba(255,0,255,0.5)',
            }}
          >
            {awaken ? 'Pause' : 'Awaken'}
          </motion.button>
          <motion.button
            type="button"
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border-2 border-neon-purple/60 bg-[#0a001a]/80 px-4 py-2 text-sm font-medium text-neon-purple backdrop-blur hover:shadow-[0_0_20px_rgba(160,32,240,0.5)]"
          >
            Share AR View
          </motion.button>
        </div>
      )}
    </div>
  );
}
