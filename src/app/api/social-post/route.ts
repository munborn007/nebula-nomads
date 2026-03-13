/**
 * Social media post API. Rate limit: 1 post per platform per day.
 * AI agent or dashboard calls this to post to Twitter (X), Facebook, Instagram.
 *
 * Env (optional — stub if missing):
 *   TWITTER_BEARER_TOKEN, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET (or OAuth 2 user tokens)
 *   FACEBOOK_PAGE_ACCESS_TOKEN
 *   INSTAGRAM_ACCESS_TOKEN
 *
 * POST body: { platform: 'twitter'|'facebook'|'instagram', content: string, imageUrl?: string, link?: string }
 */
import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 1 day
const lastPost: Record<string, number> = {};

function canPost(platform: string): boolean {
  const key = platform.toLowerCase();
  const last = lastPost[key] ?? 0;
  if (Date.now() - last < RATE_LIMIT_MS) return false;
  return true;
}

function markPosted(platform: string): void {
  lastPost[platform.toLowerCase()] = Date.now();
}

async function postToTwitter(content: string, _imageUrl?: string, link?: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  const token = process.env.TWITTER_ACCESS_TOKEN;
  if (!token) return { ok: false, error: 'Twitter not configured. Set TWITTER_ACCESS_TOKEN (OAuth 2.0 user access token with tweet.write).' };
  const text = link ? `${content.slice(0, 250)} ${link}`.slice(0, 280) : content.slice(0, 280);
  try {
    const res = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) {
      const errMsg = data.detail || data.error?.message || data.errors?.[0]?.message || res.statusText;
      return { ok: false, error: `Twitter API: ${errMsg}` };
    }
    return { ok: true, id: data.data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Twitter request failed' };
  }
}

async function postToFacebook(content: string, _imageUrl?: string, link?: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) return { ok: false, error: 'Facebook not configured. Set FACEBOOK_PAGE_ACCESS_TOKEN.' };
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID || 'me';
    const params = new URLSearchParams({ message: content.slice(0, 500), access_token: token });
    if (link) params.set('link', link);
    const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await res.json();
    if (data.error) return { ok: false, error: data.error.message };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function postToInstagram(content: string, imageUrl?: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { ok: false, error: 'Instagram not configured. Set INSTAGRAM_ACCESS_TOKEN (Graph API, Business account).' };
  const igUserId = process.env.INSTAGRAM_USER_ID;
  if (!igUserId) return { ok: false, error: 'Set INSTAGRAM_USER_ID (Instagram Business Account ID).' };
  if (!imageUrl) return { ok: false, error: 'Instagram requires imageUrl for feed posts.' };
  try {
    const createRes = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        image_url: imageUrl,
        caption: content.slice(0, 2200),
        access_token: token,
      }).toString(),
    });
    const createData = await createRes.json();
    if (createData.error) return { ok: false, error: createData.error.message };
    const containerId = createData.id;
    let publishRes = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ creation_id: containerId, access_token: token }).toString(),
    });
    const publishData = await publishRes.json();
    if (publishData.error) return { ok: false, error: publishData.error.message };
    return { ok: true, id: publishData.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Instagram request failed' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const platform = (body.platform || '').toLowerCase();
    const content = typeof body.content === 'string' ? body.content : '';
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : undefined;
    const link = typeof body.link === 'string' ? body.link : undefined;

    if (!['twitter', 'facebook', 'instagram'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform. Use twitter, facebook, or instagram.' }, { status: 400 });
    }
    if (!content.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 });
    }

    if (!canPost(platform)) {
      return NextResponse.json({ error: 'Rate limit: 1 post per platform per day.' }, { status: 429 });
    }

    let result: { ok: boolean; id?: string; error?: string };
    if (platform === 'twitter') result = await postToTwitter(content, imageUrl, link);
    else if (platform === 'facebook') result = await postToFacebook(content, imageUrl, link);
    else result = await postToInstagram(content, imageUrl);

    if (result.ok) markPosted(platform);

    return NextResponse.json(result);
  } catch (e) {
    console.error('social-post error:', e);
    return NextResponse.json({ error: 'Post failed' }, { status: 500 });
  }
}
