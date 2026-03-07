import {
  Activity,
  BarChart2,
  Clock,
  Minus,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { Button } from "../components/ui/button";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMarketPulse } from "../hooks/useMarketPulse";

export default function MarketPulsePage() {
  const { data, isLoading, isRefetching, error, refetch } = useMarketPulse();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { actor } = useActor();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    await refetch();
    setIsManualRefreshing(false);
  };

  const [tally, setTally] = useState<{
    bullish: bigint;
    bearish: bigint;
    neutral: bigint;
    total: bigint;
  } | null>(null);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);

  // Fetch tally
  useEffect(() => {
    const fetchTally = async () => {
      if (!actor) return;
      try {
        const t = await actor.getMarketPulseTally();
        setTally(t);
      } catch {
        /* silent */
      }
    };
    fetchTally();
    const interval = setInterval(fetchTally, 15000);
    return () => clearInterval(interval);
  }, [actor]);

  const handleVote = async (sentiment: "Bullish" | "Bearish" | "Neutral") => {
    if (!actor || !isAuthenticated || voting || voted) return;
    setVoting(true);
    try {
      await actor.voteMarketPulse(sentiment);
      toast.success(`Voted ${sentiment}!`);
      setVoted(true);
      // Refresh tally
      const t = await actor.getMarketPulseTally();
      setTally(t);
    } catch {
      toast.error("Vote failed. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  const total = tally ? Number(tally.total) : 0;
  const bullishPct =
    total > 0 ? Math.round((Number(tally!.bullish) / total) * 100) : 33;
  const bearishPct =
    total > 0 ? Math.round((Number(tally!.bearish) / total) * 100) : 33;
  const neutralPct =
    total > 0 ? Math.round((Number(tally!.neutral) / total) * 100) : 34;

  const statusColor =
    data?.status === "Bullish"
      ? "text-green-600"
      : data?.status === "Bearish"
        ? "text-red-600"
        : "text-yellow-600";
  const StatusIcon =
    data?.status === "Bullish"
      ? TrendingUp
      : data?.status === "Bearish"
        ? TrendingDown
        : Minus;

  return (
    <div className="min-h-screen bg-white">
      <PageHead
        title="Market Pulse | RBS"
        description="Real-time Bitcoin market status with live RSI and MACD indicators."
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-20 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Market Pulse
              </h1>
              <p className="text-gray-500 mt-1">
                Real-time Bitcoin market trends — refreshes every 20 seconds
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isRefetching && (
                <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
              )}
              {data?.lastUpdated && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {data.lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">
                ● Live 20s
              </span>
              <Button
                data-ocid="market-pulse.refresh.button"
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isManualRefreshing || isRefetching}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${isManualRefreshing || isRefetching ? "animate-spin" : ""}`}
                />
                {isManualRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SmokySectionTransition>
        <section className="py-8 px-4 max-w-5xl mx-auto space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(["p1", "p2", "p3", "p4"] as const).map((sk) => (
                <div
                  key={sk}
                  className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse"
                  data-ocid="market-pulse.loading_state"
                >
                  <div className="h-6 bg-gray-100 rounded mb-4 w-1/2" />
                  <div className="h-12 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              className="bg-white border border-red-200 rounded-2xl p-8 text-center"
              data-ocid="market-pulse.error_state"
            >
              <p className="text-red-600">
                Failed to load market data. Please try again.
              </p>
            </div>
          ) : (
            <>
              {/* Main Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <StatusIcon className={`w-10 h-10 ${statusColor}`} />
                  <h2 className={`text-5xl font-bold ${statusColor}`}>
                    {data?.status}
                  </h2>
                </div>
                <p className="text-gray-500">
                  Current Bitcoin Market Sentiment
                </p>
                <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      $
                      {data?.price.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-sm text-gray-500">BTC Price</p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-2xl font-bold ${(data?.change24h ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {(data?.change24h ?? 0) >= 0 ? "+" : ""}
                      {(data?.change24h ?? 0).toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500">24h Change</p>
                  </div>
                </div>
              </motion.div>

              {/* Indicators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-500">
                      RSI (14)
                    </span>
                  </div>
                  <p
                    className={`text-3xl font-bold font-mono ${
                      (data?.rsi ?? 50) > 70
                        ? "text-red-600"
                        : (data?.rsi ?? 50) < 30
                          ? "text-green-600"
                          : "text-gray-900"
                    }`}
                  >
                    {(data?.rsi ?? 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(data?.rsi ?? 50) > 70
                      ? "Overbought"
                      : (data?.rsi ?? 50) < 30
                        ? "Oversold"
                        : "Neutral Zone"}
                  </p>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (data?.rsi ?? 50) > 70
                          ? "bg-red-500"
                          : (data?.rsi ?? 50) < 30
                            ? "bg-green-500"
                            : "bg-emerald-600"
                      }`}
                      style={{ width: `${data?.rsi ?? 50}%` }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-500">
                      MACD Histogram
                    </span>
                  </div>
                  <p
                    className={`text-3xl font-bold font-mono ${(data?.macdHistogram ?? 0) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {(data?.macdHistogram ?? 0) > 0 ? "+" : ""}
                    {(data?.macdHistogram ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(data?.macdHistogram ?? 0) > 0
                      ? "Bullish Momentum"
                      : "Bearish Momentum"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-500">
                      MACD Line
                    </span>
                  </div>
                  <p
                    className={`text-3xl font-bold font-mono ${(data?.macdLine ?? 0) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {(data?.macdLine ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    vs Signal: {(data?.signalLine ?? 0).toFixed(2)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-500">
                      Last Updated
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {data?.lastUpdated.toLocaleTimeString() ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-refresh every 20s
                  </p>
                </motion.div>
              </div>

              {/* Community Voting Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Community Market Pulse
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  What does the community think? Vote to see live results.
                </p>

                {/* Vote Tally Bars */}
                <div className="space-y-4 mb-6">
                  {[
                    {
                      label: "Bullish",
                      pct: bullishPct,
                      count: tally ? Number(tally.bullish) : 0,
                      color: "bg-green-500",
                      textColor: "text-green-600",
                      bgLight: "bg-green-50",
                    },
                    {
                      label: "Neutral",
                      pct: neutralPct,
                      count: tally ? Number(tally.neutral) : 0,
                      color: "bg-yellow-500",
                      textColor: "text-yellow-600",
                      bgLight: "bg-yellow-50",
                    },
                    {
                      label: "Bearish",
                      pct: bearishPct,
                      count: tally ? Number(tally.bearish) : 0,
                      color: "bg-red-500",
                      textColor: "text-red-600",
                      bgLight: "bg-red-50",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className={`font-semibold ${item.textColor}`}>
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">
                            {item.count} votes
                          </span>
                          <span
                            className={`font-bold text-lg ${item.textColor}`}
                          >
                            {item.pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {total > 0 && (
                  <p className="text-xs text-gray-400 text-center mb-4">
                    {total} total votes
                  </p>
                )}

                {isAuthenticated ? (
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button
                      data-ocid="market-pulse.bullish.button"
                      onClick={() => handleVote("Bullish")}
                      disabled={voting || voted}
                      className="bg-green-500 hover:bg-green-400 text-white font-bold flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" /> Bullish
                    </Button>
                    <Button
                      data-ocid="market-pulse.neutral.button"
                      onClick={() => handleVote("Neutral")}
                      disabled={voting || voted}
                      variant="outline"
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-bold flex items-center gap-2"
                    >
                      <Minus className="w-4 h-4" /> Neutral
                    </Button>
                    <Button
                      data-ocid="market-pulse.bearish.button"
                      onClick={() => handleVote("Bearish")}
                      disabled={voting || voted}
                      className="bg-red-500 hover:bg-red-400 text-white font-bold flex items-center gap-2"
                    >
                      <TrendingDown className="w-4 h-4" /> Bearish
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 text-sm">
                    Login to cast your vote
                  </p>
                )}
                {voted && (
                  <p className="text-center text-green-600 text-sm mt-3 font-medium">
                    ✓ Your vote has been recorded
                  </p>
                )}
              </motion.div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Market status derived from 30-day BTC price history. RSI(14)
                  and MACD(12,26,9) computed client-side from CoinGecko data.
                  Not financial advice.
                </p>
              </div>
            </>
          )}
        </section>
      </SmokySectionTransition>
    </div>
  );
}
