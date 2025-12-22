'use client';

import { WalletContextProvider } from '@/lib/wallet';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  );
}

