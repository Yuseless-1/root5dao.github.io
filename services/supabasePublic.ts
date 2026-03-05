import { Proposal, ProposalStatus } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function publicHeaders(): HeadersInit {
  return {
    'apikey': SUPABASE_ANON_KEY ?? '',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY ?? ''}`,
  };
}

function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function mapStatusToEnum(status: string): ProposalStatus {
  const map: Record<string, ProposalStatus> = {
    Active:   ProposalStatus.ACTIVE,
    Pending:  ProposalStatus.PENDING,
    Passed:   ProposalStatus.PASSED,
    Rejected: ProposalStatus.REJECTED,
    Executed: ProposalStatus.EXECUTED,
  };
  return map[status] ?? ProposalStatus.PENDING;
}

function mapRow(row: Record<string, unknown>): Proposal {
  return {
    id:           row.id as string,
    title:        row.title as string,
    description:  row.description as string,
    proposer:     row.creator_wallet as string,
    status:       mapStatusToEnum(row.status as string),
    votesFor:     Number(row.votes_for ?? 0),
    votesAgainst: Number(row.votes_against ?? 0),
    votesAbstain: Number(row.votes_abstain ?? 0),
    createdAt:    (row.created_at as string)?.split('T')[0] ?? '',
    expiresAt:    (row.expires_at as string)?.split('T')[0] ?? '',
  };
}

export async function fetchProposals(): Promise<Proposal[]> {
  if (!isConfigured()) return [];
  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/proposals?order=created_at.desc&select=*`,
      { headers: publicHeaders() }
    );
    if (!resp.ok) return [];
    const rows: Record<string, unknown>[] = await resp.json();
    return rows.map(mapRow);
  } catch {
    return [];
  }
}

export async function fetchProposal(id: string): Promise<Proposal | null> {
  if (!isConfigured()) return null;
  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/proposals?id=eq.${encodeURIComponent(id)}&select=*`,
      { headers: publicHeaders() }
    );
    if (!resp.ok) return null;
    const rows: Record<string, unknown>[] = await resp.json();
    return rows[0] ? mapRow(rows[0]) : null;
  } catch {
    return null;
  }
}
