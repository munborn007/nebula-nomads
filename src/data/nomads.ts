/**
 * Nomad NFT data for Explore Nomads section.
 * Files in /public/nfts/thumbs/ are .png.mp4 (video thumbnails)
 * Rarity: Common 60% (1-12), Rare 30% (13-18), Epic 9% (19), Legendary 1% (20)
 */
export type NomadRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Nomad {
  id: number;
  name: string;
  image: string;
  /** Video path for animated thumbnails (.png.mp4 files) */
  video?: string;
  rarity: NomadRarity;
}

export const nomads: Nomad[] = [
  { id: 1, name: 'Nomad #0001', image: '/nfts/thumbs/nomad-0001.png.mp4', video: '/nfts/thumbs/nomad-0001.png.mp4', rarity: 'Common' },
  { id: 2, name: 'Nomad #0002', image: '/nfts/thumbs/nomad-0002.png.mp4', video: '/nfts/thumbs/nomad-0002.png.mp4', rarity: 'Common' },
  { id: 3, name: 'Nomad #0003', image: '/nfts/thumbs/nomad-0003.png.mp4', video: '/nfts/thumbs/nomad-0003.png.mp4', rarity: 'Common' },
  { id: 4, name: 'Nomad #0004', image: '/nfts/thumbs/nomad-0004.png.mp4', video: '/nfts/thumbs/nomad-0004.png.mp4', rarity: 'Common' },
  { id: 5, name: 'Nomad #0005', image: '/nfts/thumbs/nomad-0005.png.mp4', video: '/nfts/thumbs/nomad-0005.png.mp4', rarity: 'Common' },
  { id: 6, name: 'Nomad #0006', image: '/nfts/thumbs/nomad-0006.png.mp4', video: '/nfts/thumbs/nomad-0006.png.mp4', rarity: 'Common' },
  { id: 7, name: 'Nomad #0007', image: '/nfts/thumbs/nomad-0007.png.mp4', video: '/nfts/thumbs/nomad-0007.png.mp4', rarity: 'Common' },
  { id: 8, name: 'Nomad #0008', image: '/nfts/thumbs/nomad-0008.png.mp4', video: '/nfts/thumbs/nomad-0008.png.mp4', rarity: 'Common' },
  { id: 9, name: 'Nomad #0009', image: '/nfts/thumbs/nomad-0009.png.mp4', video: '/nfts/thumbs/nomad-0009.png.mp4', rarity: 'Common' },
  { id: 10, name: 'Nomad #0010', image: '/nfts/thumbs/nomad-0010.png.mp4', video: '/nfts/thumbs/nomad-0010.png.mp4', rarity: 'Common' },
  { id: 11, name: 'Nomad #0011', image: '/nfts/thumbs/nomad-0011.png.mp4', video: '/nfts/thumbs/nomad-0011.png.mp4', rarity: 'Common' },
  { id: 12, name: 'Nomad #0012', image: '/nfts/thumbs/nomad-0012.png.mp4', video: '/nfts/thumbs/nomad-0012.png.mp4', rarity: 'Common' },
  { id: 13, name: 'Nomad #0013', image: '/nfts/thumbs/nomad-0013.png.mp4', video: '/nfts/thumbs/nomad-0013.png.mp4', rarity: 'Rare' },
  { id: 14, name: 'Nomad #0014', image: '/nfts/thumbs/nomad-0014.png.mp4', video: '/nfts/thumbs/nomad-0014.png.mp4', rarity: 'Rare' },
  { id: 15, name: 'Nomad #0015', image: '/nfts/thumbs/nomad-0015.png.mp4', video: '/nfts/thumbs/nomad-0015.png.mp4', rarity: 'Rare' },
  { id: 16, name: 'Nomad #0016', image: '/nfts/thumbs/nomad-0016.png.mp4', video: '/nfts/thumbs/nomad-0016.png.mp4', rarity: 'Rare' },
  { id: 17, name: 'Nomad #0017', image: '/nfts/thumbs/nomad-0017.png.mp4', video: '/nfts/thumbs/nomad-0017.png.mp4', rarity: 'Rare' },
  { id: 18, name: 'Nomad #0018', image: '/nfts/thumbs/nomad-0018.png.mp4', video: '/nfts/thumbs/nomad-0018.png.mp4', rarity: 'Rare' },
  { id: 19, name: 'Nomad #0019', image: '/nfts/thumbs/nomad-0019.png.mp4', video: '/nfts/thumbs/nomad-0019.png.mp4', rarity: 'Epic' },
  { id: 20, name: 'Nomad #0020', image: '/nfts/thumbs/nomad-0020.png.mp4', video: '/nfts/thumbs/nomad-0020.png.mp4', rarity: 'Legendary' },
];
