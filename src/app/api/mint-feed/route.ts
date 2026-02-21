import { NextRequest, NextResponse } from 'next/server';

function anonymize(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '10', 10), 50);
  const mock = Array.from({ length: limit }, (_, i) => ({
    address: anonymize(`0x${'a'.repeat(40 - String(i).length)}${i}`),
    quantity: (i % 3) + 1,
    time: new Date(Date.now() - i * 60000).toISOString(),
  }));
  return NextResponse.json(mock);
}
