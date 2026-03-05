import crypto from 'crypto';
import { ethers } from 'ethers';
import { isEvmAddress, isSolanaAddress, isEvmChain, supabaseHeaders, SUPABASE_URL } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { wallet, chain } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: 'wallet query param is required' });
  }

  // Infer chain from address format if not provided
  if (!chain) {
    if (isEvmAddress(wallet)) chain = 'ethereum';
    else if (isSolanaAddress(wallet)) chain = 'solana';
    else return res.status(400).json({ error: 'Unable to infer chain — provide chain param' });
  }

  // Normalize EVM address to checksum form
  if (isEvmChain(chain)) {
    try {
      wallet = ethers.getAddress(wallet);
    } catch {
      return res.status(400).json({ error: 'Invalid EVM address' });
    }
  }

  const nonce = crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const resp = await fetch(`${SUPABASE_URL()}/rest/v1/web3_nonces`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify({ wallet_address: wallet, nonce, expires_at: expiresAt }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error('Nonce insert error:', err);
    return res.status(500).json({ error: 'Failed to create nonce' });
  }

  return res.status(200).json({ nonce });
}
