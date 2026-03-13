/**
 * Cron endpoint for scheduled AI agent runs. Secured by CRON_SECRET.
 * Vercel Cron calls: GET /api/ai-agent/cron with Authorization: Bearer <CRON_SECRET>
 * Runs agent think(); does not auto-execute social posts (safety). Log only.
 *
 * Env: CRON_SECRET (set in Vercel → Settings → Environment Variables)
 */
import { NextRequest, NextResponse } from 'next/server';
import { think } from '@/lib/xai-agent';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteState = { userCount: 0, mintsTotal: 0, recentErrors: [] as string[] };
    const { decisions, raw } = await think(siteState);
    return NextResponse.json({
      ok: true,
      at: new Date().toISOString(),
      decisionsCount: decisions.length,
      decisions,
      rawPreview: raw?.slice(0, 300),
    });
  } catch (e) {
    console.error('ai-agent/cron error:', e);
    return NextResponse.json({ error: 'Cron run failed' }, { status: 500 });
  }
}
