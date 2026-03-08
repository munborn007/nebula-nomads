import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const filename = (num: number) => `nomad-${String(num).padStart(4, '0')}.png`;

function getImagePathCandidates(num: number): string[] {
  const cwd = process.cwd();
  return [
    join(cwd, 'public', 'nfts', 'thumbs', filename(num)),
    join(cwd, 'nebula-nomads-app', 'public', 'nfts', 'thumbs', filename(num)),
  ];
}

function getImagePath(num: number): string | null {
  for (const filePath of getImagePathCandidates(num)) {
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const num = parseInt(id, 10);
    if (!Number.isFinite(num) || num < 1 || num > 30) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const filePath = getImagePath(num);
    if (!filePath) {
      const pathsTried = getImagePathCandidates(num);
      const body =
        process.env.NODE_ENV === 'development'
          ? JSON.stringify({
              error: 'Image file not found',
              cwd: process.cwd(),
              pathsTried,
              hint: 'Put nomad-0001.png … nomad-0030.png in the folder that contains package.json, under public\\nfts\\thumbs\\',
            })
          : null;
      return new NextResponse(body, {
        status: 404,
        headers: {
          'Cache-Control': 'no-store',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
      });
    }

    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
