import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whitepaper',
  description: 'Read the Root5DAO whitepaper - The Democratized Meme Credit Union on Solana. Learn about governance, tokenomics, and our vision for community-driven meme tokenization.',
  openGraph: {
    title: 'Root5DAO Whitepaper',
    description: 'The Democratized Meme Credit Union on Solana - Whitepaper',
    url: 'https://root5dao.github.io/whitepaper',
  },
  twitter: {
    title: 'Root5DAO Whitepaper',
    description: 'The Democratized Meme Credit Union on Solana - Whitepaper',
  },
};

export default function WhitepaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

