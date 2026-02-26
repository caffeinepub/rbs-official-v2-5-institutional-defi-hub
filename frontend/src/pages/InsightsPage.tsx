import React from 'react';
import { useRealWorldAnalytics, formatLargeNumber } from '../hooks/useRealWorldAnalytics';
import { SmokySectionTransition } from '../components/SmokySectionTransition';
import { PageHead } from '../components/PageHead';
import { TrendingUp, TrendingDown, RefreshCw, Globe, Bitcoin, Activity, Clock, BarChart2 } from 'lucide-react';

export default function InsightsPage() {
  const { data, isLoading, isRefetching, error } = useRealWorldAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <PageHead title="Market Insights | RBS" description="Real-time global crypto market insights and analytics." />

      <SmokySectionTransition>
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Market Insights</h1>
              <p className="text-muted-foreground mt-1">Real-time global crypto market data — refreshes every minute</p>
            </div>
            <div className="flex items-center gap-3">
              {isRefetching && <RefreshCw className="w-5 h-5 text-primary animate-spin" />}
              {data?.lastUpdated && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {data.lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="glass-card p-4 mb-6 border border-destructive/30">
              <p className="text-destructive text-sm">Failed to load market data. Retrying...</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-5 bg-muted rounded mb-4 w-1/2" />
                  <div className="h-10 bg-muted rounded mb-3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Market Cap */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Market Cap</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-foreground">
                    {data ? formatLargeNumber(data.totalMarketCap) : '—'}
                  </p>
                  <div className={`flex items-center gap-1 mt-2 ${(data?.marketCapChange24h ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(data?.marketCapChange24h ?? 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-semibold">
                      {(data?.marketCapChange24h ?? 0) >= 0 ? '+' : ''}{(data?.marketCapChange24h ?? 0).toFixed(2)}% (24h)
                    </span>
                  </div>
                  {data?.lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {data.lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* BTC Dominance */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bitcoin className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">BTC Dominance</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-foreground">
                    {data ? `${data.btcDominance.toFixed(1)}%` : '—'}
                  </p>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${data?.btcDominance ?? 0}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {data?.trendUp ? '↑ Trending Up' : '↓ Trending Down'}
                  </p>
                  {data?.lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {data.lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* ETH Dominance */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">ETH Dominance</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-foreground">
                    {data ? `${data.ethDominance.toFixed(1)}%` : '—'}
                  </p>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data?.ethDominance ?? 0}%` }} />
                  </div>
                  {data?.lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {data.lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* 24h Volume */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">24h Total Volume</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-foreground">
                    {data ? formatLargeNumber(data.totalVolume24h) : '—'}
                  </p>
                  {data?.lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {data.lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Active Cryptocurrencies */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Active Cryptocurrencies</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-foreground">
                    {data ? data.activeCryptocurrencies.toLocaleString() : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Listed on CoinGecko</p>
                </div>

                {/* Market Trend */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {data?.trendUp ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                    <span className="text-sm text-muted-foreground">Market Trend</span>
                  </div>
                  <p className={`text-3xl font-bold ${data?.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {data?.trendUp ? 'Bullish' : 'Bearish'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on 24h market cap change
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Data sourced from CoinGecko /global endpoint. Updates every 60 seconds. Not financial advice.
              </p>
            </>
          )}
        </section>
      </SmokySectionTransition>
    </div>
  );
}
