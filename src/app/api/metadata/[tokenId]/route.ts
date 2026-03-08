/**
 * OpenSea / ERC-721 metadata for tokenURI(tokenId).
 * Contract returns baseURI + tokenId + ".json" — use baseURI without trailing slash and request /api/metadata/1.json
 * This route serves GET /api/metadata/1 (and /api/metadata/1.json via same segment).
 */
import { NextRequest } from 'next/server';
import { getNomadById } from '@/data/nomads';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId: raw } = await params;
  const tokenId = parseInt(raw.replace(/\.json$/i, ''), 10);
  if (!Number.isFinite(tokenId) || tokenId < 1 || tokenId > 10_000) {
    return new Response(JSON.stringify({ error: 'Invalid token id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nomad = getNomadById(tokenId);
  const name = nomad?.name ?? `Nebula Nomad #${String(tokenId).padStart(4, '0')}`;
  const description = nomad?.lore ?? `Nebula Nomads NFT #${tokenId}. Cosmic AI collection.`;
  const image = `${SITE_URL}/api/nft-image/${tokenId}`;
  const attributes = nomad?.traits?.map((t) => ({ trait_type: t.name, value: t.value })) ?? [
    { trait_type: 'Rarity', value: 'Common' },
    { trait_type: 'Generation', value: 'Genesis' },
    { trait_type: 'ID', value: String(tokenId).padStart(4, '0') },
  ];

  const metadata = {
    name,
    description,
    image,
    external_url: `${SITE_URL}/nomads/${tokenId}`,
    attributes,
  };

  return new Response(JSON.stringify(metadata), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
