'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createBurnInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

export interface VoteData {
    proposalId: string;
    voteCount: number;
    tokensBurned: number;
}

export const useVoting = () => {
    const { publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Replace with your actual token mint address
    const TOKEN_MINT_ADDRESS = '12fgghtred233455ggreedd';

    const castVote = async (proposalId: string, voteCount: number): Promise<VoteData | null> => {
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

            // Create burn instruction for each token (1 token = 1 vote)
            const burnInstructions = [];
            for (let i = 0; i < voteCount; i++) {
                const burnInstruction = createBurnInstruction(
                    tokenAccount,
                    tokenMint,
                    publicKey,
                    1 // Burn 1 token per vote
                );
                burnInstructions.push(burnInstruction);
            }

            // Create and send transaction
            const transaction = new Transaction().add(...burnInstructions);
            
            // Get recent blockhash
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // Sign and send transaction
            const signedTransaction = await signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            // Wait for confirmation
            await connection.confirmTransaction(signature);

            return {
                proposalId,
                voteCount,
                tokensBurned: voteCount,
            };
        } catch (err) {
            console.error('Error casting vote:', err);
            setError('Failed to cast vote');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        castVote,
        loading,
        error,
    };
};

