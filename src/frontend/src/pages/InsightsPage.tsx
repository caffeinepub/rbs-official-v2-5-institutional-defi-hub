import {
  Activity,
  AlertCircle,
  Clock,
  Globe,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { Skeleton } from "../components/ui/skeleton";
import {
  formatLargeNumber,
  useRealWorldAnalytics,
} from "../hooks/useRealWorldAnalytics";

function useCountUp(target: number, duration = 1500, trigger = true) {
  const [value, setValue] = useState(0);
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    if (!trigger) return;
    if (prefersReduced.current) {
      setValue(target);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return value;
}

export default function InsightsPage() {
  const { data, isLoading, error, refetch, dataUpdatedAt } =
    useRealWorldAnalytics();
  const [countdown, setCountdown] = useState(60);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setCountdown(60);
    setLastUpdated(dataUpdatedAt ? new Date(dataUpdatedAt) : null);
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 60 : c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  const totalMarketCap =
    (data as { totalMarketCap?: number } | undefined)?.totalMarketCap ?? 0;
  const volume24h =
    (data as { totalVolume24h?: number } | undefined)?.totalVolume24h ?? 0;
  const btcDominance =
    (data as { btcDominance?: number } | undefined)?.btcDominance ?? 0;
  const ethDominance =
    (data as { ethDominance?: number } | undefined)?.ethDominance ?? 0;
  const activeCryptos =
    (data as { activeCryptocurrencies?: number } | undefined)
      ?.activeCryptocurrencies ?? 0;
  const marketCapChange =
    (data as { marketCapChange24h?: number } | undefined)?.marketCapChange24h ??
    0;

  const hasData = !isLoading && !!data;
  const mcapCount = useCountUp(Math.round(totalMarketCap / 1e9), 1800, hasData);
  const volCount = useCountUp(Math.round(volume24h / 1e9), 1600, hasData);
  const btcDomCount = useCountUp(Math.round(btcDominance * 10), 1400, hasData);
  const ethDomCount = useCountUp(Math.round(ethDominance * 10), 1400, hasData);
  const cryptoCount = useCountUp(activeCryptos, 1500, hasData);

  return (
    <>
      <PageHead
        title="Market Insights | RBS Superior"
        description="Real-time global crypto market insights — market cap, volume, BTC dominance, and more."
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-gold/10 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "url(/assets/generated/analytics-dashboard-chart-bg.dim_1000x600.png)",
              backgroundSize: "cover",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <SmokySectionTransition>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-gold/10 text-gold text-sm font-medium mb-6">
                <Globe className="w-4 h-4" />
                Real-Time Market Insights
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Market Insights
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Live global cryptocurrency market data refreshing every 60
                seconds.
              </p>
            </SmokySectionTransition>
          </div>
        </section>

        {/* Refresh Status Bar */}
        <SmokySectionTransition>
          <div className="max-w-5xl mx-auto px-6 mb-6">
            <div className="glass-card rounded-xl p-4 border border-gold/10 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-gold" />
                {lastUpdated ? (
                  <span>
                    Last updated:{" "}
                    <span className="text-foreground">
                      {lastUpdated.toLocaleTimeString()}
                    </span>
                  </span>
                ) : (
                  <span>Fetching data...</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Next refresh in{" "}
                  <span className="text-gold font-bold tabular-nums">
                    {countdown}s
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </SmokySectionTransition>

        {/* Error State */}
        {error && (
          <SmokySectionTransition>
            <div className="max-w-5xl mx-auto px-6 mb-6">
              <div className="flex items-center gap-3 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Failed to load market data.</span>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="ml-auto text-sm underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </SmokySectionTransition>
        )}

        {/* Main Metrics */}
        <SmokySectionTransition>
          <section className="py-8 px-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gold mb-6">
              Global Market Overview
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Market Cap */}
                <div className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Globe className="w-8 h-8 text-gold mb-3" />
                  <div
                    className={`text-2xl font-black ${marketCapChange >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    ${mcapCount.toLocaleString()}B
                  </div>
                  {marketCapChange !== 0 && (
                    <div
                      className={`flex items-center gap-1 text-sm mt-1 ${marketCapChange >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {marketCapChange >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {marketCapChange >= 0 ? "+" : ""}
                      {marketCapChange.toFixed(2)}% (24h)
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Total Market Cap
                  </div>
                </div>

                {/* 24h Volume */}
                <div className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Activity className="w-8 h-8 text-blue-500 mb-3" />
                  <div className="text-2xl font-black text-blue-500">
                    ${volCount.toLocaleString()}B
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    24h Trading Volume
                  </div>
                </div>

                {/* BTC Dominance */}
                <div className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <TrendingUp className="w-8 h-8 text-gold mb-3" />
                  <div className="text-2xl font-black text-gold">
                    {(btcDomCount / 10).toFixed(1)}%
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full bg-gold transition-all duration-700"
                      style={{ width: `${btcDominance}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    BTC Dominance
                  </div>
                </div>

                {/* ETH Dominance */}
                <div className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
                  <div className="text-2xl font-black text-purple-500">
                    {(ethDomCount / 10).toFixed(1)}%
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full bg-purple-500 transition-all duration-700"
                      style={{ width: `${ethDominance}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    ETH Dominance
                  </div>
                </div>

                {/* Active Cryptocurrencies */}
                <div className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Globe className="w-8 h-8 text-cyan-500 mb-3" />
                  <div className="text-2xl font-black text-cyan-500">
                    {cryptoCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Active Cryptocurrencies
                  </div>
                </div>

                {/* Market Trend */}
                <div className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  {marketCapChange >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-500 mb-3" />
                  )}
                  <div
                    className={`text-2xl font-black ${marketCapChange >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {marketCapChange >= 0 ? "Bullish" : "Bearish"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Market Trend (24h)
                  </div>
                </div>
              </div>
            )}
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition>
          <div className="max-w-5xl mx-auto px-6 pb-12">
            <p className="text-xs text-muted-foreground text-center">
              Data sourced from CoinGecko /global endpoint. Updates every 60
              seconds. Not financial advice.
            </p>
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
