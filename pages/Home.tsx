
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTreasury, formatUsd, TreasuryData } from '../services/treasuryService';

const Home: React.FC = () => {
  const [treasury, setTreasury] = useState<TreasuryData | null>(null);

  useEffect(() => {
    fetchTreasury().then(setTreasury);
  }, []);

  const totalValueUsd = treasury?.totalValueUsd ?? null;
  const assets        = treasury?.assets ?? [];
  // Top 3 assets for the allocation summary
  const topAssets     = assets.slice(0, 3);

  const tvlDisplay = totalValueUsd === null ? '—' : formatUsd(totalValueUsd);

  const stats = [
    { label: 'Total Value Locked', value: tvlDisplay, change: '' },
    { label: 'Active Proposals',   value: '14',       change: '' },
    { label: 'Total Voters',       value: '3,842',    change: '+124' },
    { label: 'Treasury Assets',    value: assets.length > 0 ? String(assets.length) : '—', change: '' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-3xl">
        <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest mb-6">
          Phase 1: Governance Mainnet
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
          Orchestrating <span className="gradient-text">Protocol Growth.</span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
          The hub for Root5's community. Govern modular liquidity infrastructure, manage the decentralized treasury, and steer the future of capital efficiency.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/proposals" className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-green-500/20 active:scale-95">
            Active Proposals
          </Link>
          <Link to="/updates" className="border border-white/10 hover:bg-white/5 px-8 py-4 rounded-xl font-bold transition-all active:scale-95">
            Ecosystem Updates
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-8 rounded-2xl border border-white/5 hover:border-green-500/20 transition-all">
            <p className="text-white/40 text-xs font-bold mb-2 uppercase tracking-[0.2em]">{stat.label}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold font-mono tracking-tight">{stat.value}</p>
              {stat.change && (
                <span className="text-green-400 text-xs font-bold bg-green-400/10 px-1.5 py-0.5 rounded">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold">Featured Proposals</h2>
            <Link to="/proposals" className="text-green-400 text-sm font-bold hover:underline">See All</Link>
          </div>
          {[1, 2, 3].map((id) => (
            <div key={id} className="glass group hover:border-green-500/40 p-8 rounded-3xl border border-white/5 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">Active</span>
                <span className="text-white/20 text-xs font-mono uppercase">Ends in 2 days</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                R5P-{id}: Implementation of dynamic liquidity rebalancing modules
              </h3>
              <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                This proposal introduces automated rebalancing strategies for core Root5 pools to maximize capital efficiency across various market cycles.
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-white/5 pb-4">Treasury Allocation</h2>
          <div className="glass p-8 rounded-[32px] border border-white/5">
            <div className="aspect-square relative flex items-center justify-center">
              <div className="w-full h-full rounded-full border-[20px] border-green-500/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold font-mono tracking-tighter">
                    {totalValueUsd === null ? '—' : formatUsd(totalValueUsd)}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Total Treasury</p>
                </div>
              </div>
              {/* Visual arcs */}
              <div className="absolute inset-0 border-[20px] border-transparent border-t-green-500 rounded-full rotate-[12deg]"></div>
              <div className="absolute inset-0 border-[20px] border-transparent border-r-cyan-500 rounded-full rotate-[45deg]"></div>
            </div>

            <div className="mt-10 space-y-4">
              {topAssets.length > 0 ? (
                topAssets.map(a => {
                  const pct = totalValueUsd && totalValueUsd > 0
                    ? ((a.valueUsd / totalValueUsd) * 100).toFixed(0) + '%'
                    : '—';
                  return (
                    <div key={a.mint ?? a.symbol} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="font-medium text-white/70">{a.symbol}</span>
                      </div>
                      <span className="font-mono text-white/40">{pct}</span>
                    </div>
                  );
                })
              ) : (
                // Placeholder rows while loading
                [['SOL', '#9945FF'], ['ROOT5', '#4ade80']].map(([sym, col]) => (
                  <div key={sym} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col as string }} />
                      <span className="font-medium text-white/70">{sym}</span>
                    </div>
                    <span className="font-mono text-white/20">—</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <Link to="/treasury" className="text-green-400 text-xs font-bold hover:underline">
                View full treasury →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
