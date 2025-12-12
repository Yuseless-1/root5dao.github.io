'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MerchPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to external merch store
    window.location.href = 'https://merch.root5dao.com/';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-lg mb-4">Redirecting to merch store...</p>
        <a 
          href="https://merch.root5dao.com/" 
          className="text-green-400 hover:text-green-300 underline"
        >
          Click here if you are not redirected automatically
        </a>
      </div>
    </div>
  );
}
