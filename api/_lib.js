import { ethers } from 'ethers';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

// ─── Address utilities ────────────────────────────────────────────────────────

// All supported EVM chain names
export const EVM_CHAINS = ['ethereum', 'bsc', 'arbitrum', 'base'];

export function isEvmAddress(addr) {
  return typeof addr === 'string' && addr.startsWith('0x') && addr.length === 42;
}

export function isEvmChain(chain) {
  return EVM_CHAINS.includes(chain);
}

export function isSolanaAddress(addr) {
  return typeof addr === 'string' && !addr.startsWith('0x') && addr.length >= 32 && addr.length <= 44;
}

export function makeNonceMessage(nonce) {
  return `Sign this nonce to authenticate your action: ${nonce}`;
}

// ─── Signature verification ───────────────────────────────────────────────────

export async function verifyEvmSignature(wallet, signature, message) {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    const checksummed = ethers.getAddress(wallet);
    return recovered === checksummed;
  } catch (err) {
    console.error('EVM verify error', err);
    return false;
  }
}

export function verifySolanaSignature(wallet, signatureBase64OrHex, message) {
  try {
    let sigBytes;
    if (/^[0-9a-fA-F]+$/.test(signatureBase64OrHex)) {
      const pairs = signatureBase64OrHex.match(/.{1,2}/g) || [];
      sigBytes = new Uint8Array(pairs.map(h => parseInt(h, 16)));
    } else {
      sigBytes = Uint8Array.from(Buffer.from(signatureBase64OrHex, 'base64'));
    }
    const pubkeyBytes = bs58.decode(wallet);
    const msgBytes = new TextEncoder().encode(message);
    return nacl.sign.detached.verify(msgBytes, sigBytes, pubkeyBytes);
  } catch (err) {
    console.error('Solana verify error', err);
    return false;
  }
}

// ─── Supabase REST helpers ────────────────────────────────────────────────────

export function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
    'apikey': key,
    'Prefer': 'return=representation',
  };
}

export const SUPABASE_URL = () => process.env.SUPABASE_URL;

// ─── ROOT5 Token contract addresses ──────────────────────────────────────────
//
// To add a new chain: add an entry with address, rpcEnv, and defaultRpc.
// Token amounts are compared in human-readable units (no decimals).

const TOKEN_CONTRACTS = {
  ethereum: {
    address:    '0xC1b958dDf560AB592831b65dFC6a7f63b2EFe07E',
    rpcEnv:     'EVM_RPC_ETHEREUM',
    defaultRpc: 'https://eth.llamarpc.com',
  },
  bsc: {
    address:    '0xb062C2505b5a9d80B5718845BdA75fa3c267ce0e',
    rpcEnv:     'EVM_RPC_BSC',
    defaultRpc: 'https://bsc-dataseed.binance.org',
  },
  arbitrum: {
    address:    '0xb062C2505b5a9d80B5718845BdA75fa3c267ce0e',
    rpcEnv:     'EVM_RPC_ARBITRUM',
    defaultRpc: 'https://arb1.arbitrum.io/rpc',
  },
  base: {
    address:    '0xb062C2505b5a9d80B5718845BdA75fa3c267ce0e',
    rpcEnv:     'EVM_RPC_BASE',
    defaultRpc: 'https://mainnet.base.org',
  },
};

const SPL_TOKEN = {
  mint:       'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump',
  rpcEnv:     'SOLANA_RPC',
  defaultRpc: 'https://api.mainnet-beta.solana.com',
};

// Minimal ERC-20 ABI — only what we need
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

// ─── Balance checking ─────────────────────────────────────────────────────────

async function getEvmBalance(wallet, chain) {
  const config = TOKEN_CONTRACTS[chain];
  if (!config) throw new Error(`No ROOT5 token contract configured for chain: ${chain}`);

  const rpcUrl = process.env[config.rpcEnv] || config.defaultRpc;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(config.address, ERC20_ABI, provider);

  const [rawBalance, decimals] = await Promise.all([
    contract.balanceOf(wallet),
    contract.decimals(),
  ]);

  return Number(ethers.formatUnits(rawBalance, decimals));
}

async function getSolanaBalance(wallet) {
  const rpcUrl = process.env[SPL_TOKEN.rpcEnv] || SPL_TOKEN.defaultRpc;

  const resp = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [
        wallet,
        { mint: SPL_TOKEN.mint },
        { encoding: 'jsonParsed' },
      ],
    }),
  });

  if (!resp.ok) return 0;
  const data = await resp.json();
  const accounts = data?.result?.value ?? [];

  // Sum all token accounts (wallets can have more than one)
  return accounts.reduce((sum, acc) => {
    return sum + (acc.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0);
  }, 0);
}

/**
 * Returns the wallet's ROOT5 token balance in human-readable units.
 * Throws if the chain is unsupported or the RPC call fails.
 */
export async function getTokenBalance(wallet, chain) {
  try {
    if (chain === 'solana') return await getSolanaBalance(wallet);
    if (isEvmChain(chain)) return await getEvmBalance(wallet, chain);
    throw new Error(`Unsupported chain: ${chain}`);
  } catch (err) {
    console.error(`Balance check error [${chain}]:`, err?.message ?? err);
    throw new Error(`Could not check ROOT5 balance on ${chain}: ${err?.message ?? 'RPC error'}`);
  }
}

// ─── Governance thresholds ────────────────────────────────────────────────────

const DEFAULT_THRESHOLDS = {
  vote_threshold:     5_000_000,
  proposal_threshold: 10_000_000,
};

/**
 * Reads vote/proposal thresholds from the governance_config Supabase table.
 * Falls back to hardcoded defaults if the table is unreachable.
 * Thresholds can be updated in Supabase without redeploying.
 */
export async function getGovernanceThresholds() {
  try {
    const resp = await fetch(
      `${SUPABASE_URL()}/rest/v1/governance_config?select=key,value`,
      { headers: supabaseHeaders() }
    );
    if (!resp.ok) return DEFAULT_THRESHOLDS;

    const rows = await resp.json();
    const config = Object.fromEntries(
      (rows ?? []).map(r => [r.key, Number(r.value)])
    );

    return {
      vote_threshold:     config.vote_threshold     ?? DEFAULT_THRESHOLDS.vote_threshold,
      proposal_threshold: config.proposal_threshold ?? DEFAULT_THRESHOLDS.proposal_threshold,
    };
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}
