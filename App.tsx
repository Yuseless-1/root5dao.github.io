
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import Home from './pages/Home';
import Proposals from './pages/Proposals';
import Voting from './pages/Voting';
import Treasury from './pages/Treasury';
import Updates from './pages/Updates';
import Navbar from './components/Navbar';
import WalletModal from './components/WalletModal';
import { WalletState } from './types';

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

const NONCE_MSG = (nonce: string) => `Sign this nonce to authenticate your action: ${nonce}`;

const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isSigned: false,
    chain: null,
  });
  const [showWalletModal, setShowWalletModal] = useState(false);

  const CHAIN_ID_MAP: Record<number, 'ethereum' | 'bsc' | 'arbitrum' | 'base'> = {
    1:     'ethereum',
    56:    'bsc',
    42161: 'arbitrum',
    8453:  'base',
  };

  const connectEvm = async () => {
    setShowWalletModal(false);
    try {
      if (!window.ethereum) throw new Error('MetaMask not found');
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const chain = CHAIN_ID_MAP[chainId];
      if (!chain) {
        throw new Error(`Unsupported network (chainId ${chainId}). Please switch to Ethereum, BSC, Arbitrum, or Base.`);
      }
      const signer = await provider.getSigner();
      const address = await signer.getAddress(); // checksummed
      setWallet({ address, isConnected: true, isSigned: false, chain });
    } catch (err: any) {
      console.error('EVM connect error:', err);
      alert(err?.message ?? 'Failed to connect MetaMask');
    }
  };

  const connectSolana = async () => {
    setShowWalletModal(false);
    try {
      if (!window.solana) throw new Error('Phantom not found');
      const resp = await window.solana.connect();
      const address: string = resp.publicKey.toString();
      setWallet({ address, isConnected: true, isSigned: false, chain: 'solana' });
    } catch (err: any) {
      console.error('Solana connect error:', err);
      alert(err?.message ?? 'Failed to connect Phantom');
    }
  };

  const signLogin = async () => {
    if (!wallet.address || !wallet.chain) return;

    try {
      const nonceResp = await fetch(
        `/api/nonce?wallet=${encodeURIComponent(wallet.address)}&chain=${wallet.chain}`
      );
      if (!nonceResp.ok) throw new Error('Failed to fetch nonce');
      const { nonce } = await nonceResp.json();
      const message = NONCE_MSG(nonce);

      const EVM_CHAINS = ['ethereum', 'bsc', 'arbitrum', 'base'];
      if (wallet.chain && EVM_CHAINS.includes(wallet.chain)) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await signer.signMessage(message);
      } else {
        const encoded = new TextEncoder().encode(message);
        await window.solana.signMessage(encoded, 'utf8');
      }

      setWallet(prev => ({ ...prev, isSigned: true }));
    } catch (err: any) {
      console.error('Sign login error:', err);
      const msg = err?.message?.toLowerCase() ?? '';
      if (!msg.includes('reject') && !msg.includes('cancel') && !msg.includes('denied')) {
        alert('Authentication failed. Please try again.');
      }
    }
  };

  const disconnectWallet = () => {
    if (wallet.chain === 'solana' && window.solana?.disconnect) {
      window.solana.disconnect().catch(() => {});
    }
    setWallet({ address: null, isConnected: false, isSigned: false, chain: null });
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#030303] text-white selection:bg-green-500/30">
        <Navbar
          wallet={wallet}
          onOpenWalletModal={() => setShowWalletModal(true)}
          disconnectWallet={disconnectWallet}
          signLogin={signLogin}
        />

        <main className="flex-1 container mx-auto px-4 py-8 md:px-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/proposals"
              element={<Proposals wallet={wallet} signLogin={signLogin} />}
            />
            <Route
              path="/voting/:id"
              element={<Voting wallet={wallet} signLogin={signLogin} />}
            />
            <Route path="/treasury" element={<Treasury />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </main>

        <footer className="border-t border-white/5 py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-white/40 text-sm">
            &copy; 2024 Root5 DAO Governance Ecosystem. Powered by Modular Liquidity.
          </div>
        </footer>

        {showWalletModal && (
          <WalletModal
            onClose={() => setShowWalletModal(false)}
            onSelectEvm={connectEvm}
            onSelectSolana={connectSolana}
          />
        )}
      </div>
    </HashRouter>
  );
};

export default App;
