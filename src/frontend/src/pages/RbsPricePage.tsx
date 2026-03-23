import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart2,
  Calendar,
  Coins,
  ExternalLink,
  Globe,
  Lock,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BinanceCoin {
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
}

interface VoteTally {
  bullish: bigint;
  bearish: bigint;
  neutral: bigint;
  total: bigint;
}

// ── Countdown ─────────────────────────────────────────────────────────────────

const PRESALE_DATE = new Date("2027-03-31T23:59:59Z");

function useCountdown(target: Date) {
  const [left, setLeft] = useState(() =>
    Math.max(0, target.getTime() - Date.now()),
  );
  useEffect(() => {
    const id = setInterval(
      () => setLeft(Math.max(0, target.getTime() - Date.now())),
      1000,
    );
    return () => clearInterval(id);
  }, [target]);
  return {
    days: Math.floor(left / 86400000),
    hours: Math.floor((left % 86400000) / 3600000),
    minutes: Math.floor((left % 3600000) / 60000),
    seconds: Math.floor((left % 60000) / 1000),
    isUnlocked: left === 0,
  };
}

// ── Market Pulse section ──────────────────────────────────────────────────────

function MarketPulseEmbed() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [tally, setTally] = useState<VoteTally | null>(null);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  const fetchTally = useCallback(async () => {
    if (!actor) return;
    try {
      const t = await actor.getMarketPulseTally();
      setTally(t);
    } catch {
      /* silent */
    }
  }, [actor]);

  useEffect(() => {
    fetchTally();
    const id = setInterval(fetchTally, 15000);
    return () => clearInterval(id);
  }, [fetchTally]);

  const handleVote = async (sentiment: "Bullish" | "Bearish" | "Neutral") => {
    if (!actor || !isAuthenticated || voted || voting) return;
    setVoting(true);
    try {
      await actor.voteMarketPulse(sentiment);
      toast.success(`Voted ${sentiment}!`);
      setVoted(true);
      await fetchTally();
    } catch {
      toast.error("Vote failed");
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

  const sentiments = [
    {
      key: "Bullish" as const,
      label: "Bullish 🐂",
      pct: bullishPct,
      count: tally ? Number(tally.bullish) : 0,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      btnClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
    },
    {
      key: "Neutral" as const,
      label: "Neutral ⚖️",
      pct: neutralPct,
      count: tally ? Number(tally.neutral) : 0,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      btnClass: "bg-yellow-500 hover:bg-yellow-400 text-white",
    },
    {
      key: "Bearish" as const,
      label: "Bearish 🐻",
      pct: bearishPct,
      count: tally ? Number(tally.bearish) : 0,
      color: "bg-red-500",
      textColor: "text-red-600",
      btnClass: "bg-red-500 hover:bg-red-400 text-white",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-gray-900">Community Sentiment</h3>
        {total > 0 && (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs ml-auto">
            {total} votes
          </Badge>
        )}
      </div>

      <div className="space-y-3 mb-5">
        {sentiments.map((s) => (
          <div key={s.key}>
            <div className="flex justify-between text-sm mb-1">
              <span className={`font-semibold ${s.textColor}`}>{s.label}</span>
              <span className="font-bold text-gray-700">{s.pct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${s.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated ? (
        <div className="flex gap-2 flex-wrap">
          {sentiments.map((s) => (
            <Button
              key={s.key}
              data-ocid={`rbs-price.pulse.${s.key.toLowerCase()}.button`}
              size="sm"
              onClick={() => handleVote(s.key)}
              disabled={voted || voting}
              className={`flex-1 text-xs font-bold ${s.btnClass}`}
            >
              {s.label}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm">Login to vote</p>
      )}
      {voted && (
        <p className="text-center text-emerald-600 text-sm mt-2 font-medium">
          ✓ Vote recorded
        </p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RbsPricePage() {
  const navigate = useNavigate();
  const { days, hours, minutes, seconds } = useCountdown(PRESALE_DATE);
  const [marketCoins, setMarketCoins] = useState<BinanceCoin[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMarketPrices = useCallback(async () => {
    setLoadingPrices(true);
    try {
      const symbolsParam = encodeURIComponent(
        JSON.stringify(["BTCUSDT", "ETHUSDT"]),
      );
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`,
      );
      if (!res.ok) throw new Error("Binance API error");
      const data = await res.json();
      const mapped: BinanceCoin[] = data.map(
        (d: {
          symbol: string;
          lastPrice: string;
          priceChangePercent: string;
          highPrice: string;
          lowPrice: string;
          volume: string;
        }) => ({
          symbol: d.symbol.replace("USDT", ""),
          price: Number.parseFloat(d.lastPrice),
          change: Number.parseFloat(d.priceChangePercent),
          high: Number.parseFloat(d.highPrice),
          low: Number.parseFloat(d.lowPrice),
          volume: Number.parseFloat(d.volume),
        }),
      );
      setMarketCoins(mapped);
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketPrices();
    const id = setInterval(fetchMarketPrices, 15000);
    return () => clearInterval(id);
  }, [fetchMarketPrices]);

  const phaseData = [
    {
      phase: "Phase 1",
      title: "Token Creation",
      status: "complete",
      date: "2025",
      desc: "RBS token minted on Internet Computer",
    },
    {
      phase: "Phase 2",
      title: "Presale Launch",
      status: "upcoming",
      date: "Q1 2027",
      desc: "Public presale begins — 10% of total supply",
    },
    {
      phase: "Phase 3",
      title: "Community Growth",
      status: "upcoming",
      date: "Q3 2028",
      desc: "Ecosystem expansion and partnerships",
    },
    {
      phase: "Phase 4",
      title: "Airdrop",
      status: "upcoming",
      date: "Q1 2029",
      desc: "Community airdrop event",
    },
    {
      phase: "Phase 5",
      title: "Exchange Listing",
      status: "upcoming",
      date: "TBA",
      desc: "Centralized exchange listing — price discovery",
    },
  ];

  const tokenStats = [
    {
      label: "Total Supply",
      value: "100,000 RBS",
      icon: Coins,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Network",
      value: "Internet Computer",
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Status",
      value: "Pre-Launch",
      icon: Lock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Presale Opens",
      value: "Q1 2027",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Community Pool",
      value: "8,000 RBS",
      icon: Users,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      label: "Token Burns",
      value: "15%",
      icon: Zap,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const utilities = [
    "Store of Value — Fixed supply with deflationary mechanics",
    "Community Governance — Vote on ecosystem proposals",
    "Staking Rewards — Earn 8–20% APY on locked tokens",
    "Ecosystem Access — Premium features and early access",
  ];

  return (
    <>
      <PageHead
        title="RBS Token Price | Pre-Launch Phase"
        description="Track the RBS token pre-launch status, countdown to presale, and community sentiment. Fixed supply of 100,000 RBS on Internet Computer."
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <SmokySectionTransition>
          <section
            className="pt-24 pb-12 px-4"
            style={{
              background:
                "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f8faff 100%)",
            }}
          >
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 text-xs text-orange-700 font-semibold mb-5"
              >
                <Lock className="w-3.5 h-3.5" />
                Pre-Launch Phase — Price TBA at Presale
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <div className="h-14 w-14 rounded-full bg-sky-500 flex items-center justify-center text-white font-black text-lg ring-2 ring-sky-200">
                  RBS
                </div>
                <div className="text-left">
                  <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-none">
                    RBS Token
                  </h1>
                  <p className="text-emerald-600 font-semibold text-sm">
                    Pre-Launch Price Tracker
                  </p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto mb-8"
              >
                The RBS token is not yet publicly traded. Monitor the countdown
                to presale, community sentiment, and real-time market context
                below.
              </motion.p>

              {/* Countdown to Presale */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-emerald-200 shadow-lg p-6 max-w-lg mx-auto mb-6"
              >
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                  Presale Opens In
                </p>
                <div className="flex items-center justify-center gap-3">
                  {[
                    { v: days, l: "Days" },
                    { v: hours, l: "Hours" },
                    { v: minutes, l: "Min" },
                    { v: seconds, l: "Sec" },
                  ].map(({ v, l }) => (
                    <div key={l} className="flex flex-col items-center">
                      <div
                        className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-emerald-700 tabular-nums"
                        style={{
                          background:
                            "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                          border: "2px solid rgba(16,185,129,0.3)",
                        }}
                      >
                        {String(v).padStart(2, "0")}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 font-medium">
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  March 31, 2027 at 23:59 UTC
                </p>
              </motion.div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  data-ocid="rbs-price.acquisition.button"
                  onClick={() => navigate({ to: "/acquisition" })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  How to Get RBS
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  data-ocid="rbs-price.market-intel.button"
                  variant="outline"
                  onClick={() => navigate({ to: "/market-intel" })}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold px-6"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Market Intel
                </Button>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
          {/* Token Stats */}
          <SmokySectionTransition>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                Token Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tokenStats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div
                      className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}
                    >
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className={`font-bold text-sm ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </SmokySectionTransition>

          {/* Price Card — Locked */}
          <SmokySectionTransition>
            <div
              className="rounded-2xl p-6 sm:p-8 text-center border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(6,182,212,0.06) 100%)",
                borderColor: "rgba(16,185,129,0.2)",
              }}
            >
              <div className="w-12 h-12 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-50 text-orange-700 border-orange-200 mb-3">
                Pre-Launch
              </Badge>
              <p className="text-4xl font-black text-gray-900 mb-2">TBA</p>
              <p className="text-gray-500 text-sm">
                Launch price will be revealed at the Presale opening on{" "}
                <span className="text-emerald-700 font-semibold">
                  March 31, 2027
                </span>
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
                <div>
                  <p className="text-gray-400 text-xs">Supply</p>
                  <p className="font-bold text-gray-900 text-sm">100,000</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Network</p>
                  <p className="font-bold text-gray-900 text-sm">ICP</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Type</p>
                  <p className="font-bold text-gray-900 text-sm">Fixed</p>
                </div>
              </div>
            </div>
          </SmokySectionTransition>

          {/* Live Market Context + Community Pulse */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Major Assets */}
            <SmokySectionTransition>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Major Assets
                    <span className="text-xs text-gray-400 font-normal">
                      (context only)
                    </span>
                  </h3>
                  <button
                    type="button"
                    data-ocid="rbs-price.market.refresh.button"
                    onClick={fetchMarketPrices}
                    disabled={loadingPrices}
                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loadingPrices ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>

                {lastUpdated && (
                  <p className="text-xs text-gray-400 mb-3">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}

                {loadingPrices && marketCoins.length === 0 ? (
                  <div className="space-y-3">
                    {[1, 2].map((k) => (
                      <div
                        key={k}
                        className="h-16 bg-gray-100 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {marketCoins.map((coin) => (
                      <div
                        key={coin.symbol}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div>
                          <p className="font-bold text-gray-900">
                            {coin.symbol}
                          </p>
                          <p className="text-xs text-gray-400">
                            H: $
                            {coin.high.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                            })}{" "}
                            / L: $
                            {coin.low.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-gray-900">
                            $
                            {coin.price.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <div
                            className={`flex items-center gap-1 justify-end text-sm font-semibold ${coin.change >= 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {coin.change >= 0 ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {coin.change >= 0 ? "+" : ""}
                            {coin.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3 text-center">
                  Live data from Binance • Not RBS price
                </p>
              </div>
            </SmokySectionTransition>

            {/* Community Pulse */}
            <SmokySectionTransition>
              <MarketPulseEmbed />
            </SmokySectionTransition>
          </div>

          {/* Launch Phases */}
          <SmokySectionTransition>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Launch Roadmap
              </h2>
              <div className="space-y-3">
                {phaseData.map((p, idx) => (
                  <motion.div
                    key={p.phase}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      p.status === "complete"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-gray-200 hover:border-emerald-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                        p.status === "complete"
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                    >
                      {p.status === "complete" ? "✓" : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm">
                          {p.title}
                        </span>
                        <Badge
                          className={`text-xs ${
                            p.status === "complete"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}
                        >
                          {p.date}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </SmokySectionTransition>

          {/* Token Utility */}
          <SmokySectionTransition>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Token Utility
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {utilities.map((u) => (
                  <div
                    key={u}
                    className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{u}</p>
                  </div>
                ))}
              </div>
            </div>
          </SmokySectionTransition>

          {/* Progress Bar */}
          <SmokySectionTransition>
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900 text-sm">
                  Pre-Launch Progress
                </span>
                <span className="text-emerald-700 font-bold text-sm">
                  Phase 1 of 5
                </span>
              </div>
              <Progress value={20} className="h-3" />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Token Created</span>
                <span>Exchange Listing</span>
              </div>
            </div>
          </SmokySectionTransition>

          {/* Bottom CTAs */}
          <SmokySectionTransition>
            <div className="text-center space-y-4">
              <p className="text-gray-500 text-sm">
                Ready to join the RBS ecosystem?
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  data-ocid="rbs-price.acquire.primary_button"
                  onClick={() => navigate({ to: "/acquisition" })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Register Interest
                </Button>
                <Button
                  data-ocid="rbs-price.whitepaper.link"
                  variant="outline"
                  onClick={() => navigate({ to: "/whitepaper" })}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Whitepaper
                </Button>
                <Button
                  data-ocid="rbs-price.telegram.link"
                  variant="outline"
                  onClick={() =>
                    window.open("https://t.me/RBSuperior", "_blank")
                  }
                  className="border-sky-300 text-sky-700 hover:bg-sky-50 px-6"
                >
                  Join Telegram
                </Button>
              </div>
            </div>
          </SmokySectionTransition>
        </div>
      </div>
    </>
  );
}
