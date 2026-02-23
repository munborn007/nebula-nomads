/**
 * Deploy NebulaNomads to Sepolia (or configured network).
 * Requires: ALCHEMY_API_KEY or INFURA_API_KEY, DEPLOYER_PRIVATE_KEY in .env
 * Usage: npx hardhat run scripts/deploy.js --network sepolia
 */
const hre = require('hardhat');

async function main() {
  const baseURI = process.env.BASE_URI || 'https://nebula-nomads.vercel.app/api/metadata/';
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  const NebulaNomads = await hre.ethers.getContractFactory('NebulaNomads');
  const contract = await NebulaNomads.deploy(baseURI);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log('NebulaNomads deployed to:', address);
  console.log('Set NEXT_PUBLIC_CONTRACT_ADDRESS=', address, 'in Vercel / .env.local');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
