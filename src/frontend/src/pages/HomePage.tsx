import { AnimatedSection } from "@/components/AnimatedSection";
import { PageHead } from "@/components/PageHead";
import { ParticleField } from "@/components/ParticleField";
import { SmokySectionTransition } from "@/components/SmokySectionTransition";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  Calendar,
  CheckCircle,
  Coins,
  Eye,
  Globe,
  Lock,
  MessageCircle,
  RefreshCw,
  Send,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CryptoPrice {
  usd: number;
  usd_24h_change?: number;
}

interface PricesMap {
  bitcoin?: CryptoPrice;
  ethereum?: CryptoPrice;
  binancecoin?: CryptoPrice;
  ripple?: CryptoPrice;
  solana?: CryptoPrice;
}

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

interface QuickSignal {
  asset: string;
  symbol: string;
  signal: string;
  confidence: number;
  rsi: number;
  color: string;
  borderColor: string;
  bgColor: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Total Supply",
    value: "100,000 RBS",
    icon: Coins,
    color: "text-emerald-600",
  },
  {
    label: "Presale Opens",
    value: "Q1 2027",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    label: "Liquidity Pool",
    value: "40%",
    icon: TrendingUp,
    color: "text-blue-600",
  },
  {
    label: "Community Pool",
    value: "8,000 RBS",
    icon: Users,
    color: "text-purple-600",
  },
  {
    label: "Airdrop Opens",
    value: "Q1 2029",
    icon: Globe,
    color: "text-pink-600",
  },
  { label: "Token Burns", value: "15%", icon: Zap, color: "text-red-600" },
];

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Live Market Data",
    description:
      "Real-time price tracking and market analytics with automatic refresh every 30 seconds.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    cardBorder: "border-emerald-100 hover:border-emerald-300",
  },
  {
    icon: Zap,
    title: "G-MAN Intelligence",
    description:
      "Passcode-locked AI signal engine generating real-time trading signals with RSI, MACD, EMA and more.",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    cardBorder: "border-sky-100 hover:border-sky-300",
  },
  {
    icon: Shield,
    title: "AI Sentiment",
    description:
      "Machine learning-powered market sentiment scoring with confidence metrics and real-time accuracy.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    cardBorder: "border-blue-100 hover:border-blue-300",
  },
  {
    icon: Users,
    title: "Community Governance",
    description:
      "Decentralized decision-making with proposal creation and open voting for all community members.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    cardBorder: "border-purple-100 hover:border-purple-300",
  },
  {
    icon: Globe,
    title: "Market Dashboard",
    description:
      "Comprehensive market intelligence hub with live prices, news, and analytics in one place.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    cardBorder: "border-emerald-100 hover:border-emerald-300",
  },
  {
    icon: Lock,
    title: "Staking Calculator",
    description:
      "Calculate your RBS staking rewards with compound interest and tier-based APY projections.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    cardBorder: "border-emerald-100 hover:border-emerald-300",
  },
];

const CRYPTO_IDS = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "ripple",
  "solana",
] as const;

const CRYPTO_META: Record<
  string,
  { symbol: string; name: string; logo: string }
> = {
  bitcoin: {
    symbol: "BTC",
    name: "Bitcoin",
    logo: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
  },
  ethereum: {
    symbol: "ETH",
    name: "Ethereum",
    logo: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
  },
  binancecoin: {
    symbol: "BNB",
    name: "BNB",
    logo: "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png",
  },
  ripple: {
    symbol: "XRP",
    name: "XRP",
    logo: "https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png",
  },
  solana: {
    symbol: "SOL",
    name: "Solana",
    logo: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png",
  },
};

const WHY_RBS = [
  {
    icon: Lock,
    title: "Fixed Supply",
    desc: "100,000 RBS total supply — permanently capped, no inflation, ever.",
    side: "left",
    accentColor: "border-l-cyan-500",
  },
  {
    icon: Users,
    title: "Community Governed",
    desc: "Vote on proposals, shape the future. Every holder has a voice.",
    side: "right",
    accentColor: "border-l-purple-500",
  },
  {
    icon: Zap,
    title: "Real Signals",
    desc: "G-Man Intelligence delivers live trading signals from real market data.",
    side: "left",
    accentColor: "border-l-sky-500",
  },
  {
    icon: Eye,
    title: "Transparent",
    desc: "Open-source codebase, community-audited smart contracts.",
    side: "right",
    accentColor: "border-l-emerald-500",
  },
];

const UTILITY_ITEMS = [
  {
    icon: TrendingUp,
    title: "Trading Signal Access",
    desc: "Unlock G-MAN Intelligence signals for real-time trading analysis.",
  },
  {
    icon: Users,
    title: "Community Voting",
    desc: "Use RBS to vote on governance proposals and ecosystem decisions.",
  },
  {
    icon: Coins,
    title: "Staking Rewards",
    desc: "Stake your RBS tokens and earn compounding APY rewards.",
  },
  {
    icon: Shield,
    title: "Presale Access",
    desc: "Early holders get priority access to the Q1 2027 presale allocation.",
  },
  {
    icon: Globe,
    title: "Airdrop Eligibility",
    desc: "Hold RBS to qualify for the Q1 2029 airdrop distribution.",
  },
  {
    icon: Lock,
    title: "Ecosystem Governance",
    desc: "Shape product roadmap and protocol parameters as a holder.",
  },
];

const SECURITY_BADGES = [
  {
    icon: Shield,
    title: "Blockchain Verified",
    desc: "Built on Internet Computer Protocol",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Eye,
    title: "100% Transparent",
    desc: "Open-source, community audited",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    icon: Lock,
    title: "Fixed Supply",
    desc: "100,000 RBS, immutable forever",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Users,
    title: "Community Governed",
    desc: "Decentralized token decisions",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const TRADING_TOOLS = [
  {
    icon: Zap,
    title: "G-MAN Intel",
    desc: "Real-time AI-powered trading signals with RSI, MACD, EMA indicators.",
    path: "/market-intel",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200 hover:border-emerald-400",
  },
  {
    icon: Coins,
    title: "Staking Calculator",
    desc: "Calculate compound staking rewards with tier-based APY projections.",
    path: "/staking",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200 hover:border-emerald-400",
  },
  {
    icon: Activity,
    title: "Alerts Center",
    desc: "Set price and indicator alerts — get notified when markets move.",
    path: "/alerts",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200 hover:border-red-400",
  },
  {
    icon: TrendingUp,
    title: "Market Dashboard",
    desc: "Live market overview with real-time prices, dominance, and analytics.",
    path: "/dashboard",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200 hover:border-blue-400",
  },
  {
    icon: BarChart2,
    title: "Market Dashboard",
    desc: "Full crypto market overview with live prices and analytics.",
    path: "/dashboard",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200 hover:border-purple-400",
  },
  {
    icon: AlertTriangle,
    title: "Fear & Greed",
    desc: "Daily Fear & Greed Index — the contrarian trader's edge.",
    path: "/fear-greed",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200 hover:border-orange-400",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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

async function fetchKlines(symbol: string, interval: string, limit = 100) {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  );
  if (!res.ok) throw new Error("Binance error");
  const data: [string, string, string, string, string, string][] =
    await res.json();
  return data.map((k) => ({ close: Number.parseFloat(k[4]) }));
}

function calcRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    gains.push(d > 0 ? d : 0);
    losses.push(d < 0 ? Math.abs(d) : 0);
  }
  const avgG = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgL = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
  if (avgL === 0) return 100;
  return 100 - 100 / (1 + avgG / avgL);
}

function calcEMA(data: number[], period: number): number {
  if (!data.length) return 0;
  const k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) ema = data[i] * k + ema * (1 - k);
  return ema;
}

function calcSignal(
  rsi: number,
  macd: number,
  closes: number[],
): {
  signal: string;
  confidence: number;
  color: string;
  borderColor: string;
  bgColor: string;
} {
  let score = 0;
  if (rsi < 30) score += 2;
  else if (rsi < 45) score += 1;
  else if (rsi > 70) score -= 2;
  else if (rsi > 55) score -= 1;
  if (macd > 0) score += 1;
  else score -= 1;
  if (closes.length >= 20) {
    const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    if (closes[closes.length - 1] > sma20) score += 1;
    else score -= 1;
  }
  if (score >= 3)
    return {
      signal: "Strong Buy",
      confidence: Math.min(95, 70 + score * 5),
      color: "#16a34a",
      borderColor: "border-green-300",
      bgColor: "bg-green-50",
    };
  if (score >= 1)
    return {
      signal: "Buy",
      confidence: Math.min(80, 60 + score * 5),
      color: "#22c55e",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
    };
  if (score === 0)
    return {
      signal: "Neutral",
      confidence: 50,
      color: "#f59e0b",
      borderColor: "border-yellow-200",
      bgColor: "bg-yellow-50",
    };
  if (score >= -2)
    return {
      signal: "Sell",
      confidence: Math.min(80, 60 + Math.abs(score) * 5),
      color: "#ef4444",
      borderColor: "border-red-200",
      bgColor: "bg-red-50",
    };
  return {
    signal: "Strong Sell",
    confidence: Math.min(95, 70 + Math.abs(score) * 5),
    color: "#dc2626",
    borderColor: "border-red-300",
    bgColor: "bg-red-50",
  };
}

// ── Animated Counter component ────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = "",
}: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Top Movers Section ─────────────────────────────────────────────────────────

interface MoverCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

function TopMoversSection() {
  const navigate = useNavigate();
  const [gainers, setGainers] = useState<MoverCoin[]>([]);
  const [losers, setLosers] = useState<MoverCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMovers = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
      );
      if (!res.ok) throw new Error("API error");
      const data: MoverCoin[] = await res.json();
      const sorted = [...data].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
      );
      setGainers(sorted.slice(0, 3));
      setLosers(sorted.slice(-3).reverse());
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMovers();
    const interval = setInterval(fetchMovers, 60000);
    return () => clearInterval(interval);
  }, [fetchMovers]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMovers();
  };

  return (
    <SmokySectionTransition delay={80}>
      <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6 bg-white border-y border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection direction="up" className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-3 sm:mb-4">
              <TrendingUp className="w-4 h-4" /> Market Movers
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Top Movers Today
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Biggest gainers and losers in the last 24 hours
            </p>
            <div className="flex justify-center mt-3">
              <div className="flex items-center gap-2">
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <Button
                  data-ocid="home.movers.refresh.button"
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing || loading}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((k) => (
                <div
                  key={k}
                  className="h-40 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Gainers */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-700">
                    Top Gainers
                  </span>
                </div>
                {gainers.map((coin, i) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:shadow-sm transition-all"
                    data-ocid={`home.movers.gainer.item.${i + 1}`}
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 uppercase text-sm">
                        {coin.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{coin.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-gray-900 text-sm">
                        $
                        {coin.current_price.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </div>
                      <div className="text-emerald-600 font-bold text-sm">
                        +{coin.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Losers */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-red-600">Top Losers</span>
                </div>
                {losers.map((coin, i) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 hover:shadow-sm transition-all"
                    data-ocid={`home.movers.loser.item.${i + 1}`}
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 uppercase text-sm">
                        {coin.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{coin.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-gray-900 text-sm">
                        $
                        {coin.current_price.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </div>
                      <div className="text-red-600 font-bold text-sm">
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <Button
              data-ocid="home.movers.heatmap.button"
              onClick={() => navigate({ to: "/crypto-heatmap" })}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              View Full Heatmap <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </SmokySectionTransition>
  );
}

// ── BTC Dominance Section ──────────────────────────────────────────────────────

interface GlobalData {
  data: {
    market_cap_percentage: { btc: number; eth: number };
  };
}

function BTCDominanceSection() {
  const [btcDom, setBtcDom] = useState<number | null>(null);
  const [ethDom, setEthDom] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await window.fetch(
          "https://api.coingecko.com/api/v3/global",
        );
        if (!res.ok) return;
        const data: GlobalData = await res.json();
        setBtcDom(data.data.market_cap_percentage.btc);
        setEthDom(data.data.market_cap_percentage.eth);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetch();
    const interval = setInterval(fetch, 120000);
    return () => clearInterval(interval);
  }, []);

  const others =
    btcDom !== null && ethDom !== null
      ? Math.max(0, 100 - btcDom - ethDom)
      : null;

  const dominanceStats = [
    {
      label: "BTC Dominance",
      value: btcDom,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      barColor: "#f97316",
      icon: "₿",
    },
    {
      label: "ETH Dominance",
      value: ethDom,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      barColor: "#3b82f6",
      icon: "Ξ",
    },
    {
      label: "Others",
      value: others,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      barColor: "#8b5cf6",
      icon: "✦",
    },
  ];

  return (
    <SmokySectionTransition delay={80}>
      <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection direction="up" className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium mb-3 sm:mb-4">
              <Globe className="w-4 h-4" /> Market Dominance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              BTC Dominance
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              Market dominance shows what % of total crypto market cap each
              asset holds.
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((k) => (
                <div
                  key={k}
                  className="h-28 bg-white rounded-2xl border border-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dominanceStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-5 rounded-2xl bg-white border ${stat.border} hover:shadow-md transition-all duration-300`}
                  data-ocid={`home.dominance.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-2xl font-bold ${stat.color}`}>
                      {stat.icon}
                    </span>
                    <motion.span
                      key={stat.value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className={`text-2xl font-bold font-jetbrains ${stat.color}`}
                    >
                      {stat.value !== null ? `${stat.value.toFixed(1)}%` : "—"}
                    </motion.span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {stat.label}
                  </div>
                  {stat.value !== null && (
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(stat.value, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: i * 0.1 + 0.3,
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: stat.barColor }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SmokySectionTransition>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<PricesMap>({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPricesRefreshing, setIsPricesRefreshing] = useState(false);

  // Fear & Greed
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);

  // Quick Signals
  const [quickSignals, setQuickSignals] = useState<QuickSignal[]>([]);
  const [signalsLoading, setSignalsLoading] = useState(false);
  const [isSignalsRefreshing, setIsSignalsRefreshing] = useState(false);

  const fetchPrices = useCallback(async () => {
    try {
      const ids = CRYPTO_IDS.join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      );
      if (!res.ok) throw new Error("API error");
      const data: PricesMap = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
    } catch {
      /* keep previous */
    } finally {
      setPricesLoading(false);
    }
  }, []);

  const fetchQuickSignals = useCallback(async () => {
    setSignalsLoading(true);
    try {
      const assets = [
        { symbol: "BTCUSDT", label: "BTC", name: "Bitcoin" },
        { symbol: "ETHUSDT", label: "ETH", name: "Ethereum" },
        { symbol: "SOLUSDT", label: "SOL", name: "Solana" },
      ];
      const results = await Promise.all(
        assets.map(async (a) => {
          const klines = await fetchKlines(a.symbol, "1h", 100);
          const closes = klines.map((k) => k.close);
          const rsi = calcRSI(closes);
          const ema12 = calcEMA(closes, 12);
          const ema26 = calcEMA(closes, 26);
          const macd = ema12 - ema26;
          const sig = calcSignal(rsi, macd, closes);
          return {
            asset: a.name,
            symbol: a.label,
            rsi,
            signal: sig.signal,
            confidence: sig.confidence,
            color: sig.color,
            borderColor: sig.borderColor,
            bgColor: sig.bgColor,
          };
        }),
      );
      setQuickSignals(results);
    } catch {
      /* keep previous */
    } finally {
      setSignalsLoading(false);
    }
  }, []);

  const handlePricesRefresh = async () => {
    setIsPricesRefreshing(true);
    await fetchPrices();
    setIsPricesRefreshing(false);
  };

  const handleSignalsRefresh = async () => {
    setIsSignalsRefreshing(true);
    await fetchQuickSignals();
    setIsSignalsRefreshing(false);
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  useEffect(() => {
    const fetchFearGreed = async () => {
      try {
        const res = await fetch("https://api.alternative.me/fng/?limit=1");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.data?.[0]) setFearGreed(data.data[0]);
      } catch {
        /* silently fail */
      }
    };
    fetchFearGreed();
    const interval = setInterval(fetchFearGreed, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchQuickSignals();
    const interval = setInterval(fetchQuickSignals, 30000);
    return () => clearInterval(interval);
  }, [fetchQuickSignals]);

  const fearGreedValue = fearGreed ? Number.parseInt(fearGreed.value) : null;

  return (
    <>
      <PageHead
        title="Home"
        description="Return Be Superior — Advanced blockchain solutions and RBS token ecosystem"
      />

      <div className="min-h-screen text-gray-900 bg-white">
        {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f0f9ff 60%, #e0f2fe 100%)",
          }}
        >
          <ParticleField count={40} color="rgba(14, 165, 233, 0.2)" />

          {/* Light orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-40 pointer-events-none animate-glow-pulse" />

          <div className="relative container mx-auto px-3 sm:px-4 md:px-6 text-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-60 animate-neon-pulse" />
                <img
                  src="/assets/uploads/IMG_20250821_154306_073-8-1.jpg"
                  alt="RBS Token Logo"
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover relative z-10 animate-float"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 shimmer-turquoise leading-tight"
            >
              Return Be Superior
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="text-base sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
            >
              Advanced blockchain solutions powered by the RBS token ecosystem.
              Superior trading intelligence, real-time market analytics, and
              community-driven governance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Button
                data-ocid="home.primary_button"
                onClick={() => navigate({ to: "/acquisition" })}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold text-lg px-8 py-6 magnetic-hover"
              >
                Get RBS Tokens <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                data-ocid="home.secondary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                size="lg"
                variant="outline"
                className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-6 magnetic-hover"
              >
                G-MAN Intel <Zap className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 2. Stats Ticker ─────────────────────────────────────────────── */}
        <SmokySectionTransition>
          <section className="py-8 sm:py-10 px-3 sm:px-4 md:px-6 border-y border-gray-100 bg-white">
            <div className="container mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="text-center p-3 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-300 group"
                  >
                    <stat.icon
                      className={`w-5 h-5 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`}
                    />
                    <div className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── NEW: Fear & Greed Index Widget ─────────────────────────────── */}
        <SmokySectionTransition delay={80}>
          <section className="py-10 sm:py-14 px-3 sm:px-4 md:px-6 bg-gray-50 border-b border-gray-100">
            <div className="container mx-auto max-w-4xl">
              <AnimatedSection
                direction="up"
                className="text-center mb-6 sm:mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium mb-3 sm:mb-4">
                  <Activity className="w-4 h-4" /> Market Sentiment
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Fear &amp; Greed Index
                </h2>
                <p className="text-gray-500 mt-2">
                  The market's emotional state — updated daily
                </p>
              </AnimatedSection>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                {fearGreed && fearGreedValue !== null ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`rounded-2xl border p-8 text-center min-w-[220px] ${getFearGreedBg(fearGreedValue)}`}
                  >
                    <div
                      className={`text-7xl font-bold font-jetbrains mb-2 ${getFearGreedColor(fearGreedValue)}`}
                    >
                      {fearGreedValue}
                    </div>
                    <div
                      className={`text-xl font-bold mb-1 ${getFearGreedColor(fearGreedValue)}`}
                    >
                      {fearGreed.value_classification}
                    </div>
                    <div className="text-gray-500 text-sm">Current Index</div>
                    <div className="mt-4 h-3 bg-white rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${fearGreedValue}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            fearGreedValue <= 25
                              ? "#dc2626"
                              : fearGreedValue <= 46
                                ? "#ea580c"
                                : fearGreedValue <= 54
                                  ? "#ca8a04"
                                  : fearGreedValue <= 75
                                    ? "#16a34a"
                                    : "#059669",
                        }}
                      />
                    </div>
                    <Button
                      data-ocid="home.fear-greed.button"
                      onClick={() => navigate({ to: "/fear-greed" })}
                      size="sm"
                      variant="outline"
                      className="mt-4 border-gray-300 text-gray-600 hover:bg-white text-xs"
                    >
                      Full History <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </motion.div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 p-8 text-center min-w-[220px] animate-pulse bg-white">
                    <div className="h-16 bg-gray-100 rounded mb-2" />
                    <div className="h-6 bg-gray-100 rounded w-24 mx-auto" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 flex-1">
                  {[
                    {
                      range: "0–25",
                      label: "Extreme Fear",
                      color: "text-red-600",
                      bg: "bg-red-50 border-red-200",
                      tip: "Potential buy opportunity",
                    },
                    {
                      range: "26–46",
                      label: "Fear",
                      color: "text-orange-600",
                      bg: "bg-orange-50 border-orange-200",
                      tip: "Market pessimism",
                    },
                    {
                      range: "47–54",
                      label: "Neutral",
                      color: "text-yellow-600",
                      bg: "bg-yellow-50 border-yellow-200",
                      tip: "Balanced sentiment",
                    },
                    {
                      range: "55–75",
                      label: "Greed",
                      color: "text-green-600",
                      bg: "bg-green-50 border-green-200",
                      tip: "Exercise caution",
                    },
                    {
                      range: "76–100",
                      label: "Extreme Greed",
                      color: "text-emerald-600",
                      bg: "bg-emerald-50 border-emerald-200",
                      tip: "Potential sell signal",
                    },
                  ].map((zone) => (
                    <div
                      key={zone.label}
                      className={`rounded-xl border p-3 ${zone.bg} ${fearGreed && fearGreed.value_classification === zone.label ? "ring-2 ring-offset-1 ring-emerald-400" : ""}`}
                    >
                      <div className={`text-xs font-bold ${zone.color}`}>
                        {zone.label}
                      </div>
                      <div className="text-xs text-gray-500">{zone.range}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {zone.tip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 3. Live Market Snapshot ─────────────────────────────────────── */}
        <SmokySectionTransition delay={80}>
          <section className="py-12 sm:py-20 px-3 sm:px-4 md:px-6 bg-white">
            <div className="container mx-auto">
              <AnimatedSection
                direction="up"
                className="text-center mb-8 sm:mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-4 sm:mb-6">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  LIVE MARKET DATA
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
                  Live Market Snapshot
                </h2>
                <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto">
                  Real-time crypto prices from CoinGecko — refreshes every 30
                  seconds
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  {lastUpdated && (
                    <p className="text-xs text-gray-400">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                  <Button
                    data-ocid="home.prices.refresh.button"
                    onClick={handlePricesRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isPricesRefreshing || pricesLoading}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-1 ${isPricesRefreshing ? "animate-spin" : ""}`}
                    />
                    {isPricesRefreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {CRYPTO_IDS.map((id, i) => {
                  const meta = CRYPTO_META[id];
                  const data = prices[id];
                  const change = data?.usd_24h_change ?? 0;
                  const isPositive = change >= 0;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className="relative p-5 rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-300 group overflow-hidden"
                    >
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-scan" />
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={meta.logo}
                          alt={meta.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <div>
                          <div className="text-gray-900 font-bold text-sm">
                            {meta.symbol}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {meta.name}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            LIVE
                          </span>
                        </div>
                      </div>

                      {pricesLoading || !data ? (
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-100 rounded animate-pulse" />
                          <div className="h-4 bg-gray-100 rounded w-16 animate-pulse" />
                        </div>
                      ) : (
                        <>
                          <div className="text-gray-900 font-bold text-lg font-jetbrains">
                            $
                            {data.usd.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                          <div
                            className={`text-sm font-medium mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                          >
                            {isPositive ? "▲" : "▼"}{" "}
                            {Math.abs(change).toFixed(2)}%
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center mt-8"
              >
                <Button
                  data-ocid="home.dashboard.button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Full Market Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── RBS Token Status Section ────────────────────────────────────── */}
        <SmokySectionTransition delay={60}>
          <section className="py-12 sm:py-20 px-3 sm:px-4 md:px-6 bg-white border-b border-gray-100">
            <div className="container mx-auto max-w-5xl">
              <AnimatedSection
                direction="up"
                className="text-center mb-8 sm:mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 text-sm font-medium mb-4">
                  <Coins className="w-4 h-4" /> RBS TOKEN
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
                  RBS Token — Pre-Launch Status
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  The RBS token has a fixed supply of 100,000 tokens and is
                  currently in pre-launch phase. Acquisition opens according to
                  the project roadmap.
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {[
                  {
                    label: "Total Supply",
                    value: "100,000",
                    unit: "RBS",
                    icon: Coins,
                    color: "text-cyan-600",
                    bg: "bg-cyan-50 border-cyan-200",
                  },
                  {
                    label: "Token Price",
                    value: "TBA",
                    unit: "at Launch",
                    icon: TrendingUp,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50 border-emerald-200",
                  },
                  {
                    label: "Launch Phase",
                    value: "Q1 2027",
                    unit: "Presale Opens",
                    icon: Calendar,
                    color: "text-violet-600",
                    bg: "bg-violet-50 border-violet-200",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`rounded-2xl border p-6 text-center ${item.bg}`}
                  >
                    <item.icon
                      className={`w-8 h-8 mx-auto mb-3 ${item.color}`}
                    />
                    <div
                      className={`text-3xl font-bold font-jetbrains ${item.color} mb-1`}
                    >
                      {item.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.unit}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Token Utility */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-600" /> Token Utility
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Access to exclusive Market Intelligence signals",
                    "Community governance and voting rights",
                    "Priority access to RBS platform features",
                    "Staking rewards and yield generation",
                    "Developer blog creation privileges",
                    "Early access to future RBS ecosystem tools",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Button
                  data-ocid="home.rbs.presale.button"
                  onClick={() => navigate({ to: "/acquisition" })}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
                >
                  Register for Presale <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  data-ocid="home.rbs.intel.button"
                  onClick={() => navigate({ to: "/market-intel" })}
                  variant="outline"
                  className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 px-8"
                >
                  View Market Intelligence
                </Button>
              </motion.div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── NEW: Quick Signals Strip ────────────────────────────────────── */}
        <SmokySectionTransition delay={80}>
          <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6 bg-gray-50 border-y border-gray-100">
            <div className="container mx-auto max-w-5xl">
              <AnimatedSection
                direction="up"
                className="text-center mb-6 sm:mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-3 sm:mb-4">
                  <Zap className="w-4 h-4" /> G-MAN Intelligence
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Live Trading Signals
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Powered by G-MAN Intelligence — real Binance kline data,
                  auto-refreshes every 30s
                </p>
                <div className="flex justify-center mt-3">
                  <Button
                    data-ocid="home.signals.refresh.button"
                    onClick={handleSignalsRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isSignalsRefreshing || signalsLoading}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-1 ${isSignalsRefreshing ? "animate-spin" : ""}`}
                    />
                    {isSignalsRefreshing ? "Refreshing..." : "Refresh Signals"}
                  </Button>
                </div>
              </AnimatedSection>

              {signalsLoading && quickSignals.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["s1", "s2", "s3"].map((k) => (
                    <div
                      key={k}
                      className="h-36 rounded-2xl bg-white border border-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              ) : quickSignals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickSignals.map((sig, i) => (
                    <motion.div
                      key={sig.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`rounded-2xl border p-5 bg-white ${sig.borderColor} hover:shadow-md transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-gray-900 font-bold">
                            {sig.asset}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {sig.symbol}/USDT
                          </div>
                        </div>
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: sig.color }}
                        >
                          {sig.signal}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Confidence</span>
                          <span className="font-bold text-gray-700">
                            {sig.confidence}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${sig.confidence}%`,
                              backgroundColor: sig.color,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">RSI (14)</span>
                          <span
                            className={`font-mono font-bold ${sig.rsi > 70 ? "text-red-600" : sig.rsi < 30 ? "text-green-600" : "text-gray-700"}`}
                          >
                            {sig.rsi.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : null}

              <div className="text-center mt-6">
                <Button
                  data-ocid="home.market-intel.button"
                  onClick={() => navigate({ to: "/market-intel" })}
                  className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold"
                >
                  View Full Market Intel <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── NEW: Top Movers Today ───────────────────────────────────── */}
        <TopMoversSection />

        {/* ── NEW: BTC Dominance ──────────────────────────────────────── */}
        <BTCDominanceSection />

        {/* ── NEW: How to Get RBS Steps ────────────────────────────────── */}
        <SmokySectionTransition delay={80}>
          <section className="py-12 sm:py-20 px-3 sm:px-4 md:px-6 bg-white border-b border-gray-100">
            <div className="container mx-auto max-w-5xl">
              <AnimatedSection
                direction="up"
                className="text-center mb-8 sm:mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-3 sm:mb-4">
                  <Coins className="w-4 h-4" /> Get Started
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
                  How to Get <span className="shimmer-turquoise">RBS</span>
                </h2>
                <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto">
                  Four simple steps to join the RBS ecosystem
                </p>
              </AnimatedSection>

              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 relative">
                <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200" />
                {[
                  {
                    step: 1,
                    title: "Create Account",
                    desc: "Sign in with Internet Identity — free, secure, and decentralized. No email required.",
                    icon: Users,
                  },
                  {
                    step: 2,
                    title: "Explore Platform",
                    desc: "Browse market tools, G-MAN trading signals, and community features.",
                    icon: Globe,
                  },
                  {
                    step: 3,
                    title: "Join Presale",
                    desc: "Register for the Q1 2027 presale allocation and get early access to RBS tokens.",
                    icon: Calendar,
                  },
                  {
                    step: 4,
                    title: "Claim Airdrop",
                    desc: "Eligible wallets receive free RBS in the Q1 2029 airdrop distribution.",
                    icon: Zap,
                  },
                ].map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="flex-1 flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group relative"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform z-10 relative">
                      {step.step}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 text-emerald-600">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-base mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button
                  data-ocid="home.get-rbs.primary_button"
                  onClick={() => navigate({ to: "/acquisition" })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8"
                >
                  Get RBS Tokens <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── NEW: Community Stats Section ─────────────────────────────── */}
        <SmokySectionTransition delay={80}>
          <section className="py-12 sm:py-20 px-3 sm:px-4 md:px-6 bg-gray-50 border-b border-gray-100">
            <div className="container mx-auto max-w-5xl">
              <AnimatedSection
                direction="up"
                className="text-center mb-8 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Growing <span className="shimmer-turquoise">Community</span>
                </h2>
                <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto">
                  The numbers behind the RBS ecosystem
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                {[
                  {
                    value: "1",
                    label: "Blockchain",
                    sublabel: "Built on Internet Computer",
                    icon: Shield,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                  },
                  {
                    value: "100K",
                    label: "RBS Tokens",
                    sublabel: "Total fixed supply",
                    icon: Coins,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                  },
                  {
                    value: "Q1 2027",
                    label: "Presale Launch",
                    sublabel: "Early allocation opens",
                    icon: Calendar,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                    border: "border-purple-200",
                  },
                  {
                    value: "Global",
                    label: "Community",
                    sublabel: "Members worldwide",
                    icon: Globe,
                    color: "text-orange-600",
                    bg: "bg-orange-50",
                    border: "border-orange-200",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`text-center p-6 rounded-2xl bg-white border ${stat.border} hover:shadow-md transition-all duration-300 group`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div
                      className={`text-3xl font-bold ${stat.color} font-jetbrains mb-1`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-gray-900 font-semibold text-sm">
                      {stat.label}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {stat.sublabel}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 4. Features Grid ────────────────────────────────────────────── */}
        <SmokySectionTransition delay={100}>
          <section className="py-12 sm:py-20 px-3 sm:px-4 md:px-6 bg-white">
            <div className="container mx-auto">
              <AnimatedSection
                direction="up"
                className="text-center mb-10 sm:mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-4 sm:mb-6">
                  <Zap className="w-4 h-4" /> Platform Features
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
                  Everything You Need
                </h2>
                <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto">
                  Comprehensive tools and services for the modern blockchain
                  ecosystem
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className={`relative p-6 rounded-2xl border bg-white ${feature.cardBorder} shadow-sm hover:shadow-md cursor-default group overflow-hidden transition-all duration-300`}
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-scan" />
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 5. Why RBS? ─────────────────────────────────────────────────── */}
        <SmokySectionTransition delay={120}>
          <section className="py-12 sm:py-20 px-3 sm:px-4 md:px-6 bg-gray-50">
            <div className="container mx-auto max-w-5xl">
              <AnimatedSection
                direction="up"
                className="text-center mb-10 sm:mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-4 sm:mb-6">
                  <CheckCircle className="w-4 h-4" /> Why Choose RBS
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
                  Why <span className="shimmer-turquoise">RBS?</span>
                </h2>
                <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto">
                  What makes Return Be Superior different from every other token
                </p>
              </AnimatedSection>

              <div className="space-y-6">
                {WHY_RBS.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: item.side === "left" ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.12,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className={`flex ${item.side === "right" ? "flex-row-reverse" : "flex-row"} items-center gap-6`}
                  >
                    <div
                      className={`flex-1 p-6 rounded-2xl bg-white border-l-4 ${item.accentColor} border border-gray-200 hover:shadow-md transition-all duration-300 group`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-xl">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="hidden md:flex w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center text-emerald-600 flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 6. Token Distribution ───────────────────────────────────────── */}
        <SmokySectionTransition delay={150}>
          <section className="py-20 px-4 bg-white border-y border-gray-100">
            <div className="container mx-auto max-w-4xl">
              <AnimatedSection direction="up" className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Token Distribution
                </h2>
                <p className="text-gray-500">
                  100,000 RBS Fixed Supply — Fair &amp; Transparent
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Liquidity", pct: 40, color: "#3B82F6" },
                  { label: "Presale", pct: 20, color: "#10B981" },
                  { label: "Burn", pct: 15, color: "#EF4444" },
                  { label: "Team", pct: 10, color: "#8B5CF6" },
                  { label: "Community", pct: 8, color: "#0ea5e9" },
                  { label: "Airdrop", pct: 7, color: "#EC4899" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="p-5 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm font-medium">
                        {item.label}
                      </span>
                      <span
                        className="font-bold text-lg"
                        style={{ color: item.color }}
                      >
                        {item.pct}%
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2 bg-gray-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1 + 0.3,
                          ease: "easeOut",
                        }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {(item.pct * 1000).toLocaleString()} RBS
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 7. RBS Utility ──────────────────────────────────────────────── */}
        <SmokySectionTransition delay={100}>
          <section className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto max-w-5xl">
              <AnimatedSection direction="up" className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
                  <Coins className="w-4 h-4" /> Token Utility
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  What RBS <span className="shimmer-turquoise">Powers</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                  RBS is the fuel for every interaction in the ecosystem
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {UTILITY_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.08,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-gray-900 font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── NEW: Trading Tools Hub ───────────────────────────────────────── */}
        <SmokySectionTransition delay={100}>
          <section className="py-20 px-4 bg-white border-y border-gray-100">
            <div className="container mx-auto max-w-6xl">
              <AnimatedSection direction="up" className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
                  <BarChart2 className="w-4 h-4" /> Professional Tools
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Your Trading Arsenal
                </h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                  Professional-grade tools to help you trade smarter and stay
                  ahead of the market
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TRADING_TOOLS.map((tool, i) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`p-6 rounded-2xl border bg-white ${tool.border} shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer`}
                    onClick={() => navigate({ to: tool.path as "/" })}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 ${tool.color} group-hover:scale-110 transition-transform`}
                    >
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {tool.desc}
                    </p>
                    <button
                      type="button"
                      className={`text-sm font-medium flex items-center gap-1 ${tool.color} group-hover:gap-2 transition-all`}
                    >
                      Open Tool <ArrowRight className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button
                  data-ocid="home.trading-tools.button"
                  onClick={() => navigate({ to: "/trading-tools" })}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  View All Trading Tools <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 8. Community Stats ──────────────────────────────────────────── */}
        <SmokySectionTransition delay={100}>
          <section className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
              <AnimatedSection direction="up" className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Community <span className="shimmer-turquoise">Impact</span>
                </h2>
                <p className="text-xl text-gray-500">
                  Numbers that show what we've built together
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    target: 10000,
                    suffix: "+",
                    label: "Community Members",
                    icon: Users,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    target: 50000,
                    suffix: "+",
                    label: "Signals Generated",
                    icon: Zap,
                    color: "text-sky-600",
                    bg: "bg-sky-50",
                  },
                  {
                    target: 999,
                    suffix: "/1000",
                    label: "Uptime Score",
                    icon: CheckCircle,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}
                    >
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div
                      className={`text-5xl font-bold mb-2 ${stat.color} font-jetbrains`}
                    >
                      <AnimatedCounter
                        target={stat.target}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 9. Roadmap Timeline ─────────────────────────────────────────── */}
        <SmokySectionTransition delay={200}>
          <section className="py-20 px-4 bg-white">
            <div className="container mx-auto max-w-4xl">
              <AnimatedSection direction="up" className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Roadmap
                </h2>
                <p className="text-gray-500">
                  Our journey to full mainnet launch
                </p>
              </AnimatedSection>

              <div className="relative">
                <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-400 via-emerald-200 to-transparent" />

                {[
                  {
                    year: "2026",
                    title: "Community Gain",
                    desc: "Building global community, raising awareness, and establishing ecosystem foundations.",
                    side: "left",
                    color: "text-emerald-600",
                    done: true,
                  },
                  {
                    year: "2027",
                    title: "Presale Launch",
                    desc: "Presale opens Q1 2027. Early adopters can acquire RBS tokens via WhatsApp portal.",
                    side: "right",
                    color: "text-green-600",
                    done: false,
                  },
                  {
                    year: "2028",
                    title: "Big Year & Collaborations",
                    desc: "Major exchange listings, strategic partnerships, and ecosystem integrations.",
                    side: "left",
                    color: "text-blue-600",
                    done: false,
                  },
                  {
                    year: "2029",
                    title: "Airdrop Distribution",
                    desc: "Airdrop registration opens Q1 2029. Free RBS distribution to eligible wallets.",
                    side: "right",
                    color: "text-purple-600",
                    done: false,
                  },
                  {
                    year: "2030",
                    title: "Full Mainnet Launch",
                    desc: "Complete mainnet deployment with full capabilities and global adoption.",
                    side: "left",
                    color: "text-pink-600",
                    done: false,
                  },
                ].map((milestone, i) => (
                  <motion.div
                    key={milestone.year}
                    initial={{
                      opacity: 0,
                      x: milestone.side === "left" ? -40 : 40,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.15,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className={`relative mb-12 flex ${milestone.side === "left" ? "flex-row" : "flex-row-reverse"} items-center gap-6 md:gap-12`}
                  >
                    <div
                      className={`flex-1 ${milestone.side === "left" ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block p-5 rounded-2xl bg-white border ${milestone.done ? "border-emerald-300 shadow-sm" : "border-gray-200"} hover:shadow-md transition-all duration-300`}
                      >
                        <div
                          className={`text-2xl font-bold mb-1 ${milestone.color}`}
                        >
                          {milestone.year}
                        </div>
                        <div className="text-gray-900 font-bold mb-2">
                          {milestone.title}
                        </div>
                        <div className="text-gray-500 text-sm leading-relaxed">
                          {milestone.desc}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${milestone.done ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-200" : "bg-white border-gray-300"} z-10`}
                    />
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 10. Trusted & Secure ────────────────────────────────────────── */}
        <SmokySectionTransition delay={120}>
          <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
            <div className="container mx-auto max-w-5xl">
              <AnimatedSection direction="up" className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" /> Security First
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Trusted &amp;{" "}
                  <span className="shimmer-turquoise">Secure</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                  Built on enterprise-grade infrastructure for maximum
                  reliability
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {SECURITY_BADGES.map((badge, i) => (
                  <motion.div
                    key={badge.title}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 text-center group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${badge.iconBg} flex items-center justify-center mx-auto mb-4 ${badge.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <badge.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-gray-900 font-bold mb-2">
                      {badge.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{badge.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 11. Developer Blog Preview ──────────────────────────────────── */}
        <SmokySectionTransition delay={100}>
          <section className="py-20 px-4 bg-white">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="relative p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 to-transparent pointer-events-none rounded-3xl" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-3">
                      Developer Updates
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Stay Up to Date
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-4">
                      Read in-depth technical updates, development progress, and
                      ecosystem insights from the RBS core team. Published using
                      the G-MAN passcode.
                    </p>
                    <Button
                      data-ocid="home.blog.button"
                      onClick={() => navigate({ to: "/blog" })}
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      Read Developer Blogs{" "}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── 12. Join Community CTA ──────────────────────────────────────── */}
        <SmokySectionTransition delay={100}>
          <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto text-center max-w-3xl">
              <AnimatedSection direction="up">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Join the{" "}
                  <span className="shimmer-turquoise">RBS Community</span>
                </h2>
                <p className="text-xl text-gray-500 mb-10">
                  Connect with us on Telegram, WhatsApp, and stay updated on the
                  latest developments
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <a
                    href="https://t.me/RBSuperior"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="home.telegram.link"
                    className="flex items-center gap-3 px-8 py-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-bold hover:bg-blue-100 hover:border-blue-300 transition-all duration-300"
                  >
                    <Send className="w-5 h-5" /> Join Telegram
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="home.whatsapp.link"
                    className="flex items-center gap-3 px-8 py-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold hover:bg-green-100 hover:border-green-300 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp Channel
                  </a>
                  <Button
                    data-ocid="home.cta.primary_button"
                    onClick={() => navigate({ to: "/acquisition" })}
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold px-8"
                  >
                    Join Presale <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </SmokySectionTransition>
      </div>
    </>
  );
}
