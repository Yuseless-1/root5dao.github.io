
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletState } from '../types';

interface NavbarProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
  disconnectWallet: () => void;
  signLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ wallet, onOpenWalletModal, disconnectWallet, signLogin }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Proposals', path: '/proposals' },
    { name: 'Treasury', path: '/treasury' },
    { name: 'Updates', path: '/updates' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const chainLabel = wallet.chain === 'ethereum' ? 'EVM' : wallet.chain === 'solana' ? 'SOL' : '';

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-3 md:px-8">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://root5dao.com/layers/logo.jpg"
            alt="ROOT5 DAO Logo"
            className="w-8 h-8 rounded-lg object-cover group-hover:ring-2 ring-green-500/50 transition-all"
          />
          <span className="hidden md:block font-bold text-xl tracking-tight">
            ROOT5 <span className="text-green-400">DAO</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-green-400 ${
                isActive(link.path) ? 'text-green-400' : 'text-white/60'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!wallet.isConnected ? (
            <button
              onClick={onOpenWalletModal}
              className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-500/20 active:scale-95"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  {wallet.isSigned ? 'Authenticated' : 'Connected'}{chainLabel ? ` · ${chainLabel}` : ''}
                </span>
                <span className="text-xs font-mono text-green-400">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={wallet.isSigned ? disconnectWallet : signLogin}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
                  wallet.isSigned
                  ? 'border border-white/10 hover:bg-white/5 text-white/80'
                  : 'bg-green-500 hover:bg-green-600 text-black'
                }`}
              >
                {wallet.isSigned ? 'Log Out' : 'Sign Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
