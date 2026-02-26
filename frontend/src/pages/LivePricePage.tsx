import React from 'react';
import { useLivePrice } from '../hooks/useLivePrice';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SmokySectionTransition } from '../components/SmokySectionTransition';
import { PageHead } from '../components/PageHead';
import { TrendingUp, TrendingDown, RefreshCw, Lock, Zap } from 'lucide-react';

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString(undefined, { maximumFractionDigits: 4 });
  return price.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}

const COIN_ICONS: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  BNB: 'B',
  SOL: '◎',
  XRP: 'X',
};

export default function LivePricePage() {
  const { identity } = useInternetIdentity();
  const { data: prices, isLoading, isRefetching, error, dataUpdatedAt } = useLivePrice();

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageHead title="Live Prices | RBS" description="Real-time cryptocurrency prices for top 5 coins." />
        <div className="glass-card p-8 text-center max-w-md">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to view live cryptocurrency prices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHead title="Live Prices | RBS" description="Real-time cryptocurrency prices for top 5 coins." />

      <SmokySectionTransition>
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Live Prices</h1>
              <p className="text-muted-foreground mt-1">Top 5 cryptocurrencies — refreshes every 7 seconds</p>
            </div>
            <div className="flex items-center gap-3">
              {isRefetching && (
                <div className="flex items-center gap-2 text-primary">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Updating...</span>
                </div>
              )}
              {!isRefetching && (
                <div className="flex items-center gap-2 text-green-500">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs">Live</span>
                </div>
              )}
              {dataUpdatedAt > 0 && (
                <span className="text-xs text-muted-foreground">
                  {new Date(dataUpdatedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="glass-card p-4 mb-6 border border-destructive/30">
              <p className="text-destructive text-sm">Failed to fetch prices. Retrying automatically...</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full" />
                      <div>
                        <div className="h-5 bg-muted rounded w-16 mb-2" />
                        <div className="h-4 bg-muted rounded w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-muted rounded w-28 mb-2" />
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(prices ?? []).map((coin, index) => {
                const isPositive = coin.change24h >= 0;
                return (
                  <div
                    key={coin.symbol}
                    className="glass-card p-5 hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                          {COIN_ICONS[coin.symbol] ?? coin.symbol[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-foreground">{coin.symbol}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">#{index + 1}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{coin.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 flex-wrap">
                        <div className="text-right">
                          <p className="text-2xl font-bold font-mono text-foreground">
                            ${formatPrice(coin.price)}
                          </p>
                          <div className={`flex items-center gap-1 justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm font-semibold">
                              {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        <div className="text-right hidden md:block">
                          <p className="text-sm font-medium text-foreground">{formatMarketCap(coin.marketCap)}</p>
                          <p className="text-xs text-muted-foreground">Market Cap</p>
                        </div>

                        <div className="text-right hidden lg:block">
                          <p className="text-sm font-medium text-foreground">{formatMarketCap(coin.volume24h)}</p>
                          <p className="text-xs text-muted-foreground">24h Volume</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-6">
            Data sourced from CoinGecko API. Prices update every 7 seconds. Not financial advice.
          </p>
        </section>
      </SmokySectionTransition>
    </div>
  );
}
