/**
 * Jupiter Swap Integration
 * Handles SOL to ROOT5 token swaps using Jupiter Aggregator
 */

const JUPITER_API = 'https://lite-api.jup.ag/v6'; // Jupiter Lite API (free tier)
const ROOT5_MINT = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';
const SOL_MINT = 'So11111111111111111111111111111111111111112'; // Wrapped SOL

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  // Store the full quote response for swap transaction
  fullQuoteResponse: any;
}

export async function getSwapQuote(
  amountInSOL: number,
  slippageBps: number = 50 // 0.5% slippage
): Promise<SwapQuote | null> {
  try {
    // Convert SOL to lamports (1 SOL = 1e9 lamports)
    const amountInLamports = Math.floor(amountInSOL * 1e9);

    const url = `${JUPITER_API}/quote?` +
      `inputMint=${SOL_MINT}&` +
      `outputMint=${ROOT5_MINT}&` +
      `amount=${amountInLamports}&` +
      `slippageBps=${slippageBps}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jupiter quote HTTP error:', response.status, errorText);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      console.error('Jupiter API error:', data.error);
      return null;
    }

    if (!data.inAmount || !data.outAmount) {
      console.error('Invalid quote response:', data);
      return null;
    }

    // Return both the simplified quote and the full response
    return {
      inputMint: data.inputMint,
      outputMint: data.outputMint,
      inAmount: data.inAmount,
      outAmount: data.outAmount,
      priceImpactPct: data.priceImpactPct || 0,
      fullQuoteResponse: data, // Store the full response for swap
    };
  } catch (error) {
    console.error('Error fetching swap quote:', error);
    return null;
  }
}

export async function getSwapTransaction(
  userPublicKey: string,
  quote: SwapQuote
): Promise<string | null> {
  try {
    if (!quote.fullQuoteResponse) {
      console.error('Missing full quote response');
      return null;
    }

    // Use the full quote response for the swap endpoint
    const swapPayload = {
      quoteResponse: quote.fullQuoteResponse, // Pass the full quote response
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    };

    const response = await fetch(`${JUPITER_API}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swapPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jupiter swap HTTP error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Jupiter swap error:', data.error);
      return null;
    }

    if (!data.swapTransaction) {
      console.error('No swapTransaction in response:', data);
      return null;
    }

    return data.swapTransaction;
  } catch (error) {
    console.error('Error creating swap transaction:', error);
    return null;
  }
}

