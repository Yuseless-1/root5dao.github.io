# RootsDAO Architecture Documentation

## Overview

RootsDAO is a Next.js-based decentralized application (dApp) built on the Solana blockchain. It implements a two-tiered governance model for community-driven meme token curation and launch.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  (Next.js App Router - React Components)                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Application Layer                          │
│  - React Hooks (useTokenBalance, useVoting, etc.)       │
│  - Wallet Context Provider                              │
│  - Component State Management                           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│            Solana Wallet Adapter                        │
│  - Wallet Connection Management                         │
│  - Transaction Signing                                 │
│  - Network Configuration                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Solana Blockchain                          │
│  - Token Mint (ROOTS)                                   │
│  - Smart Contracts (Locking, Voting, Treasury)          │
│  - RPC Endpoints                                        │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. **Layout Components**

**`Header.tsx`**
- Navigation bar with responsive mobile menu
- Wallet connection button
- Token balance display
- Active route highlighting

**`WalletButton.tsx`**
- Wrapper for Solana Wallet Adapter's WalletMultiButton
- Custom styling integration

#### 2. **Core Feature Components**

**`TokenVerification.tsx`**
- Token balance checking
- Access level determination
- Locking status display

**`CreateProposal.tsx`**
- Proposal creation form
- Image upload handling
- Token locking verification
- Transaction submission

**`ProposalsList.tsx`**
- Proposal listing and filtering
- Vote count display
- Proposal status indicators

**`VotingInterface.tsx`**
- Voting mechanism UI
- Token burning confirmation
- Real-time vote updates

**`Whitepaper.tsx`**
- Comprehensive documentation display
- Interactive charts and visualizations
- Section navigation

### Custom Hooks

#### `useTokenBalance.ts`
```typescript
- Fetches ROOTS token balance for connected wallet
- Calculates access levels (voting, proposal creation)
- Handles loading and error states
```

#### `useVoting.ts`
```typescript
- Manages voting transactions
- Handles token burning for votes
- Updates vote counts
- Transaction confirmation
```

#### `useProposals.ts`
```typescript
- Fetches and manages proposal data
- Handles proposal creation
- Proposal filtering and sorting
```

## Data Flow

### Wallet Connection Flow

```
1. User clicks "Connect Wallet"
   ↓
2. Wallet Adapter shows wallet selection modal
   ↓
3. User selects wallet (Phantom, Solflare, etc.)
   ↓
4. Wallet connection established
   ↓
5. WalletContextProvider updates global state
   ↓
6. Components re-render with wallet info
   ↓
7. Token balance fetched automatically
```

### Voting Flow

```
1. User navigates to voting page
   ↓
2. System checks token lock status
   ↓
3. User selects vote (For/Against)
   ↓
4. User enters amount of tokens to burn
   ↓
5. Transaction created and signed
   ↓
6. Tokens burned on-chain
   ↓
7. Vote count updated
   ↓
8. UI reflects new vote totals
```

### Proposal Creation Flow

```
1. User navigates to create proposal page
   ↓
2. System verifies 10,000 ROOTS locked
   ↓
3. User fills proposal form (title, description, image)
   ↓
4. User submits proposal
   ↓
5. Transaction created (burns proposal bond)
   ↓
6. Proposal added to on-chain registry
   ↓
7. Proposal appears in proposals list
```

## State Management

### Global State (Wallet Context)

```typescript
interface WalletContextType {
  wallet: Wallet | null;
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => void;
}
```

### Component State

- **Local State**: Component-specific UI state (modals, forms, etc.)
- **Server State**: On-chain data fetched via hooks
- **Derived State**: Computed values from other state

## Styling Architecture

### Design System

**Glassmorphism Effects**
- `.glass-effect`: Standard blur and transparency
- `.glass-effect-strong`: Enhanced blur with borders
- `.glass-effect-subtle`: Light background effect

**Color Palette**
- Primary: Purple/Pink gradients
- Accent: Green (success), Red (danger), Blue (info)
- Background: Dark with gradient overlays

**Typography**
- Responsive font sizes (smaller on mobile)
- System font stack for performance

### CSS Architecture

```
globals.css
├── Base styles (reset, body, etc.)
├── Glassmorphism utilities
├── Button styles
├── Input/Form styles
├── Mobile responsive overrides
└── Scrollbar customization
```

## Smart Contract Integration

### Token Contract (ROOTS)

**Mint Address**: `[TO_BE_DEPLOYED]`

**Key Functions**:
- `getBalance(publicKey)`: Fetch token balance
- `burn(amount)`: Burn tokens for voting
- `transfer(to, amount)`: Transfer tokens

### Locking Contract

**Purpose**: Lock tokens for governance access

**Key Functions**:
- `lock(amount, duration)`: Lock tokens
- `unlock()`: Unlock after duration
- `getLockedBalance(publicKey)`: Check locked amount

### Voting Contract

**Purpose**: Manage proposal voting

**Key Functions**:
- `createProposal(data)`: Create new proposal
- `vote(proposalId, amount, direction)`: Cast vote
- `getVotes(proposalId)`: Get vote totals

### Treasury Contract (PDA)

**Purpose**: Manage DAO treasury

**Key Functions**:
- `deposit(amount)`: Add to treasury
- `withdraw(amount, proposalId)`: Withdraw for approved proposals
- `getBalance()`: Check treasury balance

## Security Considerations

### Client-Side Security

1. **Input Validation**: All user inputs validated before submission
2. **Transaction Signing**: Users must explicitly sign all transactions
3. **Error Handling**: Comprehensive error handling and user feedback
4. **Rate Limiting**: Prevent spam and abuse

### Smart Contract Security

1. **Access Control**: Only authorized addresses can execute certain functions
2. **Reentrancy Protection**: Guards against reentrancy attacks
3. **Integer Overflow Protection**: Safe math operations
4. **Audit Requirements**: All contracts must be audited before mainnet

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**: Next.js automatic code splitting
2. **Image Optimization**: Next.js Image component
3. **Lazy Loading**: Components loaded on demand
4. **Memoization**: React.memo for expensive components

### Blockchain Optimizations

1. **RPC Caching**: Cache frequently accessed data
2. **Batch Requests**: Group multiple RPC calls
3. **Connection Pooling**: Reuse RPC connections
4. **Transaction Batching**: Group multiple operations

## Testing Strategy

### Unit Tests
- Component rendering
- Hook logic
- Utility functions

### Integration Tests
- Wallet connection flow
- Transaction submission
- State management

### E2E Tests
- Complete user workflows
- Cross-browser testing
- Mobile responsiveness

## Deployment Architecture

### Development
- Local Next.js dev server
- Solana Devnet
- Hot module replacement

### Staging
- Vercel preview deployment
- Solana Testnet
- Full feature testing

### Production
- Vercel production deployment
- Solana Mainnet
- CDN for static assets
- Monitoring and analytics

## Future Enhancements

1. **Oracle Integration**: External data for meme virality verification
2. **Reputation System**: Track user proposal success rates
3. **Multi-chain Support**: Expand beyond Solana
4. **Mobile App**: Native iOS/Android applications
5. **Advanced Analytics**: Detailed governance metrics

## Dependencies

### Core Dependencies
- `next`: 16.0.1 - React framework
- `react`: 19.2.0 - UI library
- `@solana/web3.js`: 1.98.4 - Solana blockchain interaction
- `@solana/wallet-adapter-react`: 0.15.39 - Wallet integration

### UI Dependencies
- `tailwindcss`: 3.4.18 - CSS framework
- `lucide-react`: 0.548.0 - Icons
- `recharts`: 3.3.0 - Charts
- `framer-motion`: 12.23.24 - Animations

## API Reference

### Wallet Methods

```typescript
connect(): Promise<void>
disconnect(): Promise<void>
signTransaction(transaction: Transaction): Promise<Transaction>
signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
```

### Token Methods

```typescript
getBalance(publicKey: PublicKey): Promise<number>
burn(amount: number): Promise<string>
transfer(to: PublicKey, amount: number): Promise<string>
```

### Proposal Methods

```typescript
createProposal(data: ProposalData): Promise<string>
getProposals(): Promise<Proposal[]>
vote(proposalId: string, amount: number, direction: 'for' | 'against'): Promise<string>
```

---

For more information, see the [main README](../README.md) and [Whitepaper](../src/components/Whitepaper.tsx).




