import Web3 from 'web3';
import type { ContractAbi } from 'web3-types';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
      isConnected?: () => boolean;
      selectedAddress?: string;
      chainId?: string;
      providers?: unknown[];
    };
  }
}

export type Web3State = {
  account: string | null;
  balance: string;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
};

/** EIP-6963 provider detail for wallet picker */
export type EIP6963ProviderDetail = {
  info: { uuid: string; name: string; icon: string; rdns: string };
  provider: Window['ethereum'];
};

let web3Instance: Web3 | null = null;

/**
 * Get the best available Ethereum provider.
 * When multiple wallets are installed, prefer MetaMask to avoid evmAsk/Rabby "Unexpected error".
 */
function getEthereumProvider(): Window['ethereum'] | null {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  const eth = window.ethereum as Window['ethereum'] & { providers?: Array<{ isMetaMask?: boolean; request: unknown }> };
  // If multiple providers (e.g. MetaMask + Rabby), use MetaMask when available
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    const metamask = eth.providers.find((p: { isMetaMask?: boolean }) => p.isMetaMask);
    if (metamask) return metamask as Window['ethereum'];
    // Fallback to first provider
    return eth.providers[0] as Window['ethereum'];
  }
  return window.ethereum;
}

/**
 * Discover wallets via EIP-6963 so the user can pick one (e.g. MetaMask) and avoid broken default provider.
 */
export function discoverEIP6963Providers(): Promise<EIP6963ProviderDetail[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve([]);
      return;
    }
    const providers: EIP6963ProviderDetail[] = [];
    const handler = (e: Event) => {
      const ev = e as CustomEvent<EIP6963ProviderDetail>;
      if (ev.detail?.info && ev.detail?.provider) {
        const exists = providers.some((p) => p.info.uuid === ev.detail.info.uuid);
        if (!exists) providers.push(ev.detail);
      }
    };
    window.addEventListener('eip6963:announceProvider', handler);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    // Give wallets a moment to respond
    setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', handler);
      resolve(providers);
    }, 500);
  });
}

/**
 * Connect using a specific EIP-1193 provider (e.g. from EIP-6963 picker). Use this when the default provider fails.
 */
export async function connectWithProvider(provider: Window['ethereum']): Promise<Web3State> {
  const state: Web3State = {
    account: null,
    balance: '0',
    chainId: null,
    isConnecting: true,
    error: null,
  };
  if (!provider?.request) {
    state.error = 'Invalid provider';
    state.isConnecting = false;
    return state;
  }
  try {
    const accounts = (await Promise.race([
      provider.request({ method: 'eth_requestAccounts', params: [] }) as Promise<string[]>,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 15000)
      ),
    ])) as string[];
    if (!accounts?.length) {
      state.error = 'No accounts found. Please unlock your wallet.';
      state.isConnecting = false;
      return state;
    }
    state.account = accounts[0];
    web3Instance = new Web3(provider as unknown as string);
    try {
      const balanceWei = await web3Instance.eth.getBalance(state.account);
      state.balance = web3Instance.utils.fromWei(balanceWei, 'ether');
      state.chainId = Number(await web3Instance.eth.getChainId());
    } catch {
      state.balance = '0';
      state.chainId = null;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code: number }).code : undefined;
    if (code === 4001) state.error = 'Connection rejected.';
    else if (code === -32002) state.error = 'Connection request already pending. Check your wallet.';
    else if (msg === 'Unexpected error' || /extension|evmAsk/i.test(msg)) state.error = 'Wallet extension had an issue. Try again or another browser.';
    else state.error = msg || 'Connection failed';
  }
  state.isConnecting = false;
  return state;
}

export function getWeb3(): Web3 | null {
  if (typeof window === 'undefined') return null;
  const provider = getEthereumProvider();
  if (provider && !web3Instance) {
    web3Instance = new Web3(provider as unknown as string);
  }
  return web3Instance;
}

/**
 * Wait for ethereum provider to be ready
 */
async function waitForEthereum(maxWait = 3000): Promise<boolean> {
  const provider = typeof window !== 'undefined' ? getEthereumProvider() : null;
  if (!provider) return false;

  try {
    if (provider.request && typeof provider.request === 'function') return true;
  } catch {
    // not ready
  }

  return new Promise((resolve) => {
    const start = Date.now();
    const t = setInterval(() => {
      try {
        if (getEthereumProvider()?.request) {
          clearInterval(t);
          resolve(true);
        } else if (Date.now() - start > maxWait) {
          clearInterval(t);
          resolve(false);
        }
      } catch {
        if (Date.now() - start > maxWait) {
          clearInterval(t);
          resolve(false);
        }
      }
    }, 100);
  });
}

export async function connectWallet(): Promise<Web3State> {
  const state: Web3State = {
    account: null,
    balance: '0',
    chainId: null,
    isConnecting: true,
    error: null,
  };

  if (typeof window === 'undefined') {
    state.error = 'Wallet connection is only available in the browser';
    state.isConnecting = false;
    return state;
  }

  // Use the best available provider (prefer MetaMask when multiple wallets)
  const provider = getEthereumProvider();
  if (!provider) {
    state.error = 'Please install MetaMask or another Web3 wallet extension';
    state.isConnecting = false;
    return state;
  }

  // Wait for provider to be ready
  const isReady = await waitForEthereum();
  if (!isReady) {
    state.error = 'Wallet extension is not ready. Please refresh the page and try again.';
    state.isConnecting = false;
    return state;
  }

  try {
    // Request accounts from the chosen provider (direct call, no setTimeout)
    let accounts: string[];
    try {
      accounts = (await Promise.race([
        provider.request({ method: 'eth_requestAccounts', params: [] }) as Promise<string[]>,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 15000)
        ),
      ])) as string[];
    } catch (requestError: unknown) {
      // Handle user rejection, extension errors (e.g. evmAsk.js "Unexpected error"), and timeouts
      const msg = requestError instanceof Error ? requestError.message : String(requestError);
      if (requestError && typeof requestError === 'object' && 'code' in requestError) {
        const code = (requestError as { code: number }).code;
        if (code === 4001) {
          state.error = 'Connection rejected. Please approve the connection request.';
        } else if (code === -32002) {
          state.error = 'Connection request already pending. Please check your wallet.';
        } else {
          state.error = 'Wallet connection failed. Please try again.';
        }
      } else if (msg === 'Unexpected error' || msg === 'Connection timeout' || /extension|evmAsk/i.test(msg)) {
        state.error = 'Wallet extension had an issue. Try again or use a different browser/incognito.';
      } else {
        state.error = msg || 'Connection failed';
      }
      state.isConnecting = false;
      return state;
    }

    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      state.error = 'No accounts found. Please unlock your wallet.';
      state.isConnecting = false;
      return state;
    }

    state.account = accounts[0];

    // Get balance and chain ID with error handling
    try {
      const web3 = getWeb3();
      if (web3) {
        const balanceWei = await web3.eth.getBalance(state.account);
        state.balance = web3.utils.fromWei(balanceWei, 'ether');
        state.chainId = Number(await web3.eth.getChainId());
      }
    } catch (web3Error) {
      // Account connected but couldn't fetch balance/chainId - still consider it connected
      console.warn('Could not fetch balance/chainId:', web3Error);
      state.balance = '0';
      state.chainId = null;
    }
  } catch (err) {
    // Catch any unexpected errors
    console.error('Wallet connection error:', err);
    state.error = err instanceof Error ? err.message : 'An unexpected error occurred';
  }

  state.isConnecting = false;
  return state;
}

/**
 * If a wallet is already connected (e.g. from header), return its state without prompting.
 * Uses eth_accounts (read-only). Use this to sync state on pages that have their own WalletConnectButton.
 */
export async function getWalletStateIfConnected(): Promise<Web3State> {
  const empty: Web3State = {
    account: null,
    balance: '0',
    chainId: null,
    isConnecting: false,
    error: null,
  };
  if (typeof window === 'undefined') return empty;
  const provider = getEthereumProvider();
  if (!provider?.request) return empty;
  try {
    const accounts = (await provider.request({ method: 'eth_accounts', params: [] })) as string[] | undefined;
    if (!accounts?.length) return empty;
    const account = accounts[0];
    const state: Web3State = { ...empty, account };
    const web3 = getWeb3();
    if (web3) {
      try {
        const balanceWei = await web3.eth.getBalance(account);
        state.balance = web3.utils.fromWei(balanceWei, 'ether');
        state.chainId = Number(await web3.eth.getChainId());
      } catch {
        state.balance = '0';
        state.chainId = null;
      }
    }
    return state;
  } catch {
    return empty;
  }
}

export function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/** Zero address used when contract is not configured (demo mode). */
const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ZERO_ADDR;
export const MAX_SUPPLY = 10000;

/** ABI for mint, totalSupply, balanceOf. Type as ContractAbi for web3.eth.Contract. */
export const CONTRACT_ABI: ContractAbi = [
  { inputs: [{ name: 'quantity', type: 'uint256' }], name: 'mint', outputs: [], stateMutability: 'payable', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
];

/**
 * Contract instance for reads/writes. Returns null if no web3 or contract not configured.
 * When CONTRACT_ADDRESS is unset/zero, logs a warning and returns null (demo mode).
 */
export function getContract(): InstanceType<Web3['eth']['Contract']> | null {
  const web3 = getWeb3();
  if (!web3) return null;
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === ZERO_ADDR) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('CONTRACT_ADDRESS not set — using demo mode. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local for on-chain minting.');
    }
    return null;
  }
  return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
}

/** Current minted count from chain. Resolves to 0 if contract not deployed or read fails. */
export async function getMintedSupply(): Promise<number> {
  const contract = getContract();
  if (!contract) return 0;
  try {
    const n = await contract.methods.totalSupply().call();
    return Number(n);
  } catch {
    return 0;
  }
}

export type MintResult = { txHash: string; success: true } | { success: false; error: string };

/**
 * Send mint tx: contract.mint(quantity) with valueWei ETH.
 * Caller must ensure wallet is connected and balance >= valueWei.
 */
export async function mintNomads(
  quantity: number,
  valueWei: string,
  fromAddress: string
): Promise<MintResult> {
  const contract = getContract();
  if (!contract) return { success: false, error: 'Contract not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS.' };
  const web3 = getWeb3();
  if (!web3) return { success: false, error: 'Wallet not connected.' };
  try {
    const tx = contract.methods.mint(quantity);
    const gas = await tx.estimateGas({ from: fromAddress, value: valueWei }).catch(() => '300000');
    const receipt = await tx.send({
      from: fromAddress,
      value: valueWei,
      gas: typeof gas === 'string' ? gas : String(gas),
    });
    const txHash = typeof receipt === 'object' && receipt.transactionHash ? receipt.transactionHash : String(receipt);
    return { success: true, txHash };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: number }).code;
      if (code === 4001) return { success: false, error: 'Transaction rejected.' };
      if (code === -32603) return { success: false, error: 'Insufficient funds or contract reverted.' };
    }
    return { success: false, error: msg || 'Mint failed.' };
  }
}

/** Block explorer URL for a given chain and tx hash. */
export function getExplorerTxUrl(chainId: number | null, txHash: string): string | null {
  if (!txHash) return null;
  switch (chainId) {
    case 1: return `https://etherscan.io/tx/${txHash}`;
    case 11155111: return `https://sepolia.etherscan.io/tx/${txHash}`;
    case 8453: return `https://basescan.org/tx/${txHash}`;
    case 84531: return `https://sepolia.basescan.org/tx/${txHash}`;
    default: return chainId ? `https://etherscan.io/tx/${txHash}` : null;
  }
}
