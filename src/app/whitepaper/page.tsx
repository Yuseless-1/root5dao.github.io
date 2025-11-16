'use client';

import Header from '@/components/Header';
import { useEffect } from 'react';

export default function WhitepaperPage() {
  useEffect(() => {
    // Load Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.async = true;
    script.onload = () => {
      // Initialize charts after Chart.js loads
      initCharts();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initCharts = () => {
    // @ts-ignore
    if (typeof Chart === 'undefined') return;

    // Distribution Chart
    // @ts-ignore
    const distChart = document.getElementById('distributionChart');
    if (distChart) {
      // @ts-ignore
      new Chart(distChart, {
        type: 'pie',
        data: {
          labels: ['Pump.fun Liquidity (80%)', 'DAO Treasury (10%)', 'Airdrop (8%)', 'Team (2%)'],
          datasets: [{
            data: [80, 10, 8, 2],
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // Fee Chart
    // @ts-ignore
    const feeChart = document.getElementById('feeChart');
    if (feeChart) {
      // @ts-ignore
      new Chart(feeChart, {
        type: 'bar',
        data: {
          labels: ['Phase 1', 'Phase 2', 'Phase 3'],
          datasets: [{
            label: 'Buyback/Liquidity',
            data: [50, 40, 50],
            backgroundColor: '#10b981'
          }, {
            label: 'Development',
            data: [50, 50, 0],
            backgroundColor: '#8b5cf6'
          }, {
            label: 'Marketing',
            data: [0, 10, 0],
            backgroundColor: '#06b6d4'
          }, {
            label: 'Treasury/Staking',
            data: [0, 0, 50],
            backgroundColor: '#f59e0b'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { stacked: true }, y: { stacked: true, max: 100 } }
        }
      });
    }

    // Decay Chart
    // @ts-ignore
    const decayChart = document.getElementById('decayChart');
    if (decayChart) {
      // @ts-ignore
      new Chart(decayChart, {
        type: 'line',
        data: {
          labels: ['10K', '50K', '100K', '200K', '500K', '1M'],
          datasets: [{
            label: 'Tokens Burned',
            data: [10, 50, 100, 200, 500, 1000],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true
          }, {
            label: 'Effective Votes',
            data: [10, 42, 72, 132, 252, 352],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  };

  return (
    <>
      <Header />
      <style jsx global>{`
        .whitepaper-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .whitepaper-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #e5e7eb;
          background: #0a0a0a;
          padding-top: 64px;
        }
        
        .wp-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .wp-hero {
          background: #000000;
          padding: 50px 0;
          text-align: center;
        }
        
        .wp-badge {
          display: inline-block;
          padding: 6px 20px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid #a855f7;
          border-radius: 9999px;
          color: #c084fc;
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .wp-h1 {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(to right, #a855f7, #ec4899, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
        }
        
        .wp-subtitle {
          font-size: 16px;
          color: #9ca3af;
          margin-bottom: 20px;
        }
        
        .wp-section {
          padding: 48px 0;
        }
        
        .wp-section.alt {
          background: #111111;
        }
        
        .wp-h2 {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 20px;
          color: #ffffff;
        }
        
        .wp-h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #f3f4f6;
        }
        
        .wp-h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 16px 0 10px 0;
          color: #e5e7eb;
        }
        
        .wp-p {
          margin-bottom: 10px;
          font-size: 14px;
          color: #d1d5db;
        }
        
        .wp-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }
        
        .wp-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .wp-chart-container {
          position: relative;
          height: 350px;
          margin: 24px 0;
        }
        
        .wp-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .wp-table th, .wp-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 13px;
        }
        
        .wp-table th {
          background: rgba(255, 255, 255, 0.05);
          font-weight: 600;
          color: #f3f4f6;
        }
        
        .wp-table td {
          color: #d1d5db;
        }
        
        .wp-ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .wp-ul li {
          margin-bottom: 6px;
          font-size: 14px;
          color: #d1d5db;
        }
        
        @media (max-width: 768px) {
          .wp-h1 { font-size: 28px; }
          .wp-subtitle { font-size: 14px; }
          .wp-h2 { font-size: 20px; }
          .wp-h3 { font-size: 16px; }
          .wp-h4 { font-size: 14px; }
          .wp-p { font-size: 13px; }
          .wp-ul li { font-size: 13px; }
          .wp-table th, .wp-table td { font-size: 12px; }
        }
      `}</style>

      <div className="whitepaper-container">
        {/* Hero */}
        <div className="wp-hero">
          <div className="wp-container">
            <div className="wp-badge">The Democratized Meme Credit Union • Whitepaper v1.0</div>
            <h1 className="wp-h1">Root5DAO</h1>
            <p className="wp-subtitle">The First Democratized Meme Credit Union on Solana</p>
          </div>
        </div>

        {/* Abstract */}
        <section className="wp-section">
          <div className="wp-container">
            <h2 className="wp-h2">Abstract</h2>
            <div className="wp-card">
              <p className="wp-p">Root5DAO is a decentralized autonomous organization designed to become the premier democratized meme credit union for community-driven meme tokens on Solana. By leveraging a unique two-tiered governance model—token locking for access rights and token burning for voting power—Root5DAO creates a deflationary ecosystem where value accrues to holders through supply reduction and revenue generation.</p>
            </div>
          </div>
        </section>

        {/* Section 1 */}
        <section className="wp-section alt">
          <div className="wp-container">
            <h2 className="wp-h2">1. The Meme Ecosystem Problem</h2>
            <p className="wp-p">The meme coin space represents one of crypto's most vibrant yet problematic sectors. While meme tokens have created billions in market value and passionate communities, they suffer from fundamental structural issues including centralized control, lack of sustainability, and zero formal incubation.</p>
            <p className="wp-p"><strong>Root5DAO solves this by creating a transparent, democratic, and economically sustainable credit union where the community itself makes collective investment decisions.</strong></p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="wp-section">
          <div className="wp-container">
            <h2 className="wp-h2">2. The ROOT5 Token & Governance</h2>
            
            <div className="wp-card">
              <h3 className="wp-h3">Token Specifications</h3>
              <p className="wp-p"><strong>Blockchain:</strong> Solana</p>
              <p className="wp-p"><strong>Total Supply:</strong> 1,000,000,000 ROOT5</p>
              <p className="wp-p"><strong>Launch Mechanism:</strong> Fair launch bonding curve via Pump.fun</p>
            </div>
            
            <div className="wp-card">
              <h3 className="wp-h3">Token Distribution</h3>
              <p className="wp-p"><strong>Initial Structure:</strong> 1 billion ROOT5 tokens minted in Pump.fun liquidity pool. DAO purchases 200M tokens (20%) at launch:</p>
              <div className="wp-chart-container">
                <canvas id="distributionChart"></canvas>
              </div>
              <ul className="wp-ul">
                <li><strong>80% (800M)</strong> - Pump.fun Public Liquidity Pool</li>
                <li><strong>10% (100M)</strong> - DAO Treasury</li>
                <li><strong>8% (80M)</strong> - Community Airdrop to ROOTS holders</li>
                <li><strong>2% (20M)</strong> - Development Team</li>
              </ul>
            </div>
            
            <div className="wp-card">
              <h3 className="wp-h3">Two-Tiered Governance Model</h3>
              <h4 className="wp-h4">Tier 1: Access Rights (Locking)</h4>
              <p className="wp-p">Lock tokens to gain governance access. Locked tokens remain in your ownership.</p>
              <ul className="wp-ul">
                <li><strong>Vote on Proposals:</strong> Lock 5,000 ROOT5 for at least 1 week before vote and for more than 30 days</li>
                <li><strong>Submit Proposals:</strong> Lock 10,000 ROOT5 for at least 1 week before submission and for more than 30 days</li>
              </ul>
              
              <h4 className="wp-h4">Tier 2: Voting Power (Burning)</h4>
              <p className="wp-p"><strong>1 ROOT5 = 1 Vote</strong> - Burned tokens are permanently removed from circulation.</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="wp-section alt">
          <div className="wp-container">
            <h2 className="wp-h2">3. Tokenomics & Revenue Model</h2>
            
            <div className="wp-card">
              <h3 className="wp-h3">Pump.fun Dynamic Creator Fees</h3>
              <p className="wp-p">Root5DAO captures creator fees from launched tokens:</p>
              <ul className="wp-ul">
                <li><strong>0.95%</strong> - Early Stage (Market cap &lt; $300K)</li>
                <li><strong>0.5-0.7%</strong> - Growth Stage ($300K - $1M)</li>
                <li><strong>Scaled</strong> - Maturity ($1M - $20M)</li>
                <li><strong>0.05%</strong> - Mega Cap (&gt; $20M)</li>
                <li><strong>0.5 SOL</strong> - Graduation bonus per token</li>
              </ul>
            </div>
            
            <div className="wp-card">
              <h3 className="wp-h3">Fee Allocation by Phase</h3>
              <div className="wp-chart-container">
                <canvas id="feeChart"></canvas>
              </div>
              <p className="wp-p"><strong>Phase 1 (launch-Bonding):</strong> 50% Buyback to add liquidity, 50% Development</p>
              <p className="wp-p"><strong>Phase 2 (Bonding to Platform Launch):</strong> 40% liquidity, 50% Development, 10% Marketing</p>
              <p className="wp-p"><strong>Phase 3 (Post Platform):</strong> 50% Treasury, 50% "Staking" For holders</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="wp-section">
          <div className="wp-container">
            <h2 className="wp-h2">4. Economic Security & Attack Mitigation</h2>
            
            <div className="wp-card">
              <h3 className="wp-h3">Attack Vector: Whale Domination</h3>
              <p className="wp-p"><strong>Progressive Vote Decay</strong> - Voting power diminishes with concentration:</p>
              <div className="wp-chart-container">
                <canvas id="decayChart"></canvas>
              </div>
              <ul className="wp-ul">
                <li>First 10K tokens: 1.0x multiplier</li>
                <li>10K-50K: 0.8x multiplier</li>
                <li>50K-200K: 0.6x multiplier</li>
                <li>200K-500K: 0.4x multiplier</li>
                <li>500K+: 0.2x multiplier</li>
              </ul>
              <p className="wp-p"><em>Example: Burning 1M tokens yields only 352K effective votes (35% efficiency)</em></p>
            </div>
            
            <div className="wp-card">
              <h3 className="wp-h3">Attack Vector: Sybil Attacks</h3>
              <p className="wp-p">Multiple wallets are economically irrational due to per-wallet locking requirements (50 wallets = 250,000 ROOT5 locked vs 5,000 for single wallet)</p>
            </div>
            
            <div className="wp-card">
              <h3 className="wp-h3">Attack Vector: Meme Virality Verification</h3>
              <p className="wp-p"><strong>Three-Phase Approach:</strong></p>
              <ul className="wp-ul">
                <li><strong>Phase 1 (Mo 1-6):</strong> Community curation and Platform Development</li>
                <li><strong>Phase 2 (Mo 7-12):</strong> Reputation-weighted voting</li>
                <li><strong>Phase 3 (Mo 13+):</strong> Oracle integration with community override</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="wp-section alt">
          <div className="wp-container">
            <h2 className="wp-h2">5. Community Airdrop: The ROOTS Migration</h2>
            
            <div className="wp-card">
              <h3 className="wp-h3">The Story</h3>
              <p className="wp-p">Root5DAO emerges from the community of "Roots," a previous project that was discontinued when its original developer departed. The airdrop rewards those who stayed loyal, making them founding members of this democratized meme credit union.</p>
            </div>
            
            <div className="wp-card">
              <h3 className="wp-h3">Airdrop Details</h3>
              <ul className="wp-ul">
                <li><strong>Snapshot Date:</strong> October 29, 2025 (00:00 UTC)</li>
                <li><strong>Allocation Formula:</strong> ROOT5 = ROOTS × 0.5</li>
                <li><strong>Total Allocation:</strong> 80,000,000 ROOT5</li>
              </ul>
              
              <h4 className="wp-h4">Example Calculations</h4>
              <table className="wp-table">
                <thead>
                  <tr>
                    <th>ROOTS Holdings</th>
                    <th>ROOT5 Airdrop</th>
                    <th>% of Supply</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>100,000</td>
                    <td><strong>50,000</strong></td>
                    <td>0.005%</td>
                  </tr>
                  <tr>
                    <td>1,000,000</td>
                    <td><strong>500,000</strong></td>
                    <td>0.05%</td>
                  </tr>
                  <tr>
                    <td>10,000,000</td>
                    <td><strong>5,000,000</strong></td>
                    <td>0.5%</td>
                  </tr>
                </tbody>
              </table>
              
              <p className="wp-p"><strong>Important:</strong> This is NOT a token swap. ROOTS tokens remain unchanged. ROOT5 is distributed IN ADDITION to existing ROOTS holdings.</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="wp-section">
          <div className="wp-container">
            <h2 className="wp-h2">6. Technology & Roadmap</h2>
            
            <div className="wp-card">
              <h3 className="wp-h3">Technical Architecture</h3>
              <div className="wp-grid-2">
                <div>
                  <h4 className="wp-h4">Smart Contracts</h4>
                  <ul className="wp-ul">
                    <li>ROOT5 SPL Token (via Pump.fun)</li>
                    <li>Token Locking Contract</li>
                    <li>Voting & Proposal System</li>
                    <li>PDA Treasury Management</li>
                    <li>Fee Distribution Contract</li>
                  </ul>
                </div>
                <div>
                  <h4 className="wp-h4">Front-End dApp</h4>
                  <ul className="wp-ul">
                    <li>Wallet integration</li>
                    <li>Proposal browsing & creation</li>
                    <li>Voting interface</li>
                    <li>Token locking dashboard</li>
                    <li>Treasury transparency</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="wp-card">
              <h3 className="wp-h3">Development Roadmap</h3>
              
              <h4 className="wp-h4">Week 1-2 (November 2025) - Genesis Launch</h4>
              <ul className="wp-ul">
                <li>ROOT5 fair launch on Pump.fun</li>
                <li>Community airdrop execution</li>
                <li>Token locking contract deployment</li>
                <li>Governance website launch</li>
              </ul>
              
              <h4 className="wp-h4">Month 2-3 (Dec 2025 - Jan 2026) - Governance Activation</h4>
              <ul className="wp-ul">
                <li>Full voting dApp launch</li>
                <li>First governance proposals</li>
                <li>Security audit completion</li>
                <li>Community growth campaigns</li>
              </ul>
              
              <h4 className="wp-h4">Month 4-6 (Feb - Apr 2026) - Credit Union Expansion</h4>
              <ul className="wp-ul">
                <li>First community-approved meme launches</li>
                <li>Revenue generation begins</li>
                <li>Reputation system deployment</li>
                <li>PDA treasury transition start</li>
              </ul>
              
              <h4 className="wp-h4">Month 7+ (May 2026+) - Full Decentralization</h4>
              <ul className="wp-ul">
                <li>Complete PDA treasury control</li>
                <li>Advanced governance features</li>
                <li>Multi-chain exploration</li>
                <li>Root5DAO Launchpad development</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="wp-section alt">
          <div className="wp-container">
            <h2 className="wp-h2">7. Risk Disclosures</h2>
            
            <div className="wp-card">
              <p className="wp-p"><strong>⚠️ Important Notice:</strong> Participation in Root5DAO involves significant risks. Only participate with funds you can afford to lose entirely.</p>
              
              <h4 className="wp-h4">Key Risks Include:</h4>
              <ul className="wp-ul">
                <li><strong>Platform Dependency:</strong> Revenue depends on Pump.fun's continued operation</li>
                <li><strong>Smart Contract Risk:</strong> Bugs could result in permanent loss of funds</li>
                <li><strong>Regulatory Uncertainty:</strong> DAO tokens may be classified as securities</li>
                <li><strong>Market Volatility:</strong> Token price may experience extreme volatility</li>
                <li><strong>Governance Risk:</strong> Concentrated holdings could enable attacks</li>
                <li><strong>Tax Obligations:</strong> Participants responsible for tax treatment</li>
                <li><strong>No Guarantees:</strong> Roadmap subject to change, no profit expectations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="wp-section">
          <div className="wp-container">
            <h2 className="wp-h2">8. Conclusion: Building the Democratized Meme Credit Union</h2>
            
            <div className="wp-card">
              <p className="wp-p">Root5DAO represents a paradigm shift in how meme tokens are created, curated, and sustained. By combining deflationary tokenomics with democratic governance and sustainable revenue generation, we've built a credit union where creativity meets collective accountability.</p>
              
              <p className="wp-p"><strong>We are not launching another meme coin—we are building a democratized credit union where members collectively invest in meme culture.</strong></p>
              
              <h3 className="wp-h3">Key Features:</h3>
              <ul className="wp-ul">
                <li><strong>Economic Sustainability:</strong> Continuous revenue funding treasury and buybacks</li>
                <li><strong>True Decentralization:</strong> Anti-whale protections and fair governance</li>
                <li><strong>Members First:</strong> Airdrop rewards founding members</li>
                <li><strong>Aligned Incentives:</strong> Success benefits all token holders</li>
              </ul>
              
              <p className="wp-p" style={{ textAlign: 'center', fontSize: '20px', marginTop: '32px' }}>
                <strong>You stayed when others left. You believed in the community when the developer didn't.</strong><br />
                This is your DAO. Let's root for the future together.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#111111', padding: '40px 0', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="wp-container">
            <div className="wp-card">
              <h3 className="wp-h3">Legal Disclaimer</h3>
              <p className="wp-p" style={{ fontSize: '14px' }}>This whitepaper is for informational purposes only and does not constitute financial, investment, legal, or tax advice. ROOT5 tokens are utility tokens for governance purposes. Participation involves significant risks including potential loss of all invested capital. Users should conduct their own research and consult with professionals. Root5DAO operates as an unincorporated association without formal legal entity status.</p>
            </div>
            
            <p className="wp-p"><strong>Root5DAO</strong></p>
            <p className="wp-p">The Democratized Meme Credit Union • Whitepaper v1.0</p>
            <p className="wp-p">Built on Solana • Powered by Members</p>
          </div>
        </footer>
      </div>
    </>
  );
}
