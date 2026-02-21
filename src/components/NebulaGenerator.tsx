'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { hashToSeed, seededRandom, seedToColor } from '@/utils/cosmicSeed';

export type NebulaGeneratorProps = {
  seedInput?: string;
  mouseX?: number;
  mouseY?: number;
  className?: string;
  interactive?: boolean;
};

export default function NebulaGenerator({
  seedInput = '',
  mouseX = 0.5,
  mouseY = 0.5,
  className = '',
  interactive = true,
}: NebulaGeneratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: mouseX, y: mouseY });
  const cleanupRef = useRef<(() => void) | null>(null);
  const [mounted, setMounted] = useState(false);

  mouseRef.current = { x: mouseX, y: mouseY };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!mounted || !container) return;

    const seed = hashToSeed(seedInput || 'nebula-nomads');
    const rng = seededRandom(seed);
    const color = seedToColor(seed);

    let cancelled = false;
    import('three').then((THREE) => {
      if (cancelled) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x030712, 0);
      container.appendChild(renderer.domElement);

      const starCount = 2000;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (rng() - 0.5) * 20;
        starPositions[i * 3 + 1] = (rng() - 0.5) * 20;
        starPositions[i * 3 + 2] = (rng() - 0.5) * 20;
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starColors = [0xffffff, 0xa020f0, 0xff00ff, 0x00ffff];
      const starColor = starColors[Math.floor(rng() * starColors.length)];
      const starMaterial = new THREE.PointsMaterial({
        color: starColor,
        size: 0.025 + rng() * 0.035,
        transparent: true,
        opacity: 0.7 + rng() * 0.3,
      });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      const nebulaUniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(mouseX, mouseY) },
        uSeed: { value: seed },
        uColor: { value: new THREE.Vector3(color.r, color.g, color.b) },
      };
      const nebulaGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);
      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: nebulaUniforms,
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uSeed;
          uniform vec3 uColor;
          varying vec2 vUv;
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            p += uSeed * 0.01;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return v;
          }
          void main() {
            vec2 uv = vUv - 0.5;
            uv *= 2.0;
            vec2 m = (uMouse - 0.5) * 2.0;
            uv += m * 0.3;
            float n = fbm(uv * 1.5 + uTime * 0.05);
            float n2 = fbm(uv * 2.0 - uTime * 0.03 + 100.0);
            float clouds = smoothstep(0.35, 0.7, n) * smoothstep(0.2, 0.6, n2);
            vec3 neon = vec3(0.63, 0.0, 0.94);
            vec3 mixColor = mix(uColor, neon, 0.3);
            vec3 col = mixColor * (0.4 + clouds * 0.8);
            float alpha = clouds * 0.5 + 0.08;
            gl_FragColor = vec4(col, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
      });
      const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      nebulaMesh.position.z = -3;
      scene.add(nebulaMesh);

      let frameId: number;
      const animate = () => {
        if (cancelled) return;
        const m = mouseRef.current;
        nebulaUniforms.uTime.value += 0.016;
        nebulaUniforms.uMouse.value.set(m.x * 2 - 1, -(m.y * 2 - 1));
        stars.rotation.y += 0.0002;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      cleanupRef.current = () => {
        cancelled = true;
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        nebulaGeometry.dispose();
        (nebulaMaterial as { dispose: () => void }).dispose();
        starGeometry.dispose();
        starMaterial.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [mounted, seedInput]);

  if (!mounted) return <div className={`nebula-canvas-container ${className}`} />;
  return (
    <div
      ref={containerRef}
      className={`nebula-canvas-container ${interactive ? 'interactive' : ''} ${className}`}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    />
  );
}
