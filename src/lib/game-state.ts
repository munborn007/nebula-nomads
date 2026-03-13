/**
 * Game state — Zustand store for Metaverse simulation.
 * Avatar position, shards, XP, abilities (cooldowns from game-abilities by rarity), mode.
 * Sync with Colyseus when backend deployed.
 */
import { create } from 'zustand';
import type { NomadRarity } from '@/data/nomads';
import { getAbilityQCooldownMs, getAbilityECooldownMs, getAbilityRCooldownMs } from '@/lib/game-abilities';

export type GameMode = 'explore' | 'battle' | 'staking' | 'quest';

export const MAX_LEVEL = 50;
export const XP_PER_LEVEL = 100;
export const DEFAULT_ABILITY_COOLDOWN_MS = 5000;
export const MAX_HP = 100;
export const COMBO_TIMEOUT_MS = 3000;

export interface GameState {
  nomadId: number;
  nomadAbility: string;
  nomadWeapon: string;
  nomadRarity: NomadRarity;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  shards: number;
  xp: number;
  level: number;
  hp: number;
  maxHp: number;
  isDead: boolean;
  respawnAt: number;
  comboCount: number;
  lastComboTime: number;
  abilityQReady: boolean;
  abilityEReady: boolean;
  abilityRReady: boolean;
  lastAbilityQTime: number;
  lastAbilityETime: number;
  lastAbilityRTime: number;
  mode: GameMode;
  collectedShardIds: Set<string>;
  dailyLoginClaimedAt: number | null;
}

const initialState: GameState = {
  nomadId: 0,
  nomadAbility: 'Phase Shift',
  nomadWeapon: 'Cosmic Blade',
  nomadRarity: 'Common',
  x: 0,
  y: 0.5,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  shards: 0,
  xp: 0,
  level: 1,
  hp: MAX_HP,
  maxHp: MAX_HP,
  isDead: false,
  respawnAt: 0,
  comboCount: 0,
  lastComboTime: 0,
  abilityQReady: true,
  abilityEReady: true,
  abilityRReady: true,
  lastAbilityQTime: 0,
  lastAbilityETime: 0,
  lastAbilityRTime: 0,
  mode: 'explore',
  collectedShardIds: new Set(),
  dailyLoginClaimedAt: null,
};

interface GameActions {
  setNomad: (id: number, ability: string, weapon: string, rarity?: NomadRarity) => void;
  setPosition: (x: number, y: number, z: number) => void;
  setVelocity: (vx: number, vy: number, vz: number) => void;
  addShards: (n: number) => void;
  addXp: (n: number) => void;
  collectShard: (id: string) => boolean;
  useAbilityQ: () => boolean;
  useAbilityE: () => boolean;
  useAbilityR: () => boolean;
  tickAbilities: () => void;
  takeDamage: (amount: number) => void;
  respawn: () => void;
  addCombo: () => number;
  setMode: (mode: GameMode) => void;
  claimDailyBonus: () => boolean;
  reset: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  collectedShardIds: new Set(initialState.collectedShardIds),

  setNomad: (id, ability, weapon, rarity = 'Common') =>
    set({ nomadId: id, nomadAbility: ability, nomadWeapon: weapon, nomadRarity: rarity }),

  setPosition: (x, y, z) => set({ x, y, z }),

  setVelocity: (vx, vy, vz) => set({ vx, vy, vz }),

  addShards: (n) => set((s) => ({ shards: s.shards + n })),

  addXp: (n) =>
    set((s) => {
      const xp = s.xp + n;
      const level = Math.min(MAX_LEVEL, Math.floor(xp / XP_PER_LEVEL) + 1);
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
    const { abilityEReady } = get();
    if (!abilityEReady) return false;
    set({ abilityEReady: false, lastAbilityETime: Date.now() });
    return true;
  },

  useAbilityR: () => {
    const { abilityRReady } = get();
    if (!abilityRReady) return false;
    set({ abilityRReady: false, lastAbilityRTime: Date.now() });
    return true;
  },

  tickAbilities: () => {
    const now = Date.now();
    const { lastAbilityQTime, lastAbilityETime, lastAbilityRTime, nomadAbility, nomadWeapon, nomadRarity } = get();
    const qCd = getAbilityQCooldownMs(nomadAbility, nomadRarity);
    const eCd = getAbilityECooldownMs(nomadWeapon, nomadRarity);
    const rCd = getAbilityRCooldownMs(nomadAbility, nomadRarity);
    set({
      abilityQReady: now - lastAbilityQTime >= qCd,
      abilityEReady: now - lastAbilityETime >= eCd,
      abilityRReady: now - lastAbilityRTime >= rCd,
    });
  },

  takeDamage: (amount) =>
    set((s) => {
      if (s.isDead) return s;
      const hp = Math.max(0, s.hp - amount);
      return { hp, isDead: hp <= 0, respawnAt: hp <= 0 ? Date.now() + 2000 : 0 };
    }),

  respawn: () =>
    set({ hp: MAX_HP, maxHp: MAX_HP, isDead: false, respawnAt: 0, x: 0, y: 0.5, z: 0, comboCount: 0 }),

  addCombo: () => {
    const now = Date.now();
    const { lastComboTime, comboCount } = get();
    const next = now - lastComboTime <= COMBO_TIMEOUT_MS ? comboCount + 1 : 1;
    set({ comboCount: next, lastComboTime: now });
    return next;
  },

  claimDailyBonus: () => {
    const key = 'nebula_daily_claimed';
    const today = new Date().toDateString();
    try {
      const last = localStorage.getItem(key);
      if (last === today) return false;
      localStorage.setItem(key, today);
      set((s) => ({ shards: s.shards + 20, xp: s.xp + 30 }));
      return true;
    } catch {
      return false;
    }
  },

  setMode: (mode) => set({ mode }),

  reset: () =>
    set({
      ...initialState,
      collectedShardIds: new Set(initialState.collectedShardIds),
      dailyLoginClaimedAt: null,
    }),
}));
