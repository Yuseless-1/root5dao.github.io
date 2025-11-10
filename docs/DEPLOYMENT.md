# RootsDAO Deployment Guide

This guide covers deploying the RootsDAO application to various platforms.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Account on deployment platform (Vercel, Netlify, etc.)

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Yuseless-1/rootsdao.github.io.git
cd root5-dao-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=your_token_mint_address
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Production Build

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to test the production build.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (for first deployment)
- Project name? `rootsdao` (or your preferred name)
- Directory? `./` (current directory)
- Override settings? **No**

#### Step 4: Configure Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following:
   - `NEXT_PUBLIC_SOLANA_NETWORK` = `mainnet-beta` (or `devnet` for testing)
   - `NEXT_PUBLIC_TOKEN_MINT_ADDRESS` = Your token mint address
   - `NEXT_PUBLIC_RPC_ENDPOINT` = Your RPC endpoint (optional)

#### Step 5: Redeploy

After adding environment variables, redeploy:

```bash
vercel --prod
```

### Option 2: Netlify

#### Step 1: Install Netlify CLI

```bash
npm i -g netlify-cli
```

#### Step 2: Login

```bash
netlify login
```

#### Step 3: Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Step 4: Deploy

```bash
netlify deploy --prod
```

### Option 3: GitHub Pages

#### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Step 2: Update package.json

Add to `scripts`:

```json
{
  "scripts": {
    "export": "next export",
    "deploy": "npm run build && npm run export && gh-pages -d out"
  }
}
```

#### Step 3: Configure next.config.ts

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

#### Step 4: Deploy

```bash
npm run deploy
```

### Option 4: Docker

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Step 2: Build Docker Image

```bash
docker build -t rootsdao .
```

#### Step 3: Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta \
  -e NEXT_PUBLIC_TOKEN_MINT_ADDRESS=your_address \
  rootsdao
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network | `mainnet-beta`, `devnet`, `testnet` |
| `NEXT_PUBLIC_TOKEN_MINT_ADDRESS` | ROOTS token mint address | `YourTokenMintAddress...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_RPC_ENDPOINT` | Custom RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | `GA-XXXXX-X` |

## Network Configuration

### Devnet (Testing)

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

### Mainnet (Production)

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

**Note**: For production, consider using a private RPC endpoint (Helius, QuickNode, etc.) for better performance and rate limits.

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL certificates

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records
4. Netlify provides SSL automatically

### GitHub Pages

1. Go to Repository Settings → Pages
2. Set custom domain
3. Add CNAME file to repository
4. Configure DNS records

## Performance Optimization

### 1. Enable Compression

Vercel and Netlify enable compression automatically. For other platforms:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. CDN Configuration

- Use Vercel Edge Network (automatic)
- Configure Cloudflare for additional caching
- Enable image optimization

### 3. Monitoring

Set up monitoring tools:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking
- **Google Analytics**: User analytics

## Security Checklist

- [ ] Environment variables properly configured
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] Error messages don't expose sensitive data
- [ ] Dependencies up to date
- [ ] Security headers configured

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- Solution: Run `npm install` to ensure all dependencies are installed

**Error**: `TypeScript errors`
- Solution: Fix TypeScript errors or adjust `tsconfig.json`

### Runtime Errors

**Error**: `Wallet connection fails`
- Check network configuration
- Verify RPC endpoint is accessible
- Check browser console for detailed errors

**Error**: `Token balance not loading`
- Verify token mint address is correct
- Check RPC endpoint connectivity
- Verify wallet is connected

### Performance Issues

**Slow page loads**
- Enable compression
- Optimize images
- Use CDN for static assets
- Check RPC endpoint performance

## Rollback Strategy

### Vercel

1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Netlify

1. Go to Deploys tab
2. Find previous deployment
3. Click "Publish deploy"

### Manual Rollback

```bash
git checkout <previous-commit-hash>
npm run build
# Redeploy using your platform's method
```

## Continuous Deployment

### GitHub Actions (Vercel)

Vercel automatically deploys on push to main branch. No additional setup needed.

### GitHub Actions (Other Platforms)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run deploy
```

## Post-Deployment

1. **Test All Features**
   - Wallet connection
   - Token verification
   - Proposal creation
   - Voting mechanism

2. **Monitor Performance**
   - Check page load times
   - Monitor error rates
   - Track user analytics

3. **Update Documentation**
   - Update README with production URL
   - Document any deployment-specific configurations

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Open an issue on GitHub

---

**Next Steps**: After deployment, proceed with smart contract integration and testing.




