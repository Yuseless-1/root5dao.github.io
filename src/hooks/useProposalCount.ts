'use client';

import { useState, useEffect } from 'react';

export const useProposalCount = () => {
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposalCount = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/proposals/count');
        
        if (!response.ok) {
          throw new Error('Failed to fetch proposal count');
        }
        
        const data = await response.json();
        setProposalCount(data.total || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching proposal count:', err);
        setError('Failed to load proposal count');
        // Keep default value on error
      } finally {
        setLoading(false);
      }
    };

    fetchProposalCount();
    
    // Refresh every 2 minutes (more frequent since proposals can change often)
    const interval = setInterval(fetchProposalCount, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    proposalCount,
    loading,
    error,
  };
};


