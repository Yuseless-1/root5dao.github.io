'use client';

import { WalletMultiButton } from '@/lib/wallet';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import Link from 'next/link';
import { Vote, Coins, Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { tokenBalance, loading } = useTokenBalance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Vote className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            <span className="text-lg sm:text-xl font-bold text-white">Root5 DAO</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link 
              href="/" 
              className={`transition-colors font-medium text-sm ${
                pathname === '/' 
                  ? 'text-green-400 border-b-2 border-green-400 pb-1' 
                  : 'text-gray-300 hover:text-green-400'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/proposals" 
              className={`transition-colors font-medium text-sm ${
                pathname === '/proposals' 
                  ? 'text-green-400 border-b-2 border-green-400 pb-1' 
                  : 'text-gray-300 hover:text-green-400'
              }`}
            >
              Proposals
            </Link>
            <Link 
              href="/vote" 
              className={`transition-colors font-medium text-sm ${
                pathname === '/vote' 
                  ? 'text-green-400 border-b-2 border-green-400 pb-1' 
                  : 'text-gray-300 hover:text-green-400'
              }`}
            >
              Vote
            </Link>
            <Link 
              href="/create" 
              className={`transition-colors font-medium text-sm ${
                pathname === '/create' 
                  ? 'text-green-400 border-b-2 border-green-400 pb-1' 
                  : 'text-gray-300 hover:text-green-400'
              }`}
            >
              Create
            </Link>
            <Link 
              href="/whitepaper" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium text-sm ${
                pathname === '/whitepaper'
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Whitepaper</span>
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
            <WalletMultiButton className="!bg-green-500 !text-black !font-medium !rounded-lg !px-4 !py-2 !text-sm hover:!bg-green-400 transition-all" />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-3 rounded-lg bg-gray-800 border border-gray-600 hover:border-green-400 transition-all duration-300 group"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute top-1 left-0 w-6 h-0.5 bg-gray-300 group-hover:bg-green-400 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2.5 w-6' : ''
                }`}></span>
                <span className={`absolute top-3 left-0 w-6 h-0.5 bg-gray-300 group-hover:bg-green-400 transition-all duration-300 ease-out rounded-full ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : ''
                }`}></span>
                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-gray-300 group-hover:bg-green-400 transition-all duration-300 ease-out rounded-full ${
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
            <div className="relative bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Vote className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-sm">Navigation</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Root5 DAO</div>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <nav className="px-4 py-4 space-y-2">
                <Link 
                  href="/" 
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/'
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Vote className="h-5 w-5 text-green-400 mr-3" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  href="/proposals" 
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/proposals'
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Vote className="h-5 w-5 text-green-400 mr-3" />
                  <span>Proposals</span>
                </Link>
                
                <Link 
                  href="/vote" 
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/vote'
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Vote className="h-5 w-5 text-green-400 mr-3" />
                  <span>Vote</span>
                </Link>
                
                <Link 
                  href="/create" 
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/create'
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Vote className="h-5 w-5 text-green-400 mr-3" />
                  <span>Create</span>
                </Link>
                
                <Link 
                  href="/whitepaper" 
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 font-medium text-sm ${
                    pathname === '/whitepaper'
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5 text-green-400 mr-3" />
                  <span>Whitepaper</span>
                </Link>
              </nav>
              
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Coins className="h-3 w-3 text-black" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Wallet Status</div>
                      <div className="text-xs text-green-400 font-semibold">Connected</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Ready to vote</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
