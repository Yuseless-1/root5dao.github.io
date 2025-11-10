export interface Proposal {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  creator: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'rejected';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  requiredTokens: number;
}

export interface CreateProposalData {
  title: string;
  description: string;
  imageUrl?: string;
}

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Doge to the Moon 🚀',
    description: 'Classic Doge meme deserves to be the first tokenized meme on RootsDAO. Much wow, very token!',
    imageUrl: '/Dogecoin-Logo-emblem-of-the-cryptocurrency-transparent-png-image-jpg-768x768.webp',
    creator: '0x1234...5678',
    createdAt: new Date('2024-01-15'),
    status: 'active',
    votesFor: 1250,
    votesAgainst: 89,
    totalVotes: 1339,
    requiredTokens: 10,
  },
  {
    id: '2',
    title: 'Pepe the Frog King',
    description: 'The legendary Pepe deserves his place in meme tokenization history. Rare Pepe incoming!',
    imageUrl: '/images.jpeg',
    creator: '0x9876...5432',
    createdAt: new Date('2024-01-14'),
    status: 'active',
    votesFor: 2100,
    votesAgainst: 234,
    totalVotes: 2334,
    requiredTokens: 10,
  },
  {
    id: '3',
    title: 'Wojak Feels Token',
    description: 'The ultimate feels guy meme. Wojak represents all our emotions in the crypto market.',
    imageUrl: '/Wojak_cropped.jpg',
    creator: '0xabcd...efgh',
    createdAt: new Date('2024-01-13'),
    status: 'completed',
    votesFor: 892,
    votesAgainst: 156,
    totalVotes: 1048,
    requiredTokens: 10,
  },
  {
    id: '4',
    title: 'Chad Wojak Ascension',
    description: 'The ultimate Chad Wojak meme - representing the alpha mindset in DeFi.',
    imageUrl: '/Wojak_cropped.jpg',
    creator: '0x2345...6789',
    createdAt: new Date('2024-01-12'),
    status: 'active',
    votesFor: 567,
    votesAgainst: 123,
    totalVotes: 690,
    requiredTokens: 10,
  },
  {
    id: '5',
    title: 'Diamond Hands Doge',
    description: 'Doge with diamond hands - the perfect representation of HODL culture.',
    imageUrl: '/Dogecoin-Logo-emblem-of-the-cryptocurrency-transparent-png-image-jpg-768x768.webp',
    creator: '0x7890...1234',
    createdAt: new Date('2024-01-11'),
    status: 'completed',
    votesFor: 1456,
    votesAgainst: 78,
    totalVotes: 1534,
    requiredTokens: 10,
  },
];
