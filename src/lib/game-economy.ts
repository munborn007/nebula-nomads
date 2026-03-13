/**
 * Game economy — staking, claims, NEBULA balance. Use from client; contract addresses from env.
 * Security: All on-chain actions require wallet; validate on backend for high-value ops.
 */
import type { ContractAbi } from 'web3-types';

const NEBULA_TOKEN_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
] as const;

const STAKING_ABI = [
  'function stake(uint256[] tokenIds)',
  'function unstake(uint256[] tokenIds)',
  'function claim()',
  'function pendingReward(address) view returns (uint256)',
  'function stakedTokens(address) view returns (uint256[])',
] as const;

function getContractAddresses() {
  const token = process.env.NEXT_PUBLIC_NEBULA_TOKEN_ADDRESS;
  const staking = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
  return { token, staking };
}

/** Fetch NEBULA balance for address. Returns '0' if no contract or error. */
export async function fetchNebulaBalance(address: string): Promise<string> {
  const { token } = getContractAddresses();
  if (!token || !address) return '0';
  try {
    const { getWeb3 } = await import('@/utils/web3');
    const web3 = getWeb3();
    if (!web3) return '0';
    const contract = new web3.eth.Contract(NEBULA_TOKEN_ABI as unknown as ContractAbi, token);
    const balance = await contract.methods.balanceOf(address).call();
    return String(balance);
  } catch {
    return '0';
  }
}

/** Check pending staking reward. Returns '0' if no staking contract. */
export async function fetchPendingReward(address: string): Promise<string> {
  const { staking } = getContractAddresses();
  if (!staking || !address) return '0';
  try {
    const { getWeb3 } = await import('@/utils/web3');
    const web3 = getWeb3();
    if (!web3) return '0';
    const contract = new web3.eth.Contract(STAKING_ABI as unknown as ContractAbi, staking);
    const pending = await contract.methods.pendingReward(address).call();
    return String(pending);
  } catch {
    return '0';
  }
}

/** Claim staking rewards. Requires wallet + NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS. */
export async function claimStakingRewards(account: string): Promise<{ success: boolean; error?: string }> {
  const { staking } = getContractAddresses();
  if (!staking) return { success: false, error: 'Staking contract not configured' };
  try {
    const { getWeb3 } = await import('@/utils/web3');
    const web3 = getWeb3();
    if (!web3) return { success: false, error: 'Wallet not connected' };
    const contract = new web3.eth.Contract(STAKING_ABI as unknown as ContractAbi, staking);
    await contract.methods.claim().send({ from: account });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Claim failed' };
  }
}
