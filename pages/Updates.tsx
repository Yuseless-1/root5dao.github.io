
import React from 'react';
import { DevUpdate } from '../types';

const UPDATES: DevUpdate[] = [
  {
    id: '1',
    title: 'Mainnet Alpha Launch v0.9',
    content: 'Root5 DAO core liquidity modules are now live on Ethereum Mainnet. This release deploys the initial vault orchestration suite and the R5 governance architecture.',
    date: 'March 15, 2024',
    tag: 'Core'
  },
  {
    id: '2',
    title: 'Advanced Governance Analytics',
    content: 'The frontend now provides real-time insights into treasury dynamics, vote distribution, and historical delegation patterns.',
    date: 'March 12, 2024',
    tag: 'UI'
  },
  {
    id: '3',
    title: 'OpenZeppelin Security Audit',
    content: 'Smart contracts have cleared their primary security audit. All critical paths are verified and findings resolved in v0.9.1.',
    date: 'March 05, 2024',
    tag: 'Security'
  },
  {
    id: '4',
    title: 'LayerZero Cross-chain Expansion',
    content: 'Testing for cross-chain liquidity deployment on Arbitrum and Base is underway, utilizing LayerZero for secure state messaging.',
    date: 'February 28, 2024',
    tag: 'Infrastructure'
  }
];

const Updates: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-20 animate-in fade-in duration-500">
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
           Live Development Feed
        </div>
        <h1 className="text-6xl font-bold tracking-tight">Root5 <span className="gradient-text">Changelog.</span></h1>
        <p className="text-white/40 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Tracking the evolution of modular liquidity and community governance.
        </p>
      </header>

      <div className="relative border-l-2 border-white/5 ml-4 md:ml-12 pl-12 md:pl-20 space-y-24">
        {UPDATES.map((update) => (
          <div key={update.id} className="relative group">
            {/* Timeline Node */}
            <div className="absolute -left-[61px] md:-left-[101px] top-0 w-12 h-12 rounded-2xl bg-[#030303] border border-white/10 group-hover:border-green-500/50 flex items-center justify-center transition-all group-hover:scale-110">
               <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div>
            </div>

            <div className="glass p-10 rounded-[40px] border border-white/5 hover:border-green-500/20 transition-all hover:translate-y-[-6px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <span className={`w-fit px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border ${
                  update.tag === 'Core' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  update.tag === 'UI' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                  update.tag === 'Security' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {update.tag}
                </span>
                <span className="text-white/20 text-xs font-mono font-bold tracking-widest">{update.date}</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-6 group-hover:text-green-400 transition-colors tracking-tight">{update.title}</h3>
              <p className="text-white/50 leading-relaxed text-lg font-medium">
                {update.content}
              </p>

              <div className="mt-10 pt-8 border-t border-white/5">
                <button className="text-sm font-bold text-green-400 hover:text-green-300 flex items-center gap-3 group/btn">
                  View Technical Specification
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-16 rounded-[60px] text-center space-y-10 border border-green-500/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">Stay synchronized.</h2>
          <p className="text-white/40 max-w-md mx-auto text-lg">Receive technical updates and governance digests directly to your inbox.</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="operator@root5dao.com" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-green-500 transition-colors font-mono"
            />
            <button className="bg-green-500 text-black font-bold px-10 py-5 rounded-2xl hover:bg-green-400 transition-all active:scale-95 shadow-lg shadow-green-500/20">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Updates;