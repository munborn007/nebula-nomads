import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) return NextResponse.json([]);
  // Placeholder: return mock NFTs for connected wallet
  return NextResponse.json([
    { tokenId: '1', metadata: { name: 'Nomad #1' } },
    { tokenId: '2', metadata: { name: 'Nomad #2' } },
  ]);
}
