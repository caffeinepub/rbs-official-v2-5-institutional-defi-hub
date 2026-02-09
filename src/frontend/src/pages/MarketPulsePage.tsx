import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, Calendar, BarChart3, Globe } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { PageShell } from '@/components/PageShell';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';

interface SentimentData {
  source: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  change: number;
}

interface MacroEvent {
  title: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export default function MarketPulsePage() {
  const [narrativeSnapshot, setNarrativeSnapshot] = useState({
    headline: 'Crypto Markets Show Strong Recovery Momentum',
    summary: 'Digital assets continue their upward trajectory as institutional adoption accelerates and regulatory clarity improves across major markets.',
    timestamp: new Date().toLocaleString(),
  });

  const [sentimentData, setSentimentData] = useState<SentimentData[]>([
    { source: 'Social Media', sentiment: 'bullish', score: 72, change: 5.2 },
    { source: 'News Outlets', sentiment: 'neutral', score: 58, change: -2.1 },
    { source: 'On-Chain Data', sentiment: 'bullish', score: 81, change: 8.4 },
    { source: 'Trading Volume', sentiment: 'bullish', score: 76, change: 12.3 },
  ]);

  const [macroEvents, setMacroEvents] = useState<MacroEvent[]>([
    {
      title: 'Federal Reserve Interest Rate Decision',
      date: 'Feb 15, 2026',
      impact: 'high',
      description: 'Expected to maintain current rates, potentially bullish for risk assets.',
    },
    {
      title: 'Major Exchange Listing Announcement',
      date: 'Feb 18, 2026',
      impact: 'high',
      description: 'Leading exchange to list multiple new digital assets.',
    },
    {
      title: 'Regulatory Framework Update',
      date: 'Feb 22, 2026',
      impact: 'medium',
      description: 'New guidelines expected to provide clarity on DeFi protocols.',
    },
  ]);

  const [weeklyBrief, setWeeklyBrief] = useState({
    title: 'Weekly Market Brief',
    highlights: [
      'Bitcoin maintains support above $50K with strong institutional inflows',
      'DeFi TVL reaches new all-time high of $120B',
      'Layer-2 solutions see 40% increase in daily active users',
      'Stablecoin market cap grows to $180B amid increased adoption',
    ],
    outlook: 'Bullish momentum expected to continue through Q1 2026',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSentimentData((prev) =>
        prev.map((item) => ({
          ...item,
          score: Math.max(0, Math.min(100, item.score + (Math.random() - 0.5) * 5)),
          change: +(Math.random() * 20 - 10).toFixed(1),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-600';
      case 'bearish':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <>
      <PageHead title="Market Pulse" description="Real-time market insights, sentiment analysis, and macro event tracking for informed trading decisions." />
      <PageShell>
        <div className="space-y-12">
          <SmokySectionTransition>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Activity className="h-10 w-10 text-gold" />
                <h1 className="section-heading">Market Pulse</h1>
              </div>
              <p className="section-description">
                Real-time market insights and sentiment tracking
              </p>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={200}>
            <div className="glass-card-gold p-8 glow-border">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-6 w-6 text-gold" />
                <h2 className="text-2xl font-poppins font-bold metallic-text">Market Narrative Snapshot</h2>
              </div>
              <h3 className="text-xl font-poppins font-bold text-gold mb-4">{narrativeSnapshot.headline}</h3>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-4 text-base">
                {narrativeSnapshot.summary}
              </p>
              <p className="text-sm metallic-text-secondary font-inter">
                Last updated: {narrativeSnapshot.timestamp}
              </p>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={300}>
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-gold" />
                <h2 className="text-2xl font-poppins font-bold metallic-text">Sentiment Pulse</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sentimentData.map((item, index) => (
                  <div key={index} className="glass-card-gold p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-poppins font-bold metallic-text">{item.source}</h3>
                      <span className={`text-sm font-inter font-semibold uppercase ${getSentimentColor(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold-matte to-gold-light transition-all duration-500"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-2xl font-poppins font-bold text-gold">{item.score}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {item.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-inter ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change >= 0 ? '+' : ''}
                        {item.change}% (24h)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={400}>
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-gold" />
                <h2 className="text-2xl font-poppins font-bold metallic-text">Macro Events Calendar</h2>
              </div>
              <div className="space-y-4">
                {macroEvents.map((event, index) => (
                  <div key={index} className="glass-card-gold p-6 glow-border">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-poppins font-bold metallic-text flex-1">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold border ${getImpactColor(event.impact)}`}>
                        {event.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-sm metallic-text-secondary font-inter mb-2">{event.date}</p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={500}>
            <div className="glass-card-gold p-8 glow-border">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-6 w-6 text-gold" />
                <h2 className="text-2xl font-poppins font-bold metallic-text">{weeklyBrief.title}</h2>
              </div>
              <div className="space-y-4 mb-6">
                {weeklyBrief.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-gold mt-2" />
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base flex-1">{highlight}</p>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gold/20">
                <p className="text-lg font-poppins font-bold text-gold">Market Outlook</p>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base mt-2">{weeklyBrief.outlook}</p>
              </div>
            </div>
          </SmokySectionTransition>
        </div>
      </PageShell>
    </>
  );
}
