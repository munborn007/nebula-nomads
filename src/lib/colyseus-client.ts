/**
 * Multiplayer client stub — simulates Colyseus for demo.
 * Replace with real Colyseus client when server is deployed (Railway/Render/Fly.io).
 * Usage: const { avatars, userCount } = useMultiplayerSim();
 */
import { useState, useEffect } from 'react';

export type AvatarState = {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  name: string;
  isGuest?: boolean;
};

const COLORS = ['#a020f0', '#00ffff', '#ff4500', '#ff00ff', '#eab308', '#22c55e'];

function generateFakeAvatars(count: number): AvatarState[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + i * 0.2;
    const r = 2.5 + (i % 4) * 0.6;
    return {
      id: `avatar-${i}`,
      x: Math.cos(angle) * r,
      y: 0.2,
      z: Math.sin(angle) * r,
      color: COLORS[i % COLORS.length],
      name: i === 0 ? 'You' : `Nomad ${i + 1}`,
      isGuest: i >= 3,
    };
  });
}

/** Simulated user count — replace with Colyseus room.state.playerCount when server ready. */
export function useMultiplayerSim() {
  const [avatars, setAvatars] = useState<AvatarState[]>([]);
  const [userCount, setUserCount] = useState(8);

  useEffect(() => {
    setAvatars(generateFakeAvatars(8));
    // Simulate live user count (placeholder for Colyseus room)
    const t = setInterval(() => {
      setUserCount((c) => Math.max(4, Math.min(50, c + (Math.random() > 0.6 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return { avatars, userCount };
}
