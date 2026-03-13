'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/game-state';

/** Game HUD: HP bar, shards, XP, level 1–50, Q/E/R abilities, combo. */
export default function GameHUD() {
  const {
    shards,
    xp,
    level,
    hp,
    maxHp,
    comboCount,
    nomadAbility,
    nomadWeapon,
    abilityQReady,
    abilityEReady,
    abilityRReady,
    useAbilityQ,
    useAbilityE,
    useAbilityR,
  } = useGameStore();
  const hpPct = maxHp > 0 ? (hp / maxHp) * 100 : 100;

  useEffect(() => {
    const t = setInterval(() => useGameStore.getState().tickAbilities(), 200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* Top: HP, shards, XP, level, combo */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="holo-card rounded-lg px-3 py-2 pointer-events-auto min-w-[80px]">
          <div className="flex justify-between text-xs text-slate-500 mb-0.5">
            <span>HP</span>
            <span>{hp}/{maxHp}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${hpPct}%` }} />
          </div>
        </div>
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
        {comboCount > 1 && (
          <div className="holo-card rounded-lg px-3 py-1 pointer-events-auto border border-amber-500/50">
            <span className="text-amber-400 font-mono text-sm">{comboCount}x Combo</span>
          </div>
        )}
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
          <button
            type="button"
            onClick={() => useAbilityR()}
            disabled={!abilityRReady}
            className={`rounded-lg px-3 py-1.5 text-sm font-mono transition ${
              abilityRReady ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30' : 'bg-slate-800/50 text-slate-500 border border-slate-600 cursor-not-allowed'
            }`}
            title={`Ultimate: ${nomadAbility}`}
          >
            R
          </button>
        </div>
      </div>
    </div>
  );
}
