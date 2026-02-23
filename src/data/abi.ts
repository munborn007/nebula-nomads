import type { ContractAbi } from 'web3-types';

/** NebulaNomads contract ABI — mint, totalSupply, balanceOf. Used by web3.ts for on-chain mint. */
export const NEBULA_NOMADS_ABI: ContractAbi = [
  { inputs: [{ name: 'quantity', type: 'uint256' }], name: 'mint', outputs: [], stateMutability: 'payable', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
];
