/**
 * xAI API integration for procedural zones, quests, enemies.
 * Server-side: use XAI_API_KEY (env). Client-side: use NEXT_PUBLIC_XAI_API_KEY only if safe (e.g. server route proxy).
 * Security: Prefer calling from API route so key is never exposed. Fallback: stub from xai-procedural.
 */

import {
  generateZoneFromPrompt as stubZone,
  generateQuestFromPrompt as stubQuest,
  generateEnemyFromPrompt as stubEnemy,
  type ProceduralZone,
  type ProceduralQuest,
  type ProceduralEnemy,
} from '@/lib/xai-procedural';

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

function getApiKey(): string | null {
  if (typeof window !== 'undefined') return process.env.NEXT_PUBLIC_XAI_API_KEY || null;
  return process.env.XAI_API_KEY || process.env.NEXT_PUBLIC_XAI_API_KEY || null;
}

/** Call xAI chat completion. Use from API route in production. */
async function callXAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error('No xAI API key');
  const res = await fetch(XAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'grok-3-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
    }),
  });
  if (!res.ok) throw new Error(`xAI API ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

/** Generate zone: try xAI then stub. */
export async function generateZoneWithAPI(prompt: string): Promise<ProceduralZone> {
  try {
    const out = await callXAI(
      'You are a game designer. Reply with only a JSON object: { "name": "string", "theme": "nebula|crystal|void|solar|ice|chaos" }. No markdown.',
      `Generate a cosmic zone: ${prompt.slice(0, 200)}`
    );
    const parsed = JSON.parse(out.replace(/```\w*\n?/g, '').trim());
    const theme = ['nebula', 'crystal', 'void', 'solar', 'ice', 'chaos'].includes(parsed.theme)
      ? parsed.theme
      : 'nebula';
    const hash = prompt.split('').reduce((h, c) => (h << 5) - h + c.charCodeAt(0) | 0, 0);
    return {
      id: `zone-${hash.toString(36)}`,
      name: String(parsed.name || prompt.slice(0, 30)).slice(0, 50),
      theme,
      seed: hash,
    };
  } catch {
    return stubZone(prompt);
  }
}

/** Generate quest: try xAI then stub. */
export async function generateQuestWithAPI(prompt: string): Promise<ProceduralQuest> {
  try {
    const out = await callXAI(
      'You are a game designer. Reply with only a JSON object: { "title": "string", "objective": "collect_shards|defeat_enemies|survive_storm|reach_zone", "targetCount": number, "rewardShards": number, "rewardXp": number }. No markdown.',
      `Generate a cosmic quest: ${prompt.slice(0, 200)}`
    );
    const parsed = JSON.parse(out.replace(/```\w*\n?/g, '').trim());
    const objectives: ProceduralQuest['objective'][] = ['collect_shards', 'defeat_enemies', 'survive_storm', 'reach_zone'];
    const objective = objectives.includes(parsed.objective) ? parsed.objective : 'collect_shards';
    const hash = prompt.split('').reduce((h, c) => (h << 5) - h + c.charCodeAt(0) | 0, 0);
    return {
      id: `quest-${hash.toString(36)}`,
      title: String(parsed.title || 'Quest').slice(0, 60),
      description: prompt.slice(0, 120),
      objective,
      targetCount: Math.min(100, Math.max(1, Number(parsed.targetCount) || 10)),
      rewardShards: Math.min(100, Math.max(1, Number(parsed.rewardShards) || 10)),
      rewardXp: Math.min(500, Math.max(5, Number(parsed.rewardXp) || 30)),
    };
  } catch {
    return stubQuest(prompt);
  }
}

/** Generate enemy: try xAI then stub. */
export async function generateEnemyWithAPI(prompt: string): Promise<ProceduralEnemy> {
  try {
    const out = await callXAI(
      'You are a game designer. Reply with only a JSON object: { "name": "string", "health": number, "damage": number }. No markdown.',
      `Generate a cosmic enemy: ${prompt.slice(0, 200)}`
    );
    const parsed = JSON.parse(out.replace(/```\w*\n?/g, '').trim());
    const hash = prompt.split('').reduce((h, c) => (h << 5) - h + c.charCodeAt(0) | 0, 0);
    return {
      id: `enemy-${hash.toString(36)}`,
      name: String(parsed.name || 'Void Beast').slice(0, 30),
      health: Math.min(200, Math.max(20, Number(parsed.health) || 50)),
      damage: Math.min(30, Math.max(1, Number(parsed.damage) || 10)),
      vfx: 'burst',
    };
  } catch {
    return stubEnemy(prompt);
  }
}
