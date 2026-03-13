/**
 * Active quest state — synced with game-state (shards, XP) for completion.
 * Progress updated when user collects shards, defeats enemies, etc.
 */

import { create } from 'zustand';
import type { ProceduralQuest } from '@/lib/xai-procedural';

export interface ActiveQuest extends ProceduralQuest {
  progress: number;
  completed: boolean;
}

const DEFAULT_QUESTS: ActiveQuest[] = [
  {
    id: 'quest-collect-1',
    title: 'Cosmic Shard Hunter',
    description: 'Collect shards scattered around the Nexus.',
    objective: 'collect_shards',
    targetCount: 10,
    rewardShards: 15,
    rewardXp: 50,
    progress: 0,
    completed: false,
  },
  {
    id: 'quest-void-1',
    title: 'Void Beast Bounty',
    description: 'Defeat void beasts in the arena or practice.',
    objective: 'defeat_enemies',
    targetCount: 3,
    rewardShards: 25,
    rewardXp: 80,
    progress: 0,
    completed: false,
  },
  {
    id: 'quest-survive-1',
    title: 'Storm Survivor',
    description: 'Survive 30 seconds in the storm zone.',
    objective: 'survive_storm',
    targetCount: 1,
    rewardShards: 20,
    rewardXp: 60,
    progress: 0,
    completed: false,
  },
];

interface QuestActions {
  setProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => ActiveQuest | null;
  addQuest: (quest: ActiveQuest) => void;
  reset: () => void;
}

export const useQuestStore = create<{ quests: ActiveQuest[] } & QuestActions>((set, get) => ({
  quests: [...DEFAULT_QUESTS],
  setProgress: (questId, progress) =>
    set((s) => ({
      quests: s.quests.map((q) => (q.id === questId ? { ...q, progress: Math.min(q.targetCount, progress) } : q)),
    })),
  completeQuest: (questId) => {
    const q = get().quests.find((x) => x.id === questId);
    if (!q || q.completed) return null;
    set((s) => ({
      quests: s.quests.map((x) => (x.id === questId ? { ...x, completed: true, progress: x.targetCount } : x)),
    }));
    return q;
  },
  addQuest: (quest) => set((s) => ({ quests: [...s.quests, quest] })),
  reset: () => set({ quests: [...DEFAULT_QUESTS] }),
}));
