/**
 * Game state — Zustand store for Metaverse simulation.
 * Avatar position, shards, XP, abilities, mode. Sync with Colyseus when backend deployed.
 */
import { create } from 'zustand';

export type GameMode = 'explore' | 'battle' | 'staking' | 'quest';

export type AbilitySlot = 'Q' | 'E';
export const ABILITY_COOLDOWN_MS = 5000;

export interface GameState {
  // Avatar (Nomad NFT id; 0 = guest random)
  nomadId: number;
  nomadAbility: string;
  nomadWeapon: string;
  // Position (simulated fly movement)
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  // Progression
  shards: number;
  xp: number;
  level: number;
  // Abilities
  abilityQReady: boolean;
  abilityEReady: boolean;
  lastAbilityQTime: number;
  lastAbilityETime: number;
  // Mode
  mode: GameMode;
  // Collected shard IDs (to avoid double-collect)
  collectedShardIds: Set<string>;
}

const initialState: GameState = {
  nomadId: 0,
  nomadAbility: 'Phase Shift',
  nomadWeapon: 'Cosmic Blade',
  x: 0,
  y: 0.5,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  shards: 0,
  xp: 0,
  level: 1,
  abilityQReady: true,
  abilityEReady: true,
  lastAbilityQTime: 0,
  lastAbilityETime: 0,
  mode: 'explore',
  collectedShardIds: new Set(),
};

interface GameActions {
  setNomad: (id: number, ability: string, weapon: string) => void;
  setPosition: (x: number, y: number, z: number) => void;
  setVelocity: (vx: number, vy: number, vz: number) => void;
  addShards: (n: number) => void;
  addXp: (n: number) => void;
  collectShard: (id: string) => boolean;
  useAbilityQ: () => boolean;
  useAbilityE: () => boolean;
  tickAbilities: () => void;
  setMode: (mode: GameMode) => void;
  reset: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  collectedShardIds: new Set(initialState.collectedShardIds),

  setNomad: (id, ability, weapon) =>
    set({ nomadId: id, nomadAbility: ability, nomadWeapon: weapon }),

  setPosition: (x, y, z) => set({ x, y, z }),

  setVelocity: (vx, vy, vz) => set({ vx, vy, vz }),

  addShards: (n) => set((s) => ({ shards: s.shards + n })),

  addXp: (n) =>
    set((s) => {
      const xp = s.xp + n;
      const level = Math.min(10, Math.floor(xp / 100) + 1);
      return { xp, level };
    }),

  collectShard: (id) => {
    const { collectedShardIds } = get();
    if (collectedShardIds.has(id)) return false;
    set((s) => {
      const next = new Set(s.collectedShardIds);
      next.add(id);
      return { collectedShardIds: next, shards: s.shards + 1, xp: s.xp + 5 };
    });
    return true;
  },

  useAbilityQ: () => {
    const { abilityQReady, lastAbilityQTime } = get();
    if (!abilityQReady) return false;
    set({ abilityQReady: false, lastAbilityQTime: Date.now() });
    return true;
  },

  useAbilityE: () => {
    const { abilityEReady, lastAbilityETime } = get();
    if (!abilityEReady) return false;
    set({ abilityEReady: false, lastAbilityETime: Date.now() });
    return true;
  },

  tickAbilities: () => {
    const now = Date.now();
    const { lastAbilityQTime, lastAbilityETime } = get();
    set({
      abilityQReady: now - lastAbilityQTime >= ABILITY_COOLDOWN_MS,
      abilityEReady: now - lastAbilityETime >= ABILITY_COOLDOWN_MS,
    });
  },

  setMode: (mode) => set({ mode }),

  reset: () =>
    set({
      ...initialState,
      collectedShardIds: new Set(initialState.collectedShardIds),
    }),
}));
