import Web3 from 'web3';

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

let web3Instance: Web3 | null = null;

function getEthereumProvider(): Window['ethereum'] | null {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  const eth = window.ethereum as Window['ethereum'] & { providers?: Array<{ isMetaMask?: boolean; request: unknown }> };
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    const metamask = eth.providers.find((p: { isMetaMask?: boolean }) => p.isMetaMask);
    if (metamask) return metamask as Window['ethereum'];
    return eth.providers[0] as Window['ethereum'];
  }
  return window.ethereum;
}

export function getWeb3(): Web3 | null {
  if (typeof window === 'undefined') return null;
  const provider = getEthereumProvider();
  if (provider && !web3Instance) {
    web3Instance = new Web3(provider as unknown as string);
  }
  return web3Instance;
}

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

  const provider = getEthereumProvider();
  if (!provider) {
    state.error = 'Please install MetaMask or another Web3 wallet extension';
    state.isConnecting = false;
    return state;
  }

  const isReady = await waitForEthereum();
  if (!isReady) {
    state.error = 'Wallet extension is not ready. Please refresh the page and try again.';
    state.isConnecting = false;
    return state;
  }

  try {
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

export function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const CONTRACT_ABI = [
  { inputs: [{ name: 'quantity', type: 'uint256' }], name: 'mint', outputs: [], stateMutability: 'payable', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;
