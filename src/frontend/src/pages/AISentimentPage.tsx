import { AlertCircle, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { Button } from "../components/ui/button";

interface FearGreedEntry {
  value: string;
  value_classification: string;
  timestamp: string;
}

interface FearGreedResponse {
  data: FearGreedEntry[];
}

function getFearGreedColor(value: number): string {
  if (value <= 20) return "#dc2626"; // Extreme Fear
  if (value <= 40) return "#ea580c"; // Fear
  if (value <= 60) return "#d97706"; // Neutral
  if (value <= 80) return "#65a30d"; // Greed
  return "#16a34a"; // Extreme Greed
}

function getFearGreedBg(value: number): string {
  if (value <= 20) return "bg-red-50 border-red-200";
  if (value <= 40) return "bg-orange-50 border-orange-200";
  if (value <= 60) return "bg-yellow-50 border-yellow-200";
  if (value <= 80) return "bg-lime-50 border-lime-200";
  return "bg-green-50 border-green-200";
}

function GaugeArc({ value }: { value: number }) {
  const radius = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = -180;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle;
  const valueAngle = startAngle + (value / 100) * totalAngle;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (start: number, end: number) => {
    const s = toRad(start);
    const e = toRad(end);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = e - s > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleAngle = toRad(valueAngle);
  const needleX = cx + (radius - 15) * Math.cos(needleAngle);
  const needleY = cy + (radius - 15) * Math.sin(needleAngle);

  const color = getFearGreedColor(value);

  return (
    <svg
      viewBox="0 0 200 110"
      className="w-full max-w-xs mx-auto"
      role="img"
      aria-label={`Fear & Greed gauge showing ${value}`}
    >
      {/* Background arc */}
      <path
        d={arcPath(-180, 0)}
        fill="none"
        stroke="#f0f0f0"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d={arcPath(-180, valueAngle)}
        fill="none"
        stroke={color}
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Zone colors beneath */}
      {[
        { start: -180, end: -144, color: "#dc2626" },
        { start: -144, end: -108, color: "#ea580c" },
        { start: -108, end: -72, color: "#d97706" },
        { start: -72, end: -36, color: "#65a30d" },
        { start: -36, end: 0, color: "#16a34a" },
      ].map((zone) => (
        <path
          key={zone.start}
          d={arcPath(zone.start, zone.end)}
          fill="none"
          stroke={zone.color}
          strokeWidth="4"
          opacity={0.25}
        />
      ))}
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill={color} />
      {/* Center label */}
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontSize="22"
        fontWeight="900"
        fill="#111"
      >
        {value}
      </text>
    </svg>
  );
}

export default function AISentimentPage() {
  const [data, setData] = useState<FearGreedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFearGreed = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch("https://api.alternative.me/fng/?limit=7");
      if (!res.ok) throw new Error("API error");
      const json: FearGreedResponse = await res.json();
      setData(json.data ?? []);
      setLastUpdated(new Date());
    } catch {
      setError(true);
    }
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    await fetchFearGreed();
    setIsLoading(false);
  }, [fetchFearGreed]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFearGreed();
    setIsRefreshing(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(fetchFearGreed, 5 * 60 * 1000); // 5 min
    return () => clearInterval(id);
  }, [load, fetchFearGreed]);

  const current = data[0];
  const currentValue = current ? Number.parseInt(current.value) : 0;
  const history = data.slice(1);

  return (
    <>
      <PageHead
        title="Fear & Greed Index | RBS"
        description="Real-time Crypto Fear & Greed Index with 7-day history. Essential contrarian trading indicator."
      />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div
          className="border-b pt-20 pb-8 px-4"
          style={{
            background:
              "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #f8faff 100%)",
            borderColor: "rgba(245, 158, 11, 0.2)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Fear &amp; Greed Index
                </h1>
                <p className="text-gray-500 mt-1">
                  Crypto market sentiment — refreshes every 5 minutes
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <Button
                  data-ocid="sentiment.refresh.button"
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
            </div>
          </div>
        </div>

        <SmokySectionTransition>
          <section className="py-8 px-4 max-w-4xl mx-auto space-y-8">
            {/* Error */}
            {error && (
              <div
                data-ocid="sentiment.error_state"
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
              >
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-semibold">
                  Failed to load Fear &amp; Greed data
                </p>
                <Button
                  data-ocid="sentiment.retry.button"
                  onClick={load}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div
                data-ocid="sentiment.loading_state"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[1, 2].map((k) => (
                  <div
                    key={k}
                    className="h-48 bg-gray-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {!isLoading && current && (
              <>
                {/* Current Index */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl border p-6 sm:p-8 text-center shadow-sm ${getFearGreedBg(currentValue)}`}
                  data-ocid="sentiment.current.card"
                >
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
                    Current Fear &amp; Greed Index
                  </p>

                  <GaugeArc value={currentValue} />

                  <p
                    className="text-3xl sm:text-4xl font-black mt-2"
                    style={{ color: getFearGreedColor(currentValue) }}
                  >
                    {current.value_classification}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(
                      Number.parseInt(current.timestamp) * 1000,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  {/* Zones legend */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {[
                      {
                        label: "Extreme Fear",
                        range: "0–20",
                        color: "bg-red-100 text-red-700 border-red-200",
                      },
                      {
                        label: "Fear",
                        range: "21–40",
                        color:
                          "bg-orange-100 text-orange-700 border-orange-200",
                      },
                      {
                        label: "Neutral",
                        range: "41–60",
                        color:
                          "bg-yellow-100 text-yellow-700 border-yellow-200",
                      },
                      {
                        label: "Greed",
                        range: "61–80",
                        color: "bg-lime-100 text-lime-700 border-lime-200",
                      },
                      {
                        label: "Extreme Greed",
                        range: "81–100",
                        color: "bg-green-100 text-green-700 border-green-200",
                      },
                    ].map((zone) => (
                      <span
                        key={zone.label}
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${zone.color}`}
                      >
                        {zone.label} ({zone.range})
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* 7-Day History */}
                {history.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">
                      7-Day History
                    </h3>
                    <div className="space-y-3">
                      {history.map((entry, idx) => {
                        const val = Number.parseInt(entry.value);
                        const color = getFearGreedColor(val);
                        const date = new Date(
                          Number.parseInt(entry.timestamp) * 1000,
                        );
                        return (
                          <motion.div
                            key={entry.timestamp}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            data-ocid={`sentiment.history.item.${idx + 1}`}
                            className="flex items-center gap-4"
                          >
                            <div className="w-20 text-xs text-gray-400 flex-shrink-0">
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{
                                  duration: 0.6,
                                  delay: idx * 0.05,
                                }}
                                className="h-full rounded-full flex items-center pl-3"
                                style={{ background: color }}
                              >
                                <span className="text-white text-xs font-bold leading-none">
                                  {val}
                                </span>
                              </motion.div>
                            </div>
                            <div className="w-28 text-right flex-shrink-0">
                              <span
                                className="text-xs font-semibold"
                                style={{ color }}
                              >
                                {entry.value_classification}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Trading guidance */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3">
                    How to Use This Indicator
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: "Extreme Fear (0–20)",
                        desc: "Historical buy signal — market may be oversold. Contrarians look for entry points.",
                        color: "border-red-200 bg-red-50",
                      },
                      {
                        title: "Fear (21–40)",
                        desc: "Cautious sentiment. Potential opportunity for patient investors with a long view.",
                        color: "border-orange-200 bg-orange-50",
                      },
                      {
                        title: "Neutral (41–60)",
                        desc: "Balanced market sentiment. No strong signal. Wait for a clearer directional move.",
                        color: "border-yellow-200 bg-yellow-50",
                      },
                      {
                        title: "Greed (61–80)",
                        desc: "Market may be overextended. Consider taking partial profits or tightening stops.",
                        color: "border-lime-200 bg-lime-50",
                      },
                    ].map((tip) => (
                      <div
                        key={tip.title}
                        className={`p-3 rounded-xl border ${tip.color}`}
                      >
                        <p className="text-xs font-bold text-gray-900 mb-1">
                          {tip.title}
                        </p>
                        <p className="text-xs text-gray-600">{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>Data source:</span>
              <a
                href="https://alternative.me/crypto/fear-and-greed-index/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-1"
              >
                alternative.me Fear &amp; Greed Index
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>· Not financial advice</span>
            </div>
          </section>
        </SmokySectionTransition>
      </div>
    </>
  );
}
