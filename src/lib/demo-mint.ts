/**
 * Shared demo mint state (localStorage). Used by Mint page and Profile
 * so demo-minted NFTs show up in the user's profile.
 */

export const DEMO_STORAGE_KEY = 'nebula-demo-mints';

export type DemoMintFeedItem = { address: string; quantity: number; time: string };

export function getDemoMintState(): { minted: number; feed: DemoMintFeedItem[] } {
  if (typeof window === 'undefined') return { minted: 0, feed: [] };
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return { minted: 0, feed: [] };
    const parsed = JSON.parse(raw) as { minted: number; feed: DemoMintFeedItem[] };
    return { minted: parsed.minted ?? 0, feed: Array.isArray(parsed.feed) ? parsed.feed : [] };
  } catch {
    return { minted: 0, feed: [] };
  }
}

function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Number of NFTs this wallet has minted in demo mode (from feed). Match address case-insensitively. */
export function getDemoMintCountForAddress(walletAddress: string): number {
  const { feed } = getDemoMintState();
  const truncated = truncateAddress(walletAddress).toLowerCase();
  return feed
    .filter((item) => (item.address || '').toLowerCase() === truncated)
    .reduce((sum, item) => sum + item.quantity, 0);
}

/** Build list of token IDs for demo: ["1", "2", ..., count]. */
export function getDemoTokenIdsForAddress(walletAddress: string): string[] {
  const count = getDemoMintCountForAddress(walletAddress);
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, i) => String(i + 1));
}

export function addDemoMint(address: string, quantity: number): void {
  if (typeof window === 'undefined') return;
  const { minted, feed } = getDemoMintState();
  const truncated = truncateAddress(address);
  const newFeed: DemoMintFeedItem[] = [
    { address: truncated, quantity, time: new Date().toISOString() },
    ...feed.slice(0, 49),
  ];
  const newMinted = minted + quantity;
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ minted: newMinted, feed: newFeed }));
  } catch {
    // ignore
  }
}
