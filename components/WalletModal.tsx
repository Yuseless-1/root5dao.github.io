import React from 'react';

interface WalletModalProps {
  onClose: () => void;
  onSelectEvm: () => void;
  onSelectSolana: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose, onSelectEvm, onSelectSolana }) => {
  const hasMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum);
  const hasPhantom  = typeof window !== 'undefined' && Boolean(
    (window as any).solana?.isPhantom || (window as any).phantom?.solana?.isPhantom
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass border border-white/10 rounded-3xl p-8 w-full max-w-sm mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSelectEvm}
            disabled={!hasMetaMask}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${
              hasMetaMask
                ? 'border-white/10 hover:border-green-500/40 hover:bg-green-500/5 active:scale-95'
                : 'border-white/5 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl">
              🦊
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">MetaMask</p>
              <p className="text-white/40 text-xs">{hasMetaMask ? 'EVM — Ethereum & L2s' : 'Not detected'}</p>
            </div>
            {hasMetaMask && (
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
            )}
          </button>

          <button
            onClick={onSelectSolana}
            disabled={!hasPhantom}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${
              hasPhantom
                ? 'border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 active:scale-95'
                : 'border-white/5 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl">
              👻
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Phantom</p>
              <p className="text-white/40 text-xs">{hasPhantom ? 'Solana' : 'Not detected'}</p>
            </div>
            {hasPhantom && (
              <div className="ml-auto w-2 h-2 rounded-full bg-purple-400"></div>
            )}
          </button>
        </div>

        {!hasMetaMask && !hasPhantom && (
          <p className="mt-6 text-center text-white/30 text-xs leading-relaxed">
            No wallet detected. Install{' '}
            <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">MetaMask</a>
            {' '}or{' '}
            <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Phantom</a>.
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
