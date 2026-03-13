/**
 * Site stats for AI agent. GET returns userCount, mintsTotal, etc.
 * Replace with real DB/analytics when available.
 */
import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    userCount: 0,
    mintsTotal: 0,
    recentErrors: [] as string[],
    lastBlogAt: null as string | null,
    lastSocialPostAt: {} as Record<string, string>,
  };
  return NextResponse.json(stats);
}
