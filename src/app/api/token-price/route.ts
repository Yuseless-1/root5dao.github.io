import { NextResponse } from 'next/server';

const SOL_MINT = 'So11111111111111111111111111111111111111112'; // Wrapped SOL
const TOKEN_ADDRESS = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';

export async function GET() {
  try {
    // Fetch SOL price from CoinGecko or DexScreener
    // Try CoinGecko first (more reliable for SOL price)
    try {
      const coingeckoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
        {
          next: { revalidate: 300 }, // Cache for 5 minutes
          signal: AbortSignal.timeout(5000), // 5 second timeout
        }
      );

      if (coingeckoResponse.ok) {
        const coingeckoData = await coingeckoResponse.json();
        if (coingeckoData.solana && coingeckoData.solana.usd) {
          const solPrice = coingeckoData.solana.usd;
          
          // Also fetch ROOT5 token price
          const tokenResponse = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
            {
              next: { revalidate: 60 },
              signal: AbortSignal.timeout(5000),
            }
          );

          let tokenPrice = 0;
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            if (tokenData.pairs && tokenData.pairs.length > 0) {
              tokenPrice = parseFloat(tokenData.pairs[0].priceUsd || '0');
            }
          }

          return NextResponse.json(
            {
              success: true,
              solPrice: solPrice,
              tokenPrice: tokenPrice,
              source: 'coingecko',
            },
            {
              headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
              },
            }
          );
        }
      }
    } catch (coingeckoError) {
      console.warn('CoinGecko API failed, trying DexScreener:', coingeckoError);
    }

    // Fallback: Try DexScreener for SOL price
    const solResponse = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${SOL_MINT}`,
      {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (solResponse.ok) {
      const solData = await solResponse.json();
      if (solData.pairs && solData.pairs.length > 0) {
        const solPrice = parseFloat(solData.pairs[0].priceUsd || '0');
        
        // Also fetch ROOT5 token price
        const tokenResponse = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
          {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000),
          }
        );

        let tokenPrice = 0;
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          if (tokenData.pairs && tokenData.pairs.length > 0) {
            tokenPrice = parseFloat(tokenData.pairs[0].priceUsd || '0');
          }
        }

        return NextResponse.json(
          {
            success: true,
            solPrice: solPrice,
            tokenPrice: tokenPrice,
            source: 'dexscreener',
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          }
        );
      }
    }

    // Final fallback: use default SOL price
    const fallbackSolPrice = 150; // Approximate SOL price in USD
    return NextResponse.json(
      {
        success: true,
        solPrice: fallbackSolPrice,
        tokenPrice: 0,
        source: 'fallback',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching prices:', error);
    
    // Fallback to default SOL price
    const fallbackSolPrice = 150; // Approximate SOL price in USD
    return NextResponse.json(
      {
        success: true,
        solPrice: fallbackSolPrice,
        tokenPrice: 0,
        source: 'fallback_error',
      },
      { status: 200 }
    );
  }
}


