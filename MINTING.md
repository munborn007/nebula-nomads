# Nebula Nomads — On-Chain Minting (Sepolia / Mainnet)

## Overview

- **Contract:** ERC-721 `NebulaNomads` (OpenZeppelin)
- **Supply:** 10,000
- **Mint price:** 0.1 ETH (test wallet `0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b` mints for free)
- **Max per tx:** 10

## 1. Deploy contract (Remix or Hardhat)

### Option A: Remix + Sepolia

1. Go to [remix.ethereum.org](https://remix.ethereum.org).
2. Create `NebulaNomads.sol` (copy from `contracts/NebulaNomads.sol`).
3. Compile with Solidity 0.8.20; use “Injected Provider - MetaMask” and select Sepolia.
4. Deploy with constructor arg: base URI (e.g. `https://your-site.com/api/metadata/`).
5. Copy the deployed contract address.

### Option B: Hardhat

1. From project root:
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npx hardhat init
   ```
2. Install OpenZeppelin:
   ```bash
   npm install @openzeppelin/contracts
   ```
3. Add to `.env` (or copy from `.env.example`):
   - `ALCHEMY_API_KEY` (from [alchemy.com](https://www.alchemy.com)) or `INFURA_API_KEY`
   - `DEPLOYER_PRIVATE_KEY` (MetaMask export private key for deployer wallet)
4. Get Sepolia ETH: [sepoliafaucet.com](https://sepoliafaucet.com) or Alchemy/Infura faucet.
5. Deploy:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
6. Copy the printed contract address.

## 2. Configure the app

- **Local:** In `nebula-nomads-app/.env.local` set:
  ```env
  NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddress
  ```
- **Vercel:** Project → Settings → Environment Variables → add `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0xYourDeployedAddress`, then redeploy.

## 3. Test mint

1. Open the app (local or Vercel).
2. Connect a wallet on Sepolia (or mainnet if you deployed there).
3. Mint page: when `NEXT_PUBLIC_CONTRACT_ADDRESS` is set, real mint is enabled.
4. Test wallet `0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b` mints for free; others pay 0.1 ETH per mint.
5. After mint, check supply on the mint page and transaction on [sepolia.etherscan.io](https://sepolia.etherscan.io).

## 4. Mainnet (Q2 2026)

- Deploy the same contract to Ethereum mainnet (e.g. Hardhat with `mainnet` network and RPC/key).
- Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the mainnet contract in Vercel and redeploy.
