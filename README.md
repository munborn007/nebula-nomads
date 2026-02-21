# Nebula Nomads

AI-powered space exploration NFT project inspired by xAI. Features the world-first **Cosmic Echo**: a real-time, interactive AI-driven nebula generator with WebGL and procedural generation, plus Web Audio space hums synced to the visuals.

## Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Three.js, Tone.js / Web Audio API
- **Web3:** Web3.js (MetaMask; WalletConnect can be wired later)
- **Deploy:** Vercel

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_RECAPTCHA_SITE_KEY, etc. if desired
npm run dev
```

## Deploy to Vercel

1. Push the repo to GitHub and import the project in Vercel.
2. Set environment variables in Vercel (e.g. `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SITE_URL`).
3. Deploy with one command: **Deploy** in the Vercel dashboard or `vercel` CLI.

## Features

- **Cosmic Echo:** Personalize the nebula with a phrase (e.g. wallet address); mouse/touch morphs the nebula; optional space sound (Web Audio).
- **Pages:** Home (hero, countdown, gallery), Mint (wallet, supply, Dutch auction, live feed), Roadmap, About, Community, FAQ.
- **Global:** Fixed header with wallet connect, footer, wormhole-style page transitions.
- **SEO:** Meta tags, sitemap, robots.txt. Google Analytics optional via `NEXT_PUBLIC_GA_ID`.

## Smart contract

Use `NEXT_PUBLIC_CONTRACT_ADDRESS` and extend `src/utils/web3.ts` (CONTRACT_ABI) when the contract is ready. The mint page currently simulates the mint flow.
