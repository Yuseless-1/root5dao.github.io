'use client';

import { useState, useEffect } from 'react';

export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
}

export const useTokenPrice = () => {
  const [priceData, setPriceData] = useState<TokenPriceData>({
    price: 0.001,
    priceChange24h: 0,
    volume24h: 0,
    liquidity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/token-price');
        
        if (!response.ok) {
          throw new Error('Failed to fetch token price');
        }
        
        const data = await response.json();
        setPriceData({
          price: data.price || 0,
          priceChange24h: data.priceChange24h || 0,
          volume24h: data.volume24h || 0,
          liquidity: data.liquidity || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching token price:', err);
        setError('Failed to load token price');
        // Keep default value on error
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Refresh every 1 minute (price updates frequently)
    const interval = setInterval(fetchPrice, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    priceData,
    loading,
    error,
  };
};


