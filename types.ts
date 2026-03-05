
export enum ProposalStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  PASSED = 'Passed',
  REJECTED = 'Rejected',
  EXECUTED = 'Executed',
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  createdAt: string;
  expiresAt: string;
  budget?: number;
  subject?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isSigned: boolean;
  chain: 'ethereum' | 'bsc' | 'arbitrum' | 'base' | 'solana' | null;
}

export interface DevUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: 'Core' | 'UI' | 'Infrastructure' | 'Security';
}

export interface TreasuryAsset {
  symbol:   string;
  name:     string;
  balance:  number;
  valueUsd: number;
  color:    string;
  mint?:     string | null;
  decimals?: number;
  usdPrice?: number;
}
