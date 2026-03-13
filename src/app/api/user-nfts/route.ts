import { NextRequest, NextResponse } from 'next/server';

const HEX_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const ERC721_ABI = [
  { inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'ownerOf', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
] as const;

/** Max token IDs to scan when enumerating (contract has no tokenOfOwnerByIndex). */
const MAX_SCAN = 2000;

/**
 * Fetch owned token IDs from chain when RPC and contract are configured.
 * Falls back to mock data otherwise so Profile/Dashboard still work.
 */
async function fetchOwnedTokenIdsFromChain(address: string): Promise<string[] | null> {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || process.env.RPC_URL;
  if (!contractAddress || !rpcUrl || contractAddress === '0x0000000000000000000000000000000000000000') return null;

  try {
    const Web3 = (await import('web3')).default;
    const web3 = new Web3(rpcUrl);
    const contract = new web3.eth.Contract(ERC721_ABI as unknown as never, contractAddress);
    const totalSupply = Number(await contract.methods.totalSupply().call());
    if (totalSupply === 0) return [];
    const toScan = Math.min(totalSupply, MAX_SCAN);
    const owned: string[] = [];
    const addrLower = address.toLowerCase();
    for (let id = 1; id <= toScan; id++) {
      try {
        const owner = (await contract.methods.ownerOf(id).call()) as string;
        if (owner && owner.toLowerCase() === addrLower) owned.push(String(id));
      } catch {
        // token may not exist or be burned, skip
      }
    }
    return owned;
  } catch (e) {
    console.error('user-nfts chain fetch error:', e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    let address: string | null = null;
    try {
      address = req.nextUrl.searchParams.get('address');
    } catch {
      return NextResponse.json([]);
    }
    if (!address || !HEX_ADDRESS.test(address)) return NextResponse.json([]);

    const tokenIds = await fetchOwnedTokenIdsFromChain(address);
    if (tokenIds) {
      return NextResponse.json(
        tokenIds.map((tokenId) => ({ tokenId, metadata: { name: `Nomad #${tokenId}` } }))
      );
    }

    // Fallback: mock data so Profile/Dashboard show something when RPC not configured
    return NextResponse.json([
      { tokenId: '1', metadata: { name: 'Nomad #1' } },
      { tokenId: '2', metadata: { name: 'Nomad #2' } },
    ]);
  } catch (e) {
    console.error('API user-nfts error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
