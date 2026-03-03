# Nebula Nomads — Full System Check & Error Report

**Date:** 2026-02-20  
**Scope:** Production readiness, security, performance, UX, Web3, SEO, accessibility.

---

## Executive summary

The app is structurally sound and feature-complete for a cosmic NFT site (mint, buy, explore, AR, wallet, 30 NFTs). The following fixes were applied and remaining recommendations are listed so the project can ship to the world reliably.

---

## 1. Project structure ✅

| Area | Status | Notes |
|------|--------|--------|
| App routes | ✅ | Home, Explore, Mint, Mint 1–20, Buy 21–30, Nomads/[id], Roadmap, About, Community, FAQ, AR Viewer |
| API routes | ✅ | `/api/supply`, `/api/user-nfts`, `/api/mint-feed` — **fixed:** all wrapped in try/catch with 500 responses |
| Components | ✅ | 24 components; CosmicBackground, NomadCard, HoloButton, WalletConnectButton, etc. |
| Data | ✅ | `nomads.ts` (30 NFTs, getNomadById, getNomadReview), `abi.ts` (ABI also in web3.ts) |
| Config | ✅ | next.config.ts, package.json, .env.example (NEXT_PUBLIC_CONTRACT_ADDRESS, NEXT_PUBLIC_PAYMENT_WALLET) |

**Path note:** App imports use `@/*` → `./src/*`. Web3 lives in `src/utils/web3.ts`. A duplicate `utils/web3.ts` exists at repo root; only `src/utils/web3.ts` is used by the app. You can remove the root copy if no scripts depend on it.

---

## 2. Web3 / blockchain ✅

| Item | Status | Notes |
|------|--------|--------|
| Wallet connect | ✅ | EIP-6963 picker, getEthereumProvider, connectWithProvider |
| Mint | ✅ | mintNomads(quantity, valueWei, from), CONTRACT_ADDRESS from env, demo when unset |
| Buy 21–30 | ✅ | sendEth to PAYMENT_WALLET; **fixed:** wallet now from NEXT_PUBLIC_PAYMENT_WALLET with fallback |
| Test wallet free mint | ✅ | Same env (NEXT_PUBLIC_PAYMENT_WALLET) used for allowed test wallet on mint + mint-1-20 |
| Contract ABI | ✅ | In src/utils/web3.ts (mint, totalSupply, balanceOf). src/data/abi.ts is unused duplicate. |
| Secrets | ✅ | No keys in code; contract/payment addresses from env |

**Recommendation:** Add Sepolia (11155111) chain check and a “Wrong network” prompt with “Switch to Sepolia” when contract is set.

---

## 3. Security ✅

| Item | Status | Notes |
|------|--------|--------|
| Secrets in code | ✅ | None; deploy keys only in .env (not committed) |
| Headers (vercel.json) | ✅ | X-Content-Type-Options: nosniff, X-Frame-Options: DENY |
| CSP | ⚠️ | Not set. External scripts: unpkg (model-viewer), GTM (if GA_ID set). Add CSP for production if you want to lock down script-src. |
| Scripts | ✅ | model-viewer (lazyOnload, type=module), GA conditional on NEXT_PUBLIC_GA_ID |

---

## 4. Errors and resilience ✅

| Item | Status | Notes |
|------|--------|--------|
| Root error UI | ✅ **Added** | `src/app/error.tsx` — client component with “Try again” and “Back to home” |
| 404 | ✅ **Added** | `src/app/not-found.tsx` — custom “Lost in the nebula” message and link home |
| Loading | ✅ **Added** | `src/app/loading.tsx` — root loading spinner (aria-live, aria-busy) |
| notFound() | ✅ | Nomad detail calls notFound() when id invalid or nomad missing |
| API routes | ✅ **Fixed** | All three API handlers wrapped in try/catch; return 500 + json { error } on failure |
| Web3 | ✅ | connectWallet, getWalletStateIfConnected, mintNomads, sendEth use try/catch and return errors to UI |

**Recommendation:** Add route-level `loading.tsx` for heavy routes (e.g. `/explore`, `/nomads/[id]`) and an `error.tsx` in `nomads/[id]` for per-route error boundary.

---

## 5. Accessibility ⚠️

| Item | Status | Notes |
|------|--------|--------|
| Landmarks | ✅ | `<main>`, headings used |
| Aria | ✅ | Menu, Twitter link, AR control (role=button, tabIndex), loading (aria-live, aria-busy) |
| Focus | ⚠️ | Some focus rings (e.g. explore search); wallet modal and all interactive elements should be keyboard-focusable and have visible focus |
| Contrast | ⚠️ | Neon on dark used throughout; consider WCAG AA check for body text and buttons |

**Recommendation:** Tab through all flows (wallet, mint, buy, nav, detail page) and ensure focus order and visible focus; add skip-link “Skip to main content” if needed.

---

## 6. SEO ✅

| Item | Status | Notes |
|------|--------|--------|
| Metadata | ✅ | layout.tsx: title, description, keywords, openGraph, twitter card |
| OG image | ✅ **Adjusted** | Primary `/hero.png` (1200×630); fallback `/next.svg` so metadata always has a valid image. **Action:** Add `public/hero.png` (1200×630) for best social previews. |
| Sitemap | ✅ | sitemap.ts: base URL, explore, mint, buy, nomads/1–30, roadmap, about, community, faq, ar-viewer |
| Robots | ✅ | robots.ts: allow all, sitemap URL |
| Manifest | ✅ | public/manifest.json; icons use /next.svg (replace with real app icon for PWA) |

**Recommendation:** Add `generateMetadata` in `nomads/[id]/page.tsx` for dynamic title/description/OG per NFT (e.g. “Void Sentinel #0001 – Nebula Nomads”).

---

## 7. Performance ✅

| Item | Status | Notes |
|------|--------|--------|
| Dynamic import | ✅ | NebulaParticles, NomadARViewer, CosmicEcho loaded with next/dynamic (loading/ssr: false where needed) |
| Images | ✅ | Nomad thumbs: img with onError placeholder on detail; grid uses NomadCard (lazy where appropriate) |
| Heavy deps | ✅ | three, model-viewer, tsparticles, framer-motion; 3D/particles lazy or in client-only components |

**Recommendation:** Ensure NFT images exist in `public/nfts/thumbs/nomad-0001.png` … `nomad-0030.png` and consider next/image with sizes for grid for better LCP.

---

## 8. Data and null safety ✅

| Item | Status | Notes |
|------|--------|--------|
| getNomadById | ✅ | Used only with parsed id; notFound() if invalid or missing |
| getNomadReview | ✅ | Called with valid nomad and nomads array; no null dereference |
| Rarity | ⚠️ | data/nomads uses Common | Rare | Epic | Legendary; lib/utils uses common | rare | legendary for AR/model paths. AR uses wallet-based rarity; ensure any data rarity passed to AR is normalized to lowercase. |

---

## 9. Fixes applied in this pass

1. **Root error boundary** — `src/app/error.tsx` with reset and home link.  
2. **Custom 404** — `src/app/not-found.tsx`.  
3. **Root loading** — `src/app/loading.tsx` with accessible spinner.  
4. **API routes** — try/catch in `api/supply`, `api/user-nfts`, `api/mint-feed`; 500 and console.error on failure.  
5. **Payment / test wallet** — `NEXT_PUBLIC_PAYMENT_WALLET` in .env.example; buy-21-30, mint, mint-1-20 read from env with same fallback address.  
6. **OG images** — Second image in metadata set to `/next.svg` so at least one valid image; add `public/hero.png` for best results.

---

## 10. Pre-launch checklist

- [ ] Set `NEXT_PUBLIC_CONTRACT_ADDRESS` (and optionally `NEXT_PUBLIC_PAYMENT_WALLET`) in Vercel env.  
- [ ] Add `public/hero.png` (1200×630) for social sharing.  
- [ ] Add NFT images to `public/nfts/thumbs/` (nomad-0001.png … nomad-0030.png) per README there.  
- [ ] Optionally: add CSP headers; chain-id check for Sepolia; generateMetadata for `/nomads/[id]`; route-level loading/error for key routes.  
- [ ] Run `npm run build` and fix any type/lint errors.  
- [ ] Test mint (and buy) on Sepolia with a test wallet; confirm contract owner and withdraw.  
- [ ] Smoke-test production URL (meta tags, sitemap, wallet connect, mint/buy flows).

---

## 11. Build and lint ✅

- **Build:** `npm run build` — passes.
- **Lint:** `npx eslint src --max-warnings 0` — passes (setState-in-effect deferred with queueMicrotask; useCallback deps aligned; intentional eslint-disable for exhaustive-deps and wallet icon img).

Run locally:

```bash
npm run clean
npm run build
npx eslint src --max-warnings 0
```

Resolve any reported errors before deploying. After these changes, the system is in good shape to go live; complete the pre-launch checklist and optional recommendations for a world-ready launch.
