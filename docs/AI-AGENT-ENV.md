# AI Agent — Environment Variables

Configure these in **Vercel** → Project → Settings → Environment Variables (or in `.env.local` for local dev).

## Required for AI thinking

| Variable | Description |
|----------|-------------|
| `XAI_API_KEY` | xAI API key (server-side). Get from x.ai. Used by `/api/ai-agent/run` and cron. |

## Owner & security

| Variable | Description |
|----------|-------------|
| `AI_AGENT_OWNER_ADDRESS` | Ethereum address allowed to open `/ai-agent` and trigger runs. Default: `0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b`. |
| `CRON_SECRET` | Secret for Vercel Cron to call `/api/ai-agent/cron`. Set a random string; Cron sends `Authorization: Bearer <CRON_SECRET>`. |

## Social media (optional)

Rate limit: **1 post per platform per day**.

### Twitter (X)

- `TWITTER_ACCESS_TOKEN` — **OAuth 2.0 user access token** with `tweet.write` scope (from Twitter Developer Portal → your app → OAuth 2.0). The app posts via `POST https://api.twitter.com/2/tweets` using this token as `Authorization: Bearer <token>`.

### Facebook

- `FACEBOOK_PAGE_ACCESS_TOKEN` — Page access token (long-lived). Used to post to Page feed.
- `FACEBOOK_PAGE_ID` — Optional. Default `me` uses the first page tied to the token.

### Instagram (Graph API)

- `INSTAGRAM_ACCESS_TOKEN` — Instagram Graph API access token (Business/Creator account linked to a Facebook Page).
- `INSTAGRAM_USER_ID` — Instagram Business Account ID (required for posting). Feed posts require an `imageUrl` in the request.

---

After setting env vars, redeploy. Then:

1. Open **https://your-site.vercel.app/ai-agent** and connect the owner wallet.
2. Click **Run agent now** to get AI decisions.
3. Toggle **Human approval required** and click **Execute** on a decision to post (if social keys are set).
4. Cron runs daily at 12:00 UTC and only logs decisions (no auto-post unless you add that logic).
