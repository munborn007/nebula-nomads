# Nebula Nomads

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com) [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)

**AI Cosmic NFTs with AR** — Mint, collect, and explore the cosmos. NFT drop Q2 2026.

AI-powered space exploration NFT project. Features **Cosmic Echo** (real-time WebGL nebula + Web Audio), **Explore Nomads** grid (20 AI-generated NFTs with rarities), **AR Viewer**, wallet connect, and on-chain minting (Sepolia / mainnet).

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion, Three.js, Tone.js
- **Web3:** Web3.js (MetaMask); contract mint via `NEXT_PUBLIC_CONTRACT_ADDRESS`
- **Analytics:** Vercel Analytics; optional Google Analytics via `NEXT_PUBLIC_GA_ID`
- **Deploy:** Vercel

## Setup

```bash
npm install
```

(Project uses `.npmrc` with `legacy-peer-deps=true` so install succeeds despite the three.js / @google/model-viewer peer conflict.)

```bash
copy .env.example .env.local
```

Edit `.env.local`: `NEXT_PUBLIC_CONTRACT_ADDRESS` (for real mint), `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SITE_URL`.

**Start dev (PowerShell):**
```powershell
npm run clean
npm run dev
```

Or in one go (works in cmd; in PowerShell use the two commands above):
```bash
npm run dev:fresh
```

Open **[http://localhost:3001](http://localhost:3001)** (dev server runs on port 3001).

**If the page keeps loading or doesn’t appear:**  
1. Run `npm run clean` then `npm run dev`. Wait for “✓ Compiled” (first run may take 30–60 s), then open http://localhost:3001.  
2. If it still hangs: close any other `npm run dev`, delete `.next\dev\lock` if it exists, then run `npm run clean` and `npm run dev` again.  
3. To try Turbopack: `npm run dev:turbo`.

## Deploy to Vercel

1. Push the repo to GitHub and import the project in Vercel.
2. In Vercel → Settings → Environment Variables, set:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` — deployed NFT contract (optional; omit for demo mode)
   - `NEXT_PUBLIC_GA_ID` — Google Analytics (optional)
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://nebula-nomads-ci2j.vercel.app`
3. Deploy (auto on push to `main`, or **Deploy** in dashboard).

After deploy: test live — images load fast, mint is real when `NEXT_PUBLIC_CONTRACT_ADDRESS` is set, analytics track.

## Project structure

- `src/app/` — Pages: home, mint, ar-viewer, roadmap, about, community, faq, nomads/[id]
- `src/components/` — NomadCard, Countdown, Header, Footer, WalletConnectButton, etc.
- `src/data/` — nomads (lore, traits), ABI
- `contracts/` — NebulaNomads.sol (ERC-721)
- `scripts/deploy.js` — Hardhat deploy to Sepolia
- `public/nfts/thumbs/` — NFT assets (nomad-0001.png to nomad-0020.png or .png.mp4)

## Minting (on-chain)

See **MINTING.md** for:

- Deploying the ERC-721 contract (Remix or Hardhat) on Sepolia
- Getting test ETH and setting `NEXT_PUBLIC_CONTRACT_ADDRESS` in Vercel
- Testing real mint and mainnet prep (Q2 2026)

Demo mode: when `NEXT_PUBLIC_CONTRACT_ADDRESS` is unset, the mint page simulates mints locally (no blockchain).

## Features

- **20 NFTs:** Explore grid with next/image optimization, lazy load, skeleton, rarities (Common / Rare / Epic / Legendary)
- **NFT details:** Click a card → `/nomads/[id]` with lore, traits, mint CTA
- **Cosmic Echo:** Personalize nebula; mouse/touch morphs; optional space sound
- **Mint:** Wallet connect, supply bar, quantity 1–10, 0.1 ETH on-chain (test wallet free); demo mode when no contract
- **AR Viewer:** View Nomad in AR (model-viewer)
- **Pages:** Roadmap, About, Community (Discord + X), FAQ, Twitter link
- **SEO:** Meta title/description, keywords, Open Graph, sitemap (including /nomads/[id]), optional GA
- **PWA:** manifest.json, favicon (add `public/favicon.ico` and optional `icon-192.png` / `icon-512.png`)

## Analytics

- **Vercel Analytics:** Integrated in `layout.tsx` via `@vercel/analytics`.
- **Google Analytics:** Set `NEXT_PUBLIC_GA_ID` in env; script loads when set.

## Performance

- Images: next/image with WebP, lazy loading, blur placeholder; priority for first 6 on home grid
- Cache: vercel.json headers for `/nfts/*` (long cache)
- Compress assets: use sharp or manual compression for `public/nfts/thumbs/` if needed

Run `npm run build` and `npm run dev` to test locally, then push for live update.
