/**
 * Deploy NebulaToken (NEBULA ERC-20) to Sepolia or configured network.
 * Usage: npx hardhat run scripts/deploy-nebula-token.js --network sepolia
 * Requires: ALCHEMY_API_KEY or INFURA_API_KEY, DEPLOYER_PRIVATE_KEY in .env
 */
const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying NebulaToken with account:', deployer.address);

  const NebulaToken = await hre.ethers.getContractFactory('NebulaToken');
  const token = await NebulaToken.deploy();
  await token.waitForDeployment();
  const address = await token.getAddress();
  console.log('NebulaToken (NEBULA) deployed to:', address);
  console.log('');
  console.log('Next steps:');
  console.log('1. Set NEXT_PUBLIC_NEBULA_TOKEN_ADDRESS=' + address + ' in .env and frontend');
  console.log('2. Grant mint/burn to game backend or owner via token.mint() / token.burn()');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
