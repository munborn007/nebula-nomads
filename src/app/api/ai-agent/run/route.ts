/**
 * Run AI agent (owner-only). POST with wallet address; server verifies owner.
 * Returns { decisions, logs } for dashboard. Does not execute actions.
 *
 * Env: AI_AGENT_OWNER_ADDRESS (default 0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b)
 */
import { NextRequest, NextResponse } from 'next/server';
import { think } from '@/lib/xai-agent';

const OWNER = (process.env.AI_AGENT_OWNER_ADDRESS || '0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b').toLowerCase();

function isOwner(wallet: string | null): boolean {
  if (!wallet || typeof wallet !== 'string') return false;
  return wallet.toLowerCase() === OWNER;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const wallet = (body.wallet ?? req.headers.get('x-owner-address')) as string | null;
    if (!isOwner(wallet)) {
      return NextResponse.json({ error: 'Forbidden: owner only' }, { status: 403 });
    }

    const siteState = {
      userCount: body.userCount ?? 0,
      mintsTotal: body.mintsTotal ?? 0,
      recentErrors: Array.isArray(body.recentErrors) ? body.recentErrors : [],
      lastBlogAt: body.lastBlogAt,
      lastSocialPostAt: body.lastSocialPostAt,
    };

    const { decisions, raw } = await think(siteState);
    const logs = [{ at: new Date().toISOString(), event: 'agent_run', decisions: decisions.length, raw: raw?.slice(0, 200) }];

    return NextResponse.json({ decisions, logs });
  } catch (e) {
    console.error('ai-agent/run error:', e);
    return NextResponse.json({ error: 'Agent run failed', decisions: [], logs: [] }, { status: 500 });
  }
}
