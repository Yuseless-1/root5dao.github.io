'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@/lib/wallet';
import Header from '@/components/Header';
import { ShoppingCart, Package, Loader2 } from 'lucide-react';
import { VersionedTransaction, SendTransactionError } from '@solana/web3.js';

interface Product {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  image_url: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MerchPage() {
  const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    region: '',
    zip: '',
    country: 'US',
  });
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'signing' | 'sending' | 'confirming'>('idle');

  useEffect(() => {
    loadProducts();
    loadSolPrice();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/merch/products');
      const data = await response.json();
      console.log('Products API response:', data);
      if (data.success) {
        setProducts(data.products);
        // Log source for debugging
        if (data.source) {
          console.log(`Products loaded from: ${data.source}`);
          if (data.source !== 'printify' && data.error) {
            console.warn('Printify API error:', data.error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSolPrice = async () => {
    try {
      const response = await fetch('/api/token-price');
      const data = await response.json();
      if (data.success && data.solPrice) {
        setSolPrice(data.solPrice);
      }
    } catch (error) {
      console.error('Error loading SOL price:', error);
    }
  };

  const loadCart = () => {
    const saved = localStorage.getItem('merch_cart');
    if (saved) {
      setCart(JSON.parse(saved));
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('merch_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      const updated = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const getTotalUSD = () => {
    return cart.reduce((sum, item) => sum + item.product.price_usd * item.quantity, 0);
  };

  const getTotalSOL = () => {
    return solPrice > 0 ? getTotalUSD() / solPrice : 0;
  };

  const handleCheckout = async () => {
    if (!connected || !publicKey || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate shipping info
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.address1 || !shippingInfo.city || !shippingInfo.region || !shippingInfo.zip) {
      alert('Please fill in all required shipping information');
      return;
    }

    setProcessing(true);
    setPaymentStep('signing');

    try {
      // Step 1: Create order and get transactions
      const response = await fetch('/api/merch/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          cart: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price_usd,
          })),
          shipping: shippingInfo,
          totalUSD: getTotalUSD(),
          totalSOL: getTotalSOL(),
        }),
      });

      const data = await response.json();
      if (!data.success) {
        const errorMsg = data.error || 'Failed to create order';
        const details = data.details ? `\n\nDetails: ${data.details}` : '';
        alert(`${errorMsg}${details}`);
        console.error('Checkout error response:', data);
        setPaymentStep('idle');
        setProcessing(false);
        return;
      }

      const signatures: string[] = [];

      // Step 2: Handle swap transaction if present (SOL to ROOT5)
      if (data.swapTransaction) {
        setPaymentStep('signing');
        try {
          const swapTransactionBuf = Buffer.from(data.swapTransaction, 'base64');
          const swapTransaction = VersionedTransaction.deserialize(swapTransactionBuf);
          
          const signedSwapTransaction = await signTransaction(swapTransaction);
          
          setPaymentStep('sending');
          const swapSignature = await connection.sendRawTransaction(signedSwapTransaction.serialize(), {
            skipPreflight: false,
            maxRetries: 3,
          });
          signatures.push(swapSignature);
          console.log('Swap transaction sent:', swapSignature);
        } catch (swapError: any) {
          if (swapError instanceof SendTransactionError) {
            const logs = swapError.logs || [];
            console.error('Swap transaction error:', {
              message: swapError.message,
              logs: logs,
              fullError: swapError,
            });
            throw new Error(`Swap transaction failed: ${swapError.message}\nLogs: ${logs.join('\n')}`);
          }
          throw swapError;
        }
      }

      // Step 3: Sign and send transfer transaction (SOL to merchant)
      setPaymentStep('signing');
      try {
        const transactionData = data.transferTransaction || data.transaction;
        const transactionBuf = Buffer.from(transactionData, 'base64');
        const { Transaction } = await import('@solana/web3.js');
        const transferTransaction = Transaction.from(transactionBuf) as Transaction;
        
        // Check if blockhash is still valid, refresh if needed
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
        if (!transferTransaction.recentBlockhash || 
            transferTransaction.recentBlockhash !== blockhash) {
          console.warn('Transaction blockhash expired, refreshing...');
          transferTransaction.recentBlockhash = blockhash;
          transferTransaction.lastValidBlockHeight = lastValidBlockHeight;
          // Need to re-sign with new blockhash
          const reSignedTransaction = await signTransaction(transferTransaction);
          transferTransaction.signatures = reSignedTransaction.signatures;
        }
        
        const signedTransferTransaction = await signTransaction(transferTransaction);
        
        setPaymentStep('sending');
        const transferSignature = await connection.sendRawTransaction(signedTransferTransaction.serialize(), {
          skipPreflight: false,
          maxRetries: 3,
        });
        signatures.push(transferSignature);
        console.log('Transfer transaction sent:', transferSignature);
      } catch (transferError: any) {
        if (transferError instanceof SendTransactionError) {
          const logs = transferError.logs || [];
          console.error('Transfer transaction error:', {
            message: transferError.message,
            logs: logs,
            fullError: transferError,
          });
          throw new Error(`Transfer transaction failed: ${transferError.message}\nLogs: ${logs.join('\n')}`);
        }
        throw transferError;
      }

      // Step 4: Confirm transactions
      setPaymentStep('confirming');
      await Promise.all(
        signatures.map(sig => connection.confirmTransaction(sig, 'confirmed'))
      );

      // Step 5: Complete order (updates status, creates Printify order, sends email)
      try {
        const completeResponse = await fetch('/api/merch/orders/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderId,
            swapSignature: signatures[0] || null,
            transferSignature: signatures[1] || signatures[0] || null,
          }),
        });

        const completeData = await completeResponse.json();
        if (completeData.success) {
          // Success!
          alert(`Order completed successfully!\n\nOrder ID: ${data.orderId}\nYou will receive ${data.root5Amount.toFixed(2)} ROOT5 tokens.\n\nA confirmation email has been sent to ${shippingInfo.email}.`);
        } else {
          console.error('Error completing order:', completeData.error);
          // Still show success to user since payment went through
          alert(`Payment successful! Order ID: ${data.orderId}\n\nNote: Some post-processing may be pending.`);
        }
      } catch (updateError) {
        console.error('Error completing order:', updateError);
        // Still show success to user since payment went through
        alert(`Payment successful! Order ID: ${data.orderId}\n\nNote: Some post-processing may be pending.`);
      }

      saveCart([]);
      setCheckoutOpen(false);
      setPaymentStep('idle');
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      let errorMessage = 'Failed to process checkout';
      let errorDetails = '';
      
      if (error instanceof SendTransactionError) {
        const logs = error.logs || [];
        errorMessage = `Transaction failed: ${error.message}`;
        errorDetails = `\n\nTransaction Logs:\n${logs.join('\n')}`;
        console.error('SendTransactionError details:', {
          message: error.message,
          logs: logs,
          signature: error.signature,
          fullError: error,
        });
      } else if (error instanceof Error) {
        errorMessage = error.message;
        if (error.stack) {
          console.error('Error stack:', error.stack);
        }
      }
      
      if (errorMessage.includes('User rejected') || errorMessage.includes('User cancelled')) {
        alert('Transaction was cancelled. Please try again when ready.');
      } else if (errorMessage.includes('Blockhash not found')) {
        alert('Transaction expired. Please try again - the transaction will be refreshed automatically.');
      } else {
        alert(`Failed to process checkout: ${errorMessage}${errorDetails}`);
      }
      
      setPaymentStep('idle');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Root5DAO Merch Store
            </h1>
            <p className="text-lg text-gray-300">
              Buy merch with SOL - automatically converted to ROOT5 tokens
            </p>
            {solPrice > 0 && (
              <div className="mt-4 glass-effect rounded-lg p-4 inline-block">
                <p className="text-sm text-gray-300">
                  1 SOL = ${solPrice.toFixed(2)} USD
                </p>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setCheckoutOpen(true)}
              className="glass-effect-strong px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all"
              disabled={cart.length === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
              {cart.length > 0 && (
                <span className="ml-2">${getTotalUSD().toFixed(2)}</span>
              )}
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-transform"
                >
                  <div className="relative h-64 bg-gray-800">
                    <img
                      src={product.image_url || '/images.jpeg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images.jpeg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-green-400">
                          ${product.price_usd.toFixed(2)}
                        </p>
                        {solPrice > 0 && (
                          <p className="text-sm text-gray-400">
                            {(product.price_usd / solPrice).toFixed(4)} SOL
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        Stock: {product.stock}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">No products available at the moment</p>
            </div>
          )}
        </div>

        {/* Checkout Modal */}
        {checkoutOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Checkout</h2>
                  <button
                    onClick={() => setCheckoutOpen(false)}
                    className="text-gray-400 hover:text-white text-2xl sm:text-xl w-8 h-8 flex items-center justify-center"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-gray-700/50 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border border-gray-600"
                    >
                      <img
                        src={item.product.image_url || '/images.jpeg'}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <h4 className="text-white font-semibold text-sm sm:text-base truncate">{item.product.name}</h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          ${item.product.price_usd.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 sm:w-8 sm:h-8 rounded bg-gray-700 hover:bg-gray-600 text-white text-lg flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-white w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 sm:w-8 sm:h-8 rounded bg-gray-700 hover:bg-gray-600 text-white text-lg flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-300 text-sm sm:text-base px-2 sm:px-0"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-base sm:text-lg">Total:</span>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        ${getTotalUSD().toFixed(2)}
                      </p>
                      {solPrice > 0 && (
                        <p className="text-xs sm:text-sm text-gray-400">
                          {getTotalSOL().toFixed(4)} SOL
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Form */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Shipping Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      type="text"
                      placeholder="First Name *"
                      value={shippingInfo.firstName}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                      }
                      className="bg-gray-700 rounded-lg p-3 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={shippingInfo.lastName}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                      }
                      className="bg-gray-700 rounded-lg p-3 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
                      required
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email *"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, email: e.target.value })
                    }
                    className="bg-gray-700 rounded-lg p-3 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1 *"
                    value={shippingInfo.address1}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, address1: e.target.value })
                    }
                    className="bg-gray-700 rounded-lg p-3 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none w-full"
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <input
                      type="text"
                      placeholder="City *"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      className="bg-gray-700 rounded-lg p-3 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State/Region *"
                      value={shippingInfo.region}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, region: e.target.value })
                      }
                      className="bg-gray-700 rounded-lg p-3 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="ZIP *"
                      value={shippingInfo.zip}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, zip: e.target.value })
                      }
                      className="bg-gray-700 rounded-lg p-3 text-sm sm:text-base text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-600">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Payment</h3>
                  {!connected ? (
                    <div className="text-center">
                      <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Connect your wallet to pay</p>
                      <WalletMultiButton />
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                        Pay with SOL - will be automatically converted to ROOT5 tokens
                      </p>
                      <button
                        onClick={handleCheckout}
                        disabled={processing}
                        className="w-full btn-primary disabled:opacity-50 text-sm sm:text-base py-2.5 sm:py-3"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin inline mr-2" />
                            {paymentStep === 'signing' && 'Please sign transactions...'}
                            {paymentStep === 'sending' && 'Sending transactions...'}
                            {paymentStep === 'confirming' && 'Confirming transactions...'}
                            {paymentStep === 'idle' && 'Processing...'}
                          </>
                        ) : (
                          'Complete Purchase'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

