# Root5 DAO - Next.js Application

A decentralized autonomous organization (DAO) built on Solana that transforms internet memes into tradeable tokens through community voting.

## About

Starting point for the Root5 DAO - now evolved into a full-featured Next.js application with Solana blockchain integration.

## Features

- **Wallet Integration**: Connect with Solana wallets (Phantom, Solflare, Torus)
- **Token Verification**: Check token holdings and access levels
- **Proposal System**: Create proposals for meme tokenization (requires 10 tokens)
- **Voting Mechanism**: Vote on proposals (1 token = 1 vote, tokens are burned)
- **Professional UI**: Modern, responsive design with glass effects and animations
- **Real Meme Integration**: Features authentic Doge, Wojak, and Pepe memes

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Wallet Adapter
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── create/            # Create proposal page
│   ├── proposals/         # View proposals page
│   ├── verify/            # Token verification page
│   ├── vote/              # Voting page
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── TokenVerification.tsx
│   ├── CreateProposal.tsx
│   └── ProposalsList.tsx
├── hooks/                 # Custom React hooks
│   ├── useTokenBalance.ts
│   ├── useVoting.ts
│   └── useProposals.ts
├── lib/                   # Utility libraries
│   └── wallet.tsx         # Wallet context provider
└── types/                 # TypeScript type definitions
    └── proposal.ts
```

## Key Features

### Wallet Connection
- Supports multiple Solana wallets
- Automatic connection persistence
- Wallet state management

### Token Verification
- Real-time token balance checking
- Access level determination
- Minimum token requirements:
  - Voting: 1 token
  - Proposal creation: 10 tokens

### Proposal System
- Create proposals for meme tokenization
- Cost: 10 tokens (burned)
- Image upload support
- Rich text descriptions

### Voting Mechanism
- 1 token = 1 vote
- Tokens are burned when voting
- Real-time vote counting
- Support for "For" and "Against" votes

## Smart Contract Integration

The application integrates with Solana smart contracts for:
- Token balance verification
- Token burning for voting/proposals
- Transaction confirmation

**Note**: Update the `TOKEN_MINT_ADDRESS` constant in the hooks to use your actual token contract address.

## Environment Setup

1. **Update Token Contract**: Replace `12fgghtred233455ggreedd` with your actual token mint address in:
   - `src/hooks/useTokenBalance.ts`
   - `src/hooks/useVoting.ts`
   - `src/hooks/useProposals.ts`

2. **Network Configuration**: Currently set to Solana Devnet. Update in `src/lib/wallet.tsx`:
   ```typescript
   const network = WalletAdapterNetwork.Mainnet; // For production
   ```

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Deploy to Vercel** (recommended):
   ```bash
   npx vercel
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.