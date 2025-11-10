'use client';

import { WalletMultiButton } from '@/lib/wallet';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { Vote, Coins, BookOpen, Home, FileText, PlusCircle, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { tokenBalance, loading } = useTokenBalance();
  const { connected } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 glass-effect-strong border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="glass-effect-subtle rounded-lg p-1.5 group-hover:bg-white/5 transition-all">
              <Vote className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300 group-hover:text-green-400 transition-colors" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">RootsDAO</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                pathname === '/' 
                  ? 'glass-effect-strong text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/proposals" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                pathname === '/proposals' 
                  ? 'glass-effect-strong text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Proposals
            </Link>
            <Link 
              href="/vote" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                pathname === '/vote' 
                  ? 'glass-effect-strong text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Vote
            </Link>
            <Link 
              href="/create" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                pathname === '/create' 
                  ? 'glass-effect-strong text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Create
            </Link>
            <Link 
              href="/whitepaper" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 font-medium text-sm ${
                pathname === '/whitepaper'
                  ? 'glass-effect-strong border-white/20 text-white'
                  : 'glass-effect-subtle border-white/10 text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/15'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Whitepaper</span>
            </Link>
          </nav>

          {/* Right Side - Wallet & Balance */}
          <div className="flex items-center gap-3">
            {/* Token Balance */}
            {connected && !loading && tokenBalance.balance > 0 && (
              <div className="hidden sm:flex items-center gap-2 glass-effect-subtle px-3 py-1.5 rounded-lg">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-200">
                  {tokenBalance.balance.toFixed(2)}
                </span>
              </div>
            )}
            
            {/* Wallet Button */}
            <div className="flex items-center">
              <WalletMultiButton />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-2.5 rounded-lg glass-effect-subtle border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-5 h-5">
                <span className={`absolute top-0 left-0 w-5 h-0.5 bg-gray-300 group-hover:bg-green-400 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`absolute top-2 left-0 w-5 h-0.5 bg-gray-300 group-hover:bg-green-400 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : ''
                }`}></span>
                <span className={`absolute top-4 left-0 w-5 h-0.5 bg-gray-300 group-hover:bg-green-400 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Main Menu Card */}
          <div className={`relative mx-4 mt-4 transform transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'
          }`}>
            <div className="relative glass-effect-strong rounded-2xl shadow-2xl overflow-hidden border border-white/10">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 glass-effect-strong rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 shadow-lg">
                      <Vote className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-base tracking-tight">Menu</span>
                      <p className="text-xs text-gray-400 mt-0.5">RootsDAO</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <nav className="px-4 py-5 space-y-2">
                <Link 
                  href="/" 
                  className={`group flex items-center justify-between px-5 py-3.5 rounded-xl text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/'
                      ? 'glass-effect-strong bg-white/10 border border-white/20'
                      : 'glass-effect-subtle hover:bg-white/5 hover:border-white/10 border border-transparent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all ${
                      pathname === '/'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/20'
                    }`}>
                      <Home className={`h-5 w-5 transition-colors ${
                        pathname === '/' ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
                      }`} />
                    </div>
                    <span className="font-semibold">Home</span>
                  </div>
                  {pathname === '/' && (
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  )}
                </Link>
                
                <Link 
                  href="/proposals" 
                  className={`group flex items-center justify-between px-5 py-3.5 rounded-xl text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/proposals'
                      ? 'glass-effect-strong bg-white/10 border border-white/20'
                      : 'glass-effect-subtle hover:bg-white/5 hover:border-white/10 border border-transparent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all ${
                      pathname === '/proposals'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/20'
                    }`}>
                      <FileText className={`h-5 w-5 transition-colors ${
                        pathname === '/proposals' ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
                      }`} />
                    </div>
                    <span className="font-semibold">Proposals</span>
                  </div>
                  {pathname === '/proposals' && (
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  )}
                </Link>
                
                <Link 
                  href="/vote" 
                  className={`group flex items-center justify-between px-5 py-3.5 rounded-xl text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/vote'
                      ? 'glass-effect-strong bg-white/10 border border-white/20'
                      : 'glass-effect-subtle hover:bg-white/5 hover:border-white/10 border border-transparent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all ${
                      pathname === '/vote'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/20'
                    }`}>
                      <CheckSquare className={`h-5 w-5 transition-colors ${
                        pathname === '/vote' ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
                      }`} />
                    </div>
                    <span className="font-semibold">Vote</span>
                  </div>
                  {pathname === '/vote' && (
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  )}
                </Link>
                
                <Link 
                  href="/create" 
                  className={`group flex items-center justify-between px-5 py-3.5 rounded-xl text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/create'
                      ? 'glass-effect-strong bg-white/10 border border-white/20'
                      : 'glass-effect-subtle hover:bg-white/5 hover:border-white/10 border border-transparent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all ${
                      pathname === '/create'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/20'
                    }`}>
                      <PlusCircle className={`h-5 w-5 transition-colors ${
                        pathname === '/create' ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
                      }`} />
                    </div>
                    <span className="font-semibold">Create</span>
                  </div>
                  {pathname === '/create' && (
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  )}
                </Link>
                
                <Link 
                  href="/whitepaper" 
                  className={`group flex items-center justify-between px-5 py-3.5 rounded-xl text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/whitepaper'
                      ? 'glass-effect-strong bg-white/10 border border-white/20'
                      : 'glass-effect-subtle hover:bg-white/5 hover:border-white/10 border border-transparent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all ${
                      pathname === '/whitepaper'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/20'
                    }`}>
                      <BookOpen className={`h-5 w-5 transition-colors ${
                        pathname === '/whitepaper' ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
                      }`} />
                    </div>
                    <span className="font-semibold">Whitepaper</span>
                  </div>
                  {pathname === '/whitepaper' && (
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  )}
                </Link>
              </nav>
              
              {/* Footer */}
              {connected && (
                <div className="px-6 py-5 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl glass-effect-subtle flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
                        <Coins className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium mb-0.5">Token Balance</div>
                        <div className="text-base font-bold text-white">
                          {!loading ? `${tokenBalance.balance.toFixed(2)} ROOTS` : 'Loading...'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs text-green-400 font-semibold">Connected</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1.5">Ready to vote</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
