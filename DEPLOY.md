# Deploy Nebula Nomads Contract (You Run This)

The contract is **not** deployed by the AI. You must run the deploy command from your machine with your wallet and Sepolia ETH.

---

## 1. One-time setup

### Install deps (includes Hardhat)

```bash
cd nebula-nomads-app
npm install
```

### Create `.env` in the project root (same folder as `package.json`)

Copy from `.env.example` and fill in:

```env
# Get from https://dashboard.alchemy.com (create app → Sepolia)
ALCHEMY_API_KEY=your_alchemy_key

# From MetaMask: Account menu → Account details → Export Private Key (use a NEW wallet for deploys, not your main one)
DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyWithNo0xPrefixOrWithIt

# Optional: override baseURI (defaults to your site + /api/metadata/)
# NEXT_PUBLIC_SITE_URL=https://nebula-nomads-ci2j.vercel.app
# BASE_URI=https://nebula-nomads-ci2j.vercel.app/api/metadata/
```

**Security:** Never commit `.env` or share your private key. Use a dedicated deployer wallet with only Sepolia ETH.

### Get Sepolia ETH

- Use [Alchemy Sepolia Faucet](https://sepoliafaucet.com) or [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia).
- Send Sepolia ETH to the wallet whose `DEPLOYER_PRIVATE_KEY` you put in `.env`.

---

## 2. Deploy to Sepolia

From the project root:

```bash
npm run deploy:sepolia
```

You should see:

- `Deploying with account: 0x...`
- `NebulaNomads deployed to: 0x...`
- Next steps printed (set `NEXT_PUBLIC_CONTRACT_ADDRESS`, OpenSea, verify).

Copy the deployed address (e.g. `0x1234...`).

---

## 3. Wire the app to the contract

- **Local:** In `.env.local` add:
  ```env
  NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddress
  ```
- **Vercel:** Project → Settings → Environment Variables → add `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0xYourDeployedAddress` → Redeploy.

---

## 4. OpenSea (Sepolia testnet)

1. Go to [OpenSea Creator Studio](https://testnets.opensea.io/get-listed?chain=sepolia) (or “Import existing collection”).
2. Enter your **contract address** and connect the wallet that **owns** the contract (your deployer).
3. Complete the form so the collection appears on Sepolia OpenSea.

---

## 5. Optional: Verify on Etherscan

So the contract shows “Verified” on Sepolia Etherscan:

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS "https://your-site.com/api/metadata/"
```

Use the **exact** baseURI you passed at deploy (with trailing slash).

---

## Metadata and images

- **tokenURI:** Contract returns `baseURI + tokenId + ".json"` (e.g. `https://yoursite.com/api/metadata/1.json`).
- The app serves that from **`/api/metadata/[tokenId]`** (Next.js route); OpenSea will request it.
- Images are served from **`/api/nft-image/[id]`**; the metadata JSON points to that URL.

No extra step is required for metadata unless you change the site URL; then redeploy the contract with the new `BASE_URI` or set it via `setBaseURI` if you add that call.
