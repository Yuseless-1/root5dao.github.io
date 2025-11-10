'use client';

import { useState, useEffect } from 'react';

export const useTelegramMembers = () => {
  const [memberCount, setMemberCount] = useState<number>(1438); // Default fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/telegram');
        
        if (!response.ok) {
          throw new Error('Failed to fetch member count');
        }
        
        const data = await response.json();
        setMemberCount(data.count);
        setError(null);
      } catch (err) {
        console.error('Error fetching Telegram members:', err);
        setError('Failed to load member count');
        // Keep default value on error
      } finally {
        setLoading(false);
      }
    };

    fetchMemberCount();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMemberCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    memberCount,
    loading,
    error,
  };
};

