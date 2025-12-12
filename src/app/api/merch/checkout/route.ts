import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, VersionedTransaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createOrder } from '@/lib/orders';

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const ROOT5_MINT = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';
const ADMIN_WALLET = 'HduyFWJojMpNn6BES6YJTejBs7LLDqfvfrZ353pZCEbu';
const PUMPPORTAL_API = 'https://pumpportal.fun/api/trade-local';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, cart, shipping, totalUSD, totalSOL } = body;

    if (!wallet || !cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Validate wallet addresses
    let payerPublicKey: PublicKey;
    let adminPublicKey: PublicKey;
    try {
      payerPublicKey = new PublicKey(wallet);
      adminPublicKey = new PublicKey(ADMIN_WALLET);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Validate shipping info
    if (!shipping || !shipping.firstName || !shipping.lastName || !shipping.email || 
        !shipping.address1 || !shipping.city || !shipping.region || !shipping.zip) {
      return NextResponse.json(
        { success: false, error: 'Missing required shipping information' },
        { status: 400 }
      );
    }

    // Validate total SOL amount
    if (!totalSOL || totalSOL <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount. Please add items to your cart.' },
        { status: 400 }
      );
    }

    // Create order record
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get buy transaction from PumpPortal API
    let buyTransactionBase64: string | null = null;
    let root5Amount = totalSOL * 1000; // Fallback estimate (will be updated after purchase)

    // Create buy transaction using PumpPortal API
    try {
      console.log(`Creating buy transaction for ${totalSOL} SOL on pump.fun`);
      const pumpResponse = await fetch(PUMPPORTAL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: wallet,
          action: 'buy',
          mint: ROOT5_MINT,
          denominatedInSol: 'true',
          amount: totalSOL.toString(),
          slippage: 10, // 10% slippage
          priorityFee: 0.0001, // Priority fee in SOL
          pool: 'pump' // Trade on pump.fun bonding curve
        }),
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!pumpResponse.ok) {
        const errorText = await pumpResponse.text();
        console.error('PumpPortal API error:', errorText);
        throw new Error(`PumpPortal API error: ${errorText}`);
      }

      // PumpPortal returns the transaction as binary data (Buffer), not JSON
      // We need to get it as arrayBuffer and convert to base64
      const contentType = pumpResponse.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        // If it's JSON, parse it
        const transactionData = await pumpResponse.json();
        if (typeof transactionData === 'string') {
          buyTransactionBase64 = transactionData;
        } else if (transactionData.transaction) {
          buyTransactionBase64 = transactionData.transaction;
        } else {
          throw new Error('Invalid JSON response format from PumpPortal');
        }
      } else {
        // If it's binary, convert to base64
        const arrayBuffer = await pumpResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        buyTransactionBase64 = buffer.toString('base64');
      }

      if (!buyTransactionBase64) {
        throw new Error('Failed to extract transaction from PumpPortal response');
      }

      console.log('✅ Buy transaction created successfully from PumpPortal');
      
      // Estimate ROOT5 amount (actual amount will be determined after transaction)
      // For now, use a conservative estimate based on bonding curve
      root5Amount = totalSOL * 1000; // This is an estimate, actual amount depends on bonding curve
      
    } catch (pumpError: any) {
      console.error('Failed to create buy transaction from PumpPortal:', pumpError);
      // Continue without buy transaction - user will need to have ROOT5 tokens already
      if (pumpError.name !== 'AbortError' && pumpError.message) {
        // Only throw if it's not a timeout and we have an error message
        throw new Error(`Failed to create buy transaction: ${pumpError.message}`);
      } else if (pumpError.name !== 'AbortError') {
        throw new Error('Failed to create buy transaction from PumpPortal');
      }
    }

    // Create ROOT5 token transfer transaction to admin wallet
    const connection = new Connection(RPC_URL, 'confirmed');
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    
    // Get user's ROOT5 token account
    const root5Mint = new PublicKey(ROOT5_MINT);
    const userTokenAccount = await getAssociatedTokenAddress(root5Mint, payerPublicKey);
    const adminTokenAccount = await getAssociatedTokenAddress(root5Mint, adminPublicKey);

    // Calculate ROOT5 amount in smallest units (6 decimals)
    const root5AmountInSmallestUnit = BigInt(Math.floor(root5Amount * 1_000_000));

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      userTokenAccount,
      adminTokenAccount,
      payerPublicKey,
      root5AmountInSmallestUnit,
      [],
      TOKEN_PROGRAM_ID
    );

    // Create transfer transaction
    const transferTransaction = new Transaction().add(transferInstruction);
    transferTransaction.recentBlockhash = blockhash;
    transferTransaction.feePayer = payerPublicKey;

    // Fetch products to get product names
    let productsMap: Record<string, { name: string }> = {};
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                     (request.headers.get('host') ? 
                       `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}` : 
                       'http://localhost:3000');
      const productsResponse = await fetch(`${baseUrl}/api/merch/products`, {
        headers: { 'User-Agent': 'Root5DAO-Checkout-Service' },
      });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (productsData.success && productsData.products) {
          productsData.products.forEach((product: any) => {
            productsMap[product.id] = { name: product.name };
          });
        }
      }
    } catch (error) {
      console.warn('Could not fetch products for email, using product IDs only:', error);
    }

    // Prepare items with product names
    const items = cart.map((item: any) => ({
      productId: item.productId,
      productName: productsMap[item.productId]?.name || `Product ${item.productId}`,
      quantity: item.quantity,
      price: item.price || 0,
    }));

    // Create order in Supabase
    let order = null;
    try {
      order = await createOrder({
        id: orderId,
        wallet: wallet,
        totalUSD: totalUSD,
        totalSOL: totalSOL,
        root5Amount: root5Amount,
        shipping: shipping,
        cart: cart,
        items: items,
        swapTransaction: buyTransactionBase64 || undefined,
        transferTransaction: transferTransaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
      });
    } catch (dbError: any) {
      console.warn('Database error creating order (non-fatal):', dbError);
    }

    return NextResponse.json({
      success: true,
      orderId,
      buyTransaction: buyTransactionBase64,
      transferTransaction: transferTransaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
      root5Amount: root5Amount,
      message: buyTransactionBase64 
        ? 'Please sign both transactions: first buy ROOT5 tokens on pump.fun, then transfer ROOT5 to complete payment.'
        : 'Please sign the transaction to transfer ROOT5 tokens and complete payment.',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process checkout',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

