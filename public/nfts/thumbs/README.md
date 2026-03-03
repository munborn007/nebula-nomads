# NFT thumbnail images

Place your NFT images **in this folder** so they load on the Explore grid and on each NFT detail page (`/nomads/1` … `/nomads/30`).

## How to load the NFT image on the detail page

1. **Get your image file** (e.g. the PNG for "Cosmic Judge #0016").
2. **Rename it exactly** to match the NFT ID:
   - NFT #1  → `nomad-0001.png`
   - NFT #9  → `nomad-0009.png`
   - NFT #16 → `nomad-0016.png`
   - … up to `nomad-0030.png`
3. **Copy or move** the file into this folder:
   - **Full path:** `nebula-nomads-app\public\nfts\thumbs\`
   - So the file is at: `nebula-nomads-app\public\nfts\thumbs\nomad-0016.png` (for example).
4. **Refresh the page** (e.g. `http://localhost:3001/nomads/16`). The image will load where the placeholder was.

No code changes needed — the app already looks for these filenames here. If a file is missing, you’ll see a placeholder and the exact filename to add.
