'use client';

import { WalletMultiButton } from '@/lib/wallet';
import { Wallet } from 'lucide-react';

export default function WalletButton({ className = '' }: { className?: string }) {
  return (
    <div className={`wallet-button-wrapper ${className}`}>
      <WalletMultiButton />
    </div>
  );
}


