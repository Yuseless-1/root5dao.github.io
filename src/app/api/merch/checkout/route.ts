import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, VersionedTransaction } from '@solana/web3.js';
import { createOrder, updateOrderStatus } from '@/lib/orders';
import { triggerWebhooks } from '@/lib/webhooks';
import { sendOrderConfirmationEmail } from '@/lib/email';

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const ROOT5_MINT = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';
const MERCH_WALLET = process.env.MERCH_WALLET || 'HduyFWJojMpNn6BES6YJTejBs7LLDqfvfrZ353pZCEbu';
const JUPITER_API = 'https://lite-api.jup.ag/v6'; // Jupiter Lite API (free tier)
const SOL_MINT = 'So11111111111111111111111111111111111111112'; // Wrapped SOL

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

    // Validate wallet address
    try {
      new PublicKey(wallet);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Validate merchant wallet
    if (!MERCH_WALLET || MERCH_WALLET === 'YOUR_MERCH_WALLET_ADDRESS') {
      console.error('MERCH_WALLET not configured');
      return NextResponse.json(
        { success: false, error: 'Merchant wallet not configured. Please set MERCH_WALLET environment variable.' },
        { status: 500 }
      );
    }
    
    // Validate merchant wallet address format
    try {
      new PublicKey(MERCH_WALLET);
    } catch (error) {
      console.error('Invalid merchant wallet address:', MERCH_WALLET);
      return NextResponse.json(
        { success: false, error: 'Invalid merchant wallet address format' },
        { status: 500 }
      );
    }

    // Create order record
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Validate and create public keys
    let payerPublicKey: PublicKey;
    let merchantPublicKey: PublicKey;
    
    try {
      payerPublicKey = new PublicKey(wallet);
      merchantPublicKey = new PublicKey(MERCH_WALLET);
    } catch (error) {
      console.error('Error creating PublicKey:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid public key format' },
        { status: 400 }
      );
    }

    // Strategy: User pays in SOL, we convert a portion to ROOT5 for them
    // The full SOL amount goes to merchant, and we calculate equivalent ROOT5 value
    
    const amountInLamports = Math.floor(totalSOL * LAMPORTS_PER_SOL);
    
    // Get Jupiter swap quote to calculate ROOT5 equivalent
    let quoteData: any = null;
    let estimatedRoot5 = totalSOL * 1000; // Default fallback rate
    
    try {
      const quoteUrl = `${JUPITER_API}/quote?` +
        `inputMint=${SOL_MINT}&` +
        `outputMint=${ROOT5_MINT}&` +
        `amount=${amountInLamports}&` +
        `slippageBps=50`; // 0.5% slippage

      const quoteResponse = await fetch(quoteUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!quoteResponse.ok) {
        throw new Error(`Jupiter API returned ${quoteResponse.status}`);
      }

      quoteData = await quoteResponse.json();

      if (quoteData.error || !quoteData.outAmount) {
        console.error('Jupiter quote error:', quoteData.error);
        quoteData = null; // Force fallback
      }
    } catch (error: any) {
      console.error('Jupiter API fetch failed:', error.message);
      console.warn('Using fallback ROOT5 conversion rate');
      quoteData = null; // Use fallback
    }

    // If quote failed or unavailable, use fallback
    if (!quoteData || !quoteData.outAmount) {
      // Fallback: use estimated rate if quote fails
      estimatedRoot5 = totalSOL * 1000; // Fallback rate
      // Create order in Supabase
      const items = cart.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price || 0,
      }));

      let order;
      try {
        order = await createOrder({
          id: orderId,
          wallet: wallet,
          totalUSD: totalUSD,
          totalSOL: totalSOL,
          root5Amount: estimatedRoot5,
          shipping: shipping,
          cart: cart,
          items: items,
        });
      } catch (dbError: any) {
        console.error('Database error creating order:', dbError);
        // If Supabase is not configured, continue without database storage
        // This allows checkout to work even if database isn't set up yet
        if (dbError.message?.includes('Supabase environment variables')) {
          console.warn('Supabase not configured, continuing without database storage');
          order = null;
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to create order in database', details: dbError.message },
            { status: 500 }
          );
        }
      }

      if (!order) {
        // If database failed but we can still proceed, log warning and continue
        console.warn('Order not saved to database, but continuing with transaction creation');
      }

      // Trigger webhook for order created
      await triggerWebhooks(orderId, 'order.created', {
        orderId,
        wallet,
        totalUSD,
        totalSOL,
        status: 'pending',
      });
      
      // Create simple SOL transfer transaction
      const connection = new Connection(RPC_URL, 'confirmed');
      const { blockhash } = await connection.getLatestBlockhash('finalized');
      const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payerPublicKey,
          toPubkey: merchantPublicKey,
          lamports: amountInLamports,
        })
      );
      transferTransaction.recentBlockhash = blockhash;
      transferTransaction.feePayer = payerPublicKey;

      return NextResponse.json({
        success: true,
        orderId,
        transaction: transferTransaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
        root5Amount: estimatedRoot5,
        message: 'Order created. Please sign the transaction to complete payment.',
        note: 'Using estimated ROOT5 conversion rate',
      });
    }

    // If we have a valid quote, try to create swap transaction
    let root5Amount = estimatedRoot5; // Default to estimated
    let swapData: any = null;

    if (quoteData && quoteData.outAmount) {
      // Calculate ROOT5 amount from quote (outAmount is in smallest unit)
      const ROOT5_DECIMALS = 6;
      root5Amount = parseFloat(quoteData.outAmount) / Math.pow(10, ROOT5_DECIMALS);

      // Create swap transaction - user swaps SOL to ROOT5
      try {
        const swapResponse = await fetch(`${JUPITER_API}/swap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quoteResponse: quoteData,
            userPublicKey: wallet,
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: 'auto',
          }),
          signal: AbortSignal.timeout(15000), // 15 second timeout
        });

        if (!swapResponse.ok) {
          throw new Error(`Jupiter swap API returned ${swapResponse.status}`);
        }

        swapData = await swapResponse.json();

        if (swapData.error || !swapData.swapTransaction) {
          console.error('Jupiter swap error:', swapData.error);
          swapData = null; // Force fallback
        }
      } catch (error: any) {
        console.error('Jupiter swap API fetch failed:', error.message);
        console.warn('Falling back to simple SOL transfer');
        swapData = null; // Use fallback
      }
    }

    // If swap failed or unavailable, use simple SOL transfer
    if (!swapData || !swapData.swapTransaction) {
      console.warn('Jupiter swap unavailable, using simple SOL transfer');
      const connection = new Connection(RPC_URL, 'confirmed');
      const { blockhash } = await connection.getLatestBlockhash('finalized');
      const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payerPublicKey,
          toPubkey: merchantPublicKey,
          lamports: amountInLamports,
        })
      );
      transferTransaction.recentBlockhash = blockhash;
      transferTransaction.feePayer = payerPublicKey;

      // Create order in Supabase
      const items = cart.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price || 0,
      }));

      let order;
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
          transferTransaction: transferTransaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
        });
      } catch (dbError: any) {
        console.error('Database error creating order:', dbError);
        if (dbError.message?.includes('Supabase environment variables')) {
          console.warn('Supabase not configured, continuing without database storage');
          order = null;
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to create order in database', details: dbError.message },
            { status: 500 }
          );
        }
      }

      // Trigger webhook for order created (if order was saved)
      if (order) {
        try {
          await triggerWebhooks(orderId, 'order.created', {
            orderId,
            wallet,
            totalUSD,
            totalSOL,
            status: 'pending',
          });
        } catch (webhookError) {
          console.error('Webhook error (non-fatal):', webhookError);
        }
      }

      return NextResponse.json({
        success: true,
        orderId,
        transaction: transferTransaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
        root5Amount: root5Amount,
        message: 'Order created. Please sign the transaction to complete payment.',
        note: quoteData ? undefined : 'Using estimated ROOT5 conversion rate',
      });
    }

    // If we reach here, we have a valid swap transaction - create dual transaction flow

    // Create SOL transfer to merchant (separate transaction)
    const connection = new Connection(RPC_URL, 'confirmed');
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    
    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payerPublicKey,
        toPubkey: merchantPublicKey,
        lamports: amountInLamports,
      })
    );
    transferTransaction.recentBlockhash = blockhash;
    transferTransaction.feePayer = payerPublicKey;

    // Create order in Supabase
    const items = cart.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price || 0,
    }));

    let order;
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
        swapTransaction: swapData.swapTransaction,
        transferTransaction: transferTransaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
      });
    } catch (dbError: any) {
      console.error('Database error creating order:', dbError);
      if (dbError.message?.includes('Supabase environment variables')) {
        console.warn('Supabase not configured, continuing without database storage');
        order = null;
      } else {
        return NextResponse.json(
          { success: false, error: 'Failed to create order in database', details: dbError.message },
          { status: 500 }
        );
      }
    }

    // Trigger webhook for order created (if order was saved)
    if (order) {
      try {
        await triggerWebhooks(orderId, 'order.created', {
          orderId,
          wallet,
          totalUSD,
          totalSOL,
          status: 'pending',
        });
      } catch (webhookError) {
        console.error('Webhook error (non-fatal):', webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      swapTransaction: swapData.swapTransaction,
      transferTransaction: transferTransaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
      root5Amount: root5Amount,
      quote: {
        priceImpact: quoteData.priceImpactPct || 0,
        inAmount: quoteData.inAmount,
        outAmount: quoteData.outAmount,
      },
      message: 'Order created. Please sign both transactions to complete payment.',
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

