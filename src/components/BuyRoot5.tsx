'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@/lib/wallet';
import { getSwapQuote, getSwapTransaction } from '@/lib/jupiter-swap';
import { VersionedTransaction, SendTransactionError } from '@solana/web3.js';
import { Loader2, Coins, ArrowDownUp } from 'lucide-react';

export default function BuyRoot5() {
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [solAmount, setSolAmount] = useState<string>('');
  const [root5Amount, setRoot5Amount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState<string>('');
  const [priceImpact, setPriceImpact] = useState<number>(0);

  // Fetch quote when SOL amount changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!solAmount || parseFloat(solAmount) <= 0) {
        setRoot5Amount(0);
        setPriceImpact(0);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const amount = parseFloat(solAmount);
        if (isNaN(amount) || amount <= 0) {
          setRoot5Amount(0);
          setPriceImpact(0);
          return;
        }

        const quote = await getSwapQuote(amount, 50); // 0.5% slippage
        
        if (quote) {
          const ROOT5_DECIMALS = 6;
          const root5 = parseFloat(quote.outAmount) / Math.pow(10, ROOT5_DECIMALS);
          setRoot5Amount(root5);
          setPriceImpact(quote.priceImpactPct || 0);
        } else {
          setError('Unable to fetch quote. Please try again.');
          setRoot5Amount(0);
        }
      } catch (err) {
        console.error('Error fetching quote:', err);
        setError('Error fetching quote. Please try again.');
        setRoot5Amount(0);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [solAmount]);

  const handleSwap = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    if (!solAmount || parseFloat(solAmount) <= 0) {
      setError('Please enter a valid SOL amount');
      return;
    }

    setSwapping(true);
    setError('');

    try {
      const amount = parseFloat(solAmount);
      
      // Get quote
      const quote = await getSwapQuote(amount, 50);
      if (!quote) {
        throw new Error('Failed to get swap quote');
      }

      // Get swap transaction
      const swapTransactionBase64 = await getSwapTransaction(publicKey.toString(), quote);
      if (!swapTransactionBase64) {
        throw new Error('Failed to create swap transaction');
      }

      // Deserialize and sign transaction
      const swapTransactionBuf = Buffer.from(swapTransactionBase64, 'base64');
      const swapTransaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      const signedTransaction = await signTransaction(swapTransaction);
      
      // Send transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');

      // Success!
      alert(`Successfully swapped ${solAmount} SOL for ${root5Amount.toFixed(2)} ROOT5!\n\nTransaction: ${signature}`);
      setSolAmount('');
      setRoot5Amount(0);
      
    } catch (err: any) {
      console.error('Swap error:', err);
      
      if (err instanceof SendTransactionError) {
        const logs = err.logs || [];
        setError(`Transaction failed: ${err.message}`);
        console.error('Transaction logs:', logs);
      } else if (err.message?.includes('User rejected') || err.message?.includes('User cancelled')) {
        setError('Transaction cancelled');
      } else {
        setError(err.message || 'Failed to complete swap. Please try again.');
      }
    } finally {
      setSwapping(false);
    }
  };

  const setMaxAmount = async () => {
    if (!connected || !publicKey) return;
    
    try {
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / 1e9;
      // Leave some SOL for fees (0.01 SOL)
      const maxAmount = Math.max(0, solBalance - 0.01);
      setSolAmount(maxAmount.toFixed(4));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 sm:p-8 lg:p-8 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 glass-effect-subtle rounded-full flex items-center justify-center flex-shrink-0">
          <Coins className="h-7 w-7 sm:h-8 sm:w-8 text-green-400" />
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">Buy ROOT5</h3>
          <p className="text-sm sm:text-base text-gray-400">Swap SOL for ROOT5 tokens</p>
        </div>
      </div>

      {!connected ? (
        <div className="text-center py-8 sm:py-10 flex-1 flex flex-col justify-center">
          <p className="text-gray-400 mb-6 text-base sm:text-lg">Connect your wallet to buy ROOT5</p>
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      ) : (
        <div className="space-y-6 flex-1 flex flex-col">
          {/* SOL Input */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm sm:text-base font-medium text-gray-300">Amount (SOL)</label>
              {connected && (
                <button
                  onClick={setMaxAmount}
                  className="text-sm text-green-400 hover:text-green-300 transition-colors font-medium px-2 py-1 rounded hover:bg-green-400/10"
                >
                  Max
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                value={solAmount}
                onChange={(e) => setSolAmount(e.target.value)}
                placeholder="0.0"
                step="0.01"
                min="0"
                className="w-full bg-gray-700/80 rounded-xl p-5 sm:p-6 text-xl sm:text-2xl text-white placeholder-gray-500 border-2 border-gray-600 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all"
              />
              <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg sm:text-xl">
                SOL
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-effect-subtle flex items-center justify-center border-2 border-gray-600">
              <ArrowDownUp className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400" />
            </div>
          </div>

          {/* ROOT5 Output */}
          <div>
            <label className="text-sm sm:text-base font-medium text-gray-300 mb-3 block">You'll Receive (ROOT5)</label>
            <div className="relative">
              <input
                type="text"
                value={loading ? 'Calculating...' : root5Amount > 0 ? root5Amount.toFixed(2) : '0.00'}
                readOnly
                className="w-full bg-gray-700/80 rounded-xl p-5 sm:p-6 text-xl sm:text-2xl text-white border-2 border-gray-600 focus:outline-none"
              />
              <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg sm:text-xl">
                ROOT5
              </div>
            </div>
            {priceImpact > 0 && (
              <p className="text-xs sm:text-sm text-gray-500 mt-3 ml-1">
                Price impact: <span className={priceImpact > 1 ? 'text-yellow-400' : 'text-gray-400'}>{priceImpact.toFixed(2)}%</span>
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4">
              <p className="text-sm sm:text-base text-red-400">{error}</p>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={swapping || loading || !solAmount || parseFloat(solAmount) <= 0 || root5Amount <= 0}
            className="w-full btn-primary py-5 sm:py-6 text-base sm:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-xl mt-auto transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {swapping ? (
              <>
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                <span>Swapping...</span>
              </>
            ) : (
              'Swap SOL for ROOT5'
            )}
          </button>

          <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
            Powered by Jupiter Aggregator
          </p>
        </div>
      )}
    </div>
  );
}

