const API_BASE = '/api';

export type SupplyResponse = {
  total: number;
  minted: number;
};

export async function fetchSupply(): Promise<SupplyResponse> {
  const res = await fetch(`${API_BASE}/supply`);
  if (!res.ok) throw new Error('Failed to fetch supply');
  return res.json();
}

export async function fetchMintFeed(limit = 10): Promise<{ address: string; quantity: number; time: string }[]> {
  const res = await fetch(`${API_BASE}/mint-feed?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchUserNFTs(address: string): Promise<{ tokenId: string; metadata?: unknown }[]> {
  const res = await fetch(`${API_BASE}/user-nfts?address=${encodeURIComponent(address)}`);
  if (!res.ok) return [];
  return res.json();
}
