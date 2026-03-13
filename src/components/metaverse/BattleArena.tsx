'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-state';
import { useQuestStore } from '@/lib/quest-store';
import { getAbilityDamage, getWeaponDamage, getUltimateDamage, getDamageMultiplierForLevel } from '@/lib/game-abilities';
type BattlePhase = 'idle' | 'queue' | 'practice' | 'fighting' | 'result';

/** Battle Arena — P2E queue, wager shards, practice vs dummy. Q/E/R + level scaling + combo. */
export default function BattleArena() {
  const { shards, level, nomadAbility, nomadWeapon, nomadRarity, addShards, addXp, addCombo } = useGameStore();
  const { quests, setProgress } = useQuestStore();
  const [phase, setPhase] = useState<BattlePhase>('idle');
  const [wagerShards, setWagerShards] = useState(10);
  const [dummyHp, setDummyHp] = useState(100);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);

  const handlePractice = () => {
    setPhase('practice');
    setDummyHp(100);
    setResult(null);
    const mult = getDamageMultiplierForLevel(level);
    const abilityDmg = Math.floor(getAbilityDamage(nomadAbility, nomadRarity) * mult);
    const weaponDmg = Math.floor(getWeaponDamage(nomadWeapon, nomadRarity) * mult);
    const ultimateDmg = Math.floor(getUltimateDamage(nomadAbility, nomadRarity) * mult);
    const dmgPerTick = abilityDmg + weaponDmg + Math.floor(ultimateDmg * 0.2);
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setDummyHp((h) => {
        const next = Math.max(0, h - dmgPerTick);
        if (next <= 0) {
          clearInterval(interval);
          setPhase('result');
          setResult('win');
          const combo = addCombo();
          const bonus = 5 + Math.min(10, combo);
          addShards(bonus);
          addXp(15 + Math.min(10, combo));
          const defeatQuest = quests.find((q) => q.objective === 'defeat_enemies' && !q.completed);
          if (defeatQuest) setProgress(defeatQuest.id, defeatQuest.progress + 1);
        }
        return next;
      });
      if (tick >= 5) clearInterval(interval);
    }, 800);
  };

  const handleQueue = () => {
    if (shards < wagerShards) return;
    setPhase('queue');
    // In production: join Colyseus battle_arena room, lock wager on-chain
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-card rounded-2xl p-6 border border-neon-orange/30"
    >
      <h2 className="text-lg font-bold text-neon-orange mb-2">Battle Arena</h2>
      <p className="text-slate-400 text-sm mb-4">
        P2E 1v1 — Q/E/R abilities, level scaling, combo bonus. Wager shards; winner takes all minus 5% fee.
      </p>

      {phase === 'idle' && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePractice}
            className="rounded-lg border border-neon-orange/50 bg-neon-orange/10 px-4 py-2 text-sm text-neon-orange hover:bg-neon-orange/20"
          >
            Practice vs Dummy
          </button>
          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-sm">Wager shards:</label>
            <input
              type="number"
              min={1}
              max={Math.max(1, shards)}
              value={wagerShards}
              onChange={(e) => setWagerShards(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-20 rounded bg-black/40 border border-neon-orange/30 px-2 py-1 text-white text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleQueue}
            disabled={shards < wagerShards}
            className="rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2 text-sm text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Queue 1v1
          </button>
          <Link
            href="/explore"
            className="rounded-lg border border-slate-500 px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            Pick Nomad
          </Link>
        </div>
      )}

      {phase === 'practice' && (
        <div className="space-y-2">
          <p className="text-neon-cyan text-sm">Dummy HP: {dummyHp}</p>
          <p className="text-slate-500 text-xs">Simulating ability + weapon hits...</p>
        </div>
      )}

      {phase === 'queue' && (
        <p className="text-slate-400 text-sm">Matchmaking... (Colyseus battle_arena when server is live)</p>
      )}

      {phase === 'result' && result && (
        <div className="space-y-2">
          <p className={result === 'win' ? 'text-green-400' : 'text-red-400'}>
            {result === 'win' ? 'Victory! +5 shards, +15 XP' : 'Defeat'}
          </p>
          <button
            type="button"
            onClick={() => setPhase('idle')}
            className="rounded-lg border border-neon-orange/50 px-3 py-1 text-sm text-neon-orange"
          >
            Back
          </button>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">Connect wallet to use owned Nomad; real P2E when BattleContract + server are live.</p>
    </motion.div>
  );
}
