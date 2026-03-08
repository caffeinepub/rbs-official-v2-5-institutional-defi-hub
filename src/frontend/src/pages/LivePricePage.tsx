import { Clock, RefreshCw, TrendingDown, TrendingUp, Zap } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { Button } from "../components/ui/button";

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "DOTUSDT",
];

const SYMBOL_NAMES: Record<string, string> = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  BNBUSDT: "Binance Coin",
  SOLUSDT: "Solana",
  XRPUSDT: "XRP",
  ADAUSDT: "Cardano",
  DOGEUSDT: "Dogecoin",
  DOTUSDT: "Polkadot",
};

const SYMBOL_ICONS: Record<string, string> = {
  BTCUSDT: "₿",
  ETHUSDT: "Ξ",
  BNBUSDT: "◈",
  SOLUSDT: "◎",
  XRPUSDT: "✕",
  ADAUSDT: "₳",
  DOGEUSDT: "Ð",
  DOTUSDT: "●",
};

interface CoinTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
}

function formatPrice(price: number): string {
  if (price >= 1000)
    return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
  return vol.toFixed(0);
}

export default function LivePricePage() {
  const [coins, setCoins] = useState<CoinTicker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchPrices = useCallback(async () => {
    setError(false);
    try {
      const symbolsParam = encodeURIComponent(JSON.stringify(SYMBOLS));
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`,
      );
      if (!res.ok) throw new Error("Binance API error");
      const data = await res.json();
      const mapped: CoinTicker[] = data.map(
        (d: {
          symbol: string;
          lastPrice: string;
          priceChangePercent: string;
          highPrice: string;
          lowPrice: string;
          volume: string;
        }) => ({
          symbol: d.symbol.replace("USDT", ""),
          name: SYMBOL_NAMES[d.symbol] ?? d.symbol.replace("USDT", ""),
          price: Number.parseFloat(d.lastPrice),
          change: Number.parseFloat(d.priceChangePercent),
          high: Number.parseFloat(d.highPrice),
          low: Number.parseFloat(d.lowPrice),
          volume: Number.parseFloat(d.volume),
        }),
      );
      setCoins(mapped);
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch {
      setError(true);
      setIsConnected(false);
    }
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    await fetchPrices();
    setIsLoading(false);
  }, [fetchPrices]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPrices();
    setIsRefreshing(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(fetchPrices, 10000);
    return () => clearInterval(id);
  }, [load, fetchPrices]);

  return (
    <div className="min-h-screen bg-white">
      <PageHead
        title="Live Prices | RBS"
        description="Real-time cryptocurrency prices from Binance — BTC, ETH, BNB, SOL, XRP, ADA, DOGE, DOT."
      />

      {/* Header */}
      <div
        className="border-b pt-20 pb-8 px-4"
        style={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 50%, #f8faff 100%)",
          borderColor: "rgba(14, 165, 233, 0.15)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Live Prices
              </h1>
              <p className="text-gray-500 mt-1">
                8 major cryptocurrencies — auto-refresh every 10 seconds
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Connection indicator */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`}
                />
                <span
                  className={`text-xs font-medium ${isConnected ? "text-emerald-700" : "text-red-600"}`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              {lastUpdated && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              {isRefreshing && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Updating...</span>
                </div>
              )}
              {isConnected && !isRefreshing && (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium">Live</span>
                </div>
              )}
              <Button
                data-ocid="live-price.refresh.button"
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isRefreshing || isLoading}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SmokySectionTransition>
        <section className="py-8 px-4 max-w-5xl mx-auto">
          {error && (
            <div
              data-ocid="live-price.error_state"
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            >
              <p className="text-red-600 text-sm font-medium">
                Failed to fetch prices from Binance. Retrying automatically...
              </p>
            </div>
          )}

          {isLoading ? (
            <div data-ocid="live-price.loading_state" className="space-y-4">
              {SYMBOLS.map((sym) => (
                <div
                  key={sym}
                  className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full" />
                      <div>
                        <div className="h-5 bg-gray-100 rounded w-16 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-gray-100 rounded w-28 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {coins.map((coin, index) => {
                const isPositive = coin.change >= 0;
                return (
                  <div
                    key={coin.symbol}
                    data-ocid={`live-price.item.${index + 1}`}
                    className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl font-black text-emerald-600">
                          {SYMBOL_ICONS[`${coin.symbol}USDT`] ?? coin.symbol[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              {coin.symbol}
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              #{index + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{coin.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold font-mono text-gray-900">
                            ${formatPrice(coin.price)}
                          </p>
                          <div
                            className={`flex items-center gap-1 justify-end text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {isPositive ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {isPositive ? "+" : ""}
                            {coin.change.toFixed(2)}%
                          </div>
                        </div>

                        {/* 24h Range */}
                        <div className="hidden sm:block text-right">
                          <p className="text-sm font-medium text-gray-700">
                            ${formatPrice(coin.high)}
                          </p>
                          <p className="text-xs text-gray-400">24h High</p>
                          <p className="text-sm font-medium text-gray-700 mt-0.5">
                            ${formatPrice(coin.low)}
                          </p>
                          <p className="text-xs text-gray-400">24h Low</p>
                        </div>

                        {/* Volume */}
                        <div className="hidden md:block text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {formatVolume(coin.volume)} {coin.symbol}
                          </p>
                          <p className="text-xs text-gray-400">24h Volume</p>
                        </div>
                      </div>
                    </div>

                    {/* 24h range bar */}
                    {coin.high > coin.low && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isPositive ? "bg-emerald-400" : "bg-red-400"}`}
                            style={{
                              width: `${Math.min(100, Math.max(0, ((coin.price - coin.low) / (coin.high - coin.low)) * 100))}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                          <span>${formatPrice(coin.low)}</span>
                          <span>24h range</span>
                          <span>${formatPrice(coin.high)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-6">
            Data sourced from Binance API. Prices update every 10 seconds. Not
            financial advice.
          </p>
        </section>
      </SmokySectionTransition>
    </div>
  );
}
