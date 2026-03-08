# Nebula Nomads — Improvements Roadmap

Ideas to make the site stronger, more trustworthy, and ready to scale. Prioritized by impact and effort.

---

## ✅ Done (this pass)

- **Dynamic SEO for NFT pages** — Each `/nomads/[id]` has its own title, description, and Open Graph so sharing a Nomad looks correct on Twitter/Discord.
- **Wrong-network banner** — When the contract is set and the user is on the wrong chain (e.g. mainnet), a banner suggests switching to Sepolia with one click.
- **Skip to main content** — Keyboard users can jump past the nav to the main content (accessibility).
- **Live on Sepolia badge** — Header shows a green “Live on Sepolia” pill (with pulse) when `NEXT_PUBLIC_CONTRACT_ADDRESS` is set; links to /mint.
- **Live supply on Mint 1–20** — Supply bar and “X / 10,000 minted” from chain; refreshes after a successful mint.
- **Post-mint success block** — On main mint page, after success: “View on Explorer”, “Share” (copy tx link / native share), “Explore more Nomads” in one card.

---

## High impact / quick wins

| Improvement | Why | Effort |
|-------------|-----|--------|
| **Add `public/hero.png` (1200×630)** | Better link previews when sharing the homepage. | 5 min |
| **Live mint count** | Show "X / 10,000 minted" from chain on mint page when contract is set. | Small (use `getMintedSupply()`). |
| **“Contract verified” or “Live on Sepolia” badge** | Builds trust when `NEXT_PUBLIC_CONTRACT_ADDRESS` is set. | Small |
| **Newsletter / waitlist** | Capture emails (e.g. form + API route or external service). | Medium |
| **Discord / Twitter links** | Replace placeholders with real community links. | 5 min |

---

## Conversion & retention

| Improvement | Why | Effort |
|-------------|-----|--------|
| **Post-mint success state** | After mint: “View on Explorer”, “Share”, “Explore more Nomads”. | Small |
| **Rarity / “X% have this trait”** | On NFT detail, show trait rarity (e.g. “12% have Phase Blade”). | Medium (needs chain or API). |
| **“Recently minted” on home** | Show last few mints from chain or API to add FOMO. | Medium |
| **Email after buy** | Optional: “Enter email for receipt” and send a simple confirmation. | Medium |

---

## Technical & quality

| Improvement | Why | Effort |
|-------------|-----|--------|
| **Route-level loading** | Add `loading.tsx` for `/explore`, `/nomads/[id]` for smoother transitions. | Small |
| **Per-route error boundary** | `error.tsx` in `nomads/[id]` so one broken NFT doesn’t break the app. | Small |
| **CSP headers** | In `vercel.json`, add Content-Security-Policy for production. | Medium |
| **Real supply from API** | `/api/supply` could call the chain (or a cache) instead of static `minted: 0`. | Medium |
| **Indexer / “My Nomads”** | Community page: show NFTs owned by connected wallet from chain/indexer. | Large |

---

## Content & community

| Improvement | Why | Effort |
|-------------|-----|--------|
| **Blog or “Updates”** | Short posts for mint date, collabs, utilities. | Medium |
| **FAQ expansion** | Add “What is Sepolia?”, “How do I get test ETH?”, “When mainnet?”. | Small |
| **Roadmap links** | Link roadmap phases to relevant pages (e.g. Phase 2 → Mint, Buy, Community). | Small |
| **Press / media kit** | One page: logo, screenshots, short copy for press or partners. | Small |

---

## Future / stretch

- **Multi-language (i18n)** — e.g. EN + one other language.
- **Mobile app or PWA** — Better AR and push for mint drops.
- **Staking / utilities** — When Phase 3 is live: staking, breeding, etc.
- **Secondary market link** — Link to OpenSea/Blur (or other) when collection is listed.
- **Analytics events** — Track “mint_click”, “wallet_connected”, “wrong_network_shown” for product decisions.

---

## How to use this

- Pick 1–2 items from **High impact** and **Conversion** first.
- Use **Technical** to harden before or right after launch.
- Revisit **Content & community** as you get closer to mint and mainnet.

After each change: test locally, then push to `main` so Vercel deploys. Keep [SYSTEM-CHECK.md](./SYSTEM-CHECK.md) and this file updated as you ship.
