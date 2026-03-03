import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get('address');
    if (!address) return NextResponse.json([]);
    // Placeholder: return mock NFTs for connected wallet (replace with real indexer later)
    return NextResponse.json([
      { tokenId: '1', metadata: { name: 'Nomad #1' } },
      { tokenId: '2', metadata: { name: 'Nomad #2' } },
    ]);
  } catch (e) {
    console.error('API user-nfts error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
