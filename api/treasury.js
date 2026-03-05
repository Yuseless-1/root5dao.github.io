// ─── Squads / Solana treasury reader ────────────────────────────────────────
// Fetches SOL + SPL token balances for the configured vault address,
// then prices them via the Jupiter Price API.
// No authentication required — all data is public on-chain.

const VAULT   = process.env.SQUADS_VAULT_ADDRESS ?? '7qcxTk4kGdiGUxD7T59tQygJToe4rC4F7GyTTyYYyPMK';
const RPC_URL = process.env.SOLANA_RPC           ?? 'https://api.mainnet-beta.solana.com';

const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

// Known symbol overrides (Jupiter may not return these for all mints)
const KNOWN_SYMBOLS = {
  'So11111111111111111111111111111111111111112': 'SOL',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
  'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump': 'ROOT5',
};

const KNOWN_NAMES = {
  'So11111111111111111111111111111111111111112': 'Solana',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USD Coin',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'Tether USD',
  'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump': 'Root5',
};

const COLORS = {
  'So11111111111111111111111111111111111111112': '#9945FF',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': '#2775CA',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': '#26A17B',
  'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump': '#4ade80',
};

// ─── Solana RPC helpers ───────────────────────────────────────────────────────

async function solanaRpc(method, params) {
  const resp = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!resp.ok) throw new Error(`Solana RPC HTTP ${resp.status}`);
  const json = await resp.json();
  if (json.error) throw new Error(`Solana RPC error: ${json.error.message}`);
  return json.result;
}

async function getSolBalance(address) {
  const result = await solanaRpc('getBalance', [address, { commitment: 'confirmed' }]);
  return (result?.value ?? 0) / 1e9; // lamports → SOL
}

async function getTokenAccounts(address) {
  const result = await solanaRpc('getTokenAccountsByOwner', [
    address,
    { programId: TOKEN_PROGRAM },
    { encoding: 'jsonParsed' },
  ]);
  return result?.value ?? [];
}

// ─── Jupiter Price API ────────────────────────────────────────────────────────

async function getJupiterPrices(ids) {
  if (!ids.length) return {};
  try {
    const url = `https://price.jup.ag/v6/price?ids=${ids.join(',')}`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) return {};
    const json = await resp.json();
    return json?.data ?? {};
  } catch (err) {
    console.error('Jupiter price fetch failed:', err?.message);
    return {};
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch SOL balance and token accounts in parallel
    const [solBalance, tokenAccounts] = await Promise.all([
      getSolBalance(VAULT),
      getTokenAccounts(VAULT),
    ]);

    // Collect non-zero token positions
    const splTokens = tokenAccounts
      .map(a => ({
        mint:     a.account.data.parsed.info.mint,
        uiAmount: a.account.data.parsed.info.tokenAmount.uiAmount ?? 0,
        decimals: a.account.data.parsed.info.tokenAmount.decimals,
      }))
      .filter(t => t.uiAmount > 0);

    // Fetch prices for SOL + all SPL mints
    const solMint  = 'So11111111111111111111111111111111111111112';
    const mintIds  = [solMint, ...splTokens.map(t => t.mint)];
    const prices   = await getJupiterPrices(mintIds);

    const solPrice = prices[solMint]?.price ?? prices['SOL']?.price ?? 0;

    // Build asset list
    const assets = [];

    if (solBalance > 0) {
      assets.push({
        symbol:   'SOL',
        name:     'Solana',
        mint:     solMint,
        balance:  solBalance,
        decimals: 9,
        usdPrice: solPrice,
        valueUsd: solBalance * solPrice,
        color:    COLORS[solMint],
      });
    }

    for (const token of splTokens) {
      const priceData = prices[token.mint];
      const usdPrice  = priceData?.price ?? 0;
      const symbol    = KNOWN_SYMBOLS[token.mint] ?? priceData?.mintSymbol ?? token.mint.slice(0, 6);
      const name      = KNOWN_NAMES[token.mint]   ?? priceData?.mintSymbol ?? 'Unknown';

      assets.push({
        symbol,
        name,
        mint:     token.mint,
        balance:  token.uiAmount,
        decimals: token.decimals,
        usdPrice,
        valueUsd: token.uiAmount * usdPrice,
        color:    COLORS[token.mint] ?? '#6b7280',
      });
    }

    // Sort by USD value descending
    assets.sort((a, b) => b.valueUsd - a.valueUsd);

    const totalValueUsd = assets.reduce((sum, a) => sum + a.valueUsd, 0);

    return res.status(200).json({
      vault:         VAULT,
      assets,
      totalValueUsd,
      fetchedAt:     new Date().toISOString(),
    });
  } catch (err) {
    console.error('Treasury fetch error:', err);
    return res.status(500).json({
      error:   'Failed to fetch treasury data',
      message: err?.message ?? 'Unknown error',
    });
  }
}
