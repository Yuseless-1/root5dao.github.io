import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merchandise',
  description: 'Shop Root5DAO merchandise and support the democratized meme credit union.',
  openGraph: {
    title: 'Root5DAO Merchandise',
    description: 'Shop Root5DAO merchandise',
    url: 'https://root5dao.github.io/merch',
  },
  twitter: {
    title: 'Root5DAO Merchandise',
    description: 'Shop Root5DAO merchandise',
  },
};

export default function MerchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

