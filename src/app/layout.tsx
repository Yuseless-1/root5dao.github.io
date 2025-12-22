import type { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { Analytics } from '@/components/Analytics';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://root5dao.github.io'),
  title: {
    default: 'Root5DAO - Vote on Memes. Turn Them Into Tokens.',
    template: '%s | Root5DAO'
  },
  description: 'Community-driven meme tokenization on Solana. Submit, vote, and trade the memes that matter. The first democratized meme credit union on Solana.',
  keywords: ['Root5DAO', 'Solana', 'meme tokens', 'DAO', 'governance', 'crypto', 'blockchain', 'decentralized', 'voting', 'Pump.fun'],
  authors: [{ name: 'Root5DAO' }],
  creator: 'Root5DAO',
  publisher: 'Root5DAO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://root5dao.github.io',
    siteName: 'Root5DAO',
    title: 'Root5DAO - Vote on Memes. Turn Them Into Tokens.',
    description: 'Community-driven meme tokenization on Solana. Submit, vote, and trade the memes that matter.',
    images: [
      {
        url: '/layers/pfp_base.png',
        width: 1200,
        height: 630,
        alt: 'Root5DAO Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Root5DAO - Vote on Memes. Turn Them Into Tokens.',
    description: 'Community-driven meme tokenization on Solana. Submit, vote, and trade the memes that matter.',
    images: ['/layers/pfp_base.png'],
    creator: '@root5dao',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://root5dao.github.io',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="text-white min-h-screen">
        <Analytics 
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          plausibleDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}