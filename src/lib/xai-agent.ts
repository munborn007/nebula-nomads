/**
 * AI Agent — xAI-powered "thinking" for autonomous site operations.
 * Input: site state (user count, mints, errors). Output: structured decisions.
 * Use server-side only for sensitive actions; keep XAI_API_KEY in env.
 *
 * Env: XAI_API_KEY (server), NEXT_PUBLIC_XAI_API_KEY (client optional)
 */

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

export type AgentActionType = 'social_post' | 'content_update' | 'feature_add' | 'nft_tease' | 'blog_post' | 'error_fix' | 'roadmap_update';

export interface AgentDecision {
  action: AgentActionType;
  /** Human-readable reason */
  reason: string;
  /** Platform for social_post: twitter | facebook | instagram */
  platform?: string;
  /** Suggested post content or update text */
  content?: string;
  /** Optional link (e.g. NFT page, blog) */
  link?: string;
  /** Optional image URL for social */
  imageUrl?: string;
}

export interface SiteState {
  userCount?: number;
  mintsTotal?: number;
  recentErrors?: string[];
  lastBlogAt?: string;
  lastSocialPostAt?: Record<string, string>;
}

const DEFAULT_STATE: SiteState = {
  userCount: 0,
  mintsTotal: 0,
  recentErrors: [],
};

const VALID_ACTIONS: AgentActionType[] = [
  'social_post', 'content_update', 'feature_add', 'nft_tease', 'blog_post', 'error_fix', 'roadmap_update',
];
const VALID_PLATFORMS = ['twitter', 'facebook', 'instagram'];

/** Parse xAI response into decisions. Handles markdown code blocks, single object, malformed JSON. */
function parseDecisionsFromRaw(raw: string): AgentDecision[] {
  if (!raw || typeof raw !== 'string') return [];
  let cleaned = raw
    .replace(/```\w*\n?/g, '')
    .replace(/```\s*$/g, '')
    .trim();
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.slice(firstBracket, lastBracket + 1);
  }
  try {
    const parsed = JSON.parse(cleaned) as unknown;
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    return arr
      .filter((d): d is AgentDecision => d && typeof d === 'object' && typeof (d as AgentDecision).action === 'string' && typeof (d as AgentDecision).reason === 'string')
      .map((d) => {
        const action = VALID_ACTIONS.includes((d as AgentDecision).action) ? (d as AgentDecision).action : 'social_post';
        const platform = d.platform && VALID_PLATFORMS.includes(String(d.platform).toLowerCase()) ? String(d.platform).toLowerCase() : undefined;
        return {
          action,
          reason: String((d as AgentDecision).reason || ''),
          platform,
          content: typeof (d as AgentDecision).content === 'string' ? (d as AgentDecision).content : undefined,
          link: typeof (d as AgentDecision).link === 'string' ? (d as AgentDecision).link : undefined,
          imageUrl: typeof (d as AgentDecision).imageUrl === 'string' ? (d as AgentDecision).imageUrl : undefined,
        };
      })
      .slice(0, 5);
  } catch {
    return [];
  }
}

/**
 * Call xAI to analyze site state and return 1–3 recommended actions as JSON.
 * Server-side: use XAI_API_KEY. Parses JSON array from model response.
 */
export async function think(siteState: SiteState): Promise<{ decisions: AgentDecision[]; raw?: string }> {
  const state = { ...DEFAULT_STATE, ...siteState };
  const key = process.env.XAI_API_KEY || process.env.NEXT_PUBLIC_XAI_API_KEY;
  if (!key) {
    return {
      decisions: [
        { action: 'social_post', reason: 'No xAI key set. Add XAI_API_KEY to enable.', platform: 'twitter', content: 'Nebula Nomads — cosmic NFT collection. Explore at ' + (process.env.NEXT_PUBLIC_SITE_URL || '') },
      ],
      raw: 'stub',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';
  const systemPrompt = `You are the autonomous AI agent for Nebula Nomads, a cosmic NFT collection site (${siteUrl}).
Given site state JSON, reply with a JSON array of 1 to 3 actions. No other text.
Valid actions: social_post, content_update, feature_add, nft_tease, blog_post, error_fix, roadmap_update.
For social_post include "platform": "twitter" or "facebook" or "instagram", and "content" (post text), optional "link" (${siteUrl}/explore etc).
Each object must have: "action", "reason". For social_post add "platform", "content", and optionally "link".
Example: [{"action":"social_post","reason":"Engage followers","platform":"twitter","content":"Explore Nebula Nomads — cosmic NFTs. Mint, stake, play.","link":"${siteUrl}"}]
Return only the JSON array, no markdown.`;

  const userPrompt = `Site state: ${JSON.stringify(state)}. Return a JSON array of 1-3 actions (action, reason, and for social_post: platform, content, link). Only the array.`;

  try {
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
        max_tokens: 600,
      }),
    });
    if (!res.ok) throw new Error(`xAI ${res.status}`);
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '';
    const decisions = parseDecisionsFromRaw(raw);
    return { decisions, raw };
  } catch (e) {
    const fallback: AgentDecision[] = [
      { action: 'social_post', reason: 'Fallback: xAI call failed. Check key and network.', platform: 'twitter', content: 'Nebula Nomads — mint, explore, stake. ' + (process.env.NEXT_PUBLIC_SITE_URL || ''), link: process.env.NEXT_PUBLIC_SITE_URL },
    ];
    return { decisions: fallback, raw: String(e) };
  }
}
