
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletState, ProposalStatus, Proposal } from '../types';
import { Link } from 'react-router-dom';
import NewProposalForm from '../components/NewProposalForm';
import { fetchProposals } from '../services/supabasePublic';

interface ProposalsProps {
  wallet: WalletState;
  signLogin: () => void;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'R5P-014',
    title: 'Migrate Treasury management to Gnosis Safe v1.3',
    description: 'Upgrading our core treasury multisig to use the latest secure standards.',
    proposer: '0x1234...5678',
    status: ProposalStatus.ACTIVE,
    votesFor: 1250000,
    votesAgainst: 12000,
    votesAbstain: 5000,
    createdAt: '2024-03-10',
    expiresAt: '2024-03-24',
    budget: 15000,
    subject: 'Upgrade staking contract to include dynamic reward rates and new liquidity pools.',
  },
  {
    id: 'R5P-013',
    title: 'Expand liquidity mining rewards for R5/WETH pair',
    description: 'Incentivizing deeper liquidity for our native token to reduce slippage.',
    proposer: '0x9876...4321',
    status: ProposalStatus.PASSED,
    votesFor: 4800000,
    votesAgainst: 240000,
    votesAbstain: 10000,
    createdAt: '2024-03-01',
    expiresAt: '2024-03-08',
    budget: 5000,
    subject: 'Allocate funds for community-led initiatives and development grants in Q3.',
  },
  {
    id: 'R5P-012',
    title: 'Integrate Chainlink CCIP for cross-chain governance',
    description: 'Enabling voting and proposal execution across multiple L2 networks.',
    proposer: '0xbeef...dead',
    status: ProposalStatus.REJECTED,
    votesFor: 500000,
    votesAgainst: 850000,
    votesAbstain: 20000,
    createdAt: '2024-02-20',
    expiresAt: '2024-02-27',
    budget: 20000,
    subject: 'Integrate with Protocol X to expand our ecosystem and user base.',
  },
];

const NONCE_MSG = (nonce: string) => `Sign this nonce to authenticate your action: ${nonce}`;

const Proposals: React.FC<ProposalsProps> = ({ wallet, signLogin }) => {
  const [filter, setFilter] = useState<string>('All');
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch live proposals from Supabase on mount; fall back to mock if not configured
  useEffect(() => {
    fetchProposals().then(live => {
      if (live.length > 0) setProposals(live);
    });
  }, []);

  const handleNewProposal = async (data: { title: string; subject: string; budget: number }) => {
    if (!wallet.address || !wallet.chain) return;
    setSubmitError(null);

    try {
      // 1. Get nonce
      const nonceResp = await fetch(
        `/api/nonce?wallet=${encodeURIComponent(wallet.address)}&chain=${wallet.chain}`
      );
      if (!nonceResp.ok) throw new Error('Failed to fetch nonce');
      const { nonce } = await nonceResp.json();
      const message = NONCE_MSG(nonce);

      // 2. Sign
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

      // 3. Submit proposal
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet:      wallet.address,
          chain:       wallet.chain,
          nonce,
          signature,
          title:       data.title,
          description: data.subject,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error === 'insufficient_balance') {
          const required = result.required?.toLocaleString() ?? '10,000,000';
          const held     = result.held     !== undefined ? result.held.toLocaleString() : '?';
          setSubmitError(`Insufficient ROOT5 balance. Required: ${required} — you hold: ${held}.`);
        } else {
          setSubmitError(result.message ?? result.error ?? 'Submission failed. Please try again.');
        }
        return;
      }

      // Optimistically add to local list
      const newProposal: Proposal = {
        id: result.id ?? `R5P-${String(proposals.length + 1).padStart(3, '0')}`,
        proposer: wallet.address,
        status: ProposalStatus.PENDING,
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ...data,
        description: data.subject,
      };
      setProposals(prev => [newProposal, ...prev]);
      setShowNewProposalForm(false);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() ?? '';
      if (!msg.includes('reject') && !msg.includes('cancel') && !msg.includes('denied')) {
        setSubmitError('Submission failed. Please try again.');
      }
    }
  };

  if (!wallet.isSigned) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-lg mx-auto animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-3xl bg-green-500/5 flex items-center justify-center mb-8 border border-green-500/20">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold mb-4">Secure Governance</h2>
        <p className="text-white/50 mb-10 leading-relaxed text-lg">
          Please authenticate with your wallet to view active proposals and participate in Root5 DAO governance.
        </p>
        <button
          onClick={signLogin}
          className="bg-green-500 hover:bg-green-600 text-black px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-green-500/20 active:scale-95"
        >
          {wallet.isConnected ? 'Sign Message' : 'Connect & Authenticate'}
        </button>
      </div>
    );
  }

  const filteredProposals = filter === 'All'
    ? proposals
    : proposals.filter(p => p.status === filter);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-5xl font-bold mb-3 tracking-tight">Proposals</h1>
          <p className="text-white/40 text-lg">Propose and vote on the core parameters of the Root5 Ecosystem.</p>
        </div>
        <button
          onClick={() => { setSubmitError(null); setShowNewProposalForm(true); }}
          className="bg-green-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-xl">+</span> New Proposal
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {['All', ProposalStatus.ACTIVE, ProposalStatus.PASSED, ProposalStatus.REJECTED, ProposalStatus.PENDING].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              filter === f
              ? 'bg-green-500 border-green-500 text-black shadow-lg shadow-green-500/20'
              : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProposals.map((proposal) => {
          const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
          const forPct     = totalVotes > 0 ? (proposal.votesFor     / totalVotes) * 100 : 0;
          const againstPct = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
          const abstainPct = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0;

          return (
            <Link
              to={`/voting/${proposal.id}`}
              key={proposal.id}
              className="glass block group p-8 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded text-sm tracking-tight">{proposal.id}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                    proposal.status === ProposalStatus.ACTIVE  ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    proposal.status === ProposalStatus.PASSED  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                    proposal.status === ProposalStatus.PENDING ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <div className="text-white/20 text-xs font-mono">
                  Author: <span className="text-white/50">{proposal.proposer}</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-6 group-hover:text-green-400 transition-colors">
                {proposal.title}
              </h3>

              {proposal.subject && (
                <p className="text-white/70 text-sm mb-4 line-clamp-3">{proposal.subject}</p>
              )}
              {proposal.budget && (
                <p className="text-white/50 text-sm mb-4">Budget: <span className="text-green-400">{proposal.budget} ETH</span></p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  {[
                    { label: 'For',     pct: forPct,     color: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',   text: 'text-green-400' },
                    { label: 'Against', pct: againstPct, color: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',     text: 'text-red-400' },
                    { label: 'Abstain', pct: abstainPct, color: 'bg-yellow-500 shadow-[0_0_8px_rgba(252,211,77,0.5)]', text: 'text-yellow-400' },
                  ].map(({ label, pct, color, text }) => (
                    <div key={label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className={`font-bold uppercase tracking-wider ${text}`}>{label}</span>
                        <span className="text-white/30">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${color}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Voting Period Ends</p>
                    <p className="font-mono text-sm text-white/70">{proposal.expiresAt}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg text-green-400 group-hover:bg-green-400 group-hover:text-black transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showNewProposalForm && (
        <NewProposalForm
          onClose={() => setShowNewProposalForm(false)}
          onSubmit={handleNewProposal}
          submitError={submitError}
        />
      )}
    </div>
  );
};

export default Proposals;
