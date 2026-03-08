/** Sample blog posts — extend with Markdown/CMS later */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'nebula-nomads-launch-q2-2026',
    title: 'Nebula Nomads Official Launch — Q2 2026',
    excerpt: 'The cosmic NFT collection goes live. Mint 1–20 with ETH, buy 21–30 on secondary. AI-curated traits, AR support, and staking roadmap.',
    date: '2026-02-15',
    author: 'Nebula Team',
    content: `
Nebula Nomads officially launches in Q2 2026. The collection features 30 unique AI-curated Nomads with distinct traits, abilities, and lore.

**Mint details:**
- Nomads 1–20: Mint with ETH on Sepolia (testnet) and mainnet at launch
- Nomads 21–30: Secondary market (OpenSea, etc.)

**Features at launch:**
- AR Viewer for mobile
- Dashboard for owned NFTs
- Staking (lock Nomads for rewards)
- Breeding teaser (combine two Nomads for preview)

Join the community on X and Discord to stay updated.
    `.trim(),
  },
  {
    id: '2',
    slug: 'staking-and-metaverse-roadmap',
    title: 'Staking & Metaverse Roadmap Update',
    excerpt: 'Lock your Nomads for rewards. 3D Metaverse walkthrough preview and GLB avatar support coming soon.',
    date: '2026-02-10',
    author: 'Nebula Team',
    content: `
We're expanding utility for Nebula Nomads holders.

**Staking:** Lock your Nomad NFTs to earn test tokens. APY and mechanics will be announced before mainnet.

**Metaverse:** A 3D walkthrough preview is live on /metaverse. Full world with Nomad avatars (GLB models) is in development for Q3 2026.

**AR:** QR code scanner for mobile AR and placeholder GLB support are being added. Add your own models to \`public/models/\` for testing.
    `.trim(),
  },
  {
    id: '3',
    slug: 'ai-personalization-xai-integration',
    title: 'AI Personalization & xAI Integration Teaser',
    excerpt: 'Generate custom Nomad traits and lore with AI. xAI API placeholder — full integration coming.',
    date: '2026-02-05',
    author: 'Nebula Team',
    content: `
We're exploring AI-powered personalization for Nebula Nomads.

**Custom traits & lore:** Use the AI personalization button (coming soon) to generate unique traits and backstories for your Nomads. Powered by xAI API (placeholder until integration).

**Community input:** Share your ideas for AI features on our Discord. We're considering breed-name suggestions, lore expansion, and compatibility scoring.
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
