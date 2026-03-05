
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { WalletState, Proposal, ProposalStatus } from '../types';
import { fetchProposal } from '../services/supabasePublic';

interface VotingProps {
  wallet: WalletState;
  signLogin: () => void;
}

const MOCK_PROPOSAL: Proposal = {
  id: 'R5P-014',
  title: 'Migrate Treasury management to Gnosis Safe v1.3',
  description: `This proposal advocates for migrating our current 3-of-5 multisig treasury wallet to Gnosis Safe v1.3.

The primary objectives are:
1. Improved security through updated smart contracts.
2. Support for EIP-1271 (smart contract signatures).
3. Better gas efficiency for batch transactions.

The migration process will involve a 48-hour timelock period followed by the transfer of all protocol-owned liquidity. We estimate the one-time gas cost to be approximately 1.5 ETH at current market prices.`,
  proposer: '0x1234...5678',
  status: ProposalStatus.ACTIVE,
  votesFor: 1250000,
  votesAgainst: 12000,
  votesAbstain: 5000,
  createdAt: '2024-03-10',
  expiresAt: '2024-03-24',
};

const NONCE_MSG = (nonce: string) => `Sign this nonce to authenticate your action: ${nonce}`;

const Voting: React.FC<VotingProps> = ({ wallet, signLogin }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVote, setSelectedVote] = useState<'FOR' | 'AGAINST' | 'ABSTAIN' | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [voteSuccess, setVoteSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const data = id ? await fetchProposal(id) : null;
      if (!cancelled) {
        setProposal(data ?? MOCK_PROPOSAL);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (!wallet.isSigned) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-4">Authentication Required</h2>
        <p className="text-white/60 mb-8 leading-relaxed">
          Voting requires a valid Web3 signature to verify your governance power.
        </p>
        <button
          onClick={signLogin}
          className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-green-500/30"
        >
          Sign to Access Voting
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!proposal) {
    return <div className="text-center py-32 text-white/40">Proposal not found.</div>;
  }

  const handleVote = async () => {
    if (!selectedVote || !wallet.address || !wallet.chain) return;
    setIsCasting(true);
    setVoteError(null);

    try {
      // 1. Fetch a fresh one-time nonce
      const nonceResp = await fetch(
        `/api/nonce?wallet=${encodeURIComponent(wallet.address)}&chain=${wallet.chain}`
      );
      if (!nonceResp.ok) throw new Error('Failed to fetch nonce');
      const { nonce } = await nonceResp.json();
      const message = NONCE_MSG(nonce);

      // 2. Sign with the connected wallet
      let signature: string;
      if (wallet.chain === 'ethereum') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        signature = await signer.signMessage(message);
      } else {
        const encoded = new TextEncoder().encode(message);
        const signed = await window.solana.signMessage(encoded, 'utf8');
        signature = btoa(String.fromCharCode(...signed.signature));
      }

      // 3. Submit to API
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet:      wallet.address,
          chain:       wallet.chain,
          nonce,
          signature,
          proposal_id: proposal.id,
          vote_choice: selectedVote,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error === 'already_voted') {
          setVoteError('This wallet has already voted on this proposal.');
        } else {
          setVoteError(result.message ?? result.error ?? 'Vote failed. Please try again.');
        }
        return;
      }

      setVoteSuccess(true);
      setTimeout(() => navigate('/proposals'), 2000);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() ?? '';
      if (!msg.includes('reject') && !msg.includes('cancel') && !msg.includes('denied')) {
        setVoteError('Vote failed. Please try again.');
      }
    } finally {
      setIsCasting(false);
    }
  };

  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const pct = (n: number) => totalVotes > 0 ? ((n / totalVotes) * 100).toFixed(1) : '0.0';

  const voteChoices = [
    { key: 'FOR',     label: 'Vote FOR',     activeClass: 'bg-green-500/10 border-green-500 text-green-400 ring-2 ring-green-500/10',   checkClass: 'bg-green-500 border-green-500',   iconClass: 'text-black' },
    { key: 'AGAINST', label: 'Vote AGAINST', activeClass: 'bg-red-500/10 border-red-500 text-red-400 ring-2 ring-red-500/10',           checkClass: 'bg-red-500 border-red-500',       iconClass: 'text-white' },
    { key: 'ABSTAIN', label: 'Vote ABSTAIN', activeClass: 'bg-yellow-500/10 border-yellow-500 text-yellow-400 ring-2 ring-yellow-500/10', checkClass: 'bg-yellow-500 border-yellow-500', iconClass: 'text-black' },
  ] as const;

  const resultRows = [
    { label: 'For',     count: proposal.votesFor,     barClass: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]',   textClass: 'text-green-400' },
    { label: 'Against', count: proposal.votesAgainst, barClass: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]',     textClass: 'text-red-400' },
    { label: 'Abstain', count: proposal.votesAbstain, barClass: 'bg-yellow-500 shadow-[0_0_10px_rgba(252,211,77,0.4)]', textClass: 'text-yellow-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="lg:col-span-2 space-y-8">
        <button
          onClick={() => navigate('/proposals')}
          className="text-white/40 hover:text-green-400 flex items-center gap-2 text-sm font-bold transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Proposals
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-lg border border-green-500/20">{proposal.id}</span>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] border ${
              proposal.status === ProposalStatus.ACTIVE   ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              proposal.status === ProposalStatus.PASSED   ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
              proposal.status === ProposalStatus.PENDING  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>{proposal.status}</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">{proposal.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/30 font-mono">
            <span>By: <span className="text-white/80">{proposal.proposer}</span></span>
            <span>Created: <span className="text-white/80">{proposal.createdAt}</span></span>
            <span>Expires: <span className="text-white/80">{proposal.expiresAt}</span></span>
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] border border-white/5">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            Executive Summary
          </h2>
          <div className="prose prose-invert max-w-none text-white/60 leading-relaxed text-lg whitespace-pre-wrap font-medium">
            {proposal.description}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass p-8 rounded-[40px] border border-white/5 sticky top-24">
          <h3 className="text-xl font-bold mb-8">Cast Your Vote</h3>

          {voteSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-green-400">Vote cast successfully!</p>
              <p className="text-white/40 text-sm">Redirecting to proposals...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-10">
                {voteChoices.map(({ key, label, activeClass, checkClass, iconClass }) => {
                  const isSelected = selectedVote === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedVote(key)}
                      className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected ? activeClass : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold text-lg">{label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? checkClass : 'border-white/10'}`}>
                        {isSelected && (
                          <svg className={`w-4 h-4 ${iconClass}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {voteError && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {voteError}
                </div>
              )}

              <button
                disabled={!selectedVote || isCasting}
                onClick={handleVote}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  !selectedVote || isCasting
                  ? 'bg-white/5 text-white/10 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-black shadow-xl shadow-green-500/20 active:scale-95'
                }`}
              >
                {isCasting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Casting Vote...
                  </>
                ) : 'Cast Governance Power'}
              </button>
            </>
          )}

          <div className="mt-12 pt-8 border-t border-white/5">
            <h4 className="text-[10px] font-bold mb-6 uppercase tracking-[0.2em] text-white/30">Live Results</h4>
            <div className="space-y-6">
              {resultRows.map(({ label, count, barClass, textClass }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className={`uppercase ${textClass}`}>{label}</span>
                    <span className="text-white/80">{count.toLocaleString()} R5T</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${barClass}`} style={{ width: `${pct(count)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-[10px] text-white/20 leading-relaxed font-medium uppercase tracking-widest text-center">
              Quorum: 1M R5T Required · {totalVotes >= 1000000 ? 'REACHED' : 'NOT REACHED'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;
