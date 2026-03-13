/**
 * Colyseus game server — full backend entry for Metaverse multiplayer.
 * Run: npm install colyseus && npx ts-node server/colyseus-server.ts
 * Deploy to Railway/Render/Fly.io; Vercel cannot run long-lived WebSockets.
 * Security: Validate all client messages (position, abilities); anti-cheat server-side.
 */

import http from 'http';

// Colyseus only required when running this server (not by Next.js)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Server, Room } = require('colyseus');

const PORT = parseInt(process.env.COLYSEUS_PORT || '2567', 10);

/** Nexus/hub: sync positions, chat. */
interface RoomState {
  avatars: Record<string, { id: string; nomadId: number; x: number; y: number; z: number; shards: number; level: number }>;
  playerCount: number;
}

class NebulaGameRoom extends Room<RoomState> {
  onCreate() {
    this.setState({ avatars: {}, playerCount: 0 });
    // Anti-cheat: cap movement speed (max distance per update ~0.5)
    const MAX_DIST = 0.5;
    this.onMessage('move', (client: { sessionId: string }, data: { x: number; y: number; z: number }) => {
      const av = this.state.avatars[client.sessionId];
      if (!av || typeof data.x !== 'number' || typeof data.y !== 'number' || typeof data.z !== 'number') return;
      const dx = data.x - av.x, dy = data.y - av.y, dz = data.z - av.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > MAX_DIST) return;
      av.x = data.x;
      av.y = data.y;
      av.z = data.z;
    });
    this.onMessage('chat', (client: { sessionId: string }, data: { text: string }) => {
      this.broadcast('chat', { sessionId: client.sessionId, text: String((data && data.text) || '').slice(0, 200) });
    });
  }

  onJoin(client: { sessionId: string }, options: { nomadId?: number } = {}) {
    this.state.avatars[client.sessionId] = {
      id: client.sessionId,
      nomadId: options.nomadId ?? 0,
      x: 0,
      y: 0.5,
      z: 0,
      shards: 0,
      level: 1,
    };
    this.state.playerCount = Object.keys(this.state.avatars).length;
  }

  onLeave(client: { sessionId: string }) {
    delete this.state.avatars[client.sessionId];
    this.state.playerCount = Object.keys(this.state.avatars).length;
  }
}

/** Battle arena: 1v1 HP, attacks, winner. Server validates damage (anti-cheat). */
interface BattleState {
  phase: 'waiting' | 'fighting' | 'ended';
  players: Record<string, { sessionId: string; nomadId: number; hp: number; maxHp: number }>;
  winner: string | null;
  wagerShards: number;
}

const MAX_HP = 100;
const DAMAGE_PER_ATTACK = 25;

class BattleArenaRoom extends Room<BattleState> {
  onCreate() {
    this.setState({ phase: 'waiting', players: {}, winner: null, wagerShards: 0 });
    this.onMessage('attack', (client: { sessionId: string }, _data: unknown) => {
      if (this.state.phase !== 'fighting') return;
      const ids = Object.keys(this.state.players);
      const otherId = ids.find((id) => id !== client.sessionId);
      if (!otherId) return;
      const other = this.state.players[otherId];
      if (!other) return;
      other.hp = Math.max(0, other.hp - DAMAGE_PER_ATTACK);
      if (other.hp <= 0) {
        this.state.phase = 'ended';
        this.state.winner = client.sessionId;
        this.broadcast('battle_end', { winner: client.sessionId });
      }
    });
  }

  onJoin(client: { sessionId: string }, options: { nomadId?: number; wagerShards?: number } = {}) {
    this.state.players[client.sessionId] = {
      sessionId: client.sessionId,
      nomadId: options.nomadId ?? 0,
      hp: MAX_HP,
      maxHp: MAX_HP,
    };
    if (options.wagerShards) this.state.wagerShards = options.wagerShards;
    const count = Object.keys(this.state.players).length;
    if (count >= 2) this.state.phase = 'fighting';
  }

  onLeave(client: { sessionId: string }) {
    delete this.state.players[client.sessionId];
    if (this.state.phase === 'fighting' && Object.keys(this.state.players).length < 2) {
      this.state.phase = 'ended';
      this.state.winner = Object.keys(this.state.players)[0] || null;
    }
  }
}

const server = http.createServer();
const gameServer = new Server({ server });

gameServer.define('nebula_nexus', NebulaGameRoom);
gameServer.define('battle_arena', BattleArenaRoom);

gameServer.listen(PORT).then(() => {
  console.log(`Nebula Colyseus server listening on ws://localhost:${PORT}`);
});

export { gameServer };
