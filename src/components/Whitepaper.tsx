'use client';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Shield, Zap, Users, TrendingUp, Lock, Flame, ChevronDown, ChevronUp, ArrowRight, AlertTriangle, Lightbulb, Coins, DollarSign } from 'lucide-react';

const Whitepaper = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Token Distribution Data - Re-launch Plan
  const tokenDistribution = [
    { name: 'Pump.fun Liquidity', value: 55, color: '#3b82f6' },
    { name: 'Community Holders', value: 35, color: '#8b5cf6' },
    { name: 'DAO Treasury', value: 10, color: '#10b981' }
  ];

  // Fee Allocation Data - Post Platform Launch
  const feeAllocation = {
    treasury: 50,
    buyback: 30,
    staking: 20
  };

  // Revenue Projections
  const revenueProjections = [
    { month: 'M1', conservative: 100, base: 300, bull: 800 },
    { month: 'M2', conservative: 180, base: 550, bull: 1500 },
    { month: 'M3', conservative: 250, base: 850, bull: 2400 },
    { month: 'M6', conservative: 400, base: 1200, bull: 3800 },
    { month: 'M9', conservative: 500, base: 1600, bull: 5200 },
    { month: 'M12', conservative: 600, base: 2000, bull: 6800 }
  ];

  // Voting Power Decay
  const votingPowerData = [
    { tokens: 10000, power: 10000, multiplier: '1.0x' },
    { tokens: 50000, power: 42000, multiplier: '0.84x' },
    { tokens: 100000, power: 72000, multiplier: '0.72x' },
    { tokens: 200000, power: 132000, multiplier: '0.66x' },
    { tokens: 500000, power: 252000, multiplier: '0.50x' },
    { tokens: 1000000, power: 352000, multiplier: '0.35x' }
  ];

  // Roadmap Data - Re-launch Plan
  const roadmapPhases = [
    {
      phase: 'Week 1-2',
      title: 'Re-Launch & Foundation',
      period: 'November 2025',
      items: ['ROOTS re-launch announcement', 'DAO treasury acquisition (100M ROOTS)', 'Token locking contract deployment', 'Governance website launch']
    },
    {
      phase: 'Month 2-3',
      title: 'Governance Activation',
      period: 'Dec 2025 - Jan 2026',
      items: ['Full voting dApp launch', 'First governance proposals', 'Security audit completion', 'First development team distribution (3.33M ROOTS)']
    },
    {
      phase: 'Month 4-6',
      title: 'Credit Union Expansion',
      period: 'Feb - Apr 2026',
      items: ['First community-approved meme launches', 'Revenue generation begins', 'Reputation system deployment', 'Second development team distribution (3.33M ROOTS)']
    },
    {
      phase: 'Month 7-9',
      title: 'Full Decentralization',
      period: 'May - Jul 2026',
      items: ['Complete PDA treasury control', 'Advanced governance features', 'Final development team distribution (3.34M ROOTS)']
    },
    {
      phase: 'Month 10+',
      title: 'Ecosystem Growth',
      period: 'Aug 2026+',
      items: ['Multi-chain exploration', 'RootsDAO Launchpad development', 'Strategic partnerships']
    }
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="inline-block mb-6 px-6 py-2 glass-effect rounded-full">
            <span className="text-gray-300 font-semibold">The Democratized Meme Credit Union • Whitepaper v1.0</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white">
            RootsDAO
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The First Democratized Meme Credit Union on Solana
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg">
              <Flame className="text-gray-400" size={20} />
              <span className="text-gray-300">Deflationary Voting</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg">
              <Shield className="text-gray-400" size={20} />
              <span className="text-gray-300">Anti-Whale Protection</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg">
              <Zap className="text-gray-400" size={20} />
              <span className="text-gray-300">Powered by Pump.fun</span>
            </div>
          </div>

          {/* Ecosystem Cycle Visualization */}
          <div className="max-w-4xl mx-auto glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6">The RootsDAO Ecosystem Cycle</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-effect-subtle p-6 rounded-xl">
                <Lock className="h-8 w-8 text-gray-400 mb-3" />
                <h4 className="font-semibold mb-2 text-white">Lock Tokens</h4>
                <p className="text-sm text-gray-400">Users lock ROOTS to access governance</p>
              </div>
              <div className="glass-effect-subtle p-6 rounded-xl">
                <Lightbulb className="h-8 w-8 text-gray-400 mb-3" />
                <h4 className="font-semibold mb-2 text-white">Propose Memes</h4>
                <p className="text-sm text-gray-400">Community submits viral meme ideas</p>
              </div>
              <div className="glass-effect-subtle p-6 rounded-xl">
                <Flame className="h-8 w-8 text-gray-400 mb-3" />
                <h4 className="font-semibold mb-2 text-white">Burn to Vote</h4>
                <p className="text-sm text-gray-400">Tokens burned to cast votes on proposals</p>
              </div>
              <div className="glass-effect-subtle p-6 rounded-xl">
                <DollarSign className="h-8 w-8 text-gray-400 mb-3" />
                <h4 className="font-semibold mb-2 text-white">Value Returns</h4>
                <p className="text-sm text-gray-400">Creator fees fund treasury and buybacks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="glass-effect rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gray-400 rounded"></div>
            Abstract
          </h2>
          <p className="text-lg text-gray-100 leading-relaxed">
            RootsDAO is a decentralized autonomous organization designed to become the premier democratized meme credit union for community-driven meme tokens on Solana. By leveraging a unique two-tiered governance model—token locking for access rights and token burning for voting power—RootsDAO creates a deflationary ecosystem where value accrues to holders through supply reduction and revenue generation. The DAO curates and launches meme tokens via Pump.fun, capturing creator fees that fund both community-voted projects and systematic token buybacks. With anti-whale protections, spam prevention mechanisms, and transparent on-chain governance, RootsDAO empowers its community to democratically select the next generation of viral crypto assets while ensuring sustainable economics and decentralized control.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="glass-effect rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div>1. Introduction: The Meme Ecosystem Problem</div>
            <div>2. The ROOTS Token & Governance</div>
            <div>3. Tokenomics & Revenue Model</div>
            <div>4. Economic Security & Attack Mitigation</div>
            <div>5. The Re-Launch: Rising from the Roots</div>
            <div>6. Technology & Roadmap</div>
            <div>7. Risk Disclosures</div>
            <div>8. Conclusion: Building the Democratized Meme Credit Union</div>
          </div>
        </div>
      </div>

      {/* Section 1: Introduction */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-purple-400 to-pink-400 rounded"></div>
          1. The Meme Ecosystem Problem
        </h2>
        
        <div className="space-y-6 text-lg text-gray-100">
          <p>
            The meme coin space represents one of crypto's most vibrant yet problematic sectors. While meme tokens have created billions in market value and passionate communities, they suffer from fundamental structural issues:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 my-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <AlertTriangle className="text-gray-400 mb-3" size={32} />
              <h4 className="font-semibold mb-2">Centralized Control</h4>
              <p className="text-sm text-gray-200">Founders often hold overwhelming supply, leading to rug pulls and exit scams</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <AlertTriangle className="text-gray-400 mb-3" size={32} />
              <h4 className="font-semibold mb-2">No Sustainability</h4>
              <p className="text-sm text-gray-200">Lack of utility creates pump-and-dump dynamics with inevitable collapse</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <AlertTriangle className="text-gray-400 mb-3" size={32} />
              <h4 className="font-semibold mb-2">Zero Incubation</h4>
              <p className="text-sm text-gray-200">Great ideas lack structured funding, marketing, and community support</p>
            </div>
          </div>

          <p>
            <strong className="text-gray-300">RootsDAO solves this by creating a transparent, democratic, and economically sustainable credit union where the community itself makes collective investment decisions.</strong> Rather than trusting individual developers, token holders collectively decide which memes deserve funding, with built-in incentives that align long-term value creation with holder interests.
          </p>
        </div>
      </div>

      {/* Section 2: Token & Governance */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-blue-400 to-purple-400 rounded"></div>
          2. The ROOTS Token & Governance
        </h2>

        <div className="space-y-8">
          {/* Token Basics */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Token Specifications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-200 mb-2"><strong>Blockchain:</strong> Solana</p>
                <p className="text-gray-200 mb-2"><strong>Total Supply:</strong> 1,000,000,000 ROOTS</p>
                <p className="text-gray-200 mb-2"><strong>Token Type:</strong> SPL Token (via Pump.fun)</p>
                <p className="text-gray-200"><strong>Re-Launch Mechanism:</strong> Fair re-launch via Pump.fun with DAO treasury acquisition</p>
              </div>
              <div>
                <p className="text-gray-200 mb-2"><strong>Core Utilities:</strong></p>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Governance access via locking</li>
                  <li>Voting power via burning</li>
                  <li>Value accrual from deflation</li>
                  <li>Revenue share participation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Token Distribution Chart */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Token Distribution</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tokenDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tokenDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-4">
                {tokenDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: item.color}}></div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-300">{item.value}% ({item.value === 55 ? '550M' : item.value === 35 ? '350M' : '100M'} ROOTS)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Governance Mechanics */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Two-Tiered Governance Model</h3>
            
            <div className="space-y-6">
              <div className="glass-effect-subtle rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-gray-400" size={24} />
                  <h4 className="text-xl font-semibold">Tier 1: Access Rights (Locking)</h4>
                </div>
                <p className="text-gray-200 mb-4">
                  Lock tokens to gain access to governance features. Locked tokens remain in your ownership and can be retrieved after the lock period expires.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <div className="font-semibold mb-2">Vote on Proposals</div>
                    <div className="text-2xl font-bold text-gray-300">5,000 ROOTS</div>
                    <div className="text-sm text-gray-300 mt-1">Lock at least 1 week before vote and for more than 30 days</div>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <div className="font-semibold mb-2">Submit Proposals</div>
                    <div className="text-2xl font-bold text-gray-300">10,000 ROOTS</div>
                    <div className="text-sm text-gray-300 mt-1">Lock at least 1 week before submission and for more than 30 days</div>
                  </div>
                </div>
              </div>

              <div className="glass-effect-subtle rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="text-gray-400" size={24} />
                  <h4 className="text-xl font-semibold">Tier 2: Voting Power (Burning)</h4>
                </div>
                <p className="text-gray-200 mb-4">
                  Cast votes by burning ROOTS tokens from your unlocked balance. Burned tokens are permanently removed from circulation.
                </p>
                <div className="bg-pink-500/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-gray-300 mb-2">1 ROOTS = 1 Vote</div>
                  <div className="text-sm text-gray-200">No maximum limit • Subject to whale protection decay • Burns create deflation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Governance Example */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Example: Alice's Governance Journey</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <div className="font-semibold mb-1">Initial Holdings</div>
                  <div className="text-gray-200">Alice holds 50,000 ROOTS tokens</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <div className="font-semibold mb-1">Locks for Voting Access</div>
                  <div className="text-gray-200">Locks 5,000 ROOTS for at least 1 week before vote and for more than 30 days → Can now vote on proposals</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <div className="font-semibold mb-1">Votes on Proposal #1</div>
                  <div className="text-gray-200">Burns 2,000 ROOTS from unlocked balance → Casts 2,000 votes FOR</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <div>
                  <div className="font-semibold mb-1">Final Balance</div>
                  <div className="text-gray-200">Locked: 5,000 ROOTS (retrievable) • Unlocked: 43,000 ROOTS • Burned: 2,000 ROOTS (permanent)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Tokenomics - Continued */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-green-400 to-blue-400 rounded"></div>
          3. Tokenomics & Revenue Model
        </h2>

        <div className="space-y-8">
          {/* Revenue Source */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Pump.fun Dynamic Creator Fees</h3>
            <p className="text-gray-200 mb-6">
              RootsDAO leverages Pump.fun's dynamic creator fee structure, where token creators earn trading fees based on market capitalization. As the DAO launches community-approved meme tokens, it captures substantial revenue:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-500/20 p-5 rounded-lg border border-green-400/30">
                <div className="text-3xl font-bold text-gray-300 mb-2">0.95%</div>
                <div className="text-sm font-semibold mb-1">Early Stage</div>
                <div className="text-xs text-gray-300">Market cap &lt; $300K</div>
              </div>
              <div className="bg-blue-500/20 p-5 rounded-lg border border-blue-400/30">
                <div className="text-3xl font-bold text-gray-300 mb-2">0.5-0.7%</div>
                <div className="text-sm font-semibold mb-1">Growth Stage</div>
                <div className="text-xs text-gray-300">$300K - $1M</div>
              </div>
              <div className="bg-purple-500/20 p-5 rounded-lg border border-purple-400/30">
                <div className="text-3xl font-bold text-gray-300 mb-2">Scaled</div>
                <div className="text-sm font-semibold mb-1">Maturity</div>
                <div className="text-xs text-gray-300">$1M - $20M</div>
              </div>
              <div className="bg-pink-500/20 p-5 rounded-lg border border-pink-400/30">
                <div className="text-3xl font-bold text-gray-300 mb-2">0.05%</div>
                <div className="text-sm font-semibold mb-1">Mega Cap</div>
                <div className="text-xs text-gray-300">&gt; $20M (massive volume)</div>
              </div>
            </div>

            <div className="mt-6 glass-effect-subtle p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Zap size={20} />
                <span className="font-semibold">Additional Revenue</span>
              </div>
              <ul className="text-gray-200 space-y-1 text-sm">
                <li>• 0.5 SOL graduation bonus per token reaching bonding curve completion</li>
                <li>• Zero deployment costs (economic efficiency)</li>
                <li>• Highest revenue during early-stage high-volume trading</li>
              </ul>
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Revenue Projections (First Year)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueProjections}>
                <defs>
                  <linearGradient id="colorBull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#a78bfa" />
                <YAxis stroke="#a78bfa" />
                <Tooltip contentStyle={{backgroundColor: '#1e1b4b', border: '1px solid #4c1d95', borderRadius: '8px'}} />
                <Legend />
                <Area type="monotone" dataKey="bull" stroke="#10b981" fillOpacity={1} fill="url(#colorBull)" name="Bull Case" />
                <Area type="monotone" dataKey="base" stroke="#06b6d4" fillOpacity={1} fill="url(#colorBase)" name="Base Case" />
                <Area type="monotone" dataKey="conservative" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCons)" name="Conservative" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-purple-500/20 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Conservative (5 launches/mo)</div>
                <div className="text-2xl font-bold">$3.2M - $5.8M</div>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Base Case (10 launches/mo)</div>
                <div className="text-2xl font-bold">$8.5M - $15M</div>
              </div>
              <div className="bg-green-500/20 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-1">Bull Case (15 launches/mo)</div>
                <div className="text-2xl font-bold">$25M - $40M</div>
              </div>
            </div>
          </div>

          {/* Fee Allocation */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Fee Allocation Strategy</h3>
            <p className="text-gray-200 mb-6">
              Revenue from creator fees is allocated to support the DAO ecosystem post platform launch:
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{name: 'Allocation', ...feeAllocation}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#a78bfa" />
                <YAxis stroke="#a78bfa" />
                <Tooltip contentStyle={{backgroundColor: '#1e1b4b', border: '1px solid #4c1d95', borderRadius: '8px'}} />
                <Legend />
                <Bar dataKey="treasury" fill="#10b981" name="DAO Treasury (50%)" />
                <Bar dataKey="buyback" fill="#8b5cf6" name="Buyback & Burn (30%)" />
                <Bar dataKey="staking" fill="#f59e0b" name="Staking Rewards (20%)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                <div className="font-semibold mb-2">Post Platform Launch Allocation</div>
                <div className="text-sm text-gray-200">50% Treasury • 30% Buyback & Burn • 20% Staking Rewards</div>
                <p className="text-xs text-gray-400 mt-2">Treasury funds DAO operations and community initiatives. Buyback supports market and liquidity. Staking rewards are distributed to token holders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Economic Security */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-red-400 to-orange-400 rounded"></div>
          4. Economic Security & Attack Mitigation
        </h2>

        <div className="space-y-8">
          <p className="text-lg text-gray-100">
            Decentralized governance is only valuable if it remains decentralized, fair, and resistant to manipulation. RootsDAO implements multiple defense layers against common attack vectors:
          </p>

          {/* Whale Protection */}
          <div className="glass-effect rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-gray-400" size={32} />
              <h3 className="text-2xl font-semibold">Attack Vector 1: Whale Domination</h3>
            </div>
            
            <div className="glass-effect-subtle p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-lg mb-3 text-gray-300">Progressive Vote Decay</h4>
              <p className="text-gray-200 mb-4">
                Voting power diminishes with concentration. Large token burns receive progressively lower vote multipliers:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="bg-green-500/20 p-3 rounded text-center">
                  <div className="font-bold text-gray-300">1.0x</div>
                  <div className="text-xs text-gray-300">First 10K tokens</div>
                </div>
                <div className="bg-blue-500/20 p-3 rounded text-center">
                  <div className="font-bold text-gray-300">0.8x</div>
                  <div className="text-xs text-gray-300">10K-50K</div>
                </div>
                <div className="bg-purple-500/20 p-3 rounded text-center">
                  <div className="font-bold text-gray-300">0.6x</div>
                  <div className="text-xs text-gray-300">50K-200K</div>
                </div>
                <div className="bg-pink-500/20 p-3 rounded text-center">
                  <div className="font-bold text-gray-300">0.4x</div>
                  <div className="text-xs text-gray-300">200K-500K</div>
                </div>
                <div className="bg-red-500/20 p-3 rounded text-center">
                  <div className="font-bold text-gray-300">0.2x</div>
                  <div className="text-xs text-gray-300">500K+</div>
                </div>
              </div>
            </div>

            <div className="glass-effect-subtle rounded-lg p-8">
              <h4 className="font-semibold mb-4">Voting Power Decay Curve</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={votingPowerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="tokens" 
                    stroke="#a78bfa"
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <YAxis stroke="#a78bfa" tickFormatter={(value) => `${value/1000}K`} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e1b4b', border: '1px solid #4c1d95', borderRadius: '8px'}}
                    formatter={(value, name) => {
                      if (name === 'power') return [`${value.toLocaleString()} votes`, 'Effective Voting Power'];
                      return value;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="tokens" stroke="#06b6d4" name="Tokens Burned" strokeWidth={2} />
                  <Line type="monotone" dataKey="power" stroke="#8b5cf6" name="Effective Votes" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-200 text-center">
                Example: Burning 1M tokens yields only 352K effective votes (35% efficiency)
              </div>
            </div>
          </div>

          {/* Proposal Spam Protection */}
          <div className="glass-effect rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-gray-400" size={32} />
              <h3 className="text-2xl font-semibold">Attack Vector 2: Proposal Spam</h3>
            </div>
            
            <div className="space-y-4">
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-3">Proposal Bond System</h4>
                <p className="text-gray-200 mb-3">Submitting a proposal requires:</p>
                <ul className="space-y-2 text-gray-200">
                  <li>• Locking 10,000 ROOTS (at least 1 week before and for more than 30 days)</li>
                  <li>• Depositing 500 ROOTS Proposal Bond</li>
                  <li>• Bond returned if proposal gets ≥10% participation</li>
                  <li>• Bond BURNED if participation &lt;10%</li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-effect-subtle p-5 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-300">Rate Limiting</h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li>• Max 3 active proposals per wallet</li>
                    <li>• Max 10 proposals per 30 days</li>
                    <li>• 72-hour cooldown after failed proposal</li>
                    <li>• 7-day cooldown after 3 consecutive failures</li>
                  </ul>
                </div>
                <div className="glass-effect-subtle p-5 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-300">Reputation System</h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li>• Green Badge: Reduced bond (250 ROOTS)</li>
                    <li>• Yellow Badge: Standard bond (500 ROOTS)</li>
                    <li>• Red Badge: Increased bond (1,000 ROOTS)</li>
                    <li>• Track record affects proposal costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sybil Attack Protection */}
          <div className="glass-effect rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-gray-400" size={32} />
              <h3 className="text-2xl font-semibold">Attack Vector 3: Sybil Attacks</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-200">
                Creating multiple wallets to bypass whale detection is economically irrational due to per-wallet locking requirements:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 p-5 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold mb-3 text-gray-300">Legitimate Single Wallet</h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li>• Lock: 5,000 ROOTS</li>
                    <li>• Vote: Burn X tokens</li>
                    <li>• Gas: ~0.01 SOL per transaction</li>
                    <li>• Complexity: Simple</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 p-5 rounded-lg border border-red-500/30">
                  <h4 className="font-semibold mb-3 text-gray-300">Sybil Attack (50 wallets)</h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    <li>• Lock: 250,000 ROOTS (50x capital)</li>
                    <li>• Vote: Burn X tokens + 50x gas</li>
                    <li>• Gas: ~0.5 SOL total</li>
                    <li>• Complexity: Unmanageable</li>
                  </ul>
                </div>
              </div>

              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-3">Automated Detection</h4>
                <p className="text-sm text-gray-200 mb-3">The governance dApp flags suspicious patterns:</p>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>• Multiple wallets voting identically</div>
                  <div>• Wallets created in same block</div>
                  <div>• Identical token amounts locked</div>
                  <div>• Voting within 1 second of each other</div>
                </div>
              </div>
            </div>
          </div>

          {/* Oracle & Virality */}
          <div className="glass-effect rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-gray-400" size={32} />
              <h3 className="text-2xl font-semibold">Attack Vector 4: Meme Virality Verification</h3>
            </div>
            
            <div className="space-y-4">
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-3">Three-Phase Approach</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 rounded px-3 py-1 text-sm font-bold">Phase 1</div>
                    <div>
                      <div className="font-semibold">Pure Community Curation (Months 1-6)</div>
                      <div className="text-sm text-gray-200">No oracles, full subjectivity. Learning phase to understand success patterns.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded px-3 py-1 text-sm font-bold">Phase 2</div>
                    <div>
                      <div className="font-semibold">Reputation-Weighted Voting (Months 7-12)</div>
                      <div className="text-sm text-gray-200">Track record matters. Successful curators earn voting multipliers.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded px-3 py-1 text-sm font-bold">Phase 3</div>
                    <div>
                      <div className="font-semibold">Oracle Integration (Month 13+)</div>
                      <div className="text-sm text-gray-200">Objective metrics from multiple data sources with community override capability.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-3">Future Oracle Metrics (Phase 3)</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-200">
                  <div>• Twitter/X engagement & impressions</div>
                  <div>• Google Trends search volume</div>
                  <div>• Discord/Telegram growth rate</div>
                  <div>• Reddit mentions and upvotes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Defense Summary */}
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Defense-in-Depth Summary</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Progressive vote decay prevents whale control</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Proposal bonds eliminate spam</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Economic barriers stop Sybil attacks</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Reputation system rewards quality</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Supermajorities for critical changes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Transparent monitoring dashboards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: The Re-Launch */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-pink-400 to-purple-400 rounded"></div>
          5. The Re-Launch: Rising from the Roots
        </h2>

        <div className="space-y-8">
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-4">The Story</h3>
            <p className="text-gray-100 text-lg leading-relaxed">
              RootsDAO represents the rebirth of the Roots community. When the original developer departed, the community refused to let the project die. This re-launch transforms Roots into a true democratized meme credit union where the community—not a single developer—controls the future.
            </p>
          </div>

          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Why Re-Launch?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-300">Community Ownership</h4>
                <p className="text-sm text-gray-200">Transfer control from individual to collective</p>
              </div>
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-300">Sustainable Model</h4>
                <p className="text-sm text-gray-200">Revenue generation through meme token launches</p>
              </div>
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-300">True Decentralization</h4>
                <p className="text-sm text-gray-200">Democratic governance with anti-whale protections</p>
              </div>
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-300">Proven Community</h4>
                <p className="text-sm text-gray-200">Loyal holders who stayed through adversity</p>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Development Team Allocation</h3>
            <p className="text-gray-200 mb-4">
              To facilitate platform creation, the development team will receive <strong>10% of treasury holdings (10M ROOTS)</strong> distributed over 9 months in 3 separate transactions:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-500/20 p-5 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold mb-2 text-gray-300">Month 3</h4>
                <div className="text-2xl font-bold text-gray-200">3.33M ROOTS</div>
                <div className="text-sm text-gray-300 mt-1">33.3% of development allocation</div>
              </div>
              <div className="bg-purple-500/20 p-5 rounded-lg border border-purple-400/30">
                <h4 className="font-semibold mb-2 text-gray-300">Month 6</h4>
                <div className="text-2xl font-bold text-gray-200">3.33M ROOTS</div>
                <div className="text-sm text-gray-300 mt-1">33.3% of development allocation</div>
              </div>
              <div className="bg-green-500/20 p-5 rounded-lg border border-green-400/30">
                <h4 className="font-semibold mb-2 text-gray-300">Month 9</h4>
                <div className="text-2xl font-bold text-gray-200">3.34M ROOTS</div>
                <div className="text-sm text-gray-300 mt-1">33.4% of development allocation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Technology & Roadmap */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-cyan-400 to-blue-400 rounded"></div>
          6. Technology & Roadmap
        </h2>

        <div className="space-y-8">
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Technical Architecture</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-3">Smart Contracts</h4>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>• ROOTS SPL Token (via Pump.fun)</li>
                  <li>• Token Locking Contract (Anchor framework)</li>
                  <li>• Voting & Proposal System</li>
                  <li>• PDA Treasury Management</li>
                  <li>• Fee Distribution Contract</li>
                </ul>
              </div>
              <div className="glass-effect-subtle p-5 rounded-lg">
                <h4 className="font-semibold mb-3">Front-End dApp</h4>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>• Wallet integration (Phantom, Solflare)</li>
                  <li>• Proposal browsing & creation UI</li>
                  <li>• Voting interface with burn confirmation</li>
                  <li>• Token locking dashboard</li>
                  <li>• Treasury transparency display</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Development Roadmap</h3>
            {roadmapPhases.map((phase, idx) => (
              <div key={idx} className="glass-effect-subtle rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg px-4 py-2 font-bold text-white">
                    {phase.phase}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{phase.title}</h4>
                    <p className="text-sm text-gray-400">{phase.period}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {phase.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-2 text-gray-200">
                      <ArrowRight className="text-gray-400" size={16} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 7: Risk Disclosures */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-red-400 to-pink-400 rounded"></div>
          7. Risk Disclosures
        </h2>

        <div className="glass-effect rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="text-gray-400 flex-shrink-0" size={32} />
            <div>
              <h3 className="text-2xl font-semibold mb-3">Important Notice</h3>
              <p className="text-gray-200">
                Participation in RootsDAO involves significant risks. This section outlines key risk factors that all participants should understand before acquiring or using ROOTS tokens.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-effect-subtle p-5 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-300">Platform Dependency Risk</h4>
              <p className="text-sm text-gray-200">
                RootsDAO's revenue model depends entirely on Pump.fun's continued operation and fee structure. Pump.fun may reduce/eliminate creator fees, shut down, or restrict DAO-created tokens at any time.
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-300">Smart Contract Risk</h4>
              <p className="text-sm text-gray-200">
                Locking, voting, and treasury contracts may contain vulnerabilities despite audit efforts. Bugs could result in permanent loss of funds.
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-300">Regulatory Uncertainty</h4>
              <p className="text-sm text-gray-200">
                DAO tokens may be classified as securities in certain jurisdictions. Regulatory action could impact ROOTS's legal status, trading, or usability.
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-300">Market Volatility</h4>
              <p className="text-sm text-gray-200">
                ROOTS is a speculative asset with no guaranteed value. Token price may experience extreme volatility. Meme tokens historically suffer high failure rates.
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-300">Governance Risk</h4>
              <p className="text-sm text-gray-200">
                Despite anti-whale protections, concentrated token holdings could enable governance attacks. Community decisions may not align with individual holder interests.
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-300">Tax & Legal Obligations</h4>
              <p className="text-sm text-gray-200">
                Participants are solely responsible for determining tax treatment of ROOTS transactions, burns, and governance participation. No tax or legal advice is provided by the DAO.
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-300">No Guarantees</h4>
              <p className="text-sm text-gray-200">
                ROOTS tokens carry no rights, guarantees, or expectations of profit. The roadmap is subject to change. Treasury management decisions are determined by governance votes, not any central authority.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-600/20 rounded-lg border border-red-500/50">
            <p className="text-center font-semibold text-gray-200">
              ⚠️ Only participate with funds you can afford to lose entirely. This is experimental DeFi technology.
            </p>
          </div>
        </div>
      </div>

      {/* Section 8: Conclusion */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="w-3 h-10 bg-gray-purple-400 to-pink-400 rounded"></div>
          8. Conclusion: Building the Democratized Meme Credit Union
        </h2>

        <div className="space-y-8">
          <div className="text-lg text-gray-100 leading-relaxed space-y-4">
            <p>
              RootsDAO represents a paradigm shift in how meme tokens are created, curated, and sustained. By combining deflationary tokenomics with democratic governance and sustainable revenue generation, we've built a credit union where creativity meets collective accountability.
            </p>

            <p>
              <strong className="text-gray-300">We are not launching another meme coin—we are re-launching a community-owned democratized credit union where members collectively invest in meme culture.</strong> Every ROOTS holder becomes a member, every vote shapes the future, and every token burn increases the value of what remains.
            </p>

            <p>
              The problems plaguing the meme coin space—rug pulls, centralization, unsustainable pump-and-dump dynamics—are not inevitable. They stem from poor incentive design and lack of community ownership. RootsDAO solves these problems through:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-400/30">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Flame className="text-gray-400" />
                Economic Sustainability
              </h4>
              <p className="text-gray-200 text-sm">
                Pump.fun creator fees provide continuous revenue, funding both treasury operations and systematic token buybacks. Value accrues to holders through deflation and revenue sharing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-400/30">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="text-gray-400" />
                True Decentralization
              </h4>
              <p className="text-gray-200 text-sm">
                Progressive vote decay prevents whale dominance. Multi-layered attack defenses ensure fair governance. No central authority can override community decisions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users className="text-gray-400" />
                Community First
              </h4>
              <p className="text-gray-200 text-sm">
                Community-first re-launch demonstrates commitment to the community. Reputation systems reward quality curation. Every participant has skin in the game.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-6 rounded-xl border border-pink-400/30">
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="text-gray-400" />
                Aligned Incentives
              </h4>
              <p className="text-gray-200 text-sm">
                Proposal bonds eliminate spam. Vote burning creates deflation. Success of launched tokens directly benefits the treasury. Everyone wins when quality memes succeed.
              </p>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4 purple-400 via-pink-400 to-blue-400 text-white">
              Join Us in Building the Future of Meme Culture
            </h3>
            <p className="text-xl text-gray-200 mb-6">
              RootsDAO is more than a token—it's a movement to democratize meme token creation and reward those who stayed loyal through the original project's challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-purple-500/30 rounded-lg border border-purple-400/50">
                <div className="text-2xl font-bold">100M</div>
                <div className="text-sm text-gray-300">Treasury Allocation</div>
              </div>
              <div className="px-6 py-3 bg-blue-500/30 rounded-lg border border-blue-400/50">
                <div className="text-2xl font-bold">10%</div>
                <div className="text-sm text-gray-300">DAO Treasury</div>
              </div>
              <div className="px-6 py-3 bg-green-500/30 rounded-lg border border-green-400/50">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-gray-300">Transparent</div>
              </div>
            </div>
          </div>

          <div className="glass-effect-strong rounded-xl p-8 text-center">
            <p className="text-2xl font-bold mb-2">You stayed when others left.</p>
            <p className="text-xl text-gray-200 mb-4">You believed in the community when the developer didn't.</p>
            <p className="text-lg text-gray-300">
              This is your DAO. Let's root for the future together.
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Disclaimer */}
      <div className="max-w-6xl mx-auto px-6 py-12 border-t border-white/10">
        <div className="glass-effect rounded-xl p-8">
          <h3 className="text-xl font-bold mb-4">Legal Disclaimer</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              This whitepaper is for informational purposes only and does not constitute financial, investment, legal, or tax advice. ROOTS tokens are utility tokens for governance purposes and do not represent equity, securities, or investment contracts.
            </p>
            <p>
              Participation in RootsDAO involves significant risks, including the potential loss of all invested capital. The cryptocurrency market is highly volatile and unpredictable. Users should conduct their own research and only participate with funds they are prepared to lose entirely.
            </p>
            <p>
              The roadmap, tokenomics, and technical specifications outlined in this document are subject to change based on community governance decisions, technical constraints, regulatory requirements, or market conditions. No guarantees are made regarding the implementation of any features or timeline adherence.
            </p>
            <p>
              RootsDAO operates as an unincorporated association without formal legal entity status. No individual or organization assumes liability for DAO operations, smart contract failures, or governance outcomes. Participants interact with smart contracts at their own risk.
            </p>
            <p>
              This whitepaper does not constitute an offer to sell or solicitation to buy ROOTS tokens in any jurisdiction where such offer or solicitation would be unlawful. Potential participants should consult with legal and tax professionals regarding their specific circumstances.
            </p>
            <p className="font-semibold text-gray-200 mt-4">
              By participating in RootsDAO, you acknowledge that you have read, understood, and accepted all risks outlined in Section 7 of this whitepaper.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 space-y-2">
          <p className="text-lg font-semibold">RootsDAO</p>
          <p className="text-sm">The Democratized Meme Credit Union • Whitepaper v1.0</p>
          <p className="text-sm">Built on Solana • Powered by Members</p>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <a href="https://www.rootsdao.com" className="hover:text-gray-200 transition-colors">Website</a>
            <span className="text-gray-600">|</span>
            <span className="hover:text-gray-200 transition-colors cursor-pointer">Twitter</span>
            <span className="text-gray-600">|</span>
            <span className="hover:text-gray-200 transition-colors cursor-pointer">Discord</span>
            <span className="text-gray-600">|</span>
            <span className="hover:text-gray-200 transition-colors cursor-pointer">Telegram</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </div>
  );
};

export default Whitepaper;