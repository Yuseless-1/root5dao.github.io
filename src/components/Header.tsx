'use client';

import { WalletMultiButton } from '@/lib/wallet';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import Link from 'next/link';
import { Vote, Coins, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { tokenBalance, loading } = useTokenBalance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Vote className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            <span className="text-lg sm:text-xl font-bold gradient-text">Root5 DAO</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-sm">
              Home
            </Link>
            <Link href="/proposals" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-sm">
              Proposals
            </Link>
            <Link href="/vote" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-sm">
              Vote
            </Link>
            <Link href="/create" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-sm">
              Create
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {!loading && tokenBalance.balance > 0 && (
              <div className="hidden sm:flex items-center space-x-1 text-xs">
                <Coins className="h-3 w-3 text-yellow-400" />
                <span className="text-gray-300">
                  {tokenBalance.balance.toFixed(2)}
                </span>
              </div>
            )}
            <WalletMultiButton className="!bg-gradient-to-r !from-green-400 !to-purple-500 !text-black !font-semibold !rounded-full !px-4 !py-2 !text-sm hover:!shadow-lg hover:!shadow-green-400/30 transition-all" />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-3 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-600/50 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 group backdrop-blur-sm"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute top-1 left-0 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-green-400 group-hover:to-green-300 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2.5 w-6' : ''
                }`}></span>
                <span className={`absolute top-3 left-0 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-green-400 group-hover:to-green-300 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : ''
                }`}></span>
                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-green-400 group-hover:to-green-300 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2.5 w-6' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed top-16 left-0 right-0 z-40 transition-all duration-700 ease-out ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          
          {/* Main Menu Card */}
          <div className="relative mx-4 mt-2">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-sm"></div>
            
            <div className="relative bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 border border-gray-600/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400/10 via-transparent to-purple-500/10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-full blur-xl"></div>
              </div>
              
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Vote className="h-5 w-5 text-white drop-shadow-sm" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                    </div>
                    <div>
                      <span className="text-white font-bold text-sm tracking-wide">Navigation</span>
                      <div className="text-xs text-gray-400">Quick Access</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 font-mono">Root5 DAO</div>
                    <div className="text-xs text-green-400 font-semibold">v2.0</div>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <nav className="relative px-4 py-5 space-y-3">
                <Link 
                  href="/" 
                  className="flex items-center px-5 py-4 rounded-xl bg-gradient-to-r from-green-500/15 to-green-600/15 border border-green-500/40 text-white hover:from-green-500/25 hover:to-green-600/25 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-400 font-medium text-sm group relative overflow-hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mr-4 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300 shadow-lg">
                    <Vote className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                  </div>
                  <div className="flex-1 relative">
                    <div className="font-bold text-sm group-hover:text-green-100 transition-colors duration-300">Home</div>
                    <div className="text-xs text-green-300/80 group-hover:text-green-200/90 transition-colors duration-300">Dashboard & Overview</div>
                  </div>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-green-400 group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400/30 group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                </Link>
                
                <Link 
                  href="/proposals" 
                  className="flex items-center px-5 py-4 rounded-xl bg-gradient-to-r from-purple-500/15 to-purple-600/15 border border-purple-500/40 text-white hover:from-purple-500/25 hover:to-purple-600/25 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-400 font-medium text-sm group relative overflow-hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mr-4 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300 shadow-lg">
                    <Vote className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                  <div className="flex-1 relative">
                    <div className="font-bold text-sm group-hover:text-purple-100 transition-colors duration-300">Proposals</div>
                    <div className="text-xs text-purple-300/80 group-hover:text-purple-200/90 transition-colors duration-300">View & Vote on Memes</div>
                  </div>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-purple-400 group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-purple-400/30 group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                </Link>
                
                <Link 
                  href="/vote" 
                  className="flex items-center px-5 py-4 rounded-xl bg-gradient-to-r from-blue-500/15 to-blue-600/15 border border-blue-500/40 text-white hover:from-blue-500/25 hover:to-blue-600/25 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-400 font-medium text-sm group relative overflow-hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mr-4 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300 shadow-lg">
                    <Vote className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <div className="flex-1 relative">
                    <div className="font-bold text-sm group-hover:text-blue-100 transition-colors duration-300">Vote</div>
                    <div className="text-xs text-blue-300/80 group-hover:text-blue-200/90 transition-colors duration-300">Cast Your Votes</div>
                  </div>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-blue-400 group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-400/30 group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                </Link>
                
                <Link 
                  href="/create" 
                  className="flex items-center px-5 py-4 rounded-xl bg-gradient-to-r from-yellow-500/15 to-yellow-600/15 border border-yellow-500/40 text-white hover:from-yellow-500/25 hover:to-yellow-600/25 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-400 font-medium text-sm group relative overflow-hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center mr-4 group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-all duration-300 shadow-lg">
                    <Vote className="h-6 w-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                  </div>
                  <div className="flex-1 relative">
                    <div className="font-bold text-sm group-hover:text-yellow-100 transition-colors duration-300">Create</div>
                    <div className="text-xs text-yellow-300/80 group-hover:text-yellow-200/90 transition-colors duration-300">Submit New Proposals</div>
                  </div>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-yellow-400/30 group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                </Link>
              </nav>
              
              {/* Footer */}
              <div className="relative px-6 py-5 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500/20 to-green-600/20 flex items-center justify-center">
                      <Coins className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Wallet Status</div>
                      <div className="text-xs text-green-400 font-mono font-semibold">Connected</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Ready to</div>
                    <div className="text-xs text-green-400 font-bold">Vote & Create</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3 bg-gray-800/50 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-purple-500 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
