import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface FundingRate {
  symbol: string;
  displayName: string;
  markPrice: number;
  lastFundingRate: number;
  nextFundingTime: number;
  annualizedRate: number;
  signal: string;
  signalColor: string;
  signalBg: string;
  rateColor: string;
  rateBg: string;
  priceChange24h?: number;
}

const PAIRS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "LINKUSDT",
  "LTCUSDT",
  "NEARUSDT",
  "ATOMUSDT",
  "FTMUSDT",
  "ARBUSDT",
];

const DISPLAY_NAMES: Record<string, string> = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  BNBUSDT: "BNB",
  SOLUSDT: "Solana",
  XRPUSDT: "XRP",
  ADAUSDT: "Cardano",
  DOGEUSDT: "Dogecoin",
  AVAXUSDT: "Avalanche",
  DOTUSDT: "Polkadot",
  LINKUSDT: "Chainlink",
  LTCUSDT: "Litecoin",
  NEARUSDT: "NEAR Protocol",
  ATOMUSDT: "Cosmos",
  FTMUSDT: "Fantom",
  ARBUSDT: "Arbitrum",
};

function getSignal(rate: number) {
  if (rate > 0.0005) {
    return {
      signal: "Extreme Long — High Reversal Risk 🚨",
      signalColor: "text-red-800",
      signalBg: "bg-red-100 border-red-300",
    };
  }
  if (rate > 0.0003) {
    return {
      signal: "Heavily Long — Potential Reversal Risk",
      signalColor: "text-red-700",
      signalBg: "bg-red-50 border-red-200",
    };
  }
  if (rate > 0.0001) {
    return {
      signal: "Longs Paying — Short Bias Favored",
      signalColor: "text-orange-700",
      signalBg: "bg-orange-50 border-orange-200",
    };
  }
  if (rate < -0.0005) {
    return {
      signal: "Extreme Short — Strong Bounce Risk 🚨",
      signalColor: "text-emerald-800",
      signalBg: "bg-emerald-100 border-emerald-300",
    };
  }
  if (rate < -0.0003) {
    return {
      signal: "Heavily Short — Potential Bounce Risk",
      signalColor: "text-emerald-700",
      signalBg: "bg-emerald-50 border-emerald-200",
    };
  }
  if (rate < -0.0001) {
    return {
      signal: "Shorts Paying — Long Bias Favored",
      signalColor: "text-sky-700",
      signalBg: "bg-sky-50 border-sky-200",
    };
  }
  return {
    signal: "Neutral — Balanced Positioning",
    signalColor: "text-gray-600",
    signalBg: "bg-gray-50 border-gray-200",
  };
}

function getMarketSentiment(avgRate: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (avgRate > 0.0002)
    return {
      label: "Extreme Greed 🤑",
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
    };
  if (avgRate > 0.0001)
    return {
      label: "Greed 📈",
      color: "text-orange-700",
      bg: "bg-orange-50 border-orange-200",
    };
  if (avgRate < -0.0002)
    return {
      label: "Extreme Fear 😱",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
    };
  if (avgRate < -0.0001)
    return {
      label: "Fear 📉",
      color: "text-sky-700",
      bg: "bg-sky-50 border-sky-200",
    };
  return {
    label: "Neutral ⚖️",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
  };
}

function CountdownTimer({ targetMs }: { targetMs: number }) {
  const [remaining, setRemaining] = useState(
    Math.max(0, targetMs - Date.now()),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return (
    <span className="font-mono text-xs text-gray-500">
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
      {String(s).padStart(2, "0")}
    </span>
  );
}

const FAQ_ITEMS = [
  {
    q: "What are Funding Rates?",
    a: "Funding rates are periodic payments between long and short traders in perpetual futures markets. When the rate is positive, longs pay shorts every 8 hours. When negative, shorts pay longs. This mechanism keeps perpetual futures prices anchored to spot prices.",
  },
  {
    q: "How to trade funding rates?",
    a: "High positive funding signals long-heavy positioning — contrarian traders may short or delta-hedge. Negative funding (shorts dominant) often indicates fear and potential contrarian long opportunity. Funding arbitrage: go spot long + futures short to collect funding fees with minimal directional risk.",
  },
  {
    q: "Why does this matter for traders?",
    a: "Extreme funding rates (above 0.1% per 8 hours = ~109% annualized) indicate overcrowded positions historically correlated with market reversals. Low or negative funding often signals market bottoms. It's one of the most important sentiment indicators in crypto derivatives trading.",
  },
  {
    q: "How often do funding payments occur?",
    a: "On Binance, funding payments occur every 8 hours: at 00:00, 08:00, and 16:00 UTC. Only traders holding positions at those timestamps pay or receive funding. The rate shown here is for the next upcoming payment window.",
  },
];

export default function FundingRatesPage() {
  const navigate = useNavigate();
  const [rates, setRates] = useState<FundingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextRefreshSecs, setNextRefreshSecs] = useState(30);

  const fetchRates = useCallback(async () => {
    setError(null);
    try {
      // Fetch from Binance Futures API (fapi) — real funding rates
      const [premiumRes, priceRes] = await Promise.all([
        fetch("https://fapi.binance.com/fapi/v1/premiumIndex"),
        fetch("https://fapi.binance.com/fapi/v1/ticker/24hr"),
      ]);

      if (!premiumRes.ok || !priceRes.ok) {
        throw new Error("Binance Futures API unavailable");
      }

      const premiumData: Array<{
        symbol: string;
        markPrice: string;
        lastFundingRate: string;
        nextFundingTime: number;
      }> = await premiumRes.json();

      const priceData: Array<{
        symbol: string;
        priceChangePercent: string;
      }> = await priceRes.json();

      const priceMap = new Map(
        priceData.map((p) => [
          p.symbol,
          Number.parseFloat(p.priceChangePercent),
        ]),
      );

      const premiumMap = new Map(premiumData.map((p) => [p.symbol, p]));

      const results: FundingRate[] = PAIRS.map((symbol) => {
        const p = premiumMap.get(symbol);
        const priceChange24h = priceMap.get(symbol) ?? 0;

        const markPrice = p ? Number.parseFloat(p.markPrice) : 0;
        const lastFundingRate = p ? Number.parseFloat(p.lastFundingRate) : 0;
        const nextFundingTime = p
          ? p.nextFundingTime
          : Date.now() + 8 * 3600000;
        const annualizedRate = lastFundingRate * 3 * 365 * 100; // 3 payments/day * 365 days

        const { signal, signalColor, signalBg } = getSignal(lastFundingRate);

        return {
          symbol,
          displayName: DISPLAY_NAMES[symbol] ?? symbol,
          markPrice,
          lastFundingRate,
          nextFundingTime,
          annualizedRate,
          priceChange24h,
          signal,
          signalColor,
          signalBg,
          rateColor:
            lastFundingRate > 0
              ? "text-red-600"
              : lastFundingRate < 0
                ? "text-emerald-600"
                : "text-gray-500",
          rateBg:
            lastFundingRate > 0
              ? "bg-red-50 border-red-200"
              : lastFundingRate < 0
                ? "bg-emerald-50 border-emerald-200"
                : "bg-gray-50 border-gray-200",
        };
      });

      setRates(results);
      setLastUpdated(new Date());
    } catch {
      // Fallback: try spot API
      try {
        const spotRes = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(PAIRS)}`,
        );
        if (!spotRes.ok) throw new Error("Spot API also failed");
        const spotData: Array<{
          symbol: string;
          lastPrice: string;
          priceChangePercent: string;
        }> = await spotRes.json();
        const spotMap = new Map(spotData.map((s) => [s.symbol, s]));

        const fallbackResults: FundingRate[] = PAIRS.map((symbol) => {
          const s = spotMap.get(symbol);
          const markPrice = s ? Number.parseFloat(s.lastPrice) : 0;
          const priceChangePct = s
            ? Number.parseFloat(s.priceChangePercent)
            : 0;
          // Estimate funding from momentum
          const lastFundingRate = (priceChangePct * 0.001) / 100;
          const annualizedRate = lastFundingRate * 3 * 365 * 100;
          const nextFundingTime =
            Date.now() + (8 * 3600000 - (Date.now() % (8 * 3600000)));
          const { signal, signalColor, signalBg } = getSignal(lastFundingRate);
          return {
            symbol,
            displayName: DISPLAY_NAMES[symbol] ?? symbol,
            markPrice,
            lastFundingRate,
            nextFundingTime,
            annualizedRate,
            priceChange24h: priceChangePct,
            signal,
            signalColor,
            signalBg,
            rateColor:
              lastFundingRate > 0
                ? "text-red-600"
                : lastFundingRate < 0
                  ? "text-emerald-600"
                  : "text-gray-500",
            rateBg:
              lastFundingRate > 0
                ? "bg-red-50 border-red-200"
                : lastFundingRate < 0
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200",
          };
        });
        setRates(fallbackResults);
        setLastUpdated(new Date());
        setError("Using estimated rates (futures API unavailable)");
      } catch {
        setError("Failed to load funding rates. Please refresh.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Countdown timer for next refresh
  // biome-ignore lint/correctness/useExhaustiveDependencies: lastUpdated used to reset timer
  useEffect(() => {
    setNextRefreshSecs(30);
    const tick = setInterval(() => {
      setNextRefreshSecs((s) => (s <= 1 ? 30 : s - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastUpdated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRates();
  };

  const avgFundingRate =
    rates.length > 0
      ? rates.reduce((sum, r) => sum + r.lastFundingRate, 0) / rates.length
      : 0;

  const bullishCount = rates.filter((r) => r.lastFundingRate < 0).length;
  const bearishCount = rates.filter((r) => r.lastFundingRate > 0).length;

  return (
    <>
      <PageHead
        title="Live Funding Rates | RBS"
        description="Real-time Binance perpetual futures funding rates for top 10 crypto pairs."
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section
          className="pt-24 pb-12 px-4 text-center border-b border-gray-100"
          style={{
            background:
              "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-sky-50 text-sky-700 text-sm font-medium mb-6">
                <Activity className="w-4 h-4" />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Futures Funding Rates
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Crypto <span className="text-sky-600">Funding Rates</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Real-time Binance perpetual futures funding rates — the most
                critical sentiment indicator in crypto derivatives trading.
              </p>
            </motion.div>

            {/* Summary Stats */}
            {rates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8"
              >
                {[
                  {
                    label: "Avg Funding",
                    value: `${avgFundingRate > 0 ? "+" : ""}${(avgFundingRate * 100).toFixed(4)}%`,
                    color:
                      avgFundingRate > 0 ? "text-red-600" : "text-emerald-600",
                  },
                  {
                    label: "Long Bias",
                    value: `${bearishCount}/${rates.length}`,
                    color: "text-red-600",
                  },
                  {
                    label: "Short Bias",
                    value: `${bullishCount}/${rates.length}`,
                    color: "text-emerald-600",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/80 backdrop-blur rounded-xl border border-gray-200 p-3"
                  >
                    <div className={`text-lg font-bold ${s.color}`}>
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Premium Sentiment Gauge */}
            {rates.length > 0 &&
              (() => {
                const gaugePosition = Math.max(
                  0,
                  Math.min(100, 50 - (avgFundingRate / 0.001) * 50),
                );
                const sentiment = getMarketSentiment(avgFundingRate);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                  >
                    <div className="flex justify-between text-xs font-bold mb-3">
                      <span className="text-red-600 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        BEARISH
                      </span>
                      <span className="text-gray-500">NEUTRAL</span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        BULLISH
                        <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                    <div
                      className="relative h-4 rounded-full overflow-visible"
                      style={{
                        background:
                          "linear-gradient(to right, #ef4444, #f97316, #d1d5db, #22c55e, #16a34a)",
                      }}
                    >
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-gray-800 shadow-lg z-10"
                        animate={{ left: `calc(${gaugePosition}% - 10px)` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Shorts Paying</span>
                      <span>Balanced</span>
                      <span>Longs Paying</span>
                    </div>
                    <div className="text-center mt-3">
                      <span className={`text-sm font-bold ${sentiment.color}`}>
                        {sentiment.label}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        avg {(avgFundingRate * 100).toFixed(4)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })()}
          </div>
        </section>

        {/* Table section */}
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Top 15 Perpetual Pairs
                </h2>
                <p className="text-sm text-gray-400">
                  {lastUpdated
                    ? `Updated ${lastUpdated.toLocaleTimeString()}`
                    : "Loading..."}{" "}
                  · Next refresh in {nextRefreshSecs}s
                </p>
                <div className="mt-1.5 h-1 w-48 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    key={lastUpdated?.getTime()}
                    className="h-full bg-sky-400 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 30, ease: "linear" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {error && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                    {error}
                  </span>
                )}
                <Button
                  data-ocid="funding.refresh.button"
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing || loading}
                  className="border-sky-300 text-sky-700 hover:bg-sky-50"
                >
                  <RefreshCw
                    className={`w-3 h-3 mr-1 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }, (_, i) => `sk-${i}`).map((k) => (
                  <div
                    key={k}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm" data-ocid="funding.table">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Pair
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Mark Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        24h Change
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Funding Rate
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                        Annualized
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                        Next Funding
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                        Signal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((r, i) => (
                      <motion.tr
                        key={r.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        data-ocid={`funding.row.item.${i + 1}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-[10px] font-bold text-sky-700">
                              {r.symbol.replace("USDT", "").slice(0, 3)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">
                                {r.symbol.replace("USDT", "/USDT")}
                              </div>
                              <div className="text-xs text-gray-400">
                                {r.displayName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900">
                          $
                          {r.markPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: r.markPrice > 100 ? 2 : 4,
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                              (r.priceChange24h ?? 0) >= 0
                                ? "text-emerald-600"
                                : "text-red-500"
                            }`}
                          >
                            {(r.priceChange24h ?? 0) >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {(r.priceChange24h ?? 0) >= 0 ? "+" : ""}
                            {(r.priceChange24h ?? 0).toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-bold font-mono text-sm px-2 py-0.5 rounded-full border ${r.rateBg} ${r.rateColor}`}
                          >
                            {r.lastFundingRate > 0 ? "+" : ""}
                            {(r.lastFundingRate * 100).toFixed(4)}%
                          </span>
                          <div className="mt-1 h-1 w-full max-w-[80px] ml-auto rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(100, (Math.abs(r.lastFundingRate) / 0.001) * 100)}%`,
                              }}
                              transition={{ duration: 0.6 }}
                              className={`h-full rounded-full ${r.lastFundingRate > 0 ? "bg-red-400" : r.lastFundingRate < 0 ? "bg-emerald-400" : "bg-gray-300"}`}
                            />
                          </div>
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold text-sm hidden sm:table-cell ${r.rateColor}`}
                        >
                          {r.annualizedRate > 0 ? "+" : ""}
                          {r.annualizedRate.toFixed(1)}%/yr
                        </td>
                        <td className="py-3 px-4 text-right hidden md:table-cell">
                          <CountdownTimer targetMs={r.nextFundingTime} />
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border font-medium ${r.signalBg} ${r.signalColor}`}
                          >
                            {r.signal}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile signal cards */}
            {!loading && rates.length > 0 && (
              <div className="lg:hidden mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <h3 className="col-span-full text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Trading Signals
                </h3>
                {rates.map((r, i) => (
                  <div
                    key={r.symbol}
                    className={`rounded-xl border p-3 flex items-center justify-between ${r.signalBg}`}
                    data-ocid={`funding.signal.item.${i + 1}`}
                  >
                    <div>
                      <span className="font-bold text-gray-900 text-sm">
                        {r.symbol.replace("USDT", "/USDT")}
                      </span>
                      <div
                        className={`text-xs font-mono mt-0.5 ${r.rateColor}`}
                      >
                        {r.lastFundingRate > 0 ? "+" : ""}
                        {(r.lastFundingRate * 100).toFixed(4)}%
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium text-right max-w-[140px] ${r.signalColor}`}
                    >
                      {r.signal}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Market Sentiment Bar */}
        {rates.length > 0 && (
          <section className="py-8 px-4 bg-gray-50 border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Market Sentiment Overview
              </h3>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1 text-red-600 font-semibold">
                    <TrendingUp className="w-3 h-3" /> Long Crowded (
                    {bearishCount})
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Minus className="w-3 h-3" /> Neutral (
                    {10 - bullishCount - bearishCount})
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    Short Crowded ({bullishCount}){" "}
                    <TrendingDown className="w-3 h-3" />
                  </div>
                </div>
                <div className="h-4 rounded-full overflow-hidden bg-gray-100 flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(bearishCount / 10) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-red-400"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((10 - bullishCount - bearishCount) / 10) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gray-300"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(bullishCount / 10) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    className="h-full bg-emerald-400"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Based on funding rate direction — positive rate = longs
                  dominant, negative = shorts dominant
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Educational FAQ */}
        <section className="py-12 px-4 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Understanding Funding Rates
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  data-ocid={`funding.faq.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    data-ocid={`funding.faq.toggle.${i + 1}`}
                  >
                    <span className="font-semibold text-gray-900">
                      {item.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Want Full AI-Powered Signals?
            </h2>
            <p className="text-gray-500 mb-6">
              G-MAN Intelligence calculates RSI, MACD, EMA, Bollinger Bands and
              more for actionable BUY/SELL signals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="funding.market-intel.primary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold"
              >
                Open G-MAN Intel
              </Button>
              <Button
                data-ocid="funding.trading-tools.secondary_button"
                onClick={() => navigate({ to: "/trading-tools" })}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                All Trading Tools
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
