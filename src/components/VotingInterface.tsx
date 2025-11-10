'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useVoting } from '@/hooks/useVoting';
import { Clock, ChevronDown, ExternalLink } from 'lucide-react';

interface Coin {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress: string;
  votes: number;
  voteChange: number;
  rank: number;
  socials: {
    telegram?: string;
    twitter?: string;
    website?: string;
  };
  badges?: string[];
}

const MOCK_COINS: Coin[] = [
  {
    id: '1',
    name: 'PEPU BANK',
    imageUrl: '/images.jpeg',
    contractAddress: '0x8214...514c',
    votes: 1088,
    voteChange: 196,
    rank: 1,
    badges: ['SE2', 'SE1'],
    socials: {
      telegram: 'https://t.me/pepubank',
      twitter: 'https://x.com/pepubank',
      website: 'https://pepubank.com'
    }
  },
  {
    id: '2',
    name: 'PEPU VAULT',
    imageUrl: '/Wojak_cropped.jpg',
    contractAddress: '0x8746...bbe6',
    votes: 950,
    voteChange: 254,
    rank: 2,
    badges: ['SE2'],
    socials: {
      telegram: 'https://t.me/pepuvault',
      twitter: 'https://x.com/pepuvault',
      website: 'https://pepuvault.com'
    }
  },
  {
    id: '3',
    name: 'YASHIX',
    imageUrl: '/images.jpeg',
    contractAddress: '0x1234...5678',
    votes: 898,
    voteChange: 0,
    rank: 3,
    socials: {
      telegram: 'https://t.me/yashix',
      twitter: 'https://x.com/yashix',
      website: 'https://yashix.com'
    }
  },
  {
    id: '4',
    name: 'DOGE MOON',
    imageUrl: '/Dogecoin-Logo-emblem-of-the-cryptocurrency-transparent-png-image-jpg-768x768.webp',
    contractAddress: '0x9876...abcd',
    votes: 567,
    voteChange: 123,
    rank: 4,
    socials: {
      telegram: 'https://t.me/dogemoon',
      twitter: 'https://x.com/dogemoon',
      website: 'https://dogemoon.com'
    }
  }
];

export default function VotingInterface() {
  const { connected } = useWallet();
  const { tokenBalance } = useTokenBalance();
  const { castVote, loading: votingLoading } = useVoting();
  const [selectedFilter, setSelectedFilter] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('Newcomer');
  const [expandedCoins, setExpandedCoins] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState({ days: 2, hours: 0, minutes: 48, seconds: 54 });

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVote = async (coinId: string) => {
    if (!tokenBalance.canVote) return;
    await castVote(coinId, 1);
  };

  const toggleExpand = (coinId: string) => {
    setExpandedCoins(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const top3Coins = MOCK_COINS.slice(0, 3).sort((a, b) => b.votes - a.votes);
  const borderColors = ['border-yellow-500', 'border-orange-500', 'border-gray-600'];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Vote on Memes
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Community voting platform
          </p>
        </div>

        {/* Season Info */}
        <div className="glass-effect rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Current Voting Round</h2>
              <p className="text-gray-400 text-sm">Vote on your favorite memes</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-400 text-sm mb-2">Time Remaining:</p>
              <div className="flex gap-3 text-xl sm:text-2xl font-bold">
                <div className="text-white">
                  <span className="text-gray-300">{timeRemaining.days}</span>
                  <span className="text-gray-500 text-sm">d</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-300">{String(timeRemaining.hours).padStart(2, '0')}</span>
                  <span className="text-gray-500 text-sm">h</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-300">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                  <span className="text-gray-500 text-sm">m</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-300">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                  <span className="text-gray-500 text-sm">s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Coins Leaderboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {top3Coins.map((coin, index) => (
            <div 
              key={coin.id}
              className={`glass-effect rounded-xl p-6 border ${borderColors[index]} relative`}
            >
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3 glass-effect-strong border border-white/20 rounded-full px-3 py-1">
                <span className="text-white font-semibold text-xs">#{coin.rank}</span>
              </div>

              {/* Season Badges */}
              {coin.badges && (
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  {coin.badges.map((badge, i) => (
                    <div key={i} className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      {badge}
                    </div>
                  ))}
                </div>
              )}

              {/* Coin Image */}
              <div className="mt-6 mb-4 flex justify-center">
                <img
                  src={coin.imageUrl}
                  alt={coin.name}
                  className="w-28 h-28 object-cover rounded-lg border border-gray-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/128x128/00ff88/0a0a0a/png?text=' + coin.name;
                  }}
                />
              </div>

              {/* Coin Name */}
              <h3 className="text-xl font-bold text-white text-center mb-4">{coin.name}</h3>

              {/* Vote Count */}
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-300">{coin.votes} votes</div>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center gap-4 pt-4 border-t border-gray-800">
                {coin.socials.telegram && (
                  <a
                    href={coin.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300 transition-all hover:scale-110"
                    aria-label="Telegram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.503-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15.056-.212.06-.087.14-.132.226-.14.087-.01.21-.007.29.026.106.044.18.119.224.236.05.128.04.204.028.315-.031.27-.78 2.585-1.096 3.61-.335 1.09-.6 1.235-1.13.757-.25-.223-2.112-1.878-3.72-3.073-.446-.34-.768-.756-1.003-1.174-.327-.598.327-.93.98-.758.25.067.52.138.75.218.459.162.877.185 1.29.061.29-.087.87-.337 1.292-.612.53-.342.95-.557 1.15-.648.402-.182 1.01-.323 1.66-.2.514.098 1.664.659 1.958.798.299.14.542.315.697.52.155.206.33.527.38.823.05.296.047.753.033 1.036z"/>
                    </svg>
                  </a>
                )}
                {coin.socials.twitter && (
                  <a
                    href={coin.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-white transition-all hover:scale-110"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {coin.socials.website && (
                  <a
                    href={coin.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300 transition-all hover:scale-110"
                    aria-label="Website"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedFilter('1d')}
            className={`pill text-sm ${selectedFilter === '1d' ? 'pill-active' : ''}`}
          >
            1d
          </button>
          <button
            onClick={() => setSelectedFilter('7d')}
            className={`pill text-sm ${selectedFilter === '7d' ? 'pill-active' : ''}`}
          >
            7d
          </button>
          <button
            onClick={() => setSelectedFilter('30d')}
            className={`pill text-sm ${selectedFilter === '30d' ? 'pill-active' : ''}`}
          >
            30d
          </button>
          <button
            onClick={() => setSelectedFilter('Overall')}
            className={`pill text-sm ${selectedFilter === 'Overall' ? 'pill-active' : ''}`}
          >
            Overall
          </button>
          <button
            onClick={() => setSelectedCategory('Newcomer')}
            className={`pill text-sm ${selectedCategory === 'Newcomer' ? 'pill-active' : ''}`}
          >
            Newcomer
          </button>
          <select className="pill bg-transparent text-sm">
            <option>Seasons</option>
            <option>Season I</option>
            <option>Season II</option>
            <option>Season III</option>
          </select>
        </div>

        {/* Detailed Coin List */}
        <div className="space-y-3">
          {MOCK_COINS.map((coin) => (
            <div
              key={coin.id}
              className="glass-effect rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={coin.imageUrl}
                    alt={coin.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/48x48/00ff88/0a0a0a/png?text=' + coin.name.charAt(0);
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{coin.name}</h4>
                    </div>
                    <p className="text-gray-400 text-xs font-mono">{coin.contractAddress}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-300">{coin.votes} votes</div>
                    {coin.voteChange > 0 && (
                      <div className="text-xs text-gray-300">+{coin.voteChange}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(coin.id)}
                  className="ml-4 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${
                    expandedCoins.includes(coin.id) ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>

              {/* Expanded Content */}
              {expandedCoins.includes(coin.id) && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Contract Address</p>
                      <p className="text-white font-mono text-sm">{coin.contractAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Social Links</p>
                      <div className="flex gap-3">
                        {coin.socials.telegram && (
                          <a
                            href={coin.socials.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300 transition-all hover:scale-110"
                            aria-label="Telegram"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.503-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15.056-.212.06-.087.14-.132.226-.14.087-.01.21-.007.29.026.106.044.18.119.224.236.05.128.04.204.028.315-.031.27-.78 2.585-1.096 3.61-.335 1.09-.6 1.235-1.13.757-.25-.223-2.112-1.878-3.72-3.073-.446-.34-.768-.756-1.003-1.174-.327-.598.327-.93.98-.758.25.067.52.138.75.218.459.162.877.185 1.29.061.29-.087.87-.337 1.292-.612.53-.342.95-.557 1.15-.648.402-.182 1.01-.323 1.66-.2.514.098 1.664.659 1.958.798.299.14.542.315.697.52.155.206.33.527.38.823.05.296.047.753.033 1.036z"/>
                            </svg>
                          </a>
                        )}
                        {coin.socials.twitter && (
                          <a
                            href={coin.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-200 hover:text-white transition-all hover:scale-110"
                            aria-label="X (Twitter)"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </a>
                        )}
                        {coin.socials.website && (
                          <a
                            href={coin.socials.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300 transition-all hover:scale-110"
                            aria-label="Website"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {connected && tokenBalance.canVote && (
                    <button
                      onClick={() => handleVote(coin.id)}
                      disabled={votingLoading}
                      className="mt-4 btn-primary w-full text-sm"
                    >
                      {votingLoading ? 'Voting...' : 'Vote (1 token)'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

