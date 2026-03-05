# Root5 DAO — Governance Platform

A decentralized governance application for the Root5 ecosystem. Community members hold ROOT5 tokens and use them to vote on proposals, track the live on-chain treasury, and steer the future of Root5's modular liquidity infrastructure.

---

## Features

- **Token-Gated Governance** — Hold ROOT5 tokens to participate. Voting requires 5M ROOT5; creating proposals requires 10M ROOT5. Balances are verified live on-chain at the time of each action — no whitelist to maintain.
- **Multi-Chain Wallet Support** — Connect MetaMask (Ethereum, BSC, Arbitrum, Base) or Phantom (Solana). ROOT5 is checked on whichever chain you connect.
- **Secure Server-Side Auth** — All votes and proposals are submitted via nonce-based signatures. The server verifies the wallet signature before writing to the database — no client can forge a vote.
- **Live Treasury** — The Treasury page fetches live SOL + SPL token balances directly from the Squads multisig vault via Solana RPC and prices from Jupiter. No manual updates needed.
- **Proposal Lifecycle** — Create, view, and vote on proposals. Results are stored in Supabase with full vote history and per-wallet vote tracking.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS (CDN) |
| Routing | React Router v7 |
| Charts | Recharts |
| Backend | Vercel Serverless Functions (Node 20, ESM) |
| Database | Supabase (PostgreSQL + RLS) |
| EVM Wallets | ethers v6 (MetaMask) |
| Solana Wallet | tweetnacl + bs58 (Phantom) |
| Treasury Data | Solana RPC + Jupiter Price API |
| Multisig | Squads Protocol |

---

## Project Structure

```
root5app-main/
├── api/                     # Vercel serverless functions
│   ├── _lib.js              # Shared: sig verify, token balance, RPC helpers
│   ├── nonce.js             # GET /api/nonce — issues one-time auth nonces
│   ├── vote.js              # POST /api/vote — verifies sig + balance, records vote
│   ├── proposal.js          # POST /api/proposal — verifies sig + balance, creates proposal
│   └── treasury.js          # GET /api/treasury — live Squads vault balances + prices
├── supabase/
│   └── schema.sql           # Full DB schema — paste into Supabase SQL editor
├── components/
│   ├── Navbar.tsx
│   ├── WalletModal.tsx
│   └── NewProposalForm.tsx
├── pages/
│   ├── Home.tsx             # Dashboard with live treasury TVL
│   ├── Proposals.tsx        # Proposal list + creation
│   ├── Voting.tsx           # Per-proposal voting
│   ├── Treasury.tsx         # Live treasury page (Squads + Jupiter)
│   └── Updates.tsx          # Ecosystem changelog
├── services/
│   ├── supabasePublic.ts    # Public reads (proposals, votes)
│   └── treasuryService.ts   # Treasury fetch + formatUsd
├── types.ts
├── App.tsx                  # Wallet connect + nonce sign-in
└── .env.example             # All required env vars documented
```

---

## Deploying to Vercel

### 1. Fork / clone this repo and push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_ORG/root5app.git
git push -u origin main
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. In the SQL editor, paste the full contents of `supabase/schema.sql` and run it
3. Note your **Project URL** and **anon key** (Project Settings → API)
4. Note your **service_role key** (keep this secret — server only)

### 3. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select your repository
3. Framework preset: **Vite**
4. Add the following environment variables in **Project Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key (secret) |
| `VITE_SUPABASE_URL` | Same Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SQUADS_VAULT_ADDRESS` | `7qcxTk4kGdiGUxD7T59tQygJToe4rC4F7GyTTyYYyPMK` |
| `EVM_RPC_ETHEREUM` | (optional) Ethereum RPC URL |
| `EVM_RPC_BSC` | (optional) BSC RPC URL |
| `EVM_RPC_ARBITRUM` | (optional) Arbitrum RPC URL |
| `EVM_RPC_BASE` | (optional) Base RPC URL |
| `SOLANA_RPC` | (optional) Solana RPC URL |

5. Deploy

---

## Local Development

Requires [Node.js](https://nodejs.org) and the [Vercel CLI](https://vercel.com/docs/cli).

```bash
npm install
cp .env.example .env
# Fill in your values in .env
vercel dev
```

> Use `vercel dev` (not `npm run dev`) so that the `/api` serverless functions are available locally alongside the Vite frontend.

---

## Governance Rules

| Action | Required ROOT5 Balance |
|---|---|
| Cast a vote | 5,000,000 ROOT5 |
| Create a proposal | 10,000,000 ROOT5 |

Thresholds are stored in the `governance_config` table and can be updated via Supabase without redeployment.

ROOT5 token address: `AZEqLUaeDb3u6FnGVcLakprwgmk6bD3GPGzNXBZ1pump`

---

## Security Notes

- The `SUPABASE_SERVICE_ROLE_KEY` must **never** be exposed to the browser. It is only used in Vercel serverless functions.
- All user-facing writes (votes, proposals) require a valid one-time nonce and matching wallet signature.
- Database RLS prevents any direct client-side writes to protected tables.
- Nonces expire after 5 minutes and are single-use.
