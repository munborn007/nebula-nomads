import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ total: 10000, minted: 0 });
  } catch (e) {
    console.error('API supply error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
