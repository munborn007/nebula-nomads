/**
 * Maps NFT Nomad abilities/weapons to game logic: cooldowns, damage, VFX, sound cues.
 * Q = primary, E = secondary, R = ultimate (longer cooldown). Server must validate in P2E.
 */

import type { NomadRarity } from '@/data/nomads';

export type VFXType = 'burst' | 'beam' | 'pull' | 'aura' | 'projectile' | 'phase' | 'frost' | 'explosion' | 'default';
export type SoundCue = 'ability_q' | 'ability_e' | 'ultimate' | 'hit' | 'death' | 'collect';

export interface AbilityDef {
  name: string;
  cooldownMs: number;
  damage: number;
  vfx: VFXType;
  radius: number;
  /** Sound cue for spatial audio placeholder */
  sound?: SoundCue;
}

export interface WeaponDef {
  name: string;
  cooldownMs: number;
  damage: number;
  vfx: VFXType;
  radius: number;
}

const RARITY_COOLDOWN: Record<NomadRarity, number> = {
  Common: 5000,
  Rare: 4000,
  Epic: 3500,
  Legendary: 3000,
};

const RARITY_DAMAGE_BOOST: Record<NomadRarity, number> = {
  Common: 0,
  Rare: 5,
  Epic: 10,
  Legendary: 15,
};

/** Map known ability names to definitions; fallback for unknowns. */
const ABILITY_MAP: Record<string, Omit<AbilityDef, 'name'>> = {
  'Phase Shift': { cooldownMs: 4500, damage: 35, vfx: 'phase', radius: 0 },
  'Phase through dimensions': { cooldownMs: 5000, damage: 40, vfx: 'phase', radius: 0 },
  'Shadow Merge': { cooldownMs: 5000, damage: 30, vfx: 'aura', radius: 1 },
  'Plasma Surge': { cooldownMs: 4500, damage: 45, vfx: 'burst', radius: 1.5 },
  'Quantum Shift': { cooldownMs: 5500, damage: 35, vfx: 'phase', radius: 0 },
  'Gravity Well': { cooldownMs: 6000, damage: 50, vfx: 'pull', radius: 2 },
  'Absolute Zero Pulse': { cooldownMs: 5500, damage: 55, vfx: 'frost', radius: 1.5 },
  'Event Horizon Shroud': { cooldownMs: 6000, damage: 50, vfx: 'pull', radius: 2 },
  'Solar Rebirth': { cooldownMs: 8000, damage: 60, vfx: 'burst', radius: 2 },
  'Spore Dominion': { cooldownMs: 5500, damage: 48, vfx: 'aura', radius: 2 },
  'Code Overwrite': { cooldownMs: 7000, damage: 52, vfx: 'beam', radius: 0 },
  'Genesis Echo': { cooldownMs: 5000, damage: 42, vfx: 'burst', radius: 1 },
};

/** Map known weapon names to definitions. */
const WEAPON_MAP: Record<string, Omit<WeaponDef, 'name'>> = {
  'Cosmic Blade': { cooldownMs: 2500, damage: 25, vfx: 'projectile', radius: 0 },
  'Phase Blade': { cooldownMs: 3000, damage: 28, vfx: 'beam', radius: 0 },
  'Starforge Blade': { cooldownMs: 2800, damage: 30, vfx: 'beam', radius: 0 },
  'Void Cleaver': { cooldownMs: 3500, damage: 38, vfx: 'beam', radius: 0 },
  'Helios Reavers': { cooldownMs: 3200, damage: 45, vfx: 'burst', radius: 1 },
  'Glacier Breaker': { cooldownMs: 4000, damage: 42, vfx: 'frost', radius: 1 },
};

function getAbilityDef(name: string, rarity: NomadRarity): AbilityDef {
  const base = ABILITY_MAP[name] ?? {
    cooldownMs: 5000,
    damage: 35,
    vfx: 'default' as VFXType,
    radius: 0,
  };
  const cooldownMs = Math.max(2000, base.cooldownMs - (5000 - RARITY_COOLDOWN[rarity]));
  const damage = Math.min(100, base.damage + RARITY_DAMAGE_BOOST[rarity]);
  return { name, ...base, cooldownMs, damage };
}

function getWeaponDef(name: string, rarity: NomadRarity): WeaponDef {
  const base = WEAPON_MAP[name] ?? {
    cooldownMs: 3000,
    damage: 25,
    vfx: 'projectile' as VFXType,
    radius: 0,
  };
  const cooldownMs = Math.max(1500, base.cooldownMs - (5000 - RARITY_COOLDOWN[rarity]));
  const damage = Math.min(100, base.damage + RARITY_DAMAGE_BOOST[rarity]);
  return { name, ...base, cooldownMs, damage };
}

/** For game state: get cooldown in ms for ability Q (primary ability). */
export function getAbilityQCooldownMs(abilityName: string, rarity: NomadRarity): number {
  return getAbilityDef(abilityName, rarity).cooldownMs;
}

/** For game state: get cooldown in ms for ability E (weapon). */
export function getAbilityECooldownMs(weaponName: string, rarity: NomadRarity): number {
  return getWeaponDef(weaponName, rarity).cooldownMs;
}

/** For GameScene VFX: get effect type for primary ability. */
export function getAbilityVFX(abilityName: string): VFXType {
  return getAbilityDef(abilityName, 'Common').vfx;
}

/** For GameScene VFX: get effect type for weapon. */
export function getWeaponVFX(weaponName: string): VFXType {
  return getWeaponDef(weaponName, 'Common').vfx;
}

/** For BattleArena / server: resolve damage (server must validate). */
export function getAbilityDamage(abilityName: string, rarity: NomadRarity): number {
  return getAbilityDef(abilityName, rarity).damage;
}

export function getWeaponDamage(weaponName: string, rarity: NomadRarity): number {
  return getWeaponDef(weaponName, rarity).damage;
}

/** Rarity to emissive color (hex) for avatar glow. Legendary = golden aura. */
export function getRarityColor(rarity: NomadRarity): number {
  const colors: Record<NomadRarity, number> = {
    Common: 0x8888aa,
    Rare: 0x00aaff,
    Epic: 0xa020f0,
    Legendary: 0xffaa00,
  };
  return colors[rarity];
}

/** Ultimate ability (R): same name as primary but 2x damage, 3x cooldown, explosion VFX. */
const ULTIMATE_COOLDOWN_MS = 15000;

export function getAbilityRCooldownMs(abilityName: string, rarity: NomadRarity): number {
  const base = getAbilityDef(abilityName, rarity).cooldownMs;
  return Math.max(ULTIMATE_COOLDOWN_MS, base * 3);
}

export function getUltimateDamage(abilityName: string, rarity: NomadRarity): number {
  return Math.min(100, getAbilityDef(abilityName, rarity).damage * 2);
}

/** Level 1–50: +2% damage per level (e.g. level 10 = 1.18x). Server must validate. */
export function getDamageMultiplierForLevel(level: number): number {
  const L = Math.max(1, Math.min(50, level));
  return 1 + (L - 1) * 0.02;
}
