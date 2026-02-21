/**
 * Hash a string to a numeric seed for procedural generation (nebula, audio).
 */
export function hashToSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h);
}

/**
 * Seeded random between 0 and 1 (mulberry32).
 */
export function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedToColor(seed: number): { r: number; g: number; b: number } {
  const r = (seed % 256) / 255;
  const g = ((seed >> 8) % 256) / 255;
  const b = ((seed >> 16) % 256) / 255;
  return { r: 0.2 + r * 0.6, g: 0.2 + g * 0.6, b: 0.4 + b * 0.5 };
}
