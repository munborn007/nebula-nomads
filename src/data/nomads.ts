/**
 * Nomad NFT data for Explore Nomads section.
 * Files in /public/nfts/thumbs/ are .png or .png.mp4 (video thumbnails)
 * Rarity: Common 60% (1-12), Rare 30% (13-18), Epic 9% (19), Legendary 1% (20)
 */
export type NomadRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface NomadTrait {
  name: string;
  value: string;
}

export interface Nomad {
  id: number;
  name: string;
  image: string;
  /** Video path for animated thumbnails (.png.mp4 files) */
  video?: string;
  rarity: NomadRarity;
  /** Short lore / description for detail page */
  lore?: string;
  /** Display traits for detail page */
  traits?: NomadTrait[];
}

const LORES: Record<number, string> = {
  1: 'Void Harvester: Devours stars and weaves them into the fabric of the nebula.',
  2: 'Stellar Drifter: Roams the cosmic dust, leaving trails of light.',
  3: 'Nebula Weaver: Spins constellations from raw energy.',
  4: 'Quantum Walker: Exists between dimensions, glimpsed only in flashes.',
  5: 'Cosmic Shepherd: Guides lost souls through the deep.',
  6: 'Eclipse Rider: Rides the edge of shadow and light.',
  7: 'Pulse Seeker: Drawn to the heartbeat of dying stars.',
  8: 'Rift Guardian: Watches over tears in the fabric of space.',
  9: 'Dust Dancer: Moves through asteroid fields like wind.',
  10: 'Singularity Child: Born at the edge of a black hole.',
  11: 'Aurora Nomad: Wears the northern lights as a cloak.',
  12: 'Orbit Keeper: Maintains the balance of celestial paths.',
  13: 'Star Forger: Hammers new suns into being. (Rare)',
  14: 'Nebula Sage: Speaks the language of the cosmos. (Rare)',
  15: 'Void Walker: Steps between galaxies in a single stride. (Rare)',
  16: 'Cosmic Judge: Weighs the fate of worlds. (Rare)',
  17: 'Eclipse Prophet: Foretells the dance of sun and moon. (Rare)',
  18: 'Pulse Oracle: Hears the rhythm of the universe. (Rare)',
  19: 'Galaxy Heart: The soul of a galaxy given form. (Epic)',
  20: 'The First Nomad: Origin of all Nebula Nomads. (Legendary)',
};

function traitsFor(id: number, rarity: NomadRarity): NomadTrait[] {
  return [
    { name: 'Rarity', value: rarity },
    { name: 'Generation', value: 'Genesis' },
    { name: 'ID', value: String(id).padStart(4, '0') },
  ];
}

export const nomads: Nomad[] = [
  { id: 1, name: 'Nomad #0001', image: '/nfts/thumbs/nomad-0001.png.mp4', video: '/nfts/thumbs/nomad-0001.png.mp4', rarity: 'Common', lore: LORES[1], traits: traitsFor(1, 'Common') },
  { id: 2, name: 'Nomad #0002', image: '/nfts/thumbs/nomad-0002.png.mp4', video: '/nfts/thumbs/nomad-0002.png.mp4', rarity: 'Common', lore: LORES[2], traits: traitsFor(2, 'Common') },
  { id: 3, name: 'Nomad #0003', image: '/nfts/thumbs/nomad-0003.png.mp4', video: '/nfts/thumbs/nomad-0003.png.mp4', rarity: 'Common', lore: LORES[3], traits: traitsFor(3, 'Common') },
  { id: 4, name: 'Nomad #0004', image: '/nfts/thumbs/nomad-0004.png.mp4', video: '/nfts/thumbs/nomad-0004.png.mp4', rarity: 'Common', lore: LORES[4], traits: traitsFor(4, 'Common') },
  { id: 5, name: 'Nomad #0005', image: '/nfts/thumbs/nomad-0005.png.mp4', video: '/nfts/thumbs/nomad-0005.png.mp4', rarity: 'Common', lore: LORES[5], traits: traitsFor(5, 'Common') },
  { id: 6, name: 'Nomad #0006', image: '/nfts/thumbs/nomad-0006.png.mp4', video: '/nfts/thumbs/nomad-0006.png.mp4', rarity: 'Common', lore: LORES[6], traits: traitsFor(6, 'Common') },
  { id: 7, name: 'Nomad #0007', image: '/nfts/thumbs/nomad-0007.png.mp4', video: '/nfts/thumbs/nomad-0007.png.mp4', rarity: 'Common', lore: LORES[7], traits: traitsFor(7, 'Common') },
  { id: 8, name: 'Nomad #0008', image: '/nfts/thumbs/nomad-0008.png.mp4', video: '/nfts/thumbs/nomad-0008.png.mp4', rarity: 'Common', lore: LORES[8], traits: traitsFor(8, 'Common') },
  { id: 9, name: 'Nomad #0009', image: '/nfts/thumbs/nomad-0009.png.mp4', video: '/nfts/thumbs/nomad-0009.png.mp4', rarity: 'Common', lore: LORES[9], traits: traitsFor(9, 'Common') },
  { id: 10, name: 'Nomad #0010', image: '/nfts/thumbs/nomad-0010.png.mp4', video: '/nfts/thumbs/nomad-0010.png.mp4', rarity: 'Common', lore: LORES[10], traits: traitsFor(10, 'Common') },
  { id: 11, name: 'Nomad #0011', image: '/nfts/thumbs/nomad-0011.png.mp4', video: '/nfts/thumbs/nomad-0011.png.mp4', rarity: 'Common', lore: LORES[11], traits: traitsFor(11, 'Common') },
  { id: 12, name: 'Nomad #0012', image: '/nfts/thumbs/nomad-0012.png.mp4', video: '/nfts/thumbs/nomad-0012.png.mp4', rarity: 'Common', lore: LORES[12], traits: traitsFor(12, 'Common') },
  { id: 13, name: 'Nomad #0013', image: '/nfts/thumbs/nomad-0013.png.mp4', video: '/nfts/thumbs/nomad-0013.png.mp4', rarity: 'Rare', lore: LORES[13], traits: traitsFor(13, 'Rare') },
  { id: 14, name: 'Nomad #0014', image: '/nfts/thumbs/nomad-0014.png.mp4', video: '/nfts/thumbs/nomad-0014.png.mp4', rarity: 'Rare', lore: LORES[14], traits: traitsFor(14, 'Rare') },
  { id: 15, name: 'Nomad #0015', image: '/nfts/thumbs/nomad-0015.png.mp4', video: '/nfts/thumbs/nomad-0015.png.mp4', rarity: 'Rare', lore: LORES[15], traits: traitsFor(15, 'Rare') },
  { id: 16, name: 'Nomad #0016', image: '/nfts/thumbs/nomad-0016.png.mp4', video: '/nfts/thumbs/nomad-0016.png.mp4', rarity: 'Rare', lore: LORES[16], traits: traitsFor(16, 'Rare') },
  { id: 17, name: 'Nomad #0017', image: '/nfts/thumbs/nomad-0017.png.mp4', video: '/nfts/thumbs/nomad-0017.png.mp4', rarity: 'Rare', lore: LORES[17], traits: traitsFor(17, 'Rare') },
  { id: 18, name: 'Nomad #0018', image: '/nfts/thumbs/nomad-0018.png.mp4', video: '/nfts/thumbs/nomad-0018.png.mp4', rarity: 'Rare', lore: LORES[18], traits: traitsFor(18, 'Rare') },
  { id: 19, name: 'Nomad #0019', image: '/nfts/thumbs/nomad-0019.png.mp4', video: '/nfts/thumbs/nomad-0019.png.mp4', rarity: 'Epic', lore: LORES[19], traits: traitsFor(19, 'Epic') },
  { id: 20, name: 'Nomad #0020', image: '/nfts/thumbs/nomad-0020.png.mp4', video: '/nfts/thumbs/nomad-0020.png.mp4', rarity: 'Legendary', lore: LORES[20], traits: traitsFor(20, 'Legendary') },
];

export function getNomadById(id: number): Nomad | undefined {
  return nomads.find((n) => n.id === id);
}
