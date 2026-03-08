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
