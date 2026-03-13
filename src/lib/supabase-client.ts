/**
 * Supabase client for leaderboards (optional).
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for real DB.
 * Fallback: in-memory mock so app works without Supabase.
 */

export type LeaderboardEntry = {
  rank: number;
  address: string;
  displayName: string;
  shards: number;
  xp: number;
  level: number;
  battlesWon: number;
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: '0x...', displayName: 'CosmicKing', shards: 1250, xp: 890, level: 9, battlesWon: 42 },
  { rank: 2, address: '0x...', displayName: 'NebulaNinja', shards: 980, xp: 720, level: 8, battlesWon: 31 },
  { rank: 3, address: '0x...', displayName: 'VoidWalker', shards: 760, xp: 550, level: 6, battlesWon: 24 },
  { rank: 4, address: '0x...', displayName: 'StarForge', shards: 520, xp: 410, level: 5, battlesWon: 18 },
  { rank: 5, address: '0x...', displayName: 'NomadPrime', shards: 340, xp: 280, level: 4, battlesWon: 12 },
];

/** Lazy Supabase client (only when env + package available). Avoids build-time require. */
async function getSupabaseAsync(): Promise<{ from: (t: string) => unknown } | null> {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(url, key) as unknown as { from: (t: string) => unknown };
  } catch {
    return null;
  }
}

/** Fetch top players. Uses Supabase when configured and package installed; else mock. */
export async function fetchLeaderboard(by: 'shards' | 'xp' | 'battles' = 'shards', limit = 10): Promise<LeaderboardEntry[]> {
  const supabase = await getSupabaseAsync();
  if (!supabase) return MOCK_LEADERBOARD.slice(0, limit);
  try {
    const col = by === 'shards' ? 'shards' : by === 'xp' ? 'xp' : 'battles_won';
    const sb = supabase as { from: (t: string) => { select: (s: string) => { order: (c: string, o: { ascending: boolean }) => { limit: (n: number) => Promise<{ data: unknown[]; error: unknown }> } } } };
    const { data, error } = await sb.from('leaderboard').select('address, display_name, shards, xp, level, battles_won').order(col, { ascending: false }).limit(limit);
    if (error) throw error;
    return ((data as Record<string, unknown>[]) || []).map((r, i) => ({
      rank: i + 1,
      address: String(r.address ?? ''),
      displayName: String(r.display_name ?? 'Anonymous'),
      shards: Number(r.shards ?? 0),
      xp: Number(r.xp ?? 0),
      level: Number(r.level ?? 1),
      battlesWon: Number(r.battles_won ?? 0),
    }));
  } catch {
    return MOCK_LEADERBOARD.slice(0, limit);
  }
}

/** Submit/update current user stats. No-op when Supabase not available. */
export async function submitLeaderboardEntry(entry: {
  address: string;
  displayName?: string;
  shards: number;
  xp: number;
  level: number;
  battlesWon: number;
}): Promise<void> {
  const supabase = await getSupabaseAsync();
  if (!supabase) return;
  try {
    const sb = supabase as { from: (t: string) => { upsert: (d: unknown, o: { onConflict: string }) => Promise<unknown> } };
    await sb.from('leaderboard').upsert(
      {
        address: entry.address,
        display_name: entry.displayName || entry.address.slice(0, 8) + '...',
        shards: entry.shards,
        xp: entry.xp,
        level: entry.level,
        battles_won: entry.battlesWon,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'address' }
    );
  } catch {
    // Mock or offline
  }
}
