import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Token',
  description: 'Verify your ROOT5 token holdings and connect your wallet to participate in Root5DAO governance.',
  openGraph: {
    title: 'Verify Token - Root5DAO',
    description: 'Verify your ROOT5 token holdings',
    url: 'https://root5dao.github.io/verify',
  },
  twitter: {
    title: 'Verify Token - Root5DAO',
    description: 'Verify your ROOT5 token holdings',
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

