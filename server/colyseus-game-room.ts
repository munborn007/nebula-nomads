/**
 * Colyseus game room — sync avatars, shards, battles.
 * Deploy to Railway/Render/Fly.io; Vercel cannot run long-lived WebSocket servers.
 *
 * Usage (standalone Colyseus server):
 *   import { Room } from 'colyseus';
 *   import { GameRoomState } from './colyseus-game-room';
 *
 *   class NebulaGameRoom extends Room<GameRoomState> { ... }
 */

export type AvatarState = {
  id: string;
  sessionId: string;
  nomadId: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  shards: number;
  xp: number;
  level: number;
};

export type GameRoomState = {
  avatars: Record<string, AvatarState>;
  playerCount: number;
  shardPositions: { id: string; x: number; y: number; z: number }[];
};

/** Battle room: 1v1 HP, attacks, winner. Server validates damage (anti-cheat). */
export type BattlePlayerState = {
  sessionId: string;
  nomadId: number;
  hp: number;
  maxHp: number;
  lastAttackAt: number;
};

export type BattleRoomState = {
  phase: 'waiting' | 'fighting' | 'ended';
  players: Record<string, BattlePlayerState>;
  winner: string | null;
  wagerShards: number;
  questSync: { questId: string; progress: number }[];
};

/** Scheduled events (boss spawn, airdrop rain). Server broadcasts event type + countdown. */
export type ScheduledEventType = 'boss_fight' | 'airdrop_rain' | 'tournament';
export type ScheduledEvent = {
  id: string;
  type: ScheduledEventType;
  startsAt: number;
  payload?: Record<string, unknown>;
};

/** Schema for Colyseus (when using @colyseus/schema) */
/*
import { Schema, type, MapSchema } from '@colyseus/schema';

export class AvatarSchema extends Schema {
  @type('string') id: string;
  @type('number') nomadId: number;
  @type('number') x: number;
  @type('number') y: number;
  @type('number') z: number;
  @type('number') shards: number;
  @type('number') level: number;
}

export class GameRoomState extends Schema {
  @type({ map: AvatarSchema }) avatars = new MapSchema<AvatarSchema>();
}
*/
