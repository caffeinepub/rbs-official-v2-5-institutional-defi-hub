import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertCircle, Newspaper, Globe, Zap, BarChart3, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { useParallax } from '@/hooks/useParallax';

export default function MarketPulsePage() {
  const { offset } = useParallax(0.3);
  
  const [marketNarrative, setMarketNarrative] = useState({
    overall: 'Bullish Momentum',
    sentiment: 78,
    volume: 'High',
    volatility: 'Moderate',
  });

  const [sentimentPulse, setSentimentPulse] = useState([
    { source: 'Social Media', score: 82, trend: 'up' },
    { source: 'News Outlets', score: 75, trend: 'up' },
    { source: 'On-Chain Data', score: 68, trend: 'neutral' },
    { source: 'Institutional Flow', score: 71, trend: 'up' },
  ]);

  const [macroEvents, setMacroEvents] = useState([
    {
      title: 'Federal Reserve Policy Update',
      impact: 'High',
      sentiment: 'Positive',
      time: '2 hours ago',
      description: 'Interest rate decision signals dovish stance, supporting risk assets',
    },
    {
      title: 'Major Exchange Listing Announcement',
      impact: 'Medium',
      sentiment: 'Positive',
      time: '5 hours ago',
      description: 'Leading DeFi protocol secures tier-1 exchange listing',
    },
    {
      title: 'Regulatory Clarity in Key Market',
      impact: 'High',
      sentiment: 'Positive',
      time: '8 hours ago',
      description: 'New framework provides institutional confidence boost',
    },
  ]);

  const [liveDataFeed, setLiveDataFeed] = useState([
    { asset: 'BTC', price: 67234.50, change: 2.34, volume: '28.4B' },
    { asset: 'ETH', price: 3456.78, change: 3.12, volume: '15.2B' },
    { asset: 'SOL', price: 145.23, change: -1.45, volume: '2.8B' },
    { asset: 'BNB', price: 412.67, change: 1.89, volume: '1.9B' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketNarrative(prev => ({
        ...prev,
        sentiment: Math.max(50, Math.min(95, prev.sentiment + (Math.random() - 0.5) * 3)),
      }));

      setSentimentPulse(prev => prev.map(item => ({
        ...item,
        score: Math.max(50, Math.min(95, item.score + (Math.random() - 0.5) * 2)),
      })));

      setLiveDataFeed(prev => prev.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() - 0.5) * 0.002),
        change: item.change + (Math.random() - 0.5) * 0.1,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="max-w-7xl mx-auto">
          <SmokySectionTransition>
            <div className="text-center mb-16 animate-fade-in-up" style={{ transform: `translateY(${offset.y * 0.5}px)` }}>
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8 animate-pulse">
                <Activity className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 tracking-tight leading-tight metallic-text-hero">
                Market Pulse
              </h1>
              <p className="text-xl metallic-text-secondary font-inter leading-relaxed max-w-3xl mx-auto">
                Real-time market narratives, sentiment pulses, and macro event tracking for informed decision-making
              </p>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={200}>
            <div className="glass-card-gold p-10 mb-12 glow-border animate-fade-in-up animation-delay-200">
              <div className="flex items-center gap-4 mb-8">
                <Globe className="h-8 w-8 text-gold" />
                <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Market Narrative Snapshot</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-inter metallic-text text-lg">Overall Sentiment</span>
                    <span className="text-2xl font-poppins font-bold text-gold">{marketNarrative.overall}</span>
                  </div>
                  <Progress value={marketNarrative.sentiment} className="h-3 mb-2" />
                  <div className="flex items-center justify-between text-sm metallic-text-secondary">
                    <span>Sentiment Score</span>
                    <span className="font-bold text-gold">{marketNarrative.sentiment.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm metallic-text-secondary mb-2">Market Volume</p>
                      <p className="text-2xl font-poppins font-bold text-gold">{marketNarrative.volume}</p>
                    </div>
                    <div>
                      <p className="text-sm metallic-text-secondary mb-2">Volatility</p>
                      <p className="text-2xl font-poppins font-bold text-gold">{marketNarrative.volatility}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm metallic-text-secondary">
                <Activity className="h-5 w-5 animate-pulse text-gold" />
                <span>Live market narrative • Updated every 3 seconds</span>
              </div>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={400}>
            <div className="glass-card p-10 mb-12 glow-border animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-4 mb-8">
                <BarChart3 className="h-8 w-8 text-gold" />
                <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Sentiment Pulse</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sentimentPulse.map((item, index) => (
                  <div key={index} className="bg-white/40 rounded-lg p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-inter metallic-text text-lg">{item.source}</span>
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : item.trend === 'down' ? (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      ) : (
                        <Activity className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <Progress value={item.score} className="h-3 mb-2" />
                    <div className="flex items-center justify-between text-sm metallic-text-secondary">
                      <span>Sentiment Score</span>
                      <span className="font-bold text-gold">{item.score.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={600}>
            <div className="glass-card p-10 mb-12 glow-border animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-4 mb-8">
                <Newspaper className="h-8 w-8 text-gold" />
                <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Macro Event Cards</h2>
              </div>

              <div className="space-y-4">
                {macroEvents.map((event, index) => (
                  <div key={index} className="bg-white/40 rounded-lg p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-poppins font-bold text-gold">{event.title}</h3>
                          <Badge variant="outline" className={`${
                            event.impact === 'High' ? 'text-red-600 border-red-600/30' : 'text-yellow-600 border-yellow-600/30'
                          }`}>
                            {event.impact} Impact
                          </Badge>
                        </div>
                        <p className="metallic-text-secondary font-inter text-base leading-relaxed mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm metallic-text-secondary">
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {event.time}
                          </span>
                          <Badge variant="outline" className={`${
                            event.sentiment === 'Positive' ? 'text-green-600 border-green-600/30' : 'text-red-600 border-red-600/30'
                          }`}>
                            {event.sentiment}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={800}>
            <div className="glass-card-gold p-10 glow-border animate-fade-in-up animation-delay-800">
              <div className="flex items-center gap-4 mb-8">
                <DollarSign className="h-8 w-8 text-gold" />
                <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Live Data Feed</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {liveDataFeed.map((item, index) => (
                  <div key={index} className="bg-white/40 rounded-lg p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-poppins font-bold text-gold">{item.asset}</span>
                      {item.change >= 0 ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <p className="text-3xl font-inter font-bold metallic-text mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-bold ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                      </span>
                      <span className="metallic-text-secondary">Vol: {item.volume}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm metallic-text-secondary">
                <Zap className="h-5 w-5 animate-pulse text-gold" />
                <span>Real-time price updates • Refreshed every 3 seconds</span>
              </div>
            </div>
          </SmokySectionTransition>
        </div>
      </div>
    </div>
  );
}
