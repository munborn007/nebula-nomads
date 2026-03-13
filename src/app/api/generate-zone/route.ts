/**
 * Server-side xAI zone generation. Keeps XAI_API_KEY off the client.
 * POST body: { prompt: string }. Returns ProceduralZone or stub.
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateZoneFromPrompt } from '@/lib/xai-procedural';

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

async function callXAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error('No XAI_API_KEY');
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
      max_tokens: 300,
    }),
  });
  if (!res.ok) throw new Error(`xAI ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = typeof body?.prompt === 'string' ? body.prompt.slice(0, 500) : '';
    if (!prompt) {
      const zone = await generateZoneFromPrompt('cosmic nebula');
      return NextResponse.json(zone);
    }
    try {
      const out = await callXAI(
        'Reply with only a JSON object: { "name": "string", "theme": "nebula|crystal|void|solar|ice|chaos" }. No markdown.',
        `Generate a cosmic game zone: ${prompt}`
      );
      const parsed = JSON.parse(out.replace(/```\w*\n?/g, '').trim());
      const theme = ['nebula', 'crystal', 'void', 'solar', 'ice', 'chaos'].includes(parsed.theme)
        ? parsed.theme
        : 'nebula';
      const hash = prompt.split('').reduce((h: number, c: string) => (h << 5) - h + c.charCodeAt(0) | 0, 0);
      return NextResponse.json({
        id: `zone-${hash.toString(36)}`,
        name: String(parsed.name || prompt.slice(0, 30)).slice(0, 50),
        theme,
        seed: hash,
      });
    } catch {
      const zone = await generateZoneFromPrompt(prompt);
      return NextResponse.json(zone);
    }
  } catch (e) {
    console.error('generate-zone error:', e);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
