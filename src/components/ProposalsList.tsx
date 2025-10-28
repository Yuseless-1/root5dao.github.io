'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useVoting } from '@/hooks/useVoting';
import { Proposal, MOCK_PROPOSALS } from '@/types/proposal';
import { Vote, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProposalsList() {
  const { connected } = useWallet();
  const { tokenBalance } = useTokenBalance();
  const { castVote, loading: votingLoading } = useVoting();
  const [proposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [votingProposal, setVotingProposal] = useState<string | null>(null);

  const handleVote = async (proposalId: string, voteType: 'for' | 'against') => {
    if (!tokenBalance.canVote) return;
    
    setVotingProposal(proposalId);
    const result = await castVote(proposalId, 1);
    setVotingProposal(null);
    
    if (result) {
      // Update local state or refetch proposals
      console.log('Vote cast successfully:', result);
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusText = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Vote className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view proposals</p>
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

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Proposals</h1>
            <p className="text-base sm:text-lg text-gray-400">Vote on meme tokenization proposals</p>
          </div>
          <Link
            href="/create"
            className="btn-primary text-sm w-full sm:w-auto"
          >
            <Vote className="h-4 w-4 mr-2" />
            Create Proposal
          </Link>
        </div>

        <div className="grid gap-6">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="glass-effect rounded-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {proposal.imageUrl && (
                  <div className="lg:w-64 flex-shrink-0">
                    <img
                      src={proposal.imageUrl}
                      alt={proposal.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{proposal.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span>By {proposal.creator.slice(0, 8)}...</span>
                        <span>{proposal.createdAt.toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(proposal.status)}
                          <span>{getStatusText(proposal.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{proposal.description}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <ThumbsUp className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-green-400 font-semibold text-xs">Votes For</span>
                      </div>
                      <div className="text-lg font-bold text-white">{proposal.votesFor}</div>
                    </div>
                    
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <ThumbsDown className="h-4 w-4 text-red-400 mr-1" />
                        <span className="text-red-400 font-semibold text-xs">Votes Against</span>
                      </div>
                      <div className="text-lg font-bold text-white">{proposal.votesAgainst}</div>
                    </div>
                    
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <Vote className="h-4 w-4 text-blue-400 mr-1" />
                        <span className="text-blue-400 font-semibold text-xs">Total Votes</span>
                      </div>
                      <div className="text-lg font-bold text-white">{proposal.totalVotes}</div>
                    </div>
                  </div>

                  {proposal.status === 'active' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleVote(proposal.id, 'for')}
                        disabled={!tokenBalance.canVote || votingProposal === proposal.id}
                        className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                      >
                        {votingProposal === proposal.id && votingLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                        ) : (
                          <>
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Vote For (1 token)
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, 'against')}
                        disabled={!tokenBalance.canVote || votingProposal === proposal.id}
                        className="flex-1 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                      >
                        {votingProposal === proposal.id && votingLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        ) : (
                          <>
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Vote Against (1 token)
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!tokenBalance.canVote && proposal.status === 'active' && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mt-3">
                      <p className="text-yellow-300 text-xs">
                        You need at least 1 token to vote. You currently have {tokenBalance.balance.toFixed(2)} tokens.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
