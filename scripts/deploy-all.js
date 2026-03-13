/**
 * Deploy all game contracts: NebulaNomads, NebulaToken, BattleContract.
 * Usage: npx hardhat run scripts/deploy-all.js --network sepolia
 * Requires: ALCHEMY_API_KEY or INFURA_API_KEY, DEPLOYER_PRIVATE_KEY in .env
 */
const hre = require('hardhat');

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';
  const baseURI = (process.env.BASE_URI || `${siteUrl}/api/metadata/`).replace(/\/?$/, '/');
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  // 1. NebulaNomads (ERC-721)
  const NebulaNomads = await hre.ethers.getContractFactory('NebulaNomads');
  const nft = await NebulaNomads.deploy(baseURI);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log('NebulaNomads deployed to:', nftAddress);

  // 2. NebulaToken (ERC-20)
  const NebulaToken = await hre.ethers.getContractFactory('NebulaToken');
  const token = await NebulaToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log('NebulaToken (NEBULA) deployed to:', tokenAddress);

  // 3. BattleContract (P2E wagers)
  const BattleContract = await hre.ethers.getContractFactory('BattleContract');
  const battle = await BattleContract.deploy();
  await battle.waitForDeployment();
  const battleAddress = await battle.getAddress();
  console.log('BattleContract deployed to:', battleAddress);

  console.log('');
  console.log('Next steps:');
  console.log('1. Set in .env and Vercel:');
  console.log('   NEXT_PUBLIC_CONTRACT_ADDRESS=' + nftAddress);
  console.log('   NEXT_PUBLIC_NEBULA_TOKEN_ADDRESS=' + tokenAddress);
  console.log('   NEXT_PUBLIC_BATTLE_CONTRACT_ADDRESS=' + battleAddress);
  console.log('2. Verify on Etherscan (per contract).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
