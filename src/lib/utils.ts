/**
 * Mock: derive Nomad rarity from wallet address for AR personalization.
 * In production, replace with trait fetch from contract/metadata API.
 */
export type NomadRarity = 'common' | 'rare' | 'legendary';

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h);
}

export function getNomadRarityFromWallet(address: string): NomadRarity {
  const h = hashString(address.toLowerCase());
  if (h % 10 === 0) return 'legendary';
  if (h % 5 === 0) return 'rare';
  return 'common';
}
