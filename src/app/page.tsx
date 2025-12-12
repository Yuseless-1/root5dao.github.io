'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@/lib/wallet';
import { Vote, Users, Coins, Shield, Upload, Bolt, ChartLine, Github, Twitter, Video, Instagram, Radio, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useTelegramMembers } from '@/hooks/useTelegramMembers';
import { useTokenHolders } from '@/hooks/useTokenHolders';
import { useProposalCount } from '@/hooks/useProposalCount';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import PFPGeneratorSection from '@/components/PFPGeneratorSection';
import BuyRoot5 from '@/components/BuyRoot5';

export default function Home() {
  const { connected } = useWallet();
  const { memberCount, loading: telegramLoading } = useTelegramMembers();
  const { holderCount, loading: holdersLoading } = useTokenHolders();
  const { proposalCount, loading: proposalsLoading } = useProposalCount();
  const { priceData, loading: priceLoading } = useTokenPrice();

  const copyContract = () => {
    const contractAddress = "AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump";
    navigator.clipboard.writeText(contractAddress).then(() => {
      alert("Contract address copied to clipboard!");
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen relative">
        {/* Background SVG */}
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Main decorative SVG wave pattern */}
          <svg 
            className="absolute inset-0 w-full h-full opacity-15"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#00ff88', stopOpacity:0.4}} />
                <stop offset="50%" style={{stopColor:'#8a2be2', stopOpacity:0.3}} />
                <stop offset="100%" style={{stopColor:'#00ff88', stopOpacity:0.2}} />
              </linearGradient>
            </defs>
            <path 
              fill="url(#grad1)" 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <path 
              fill="url(#grad1)" 
              d="M0,192L48,197.3C96,203,192,213,288,224C384,235,480,245,576,245.3C672,245,768,235,864,213.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              opacity="0.5"
            />
          </svg>
          
          {/* Geometric pattern overlay */}
          <svg 
            className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 800"
          >
            <defs>
              <radialGradient id="grad2" cx="50%" cy="50%">
                <stop offset="0%" style={{stopColor:'#00ff88', stopOpacity:0.5}} />
                <stop offset="100%" style={{stopColor:'#8a2be2', stopOpacity:0}} />
              </radialGradient>
            </defs>
            <circle cx="400" cy="400" r="350" fill="url(#grad2)" />
            <circle cx="650" cy="200" r="250" fill="url(#grad2)" />
            <circle cx="150" cy="650" r="200" fill="url(#grad2)" />
          </svg>
          
          {/* Left side accent */}
          <svg 
            className="absolute top-0 left-0 w-1/3 h-full opacity-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 600"
          >
            <defs>
              <radialGradient id="grad3" cx="50%" cy="50%">
                <stop offset="0%" style={{stopColor:'#8a2be2', stopOpacity:0.4}} />
                <stop offset="100%" style={{stopColor:'#00ff88', stopOpacity:0}} />
              </radialGradient>
            </defs>
            <circle cx="300" cy="300" r="280" fill="url(#grad3)" />
          </svg>
        </div>
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                Root5DAO
              </h1>
              <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-300 mb-6">
                Vote on memes. Turn them into tokens.
              </div>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Community-driven meme tokenization on Solana. Submit, vote, and trade the memes that matter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {connected ? (
                <Link href="/vote" className="btn-primary text-base w-full sm:w-auto text-center">
                  Get Started
                </Link>
              ) : (
                <Link href="/verify" className="btn-primary text-base w-full sm:w-auto text-center">
                  Get Started
                </Link>
              )}
              <Link href="/proposals" className="btn-secondary text-base w-full sm:w-auto text-center">
                View Proposals
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-12">
              <div className="glass-effect rounded-lg p-4 sm:p-5 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 mb-1">
                  {telegramLoading ? '...' : memberCount.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Members</div>
              </div>
              <div className="glass-effect rounded-lg p-4 sm:p-5 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 mb-1">
                  {holdersLoading ? '...' : holderCount.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Token Holders</div>
              </div>
              <div className="glass-effect rounded-lg p-4 sm:p-5 text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 mb-1">
                  {proposalsLoading ? '...' : proposalCount.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Proposals</div>
              </div>
            </div>

            {/* Live Chart */}
            <div className="max-w-5xl mx-auto mt-8">
              <div className="glass-effect rounded-xl p-4 sm:p-6 overflow-hidden">
                <div id="dexscreener-embed">
                  <iframe
                    src="https://dexscreener.com/solana/BAsuCpi8M39Rs5cHbuoSTa78bPtcrJZy2ad6NJ2VWW6z?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
                    title="DexScreener Chart"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How It Works</h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">Simple process to turn memes into tokens</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-effect rounded-xl p-6 text-center">
                <div className="w-12 h-12 glass-effect-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Submit Memes</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Upload your favorite memes. Community decides what gets tokenized.
                </p>
              </div>
              
              <div className="glass-effect rounded-xl p-6 text-center">
                <div className="w-16 h-16 glass-effect-subtle rounded-full flex items-center justify-center mx-auto mb-4 p-3">
                  <img src="/layers/pfp_base.png" alt="Vote" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Vote</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Vote with tokens. 1 token = 1 vote. Tokens get burned when you vote.
                </p>
              </div>
              
              <div className="glass-effect rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Trade</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Winning memes become tokens on Pump.fun. Trade them like any other token.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Token Info Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <div className="glass-effect rounded-xl p-6 sm:p-8 card-hover">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <img
                      src="/Dogecoin-Logo-emblem-of-the-cryptocurrency-transparent-png-image-jpg-768x768.webp"
                      alt="Doge"
                      className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x100/00ff88/0a0a0a/png?text=Doge';
                      }}
                    />
                    <img
                      src="/Wojak_cropped.jpg"
                      alt="Wojak"
                      className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x100/8a2be2/0a0a0a/png?text=Wojak';
                      }}
                    />
                    <img
                      src="/images.jpeg"
                      alt="Pepe"
                      className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x100/ff6b6b/0a0a0a/png?text=Pepe';
                      }}
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-base sm:text-lg text-gray-400 font-semibold">Featured Memes</div>
                    <div className="text-sm text-gray-500 mt-1">Doge • Wojak • Pepe</div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2 lg:col-span-1">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Root5DAO Token</h2>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    Our governance token on Solana. Hold it to vote on memes and participate in the DAO.
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-4 card-hover">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">Contract Address</div>
                      <span className="font-mono text-xs sm:text-sm text-gray-300 break-all">
                        AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump
                      </span>
                    </div>
                    <button
                      onClick={copyContract}
                      className="btn-primary px-3 py-2 text-xs whitespace-nowrap"
                    >
                      Copy Address
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-effect rounded-lg p-3 text-center card-hover">
                    <div className="text-lg font-semibold text-gray-300 mb-1">
                      {priceLoading ? '...' : `$${priceData.price.toFixed(6)}`}
                    </div>
                    <div className="text-xs text-gray-400">Current Price</div>
                    {!priceLoading && priceData.priceChange24h !== 0 && (
                      <div className={`text-xs mt-1 ${
                        priceData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {priceData.priceChange24h >= 0 ? '+' : ''}
                        {priceData.priceChange24h.toFixed(2)}% (24h)
                      </div>
                    )}
                  </div>
                  <div className="glass-effect rounded-lg p-3 text-center card-hover">
                    <div className="text-lg font-semibold text-purple-400 mb-1">1B</div>
                    <div className="text-xs text-gray-400">Total Supply</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://pump.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-base w-full sm:w-auto text-center"
                  >
                    Trade on Pump.fun
                  </a>
                  <a
                    href="https://gmgn.ai/sol/token/AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-base w-full sm:w-auto text-center flex items-center justify-center gap-2"
                  >
                    <ChartLine className="h-4 w-4" />
                    GMGN.ai
                  </a>
                  <a
                    href="https://dexscreener.com/solana/basucpi8m39rs5chbuosta78bptcrjzy2ad6nj2vww6z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-base w-full sm:w-auto text-center flex items-center justify-center gap-2"
                  >
                    <ChartLine className="h-4 w-4" />
                    DexScreener
                  </a>
                </div>
              </div>
              
              {/* Buy ROOT5 Component */}
              <div className="order-3 lg:col-span-1 lg:sticky lg:top-24">
                <BuyRoot5 />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Why Root5DAO?</h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">Community-driven meme tokenization</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-effect rounded-lg p-4 text-center">
                <div className="w-10 h-10 glass-effect-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Community Driven</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Token holders vote on which memes get tokenized.
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <div className="w-10 h-10 glass-effect-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bolt className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Fast & Cheap</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Built on Solana for fast, cheap transactions.
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <div className="w-10 h-10 glass-effect-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChartLine className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Meme Tokens</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Turn memes into tradeable tokens on Pump.fun.
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center">
                <div className="w-10 h-10 glass-effect-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Transparent</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  All votes and tokenization on-chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to vote on memes?</h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
              Join the community and help decide which memes become tokens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {connected ? (
                <Link href="/vote" className="btn-primary text-base w-full sm:w-auto text-center">
                  Get Started
                </Link>
              ) : (
                <Link href="/verify" className="btn-primary text-base w-full sm:w-auto text-center">
                  Get Started
                </Link>
              )}
              <Link
                href="/proposals"
                className="btn-secondary text-base w-full sm:w-auto text-center"
              >
                View Proposals
              </Link>
            </div>
          </div>
        </section>

        {/* PFP Generator Section */}
        <PFPGeneratorSection />

        {/* Footer */}
        <footer className="py-12 glass-effect-subtle border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-16 h-16 glass-effect-subtle rounded-full flex items-center justify-center p-2">
                  <img src="/layers/pfp_base.png" alt="Root5DAO Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl font-bold text-white">Root5DAO</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <Link href="/" className="text-gray-300 hover:text-gray-300 transition-colors font-medium">Home</Link>
                <Link href="#" className="text-gray-300 hover:text-gray-300 transition-colors font-medium">About</Link>
                <Link href="#" className="text-gray-300 hover:text-gray-300 transition-colors font-medium">Tokenomics</Link>
                <Link href="#" className="text-gray-300 hover:text-gray-300 transition-colors font-medium">Docs</Link>
                <Link href="#" className="text-gray-300 hover:text-gray-300 transition-colors font-medium">Contact</Link>
              </div>
              
              <div className="flex justify-center mb-8">
                <a
                  href="https://merch.root5dao.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-6 py-3 inline-flex items-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Shop Merch
                </a>
              </div>
              
              <div className="flex justify-center gap-6 mb-8">
                <Link 
                  href="https://www.reddit.com/r/root5dao/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors group"
                  aria-label="Follow us on Reddit"
                >
                  <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.026 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </Link>
                <Link 
                  href="https://x.com/i/communities/1986508224624009710" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors group"
                  aria-label="Follow us on X (Twitter)"
                >
                  <Twitter className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link 
                  href="https://www.tiktok.com/@root5daocom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors group"
                  aria-label="Follow us on TikTok"
                >
                  <Video className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link 
                  href="http://instagram.com/root5daocom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors group"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link 
                  href="https://www.twitch.tv/root5dao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors group"
                  aria-label="Watch us on Twitch"
                >
                  <Radio className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link 
                  href="https://bitcointalk.org/index.php?topic=5565567.msg66053550#msg66053550" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors group"
                  aria-label="Visit us on BitcoinTalk"
                >
                  <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.243 15.533.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.118 8.738 14.547M12.814 3.29c-5.283-.746-10.054 2.849-10.8 8.132-.746 5.283 2.849 10.054 8.132 10.8 5.283.746 10.054-2.849 10.8-8.132.746-5.283-2.849-10.054-8.132-10.8m1.95 2.21c.358.05.7.15 1.02.3.32.15.6.35.84.59.24.24.44.52.59.84.15.32.25.66.3 1.02.05.36.05.72 0 1.08-.05.36-.15.7-.3 1.02-.15.32-.35.6-.59.84-.24.24-.52.44-.84.59-.32.15-.66.25-1.02.3-.36.05-.72.05-1.08 0-.36-.05-.7-.15-1.02-.3-.32-.15-.6-.35-.84-.59-.24-.24-.44-.52-.59-.84-.15-.32-.25-.66-.3-1.02-.05-.36-.05-.72 0-1.08.05-.36.15-.7.3-1.02.15-.32.35-.6.59-.84.24-.24.52-.44.84-.59.32-.15.66-.25 1.02-.3.36-.05.72-.05 1.08 0z"/>
                  </svg>
                </Link>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <p className="text-gray-400 text-sm">© 2025 Root5DAO. All rights reserved.</p>
                <p className="text-gray-500 text-xs mt-2">Built on Solana • Powered by Community</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}