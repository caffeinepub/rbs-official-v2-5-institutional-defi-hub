import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useHasMarketIntelAccess, useGrantMarketIntelAccess } from '../hooks/useQueries';
import { useMarketIntelLive } from '../hooks/useMarketIntelLive';
import { SmokySectionTransition } from '../components/SmokySectionTransition';
import { PageHead } from '../components/PageHead';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Lock, Eye, EyeOff, BarChart2, Activity } from 'lucide-react';

export default function MarketIntelPage() {
  const { identity } = useInternetIdentity();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');

  const { data: hasAccess, isLoading: accessLoading } = useHasMarketIntelAccess();
  const grantAccess = useGrantMarketIntelAccess();
  const { data: signals, isLoading: signalsLoading, isRefetching, dataUpdatedAt } = useMarketIntelLive();

  const handleUnlock = async () => {
    setError('');
    try {
      await grantAccess.mutateAsync(passcode);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid passcode');
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageHead title="Market Intelligence | RBS" description="Real-time trading signals and market intelligence." />
        <div className="glass-card p-8 text-center max-w-md">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access Market Intelligence.</p>
        </div>
      </div>
    );
  }

  if (accessLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageHead title="Market Intelligence | RBS" description="Real-time trading signals and market intelligence." />
        <div className="glass-card p-8 text-center">
          <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <PageHead title="Market Intelligence | RBS" description="Real-time trading signals and market intelligence." />
        <div className="glass-card p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Market Intelligence</h2>
            <p className="text-muted-foreground text-sm">Enter your passcode to access live trading signals.</p>
          </div>
          <div className="relative mb-4">
            <input
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter passcode"
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-12"
            />
            <button
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-destructive text-sm mb-4">{error}</p>}
          <button
            onClick={handleUnlock}
            disabled={grantAccess.isPending || !passcode}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {grantAccess.isPending ? 'Verifying...' : 'Unlock Access'}
          </button>
        </div>
      </div>
    );
  }

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  return (
    <div className="min-h-screen bg-background">
      <PageHead title="Market Intelligence | RBS" description="Real-time trading signals and market intelligence." />

      <SmokySectionTransition>
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Market Intelligence</h1>
              <p className="text-muted-foreground mt-1">Live signals computed from real CoinGecko OHLCV data</p>
            </div>
            <div className="flex items-center gap-3">
              {isRefetching && <RefreshCw className="w-5 h-5 text-primary animate-spin" />}
              <span className="text-xs text-muted-foreground">Updated: {lastUpdated}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Auto-refresh 30s</span>
            </div>
          </div>

          {signalsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-4 w-1/3" />
                  <div className="h-10 bg-muted rounded mb-4" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(signals ?? []).map((s) => {
                const isUp = s.signal === 'BUY';
                const isDown = s.signal === 'SELL';
                const SignalIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
                const signalColor = isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-yellow-500';
                const signalBg = isUp ? 'bg-green-500/10 border-green-500/30' : isDown ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30';

                return (
                  <div key={s.asset} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-primary" />
                        <span className="text-lg font-bold text-foreground">{s.asset}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${signalBg} ${signalColor}`}>
                        {s.signal} {s.confidence}%
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <SignalIcon className={`w-6 h-6 ${signalColor}`} />
                        <span className="text-2xl font-bold text-foreground">
                          ${s.price > 0 ? s.price.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${s.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {s.change24h >= 0 ? '+' : ''}{s.change24h.toFixed(2)}% (24h)
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1"><Activity className="w-3 h-3" /> RSI(14)</span>
                        <span className={`font-mono font-semibold ${s.rsi > 70 ? 'text-red-500' : s.rsi < 30 ? 'text-green-500' : 'text-foreground'}`}>
                          {s.rsi.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">MACD Hist</span>
                        <span className={`font-mono font-semibold ${s.macdHistogram > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {s.macdHistogram > 0 ? '+' : ''}{s.macdHistogram.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">MA Crossover</span>
                        <span className={`font-semibold ${s.maCrossover ? 'text-green-500' : 'text-red-500'}`}>
                          {s.maCrossover ? 'Bullish ↑' : 'Bearish ↓'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isUp ? 'bg-green-500' : isDown ? 'bg-red-500' : 'bg-yellow-500'}`}
                              style={{ width: `${s.confidence}%` }}
                            />
                          </div>
                          <span className="font-mono text-foreground">{s.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 glass-card p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Signals are computed client-side from CoinGecko OHLCV data using RSI(14), MACD(12,26,9), and MA(20/50) crossover. Not financial advice.
            </p>
          </div>
        </section>
      </SmokySectionTransition>
    </div>
  );
}
