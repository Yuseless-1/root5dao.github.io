import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';

const TOKEN_MINT = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';

export async function GET() {
  try {
    // Use mainnet RPC endpoint
    const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(rpcEndpoint, 'confirmed');

    const mintPublicKey = new PublicKey(TOKEN_MINT);

    try {
      // Get all token accounts for this mint
      // This uses getProgramAccounts which can be slow for tokens with many holders
      const mintBytes = mintPublicKey.toBytes();
      
      // memcmp filter: bytes should be base58 encoded string of the raw bytes
      // The mint address is stored as 32 bytes at offset 0 in token accounts
      const mintBytesBase58 = bs58.encode(mintBytes);
      
      const tokenAccounts = await connection.getProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165, // Token account data size
            },
            {
              memcmp: {
                offset: 0, // Mint address offset in token account (first 32 bytes)
                bytes: mintBytesBase58, // Base58 encoded bytes
              },
            },
          ],
        }
      );

      // Extract unique owners (excluding zero-balance accounts)
      const holders = new Set<string>();
      
      for (const account of tokenAccounts) {
        try {
          // Parse token account data
          // Token account structure: mint (32 bytes) + owner (32 bytes) + amount (8 bytes) + ...
          const accountData = Buffer.from(account.account.data);
          const ownerPubkey = new PublicKey(accountData.slice(32, 64));
          
          // Get token amount (8 bytes starting at offset 64)
          const amountBuffer = accountData.slice(64, 72);
          const amount = amountBuffer.readBigUInt64LE(0);
          
          // Only count accounts with balance > 0
          if (amount > BigInt(0)) {
            holders.add(ownerPubkey.toBase58());
          }
        } catch (err) {
          // Skip invalid accounts
          console.error('Error parsing token account:', err);
        }
      }

      const holderCount = holders.size;

      return NextResponse.json(
        {
          count: holderCount,
          source: 'solana_rpc',
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
          },
        }
      );
    } catch (rpcError) {
      console.error('RPC error:', rpcError);
      
      // Fallback to environment variable or default
      const fallbackCount = process.env.TOKEN_HOLDER_COUNT || '0';
      
      return NextResponse.json({
        count: parseInt(fallbackCount, 10),
        source: 'fallback',
      });
    }
  } catch (error) {
    console.error('Error fetching token holders:', error);
    
    // Fallback on error
    const fallbackCount = process.env.TOKEN_HOLDER_COUNT || '0';
    
    return NextResponse.json(
      {
        count: parseInt(fallbackCount, 10),
        source: 'error_fallback',
      },
      { status: 200 }
    );
  }
}

