/**
 * Nomad NFT data for Explore Nomads section.
 * 30 NFTs (#0001–#0030). Images: public/nfts/thumbs/nomad-0001.png to nomad-0030.png
 * Rarity: Common 70% (1–21), Rare 20% (22–27), Legendary 10% (28–30)
 * Fields: id, name, image, rarity, lore, ability, weapon, traits (all unique across set)
 */
export type NomadRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface NomadTrait {
  name: string;
  value: string;
}

/** Detailed trait with description (e.g. "Plasma Wings: +20% evasion in nebula storms") */
export interface DetailedTrait {
  name: string;
  description: string;
}

/** Power stats 1–100 for review section. Balanced by rarity: Common 50–70 avg, Rare 70–85, Legendary 85–100. */
export interface PowerLevels {
  Attack: number;
  Defense: number;
  Speed: number;
  Intelligence: number;
  Energy: number;
  Special: number;
  Durability: number;
  Versatility: number;
}

/** Compatibility with another Nomad (1–5 stars + note) */
export interface CompatibilityEntry {
  nomadId: number;
  stars: number;
  note: string;
}

/** Full review data for NFT detail page (Pokémon-style) */
export interface NomadReview {
  detailedTraits: DetailedTrait[];
  powerLevels: PowerLevels;
  specialty: string;
  strengths: string[];
  weaknesses: string[];
  compatibility: CompatibilityEntry[];
  upgradePath: string[];
  overallRating: number;
}

export interface Nomad {
  id: number;
  name: string;
  image: string;
  video?: string;
  rarity: NomadRarity;
  lore?: string;
  ability?: string;
  weapon?: string;
  traits?: NomadTrait[];
  /** Populated by getNomadReview() for detail page */
  review?: NomadReview;
}

function imagePath(id: number): string {
  return `/nfts/thumbs/nomad-${String(id).padStart(4, '0')}.png`;
}

function baseTraits(id: number, rarity: NomadRarity, extra: NomadTrait[] = []): NomadTrait[] {
  return [
    { name: 'Rarity', value: rarity },
    { name: 'Generation', value: 'Genesis' },
    { name: 'ID', value: String(id).padStart(4, '0') },
    ...extra,
  ];
}

/** NFTs 1–20: generalized cyberpunk cosmic themes; 21–30: exact conversation themes. All abilities/weapons unique. */
export const nomads: Nomad[] = [
  {
    id: 1,
    name: 'Void Sentinel #0001',
    image: imagePath(1),
    rarity: 'Common',
    lore: 'A guardian born in the void, draped in shadow and bound to the edge of reality.',
    ability: 'Shadow Merge',
    weapon: 'Phase Blade',
    traits: baseTraits(1, 'Common', [
      { name: 'Ability', value: 'Shadow Merge' },
      { name: 'Weapon', value: 'Phase Blade' },
      { name: 'Look', value: 'Shadow Cloak' },
    ]),
  },
  {
    id: 2,
    name: 'Plasma Harbinger #0002',
    image: imagePath(2),
    rarity: 'Common',
    lore: 'Channels raw stellar plasma through energy tendrils; herald of fusion storms.',
    ability: 'Plasma Surge',
    weapon: 'Fusion Staff',
    traits: baseTraits(2, 'Common', [
      { name: 'Ability', value: 'Plasma Surge' },
      { name: 'Weapon', value: 'Fusion Staff' },
      { name: 'Look', value: 'Energy Tendrils' },
    ]),
  },
  {
    id: 3,
    name: 'Nebula Shade #0003',
    image: imagePath(3),
    rarity: 'Common',
    lore: 'Drifts through gas clouds, leaving trails of condensed stardust.',
    ability: 'Dust Veil',
    weapon: 'Stardust Whip',
    traits: baseTraits(3, 'Common', [
      { name: 'Ability', value: 'Dust Veil' },
      { name: 'Weapon', value: 'Stardust Whip' },
      { name: 'Look', value: 'Nebula Cloak' },
    ]),
  },
  {
    id: 4,
    name: 'Quantum Drifter #0004',
    image: imagePath(4),
    rarity: 'Common',
    lore: 'Exists in superposition between dimensions; observed only when they choose.',
    ability: 'Quantum Shift',
    weapon: 'Probability Dagger',
    traits: baseTraits(4, 'Common', [
      { name: 'Ability', value: 'Quantum Shift' },
      { name: 'Weapon', value: 'Probability Dagger' },
      { name: 'Look', value: 'Flicker Form' },
    ]),
  },
  {
    id: 5,
    name: 'Solar Warden #0005',
    image: imagePath(5),
    rarity: 'Common',
    lore: 'Keeper of dying stars; wears corona flame and carries the weight of suns.',
    ability: 'Corona Burst',
    weapon: 'Solar Pike',
    traits: baseTraits(5, 'Common', [
      { name: 'Ability', value: 'Corona Burst' },
      { name: 'Weapon', value: 'Solar Pike' },
      { name: 'Look', value: 'Corona Mantle' },
    ]),
  },
  {
    id: 6,
    name: 'Rift Stalker #0006',
    image: imagePath(6),
    rarity: 'Common',
    lore: 'Hunts along the tears in spacetime, armed with blades that cut through dimensions.',
    ability: 'Rift Tear',
    weapon: 'Void Cleaver',
    traits: baseTraits(6, 'Common', [
      { name: 'Ability', value: 'Rift Tear' },
      { name: 'Weapon', value: 'Void Cleaver' },
      { name: 'Look', value: 'Rift Scarred' },
    ]),
  },
  {
    id: 7,
    name: 'Pulse Phantom #0007',
    image: imagePath(7),
    rarity: 'Common',
    lore: 'Synced to the heartbeat of neutron stars; strikes in rhythm with the cosmos.',
    ability: 'Pulse Echo',
    weapon: 'Resonance Hammer',
    traits: baseTraits(7, 'Common', [
      { name: 'Ability', value: 'Pulse Echo' },
      { name: 'Weapon', value: 'Resonance Hammer' },
      { name: 'Look', value: 'Pulse Lines' },
    ]),
  },
  {
    id: 8,
    name: 'Cryo Wraith #0008',
    image: imagePath(8),
    rarity: 'Common',
    lore: 'Born in the cold between galaxies; frost follows every step.',
    ability: 'Frost Lock',
    weapon: 'Ice Shard Scythe',
    traits: baseTraits(8, 'Common', [
      { name: 'Ability', value: 'Frost Lock' },
      { name: 'Weapon', value: 'Ice Shard Scythe' },
      { name: 'Look', value: 'Cryo Shell' },
    ]),
  },
  {
    id: 9,
    name: 'Arc Weaver #0009',
    image: imagePath(9),
    rarity: 'Common',
    lore: 'Weaves lightning from dead circuits and dying ships across the void.',
    ability: 'Arc Cascade',
    weapon: 'Volt Saber',
    traits: baseTraits(9, 'Common', [
      { name: 'Ability', value: 'Arc Cascade' },
      { name: 'Weapon', value: 'Volt Saber' },
      { name: 'Look', value: 'Arc Weave' },
    ]),
  },
  {
    id: 10,
    name: 'Gravity Anchor #0010',
    image: imagePath(10),
    rarity: 'Common',
    lore: 'Bends local gravity; black-hole eyes and a weapon that pulls foes in.',
    ability: 'Gravity Well',
    weapon: 'Singularity Mace',
    traits: baseTraits(10, 'Common', [
      { name: 'Ability', value: 'Gravity Well' },
      { name: 'Weapon', value: 'Singularity Mace' },
      { name: 'Look', value: 'Gravity Warp' },
    ]),
  },
  {
    id: 11,
    name: 'Aurora Stalker #0011',
    image: imagePath(11),
    rarity: 'Common',
    lore: 'Wears the northern lights as a cloak; strikes from within the glow.',
    ability: 'Aurora Fade',
    weapon: 'Polar Blade',
    traits: baseTraits(11, 'Common', [
      { name: 'Ability', value: 'Aurora Fade' },
      { name: 'Weapon', value: 'Polar Blade' },
      { name: 'Look', value: 'Aurora Cloak' },
    ]),
  },
  {
    id: 12,
    name: 'Orbit Keeper #0012',
    image: imagePath(12),
    rarity: 'Common',
    lore: 'Maintains the balance of celestial paths; orbits and fate bend to their will.',
    ability: 'Orbital Bind',
    weapon: 'Orbit Staff',
    traits: baseTraits(12, 'Common', [
      { name: 'Ability', value: 'Orbital Bind' },
      { name: 'Weapon', value: 'Orbit Staff' },
      { name: 'Look', value: 'Orbital Rings' },
    ]),
  },
  {
    id: 13,
    name: 'Ember Forge #0013',
    image: imagePath(13),
    rarity: 'Common',
    lore: 'Smith of newborn stars; hammer and anvil glow with creation fire.',
    ability: 'Forge Flare',
    weapon: 'Starhammer',
    traits: baseTraits(13, 'Common', [
      { name: 'Ability', value: 'Forge Flare' },
      { name: 'Weapon', value: 'Starhammer' },
      { name: 'Look', value: 'Ember Armor' },
    ]),
  },
  {
    id: 14,
    name: 'Nebula Sage #0014',
    image: imagePath(14),
    rarity: 'Common',
    lore: 'Speaks the language of the cosmos; runes of gas and dust answer their call.',
    ability: 'Cosmic Tongue',
    weapon: 'Rune Scepter',
    traits: baseTraits(14, 'Common', [
      { name: 'Ability', value: 'Cosmic Tongue' },
      { name: 'Weapon', value: 'Rune Scepter' },
      { name: 'Look', value: 'Nebula Runes' },
    ]),
  },
  {
    id: 15,
    name: 'Void Walker #0015',
    image: imagePath(15),
    rarity: 'Common',
    lore: 'Steps between galaxies in a single stride; the void is their road.',
    ability: 'Void Step',
    weapon: 'Voidwalker Glaive',
    traits: baseTraits(15, 'Common', [
      { name: 'Ability', value: 'Void Step' },
      { name: 'Weapon', value: 'Voidwalker Glaive' },
      { name: 'Look', value: 'Void Treads' },
    ]),
  },
  {
    id: 16,
    name: 'Cosmic Judge #0016',
    image: imagePath(16),
    rarity: 'Common',
    lore: 'Weighs the fate of worlds; scales of light and shadow hang at their side.',
    ability: 'Judgment Beam',
    weapon: 'Scale Blade',
    traits: baseTraits(16, 'Common', [
      { name: 'Ability', value: 'Judgment Beam' },
      { name: 'Weapon', value: 'Scale Blade' },
      { name: 'Look', value: 'Judge Mantle' },
    ]),
  },
  {
    id: 17,
    name: 'Eclipse Prophet #0017',
    image: imagePath(17),
    rarity: 'Common',
    lore: 'Foretells the dance of sun and moon; sees in the dark between lights.',
    ability: 'Eclipse Sight',
    weapon: 'Crescent Axe',
    traits: baseTraits(17, 'Common', [
      { name: 'Ability', value: 'Eclipse Sight' },
      { name: 'Weapon', value: 'Crescent Axe' },
      { name: 'Look', value: 'Eclipse Hood' },
    ]),
  },
  {
    id: 18,
    name: 'Pulse Oracle #0018',
    image: imagePath(18),
    rarity: 'Common',
    lore: 'Hears the rhythm of the universe; every beat reveals a path.',
    ability: 'Resonance Locus',
    weapon: 'Pulse Rod',
    traits: baseTraits(18, 'Common', [
      { name: 'Ability', value: 'Resonance Locus' },
      { name: 'Weapon', value: 'Pulse Rod' },
      { name: 'Look', value: 'Pulse Marks' },
    ]),
  },
  {
    id: 19,
    name: 'Galaxy Heart #0019',
    image: imagePath(19),
    rarity: 'Common',
    lore: 'The soul of a galaxy given form; spiral arms and core fire.',
    ability: 'Galaxy Pulse',
    weapon: 'Spiral Lance',
    traits: baseTraits(19, 'Common', [
      { name: 'Ability', value: 'Galaxy Pulse' },
      { name: 'Weapon', value: 'Spiral Lance' },
      { name: 'Look', value: 'Spiral Armor' },
    ]),
  },
  {
    id: 20,
    name: 'The First Nomad #0020',
    image: imagePath(20),
    rarity: 'Common',
    lore: 'Origin of all Nebula Nomads; the first to walk the cosmic path.',
    ability: 'Genesis Echo',
    weapon: 'Origin Blade',
    traits: baseTraits(20, 'Common', [
      { name: 'Ability', value: 'Genesis Echo' },
      { name: 'Weapon', value: 'Origin Blade' },
      { name: 'Look', value: 'Prime Form' },
    ]),
  },
  // --- NFTs 21–30: exact themes from conversation ---
  {
    id: 21,
    name: 'Ethereal Spectral Wanderer #0021',
    image: imagePath(21),
    rarity: 'Common',
    lore: 'Ethereal spectral wanderer with turquoise plasma wings and crystalline helmet; phases through dimensions.',
    ability: 'Phase through dimensions',
    weapon: 'Starforge Blade',
    traits: baseTraits(21, 'Common', [
      { name: 'Ability', value: 'Phase through dimensions' },
      { name: 'Weapon', value: 'Starforge Blade' },
      { name: 'Look', value: 'Turquoise Plasma Wings, Crystalline Helmet' },
    ]),
  },
  {
    id: 22,
    name: 'Biomechanical Sentinel #0022',
    image: imagePath(22),
    rarity: 'Rare',
    lore: 'Towering biomechanical sentinel with obsidian chitin and gold circuitry; shrouds foes in event horizon.',
    ability: 'Event Horizon Shroud',
    weapon: 'Eclipse Lances',
    traits: baseTraits(22, 'Rare', [
      { name: 'Ability', value: 'Event Horizon Shroud' },
      { name: 'Weapon', value: 'Eclipse Lances' },
      { name: 'Look', value: 'Obsidian Chitin, Gold Circuitry' },
    ]),
  },
  {
    id: 23,
    name: 'Chrome Android Assassin #0023',
    image: imagePath(23),
    rarity: 'Rare',
    lore: 'Sleek chrome-silver android assassin with liquid mercury skin; strikes in phase cascades.',
    ability: 'Phase Cascade',
    weapon: 'Void Slicers',
    traits: baseTraits(23, 'Rare', [
      { name: 'Ability', value: 'Phase Cascade' },
      { name: 'Weapon', value: 'Void Slicers' },
      { name: 'Look', value: 'Liquid Mercury Skin, Chrome Silver' },
    ]),
  },
  {
    id: 24,
    name: 'Glacial Juggernaut #0024',
    image: imagePath(24),
    rarity: 'Rare',
    lore: 'Colossal frost-covered glacial juggernaut with translucent ice-crystal armor; unleashes absolute zero.',
    ability: 'Absolute Zero Pulse',
    weapon: 'Glacier Breaker',
    traits: baseTraits(24, 'Rare', [
      { name: 'Ability', value: 'Absolute Zero Pulse' },
      { name: 'Weapon', value: 'Glacier Breaker' },
      { name: 'Look', value: 'Translucent Ice-Crystal Armor, Frost-Covered' },
    ]),
  },
  {
    id: 25,
    name: 'Shadow Phantom Thief #0025',
    image: imagePath(25),
    rarity: 'Rare',
    lore: 'Shadow-wreathed phantom thief with inky-black void-cloak; leaves only an umbral mirage.',
    ability: 'Umbral Mirage',
    weapon: 'Shadow Daggers',
    traits: baseTraits(25, 'Rare', [
      { name: 'Ability', value: 'Umbral Mirage' },
      { name: 'Weapon', value: 'Shadow Daggers' },
      { name: 'Look', value: 'Inky-Black Void-Cloak' },
    ]),
  },
  {
    id: 26,
    name: 'Rust Mech-Golem #0026',
    image: imagePath(26),
    rarity: 'Rare',
    lore: 'Rust-encrusted mech-golem risen from wreckage; spreads corrosion in cascades.',
    ability: 'Corrosion Cascade',
    weapon: 'Miasma Scythe',
    traits: baseTraits(26, 'Rare', [
      { name: 'Ability', value: 'Corrosion Cascade' },
      { name: 'Weapon', value: 'Miasma Scythe' },
      { name: 'Look', value: 'Rust-Encrusted, Wreckage Origin' },
    ]),
  },
  {
    id: 27,
    name: 'Bioluminescent Siren #0027',
    image: imagePath(27),
    rarity: 'Rare',
    lore: 'Bioluminescent siren with translucent jellyfish skin; her resonance lullaby stills the void.',
    ability: 'Resonance Lullaby',
    weapon: "Siren's Harp Bow",
    traits: baseTraits(27, 'Rare', [
      { name: 'Ability', value: 'Resonance Lullaby' },
      { name: 'Weapon', value: "Siren's Harp Bow" },
      { name: 'Look', value: 'Translucent Jellyfish Skin, Bioluminescent' },
    ]),
  },
  {
    id: 28,
    name: 'Fungal Plague-Bringer #0028',
    image: imagePath(28),
    rarity: 'Legendary',
    lore: 'Grotesque fungal plague-bringer with gray-green mushroom caps; spore dominion over the battlefield.',
    ability: 'Spore Dominion',
    weapon: 'Miasma Scythe',
    traits: baseTraits(28, 'Legendary', [
      { name: 'Ability', value: 'Spore Dominion' },
      { name: 'Weapon', value: 'Miasma Scythe' },
      { name: 'Look', value: 'Gray-Green Mushroom Caps, Fungal' },
    ]),
  },
  {
    id: 29,
    name: 'Holographic Data-Archivist #0029',
    image: imagePath(29),
    rarity: 'Legendary',
    lore: 'Shimmering holographic data-archivist with digital code matrices; overwrites reality with code.',
    ability: 'Code Overwrite',
    weapon: 'Quantum Codex Rifle',
    traits: baseTraits(29, 'Legendary', [
      { name: 'Ability', value: 'Code Overwrite' },
      { name: 'Weapon', value: 'Quantum Codex Rifle' },
      { name: 'Look', value: 'Digital Code Matrices, Holographic' },
    ]),
  },
  {
    id: 30,
    name: 'Solar-Flare Phoenix #0030',
    image: imagePath(30),
    rarity: 'Legendary',
    lore: 'Radiant solar-flare phoenix with photovoltaic plasma; helios reavers and solar rebirth.',
    ability: 'Solar Rebirth',
    weapon: 'Helios Reavers',
    traits: baseTraits(30, 'Legendary', [
      { name: 'Ability', value: 'Solar Rebirth' },
      { name: 'Weapon', value: 'Helios Reavers' },
      { name: 'Look', value: 'Photovoltaic Plasma, Solar-Flare' },
    ]),
  },
];

export function getNomadById(id: number): Nomad | undefined {
  return nomads.find((n) => n.id === id);
}

/** Seeded pseudo-random 0..1 for deterministic stats per id */
function seeded(id: number, seed: number): number {
  const x = Math.sin(id * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Rarity-based stat range (avg): Common 50–70, Rare 70–85, Epic 70–85, Legendary 85–100 */
function statByRarity(id: number, seed: number, rarity: NomadRarity): number {
  const ranges: Record<NomadRarity, [number, number]> = {
    Common: [48, 72],
    Rare: [68, 88],
    Epic: [70, 90],
    Legendary: [82, 100],
  };
  const [min, max] = ranges[rarity];
  return Math.round(min + seeded(id, seed) * (max - min));
}

/** Generate full review data for a Nomad (traits, power levels, specialty, compatibility, etc.) */
export function getNomadReview(nomad: Nomad, allNomads: Nomad[]): NomadReview {
  const id = nomad.id;
  const ability = nomad.ability ?? 'Cosmic Surge';
  const weapon = nomad.weapon ?? 'Void Blade';
  const rarity = nomad.rarity;

  const stat = (s: number) => statByRarity(id, s, rarity);
  const powerLevels: PowerLevels = {
    Attack: stat(1),
    Defense: stat(2),
    Speed: stat(3),
    Intelligence: stat(4),
    Energy: stat(5),
    Special: stat(6),
    Durability: stat(7),
    Versatility: stat(8),
  };

  const avg = Object.values(powerLevels).reduce((a, b) => a + b, 0) / 8;
  const overallRating = Math.round((avg / 10) * 10) / 10;

  const traitNames = ['Nebula Resistance', 'Void Affinity', 'Weapon Synergy', 'Phase Stability', 'Energy Core'];
  const descriptions = [
    '+15% resistance in gas clouds',
    '+20% evasion in nebula storms',
    `Synergy with ${weapon} in close range`,
    'Stable under dimensional shift',
    'High output in zero-g',
  ];
  const detailedTraits: DetailedTrait[] = [
    ...(nomad.traits ?? []).slice(0, 2).map((t, i) => ({
      name: t.name,
      description: `${t.value} — ${descriptions[i % descriptions.length]}`,
    })),
    { name: 'Ability', description: `${ability} — unique special in combat` },
    { name: 'Weapon', description: `${weapon} — primary armament` },
    { name: traitNames[id % traitNames.length], description: descriptions[(id + 1) % descriptions.length] },
  ];

  const specialty = `${ability} pairs with ${weapon} for high burst potential: in practice it behaves like a short-range teleport or phase strike, ideal for ambush and disengage. Best used when the target is isolated.`;

  const strengthPool = [
    'Strong in 1v1 engagements',
    'High mobility in void zones',
    'Ability scales in nebula density',
    'Weapon has good reach',
    'Resistant to crowd control',
  ];
  const weaknessPool = [
    'Vulnerable to area denial',
    'Energy-heavy ability',
    'Weaker in open space',
    'Cooldown-dependent',
    'Susceptible to disruption',
  ];
  const numStr = 3 + (id % 3);
  const numWeak = 3 + (id % 2);
  const strengths = strengthPool
    .map((s, i) => ({ s, r: seeded(id, 20 + i) }))
    .sort((a, b) => b.r - a.r)
    .slice(0, numStr)
    .map((x) => x.s);
  const weaknesses = weaknessPool
    .map((s, i) => ({ s, r: seeded(id, 30 + i) }))
    .sort((a, b) => b.r - a.r)
    .slice(0, numWeak)
    .map((x) => x.s);

  const others = allNomads.filter((n) => n.id !== id);
  const compatIds = [...others]
    .sort((a, b) => seeded(id, a.id + b.id) - 0.5)
    .slice(0, 5)
    .map((n) => n.id);
  const compatibility: CompatibilityEntry[] = compatIds.map((nomadId, i) => {
    const n = allNomads.find((x) => x.id === nomadId)!;
    const stars = Math.min(5, Math.max(1, Math.round(3 + seeded(id + nomadId, i) * 2)));
    const namePart = n.name.replace(/\s*#\d+\s*$/, '').trim();
    return {
      nomadId,
      stars,
      note: `Synergy with #${String(nomadId).padStart(4, '0')} ${namePart} for ${stars >= 4 ? 'high' : stars >= 3 ? 'moderate' : 'niche'} combos`,
    };
  });

  const upgradePath = [
    'Level 2: Unlock enhanced ability — requires 3 mints or holder airdrop',
    'Level 3: Weapon upgrade — available after 30 days hold',
    'Level 4: Cross-Nomad fusion (experimental) — roadmap Q3 2026',
  ];

  return {
    detailedTraits,
    powerLevels,
    specialty,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    compatibility,
    upgradePath,
    overallRating,
  };
}
