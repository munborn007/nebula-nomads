/**
 * Deploy NebulaNomads to Sepolia (or configured network).
 * Requires: ALCHEMY_API_KEY or INFURA_API_KEY, DEPLOYER_PRIVATE_KEY in .env
 * Usage: npm run deploy:sepolia
 */
const hre = require('hardhat');

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';
  const baseURI = (process.env.BASE_URI || `${siteUrl}/api/metadata/`).replace(/\/?$/, '/');
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Base URI:', baseURI);

  const NebulaNomads = await hre.ethers.getContractFactory('NebulaNomads');
  const contract = await NebulaNomads.deploy(baseURI);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log('NebulaNomads deployed to:', address);
  console.log('');
  console.log('Next steps:');
  console.log('1. Set NEXT_PUBLIC_CONTRACT_ADDRESS=' + address + ' in .env.local and Vercel');
  console.log('2. Add contract to OpenSea: https://testnets.opensea.io/get-listed?chain=sepolia');
  console.log('3. Verify on Etherscan: npx hardhat verify --network sepolia', address, '"' + baseURI + '"');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
