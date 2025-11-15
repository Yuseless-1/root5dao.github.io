'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createBurnInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useState } from 'react';

const TOKEN_MINT_ADDRESS = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';

export const useTokenBurn = () => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [burning, setBurning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const burnToken = async (amount: number = 1): Promise<boolean> => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return false;
    }

    setBurning(true);
    setError(null);

    try {
      const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
      
      // Get the token account address
      const tokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );

      // Amount in smallest unit (assuming 9 decimals like most SPL tokens)
      const burnAmount = amount * 1_000_000_000; // 1 token = 1e9 smallest units

      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        tokenAccount,
        mintPublicKey,
        publicKey,
        burnAmount,
        [],
        TOKEN_PROGRAM_ID
      );

      // Create and send transaction
      const transaction = new Transaction().add(burnInstruction);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      console.log('Token burned successfully! Signature:', signature);
      return true;
    } catch (err) {
      console.error('Error burning token:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to burn token';
      setError(errorMessage);
      return false;
    } finally {
      setBurning(false);
    }
  };

  return {
    burnToken,
    burning,
    error,
  };
};

