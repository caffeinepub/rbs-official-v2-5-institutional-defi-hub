import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { SmokySectionTransition } from './SmokySectionTransition';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MarketSignal {
  asset: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timestamp: string;
}

/**
 * G-MAN Oracle intelligence section displaying simulated market signals
 * with confidence scores, collapsible grounding evidence log showing data
 * sources with reliability metrics, and multi-layered shimmer animations.
 */
export function OracleSection() {
  const [signals, setSignals] = useState<MarketSignal[]>([
    { asset: 'BTC', signal: 'bullish', confidence: 87, timestamp: new Date().toISOString() },
    { asset: 'ETH', signal: 'bullish', confidence: 82, timestamp: new Date().toISOString() },
    { asset: 'SOL', signal: 'neutral', confidence: 65, timestamp: new Date().toISOString() },
  ]);
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((signal) => ({
          ...signal,
          confidence: Math.max(50, Math.min(95, signal.confidence + (Math.random() - 0.5) * 5)),
          timestamp: new Date().toISOString(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return 'text-green-600';
      case 'bearish':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5" />;
      case 'bearish':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <SmokySectionTransition delay={200}>
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Brain className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                G-MAN Oracle Intelligence
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Real-time market intelligence powered by advanced AI algorithms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up animation-delay-200">
              {signals.map((signal) => (
                <div key={signal.asset} className="glass-card-gold p-6 glow-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-poppins font-bold metallic-text">{signal.asset}</h3>
                    <div className={getSignalColor(signal.signal)}>
                      {getSignalIcon(signal.signal)}
                    </div>
                  </div>
                  <Badge
                    variant={signal.signal === 'bullish' ? 'default' : signal.signal === 'bearish' ? 'destructive' : 'secondary'}
                    className="mb-3"
                  >
                    {signal.signal.toUpperCase()}
                  </Badge>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="metallic-text-secondary">Confidence</span>
                      <span className="font-semibold metallic-text">{signal.confidence}%</span>
                    </div>
                    <Progress value={signal.confidence} className="h-2" />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 animate-fade-in-up animation-delay-300">
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-gold" />
                  <h3 className="text-xl font-poppins font-bold metallic-text group-hover:text-gold transition-colors">
                    Grounding Evidence Log
                  </h3>
                </div>
                {showEvidence ? (
                  <ChevronUp className="h-5 w-5 text-gold" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gold" />
                )}
              </button>

              {showEvidence && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  {[
                    { source: 'CoinGecko API', reliability: 98, status: 'Active' },
                    { source: 'Binance WebSocket', reliability: 99, status: 'Active' },
                    { source: 'Twitter Sentiment', reliability: 85, status: 'Active' },
                    { source: 'On-chain Analytics', reliability: 92, status: 'Active' },
                  ].map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gold/20">
                      <div>
                        <p className="font-semibold metallic-text">{source.source}</p>
                        <p className="text-sm metallic-text-secondary">{source.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm metallic-text-secondary">Reliability</p>
                        <p className="font-bold text-gold">{source.reliability}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SmokySectionTransition>
  );
}
