import {
  Activity,
  AlertCircle,
  Clock,
  Globe,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { Button } from "../components/ui/button";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

interface GlobalData {
  btcDominance: number;
  ethDominance: number;
  totalMarketCap: number;
  change24h: number;
}

function formatBig(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toFixed(2)}`;
}

function formatPrice(n: number): string {
  if (n >= 1000)
    return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(6)}`;
}

export default function AdvancedAnalyticsPage() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setError(false);
    try {
      const [coinsRes, globalRes] = await Promise.all([
        fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
        ),
        fetch("https://api.coingecko.com/api/v3/global"),
      ]);

      if (!coinsRes.ok || !globalRes.ok) throw new Error("API error");

      const [coinsData, globalJson] = await Promise.all([
        coinsRes.json(),
        globalRes.json(),
      ]);

      setCoins(coinsData);

      const g = globalJson.data;
      setGlobalData({
        btcDominance: g.market_cap_percentage?.btc ?? 0,
        ethDominance: g.market_cap_percentage?.eth ?? 0,
        totalMarketCap: g.total_market_cap?.usd ?? 0,
        change24h: g.market_cap_change_percentage_24h_usd ?? 0,
      });
      setLastUpdated(new Date());
    } catch {
      setError(true);
    }
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    await fetchData();
    setIsLoading(false);
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(fetchData, 60000); // 1 min
    return () => clearInterval(id);
  }, [load, fetchData]);

  return (
    <div className="min-h-screen bg-white">
      <PageHead
        title="Advanced Analytics | RBS"
        description="Top 20 crypto by market cap — live prices, 24h change, volume, and BTC/ETH dominance from CoinGecko."
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
                Advanced Analytics
              </h1>
              <p className="text-gray-500 mt-1">
                Top 20 by market cap — live from CoinGecko
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {lastUpdated && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              {isRefreshing && (
                <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              )}
              <Button
                data-ocid="analytics.refresh.button"
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
        <section className="py-8 px-4 max-w-5xl mx-auto space-y-6">
          {/* Error */}
          {error && (
            <div
              data-ocid="analytics.error_state"
              className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
            >
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-600 font-semibold">
                Failed to load market data
              </p>
              <p className="text-red-400 text-sm mt-1">
                CoinGecko API may be temporarily unavailable.
              </p>
              <Button
                data-ocid="analytics.retry.button"
                onClick={load}
                variant="outline"
                size="sm"
                className="mt-3 border-red-300 text-red-600 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Global stats */}
          {globalData && !isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "BTC Dominance",
                  value: `${globalData.btcDominance.toFixed(1)}%`,
                  icon: TrendingUp,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
                {
                  label: "ETH Dominance",
                  value: `${globalData.ethDominance.toFixed(1)}%`,
                  icon: Activity,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: "Total Market Cap",
                  value: formatBig(globalData.totalMarketCap),
                  icon: Globe,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "24h Market Change",
                  value: `${globalData.change24h >= 0 ? "+" : ""}${globalData.change24h.toFixed(2)}%`,
                  icon: globalData.change24h >= 0 ? TrendingUp : TrendingDown,
                  color:
                    globalData.change24h >= 0
                      ? "text-emerald-600"
                      : "text-red-600",
                  bg: globalData.change24h >= 0 ? "bg-emerald-50" : "bg-red-50",
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                >
                  <div
                    className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}
                  >
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className={`font-black text-xl ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* BTC Dominance bar */}
          {globalData && !isLoading && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3">
                Market Dominance
              </h3>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${globalData.btcDominance}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-orange-500 flex items-center justify-center"
                >
                  {globalData.btcDominance > 10 && (
                    <span className="text-white text-[9px] font-bold px-1">
                      BTC {globalData.btcDominance.toFixed(1)}%
                    </span>
                  )}
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${globalData.ethDominance}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-purple-500 flex items-center justify-center"
                >
                  {globalData.ethDominance > 5 && (
                    <span className="text-white text-[9px] font-bold px-1">
                      ETH {globalData.ethDominance.toFixed(1)}%
                    </span>
                  )}
                </motion.div>
                <div className="flex-1 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-[9px] font-bold px-1">
                    Other
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div
              data-ocid="analytics.loading_state"
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {Array.from({ length: 10 }, (_, i) => i).map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border-b border-gray-100 animate-pulse"
                >
                  <div className="w-6 h-4 bg-gray-100 rounded" />
                  <div className="w-8 h-8 bg-gray-100 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded w-24 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-12" />
                  </div>
                  <div className="h-5 bg-gray-100 rounded w-24" />
                  <div className="h-4 bg-gray-100 rounded w-16 hidden sm:block" />
                  <div className="h-4 bg-gray-100 rounded w-20 hidden md:block" />
                </div>
              ))}
            </div>
          )}

          {/* Coins table */}
          {!isLoading && coins.length > 0 && (
            <div
              data-ocid="analytics.table"
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5 sm:col-span-4">Name</div>
                <div className="col-span-3 sm:col-span-3 text-right">Price</div>
                <div className="col-span-3 sm:col-span-2 text-right">24h</div>
                <div className="col-span-2 text-right hidden sm:block">
                  Market Cap
                </div>
                <div className="col-span-2 text-right hidden md:block">
                  Volume
                </div>
              </div>

              {coins.map((coin, idx) => {
                const isUp = coin.price_change_percentage_24h >= 0;
                return (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    data-ocid={`analytics.row.${idx + 1}`}
                    className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center"
                  >
                    <div className="col-span-1 text-center text-sm text-gray-400 font-medium">
                      {coin.market_cap_rank}
                    </div>
                    <div className="col-span-5 sm:col-span-4 flex items-center gap-2">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-7 h-7 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {coin.name}
                        </p>
                        <p className="text-xs text-gray-400 uppercase">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-3 text-right font-mono font-bold text-gray-900 text-sm">
                      {formatPrice(coin.current_price)}
                    </div>
                    <div
                      className={`col-span-3 sm:col-span-2 text-right font-semibold text-sm flex items-center justify-end gap-1 ${isUp ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {isUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {isUp ? "+" : ""}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                    <div className="col-span-2 text-right text-xs text-gray-500 hidden sm:block">
                      {formatBig(coin.market_cap)}
                    </div>
                    <div className="col-span-2 text-right text-xs text-gray-500 hidden md:block">
                      {formatBig(coin.total_volume)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            Data from CoinGecko API · Updates every 60 seconds · Not financial
            advice
          </p>
        </section>
      </SmokySectionTransition>
    </div>
  );
}
