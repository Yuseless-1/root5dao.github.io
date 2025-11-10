import { NextResponse } from 'next/server';
import { MOCK_PROPOSALS } from '@/types/proposal';

export async function GET() {
  try {
    // For now, count mock proposals
    // TODO: Replace with actual database/on-chain query when proposals are stored
    const totalProposals = MOCK_PROPOSALS.length;
    
    // Count active proposals
    const activeProposals = MOCK_PROPOSALS.filter(p => p.status === 'active').length;
    
    return NextResponse.json(
      {
        total: totalProposals,
        active: activeProposals,
        source: 'mock_data',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // Cache for 1 minute
        },
      }
    );
  } catch (error) {
    console.error('Error fetching proposal count:', error);
    
    return NextResponse.json(
      {
        total: 0,
        active: 0,
        source: 'error_fallback',
      },
      { status: 200 }
    );
  }
}

