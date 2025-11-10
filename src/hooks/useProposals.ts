'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createBurnInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { CreateProposalData, Proposal } from '@/types/proposal';

export const useProposals = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with your actual token mint address
  const TOKEN_MINT_ADDRESS = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump';
  const PROPOSAL_COST = 10; // Tokens required to create a proposal

  const createProposal = async (data: CreateProposalData): Promise<Proposal | null> => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the associated token account
      const tokenMint = new PublicKey(TOKEN_MINT_ADDRESS);
      const tokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);

      // Create burn instruction for proposal cost
      const burnInstruction = createBurnInstruction(
        tokenAccount,
        tokenMint,
        publicKey,
        PROPOSAL_COST
      );

      // Create and send transaction
      const transaction = new Transaction().add(burnInstruction);
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      // Wait for confirmation
      await connection.confirmTransaction(signature);

      // Create the proposal object
      const newProposal: Proposal = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        creator: publicKey.toString(),
        createdAt: new Date(),
        status: 'active',
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        requiredTokens: PROPOSAL_COST,
      };

      return newProposal;
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError('Failed to create proposal');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProposal,
    loading,
    error,
  };
};

