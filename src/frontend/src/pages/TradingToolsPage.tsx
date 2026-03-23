import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Bell,
  BookOpen,
  Calculator,
  Coins,
  Globe,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface ToolCard {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  path: string;
  iconBg: string;
  iconColor: string;
  border: string;
  badge?: string;
}

const TOOLS: ToolCard[] = [
  {
    icon: Zap,
    title: "G-MAN Intel",
    description:
      "AI-powered trading signal engine using real Binance kline data. Calculates RSI, MACD, EMA, Bollinger Bands and more.",
    features: [
      "Real-time signals",
      "7 assets covered",
      "RSI + MACD + EMA",
      "Passcode secured",
    ],
    path: "/market-intel",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-200 hover:border-emerald-400",
    badge: "Pro",
  },
  {
    icon: Coins,
    title: "Staking Calculator",
    description:
      "Calculate your RBS staking rewards with compound interest, tier-based APY, and detailed milestone projections.",
    features: [
      "4 staking tiers",
      "Compound interest",
      "8% – 20% APY",
      "Projection table",
    ],
    path: "/staking",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-200 hover:border-emerald-400",
  },

  {
    icon: Activity,
    title: "Funding Rates",
    description:
      "Live Binance futures funding rates across 10 major pairs. Know who pays and who earns.",
    features: [
      "10 major pairs",
      "Annualized rate",
      "Direction signal",
      "Auto-refresh 60s",
    ],
    path: "/funding-rates",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-violet-200 hover:border-violet-400",
    badge: "New",
  },
];

const QUICK_STATS = [
  {
    label: "Live Tools",
    value: "12+",
    icon: Activity,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "API Sources",
    value: "3",
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Signal Types",
    value: "5",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Security Level",
    value: "Max",
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

// ─── Crypto Converter Tool ────────────────────────────────────────────────────
function CryptoConverterTool() {
  const COINS = [
    { id: "bitcoin", label: "BTC" },
    { id: "ethereum", label: "ETH" },
    { id: "binancecoin", label: "BNB" },
    { id: "solana", label: "SOL" },
    { id: "ripple", label: "XRP" },
    { id: "cardano", label: "ADA" },
    { id: "tether", label: "USDT" },
  ];

  const [amount, setAmount] = useState("1");
  const [fromCoin, setFromCoin] = useState("bitcoin");
  const [toCoin, setToCoin] = useState("tether");
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      const ids = COINS.filter((c) => c.id !== "tether")
        .map((c) => c.id)
        .join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const map: Record<string, number> = { tether: 1 };
      for (const c of COINS) {
        if (c.id !== "tether") map[c.id] = data[c.id]?.usd ?? 0;
      }
      setPrices(map);
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPrices();
    setIsRefreshing(false);
  };

  const handleSwap = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
  };

  const amt = Number.parseFloat(amount) || 0;
  const fromPrice = prices[fromCoin] ?? 0;
  const toPrice = prices[toCoin] ?? 0;
  const usdValue = amt * fromPrice;
  const convertedValue = toPrice > 0 ? usdValue / toPrice : 0;

  const fromLabel =
    COINS.find((c) => c.id === fromCoin)?.label ?? fromCoin.toUpperCase();
  const toLabel =
    COINS.find((c) => c.id === toCoin)?.label ?? toCoin.toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Coins className="w-4 h-4 text-emerald-600" /> Crypto Converter
        </h3>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            data-ocid="converter.refresh.button"
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing || isLoading}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Amount + From */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Amount</Label>
          <Input
            data-ocid="converter.amount.input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
            min="0"
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">From</Label>
          <Select value={fromCoin} onValueChange={setFromCoin}>
            <SelectTrigger
              data-ocid="converter.from.select"
              className="border-gray-200"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COINS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Swap button */}
      <div className="flex justify-center">
        <button
          type="button"
          data-ocid="converter.swap.button"
          onClick={handleSwap}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-sky-50 hover:border-sky-300 text-gray-600 hover:text-sky-600 transition-all text-sm font-medium shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Swap {fromLabel} ↕ {toLabel}
        </button>
      </div>

      {/* To currency */}
      <div className="space-y-2">
        <Label className="text-gray-600 text-sm">To</Label>
        <Select value={toCoin} onValueChange={setToCoin}>
          <SelectTrigger
            data-ocid="converter.to.select"
            className="border-gray-200"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COINS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Result */}
      {isLoading ? (
        <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
      ) : amt > 0 && fromPrice > 0 ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-5">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
              Converted Amount
            </div>
            <div className="text-3xl font-bold text-sky-700 font-mono">
              {convertedValue < 0.000001
                ? convertedValue.toExponential(4)
                : convertedValue.toLocaleString(undefined, {
                    maximumFractionDigits: convertedValue < 1 ? 6 : 4,
                  })}
              <span className="text-lg ml-1 text-sky-500">{toLabel}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {amt} {fromLabel} = $
              {usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              USD
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">
                {fromLabel} price
              </div>
              <div className="font-bold text-gray-800 font-mono text-sm">
                $
                {fromPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">{toLabel} price</div>
              <div className="font-bold text-gray-800 font-mono text-sm">
                $
                {toPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Market Sentiment (Fear & Greed) Tool ─────────────────────────────────────
interface FngEntry {
  value: string;
  value_classification: string;
  timestamp: string;
}

function MarketSentimentTool() {
  const [data, setData] = useState<FngEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://api.alternative.me/fng/?limit=7");
      const json = await res.json();
      if (json.data) setData(json.data);
      setLastUpdated(new Date());
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const current = data[0];
  const val = current ? Number.parseInt(current.value) : 0;

  const getColor = (v: number) => {
    if (v <= 25)
      return {
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        ring: "#ef4444",
      };
    if (v <= 45)
      return {
        text: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        ring: "#f97316",
      };
    if (v <= 55)
      return {
        text: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        ring: "#ca8a04",
      };
    if (v <= 75)
      return {
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        ring: "#10b981",
      };
    return {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      ring: "#16a34a",
    };
  };

  const colors = getColor(val);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600" /> Fear & Greed Index
        </h3>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            data-ocid="sentiment.refresh.button"
            onClick={fetchData}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="border-sky-300 text-sky-700 hover:bg-sky-50"
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading && !current ? (
        <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
      ) : current ? (
        <>
          {/* Gauge */}
          <div
            className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 flex flex-col items-center gap-3`}
          >
            <div className="relative w-40 h-20 overflow-hidden">
              <svg
                viewBox="0 0 200 100"
                className="w-full h-full"
                aria-label="Fear and Greed gauge"
              >
                <title>Fear and Greed Index Gauge</title>
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100"
                  fill="none"
                  stroke={colors.ring}
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={`${(val / 100) * 283} 283`}
                />
                <text
                  x="100"
                  y="95"
                  textAnchor="middle"
                  fontSize="28"
                  fontWeight="bold"
                  fill={colors.ring}
                >
                  {val}
                </text>
              </svg>
            </div>
            <div className={`text-xl font-bold ${colors.text}`}>
              {current.value_classification}
            </div>
            <div className="text-xs text-gray-400">
              Current Market Sentiment
            </div>
          </div>

          {/* 7-day history */}
          {data.length > 1 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Last 7 Days
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {data.slice(0, 7).map((entry) => {
                  const v = Number.parseInt(entry.value);
                  const c = getColor(v);
                  const date = new Date(
                    Number.parseInt(entry.timestamp) * 1000,
                  );
                  return (
                    <div
                      key={entry.timestamp}
                      className={`rounded-xl border ${c.border} ${c.bg} p-2 text-center`}
                    >
                      <div className={`text-lg font-bold ${c.text}`}>{v}</div>
                      <div className="text-[10px] text-gray-400 truncate">
                        {entry.value_classification.split(" ").slice(-1)[0]}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-400 py-8">No data available</div>
      )}
    </div>
  );
}

// ─── Position Size Tool ───────────────────────────────────────────────────────
function PositionSizeTool() {
  const [accountSize, setAccountSize] = useState("10000");
  const [riskPct, setRiskPct] = useState("2");
  const [entryPrice, setEntryPrice] = useState("100");
  const [stopLoss, setStopLoss] = useState("95");
  const [takeProfit, setTakeProfit] = useState("110");

  const account = Number.parseFloat(accountSize) || 0;
  const risk = Number.parseFloat(riskPct) || 0;
  const entry = Number.parseFloat(entryPrice) || 0;
  const stop = Number.parseFloat(stopLoss) || 0;
  const tp = Number.parseFloat(takeProfit) || entry;

  const dollarRisk = (account * risk) / 100;
  const priceRange = Math.abs(entry - stop);
  const positionSize = priceRange > 0 ? dollarRisk / priceRange : 0;
  const lotSize = positionSize * entry;
  const rrRatio = priceRange > 0 ? Math.abs(tp - entry) / priceRange : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-600" /> Position Size Calculator
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Account Size ($)</Label>
          <Input
            data-ocid="position.account.input"
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Risk % per Trade</Label>
          <Input
            data-ocid="position.risk.input"
            type="number"
            value={riskPct}
            onChange={(e) => setRiskPct(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Entry Price</Label>
          <Input
            data-ocid="position.entry.input"
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Stop Loss Price</Label>
          <Input
            data-ocid="position.stoploss.input"
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Take Profit Price</Label>
          <Input
            data-ocid="position.tp.input"
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      {positionSize > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Position Size (units)",
              value: positionSize.toFixed(4),
              color: "text-blue-700",
              bg: "bg-blue-50 border-blue-200",
            },
            {
              label: "Dollar Risk",
              value: `$${dollarRisk.toFixed(2)}`,
              color: "text-red-600",
              bg: "bg-red-50 border-red-200",
            },
            {
              label: "Lot Size ($)",
              value: `$${lotSize.toFixed(2)}`,
              color: "text-emerald-700",
              bg: "bg-emerald-50 border-emerald-200",
            },
            {
              label: "Risk:Reward",
              value: `1:${rrRatio.toFixed(2)}`,
              color: "text-purple-700",
              bg: "bg-purple-50 border-purple-200",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl p-4 border ${item.bg}`}
            >
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className={`text-lg font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Fibonacci Retracement Tool ───────────────────────────────────────────────
function FibonacciTool() {
  const [swingHigh, setSwingHigh] = useState("50000");
  const [swingLow, setSwingLow] = useState("40000");
  const [trend, setTrend] = useState<"up" | "down">("up");

  const high = Number.parseFloat(swingHigh) || 0;
  const low = Number.parseFloat(swingLow) || 0;
  const range = high - low;

  const FIB_RATIOS = [
    { label: "0%", ratio: 0 },
    { label: "23.6%", ratio: 0.236 },
    { label: "38.2%", ratio: 0.382 },
    { label: "50%", ratio: 0.5 },
    { label: "61.8%", ratio: 0.618 },
    { label: "78.6%", ratio: 0.786 },
    { label: "100%", ratio: 1 },
  ];

  const levels = FIB_RATIOS.map(({ label, ratio }) => ({
    label,
    price: trend === "up" ? high - range * ratio : low + range * ratio,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-purple-600" /> Fibonacci Retracement
        Calculator
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Swing High</Label>
          <Input
            data-ocid="fib.high.input"
            type="number"
            value={swingHigh}
            onChange={(e) => setSwingHigh(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Swing Low</Label>
          <Input
            data-ocid="fib.low.input"
            type="number"
            value={swingLow}
            onChange={(e) => setSwingLow(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Trend</Label>
          <Select
            value={trend}
            onValueChange={(v) => setTrend(v as "up" | "down")}
          >
            <SelectTrigger
              data-ocid="fib.trend.select"
              className="border-gray-200"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="up">Uptrend</SelectItem>
              <SelectItem value="down">Downtrend</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {range > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-200">
                <th className="text-left py-2 px-3">Level</th>
                <th className="text-right py-2 px-3">Price</th>
                <th className="text-right py-2 px-3">Distance</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((lvl) => (
                <tr
                  key={lvl.label}
                  className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                >
                  <td className="py-2 px-3 font-semibold text-purple-700">
                    {lvl.label}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-gray-900">
                    $
                    {lvl.price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-400 text-xs">
                    {((Math.abs(high - lvl.price) / range) * 100).toFixed(1)}%
                    from high
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── DCA / Compound Tool ──────────────────────────────────────────────────────
function DCATool() {
  const [initialInvest, setInitialInvest] = useState("1000");
  const [monthlyContrib, setMonthlyContrib] = useState("100");
  const [apy, setApy] = useState("12");
  const [months, setMonths] = useState("12");

  const initial = Number.parseFloat(initialInvest) || 0;
  const monthly = Number.parseFloat(monthlyContrib) || 0;
  const rate = (Number.parseFloat(apy) || 0) / 100 / 12;
  const n = Math.min(Number.parseInt(months) || 12, 120);

  let balance = initial;
  const breakdown: { month: number; balance: number; invested: number }[] = [];
  let totalInvested = initial;

  for (let m = 1; m <= n; m++) {
    balance = balance * (1 + rate) + monthly;
    totalInvested += monthly;
    if (m % Math.ceil(n / 12) === 0 || m === n) {
      breakdown.push({
        month: m,
        balance: Math.round(balance),
        invested: Math.round(totalInvested),
      });
    }
  }

  const totalProfit = balance - totalInvested;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-emerald-600" /> DCA / Compound
        Calculator
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">
            Initial Investment ($)
          </Label>
          <Input
            data-ocid="dca.initial.input"
            type="number"
            value={initialInvest}
            onChange={(e) => setInitialInvest(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Monthly ($)</Label>
          <Input
            data-ocid="dca.monthly.input"
            type="number"
            value={monthlyContrib}
            onChange={(e) => setMonthlyContrib(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">APY (%)</Label>
          <Input
            data-ocid="dca.apy.input"
            type="number"
            value={apy}
            onChange={(e) => setApy(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Months</Label>
          <Input
            data-ocid="dca.months.input"
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Final Value</div>
          <div className="text-2xl font-bold text-emerald-700">
            ${Math.round(balance).toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Total Invested</div>
          <div className="text-2xl font-bold text-blue-700">
            ${Math.round(totalInvested).toLocaleString()}
          </div>
        </div>
        <div
          className={`rounded-xl border p-4 text-center ${totalProfit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="text-xs text-gray-500 mb-1">Total Profit</div>
          <div
            className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {totalProfit >= 0 ? "+" : ""}$
            {Math.round(totalProfit).toLocaleString()}
          </div>
        </div>
      </div>
      {breakdown.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200">
                <th className="text-left py-1 px-2">Month</th>
                <th className="text-right py-1 px-2">Balance</th>
                <th className="text-right py-1 px-2">Invested</th>
                <th className="text-right py-1 px-2">Profit</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.month} className="border-b border-gray-100">
                  <td className="py-1 px-2 text-gray-500">{row.month}</td>
                  <td className="py-1 px-2 text-right font-semibold text-emerald-700">
                    ${row.balance.toLocaleString()}
                  </td>
                  <td className="py-1 px-2 text-right text-gray-500">
                    ${row.invested.toLocaleString()}
                  </td>
                  <td
                    className={`py-1 px-2 text-right ${row.balance - row.invested >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {row.balance - row.invested >= 0 ? "+" : ""}$
                    {(row.balance - row.invested).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Volatility helper types & utilities (outside component) ─────────────────
interface VolData {
  symbol: string;
  atr: number;
  level: string;
  color: string;
  bg: string;
}

function computeATR(
  klines: [string, string, string, string, string, string][],
  period = 14,
): number {
  const trs: number[] = [];
  for (let i = 1; i < klines.length; i++) {
    const high = Number.parseFloat(klines[i][2]);
    const low = Number.parseFloat(klines[i][3]);
    const prevClose = Number.parseFloat(klines[i - 1][4]);
    trs.push(
      Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose),
      ),
    );
  }
  return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function getVolLevel(atrPct: number): Pick<VolData, "level" | "color" | "bg"> {
  if (atrPct < 1)
    return {
      level: "Low",
      color: "text-green-700",
      bg: "bg-green-50 border-green-200",
    };
  if (atrPct < 3)
    return {
      level: "Medium",
      color: "text-yellow-700",
      bg: "bg-yellow-50 border-yellow-200",
    };
  if (atrPct < 6)
    return {
      level: "High",
      color: "text-orange-700",
      bg: "bg-orange-50 border-orange-200",
    };
  return {
    level: "Extreme",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  };
}

// ─── Volatility Meter Tool ────────────────────────────────────────────────────
function VolatilityTool() {
  const [volData, setVolData] = useState<VolData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchVolatility = useCallback(async () => {
    setIsLoading(true);
    try {
      const pairs = [
        { symbol: "BTCUSDT", label: "BTC" },
        { symbol: "ETHUSDT", label: "ETH" },
        { symbol: "BNBUSDT", label: "BNB" },
      ];
      const results = await Promise.all(
        pairs.map(async (p) => {
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${p.symbol}&interval=1h&limit=30`,
          );
          if (!res.ok) throw new Error("Binance error");
          const data: [string, string, string, string, string, string][] =
            await res.json();
          const atr = computeATR(data);
          const currentPrice = Number.parseFloat(data[data.length - 1][4]);
          const atrPct = currentPrice > 0 ? (atr / currentPrice) * 100 : 0;
          const level = getVolLevel(atrPct);
          return { symbol: p.label, atr: atrPct, ...level };
        }),
      );
      setVolData(results);
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolatility();
    const interval = setInterval(fetchVolatility, 60000);
    return () => clearInterval(interval);
  }, [fetchVolatility]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchVolatility();
    setIsRefreshing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-600" /> Live Volatility Meter
          (ATR)
        </h3>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            data-ocid="volatility.refresh.button"
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing || isLoading}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
      <p className="text-gray-500 text-sm">
        ATR-based volatility from 1h Binance klines (last 30 candles)
      </p>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="h-24 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {volData.map((v) => (
            <div
              key={v.symbol}
              className={`rounded-xl border p-5 text-center ${v.bg}`}
            >
              <div className="font-bold text-lg text-gray-900">{v.symbol}</div>
              <div className={`text-3xl font-bold mt-2 ${v.color}`}>
                {v.level}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                ATR: {v.atr.toFixed(3)}% / hr
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── P&L / Pip Calculator ─────────────────────────────────────────────────────
function PipCalculatorTool() {
  const [assetType, setAssetType] = useState<"crypto" | "forex">("crypto");
  const [lotSize, setLotSize] = useState("1");
  const [priceMove, setPriceMove] = useState("5");
  const [direction, setDirection] = useState<"long" | "short">("long");

  const lot = Number.parseFloat(lotSize) || 0;
  const move = Number.parseFloat(priceMove) || 0;

  let pnl = 0;
  if (assetType === "crypto") {
    pnl = direction === "long" ? lot * (move / 100) : -(lot * (move / 100));
  } else {
    // Forex: pip value ~ $10 per standard lot, move in pips
    pnl =
      direction === "long"
        ? (lot / 100000) * 10 * move
        : -((lot / 100000) * 10 * move);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-blue-600" /> P&L Calculator
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Asset Type</Label>
          <Select
            value={assetType}
            onValueChange={(v) => setAssetType(v as "crypto" | "forex")}
          >
            <SelectTrigger
              data-ocid="pip.type.select"
              className="border-gray-200"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="forex">Forex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">
            {assetType === "crypto" ? "Position Size ($)" : "Lot Size (units)"}
          </Label>
          <Input
            data-ocid="pip.lot.input"
            type="number"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">
            {assetType === "crypto" ? "Price Move (%)" : "Move (pips)"}
          </Label>
          <Input
            data-ocid="pip.move.input"
            type="number"
            value={priceMove}
            onChange={(e) => setPriceMove(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Direction</Label>
          <Select
            value={direction}
            onValueChange={(v) => setDirection(v as "long" | "short")}
          >
            <SelectTrigger
              data-ocid="pip.direction.select"
              className="border-gray-200"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long (Buy)</SelectItem>
              <SelectItem value="short">Short (Sell)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {lot > 0 && move > 0 && (
        <div
          className={`rounded-xl border p-6 text-center ${pnl >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="text-sm text-gray-500 mb-2">Estimated P&L</div>
          <div
            className={`text-4xl font-bold ${pnl >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {pnl >= 0 ? "+" : ""}$
            {Math.abs(pnl).toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {direction === "long" ? "Long position" : "Short position"} —{" "}
            {assetType}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Leverage Risk Calculator ─────────────────────────────────────────────────
function LeverageCalculatorTool() {
  const [accountSize, setAccountSize] = useState("10000");
  const [leverage, setLeverage] = useState("10");
  const [entryPrice, setEntryPrice] = useState("50000");
  const [liquidationPrice, setLiquidationPrice] = useState("45000");

  const account = Number.parseFloat(accountSize) || 0;
  const lev = Number.parseFloat(leverage) || 1;
  const entry = Number.parseFloat(entryPrice) || 0;
  const liq = Number.parseFloat(liquidationPrice) || 0;

  const marginUsed = account / lev;
  const liqDistance = entry > 0 ? (Math.abs(entry - liq) / entry) * 100 : 0;
  const effectiveRisk = account > 0 ? (marginUsed / account) * 100 : 0;

  let riskLevel = "Safe";
  let riskColor = "text-green-700";
  let riskBg = "bg-green-50 border-green-200";
  if (lev > 20 || liqDistance < 3) {
    riskLevel = "Extreme Risk";
    riskColor = "text-red-700";
    riskBg = "bg-red-50 border-red-200";
  } else if (lev > 10 || liqDistance < 8) {
    riskLevel = "Risky";
    riskColor = "text-orange-700";
    riskBg = "bg-orange-50 border-orange-200";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-600" /> Leverage Risk
        Calculator
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Account Size ($)</Label>
          <Input
            data-ocid="leverage.account.input"
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Leverage (x)</Label>
          <Input
            data-ocid="leverage.leverage.input"
            type="number"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Entry Price</Label>
          <Input
            data-ocid="leverage.entry.input"
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Liquidation Price</Label>
          <Input
            data-ocid="leverage.liq.input"
            type="number"
            value={liquidationPrice}
            onChange={(e) => setLiquidationPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      {marginUsed > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Margin Used",
                value: `$${marginUsed.toFixed(2)}`,
                color: "text-blue-700",
                bg: "bg-blue-50 border-blue-200",
              },
              {
                label: "Effective Risk %",
                value: `${effectiveRisk.toFixed(1)}%`,
                color: "text-orange-700",
                bg: "bg-orange-50 border-orange-200",
              },
              {
                label: "Liq. Distance",
                value: `${liqDistance.toFixed(2)}%`,
                color: "text-purple-700",
                bg: "bg-purple-50 border-purple-200",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border p-4 ${item.bg}`}
              >
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className={`text-lg font-bold ${item.color}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div className={`rounded-xl border p-4 text-center ${riskBg}`}>
            <div className="text-xs text-gray-500 mb-1">Risk Assessment</div>
            <div className={`text-2xl font-bold ${riskColor}`}>{riskLevel}</div>
            <div className="text-xs text-gray-400 mt-1">
              {riskLevel === "Safe"
                ? "Trade looks reasonable"
                : riskLevel === "Risky"
                  ? "Consider reducing leverage or widening stop"
                  : "High probability of liquidation — reduce position size"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Breakeven Calculator ─────────────────────────────────────────────────────
function BreakevenCalculatorTool() {
  const [buyPrice, setBuyPrice] = useState("100");
  const [buyFee, setBuyFee] = useState("0.1");
  const [sellFee, setSellFee] = useState("0.1");
  const [targetProfit, setTargetProfit] = useState("5");
  const [tradeSize, setTradeSize] = useState("1000");

  const buy = Number.parseFloat(buyPrice) || 0;
  const bFee = Number.parseFloat(buyFee) / 100 || 0;
  const sFee = Number.parseFloat(sellFee) / 100 || 0;
  const target = Number.parseFloat(targetProfit) / 100 || 0;
  const size = Number.parseFloat(tradeSize) || 0;

  const breakevenPrice = buy > 0 ? (buy * (1 + bFee)) / (1 - sFee) : 0;
  const targetSellPrice =
    buy > 0 ? (buy * (1 + target + bFee)) / (1 - sFee) : 0;
  const totalFeesCost = size > 0 ? size * bFee + size * (1 + target) * sFee : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-emerald-600" /> Breakeven Calculator
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Buy Price</Label>
          <Input
            data-ocid="breakeven.buy.input"
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Buy Fee %</Label>
          <Input
            data-ocid="breakeven.buyfee.input"
            type="number"
            value={buyFee}
            onChange={(e) => setBuyFee(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Sell Fee %</Label>
          <Input
            data-ocid="breakeven.sellfee.input"
            type="number"
            value={sellFee}
            onChange={(e) => setSellFee(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Target Profit %</Label>
          <Input
            data-ocid="breakeven.profit.input"
            type="number"
            value={targetProfit}
            onChange={(e) => setTargetProfit(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Trade Size ($)</Label>
          <Input
            data-ocid="breakeven.size.input"
            type="number"
            value={tradeSize}
            onChange={(e) => setTradeSize(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      {breakevenPrice > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Breakeven Price",
              value: `$${breakevenPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}`,
              color: "text-blue-700",
              bg: "bg-blue-50 border-blue-200",
            },
            {
              label: "Target Sell Price",
              value: `$${targetSellPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}`,
              color: "text-emerald-700",
              bg: "bg-emerald-50 border-emerald-200",
            },
            {
              label: "Total Fees Cost",
              value: `$${totalFeesCost.toFixed(4)}`,
              color: "text-red-700",
              bg: "bg-red-50 border-red-200",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border p-4 ${item.bg}`}
            >
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className={`text-lg font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ATH Distance Tool ────────────────────────────────────────────────────────
interface ATHCoin {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  ath: number;
  atl: number;
  pctFromATH: number;
  pctFromATL: number;
  positionPct: number;
  color: string;
  bg: string;
}

function ATHDistanceTool() {
  const [coins, setCoins] = useState<ATHCoin[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const COIN_IDS = ["bitcoin", "ethereum", "solana", "binancecoin"];

  const fetchATH = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        COIN_IDS.map(async (id) => {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
          );
          if (!res.ok) throw new Error("CoinGecko error");
          const data = await res.json();
          const current = data.market_data.current_price.usd as number;
          const ath = data.market_data.ath.usd as number;
          const atl = data.market_data.atl.usd as number;
          const pctFromATH = ((current - ath) / ath) * 100;
          const pctFromATL = ((current - atl) / atl) * 100;
          const range = ath - atl;
          const positionPct = range > 0 ? ((current - atl) / range) * 100 : 50;

          let color = "text-green-700";
          let bg = "bg-green-50 border-green-200";
          if (pctFromATH < -50) {
            color = "text-red-700";
            bg = "bg-red-50 border-red-200";
          } else if (pctFromATH < -20) {
            color = "text-yellow-700";
            bg = "bg-yellow-50 border-yellow-200";
          }

          return {
            id,
            symbol: (data.symbol as string).toUpperCase(),
            name: data.name as string,
            currentPrice: current,
            ath,
            atl,
            pctFromATH,
            pctFromATL,
            positionPct,
            color,
            bg,
          } satisfies ATHCoin;
        }),
      );
      setCoins(results);
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchATH();
  }, [fetchATH]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchATH();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" /> ATH Distance
          Tracker
        </h3>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            data-ocid="ath.refresh.button"
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing || loading}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
      <p className="text-gray-500 text-sm">
        How far is each coin from its All-Time High and Low?
      </p>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((k) => (
            <div
              key={k}
              className="h-28 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coins.map((c) => (
            <div key={c.id} className={`rounded-xl border p-4 ${c.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-bold text-gray-900">{c.symbol}</span>
                  <span className="text-gray-400 text-xs ml-2">{c.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-gray-900 text-sm">
                    $
                    {c.currentPrice.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  ATL: $
                  {c.atl < 1
                    ? c.atl.toFixed(4)
                    : c.atl.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                </span>
                <span>
                  ATH: $
                  {c.ath.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="absolute h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(Math.max(c.positionPct, 2), 98)}%`,
                    background:
                      "linear-gradient(to right, #dc2626, #f59e0b, #10b981)",
                  }}
                />
                <div
                  className="absolute top-0 w-2 h-full bg-white border border-gray-300 rounded-full"
                  style={{
                    left: `calc(${Math.min(Math.max(c.positionPct, 2), 98)}% - 4px)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${c.color}`}>
                  ATH: {c.pctFromATH.toFixed(1)}%
                </span>
                <span className="font-semibold text-emerald-600">
                  +{c.pctFromATL.toFixed(0)}% from ATL
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Position Size Calculator v2 ─────────────────────────────────────────────
function PositionSizeCalcTool() {
  const [accountSize, setAccountSize] = useState("10000");
  const [riskPct, setRiskPct] = useState("2");
  const [entryPrice, setEntryPrice] = useState("50000");
  const [stopLossPrice, setStopLossPrice] = useState("48000");

  const account = Number.parseFloat(accountSize) || 0;
  const risk = Number.parseFloat(riskPct) || 0;
  const entry = Number.parseFloat(entryPrice) || 0;
  const stop = Number.parseFloat(stopLossPrice) || 0;

  const riskDollar = (account * risk) / 100;
  const priceRange = Math.abs(entry - stop);
  const positionUnits = priceRange > 0 ? riskDollar / priceRange : 0;
  const positionDollar = positionUnits * entry;

  const handleClear = () => {
    setAccountSize("");
    setRiskPct("");
    setEntryPrice("");
    setStopLossPrice("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" /> Position Size Calculator
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Account Size ($)</Label>
          <Input
            data-ocid="pos-size.account.input"
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Risk % per Trade</Label>
          <Input
            data-ocid="pos-size.risk.input"
            type="number"
            value={riskPct}
            onChange={(e) => setRiskPct(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Entry Price ($)</Label>
          <Input
            data-ocid="pos-size.entry.input"
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Stop Loss Price ($)</Label>
          <Input
            data-ocid="pos-size.stoploss.input"
            type="number"
            value={stopLossPrice}
            onChange={(e) => setStopLossPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      {positionUnits > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Position Size (units)",
              value: positionUnits.toFixed(6),
              color: "text-blue-700",
              bg: "bg-blue-50 border-blue-200",
            },
            {
              label: "Position Size ($)",
              value: `$${positionDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: "text-emerald-700",
              bg: "bg-emerald-50 border-emerald-200",
            },
            {
              label: "Risk Amount ($)",
              value: `$${riskDollar.toFixed(2)}`,
              color: "text-red-600",
              bg: "bg-red-50 border-red-200",
            },
            {
              label: "Risk %",
              value: `${risk}%`,
              color: "text-orange-700",
              bg: "bg-orange-50 border-orange-200",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border p-4 ${item.bg}`}
            >
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className={`text-lg font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Compound Interest Calculator ────────────────────────────────────────────
function CompoundInterestTool() {
  const [principal, setPrincipal] = useState("10000");
  const [apy, setApy] = useState("15");
  const [durationMonths, setDurationMonths] = useState("12");
  const [frequency, setFrequency] = useState("12"); // 12 = monthly

  const P = Number.parseFloat(principal) || 0;
  const r = (Number.parseFloat(apy) || 0) / 100;
  const n = Number.parseFloat(frequency) || 12;
  const t = (Number.parseFloat(durationMonths) || 12) / 12;

  const finalAmount = P * (1 + r / n) ** (n * t);
  const totalGain = finalAmount - P;
  const gainPct = P > 0 ? (totalGain / P) * 100 : 0;

  const handleClear = () => {
    setPrincipal("");
    setApy("");
    setDurationMonths("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" /> Compound Interest
          Calculator
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Principal ($)</Label>
          <Input
            data-ocid="compound.principal.input"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">APY (%)</Label>
          <Input
            data-ocid="compound.apy.input"
            type="number"
            value={apy}
            onChange={(e) => setApy(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Duration (months)</Label>
          <Input
            data-ocid="compound.duration.input"
            type="number"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Compound Freq.</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger
              data-ocid="compound.frequency.select"
              className="border-gray-200"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Yearly</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
              <SelectItem value="365">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {finalAmount > 0 && P > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Final Amount",
              value: `$${finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: "text-emerald-700",
              bg: "bg-emerald-50 border-emerald-200",
            },
            {
              label: "Total Gain",
              value: `+$${totalGain.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: "text-green-700",
              bg: "bg-green-50 border-green-200",
            },
            {
              label: "Gain %",
              value: `+${gainPct.toFixed(2)}%`,
              color: "text-blue-700",
              bg: "bg-blue-50 border-blue-200",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border p-4 text-center ${item.bg}`}
            >
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className={`text-xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DCA Buy Calculator ───────────────────────────────────────────────────────
function DCABuyTool() {
  const [monthlyInvest, setMonthlyInvest] = useState("500");
  const [buyPrice, setBuyPrice] = useState("50000");
  const [targetPrice, setTargetPrice] = useState("100000");
  const [months, setMonths] = useState("12");

  const monthly = Number.parseFloat(monthlyInvest) || 0;
  const buy = Number.parseFloat(buyPrice) || 0;
  const target = Number.parseFloat(targetPrice) || 0;
  const n = Math.min(Number.parseInt(months) || 12, 120);

  const totalInvested = monthly * n;
  const totalTokens = buy > 0 ? totalInvested / buy : 0;
  const avgPrice = totalTokens > 0 ? totalInvested / totalTokens : 0;
  const valueAtTarget = totalTokens * target;
  const profit = valueAtTarget - totalInvested;
  const roi = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

  const handleClear = () => {
    setMonthlyInvest("");
    setBuyPrice("");
    setTargetPrice("");
    setMonths("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Coins className="w-4 h-4 text-cyan-600" /> DCA Buy Calculator
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">
            Monthly Investment ($)
          </Label>
          <Input
            data-ocid="dca-buy.monthly.input"
            type="number"
            value={monthlyInvest}
            onChange={(e) => setMonthlyInvest(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Buy Price ($)</Label>
          <Input
            data-ocid="dca-buy.buyprice.input"
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Target Price ($)</Label>
          <Input
            data-ocid="dca-buy.target.input"
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Months</Label>
          <Input
            data-ocid="dca-buy.months.input"
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      {totalInvested > 0 && buy > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total Invested",
              value: `$${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              color: "text-blue-700",
              bg: "bg-blue-50 border-blue-200",
            },
            {
              label: "Total Tokens",
              value: totalTokens.toFixed(6),
              color: "text-purple-700",
              bg: "bg-purple-50 border-purple-200",
            },
            {
              label: "Avg Price",
              value: `$${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: "text-gray-700",
              bg: "bg-gray-50 border-gray-200",
            },
            {
              label: "Value at Target",
              value: `$${valueAtTarget.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              color: profit >= 0 ? "text-emerald-700" : "text-red-700",
              bg:
                profit >= 0
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border p-4 ${item.bg}`}
            >
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className={`text-sm font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
      {roi !== 0 && totalInvested > 0 && (
        <div
          className={`rounded-xl border p-4 text-center ${roi >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="text-xs text-gray-500 mb-1">ROI at Target</div>
          <div
            className={`text-3xl font-bold ${roi >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {roi >= 0 ? "+" : ""}
            {roi.toFixed(1)}%
          </div>
          <div
            className={`text-sm mt-1 ${roi >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {roi >= 0
              ? `+$${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })} profit`
              : `$${Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 0 })} loss`}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profit/Loss Calculator ───────────────────────────────────────────────────
function ProfitLossCalcTool() {
  const [entryPrice, setEntryPrice] = useState("50000");
  const [exitPrice, setExitPrice] = useState("60000");
  const [positionSize, setPositionSize] = useState("1000");
  const [leverage, setLeverage] = useState("1");
  const [direction, setDirection] = useState<"long" | "short">("long");

  const entry = Number.parseFloat(entryPrice) || 0;
  const exitP = Number.parseFloat(exitPrice) || 0;
  const size = Number.parseFloat(positionSize) || 0;
  const lev = Math.max(1, Number.parseFloat(leverage) || 1);

  const priceDiff = exitP - entry;
  const pnlPct = entry > 0 ? (priceDiff / entry) * 100 : 0;
  const dirMultiplier = direction === "long" ? 1 : -1;
  const pnlDollar = size * (priceDiff / entry) * dirMultiplier;
  const roePct = pnlPct * lev * dirMultiplier;

  const handleClear = () => {
    setEntryPrice("");
    setExitPrice("");
    setPositionSize("");
    setLeverage("1");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-green-600" /> Profit / Loss
          Calculator
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Entry Price ($)</Label>
          <Input
            data-ocid="pnl.entry.input"
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Exit Price ($)</Label>
          <Input
            data-ocid="pnl.exit.input"
            type="number"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Position Size ($)</Label>
          <Input
            data-ocid="pnl.size.input"
            type="number"
            value={positionSize}
            onChange={(e) => setPositionSize(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Leverage (x)</Label>
          <Input
            data-ocid="pnl.leverage.input"
            type="number"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="border-gray-200"
            min="1"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-sm">Direction</Label>
        <Select
          value={direction}
          onValueChange={(v) => setDirection(v as "long" | "short")}
        >
          <SelectTrigger
            data-ocid="pnl.direction.select"
            className="border-gray-200"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="long">Long (Buy)</SelectItem>
            <SelectItem value="short">Short (Sell)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {entry > 0 && exitP > 0 && size > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "PnL ($)",
              value: `${pnlDollar >= 0 ? "+" : ""}$${Math.abs(pnlDollar).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: pnlDollar >= 0 ? "text-green-700" : "text-red-700",
              bg:
                pnlDollar >= 0
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200",
            },
            {
              label: "PnL %",
              value: `${(pnlPct * dirMultiplier) >= 0 ? "+" : ""}${(pnlPct * dirMultiplier).toFixed(2)}%`,
              color:
                pnlPct * dirMultiplier >= 0 ? "text-green-700" : "text-red-700",
              bg:
                pnlPct * dirMultiplier >= 0
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200",
            },
            {
              label: `ROE % (${lev}x leverage)`,
              value: `${roePct >= 0 ? "+" : ""}${roePct.toFixed(2)}%`,
              color: roePct >= 0 ? "text-blue-700" : "text-red-700",
              bg:
                roePct >= 0
                  ? "bg-blue-50 border-blue-200"
                  : "bg-red-50 border-red-200",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border p-4 text-center ${item.bg}`}
            >
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className={`text-xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Currency Strength Meter ──────────────────────────────────────────────────
function CurrencyStrengthTool() {
  const CURRENCIES = [
    { code: "USD", name: "US Dollar", emoji: "🇺🇸" },
    { code: "EUR", name: "Euro", emoji: "🇪🇺" },
    { code: "GBP", name: "British Pound", emoji: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", emoji: "🇯🇵" },
    { code: "CHF", name: "Swiss Franc", emoji: "🇨🇭" },
    { code: "AUD", name: "Australian Dollar", emoji: "🇦🇺" },
    { code: "CAD", name: "Canadian Dollar", emoji: "🇨🇦" },
    { code: "NZD", name: "New Zealand Dollar", emoji: "🇳🇿" },
  ];

  const [strengths, setStrengths] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchStrengths = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.frankfurter.app/latest?from=USD", {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      const rates: Record<string, number> = { USD: 1, ...data.rates };
      // Normalize: higher rate vs USD = weaker currency (e.g. JPY=150 means weak)
      const normalised: Record<string, number> = {};
      for (const cur of CURRENCIES) {
        if (cur.code === "USD") {
          normalised.USD = 50;
          continue;
        }
        const rate = rates[cur.code];
        if (!rate) {
          normalised[cur.code] = 50;
          continue;
        }
        // Convert to "strength" — small rate vs USD means strong currency
        normalised[cur.code] = Math.round(
          Math.min(100, Math.max(0, (1 / rate) * 100)),
        );
      }
      // Normalize to 0-100 scale relative to each other
      const vals = Object.values(normalised);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const scaled: Record<string, number> = {};
      for (const [k, v] of Object.entries(normalised)) {
        scaled[k] =
          max !== min ? Math.round(((v - min) / (max - min)) * 100) : 50;
      }
      setStrengths(scaled);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      // Fallback with approximate static strengths
      setStrengths({
        USD: 72,
        EUR: 65,
        GBP: 58,
        JPY: 30,
        CHF: 80,
        AUD: 45,
        CAD: 52,
        NZD: 40,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStrengths();
  }, [fetchStrengths]);

  const sorted = [...CURRENCIES].sort(
    (a, b) => (strengths[b.code] ?? 50) - (strengths[a.code] ?? 50),
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" /> Currency Strength Meter
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchStrengths}
          disabled={loading}
          className="text-gray-400 hover:text-gray-600 text-xs gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      {lastUpdated && (
        <p className="text-xs text-gray-400">Updated: {lastUpdated}</p>
      )}
      <div className="space-y-3">
        {sorted.map((cur, idx) => {
          const strength = strengths[cur.code] ?? 50;
          const barColor =
            strength >= 70
              ? "bg-emerald-500"
              : strength >= 50
                ? "bg-blue-500"
                : strength >= 30
                  ? "bg-amber-500"
                  : "bg-red-400";
          return (
            <div key={cur.code} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <span>{cur.emoji}</span>
                  <span>{cur.code}</span>
                  <span className="text-gray-400 text-xs hidden sm:inline">
                    {cur.name}
                  </span>
                  {idx === 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                      Strongest
                    </span>
                  )}
                  {idx === sorted.length - 1 && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                      Weakest
                    </span>
                  )}
                </span>
                <span className="font-bold text-gray-800">{strength}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 pt-2">
        Relative strength based on live exchange rates vs USD via Frankfurter
        API.
      </p>
    </div>
  );
}

// ─── Risk/Reward Visualizer ───────────────────────────────────────────────────
function RiskRewardVisualizerTool() {
  const [entry, setEntry] = useState("50000");
  const [stopLoss, setStopLoss] = useState("48000");
  const [takeProfit, setTakeProfit] = useState("55000");
  const [capital, setCapital] = useState("10000");
  const riskPct = "2";

  const e = Number.parseFloat(entry) || 0;
  const sl = Number.parseFloat(stopLoss) || 0;
  const tp = Number.parseFloat(takeProfit) || 0;
  const cap = Number.parseFloat(capital) || 0;
  const risk = Number.parseFloat(riskPct) || 2;

  const dollarRisk = (cap * risk) / 100;
  const riskPips = Math.abs(e - sl);
  const rewardPips = Math.abs(tp - e);
  const rrRatio = riskPips > 0 ? rewardPips / riskPips : 0;
  const dollarReward = riskPips > 0 ? dollarRisk * rrRatio : 0;
  const winRateNeeded = rrRatio > 0 ? (1 / (1 + rrRatio)) * 100 : 0;
  const positionSize = riskPips > 0 ? dollarRisk / riskPips : 0;

  const ratingColor =
    rrRatio >= 3
      ? "text-emerald-600"
      : rrRatio >= 2
        ? "text-blue-600"
        : rrRatio >= 1
          ? "text-amber-600"
          : "text-red-500";
  const ratingLabel =
    rrRatio >= 3
      ? "Excellent"
      : rrRatio >= 2
        ? "Good"
        : rrRatio >= 1
          ? "Acceptable"
          : "Poor";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-600" /> Risk/Reward Visualizer
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Entry Price",
            value: entry,
            set: setEntry,
            ocid: "rr.entry.input",
          },
          {
            label: "Stop Loss",
            value: stopLoss,
            set: setStopLoss,
            ocid: "rr.sl.input",
          },
          {
            label: "Take Profit",
            value: takeProfit,
            set: setTakeProfit,
            ocid: "rr.tp.input",
          },
          {
            label: "Account Size ($)",
            value: capital,
            set: setCapital,
            ocid: "rr.capital.input",
          },
        ].map(({ label, value, set, ocid }) => (
          <div key={label} className="space-y-1">
            <Label className="text-gray-600 text-sm">{label}</Label>
            <Input
              data-ocid={ocid}
              type="number"
              value={value}
              onChange={(e) => set(e.target.value)}
              className="border-gray-200"
            />
          </div>
        ))}
      </div>

      {/* Visual bar */}
      {e > 0 && sl > 0 && tp > 0 && (
        <div className="space-y-3">
          <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-red-400 rounded-l-full"
              style={{
                width: `${Math.min(50, (riskPips / (riskPips + rewardPips)) * 100)}%`,
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-400 rounded-r-full"
              style={{
                width: `${Math.min(50, (rewardPips / (riskPips + rewardPips)) * 100)}%`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
              R:R = 1:{rrRatio.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Risk Amount",
                value: `$${dollarRisk.toFixed(2)}`,
                color: "text-red-600",
                bg: "bg-red-50 border-red-200",
              },
              {
                label: "Reward Amount",
                value: `$${dollarReward.toFixed(2)}`,
                color: "text-emerald-600",
                bg: "bg-emerald-50 border-emerald-200",
              },
              {
                label: "R:R Rating",
                value: ratingLabel,
                color: ratingColor,
                bg: "bg-gray-50 border-gray-200",
              },
              {
                label: "Win Rate Needed",
                value: `${winRateNeeded.toFixed(1)}%`,
                color: "text-blue-600",
                bg: "bg-blue-50 border-blue-200",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl p-3 border text-center ${item.bg}`}
              >
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className={`font-bold ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Position size: {positionSize.toFixed(4)} units/contract at {riskPct}
            % account risk.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Pip Value Calculator ────────────────────────────────────────────────────

function PipValueCalculatorTool() {
  const PAIRS = [
    { label: "EUR/USD", pipSize: 0.0001, quote: "USD" },
    { label: "GBP/USD", pipSize: 0.0001, quote: "USD" },
    { label: "USD/JPY", pipSize: 0.01, quote: "JPY" },
    { label: "USD/CHF", pipSize: 0.0001, quote: "CHF" },
    { label: "AUD/USD", pipSize: 0.0001, quote: "USD" },
    { label: "USD/CAD", pipSize: 0.0001, quote: "CAD" },
    { label: "NZD/USD", pipSize: 0.0001, quote: "USD" },
    { label: "EUR/GBP", pipSize: 0.0001, quote: "GBP" },
    { label: "EUR/JPY", pipSize: 0.01, quote: "JPY" },
    { label: "GBP/JPY", pipSize: 0.01, quote: "JPY" },
  ];

  const [pair, setPair] = useState(PAIRS[0].label);
  const [lotSize, setLotSize] = useState("1");
  const [exchangeRate, setExchangeRate] = useState("1");
  const [pips, setPips] = useState("10");
  const [result, setResult] = useState<{
    pipValue: number;
    totalPips: number;
  } | null>(null);

  const selectedPair = PAIRS.find((p) => p.label === pair) ?? PAIRS[0];

  const calculate = () => {
    const lots = Number.parseFloat(lotSize) || 0;
    const rate = Number.parseFloat(exchangeRate) || 1;
    const numPips = Number.parseFloat(pips) || 0;
    const units = lots * 100000;
    const pipValueQuote = units * selectedPair.pipSize;
    const pipValueAccount =
      selectedPair.quote === "USD" ? pipValueQuote : pipValueQuote / rate;
    setResult({
      pipValue: pipValueAccount,
      totalPips: pipValueAccount * numPips,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-emerald-600" /> Pip Value Calculator
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <Label>Currency Pair</Label>
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          >
            {PAIRS.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Lot Size (standard lots)</Label>
          <Input
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            placeholder="1"
            type="number"
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="space-y-1">
          <Label>Number of Pips</Label>
          <Input
            value={pips}
            onChange={(e) => setPips(e.target.value)}
            placeholder="10"
            type="number"
            min="1"
          />
        </div>
        <div className="space-y-1">
          <Label>Quote/USD Exchange Rate</Label>
          <Input
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            placeholder="1.0"
            type="number"
            min="0.0001"
            step="0.0001"
          />
        </div>
      </div>
      <Button
        onClick={calculate}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white"
      >
        Calculate Pip Value
      </Button>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-2 gap-3"
        >
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">
              Per Pip Value (USD)
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              ${result.pipValue.toFixed(4)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">
              Total ({pips} pips)
            </div>
            <div className="text-2xl font-bold text-blue-700">
              ${result.totalPips.toFixed(2)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Crypto Volatility Meter ─────────────────────────────────────────────────

function VolatilityMeterTool() {
  const ASSETS = [
    { symbol: "BTC", binance: "BTCUSDT" },
    { symbol: "ETH", binance: "ETHUSDT" },
    { symbol: "BNB", binance: "BNBUSDT" },
    { symbol: "SOL", binance: "SOLUSDT" },
    { symbol: "XRP", binance: "XRPUSDT" },
  ];

  const [data, setData] = useState<
    { symbol: string; vol: number; change: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<string | null>(null);

  const fetchVolatility = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        ASSETS.map(async (asset) => {
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${asset.binance}&interval=1d&limit=31`,
          );
          const klines: [string, string, string, string, string][] =
            await res.json();
          const closes = klines.map((k) => Number.parseFloat(k[4]));
          const returns: number[] = [];
          for (let i = 1; i < closes.length; i++) {
            returns.push(Math.log(closes[i] / closes[i - 1]));
          }
          const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
          const variance =
            returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
          const stdDev = Math.sqrt(variance);
          const annualizedVol = stdDev * Math.sqrt(365) * 100;
          const change30d =
            closes.length >= 2
              ? ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100
              : 0;
          return {
            symbol: asset.symbol,
            vol: annualizedVol,
            change: change30d,
          };
        }),
      );
      setData(results);
      setLastFetch(new Date().toLocaleTimeString());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  const maxVol = Math.max(...data.map((d) => d.vol), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-600" /> 30-Day Annualized
          Volatility
        </h3>
        <Button
          onClick={fetchVolatility}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? "Fetching..." : "Fetch Live Data"}
        </Button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Activity className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            Click &quot;Fetch Live Data&quot; to load 30-day volatility from
            Binance
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data
            .sort((a, b) => b.vol - a.vol)
            .map((item, i) => (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="w-10 text-xs font-bold text-gray-600">
                  {item.symbol}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        item.vol > 80
                          ? "#ef4444"
                          : item.vol > 50
                            ? "#f59e0b"
                            : "#10b981",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.vol / maxVol) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  />
                </div>
                <span
                  className="w-16 text-right text-xs font-bold"
                  style={{
                    color:
                      item.vol > 80
                        ? "#ef4444"
                        : item.vol > 50
                          ? "#f59e0b"
                          : "#10b981",
                  }}
                >
                  {item.vol.toFixed(1)}%
                </span>
                <span
                  className={`w-16 text-right text-xs ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(1)}%
                </span>
              </motion.div>
            ))}
          {lastFetch && (
            <p className="text-xs text-gray-400 text-right mt-2">
              Last updated: {lastFetch}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── RBS Token Forecast ──────────────────────────────────────────────────────

function RBSForecastTool() {
  const [currentPrice, setCurrentPrice] = useState("0.001");
  const [growthRate, setGrowthRate] = useState("50");
  const [timePeriod, setTimePeriod] = useState("12");
  const [holdAmount, setHoldAmount] = useState("1000");
  const [result, setResult] = useState<{
    projectedPrice: number;
    projectedValue: number;
    roi: number;
    milestones: { month: number; price: number }[];
  } | null>(null);

  const calculate = () => {
    const price = Number.parseFloat(currentPrice) || 0.001;
    const growth = Number.parseFloat(growthRate) || 0;
    const months = Number.parseInt(timePeriod) || 12;
    const amount = Number.parseFloat(holdAmount) || 0;
    const monthlyRate = growth / 100 / 12;
    const projectedPrice = price * (1 + monthlyRate) ** months;
    const projectedValue = (amount / price) * projectedPrice;
    const roi = ((projectedValue - amount) / amount) * 100;
    const milestones: { month: number; price: number }[] = [];
    for (let m = 1; m <= months; m += Math.max(1, Math.floor(months / 6))) {
      milestones.push({
        month: m,
        price: price * (1 + monthlyRate) ** m,
      });
    }
    setResult({ projectedPrice, projectedValue, roi, milestones });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-emerald-600" /> RBS Token Forecast
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Projection tool — not financial advice
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <Label>Current RBS Price (USD)</Label>
          <Input
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            placeholder="0.001"
            type="number"
            min="0"
            step="0.0001"
          />
        </div>
        <div className="space-y-1">
          <Label>Expected Annual Growth %</Label>
          <Input
            value={growthRate}
            onChange={(e) => setGrowthRate(e.target.value)}
            placeholder="50"
            type="number"
            min="-99"
            max="10000"
          />
        </div>
        <div className="space-y-1">
          <Label>Time Period (months)</Label>
          <Input
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            placeholder="12"
            type="number"
            min="1"
            max="120"
          />
        </div>
        <div className="space-y-1">
          <Label>Investment Amount (USD)</Label>
          <Input
            value={holdAmount}
            onChange={(e) => setHoldAmount(e.target.value)}
            placeholder="1000"
            type="number"
            min="0"
          />
        </div>
      </div>
      <Button
        onClick={calculate}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white mb-4"
      >
        Calculate Projection
      </Button>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Projected Price</div>
              <div className="text-lg font-bold text-emerald-700">
                $
                {result.projectedPrice < 0.01
                  ? result.projectedPrice.toFixed(6)
                  : result.projectedPrice.toFixed(4)}
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Portfolio Value</div>
              <div className="text-lg font-bold text-blue-700">
                ${result.projectedValue.toFixed(2)}
              </div>
            </div>
            <div
              className={`rounded-xl p-3 text-center ${result.roi >= 0 ? "bg-green-50" : "bg-red-50"}`}
            >
              <div className="text-xs text-gray-500 mb-1">ROI</div>
              <div
                className={`text-lg font-bold ${result.roi >= 0 ? "text-green-700" : "text-red-700"}`}
              >
                {result.roi >= 0 ? "+" : ""}
                {result.roi.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Price Milestones
            </p>
            <div className="space-y-1">
              {result.milestones.map((m) => (
                <div
                  key={m.month}
                  className="flex justify-between text-xs text-gray-600"
                >
                  <span>Month {m.month}</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    ${m.price < 0.01 ? m.price.toFixed(6) : m.price.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Calculator Hub — Professional Sidebar Layout ────────────────────────────

interface CalcCategory {
  label: string;
  icon: React.FC<{ className?: string }>;
  tools: CalcTool[];
}

interface CalcTool {
  id: string;
  label: string;
  description: string;
  component: React.FC;
}

function CalculatorHub() {
  const [activeId, setActiveId] = useState("position-size");
  const [openCategory, setOpenCategory] = useState<string | null>(
    "Position Sizing",
  );

  const categories: CalcCategory[] = [
    {
      label: "Position Sizing",
      icon: Shield,
      tools: [
        {
          id: "position-size",
          label: "Position Size",
          description: "Calculate optimal position size based on risk",
          component: PositionSizeTool,
        },
        {
          id: "pos-size-v2",
          label: "Position Size Calc",
          description: "Advanced position sizing with stop/target",
          component: PositionSizeCalcTool,
        },
        {
          id: "kelly",
          label: "Kelly Criterion",
          description: "Mathematically optimal bet sizing",
          component: KellyCriterionTool,
        },
        {
          id: "risk-of-ruin",
          label: "Risk of Ruin",
          description: "Probability of losing your trading account",
          component: RiskOfRuinTool,
        },
      ],
    },
    {
      label: "Price Levels",
      icon: BarChart2,
      tools: [
        {
          id: "pivot-points",
          label: "Pivot Points",
          description: "Classic S/R pivot levels from OHLC",
          component: PivotPointsTool,
        },
        {
          id: "liquidation",
          label: "Liquidation Price",
          description: "When does your leveraged position liquidate?",
          component: LiquidationPriceCalculator,
        },
        {
          id: "ath",
          label: "ATH Distance",
          description: "How far from all-time high/low?",
          component: ATHDistanceTool,
        },
        {
          id: "fibonacci",
          label: "Fibonacci Levels",
          description: "Retracement and extension levels",
          component: FibonacciTool,
        },
      ],
    },
    {
      label: "Profit & Loss",
      icon: TrendingUp,
      tools: [
        {
          id: "profit-loss",
          label: "Profit / Loss",
          description: "Calculate trade P&L with fees",
          component: ProfitLossCalcTool,
        },
        {
          id: "breakeven",
          label: "Breakeven Price",
          description: "Find your exact breakeven after fees",
          component: BreakevenCalculatorTool,
        },
        {
          id: "fee-impact",
          label: "Fee Impact",
          description: "See how fees erode your returns",
          component: FeeImpactCalculator,
        },
        {
          id: "compound",
          label: "Compound Interest",
          description: "Model compounding growth over time",
          component: CompoundInterestTool,
        },
        {
          id: "compound-returns",
          label: "Compound Returns",
          description: "Long-term compound return projections",
          component: CompoundReturnsTool,
        },
        {
          id: "dca",
          label: "DCA / Compound",
          description: "Dollar-cost averaging simulator",
          component: DCATool,
        },
        {
          id: "dca-buy",
          label: "DCA Buy Calc",
          description: "Average down your entry price",
          component: DCABuyTool,
        },
      ],
    },
    {
      label: "Forex Tools",
      icon: Globe,
      tools: [
        {
          id: "pip",
          label: "P&L Calculator",
          description: "Forex and crypto profit/loss",
          component: PipCalculatorTool,
        },
        {
          id: "pip-value",
          label: "Pip Value",
          description: "Value of a pip for any pair and lot size",
          component: PipValueCalculatorTool,
        },
        {
          id: "currency-strength",
          label: "Currency Strength",
          description: "Real-time strength of 8 major currencies",
          component: CurrencyStrengthTool,
        },
      ],
    },
    {
      label: "Crypto Tools",
      icon: Coins,
      tools: [
        {
          id: "funding-roi",
          label: "Funding Rate ROI",
          description: "Calculate funding rate returns",
          component: FundingRateROITool,
        },
        {
          id: "leverage",
          label: "Leverage Risk",
          description: "Understand your leverage exposure",
          component: LeverageCalculatorTool,
        },
        {
          id: "rbs-forecast",
          label: "RBS Forecast",
          description: "Project RBS token price and portfolio value",
          component: RBSForecastTool,
        },
        {
          id: "converter",
          label: "Crypto Converter",
          description: "Convert between 10 major coins",
          component: CryptoConverterTool,
        },
        {
          id: "volatility-meter",
          label: "Volatility Meter",
          description: "Live ATR-based volatility for top cryptos",
          component: VolatilityMeterTool,
        },
        {
          id: "volatility",
          label: "Volatility",
          description: "Historical volatility analysis",
          component: VolatilityTool,
        },
        {
          id: "crypto-tax",
          label: "Crypto Tax Estimator",
          description: "Estimate tax on your crypto gains",
          component: CryptoTaxTool,
        },
        {
          id: "adv-profit",
          label: "Advanced Profit Calc",
          description: "P&L with fees, leverage, and ROI breakdown",
          component: AdvancedProfitCalcTool,
        },
      ],
    },
    {
      label: "Market Analysis",
      icon: Activity,
      tools: [
        {
          id: "sentiment",
          label: "Market Sentiment",
          description: "Fear & Greed Index with 7-day history",
          component: MarketSentimentTool,
        },
        {
          id: "risk-reward",
          label: "Risk / Reward",
          description: "Visualize your trade risk-reward ratio",
          component: RiskRewardVisualizerTool,
        },
        {
          id: "trend-strength",
          label: "Trend Strength Meter",
          description: "Live EMA-based trend strength gauge for any coin",
          component: TrendStrengthTool,
        },
        {
          id: "session-timer",
          label: "Session Overlap Timer",
          description: "Live market session clocks — best trading windows",
          component: MarketSessionTimerTool,
        },
      ],
    },
  ];

  // Find active tool
  let ActiveComponent: React.FC | null = null;
  let activeTool: CalcTool | null = null;
  for (const cat of categories) {
    const found = cat.tools.find((t) => t.id === activeId);
    if (found) {
      ActiveComponent = found.component;
      activeTool = found;
      break;
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div
        className="lg:w-64 xl:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto"
        style={{ maxHeight: "78vh" }}
      >
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Calculator Categories
          </p>
        </div>
        <div className="py-2">
          {categories.map((cat) => {
            const isOpen = openCategory === cat.label;
            return (
              <div key={cat.label}>
                <button
                  type="button"
                  onClick={() => setOpenCategory(isOpen ? null : cat.label)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
                  data-ocid={`calc.${cat.label.toLowerCase().replace(/\s+/g, "-")}.toggle`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                      <cat.icon className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-sky-600 transition-colors">
                      {cat.label}
                    </span>
                  </div>
                  <span
                    className={`text-gray-400 transition-transform duration-200 text-xs ${isOpen ? "rotate-90" : ""}`}
                  >
                    ▶
                  </span>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-1">
                      {cat.tools.map((tool) => {
                        const isActive = activeId === tool.id;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => setActiveId(tool.id)}
                            data-ocid={`calc.${tool.id}.tab`}
                            className={`w-full text-left px-4 py-2 pl-10 transition-all ${
                              isActive
                                ? "bg-sky-50 border-r-2 border-sky-500 text-sky-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {tool.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Panel */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "78vh" }}>
        {activeTool && (
          <div className="border-b border-gray-100 px-6 py-4 bg-white flex items-start gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {activeTool.label}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {activeTool.description}
              </p>
            </div>
          </div>
        )}
        <div className="p-4 sm:p-6">
          {ActiveComponent ? (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <p>Select a calculator from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TradingToolsPage() {
  const navigate = useNavigate();
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchBTC = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.bitcoin?.usd) setBtcPrice(data.bitcoin.usd);
      } catch {
        /* silent */
      }
    };
    fetchBTC();
    const interval = setInterval(fetchBTC, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageHead
        title="Trading Arsenal | RBS"
        description="Professional-grade trading tools: G-MAN Intel, Staking Calculator, Fear & Greed Index, Market Pulse and more."
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section
          className="pt-20 sm:pt-24 pb-10 sm:pb-16 px-3 sm:px-4 md:px-6 text-center border-b border-gray-100"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f0f9ff 60%, #e0f2fe 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-4 sm:mb-6">
                <BarChart2 className="w-4 h-4" /> Professional Trading Tools
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
                Your <span className="shimmer-turquoise">Trading Arsenal</span>
              </h1>
              <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                Professional-grade tools to help you trade smarter, stay ahead
                of markets, and make data-driven decisions.
              </p>

              {btcPrice !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm mb-6"
                >
                  <img
                    src="https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png"
                    alt="BTC"
                    className="w-6 h-6"
                  />
                  <span className="text-gray-700 font-medium">BTC</span>
                  <span className="font-bold text-gray-900 font-jetbrains">
                    $
                    {btcPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                    })}
                  </span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    ● Live
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-6 sm:py-8 px-3 sm:px-4 md:px-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {QUICK_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div
                    className={`text-2xl font-bold ${stat.color} font-jetbrains`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                All Trading Tools
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Click any tool to open it instantly
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {TOOLS.map((tool, i) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  className={`bg-white border ${tool.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col`}
                  onClick={() => navigate({ to: tool.path as "/" })}
                  data-ocid={`trading-tools.${tool.title.toLowerCase().replace(/\s+/g, "-")}.card`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <tool.icon className="w-5 h-5" />
                    </div>
                    {tool.badge && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${tool.badge === "Pro" ? "bg-emerald-100 text-emerald-700" : "bg-green-100 text-green-700"}`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-gray-900 font-bold text-base mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">
                    {tool.description}
                  </p>

                  <ul className="space-y-1 mb-4">
                    {tool.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-1.5 text-xs text-gray-500"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${tool.iconBg.replace("bg-", "bg-").replace("50", "400")} flex-shrink-0`}
                          style={{ background: "currentColor" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="sm"
                    variant="outline"
                    className={`w-full border-gray-200 text-gray-600 hover:bg-gray-50 text-xs group-hover:border-current group-hover:${tool.iconColor} transition-colors`}
                    data-ocid={`trading-tools.${tool.title.toLowerCase().replace(/\s+/g, "-")}.button`}
                  >
                    Open Tool <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Professional Calculators Hub ─────────────────────────────── */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-sky-50 text-sky-700 text-sm font-medium mb-3">
                <Calculator className="w-4 h-4" /> Professional Calculator Suite
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Trading Calculators
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Precision tools for position management, risk control, and
                profit planning
              </p>
            </div>
            <CalculatorHub />
          </div>
        </section>

        {/* CTA section */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Trade Smarter?
            </h2>
            <p className="text-gray-500 mb-8">
              Start with G-MAN Intel for live trading signals and explore our
              comprehensive suite of professional trading tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                data-ocid="trading-tools.gman.primary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold"
              >
                Open G-MAN Intel <Zap className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// ─── Pivot Points Tool ────────────────────────────────────────────────────────
function PivotPointsTool() {
  const [high, setHigh] = useState("52000");
  const [low, setLow] = useState("48000");
  const [close, setClose] = useState("50000");

  const h = Number.parseFloat(high) || 0;
  const l = Number.parseFloat(low) || 0;
  const c = Number.parseFloat(close) || 0;

  const pp = (h + l + c) / 3;
  const r1 = 2 * pp - l;
  const s1 = 2 * pp - h;
  const r2 = pp + (h - l);
  const s2 = pp - (h - l);
  const r3 = h + 2 * (pp - l);
  const s3 = l - 2 * (h - pp);

  const levels = [
    { label: "R3", value: r3, color: "text-red-700", bg: "bg-red-50" },
    { label: "R2", value: r2, color: "text-red-600", bg: "bg-red-50" },
    { label: "R1", value: r1, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "PP", value: pp, color: "text-sky-700", bg: "bg-sky-50" },
    { label: "S1", value: s1, color: "text-green-600", bg: "bg-green-50" },
    { label: "S2", value: s2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "S3", value: s3, color: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-sky-600" /> Pivot Points Calculator
      </h3>
      <p className="text-gray-500 text-sm">
        Enter the previous period's High, Low, and Close to calculate Classic
        Pivot Points.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Previous High",
            value: high,
            set: setHigh,
            ocid: "pivot.high.input",
          },
          {
            label: "Previous Low",
            value: low,
            set: setLow,
            ocid: "pivot.low.input",
          },
          {
            label: "Previous Close",
            value: close,
            set: setClose,
            ocid: "pivot.close.input",
          },
        ].map((f) => (
          <div key={f.label} className="space-y-2">
            <Label className="text-gray-600 text-sm">{f.label}</Label>
            <Input
              data-ocid={f.ocid}
              type="number"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="border-gray-200"
            />
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-200">
              <th className="text-left py-2 px-3">Level</th>
              <th className="text-right py-2 px-3">Price</th>
              <th className="text-left py-2 px-3 hidden sm:table-cell">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {levels.map((lv) => (
              <tr
                key={lv.label}
                className={`border-b border-gray-100 ${lv.bg} transition-colors`}
              >
                <td className={`py-2 px-3 font-bold ${lv.color}`}>
                  {lv.label}
                </td>
                <td className="py-2 px-3 text-right font-mono text-gray-900">
                  $
                  {lv.value.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-3 text-gray-400 text-xs hidden sm:table-cell">
                  {lv.label === "PP"
                    ? "Pivot Point"
                    : lv.label.startsWith("R")
                      ? `Resistance ${lv.label[1]}`
                      : `Support ${lv.label[1]}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Risk of Ruin Tool ────────────────────────────────────────────────────────
function RiskOfRuinTool() {
  const [winRate, setWinRate] = useState("55");
  const [riskPct, setRiskPct] = useState("2");
  const [rrRatio, setRrRatio] = useState("2");
  const [result, setResult] = useState<{
    ror: number;
    expectancy: number;
  } | null>(null);

  const calculate = () => {
    const w = Number.parseFloat(winRate) / 100;
    const r = Number.parseFloat(riskPct) / 100;
    const rr = Number.parseFloat(rrRatio);
    if (!w || !r || !rr || w <= 0 || w >= 1 || r <= 0 || r >= 1 || rr <= 0)
      return;

    // Risk of Ruin formula: ((1-w)/w)^(1/r) approximation
    const lossRate = 1 - w;
    const ratio = lossRate / w;
    const exponent = 1 / ((r * 100) / 2);
    const ror = Math.min(100, ratio ** exponent * 100);
    const expectancy = (w * rr - lossRate) * 100;
    setResult({ ror: Math.max(0, ror), expectancy });
  };

  const rorColor = result
    ? result.ror < 5
      ? "text-emerald-600"
      : result.ror < 20
        ? "text-yellow-600"
        : "text-red-600"
    : "";
  const rorLabel = result
    ? result.ror < 5
      ? "Low Risk"
      : result.ror < 20
        ? "Moderate Risk"
        : "High Risk"
    : "";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-600" /> Risk of Ruin
        Calculator
      </h3>
      <p className="text-gray-500 text-sm">
        Estimate the probability of blowing your trading account based on your
        strategy parameters.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Win Rate (%)",
            value: winRate,
            set: setWinRate,
            ocid: "ror.winrate.input",
            placeholder: "e.g. 55",
          },
          {
            label: "Risk Per Trade (%)",
            value: riskPct,
            set: setRiskPct,
            ocid: "ror.risk.input",
            placeholder: "e.g. 2",
          },
          {
            label: "Risk/Reward Ratio",
            value: rrRatio,
            set: setRrRatio,
            ocid: "ror.rr.input",
            placeholder: "e.g. 2",
          },
        ].map((f) => (
          <div key={f.label} className="space-y-2">
            <Label className="text-gray-600 text-sm">{f.label}</Label>
            <Input
              data-ocid={f.ocid}
              type="number"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              placeholder={f.placeholder}
              className="border-gray-200"
            />
          </div>
        ))}
      </div>
      <Button
        data-ocid="ror.calculate.button"
        onClick={calculate}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full sm:w-auto"
      >
        Calculate Risk of Ruin
      </Button>
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div
            className={`rounded-xl p-4 border ${result.ror < 5 ? "bg-emerald-50 border-emerald-200" : result.ror < 20 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">Risk of Ruin</p>
            <p className={`text-3xl font-black ${rorColor}`}>
              {result.ror.toFixed(2)}%
            </p>
            <p className={`text-sm font-semibold mt-1 ${rorColor}`}>
              {rorLabel}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Probability of losing entire account
            </p>
          </div>
          <div
            className={`rounded-xl p-4 border ${result.expectancy > 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">
              Expected Value per Trade
            </p>
            <p
              className={`text-3xl font-black ${result.expectancy > 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {result.expectancy > 0 ? "+" : ""}
              {result.expectancy.toFixed(2)}%
            </p>
            <p
              className={`text-sm font-semibold mt-1 ${result.expectancy > 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {result.expectancy > 0 ? "Positive Edge" : "Negative Edge"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Average gain/loss per trade
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Kelly Criterion Tool ─────────────────────────────────────────────────────
function KellyCriterionTool() {
  const [winRate, setWinRate] = useState("55");
  const [winLossRatio, setWinLossRatio] = useState("2");
  const [capital, setCapital] = useState("10000");
  const [result, setResult] = useState<{
    kelly: number;
    halfKelly: number;
    positionSize: number;
    halfPositionSize: number;
  } | null>(null);

  const calculate = () => {
    const w = Number.parseFloat(winRate) / 100;
    const b = Number.parseFloat(winLossRatio);
    const cap = Number.parseFloat(capital);
    if (!w || !b || w <= 0 || w >= 1 || b <= 0) return;
    const kelly = (b * w - (1 - w)) / b;
    const halfKelly = kelly / 2;
    setResult({
      kelly: Math.max(0, kelly * 100),
      halfKelly: Math.max(0, halfKelly * 100),
      positionSize: Math.max(0, kelly * cap),
      halfPositionSize: Math.max(0, halfKelly * cap),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-sky-600" /> Kelly Criterion
        Calculator
      </h3>
      <p className="text-gray-500 text-sm">
        Calculate the optimal position size to maximize long-term account growth
        without over-risking.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Win Rate (%)",
            value: winRate,
            set: setWinRate,
            ocid: "kelly.winrate.input",
          },
          {
            label: "Win/Loss Ratio",
            value: winLossRatio,
            set: setWinLossRatio,
            ocid: "kelly.ratio.input",
          },
          {
            label: "Account Capital ($)",
            value: capital,
            set: setCapital,
            ocid: "kelly.capital.input",
          },
        ].map((f) => (
          <div key={f.label} className="space-y-2">
            <Label className="text-gray-600 text-sm">{f.label}</Label>
            <Input
              data-ocid={f.ocid}
              type="number"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="border-gray-200"
            />
          </div>
        ))}
      </div>
      <Button
        data-ocid="kelly.calculate.button"
        onClick={calculate}
        className="bg-sky-600 hover:bg-sky-700 text-white font-bold w-full sm:w-auto"
      >
        Calculate Kelly %
      </Button>
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl p-4 bg-sky-50 border border-sky-200">
            <p className="text-xs text-gray-500 mb-1">Full Kelly</p>
            <p className="text-3xl font-black text-sky-700">
              {result.kelly.toFixed(1)}%
            </p>
            <p className="text-sm font-semibold text-sky-600 mt-1">
              $
              {result.positionSize.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maximum theoretical allocation
            </p>
          </div>
          <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200">
            <p className="text-xs text-gray-500 mb-1">
              Half Kelly (Recommended)
            </p>
            <p className="text-3xl font-black text-emerald-700">
              {result.halfKelly.toFixed(1)}%
            </p>
            <p className="text-sm font-semibold text-emerald-600 mt-1">
              $
              {result.halfPositionSize.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Conservative position size
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Funding Rate ROI Tool ────────────────────────────────────────────────────
function FundingRateROITool() {
  const [positionSize, setPositionSize] = useState("10000");
  const [fundingRate, setFundingRate] = useState("0.01");
  const [periods, setPeriods] = useState("30");
  const [isLong, setIsLong] = useState(true);
  const [result, setResult] = useState<{
    total: number;
    daily: number;
    breakeven: number;
  } | null>(null);

  const calculate = () => {
    const pos = Number.parseFloat(positionSize);
    const rate = Number.parseFloat(fundingRate) / 100;
    const n = Number.parseFloat(periods);
    if (!pos || !rate || !n) return;
    // Funding is paid every 8 hours = 3 times per day
    const totalFunding = pos * rate * n;
    const dailyFunding = pos * rate * 3;
    // Breakeven move needed to offset funding costs
    const breakeven = (Math.abs(totalFunding) / pos) * 100;
    setResult({
      total: isLong ? -totalFunding : totalFunding,
      daily: isLong ? -dailyFunding : dailyFunding,
      breakeven,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <Activity className="w-4 h-4 text-purple-600" /> Funding Rate ROI
        Calculator
      </h3>
      <p className="text-gray-500 text-sm">
        Calculate total funding costs or income for futures positions across
        multiple funding periods.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Position Size ($)",
            value: positionSize,
            set: setPositionSize,
            ocid: "funding.size.input",
          },
          {
            label: "Funding Rate (%)",
            value: fundingRate,
            set: setFundingRate,
            ocid: "funding.rate.input",
          },
          {
            label: "Number of Periods (8h each)",
            value: periods,
            set: setPeriods,
            ocid: "funding.periods.input",
          },
        ].map((f) => (
          <div key={f.label} className="space-y-2">
            <Label className="text-gray-600 text-sm">{f.label}</Label>
            <Input
              data-ocid={f.ocid}
              type="number"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="border-gray-200"
            />
          </div>
        ))}
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Position Type</Label>
          <div className="flex gap-2">
            {["Long", "Short"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setIsLong(t === "Long")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${isLong === (t === "Long") ? (t === "Long" ? "bg-emerald-600 text-white border-emerald-600" : "bg-red-500 text-white border-red-500") : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button
        data-ocid="funding.calculate.button"
        onClick={calculate}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold w-full sm:w-auto"
      >
        Calculate Funding Cost
      </Button>
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div
            className={`rounded-xl p-4 border ${result.total < 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">Total Funding P&L</p>
            <p
              className={`text-2xl font-black ${result.total < 0 ? "text-red-600" : "text-emerald-600"}`}
            >
              {result.total >= 0 ? "+" : ""}${result.total.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Over {periods} periods</p>
          </div>
          <div
            className={`rounded-xl p-4 border ${result.daily < 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">Daily Funding P&L</p>
            <p
              className={`text-2xl font-black ${result.daily < 0 ? "text-red-600" : "text-emerald-600"}`}
            >
              {result.daily >= 0 ? "+" : ""}${result.daily.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">3 payments per day</p>
          </div>
          <div className="rounded-xl p-4 bg-sky-50 border border-sky-200">
            <p className="text-xs text-gray-500 mb-1">Breakeven Move Needed</p>
            <p className="text-2xl font-black text-sky-700">
              {result.breakeven.toFixed(3)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Price move to offset funding
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Crypto Tax Estimator ─────────────────────────────────────────────────────
function CryptoTaxTool() {
  const [buyPrice, setBuyPrice] = useState("30000");
  const [sellPrice, setSellPrice] = useState("45000");
  const [amount, setAmount] = useState("1");
  const [taxRate, setTaxRate] = useState("30");
  const [holdingPeriod, setHoldingPeriod] = useState<"short" | "long">("short");
  const [result, setResult] = useState<{
    profit: number;
    taxOwed: number;
    netProfit: number;
    effectiveRate: number;
  } | null>(null);

  const calculate = () => {
    const buy = Number.parseFloat(buyPrice);
    const sell = Number.parseFloat(sellPrice);
    const amt = Number.parseFloat(amount);
    const rate = Number.parseFloat(taxRate) / 100;
    if (!buy || !sell || !amt || !rate) return;
    const profit = (sell - buy) * amt;
    const effectiveRate = holdingPeriod === "long" ? rate * 0.5 : rate; // Long-term usually halved
    const taxOwed = profit > 0 ? profit * effectiveRate : 0;
    const netProfit = profit - taxOwed;
    setResult({
      profit,
      taxOwed,
      netProfit,
      effectiveRate: effectiveRate * 100,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <Shield className="w-4 h-4 text-indigo-600" /> Crypto Tax Estimator
      </h3>
      <p className="text-gray-500 text-sm">
        Estimate your crypto capital gains tax. Note: this is an estimate —
        consult a tax professional for precise calculations.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Buy Price (per unit $)",
            value: buyPrice,
            set: setBuyPrice,
            ocid: "tax.buy.input",
          },
          {
            label: "Sell Price (per unit $)",
            value: sellPrice,
            set: setSellPrice,
            ocid: "tax.sell.input",
          },
          {
            label: "Amount (units)",
            value: amount,
            set: setAmount,
            ocid: "tax.amount.input",
          },
          {
            label: "Tax Rate (%)",
            value: taxRate,
            set: setTaxRate,
            ocid: "tax.rate.input",
          },
        ].map((f) => (
          <div key={f.label} className="space-y-2">
            <Label className="text-gray-600 text-sm">{f.label}</Label>
            <Input
              data-ocid={f.ocid}
              type="number"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="border-gray-200"
            />
          </div>
        ))}
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-gray-600 text-sm">Holding Period</Label>
          <div className="flex gap-2">
            {[
              { key: "short" as const, label: "Short-term (< 1 year)" },
              { key: "long" as const, label: "Long-term (≥ 1 year)" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setHoldingPeriod(t.key)}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${holdingPeriod === t.key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button
        data-ocid="tax.calculate.button"
        onClick={calculate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full sm:w-auto"
      >
        Estimate Tax Liability
      </Button>
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div
            className={`rounded-xl p-4 border ${result.profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">Total Profit / Loss</p>
            <p
              className={`text-2xl font-black ${result.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {result.profit >= 0 ? "+" : ""}$
              {result.profit.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="rounded-xl p-4 bg-red-50 border border-red-200">
            <p className="text-xs text-gray-500 mb-1">Estimated Tax Owed</p>
            <p className="text-2xl font-black text-red-600">
              $
              {result.taxOwed.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              At {result.effectiveRate.toFixed(1)}% effective rate
            </p>
          </div>
          <div
            className={`rounded-xl p-4 border sm:col-span-2 ${result.netProfit >= 0 ? "bg-sky-50 border-sky-200" : "bg-red-50 border-red-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">Net Profit After Tax</p>
            <p
              className={`text-3xl font-black ${result.netProfit >= 0 ? "text-sky-700" : "text-red-600"}`}
            >
              {result.netProfit >= 0 ? "+" : ""}$
              {result.netProfit.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {holdingPeriod === "long"
                ? "Long-term rate applied (50% discount)"
                : "Short-term rate applied (full rate)"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Liquidation Price Calculator ─────────────────────────────────────────────
function LiquidationPriceCalculator() {
  const [entryPrice, setEntryPrice] = useState("");
  const [leverage, setLeverage] = useState("");
  const [posType, setPosType] = useState<"long" | "short">("long");
  const [maintenanceMargin, setMaintenanceMargin] = useState("0.5");
  const [result, setResult] = useState<{
    liqPrice: number;
    distPct: number;
    marginUsed: number;
  } | null>(null);

  const calculate = () => {
    const ep = Number.parseFloat(entryPrice);
    const lev = Number.parseFloat(leverage);
    const mm = Number.parseFloat(maintenanceMargin) / 100;
    if (!ep || !lev || lev <= 0) return;
    const marginUsed = ep / lev;
    // Simplified liquidation formula
    const liqPrice =
      posType === "long" ? ep * (1 - 1 / lev + mm) : ep * (1 + 1 / lev - mm);
    const distPct = Math.abs((liqPrice - ep) / ep) * 100;
    setResult({ liqPrice, distPct, marginUsed });
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Liquidation Price Calculator
        </h3>
        <p className="text-sm text-gray-500">
          Calculate the exact price where your position gets liquidated.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Entry Price ($)</Label>
          <Input
            data-ocid="liquidation.entry.input"
            type="number"
            placeholder="e.g. 45000"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Leverage (x)</Label>
          <Input
            data-ocid="liquidation.leverage.input"
            type="number"
            placeholder="e.g. 10"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">
            Maintenance Margin (%)
          </Label>
          <Input
            data-ocid="liquidation.margin.input"
            type="number"
            placeholder="0.5"
            value={maintenanceMargin}
            onChange={(e) => setMaintenanceMargin(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Position Type</Label>
          <div className="flex gap-2">
            {(["long", "short"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPosType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all capitalize ${posType === t ? (t === "long" ? "bg-sky-500 text-white border-sky-500" : "bg-red-500 text-white border-red-500") : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button
        data-ocid="liquidation.calculate.button"
        onClick={calculate}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold w-full sm:w-auto"
      >
        Calculate Liquidation Price
      </Button>
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl p-4 bg-red-50 border border-red-200">
            <p className="text-xs text-gray-500 mb-1">Liquidation Price</p>
            <p className="text-2xl font-black text-red-600">
              $
              {result.liqPrice.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="rounded-xl p-4 bg-orange-50 border border-orange-200">
            <p className="text-xs text-gray-500 mb-1">Distance to Liq.</p>
            <p className="text-2xl font-black text-orange-600">
              {result.distPct.toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl p-4 bg-sky-50 border border-sky-200">
            <p className="text-xs text-gray-500 mb-1">Margin Per Unit</p>
            <p className="text-2xl font-black text-sky-600">
              ${result.marginUsed.toFixed(4)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Fee Impact Calculator ─────────────────────────────────────────────────────
function FeeImpactCalculator() {
  const [tradeSize, setTradeSize] = useState("");
  const [entryFee, setEntryFee] = useState("0.1");
  const [exitFee, setExitFee] = useState("0.1");
  const [profitPct, setProfitPct] = useState("");
  const [result, setResult] = useState<{
    grossProfit: number;
    totalFees: number;
    netProfit: number;
    feeImpact: number;
  } | null>(null);

  const calculate = () => {
    const size = Number.parseFloat(tradeSize);
    const ef = Number.parseFloat(entryFee) / 100;
    const xf = Number.parseFloat(exitFee) / 100;
    const pp = Number.parseFloat(profitPct) / 100;
    if (!size || Number.isNaN(pp)) return;
    const grossProfit = size * pp;
    const entryFeeAmt = size * ef;
    const exitFeeAmt = size * (1 + pp) * xf;
    const totalFees = entryFeeAmt + exitFeeAmt;
    const netProfit = grossProfit - totalFees;
    const feeImpact = (totalFees / Math.abs(grossProfit || 1)) * 100;
    setResult({ grossProfit, totalFees, netProfit, feeImpact });
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Fee Impact Calculator
        </h3>
        <p className="text-sm text-gray-500">
          Understand how trading fees eat into your profits.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Trade Size ($)</Label>
          <Input
            data-ocid="fee.size.input"
            type="number"
            placeholder="e.g. 1000"
            value={tradeSize}
            onChange={(e) => setTradeSize(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Expected Profit (%)</Label>
          <Input
            data-ocid="fee.profit.input"
            type="number"
            placeholder="e.g. 5"
            value={profitPct}
            onChange={(e) => setProfitPct(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Entry Fee (%)</Label>
          <Input
            data-ocid="fee.entry.input"
            type="number"
            step="0.01"
            placeholder="0.1"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Exit Fee (%)</Label>
          <Input
            data-ocid="fee.exit.input"
            type="number"
            step="0.01"
            placeholder="0.1"
            value={exitFee}
            onChange={(e) => setExitFee(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      <Button
        data-ocid="fee.calculate.button"
        onClick={calculate}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold w-full sm:w-auto"
      >
        Calculate Fee Impact
      </Button>
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div
            className={`rounded-xl p-4 border ${result.grossProfit >= 0 ? "bg-sky-50 border-sky-200" : "bg-red-50 border-red-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">Gross Profit</p>
            <p
              className={`text-xl font-black ${result.grossProfit >= 0 ? "text-sky-600" : "text-red-600"}`}
            >
              {result.grossProfit >= 0 ? "+" : ""}$
              {result.grossProfit.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl p-4 bg-red-50 border border-red-200">
            <p className="text-xs text-gray-500 mb-1">Total Fees</p>
            <p className="text-xl font-black text-red-600">
              -${result.totalFees.toFixed(2)}
            </p>
          </div>
          <div
            className={`rounded-xl p-4 border ${result.netProfit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
          >
            <p className="text-xs text-gray-500 mb-1">Net Profit</p>
            <p
              className={`text-xl font-black ${result.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {result.netProfit >= 0 ? "+" : ""}${result.netProfit.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl p-4 bg-amber-50 border border-amber-200">
            <p className="text-xs text-gray-500 mb-1">Fee Impact</p>
            <p className="text-xl font-black text-amber-600">
              {result.feeImpact.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Compound Returns Tool ─────────────────────────────────────────────────────
function CompoundReturnsTool() {
  const [initial, setInitial] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [months, setMonths] = useState("12");
  const [rows, setRows] = useState<
    { month: number; value: number; gain: number }[]
  >([]);

  const calculate = () => {
    const init = Number.parseFloat(initial);
    const rate = Number.parseFloat(monthlyRate) / 100;
    const m = Number.parseInt(months, 10);
    if (!init || Number.isNaN(rate) || !m || m > 120) return;
    const result: { month: number; value: number; gain: number }[] = [];
    let val = init;
    for (let i = 1; i <= m; i++) {
      val = val * (1 + rate);
      result.push({ month: i, value: val, gain: val - init });
    }
    setRows(result);
  };

  const finalValue = rows[rows.length - 1]?.value ?? 0;
  const totalGain = finalValue - Number.parseFloat(initial || "0");
  const totalReturn =
    Number.parseFloat(initial) > 0
      ? (totalGain / Number.parseFloat(initial)) * 100
      : 0;

  return (
    <div className="space-y-4 p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Compound Returns
        </h3>
        <p className="text-sm text-gray-500">
          Visualize how your investment grows with monthly compounding.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">
            Initial Investment ($)
          </Label>
          <Input
            data-ocid="compound-returns.initial.input"
            type="number"
            placeholder="e.g. 1000"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Monthly Return (%)</Label>
          <Input
            data-ocid="compound-returns.rate.input"
            type="number"
            step="0.1"
            placeholder="e.g. 3"
            value={monthlyRate}
            onChange={(e) => setMonthlyRate(e.target.value)}
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Months (max 120)</Label>
          <Input
            data-ocid="compound-returns.months.input"
            type="number"
            placeholder="12"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="border-gray-200"
          />
        </div>
      </div>
      <Button
        data-ocid="compound-returns.calculate.button"
        onClick={calculate}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold w-full sm:w-auto"
      >
        Calculate Growth
      </Button>
      {rows.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl p-4 bg-sky-50 border border-sky-200">
              <p className="text-xs text-gray-500 mb-1">Final Value</p>
              <p className="text-xl font-black text-sky-600">
                $
                {finalValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-gray-500 mb-1">Total Gain</p>
              <p className="text-xl font-black text-emerald-600">
                +$
                {totalGain.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-xl p-4 bg-purple-50 border border-purple-200">
              <p className="text-xs text-gray-500 mb-1">Total Return</p>
              <p className="text-xl font-black text-purple-600">
                +{totalReturn.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="overflow-auto max-h-64 rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-500 font-semibold">
                    Month
                  </th>
                  <th className="text-right px-4 py-2 text-gray-500 font-semibold">
                    Portfolio Value
                  </th>
                  <th className="text-right px-4 py-2 text-gray-500 font-semibold">
                    Total Gain
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.month}
                    className="border-t border-gray-100 hover:bg-sky-50/30"
                  >
                    <td className="px-4 py-2 text-gray-700 font-medium">
                      Month {r.month}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-sky-700">
                      $
                      {r.value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-2 text-right text-emerald-600">
                      +$
                      {r.gain.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Trend Strength Meter ─────────────────────────────────────────────────────
function TrendStrengthTool() {
  const [coin, setCoin] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1h");
  const [strength, setStrength] = useState<number | null>(null);
  const [trend, setTrend] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const INTERVAL_MAP: Record<string, string> = {
    "1H": "1h",
    "4H": "4h",
    "1D": "1d",
  };

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const symbol = `${coin.toUpperCase()}USDT`;
      const interval = INTERVAL_MAP[timeframe] ?? timeframe;
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=50`,
      );
      if (!res.ok) throw new Error("API error");
      const data: Array<Array<string>> = await res.json();
      const closes = data.map((k) => Number.parseFloat(k[4]));
      if (closes.length < 20) throw new Error("Not enough data");

      // EMA slope (EMA9 vs EMA21 trend direction)
      const ema = (arr: number[], p: number) => {
        const k2 = 2 / (p + 1);
        return arr.reduce(
          (prev, v, i) => (i === 0 ? v : prev * (1 - k2) + v * k2),
          arr[0],
        );
      };
      const ema9 = ema(closes.slice(-20), 9);
      const ema21 = ema(closes.slice(-30), 21);
      const ema9_prev = ema(closes.slice(-25, -5), 9);
      const slopeScore = ((ema9 - ema9_prev) / ema9_prev) * 100;

      // Momentum: price vs 20 periods ago
      const momentum =
        ((closes[closes.length - 1] - closes[closes.length - 20]) /
          closes[closes.length - 20]) *
        100;

      // Combined strength 0-100
      const raw = Math.min(
        100,
        Math.max(0, 50 + slopeScore * 5 + momentum * 2),
      );
      const emaAbove = ema9 > ema21;

      setStrength(Math.round(raw));
      if (raw > 65)
        setTrend(emaAbove ? "Strong Uptrend 🚀" : "Strong Downtrend 🔴");
      else if (raw > 45)
        setTrend(emaAbove ? "Weak Uptrend 📈" : "Weak Downtrend 📉");
      else setTrend("Ranging / Neutral ↔");
    } catch {
      setError("Could not fetch data. Check coin symbol.");
    } finally {
      setLoading(false);
    }
  };

  const strengthColor =
    strength !== null
      ? strength > 65
        ? "text-emerald-600"
        : strength > 45
          ? "text-amber-600"
          : "text-red-500"
      : "text-gray-400";
  const barColor =
    strength !== null
      ? strength > 65
        ? "bg-emerald-500"
        : strength > 45
          ? "bg-amber-400"
          : "bg-red-500"
      : "bg-gray-200";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="block text-xs font-semibold text-gray-500 mb-1">
            Coin Symbol
          </p>
          <input
            data-ocid="trend-strength.input"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400"
            value={coin}
            onChange={(e) => setCoin(e.target.value.toUpperCase())}
            placeholder="BTC"
          />
        </div>
        <div>
          <p className="block text-xs font-semibold text-gray-500 mb-1">
            Timeframe
          </p>
          <div className="flex gap-1">
            {["1H", "4H", "1D"].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  timeframe === tf
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-sky-50"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        data-ocid="trend-strength.button"
        onClick={calculate}
        disabled={loading}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Trend"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {strength !== null && !error && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Trend Strength
            </span>
            <span className={`text-2xl font-black ${strengthColor}`}>
              {strength}/100
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className={`text-center font-bold text-lg ${strengthColor}`}>
            {trend}
          </p>
          <p className="text-xs text-gray-400 text-center">
            {coin}USDT · {timeframe} timeframe
          </p>
        </div>
      )}
    </div>
  );
}

// ── Advanced Profit Calculator ────────────────────────────────────────────────
function AdvancedProfitCalcTool() {
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [feePercent, setFeePercent] = useState("0.1");
  const [leverage, setLeverage] = useState("1");
  const [result, setResult] = useState<{
    gross: number;
    feeCost: number;
    net: number;
    roi: number;
    leveragedRoi: number;
  } | null>(null);

  const calculate = () => {
    const buy = Number.parseFloat(buyPrice);
    const sell = Number.parseFloat(sellPrice);
    const qty = Number.parseFloat(quantity);
    const fee = Number.parseFloat(feePercent) / 100;
    const lev = Number.parseFloat(leverage);
    if (
      [buy, sell, qty, fee, lev].some(Number.isNaN) ||
      buy <= 0 ||
      qty <= 0 ||
      lev <= 0
    )
      return;
    const gross = (sell - buy) * qty;
    const feeCost = (buy + sell) * qty * fee;
    const net = gross - feeCost;
    const roi = (net / (buy * qty)) * 100;
    const leveragedRoi = roi * lev;
    setResult({ gross, feeCost, net, roi, leveragedRoi });
  };

  const isProfit = result ? result.net >= 0 : null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Buy Price ($)",
            val: buyPrice,
            set: setBuyPrice,
            id: "adv-buy",
          },
          {
            label: "Sell Price ($)",
            val: sellPrice,
            set: setSellPrice,
            id: "adv-sell",
          },
          { label: "Quantity", val: quantity, set: setQuantity, id: "adv-qty" },
          {
            label: "Fee (%)",
            val: feePercent,
            set: setFeePercent,
            id: "adv-fee",
          },
          {
            label: "Leverage (1x = spot)",
            val: leverage,
            set: setLeverage,
            id: "adv-lev",
          },
        ].map(({ label, val, set, id }) => (
          <div key={id}>
            <p className="block text-xs font-semibold text-gray-500 mb-1">
              {label}
            </p>
            <input
              data-ocid={`adv-profit.${id}.input`}
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400"
              value={val}
              onChange={(e) => set(e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        data-ocid="adv-profit.button"
        onClick={calculate}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Calculate
      </button>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            {
              label: "Gross Profit",
              value: `$${result.gross.toFixed(2)}`,
              color: result.gross >= 0 ? "text-emerald-600" : "text-red-500",
            },
            {
              label: "Fee Cost",
              value: `$${result.feeCost.toFixed(2)}`,
              color: "text-amber-600",
            },
            {
              label: "Net Profit",
              value: `$${result.net.toFixed(2)}`,
              color: isProfit ? "text-emerald-600" : "text-red-500",
            },
            {
              label: "ROI",
              value: `${result.roi.toFixed(2)}%`,
              color: isProfit ? "text-emerald-600" : "text-red-500",
            },
            {
              label: `Leveraged ROI (${leverage}x)`,
              value: `${result.leveragedRoi.toFixed(2)}%`,
              color: isProfit ? "text-sky-600" : "text-red-600",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-lg font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Market Session Overlap Timer ──────────────────────────────────────────────
function MarketSessionTimerTool() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const utcS = now.getUTCSeconds();
  const utcDecimal = utcH + utcM / 60;

  const sessions = [
    { name: "Tokyo", flag: "🇯🇵", start: 0, end: 9, color: "sky" },
    { name: "London", flag: "🇬🇧", start: 8, end: 17, color: "blue" },
    { name: "New York", flag: "🇺🇸", start: 13, end: 22, color: "violet" },
    { name: "Sydney", flag: "🇦🇺", start: 22, end: 32, color: "emerald" }, // 22-08 next day
  ];

  const isActive = (start: number, end: number) => {
    if (end > 24) {
      // crosses midnight
      return utcDecimal >= start || utcDecimal < end - 24;
    }
    return utcDecimal >= start && utcDecimal < end;
  };

  const secsUntilNext = (start: number) => {
    const startSec = start * 3600;
    const nowSec = utcH * 3600 + utcM * 60 + utcS;
    const diff =
      startSec > nowSec ? startSec - nowSec : 86400 - nowSec + startSec;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const activeSessions = sessions.filter((s) => isActive(s.start, s.end));
  const isOverlap = isActive(8, 9) || isActive(13, 17); // Tokyo/London or London/NY

  const colorMap: Record<string, string> = {
    sky: "bg-sky-50 border-sky-300 text-sky-700",
    blue: "bg-blue-50 border-blue-300 text-blue-700",
    violet: "bg-violet-50 border-violet-300 text-violet-700",
    emerald: "bg-emerald-50 border-emerald-300 text-emerald-700",
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-4 text-white text-center">
        <p className="text-xs font-semibold opacity-80 mb-1">
          Current UTC Time
        </p>
        <p className="text-3xl font-black tabular-nums">
          {String(utcH).padStart(2, "0")}:{String(utcM).padStart(2, "0")}:
          {String(utcS).padStart(2, "0")}
        </p>
      </div>
      {isOverlap && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <div>
            <p className="text-sm font-bold text-amber-800">
              Best Trading Time!
            </p>
            <p className="text-xs text-amber-600">
              Session overlap — highest liquidity & volatility
            </p>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {sessions.map((s) => {
          const active = isActive(s.start, s.end);
          const endHour = s.end > 24 ? s.end - 24 : s.end;
          return (
            <div
              key={s.name}
              className={`rounded-xl border p-3 flex items-center justify-between transition-all ${
                active
                  ? `${colorMap[s.color]} shadow-sm`
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.flag}</span>
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-xs opacity-70">
                    {String(s.start).padStart(2, "0")}:00 –{" "}
                    {String(endHour).padStart(2, "0")}:00 UTC
                  </p>
                </div>
              </div>
              {active ? (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/60">
                  ● OPEN
                </span>
              ) : (
                <span className="text-xs font-medium opacity-60">
                  Opens in {secsUntilNext(s.start % 24)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {activeSessions.length === 0 && (
        <p className="text-center text-xs text-gray-400">
          No major sessions open · Low volatility period
        </p>
      )}
    </div>
  );
}
