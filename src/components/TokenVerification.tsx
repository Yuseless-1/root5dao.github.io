'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { Vote, Users, Coins, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TokenVerification() {
  const { connected } = useWallet();
  const { tokenBalance, loading, error } = useTokenBalance();

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to access the DAO</p>
          <Link 
            href="/"
            className="gradient-bg text-black font-bold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-green-400/30 transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking token balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="gradient-bg text-black font-bold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-green-400/30 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Token Verification</h1>
          <p className="text-base sm:text-lg text-gray-400">Verify your token holdings to access DAO features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Coins className="h-6 w-6 text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Your Balance</h3>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {tokenBalance.balance.toFixed(2)} tokens
            </div>
            <p className="text-gray-400 text-sm">Current token holdings</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Shield className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Access Level</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Voting Rights</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  tokenBalance.canVote ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {tokenBalance.canVote ? '✓ Available' : '✗ Insufficient'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Proposal Creation</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  tokenBalance.canCreateProposal ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {tokenBalance.canCreateProposal ? '✓ Available' : '✗ Insufficient'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Requirements</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Vote className="h-5 w-5 text-green-400" />
                <div>
                  <div className="font-semibold text-white text-sm">Voting</div>
                  <div className="text-xs text-gray-400">Minimum 1 token required</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="font-semibold text-white text-sm">Proposal Creation</div>
                  <div className="text-xs text-gray-400">Minimum 10 tokens required</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-400">
                <p className="mb-1">• Each vote costs 1 token (burned)</p>
                <p className="mb-1">• Creating proposals costs 10 tokens (burned)</p>
                <p>• Tokens are burned to prevent spam and ensure commitment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/proposals"
            className="btn-primary text-sm"
          >
            View Proposals
          </Link>
        </div>
      </div>
    </div>
  );
}
