'use client';

import { useState, useEffect } from 'react';

export const useTokenHolders = () => {
  const [holderCount, setHolderCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolderCount = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/token-holders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch holder count');
        }
        
        const data = await response.json();
        setHolderCount(data.count);
        setError(null);
      } catch (err) {
        console.error('Error fetching token holders:', err);
        setError('Failed to load holder count');
        // Keep default value on error
      } finally {
        setLoading(false);
      }
    };

    fetchHolderCount();
    
    // Refresh every 10 minutes (longer than Telegram since blockchain queries are slower)
    const interval = setInterval(fetchHolderCount, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    holderCount,
    loading,
    error,
  };
};

