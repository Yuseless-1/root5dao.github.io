'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token';
import { useState, useEffect } from 'react';

// Replace with your actual token mint address
const TOKEN_MINT_ADDRESS = 'AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump'; // This should be your actual token mint

export interface TokenBalance {
    balance: number;
    hasMinimumBalance: boolean;
    canCreateProposal: boolean;
    canVote: boolean;
}

export const useTokenBalance = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
        balance: 0,
        hasMinimumBalance: false,
        canCreateProposal: false,
        canVote: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Minimum token requirements
    const MIN_VOTING_TOKENS = 1;
    const MIN_PROPOSAL_TOKENS = 10;

    const checkTokenBalance = async () => {
        if (!publicKey || !connection) {
            setTokenBalance({
                balance: 0,
                hasMinimumBalance: false,
                canCreateProposal: false,
                canVote: false,
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Find the token account for the user's wallet
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                publicKey,
                {
                    programId: TOKEN_PROGRAM_ID,
                }
            );

            // Look for the specific token mint
            const tokenAccount = tokenAccounts.value.find(
                (account) => account.account.data.parsed.info.mint === TOKEN_MINT_ADDRESS
            );

            let balance = 0;
            if (tokenAccount) {
                balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount || 0;
            }

            const hasMinimumBalance = balance >= MIN_VOTING_TOKENS;
            const canCreateProposal = balance >= MIN_PROPOSAL_TOKENS;
            const canVote = balance >= MIN_VOTING_TOKENS;

            setTokenBalance({
                balance,
                hasMinimumBalance,
                canCreateProposal,
                canVote,
            });
        } catch (err) {
            console.error('Error checking token balance:', err);
            setError('Failed to check token balance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkTokenBalance();
    }, [publicKey, connection]);

    return {
        tokenBalance,
        loading,
        error,
        refetch: checkTokenBalance,
    };
};

