// src/app/page.tsx
'use client'; 

import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { MarketCard } from '../components/MarketCard';
import { CreateMarketForm } from '../components/CreateMarketForm';

export default function Home() {
  const [markets, setMarkets] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/markets');
        const data = await response.json();
        setMarkets(data);
      } catch (error) { 
        console.error("Failed to fetch markets:", error); 
      }
    };
    
    // Fetch immediately and then poll for new data every 5 seconds
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 5000); 
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        <CreateMarketForm />

        <div className="text-center my-12">
          <h2 className="text-4xl font-bold">Open Markets</h2>
          <p className="text-gray-400 mt-2">Place your bet on the future.</p>
        </div>
        
        {markets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {markets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>No open markets found.</p>
            <p>(Once a new market is created, it will appear here.)</p>
          </div>
        )}
      </main>
    </div>
  );
}