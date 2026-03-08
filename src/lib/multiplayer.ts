/**
 * Multiplayer client stub — local sim for now.
 * Integrate Colyseus or Socket.io later for real-time avatar sync.
 */
export type AvatarState = {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  name?: string;
};

const COLORS = ['#a020f0', '#00ffff', '#ff4500', '#ff00ff', '#eab308'];

/** Local sim: fake avatars for placeholder. Replace with Colyseus/Socket.io when backend ready. */
export function createLocalMultiplayerSim(count = 8): AvatarState[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + i * 0.2;
    const r = 2.5 + (i % 3) * 0.8;
    return {
      id: `local-${i}`,
      x: Math.cos(angle) * r,
      y: 0.2,
      z: Math.sin(angle) * r,
      color: COLORS[i % COLORS.length],
      name: `Nomad ${i + 1}`,
    };
  });
}
