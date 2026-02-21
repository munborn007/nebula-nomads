import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ total: 10000, minted: 0 });
}
