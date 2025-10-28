'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@/lib/wallet';
import { Vote, Users, Coins, Shield, Upload, Bolt, ChartLine, Github, Twitter, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  const { connected } = useWallet();

  const copyContract = () => {
    const contractAddress = "12fgghtred233455ggreedd";
    navigator.clipboard.writeText(contractAddress).then(() => {
      alert("Contract address copied to clipboard!");
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-4">
                Root5 DAO
              </h1>
              <div className="text-lg sm:text-xl md:text-2xl font-semibold text-green-400 mb-6 uppercase tracking-wider">
                Don't Just PAMP EET. Vote EET.
              </div>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The first decentralized autonomous organization that transforms internet memes into tradeable Solana tokens through community voting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="btn-primary text-base w-full sm:w-auto">
                Buy Token on Pump.fun
              </button>
              <button className="btn-secondary text-base w-full sm:w-auto">
                Learn More
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="glass-effect rounded-lg p-4 card-hover">
                <div className="text-xl font-bold text-green-400 mb-1">1000+</div>
                <div className="text-sm text-gray-400">Active Members</div>
              </div>
              <div className="glass-effect rounded-lg p-4 card-hover">
                <div className="text-xl font-bold text-purple-400 mb-1">50+</div>
                <div className="text-sm text-gray-400">Proposals Voted</div>
              </div>
              <div className="glass-effect rounded-lg p-4 card-hover">
                <div className="text-xl font-bold text-blue-400 mb-1">$2M+</div>
                <div className="text-sm text-gray-400">Token Volume</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">How It Works</h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">Transform memes into tokens through our innovative three-step process</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-effect rounded-xl p-6 text-center floating card-hover">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Submit Memes</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Community members submit their favorite memes to the DAO for consideration. Each submission is carefully reviewed.
                </p>
              </div>
              
              <div className="glass-effect rounded-xl p-6 text-center floating card-hover">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Vote & Decide</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  DAO members vote on which memes should be converted into tokens. Each vote costs 1 token to ensure commitment.
                </p>
              </div>
              
              <div className="glass-effect rounded-xl p-6 text-center floating card-hover">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Tokenize & Trade</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Winning memes are converted into tradeable Solana tokens on Pump.fun, creating real economic value from internet culture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Token Info Section */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <div className="glass-effect rounded-xl p-4 card-hover">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://i.imgur.com/8QZ8QZ8.png"
                      alt="Doge"
                      className="w-full h-24 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x100/00ff88/0a0a0a/png?text=Doge';
                      }}
                    />
                    <img
                      src="https://i.imgur.com/wojak.png"
                      alt="Wojak"
                      className="w-full h-24 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x100/8a2be2/0a0a0a/png?text=Wojak';
                      }}
                    />
                    <img
                      src="https://i.imgur.com/pepe.png"
                      alt="Pepe"
                      className="w-full h-24 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x100/ff6b6b/0a0a0a/png?text=Pepe';
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-400 font-semibold">Featured Memes</div>
                    <div className="text-xs text-gray-500">Doge • Wojak • Pepe</div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Root5 DAO Token</h2>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    The official token of Root5 DAO, hosted on the Solana blockchain and traded on Pump.fun. 
                    Holders can participate in meme voting and governance decisions.
                  </p>
                </div>
                
                <div className="glass-effect rounded-lg p-4 card-hover">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">Contract Address</div>
                      <span className="font-mono text-xs sm:text-sm text-gray-300 break-all">
                        12fgghtred233455ggreedd
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
                    <div className="text-lg font-semibold text-green-400 mb-1">$0.001</div>
                    <div className="text-xs text-gray-400">Current Price</div>
                  </div>
                  <div className="glass-effect rounded-lg p-3 text-center card-hover">
                    <div className="text-lg font-semibold text-purple-400 mb-1">1B</div>
                    <div className="text-xs text-gray-400">Total Supply</div>
                  </div>
                </div>
                
                <button className="btn-primary text-base w-full sm:w-auto">
                  Trade on Pump.fun
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Why Root5 DAO?</h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">Experience the future of decentralized governance and meme tokenization</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-effect rounded-lg p-4 text-center card-hover">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Community Governance</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Every token holder gets voting rights to decide which memes become tokens.
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center card-hover">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bolt className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Solana Speed</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Leveraging Solana's high-speed, low-cost blockchain for seamless transactions.
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center card-hover">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChartLine className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Meme Economy</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Transform viral memes into tangible assets with real economic value.
                </p>
              </div>
              
              <div className="glass-effect rounded-lg p-4 text-center card-hover">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Transparent & Secure</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  All voting and tokenization processes are transparent and secured by blockchain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">Ready to Shape the Meme Economy?</h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
              Join Root5 DAO today and be part of the revolution that turns internet culture into tradeable assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-base w-full sm:w-auto">
                Get Started Now
              </button>
              {connected && (
                <Link
                  href="/proposals"
                  className="btn-secondary text-base w-full sm:w-auto"
                >
                  View Proposals
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Vote className="h-5 w-5 text-black" />
                </div>
                <span className="text-2xl font-bold gradient-text">Root5 DAO</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors font-medium">Home</Link>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors font-medium">About</Link>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors font-medium">Tokenomics</Link>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors font-medium">Docs</Link>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors font-medium">Contact</Link>
              </div>
              
              <div className="flex justify-center gap-6 mb-8">
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Send className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Github className="h-6 w-6" />
                </Link>
              </div>
              
              <div className="border-t border-gray-800 pt-6">
                <p className="text-gray-500">© 2024 Root5 DAO. All rights reserved.</p>
                <p className="text-gray-600 text-sm mt-2">Built on Solana • Powered by Community</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}