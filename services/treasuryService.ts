export interface TreasuryAsset {
  symbol:   string;
  name:     string;
  mint:     string | null;
  balance:  number;
  decimals: number;
  usdPrice: number;
  valueUsd: number;
  color:    string;
}

export interface TreasuryData {
  vault:         string;
  assets:        TreasuryAsset[];
  totalValueUsd: number;
  fetchedAt:     string;
}

export async function fetchTreasury(): Promise<TreasuryData | null> {
  try {
    const resp = await fetch('/api/treasury');
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

export function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}
