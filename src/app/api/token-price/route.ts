import { NextResponse } from 'next/server';

const TOKEN_ADDRESS = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';

export async function GET() {
  try {
    // DexScreener API endpoint for Solana tokens
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
      {
        next: { revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json();

    // DexScreener returns pairs array, get the first/main pair
    if (data.pairs && data.pairs.length > 0) {
      const pair = data.pairs[0];
      
      // Get price in USD
      const priceUsd = parseFloat(pair.priceUsd || '0');
      const priceChange24h = parseFloat(pair.priceChange?.h24 || '0');
      const volume24h = parseFloat(pair.volume?.h24 || '0');
      const liquidity = parseFloat(pair.liquidity?.usd || '0');
      
      return NextResponse.json(
        {
          price: priceUsd,
          priceChange24h: priceChange24h,
          volume24h: volume24h,
          liquidity: liquidity,
          source: 'dexscreener',
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // Cache for 1 minute
          },
        }
      );
    }

    // No pairs found, return fallback
    return NextResponse.json({
      price: 0,
      priceChange24h: 0,
      volume24h: 0,
      liquidity: 0,
      source: 'no_pairs',
    });
  } catch (error) {
    console.error('Error fetching token price from DexScreener:', error);
    
    // Fallback to environment variable or default
    const fallbackPrice = parseFloat(process.env.TOKEN_PRICE || '0.001');
    
    return NextResponse.json(
      {
        price: fallbackPrice,
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}


