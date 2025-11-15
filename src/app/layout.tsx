'use client';

import { WalletContextProvider } from '@/lib/wallet';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/layers/pfp_base.png" type="image/png" />
        <link rel="apple-touch-icon" href="/layers/pfp_base.png" />
      </head>
      <body className="text-white min-h-screen">
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}