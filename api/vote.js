import { ethers } from 'ethers';
import {
  isEvmChain,
  makeNonceMessage,
  verifyEvmSignature,
  verifySolanaSignature,
  getTokenBalance,
  getGovernanceThresholds,
  supabaseHeaders,
  SUPABASE_URL,
} from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wallet, chain, nonce, signature, proposal_id, vote_choice } = req.body || {};

  if (!wallet || !chain || !nonce || !signature || !proposal_id || !vote_choice) {
    return res.status(400).json({ error: 'Missing required fields: wallet, chain, nonce, signature, proposal_id, vote_choice' });
  }

  if (!['FOR', 'AGAINST', 'ABSTAIN'].includes(vote_choice)) {
    return res.status(400).json({ error: 'vote_choice must be FOR, AGAINST, or ABSTAIN' });
  }

  // Normalize EVM address
  let normalizedWallet = wallet;
  if (isEvmChain(chain)) {
    try {
      normalizedWallet = ethers.getAddress(wallet);
    } catch {
      return res.status(400).json({ error: 'Invalid EVM address' });
    }
  }

  const url = SUPABASE_URL();
  const headers = supabaseHeaders();

  // 1. Fetch nonce row
  const nonceResp = await fetch(
    `${url}/rest/v1/web3_nonces?wallet_address=eq.${encodeURIComponent(normalizedWallet)}&nonce=eq.${encodeURIComponent(nonce)}&select=*`,
    { headers }
  );
  const nonceRows = await nonceResp.json();
  const nonceRow = nonceRows?.[0];

  if (!nonceRow) {
    return res.status(401).json({ error: 'Nonce not found' });
  }
  if (nonceRow.used) {
    return res.status(401).json({ error: 'Nonce already used' });
  }
  if (new Date(nonceRow.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Nonce expired' });
  }

  // 2. Verify signature
  const message = makeNonceMessage(nonce);
  let valid = false;
  if (isEvmChain(chain)) {
    valid = await verifyEvmSignature(normalizedWallet, signature, message);
  } else if (chain === 'solana') {
    valid = verifySolanaSignature(normalizedWallet, signature, message);
  } else {
    return res.status(400).json({ error: 'Unsupported chain' });
  }

  if (!valid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 3. Mark nonce used immediately
  await fetch(`${url}/rest/v1/web3_nonces?id=eq.${nonceRow.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ used: true }),
  });

  // 4. Check token balance
  const [thresholds, balance] = await Promise.all([
    getGovernanceThresholds(),
    getTokenBalance(normalizedWallet, chain),
  ]);

  if (balance < thresholds.vote_threshold) {
    return res.status(403).json({
      error:    'insufficient_balance',
      message:  `You need at least ${thresholds.vote_threshold.toLocaleString()} ROOT5 tokens to vote`,
      required: thresholds.vote_threshold,
      held:     balance,
    });
  }

  // 5. Call cast_vote RPC
  const rpcResp = await fetch(`${url}/rest/v1/rpc/cast_vote`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      p_proposal_id:    proposal_id,
      p_wallet_address: normalizedWallet,
      p_vote_choice:    vote_choice,
      p_chain:          chain,
    }),
  });

  const result = await rpcResp.json();

  if (result?.error) {
    if (result.error === 'already_voted') {
      return res.status(409).json({ error: 'already_voted', message: 'This wallet has already voted on this proposal' });
    }
    if (result.error === 'proposal_not_active') {
      return res.status(400).json({ error: 'proposal_not_active', message: 'This proposal is not currently active' });
    }
    return res.status(400).json({ error: result.error });
  }

  return res.status(200).json(result);
}
