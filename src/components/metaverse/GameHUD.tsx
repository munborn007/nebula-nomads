'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/game-state';

/** Game HUD: shards, XP, level, ability cooldowns, controls hint. */
export default function GameHUD() {
  const {
    shards,
    xp,
    level,
    nomadAbility,
    nomadWeapon,
    abilityQReady,
    abilityEReady,
    useAbilityQ,
    useAbilityE,
  } = useGameStore();

  useEffect(() => {
    const t = setInterval(() => useGameStore.getState().tickAbilities(), 200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* Top: shards, XP, level */}
      <div className="flex items-center gap-4">
        <div className="holo-card rounded-lg px-3 py-2 pointer-events-auto">
          <span className="text-slate-500 text-xs">Shards</span>
          <p className="text-neon-cyan font-mono text-lg">{shards}</p>
        </div>
        <div className="holo-card rounded-lg px-3 py-2 pointer-events-auto">
          <span className="text-slate-500 text-xs">XP</span>
          <p className="text-white font-mono">{xp}</p>
        </div>
        <div className="holo-card rounded-lg px-3 py-2 pointer-events-auto">
          <span className="text-slate-500 text-xs">Lv</span>
          <p className="text-neon-purple font-mono text-lg">{level}</p>
        </div>
      </div>

      {/* Bottom: controls hint + abilities */}
      <div className="flex flex-col gap-2 items-end">
        <div className="holo-card rounded-lg px-4 py-2 text-xs text-slate-400 pointer-events-auto">
          WASD • Space ↑ • Shift ↓ • Q/E abilities
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => useAbilityQ()}
            disabled={!abilityQReady}
            className={`rounded-lg px-4 py-2 text-sm font-mono transition ${
              abilityQReady
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan/30'
                : 'bg-slate-800/50 text-slate-500 border border-slate-600 cursor-not-allowed'
            }`}
            title={nomadAbility}
          >
            Q: {abilityQReady ? nomadAbility : '…'}
          </button>
          <button
            type="button"
            onClick={() => useAbilityE()}
            disabled={!abilityEReady}
            className={`rounded-lg px-4 py-2 text-sm font-mono transition ${
              abilityEReady
                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50 hover:bg-neon-purple/30'
                : 'bg-slate-800/50 text-slate-500 border border-slate-600 cursor-not-allowed'
            }`}
            title={nomadWeapon}
          >
            E: {abilityEReady ? nomadWeapon : '…'}
          </button>
        </div>
      </div>
    </div>
  );
}
