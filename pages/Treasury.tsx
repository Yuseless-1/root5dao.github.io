
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTreasury, formatUsd, TreasuryData } from '../services/treasuryService';

const SQUADS_URL = 'https://app.squads.so/squads/7qcxTk4kGdiGUxD7T59tQygJToe4rC4F7GyTTyYYyPMK/treasury';

function truncate(addr: string, chars = 6): string {
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}

const Treasury: React.FC = () => {
  const [data, setData]       = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    fetchTreasury().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const copyVault = () => {
    if (!data?.vault) return;
    navigator.clipboard.writeText(data.vault).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const totalValueUsd = data?.totalValueUsd ?? 0;
  const assets        = data?.assets ?? [];

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <header>
          <h1 className="text-5xl font-bold mb-3 tracking-tight">Treasury</h1>
          <div className="h-6 w-64 bg-white/5 rounded animate-pulse" />
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-10 rounded-[40px] border border-white/5 h-64 animate-pulse" />
          <div className="glass p-10 rounded-[40px] border border-white/5 h-64 animate-pulse" />
        </div>
        <div className="glass rounded-[32px] border border-white/5 h-48 animate-pulse" />
      </div>
    );
  }

  // ── Error / empty state ────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-white/40 mb-4">Unable to load treasury data.</p>
        <a href={SQUADS_URL} target="_blank" rel="noreferrer"
           className="text-green-400 text-sm font-bold hover:underline">
          View on Squads →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold mb-3 tracking-tight">Treasury</h1>
          <p className="text-green-400 text-lg font-mono font-bold tracking-tighter">
            Total Assets: {formatUsd(totalValueUsd)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Vault address chip */}
          <button
            onClick={copyVault}
            title="Copy vault address"
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono hover:bg-white/10 transition-colors"
          >
            <span className="text-white/30">VAULT:</span>
            <span>{truncate(data.vault)}</span>
            <span className="text-white/30">{copied ? '✓' : '⎘'}</span>
          </button>
          {/* Squads link */}
          <a
            href={SQUADS_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono hover:bg-white/10 transition-colors"
          >
            <span className="text-white/30">View on</span>
            <span className="text-green-400 font-bold">Squads ↗</span>
          </a>
        </div>
      </header>

      {/* ── Pie + allocation ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Total value card */}
        <div className="lg:col-span-2 glass p-10 rounded-[40px] border border-white/5 flex flex-col justify-center">
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-4">Solana Treasury — Squads Multisig</p>
          <p className="text-7xl font-bold font-mono tracking-tighter mb-2">{formatUsd(totalValueUsd)}</p>
          <p className="text-white/30 text-sm font-mono">
            Last updated: {new Date(data.fetchedAt).toLocaleString()}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {assets.map(a => (
              <div key={a.mint ?? a.symbol} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg text-xs font-mono">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-white/70 font-bold">{a.symbol}</span>
                <span className="text-white/30">{formatUsd(a.valueUsd)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="glass p-10 rounded-[40px] border border-white/5 flex flex-col">
          <h2 className="text-2xl font-bold mb-8">Allocation</h2>
          {assets.length > 0 ? (
            <>
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assets}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="valueUsd"
                    >
                      {assets.map((a, i) => (
                        <Cell key={`cell-${i}`} fill={a.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                      formatter={(val: number) => [`${formatUsd(val)}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Total</p>
                    <p className="text-xl font-bold font-mono">{formatUsd(totalValueUsd)}</p>
                  </div>
                </div>
              </div>
              <div className="w-full mt-8 space-y-4">
                {assets.map(a => {
                  const pct = totalValueUsd > 0 ? (a.valueUsd / totalValueUsd) * 100 : 0;
                  return (
                    <div key={a.mint ?? a.symbol} className="flex items-center justify-between text-sm group">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                             style={{ backgroundColor: a.color, color: a.color }} />
                        <span className="font-bold text-white/70 group-hover:text-white transition-colors">{a.symbol}</span>
                      </div>
                      <span className="text-white/40 font-mono font-bold">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
              No assets found in vault
            </div>
          )}
        </div>
      </div>

      {/* ── Assets table ─────────────────────────────────────────────────────── */}
      {assets.length > 0 && (
        <div className="glass overflow-hidden rounded-[32px] border border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Asset</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Balance</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Price</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Value (USD)</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map(a => {
                const pct = totalValueUsd > 0 ? (a.valueUsd / totalValueUsd) * 100 : 0;
                return (
                  <tr key={a.mint ?? a.symbol} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border border-white/5 bg-white/[0.02]"
                             style={{ color: a.color }}>
                          {a.symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white/90 group-hover:text-white">{a.name}</div>
                          <div className="text-[10px] text-white/30 font-mono tracking-widest">{a.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-sm font-bold text-white/70">
                      {a.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </td>
                    <td className="px-8 py-6 font-mono text-sm font-bold text-white/70">
                      {a.usdPrice ? `$${a.usdPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}` : 'N/A'}
                    </td>
                    <td className="px-8 py-6 font-mono text-sm font-bold text-white/70">
                      {a.valueUsd > 0 ? formatUsd(a.valueUsd) : '—'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full transition-all duration-1000" style={{ backgroundColor: a.color, width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-mono font-bold text-white/30 w-10 text-right">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Treasury;
