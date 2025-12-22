import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vote',
  description: 'Vote on meme proposals with your ROOT5 tokens. 1 token = 1 vote. Participate in the democratized meme credit union governance.',
  openGraph: {
    title: 'Vote on Memes - Root5DAO',
    description: 'Vote on meme proposals with your ROOT5 tokens',
    url: 'https://root5dao.github.io/vote',
  },
  twitter: {
    title: 'Vote on Memes - Root5DAO',
    description: 'Vote on meme proposals with your ROOT5 tokens',
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

