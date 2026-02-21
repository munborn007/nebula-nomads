# Nebula Nomads Minting Guide

## Where Are NFTs Minted?

### Current Setup: Demo Mode

**Right now, nothing is minted on a blockchain.** The app runs in **demo mode** when `NEXT_PUBLIC_CONTRACT_ADDRESS` is not set:

- **Supply**: Shows 0 / 10000 (from API mock)
- **Live mint feed**: Shows fake addresses (0xaaaa...aaa0, etc.)
- **When you click "Mint"**: A 2-second simulation runs. The button shows "Minted!" but **no NFT is created anywhere** — no blockchain transaction, no on-chain record.

This lets you test the UI and flow without deploying a contract or spending gas.

---

### On-Chain Mode: Real Minting

To mint real NFTs to a blockchain:

1. **Deploy your NFT smart contract** (ERC-721 or compatible) to Ethereum, Base, Sepolia, etc.
2. **Set the environment variable** in `.env.local`:
   ```bash
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```
3. **Restart the dev server** (`npm run dev`).
4. Connect your wallet and click Mint. A real transaction will be sent to the contract. You’ll see a "View transaction →" link (Etherscan/Basescan) when mint succeeds.

**Where it goes:**
- The NFT is minted **on the blockchain** your wallet is connected to (e.g. Ethereum mainnet, Base, Sepolia).
- The contract address is what you set in `NEXT_PUBLIC_CONTRACT_ADDRESS`.
- You can view your NFT in your wallet (e.g. MetaMask) and on block explorers (OpenSea, etc.) once metadata is indexed.

---

### Flow Summary

| Step | Demo Mode | On-Chain Mode |
|------|-----------|---------------|
| Connect wallet | ✓ | ✓ |
| Click Mint | Simulates 2s, shows "Minted!" | Sends tx to contract |
| NFT created | No | Yes (on-chain) |
| Supply updates | No (stays 0) | Yes (from contract) |
| Transaction link | No | Yes (explorer URL) |

---

### Test Wallet

During development, the wallet `0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b` is allowed to mint **for free** (0 ETH) even when the contract is configured. Other wallets must pay the Dutch auction price.
