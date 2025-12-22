import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Proposal',
  description: 'Submit a meme proposal to Root5DAO. Lock tokens to create proposals and let the community vote on tokenization.',
  openGraph: {
    title: 'Create Proposal - Root5DAO',
    description: 'Submit a meme proposal to Root5DAO',
    url: 'https://root5dao.github.io/create',
  },
  twitter: {
    title: 'Create Proposal - Root5DAO',
    description: 'Submit a meme proposal to Root5DAO',
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

