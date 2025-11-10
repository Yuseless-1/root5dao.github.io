# RootsDAO - The Democratized Meme Credit Union

[![Built on Solana](https://img.shields.io/badge/Built%20on-Solana-9945FF?style=flat&logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

A decentralized autonomous organization (DAO) built on Solana that transforms internet memes into tradeable tokens through community governance. RootsDAO is the first democratized meme credit union where members collectively invest in meme culture.

## 🌟 About RootsDAO

RootsDAO represents the rebirth of the Roots community. When the original developer departed, the community refused to let the project die. This re-launch transforms Roots into a true democratized meme credit union where the community—not a single developer—controls the future.

### Key Principles

- **Community Ownership**: Transfer control from individual to collective
- **Sustainable Model**: Revenue generation through meme token launches
- **True Decentralization**: Democratic governance with anti-whale protections
- **Proven Community**: Loyal holders who stayed through adversity

## 🚀 Features

### Core Functionality
- **Wallet Integration**: Connect with Solana wallets (Phantom, Solflare, Torus, etc.)
- **Token Verification**: Check ROOTS token holdings and access levels
- **Proposal System**: Create proposals for meme tokenization
- **Voting Mechanism**: Vote on proposals by burning ROOTS tokens (1 ROOTS = 1 Vote)
- **Token Locking**: Lock tokens to gain governance access rights
- **Professional UI**: Modern glassmorphism design with responsive mobile support

### Governance Model

**Tier 1: Access Rights (Locking)**
- Vote on Proposals: Lock 5,000 ROOTS (at least 1 week before vote and for more than 30 days)
- Submit Proposals: Lock 10,000 ROOTS (at least 1 week before submission and for more than 30 days)

**Tier 2: Voting Power (Burning)**
- 1 ROOTS = 1 Vote
- Burned tokens are permanently removed from circulation
- Progressive vote decay prevents whale domination

## 📋 Tokenomics

### Token Distribution
- **55% (550M ROOTS)**: Pump.fun Public Liquidity Pool
- **35% (350M ROOTS)**: Community Holders
- **10% (100M ROOTS)**: DAO Treasury

### Development Team Allocation
- **10% of Treasury (10M ROOTS)** distributed over 9 months:
  - Month 3: 3.33M ROOTS (33.3%)
  - Month 6: 3.33M ROOTS (33.3%)
  - Month 9: 3.34M ROOTS (33.4%)

### Fee Allocation (Post Platform Launch)
- **50%**: DAO Treasury
- **30%**: Buyback & Burn
- **20%**: Staking Rewards

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Wallet Adapter
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Solana wallet (Phantom, Solflare, etc.)
- Basic understanding of Solana blockchain

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yuseless-1/rootsdao.github.io.git
   cd root5-dao-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
root5-dao-app/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── create/            # Create proposal page
│   │   ├── proposals/         # View proposals page
│   │   ├── verify/            # Token verification page
│   │   ├── vote/              # Voting interface page
│   │   ├── whitepaper/        # Whitepaper page
│   │   ├── globals.css        # Global styles with glassmorphism
│   │   ├── layout.tsx         # Root layout with wallet provider
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── Header.tsx         # Navigation header with mobile menu
│   │   ├── WalletButton.tsx  # Wallet connection button
│   │   ├── TokenVerification.tsx
│   │   ├── CreateProposal.tsx
│   │   ├── ProposalsList.tsx
│   │   ├── VotingInterface.tsx
│   │   └── Whitepaper.tsx    # Comprehensive whitepaper component
│   ├── hooks/                 # Custom React hooks
│   │   ├── useTokenBalance.ts
│   │   ├── useVoting.ts
│   │   └── useProposals.ts
│   ├── lib/                   # Utility libraries
│   │   └── wallet.tsx         # Wallet context provider
│   └── types/                  # TypeScript type definitions
│       └── proposal.ts
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Solana Network (devnet, testnet, or mainnet-beta)
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# ROOTS Token Mint Address (update with actual address)
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=your_token_mint_address_here

# RPC Endpoint (optional, uses default if not provided)
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

### Token Contract Setup

1. **Update Token Mint Address**: Replace placeholder addresses in:
   - `src/hooks/useTokenBalance.ts`
   - `src/hooks/useVoting.ts`
   - `src/hooks/useProposals.ts`

2. **Network Configuration**: Update in `src/lib/wallet.tsx`:
   ```typescript
   const network = WalletAdapterNetwork.Mainnet; // For production
   ```

## 🎨 Design System

### Glassmorphism Theme

The application uses a custom glassmorphism design system:

- **Glass Effect**: `glass-effect` - Standard glassmorphism with blur and transparency
- **Strong Glass**: `glass-effect-strong` - More pronounced blur and borders
- **Subtle Glass**: `glass-effect-subtle` - Light glass effect for backgrounds

### Mobile Responsiveness

- Responsive typography (smaller fonts on mobile)
- Mobile-first navigation menu
- Touch-optimized interactions
- Adaptive layouts for all screen sizes

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard

### Deploy to GitHub Pages

1. Build the application:
   ```bash
   npm run build
   ```

2. Export static files:
   ```bash
   npm run export
   ```

3. Push to `gh-pages` branch

## 📚 Documentation

- [Whitepaper](./src/components/Whitepaper.tsx) - Comprehensive project documentation
- [Architecture Guide](./docs/ARCHITECTURE.md) - Technical architecture details
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deployment instructions
- [Contributing Guide](./docs/CONTRIBUTING.md) - How to contribute

## 🔐 Security

### Best Practices

- Never commit private keys or sensitive data
- Use environment variables for configuration
- Validate all user inputs
- Implement rate limiting for API calls
- Regular security audits of smart contracts

### Known Limitations

- Currently uses mock data for proposals (smart contracts pending)
- Token burning mechanism requires smart contract integration
- Treasury management requires PDA setup

## 🗺️ Roadmap

### Week 1-2 (November 2025) - Re-Launch & Foundation
- ✅ ROOTS re-launch announcement
- ✅ DAO treasury acquisition (100M ROOTS)
- ✅ Token locking contract deployment
- ✅ Governance website launch

### Month 2-3 (Dec 2025 - Jan 2026) - Governance Activation
- Full voting dApp launch
- First governance proposals
- Security audit completion
- First development team distribution (3.33M ROOTS)

### Month 4-6 (Feb - Apr 2026) - Credit Union Expansion
- First community-approved meme launches
- Revenue generation begins
- Reputation system deployment
- Second development team distribution (3.33M ROOTS)

### Month 7-9 (May - Jul 2026) - Full Decentralization
- Complete PDA treasury control
- Advanced governance features
- Final development team distribution (3.34M ROOTS)

### Month 10+ (Aug 2026+) - Ecosystem Growth
- Multi-chain exploration
- RootsDAO Launchpad development
- Strategic partnerships

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**Important**: Participation in RootsDAO involves significant risks. ROOTS tokens are utility tokens for governance purposes and do not represent equity, securities, or investment contracts. Only participate with funds you can afford to lose entirely.

See the [Whitepaper](./src/components/Whitepaper.tsx) for complete risk disclosures.

## 📞 Support & Community

- **Website**: [https://www.rootsdao.com](https://www.rootsdao.com)
- **Twitter**: [@rootsdao](https://x.com/rootsdao)
- **Discord**: [Join our Discord](https://discord.gg/rootsdao)
- **Telegram**: [Join our Telegram](https://t.me/rootsdao)

## 🙏 Acknowledgments

- Built on [Solana](https://solana.com)
- Powered by [Next.js](https://nextjs.org)
- Community-driven development

---

**RootsDAO** - The Democratized Meme Credit Union • Built on Solana • Powered by Members
