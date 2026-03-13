/**
 * Client-facing xAI integration. All real API calls go through Next.js API routes
 * so XAI_API_KEY is never exposed. Use for zone/quest/enemy generation from UI.
 */
import type { ProceduralZone } from '@/lib/xai-procedural';

/** Generate zone via server-side API (hides key). Falls back to stub on error. */
export async function generateZoneViaAPI(prompt: string): Promise<ProceduralZone> {
  try {
    const res = await fetch('/api/generate-zone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt.slice(0, 500) }),
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    const { generateZoneFromPrompt } = await import('@/lib/xai-procedural');
    return generateZoneFromPrompt(prompt);
  }
}
