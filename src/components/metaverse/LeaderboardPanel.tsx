'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchLeaderboard, type LeaderboardEntry } from '@/lib/supabase-client';

/** Top players by shards / XP / battles. Supabase when configured, else mock. */
export default function LeaderboardPanel() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [by, setBy] = useState<'shards' | 'xp' | 'battles'>('shards');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard(by, 10).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [by]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-card rounded-2xl p-6 border border-neon-cyan/30"
    >
      <h2 className="text-lg font-bold text-neon-cyan mb-2">Leaderboard</h2>
      <div className="flex gap-2 mb-4">
        {(['shards', 'xp', 'battles'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setBy(key)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${by === key ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400 hover:text-white'}`}
          >
            {key === 'battles' ? 'Battles' : key}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : (
        <ol className="space-y-1.5">
          {entries.map((e) => (
            <li key={e.rank} className="flex items-center justify-between text-sm">
              <span className="text-slate-400 w-6">#{e.rank}</span>
              <span className="text-white truncate flex-1 mx-2">{e.displayName}</span>
              <span className="text-neon-cyan font-mono">
                {by === 'shards' ? e.shards : by === 'xp' ? e.xp : e.battlesWon}
              </span>
            </li>
          ))}
        </ol>
      )}
    </motion.div>
  );
}
