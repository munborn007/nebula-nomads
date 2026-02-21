'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { hashToSeed } from '@/utils/cosmicSeed';

const NebulaGenerator = dynamic(() => import('@/components/NebulaGenerator'), { ssr: false });

export type CosmicEchoProps = {
  defaultSeed?: string;
  onSeedChange?: (seed: string) => void;
  children?: React.ReactNode;
};

export default function CosmicEcho({ defaultSeed = '', onSeedChange, children }: CosmicEchoProps) {
  const [seedInput, setSeedInput] = useState(defaultSeed);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const updateAudio = useCallback((mx: number, my: number, seed: number) => {
    if (!audioContextRef.current || !oscillatorRef.current || !gainRef.current) return;
    const osc = oscillatorRef.current;
    const gain = gainRef.current;
    // Space hum: low frequency, modulated by mouse (subtle)
    const baseFreq = 55 + (seed % 30);
    const mod = (mx - 0.5) * 20 + (my - 0.5) * 20;
    osc.frequency.setTargetAtTime(baseFreq + mod, audioContextRef.current.currentTime, 0.1);
    gain.gain.setTargetAtTime(0.03 + (mx + my) * 0.02, audioContextRef.current.currentTime, 0.1);
  }, []);

  useEffect(() => {
    if (!audioEnabled) return;
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioContextRef.current = ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.03;
    osc.type = 'sine';
    osc.frequency.value = 55;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(0);
    oscillatorRef.current = osc;
    gainRef.current = gain;
    const seed = hashToSeed(seedInput || 'nebula');
    updateAudio(mouse.x, mouse.y, seed);
    return () => {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
      audioContextRef.current = null;
      oscillatorRef.current = null;
      gainRef.current = null;
    };
  }, [audioEnabled, seedInput]);

  useEffect(() => {
    if (audioEnabled && oscillatorRef.current && gainRef.current && audioContextRef.current) {
      const seed = hashToSeed(seedInput || 'nebula');
      updateAudio(mouse.x, mouse.y, seed);
    }
  }, [mouse, audioEnabled, seedInput, updateAudio]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) setMouse({ x: t.clientX / window.innerWidth, y: t.clientY / window.innerHeight });
  }, []);

  const handleSeedSubmit = useCallback((value: string) => {
    setSeedInput(value);
    onSeedChange?.(value);
  }, [onSeedChange]);

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <NebulaGenerator
          seedInput={seedInput || 'nebula-nomads'}
          mouseX={mouse.x}
          mouseY={mouse.y}
          interactive
        />
      </div>
      {children}
      <CosmicEchoControls
        seedInput={seedInput}
        onSeedSubmit={handleSeedSubmit}
        audioEnabled={audioEnabled}
        onAudioToggle={() => setAudioEnabled((a) => !a)}
      />
    </>
  );
}

function CosmicEchoControls({
  seedInput,
  onSeedSubmit,
  audioEnabled,
  onAudioToggle,
}: {
  seedInput: string;
  onSeedSubmit: (v: string) => void;
  audioEnabled: boolean;
  onAudioToggle: () => void;
}) {
  const [input, setInput] = useState(seedInput);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setInput(seedInput);
  }, [seedInput]);
  return (
    <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="rounded-full border border-neon-purple/50 bg-[#0a001a]/80 px-4 py-2 text-sm text-slate-200 backdrop-blur transition hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(160,32,240,0.4)]"
      >
        {expanded ? 'Hide Cosmic Echo' : 'Personalize Nebula'}
      </button>
      {expanded && (
        <div className="holo-card flex flex-wrap items-center justify-center gap-2 rounded-xl p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSeedSubmit(input)}
            placeholder="Wallet or cosmic wish..."
            className="w-56 rounded-lg border border-neon-purple/40 bg-[#0a001a]/80 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50"
          />
          <button
            type="button"
            onClick={() => onSeedSubmit(input)}
            className="rounded-lg border border-neon-purple bg-neon-purple/60 px-3 py-2 text-sm font-medium text-white hover:shadow-[0_0_20px_rgba(160,32,240,0.5)] transition"
          >
            Echo
          </button>
          <button
            type="button"
            onClick={onAudioToggle}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${audioEnabled ? 'border-neon-cyan bg-neon-cyan/30 text-neon-cyan' : 'border-slate-600 bg-slate-800/80 text-slate-400'}`}
          >
            {audioEnabled ? '🔊 Space sound on' : '🔇 Space sound off'}
          </button>
        </div>
      )}
    </div>
  );
}
