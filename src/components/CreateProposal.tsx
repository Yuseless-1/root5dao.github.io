'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useProposals } from '@/hooks/useProposals';
import { CreateProposalData } from '@/types/proposal';
import { Plus, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateProposal() {
  const { connected } = useWallet();
  const { tokenBalance } = useTokenBalance();
  const { createProposal, loading, error } = useProposals();
  const [formData, setFormData] = useState<CreateProposalData>({
    title: '',
    description: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenBalance.canCreateProposal) return;

    const proposal = await createProposal(formData);
    if (proposal) {
      // Redirect to proposals page or show success
      window.location.href = '/proposals';
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to create proposals</p>
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

  if (!tokenBalance.canCreateProposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Insufficient Tokens</h2>
          <p className="text-gray-400 mb-6">
            You need at least 10 tokens to create a proposal. You currently have {tokenBalance.balance.toFixed(2)} tokens.
          </p>
          <Link 
            href="/verify"
            className="gradient-bg text-black font-bold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-green-400/30 transition-all"
          >
            Check Balance
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Create Proposal</h1>
          <p className="text-base sm:text-lg text-gray-400">Submit a new meme for tokenization</p>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proposal Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                placeholder="Enter a catchy title for your meme proposal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none text-sm"
                placeholder="Describe why this meme should be tokenized..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                placeholder="https://example.com/meme-image.jpg"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-semibold text-sm">Cost: 10 Tokens</span>
              </div>
              <p className="text-yellow-300 text-xs">
                Creating a proposal will burn 10 tokens from your wallet. This prevents spam and ensures commitment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Proposal
                  </>
                )}
              </button>
              <Link
                href="/proposals"
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
