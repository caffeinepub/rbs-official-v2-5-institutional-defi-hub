import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";

import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface FGEntry {
  value: string;
  value_classification: string;
  timestamp: string;
}

interface FGResponse {
  data: FGEntry[];
  metadata: { error: null | string };
}

function getFearGreedColor(value: number): string {
  if (value <= 25) return "text-red-600";
  if (value <= 46) return "text-orange-600";
  if (value <= 54) return "text-yellow-600";
  if (value <= 75) return "text-green-600";
  return "text-emerald-600";
}

function getFearGreedBg(value: number): string {
  if (value <= 25) return "bg-red-50 border-red-200";
  if (value <= 46) return "bg-orange-50 border-orange-200";
  if (value <= 54) return "bg-yellow-50 border-yellow-200";
  if (value <= 75) return "bg-green-50 border-green-200";
  return "bg-emerald-50 border-emerald-200";
}

function getFearGreedBarColor(value: number): string {
  if (value <= 25) return "#dc2626";
  if (value <= 46) return "#ea580c";
  if (value <= 54) return "#ca8a04";
  if (value <= 75) return "#16a34a";
  return "#059669";
}

function getTradingAdvice(classification: string): string {
  switch (classification) {
    case "Extreme Fear":
      return "Historically, extreme fear signals buying opportunities. Consider dollar-cost averaging cautiously.";
    case "Fear":
      return "Market is pessimistic. Contrarian traders often see value here. Research before buying.";
    case "Neutral":
      return "Balanced sentiment. Look for individual asset catalysts rather than macro sentiment plays.";
    case "Greed":
      return "Markets are getting greedy. Be cautious — consider taking partial profits or tightening stops.";
    case "Extreme Greed":
      return "Extreme greed often precedes corrections. Consider reducing exposure or setting tight stop-losses.";
    default:
      return "Monitor closely and follow your trading strategy.";
  }
}

const ZONES = [
  {
    range: "0–25",
    label: "Extreme Fear",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    advice: "Potential buy zone — fear often overshoots downward.",
    icon: TrendingDown,
  },
  {
    range: "26–46",
    label: "Fear",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    advice: "Market pessimism — cautious accumulation opportunity.",
    icon: TrendingDown,
  },
  {
    range: "47–54",
    label: "Neutral",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    advice: "Balanced. Use other indicators to guide decisions.",
    icon: RefreshCw,
  },
  {
    range: "55–75",
    label: "Greed",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    advice: "Exercise caution. Evaluate if rally is sustainable.",
    icon: TrendingUp,
  },
  {
    range: "76–100",
    label: "Extreme Greed",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    advice: "High risk zone. Historically precedes corrections.",
    icon: TrendingUp,
  },
];

export default function FearGreedPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FGEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("https://api.alternative.me/fng/?limit=10");
      if (!res.ok) throw new Error("API error");
      const data: FGResponse = await res.json();
      if (data?.data) {
        setEntries(data.data);
        setLastRefresh(new Date());
      }
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const current = entries[0];
  const currentValue = current ? Number.parseInt(current.value) : null;
  const history = entries.slice(1);

  return (
    <>
      <PageHead
        title="Fear & Greed Index | RBS"
        description="Daily crypto Fear & Greed Index — track market sentiment with 7-day history and trading guidance."
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section
          className="pt-24 pb-12 px-4 border-b border-gray-100"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #fff7ed 60%, #ffedd5 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium mb-6">
                <RefreshCw className="w-4 h-4" /> Sentiment Indicator
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Fear &amp; <span className="text-orange-500">Greed Index</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                The contrarian trader's edge. When others are fearful, be
                greedy. When others are greedy, be fearful.
              </p>
              <div className="flex items-center justify-center gap-3 mt-3">
                {lastRefresh && (
                  <p className="text-xs text-gray-400">
                    Last updated: {lastRefresh.toLocaleTimeString()} •
                    Auto-refresh every 60s
                  </p>
                )}
                <Button
                  data-ocid="fear-greed.refresh.button"
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing || isLoading}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
          {/* Current Index */}
          {isLoading ? (
            <div
              className="h-48 bg-gray-100 rounded-2xl animate-pulse"
              data-ocid="fear-greed.loading_state"
            />
          ) : current && currentValue !== null ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-8 ${getFearGreedBg(currentValue)}`}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div
                    className={`text-8xl font-bold font-jetbrains mb-2 ${getFearGreedColor(currentValue)}`}
                  >
                    {currentValue}
                  </div>
                  <div
                    className={`text-2xl font-bold ${getFearGreedColor(currentValue)}`}
                  >
                    {current.value_classification}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    Today's Index
                  </div>

                  {/* Visual gauge */}
                  <div className="mt-4 w-48 mx-auto">
                    <div className="h-4 bg-white rounded-full overflow-hidden border border-white/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentValue}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: getFearGreedBarColor(currentValue),
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Fear</span>
                      <span>Greed</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-gray-900 font-bold text-lg mb-2">
                    Trading Interpretation
                  </h3>
                  <p
                    className={`text-base font-medium mb-3 ${getFearGreedColor(currentValue)}`}
                  >
                    {current.value_classification} Zone
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {getTradingAdvice(current.value_classification)}
                  </p>

                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500">
                      <strong className="text-gray-700">
                        The Fear &amp; Greed Index
                      </strong>{" "}
                      is a composite of volatility, market momentum, social
                      media volume, surveys, Bitcoin dominance, and Google
                      Trends. Values from 0–100.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
              data-ocid="fear-greed.error_state"
            >
              <p className="text-red-600">
                Failed to load Fear &amp; Greed data. Please try again.
              </p>
              <Button
                onClick={fetchData}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Retry
              </Button>
            </div>
          )}

          {/* 7-Day History */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                7-Day History
              </h2>
              <div className="space-y-3" data-ocid="fear-greed.history.list">
                {history.slice(0, 7).map((entry, i) => {
                  const val = Number.parseInt(entry.value);
                  const date = new Date(
                    Number.parseInt(entry.timestamp) * 1000,
                  );
                  return (
                    <motion.div
                      key={entry.timestamp}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4"
                      data-ocid={`fear-greed.history.item.${i + 1}`}
                    >
                      <div className="w-24 text-xs text-gray-400 text-right">
                        {date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.05,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{ background: getFearGreedBarColor(val) }}
                        />
                      </div>
                      <div
                        className="w-8 text-right font-bold font-jetbrains text-sm"
                        style={{ color: getFearGreedBarColor(val) }}
                      >
                        {val}
                      </div>
                      <div className="w-28 text-xs text-gray-500 truncate">
                        {entry.value_classification}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Zone Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Zone Guide & Trading Interpretation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {ZONES.map((zone) => (
                <div
                  key={zone.label}
                  className={`rounded-xl border p-4 ${zone.bg} ${current?.value_classification === zone.label ? "ring-2 ring-offset-1 ring-emerald-400 shadow-sm" : ""}`}
                >
                  <div
                    className={`flex items-center gap-1.5 mb-2 ${zone.color}`}
                  >
                    <zone.icon className="w-4 h-4" />
                    <span className="font-bold text-sm">{zone.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1 font-mono">
                    {zone.range}
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    {zone.advice}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-gray-600 mb-4">
              Use the Fear &amp; Greed Index alongside G-MAN Intel for stronger
              signals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="fear-greed.market-intel.button"
                onClick={() => navigate({ to: "/market-intel" })}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Open G-MAN Intel <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                data-ocid="fear-greed.trading-tools.button"
                onClick={() => navigate({ to: "/trading-tools" })}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-white"
              >
                All Trading Tools <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
