import React, { useState } from 'react';
import { useTokenAdvancedAnalytics } from '../hooks/useTokenAdvancedAnalytics';
import { SmokySectionTransition } from '../components/SmokySectionTransition';
import { PageHead } from '../components/PageHead';
import { Search, TrendingUp, TrendingDown, Minus, BarChart2, Activity, RefreshCw, AlertTriangle, Zap } from 'lucide-react';

function formatNumber(n: number, decimals = 2): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(decimals)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(decimals)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`;
  if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return `$${n.toFixed(decimals)}`;
}

export default function AdvancedAnalyticsPage() {
  const [inputSymbol, setInputSymbol] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');

  const { data, isLoading, error } = useTokenAdvancedAnalytics(searchSymbol);

  const handleSearch = () => {
    if (inputSymbol.trim()) setSearchSymbol(inputSymbol.trim().toUpperCase());
  };

  const trendColor = data?.trendSignal === 'Bullish' ? 'text-green-500' : data?.trendSignal === 'Bearish' ? 'text-red-500' : 'text-yellow-500';
  const TrendIcon = data?.trendSignal === 'Bullish' ? TrendingUp : data?.trendSignal === 'Bearish' ? TrendingDown : Minus;
  const riskColor = data?.riskLevel === 'Low' ? 'text-green-500' : data?.riskLevel === 'High' ? 'text-red-500' : 'text-yellow-500';
  const volTrendColor = data?.volumeTrend === 'Rising' ? 'text-green-500' : data?.volumeTrend === 'Falling' ? 'text-red-500' : 'text-yellow-500';

  return (
    <div className="min-h-screen bg-background">
      <PageHead title="Advanced Analytics | RBS" description="Deep token analytics with Bollinger Bands, RSI, MACD, and market strength." />

      <SmokySectionTransition>
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Advanced Analytics</h1>
            <p className="text-muted-foreground">Deep token analysis with Bollinger Bands, RSI, MACD, volume trends, and market strength</p>
          </div>

          {/* Search */}
          <div className="glass-card p-6 mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter token symbol (e.g. BTC, ETH, SOL)"
                className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !inputSymbol.trim()}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Analyze
              </button>
            </div>
          </div>

          {error && (
            <div className="glass-card p-6 mb-6 border border-destructive/30 text-center">
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive">Token not found or API error. Try a different symbol.</p>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3 w-1/2" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              ))}
            </div>
          )}

          {data && !isLoading && (
            <>
              {/* Header */}
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{data.name} ({data.symbol})</h2>
                    <p className="text-muted-foreground">Rank #{data.marketCapRank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold font-mono text-foreground">{formatNumber(data.price)}</p>
                    <div className={`flex items-center gap-1 justify-end ${trendColor}`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="font-semibold">{data.trendSignal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Strength */}
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Market Strength Score</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        data.marketStrength >= 70 ? 'bg-green-500' :
                        data.marketStrength >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${data.marketStrength}%` }}
                    />
                  </div>
                  <span className={`text-3xl font-bold font-mono ${
                    data.marketStrength >= 70 ? 'text-green-500' :
                    data.marketStrength >= 40 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {data.marketStrength}/100
                  </span>
                </div>
              </div>

              {/* Main Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* RSI */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">RSI (14)</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${data.rsi > 70 ? 'text-red-500' : data.rsi < 30 ? 'text-green-500' : 'text-foreground'}`}>
                    {data.rsi.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.rsi > 70 ? 'Overbought' : data.rsi < 30 ? 'Oversold' : 'Neutral'}
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${data.rsi > 70 ? 'bg-red-500' : data.rsi < 30 ? 'bg-green-500' : 'bg-primary'}`}
                      style={{ width: `${data.rsi}%` }} />
                  </div>
                </div>

                {/* Volume Trend */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Volume Trend</span>
                  </div>
                  <p className={`text-3xl font-bold ${volTrendColor}`}>{data.volumeTrend}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    24h Vol: {formatNumber(data.volume24h)}
                  </p>
                </div>

                {/* Risk Level */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                  </div>
                  <p className={`text-3xl font-bold ${riskColor}`}>{data.riskLevel}</p>
                  <p className="text-xs text-muted-foreground mt-1">Volatility: {data.volatilityScore.toFixed(1)}%</p>
                </div>

                {/* 7d Change */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">7-Day Change</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${data.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.change7d >= 0 ? '+' : ''}{data.change7d.toFixed(2)}%
                  </p>
                </div>

                {/* 30d Change */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">30-Day Change</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${data.change30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.change30d >= 0 ? '+' : ''}{data.change30d.toFixed(2)}%
                  </p>
                </div>

                {/* ATH */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">All-Time High</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground">{formatNumber(data.ath)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.price < data.ath ? `${(((data.ath - data.price) / data.ath) * 100).toFixed(1)}% below ATH` : 'At ATH'}
                  </p>
                </div>
              </div>

              {/* Bollinger Bands */}
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Bollinger Bands (20-period)</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Upper Band</p>
                    <p className="text-lg font-bold font-mono text-red-400">{formatNumber(data.bollingerUpper)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Middle (SMA20)</p>
                    <p className="text-lg font-bold font-mono text-primary">{formatNumber(data.bollingerMiddle)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lower Band</p>
                    <p className="text-lg font-bold font-mono text-green-400">{formatNumber(data.bollingerLower)}</p>
                  </div>
                </div>
                <div className="mt-4 relative h-3 bg-muted rounded-full overflow-hidden">
                  {data.bollingerUpper > data.bollingerLower && (
                    <div
                      className="absolute top-0 h-full w-2 bg-primary rounded-full"
                      style={{
                        left: `${Math.max(0, Math.min(100, ((data.price - data.bollingerLower) / (data.bollingerUpper - data.bollingerLower)) * 100))}%`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Lower</span>
                  <span>Price Position</span>
                  <span>Upper</span>
                </div>
              </div>

              {/* Supply Info */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Supply Ratio (Circulating / Total)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${data.supplyRatio}%` }} />
                  </div>
                  <span className="text-lg font-bold font-mono text-foreground">{data.supplyRatio.toFixed(1)}%</span>
                </div>
              </div>
            </>
          )}

          {!searchSymbol && !isLoading && (
            <div className="glass-card p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Enter a token symbol above to see advanced analytics</p>
              <p className="text-xs text-muted-foreground mt-2">Try: BTC, ETH, SOL, BNB, ADA, DOT, AVAX</p>
            </div>
          )}
        </section>
      </SmokySectionTransition>
    </div>
  );
}
