import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposals',
  description: 'Browse and vote on meme tokenization proposals on Root5DAO. See active proposals, voting results, and community-driven meme selections.',
  openGraph: {
    title: 'Root5DAO Proposals',
    description: 'Browse and vote on meme tokenization proposals',
    url: 'https://root5dao.github.io/proposals',
  },
  twitter: {
    title: 'Root5DAO Proposals',
    description: 'Browse and vote on meme tokenization proposals',
  },
};

export default function ProposalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

