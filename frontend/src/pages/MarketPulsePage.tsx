import React from 'react';
import { useMarketPulse } from '../hooks/useMarketPulse';
import { SmokySectionTransition } from '../components/SmokySectionTransition';
import { PageHead } from '../components/PageHead';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Activity, BarChart2, Clock } from 'lucide-react';

export default function MarketPulsePage() {
  const { data, isLoading, isRefetching, error } = useMarketPulse();

  const statusColor =
    data?.status === 'Bullish' ? 'text-green-500' :
    data?.status === 'Bearish' ? 'text-red-500' : 'text-yellow-500';

  const StatusIcon =
    data?.status === 'Bullish' ? TrendingUp :
    data?.status === 'Bearish' ? TrendingDown : Minus;

  return (
    <div className="min-h-screen bg-background">
      <PageHead title="Market Pulse | RBS" description="Real-time Bitcoin market status with live RSI and MACD indicators." />

      <SmokySectionTransition>
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Market Pulse</h1>
              <p className="text-muted-foreground mt-1">Real-time Bitcoin market trends — refreshes every 20 seconds</p>
            </div>
            <div className="flex items-center gap-3">
              {isRefetching && <RefreshCw className="w-5 h-5 text-primary animate-spin" />}
              {data?.lastUpdated && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {data.lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Live 20s</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-4 w-1/2" />
                  <div className="h-12 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center">
              <p className="text-destructive">Failed to load market data. Please try again.</p>
            </div>
          ) : (
            <>
              {/* Main Status Card */}
              <div className="glass-card p-8 mb-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <StatusIcon className={`w-10 h-10 ${statusColor}`} />
                  <h2 className={`text-5xl font-bold ${statusColor}`}>{data?.status}</h2>
                </div>
                <p className="text-muted-foreground">Current Bitcoin Market Sentiment</p>
                <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">
                      ${data?.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-muted-foreground">BTC Price</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${(data?.change24h ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(data?.change24h ?? 0) >= 0 ? '+' : ''}{(data?.change24h ?? 0).toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">24h Change</p>
                  </div>
                </div>
              </div>

              {/* Indicators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">RSI (14)</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${
                    (data?.rsi ?? 50) > 70 ? 'text-red-500' :
                    (data?.rsi ?? 50) < 30 ? 'text-green-500' : 'text-foreground'
                  }`}>
                    {(data?.rsi ?? 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(data?.rsi ?? 50) > 70 ? 'Overbought' : (data?.rsi ?? 50) < 30 ? 'Oversold' : 'Neutral Zone'}
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (data?.rsi ?? 50) > 70 ? 'bg-red-500' :
                        (data?.rsi ?? 50) < 30 ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${data?.rsi ?? 50}%` }}
                    />
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">MACD Histogram</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${(data?.macdHistogram ?? 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(data?.macdHistogram ?? 0) > 0 ? '+' : ''}{(data?.macdHistogram ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(data?.macdHistogram ?? 0) > 0 ? 'Bullish Momentum' : 'Bearish Momentum'}
                  </p>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">MACD Line</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${(data?.macdLine ?? 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(data?.macdLine ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">vs Signal: {(data?.signalLine ?? 0).toFixed(2)}</p>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {data?.lastUpdated.toLocaleTimeString() ?? '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Auto-refresh every 20s</p>
                </div>
              </div>

              <div className="mt-6 glass-card p-4 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Market status derived from 30-day BTC price history. RSI(14) and MACD(12,26,9) computed client-side from CoinGecko data. Not financial advice.
                </p>
              </div>
            </>
          )}
        </section>
      </SmokySectionTransition>
    </div>
  );
}
