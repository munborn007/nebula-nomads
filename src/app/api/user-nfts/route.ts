import { NextRequest, NextResponse } from 'next/server';

const HEX_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function GET(req: NextRequest) {
  try {
    let address: string | null = null;
    try {
      address = req.nextUrl.searchParams.get('address');
    } catch {
      return NextResponse.json([]);
    }
    if (!address || !HEX_ADDRESS.test(address)) return NextResponse.json([]);
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
