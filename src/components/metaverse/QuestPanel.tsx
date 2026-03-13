'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuestStore } from '@/lib/quest-store';
import { useGameStore } from '@/lib/game-state';

/** Quest UI: active quests, progress bars, claim rewards. */
export default function QuestPanel() {
  const { quests, setProgress, completeQuest } = useQuestStore();
  const { shards, xp, addShards, addXp } = useGameStore();

  // Sync collect_shards quest from game shards (only when shards changes to avoid loop)
  useEffect(() => {
    const state = useQuestStore.getState();
    const collectQuest = state.quests.find((q) => q.objective === 'collect_shards' && !q.completed);
    if (collectQuest && shards > collectQuest.progress) {
      state.setProgress(collectQuest.id, shards);
    }
  }, [shards]);

  const handleClaim = (questId: string) => {
    const q = completeQuest(questId);
    if (q) {
      addShards(q.rewardShards);
      addXp(q.rewardXp);
    }
  };

  const active = quests.filter((q) => !q.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-card rounded-2xl p-6 border border-neon-purple/30"
    >
      <h2 className="text-lg font-bold text-neon-purple mb-2">Quests</h2>
      <p className="text-slate-400 text-sm mb-4">
        Complete objectives for shards and XP. Progress updates as you play.
      </p>
      <ul className="space-y-3">
        {active.slice(0, 3).map((q) => {
          const pct = Math.min(100, (q.progress / q.targetCount) * 100);
          const canClaim = q.progress >= q.targetCount;
          return (
            <li key={q.id} className="rounded-lg bg-black/30 px-3 py-2">
              <p className="text-white font-medium text-sm">{q.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{q.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-neon-cyan rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {q.progress}/{q.targetCount}
                </span>
              </div>
              {canClaim && (
                <button
                  type="button"
                  onClick={() => handleClaim(q.id)}
                  className="mt-2 rounded border border-neon-cyan/50 px-2 py-1 text-xs text-neon-cyan hover:bg-neon-cyan/10"
                >
                  Claim +{q.rewardShards} shards, +{q.rewardXp} XP
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {active.length === 0 && <p className="text-slate-500 text-sm">No active quests. Generate more via AI or refresh.</p>}
    </motion.div>
  );
}
