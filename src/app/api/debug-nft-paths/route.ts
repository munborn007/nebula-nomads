import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

function getPaths(num: number): string[] {
  const name = `nomad-${String(num).padStart(4, '0')}.png`;
  const cwd = process.cwd();
  return [
    join(cwd, 'public', 'nfts', 'thumbs', name),
    join(cwd, 'nebula-nomads-app', 'public', 'nfts', 'thumbs', name),
  ];
}

/**
 * In development only: returns the exact paths the server looks for when loading an NFT image.
 * Open /api/debug-nft-paths?id=1 in the browser to see where to put nomad-0001.png.
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  const id = req.nextUrl.searchParams.get('id') || '1';
  const num = Math.min(30, Math.max(1, parseInt(id, 10) || 1));
  return NextResponse.json({
    cwd: process.cwd(),
    pathsTried: getPaths(num),
    hint: 'Put your PNG in the folder that matches one of the paths above.',
  });
}
