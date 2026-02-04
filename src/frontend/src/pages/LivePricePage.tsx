import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity, Bell, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function LivePricePage() {
  const [prices, setPrices] = useState([
    { asset: 'BTC', price: 45230.50, change24h: 3.2, volume: 28500000000, marketCap: 885000000000 },
    { asset: 'ETH', price: 2890.75, change24h: 5.1, volume: 15200000000, marketCap: 347000000000 },
    { asset: 'BNB', price: 312.40, change24h: -1.8, volume: 1850000000, marketCap: 48000000000 },
    { asset: 'SOL', price: 98.65, change24h: 7.3, volume: 2340000000, marketCap: 42000000000 },
    { asset: 'XRP', price: 0.52, change24h: 2.1, volume: 1120000000, marketCap: 28000000000 },
    { asset: 'ADA', price: 0.48, change24h: -0.5, volume: 890000000, marketCap: 17000000000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: p.price * (1 + (Math.random() - 0.5) * 0.002),
        change24h: p.change24h + (Math.random() - 0.5) * 0.1,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <DollarSign className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold tracking-tight leading-tight metallic-text-hero mb-8">
              Live Price Overview
            </h1>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed max-w-3xl mx-auto">
              Real-time price dashboard for all 20 supported assets
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gold/70 mt-6">
              <Activity className="h-6 w-6 animate-pulse" />
              <span className="font-inter tracking-wide">Live updates • Refreshed every 3 seconds</span>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in-up animation-delay-200">
            {prices.map((item, index) => (
              <div key={index} className="glass-card p-8 glow-border transition-all duration-700 hover:scale-[1.02]">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                      <span className="text-2xl font-poppins font-bold text-gold">{item.asset}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-poppins font-bold metallic-text">{item.asset}</h3>
                      <p className="text-sm metallic-text-secondary font-inter">Cryptocurrency</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm metallic-text-secondary mb-2 font-inter">Current Price</p>
                    <p className="text-3xl font-inter font-bold text-gold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm metallic-text-secondary mb-2 font-inter">24h Change</p>
                    <div className="flex items-center gap-2">
                      {item.change24h >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`text-2xl font-inter font-bold ${
                        item.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm metallic-text-secondary mb-2 font-inter">24h Volume</p>
                    <p className="text-xl font-inter font-bold metallic-text">
                      ${(item.volume / 1000000000).toFixed(2)}B
                    </p>
                  </div>

                  <div>
                    <p className="text-sm metallic-text-secondary mb-2 font-inter">Market Cap</p>
                    <p className="text-xl font-inter font-bold metallic-text">
                      ${(item.marketCap / 1000000000).toFixed(2)}B
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 animate-fade-in-up animation-delay-400">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-10 tracking-tight">
              Market Heat Map
            </h2>
            <div className="glass-card-gold p-10 glow-border">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {prices.map((item, index) => (
                  <div key={index} className={`p-6 rounded-xl border-2 transition-all duration-700 ${
                    item.change24h >= 5 ? 'bg-green-100 border-green-300' :
                    item.change24h >= 0 ? 'bg-green-50 border-green-200' :
                    item.change24h <= -5 ? 'bg-red-100 border-red-300' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <p className="text-lg font-poppins font-bold metallic-text mb-2">{item.asset}</p>
                    <p className={`text-2xl font-inter font-bold ${
                      item.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
