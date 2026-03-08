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
    icon: Bell,
    title: "Alerts Center",
    description:
      "Set custom price and indicator alerts. Get notified when markets hit your target levels.",
    features: [
      "Custom thresholds",
      "Price & indicator alerts",
      "Toggle on/off",
      "Persistent storage",
    ],
    path: "/alerts",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    border: "border-red-200 hover:border-red-400",
  },
  {
    icon: TrendingUp,
    title: "Market Dashboard",
    description:
      "Comprehensive crypto market overview with real-time prices, volume, and analytics data for traders.",
    features: [
      "Live crypto prices",
      "Market analytics",
      "Volume tracking",
      "Auto-refresh 30s",
    ],
    path: "/dashboard",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-blue-200 hover:border-blue-400",
  },
  {
    icon: BarChart2,
    title: "Market Dashboard",
    description:
      "Comprehensive crypto market overview with live prices, volume data, and cross-asset analytics.",
    features: [
      "Top crypto prices",
      "Live volume data",
      "Market analytics",
      "Portfolio overview",
    ],
    path: "/dashboard",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    border: "border-purple-200 hover:border-purple-400",
  },
  {
    icon: AlertTriangle,
    title: "Fear & Greed Index",
    description:
      "Daily crypto Fear & Greed Index with 7-day history. The essential contrarian trading indicator.",
    features: [
      "0–100 index scale",
      "7-day history",
      "Zone interpretation",
      "Trading guidance",
    ],
    path: "/fear-greed",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    border: "border-orange-200 hover:border-orange-400",
    badge: "New",
  },
  {
    icon: Users,
    title: "Community Voting",
    description:
      "Vote on ecosystem proposals and governance decisions. Shape the future of the RBS protocol.",
    features: [
      "One vote per user",
      "Live vote counts",
      "Passcode-gated creation",
      "Global visibility",
    ],
    path: "/voting",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    border: "border-pink-200 hover:border-pink-400",
  },
  {
    icon: BookOpen,
    title: "Developer Blog",
    description:
      "In-depth technical updates and development insights from the RBS core team. Read the latest progress.",
    features: [
      "Technical articles",
      "Dev updates",
      "Ecosystem insights",
      "Published by team",
    ],
    path: "/blog",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    border: "border-indigo-200 hover:border-indigo-400",
  },
  {
    icon: Globe,
    title: "Crypto Heatmap",
    description:
      "Visual market heatmap of top 50 coins colored by 24h % change. Spot trends at a glance.",
    features: [
      "Top 50 coins",
      "Color by % change",
      "Market cap sizing",
      "Real-time refresh",
    ],
    path: "/crypto-heatmap",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    border: "border-teal-200 hover:border-teal-400",
    badge: "New",
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
  {
    icon: Coins,
    title: "Portfolio Tracker",
    description:
      "Track your crypto portfolio value in real-time with live prices and % allocation breakdown.",
    features: [
      "Live prices",
      "% allocation",
      "localStorage save",
      "P&L tracking",
    ],
    path: "/portfolio-tracker",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    border: "border-cyan-200 hover:border-cyan-400",
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
  ];

  const [amount, setAmount] = useState("1");
  const [fromCoin, setFromCoin] = useState("bitcoin");
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      const ids = COINS.map((c) => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const map: Record<string, number> = {};
      for (const c of COINS) {
        map[c.id] = data[c.id]?.usd ?? 0;
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

  const amt = Number.parseFloat(amount) || 0;
  const fromPrice = prices[fromCoin] ?? 0;
  const usdValue = amt * fromPrice;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">Amount</Label>
          <Input
            data-ocid="converter.amount.input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
            className="border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 text-sm">From Coin</Label>
          <Select value={fromCoin} onValueChange={setFromCoin}>
            <SelectTrigger
              data-ocid="converter.coin.select"
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
      {isLoading ? (
        <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
      ) : usdValue > 0 ? (
        <div className="space-y-2">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="text-sm text-gray-500 mb-1">USD Value</div>
            <div className="text-2xl font-bold text-emerald-700">
              $
              {usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COINS.filter((c) => c.id !== fromCoin).map((c) => (
              <div
                key={c.id}
                className="rounded-lg bg-gray-50 border border-gray-200 p-3"
              >
                <div className="text-xs text-gray-400">{c.label}</div>
                <div className="font-bold text-gray-900 text-sm">
                  {prices[c.id] > 0
                    ? (usdValue / prices[c.id]).toFixed(4)
                    : "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
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

        {/* ── NEW: Interactive Calculators Hub ─────────────────────────────── */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-7 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-3 sm:mb-4">
                <Calculator className="w-4 h-4" /> Interactive Calculators
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Professional Trading Calculators
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Powerful tools to fine-tune your trades and strategy
              </p>
            </div>

            <Tabs defaultValue="converter" className="w-full">
              <TabsList className="flex flex-wrap gap-1 h-auto bg-white border border-gray-200 p-1 rounded-xl mb-6">
                <TabsTrigger
                  value="converter"
                  data-ocid="calc.converter.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Converter
                </TabsTrigger>
                <TabsTrigger
                  value="position-size"
                  data-ocid="calc.position.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Position Size
                </TabsTrigger>
                <TabsTrigger
                  value="fibonacci"
                  data-ocid="calc.fib.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Fibonacci
                </TabsTrigger>
                <TabsTrigger
                  value="dca"
                  data-ocid="calc.dca.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  DCA / Compound
                </TabsTrigger>
                <TabsTrigger
                  value="volatility"
                  data-ocid="calc.volatility.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Volatility
                </TabsTrigger>
                <TabsTrigger
                  value="pip"
                  data-ocid="calc.pip.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  P&L Calculator
                </TabsTrigger>
                <TabsTrigger
                  value="leverage"
                  data-ocid="calc.leverage.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Leverage Risk
                </TabsTrigger>
                <TabsTrigger
                  value="breakeven"
                  data-ocid="calc.breakeven.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Breakeven
                </TabsTrigger>
                <TabsTrigger
                  value="ath"
                  data-ocid="calc.ath.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  ATH Distance
                </TabsTrigger>
                <TabsTrigger
                  value="pos-size-v2"
                  data-ocid="calc.pos-size-v2.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Pos. Size
                </TabsTrigger>
                <TabsTrigger
                  value="compound"
                  data-ocid="calc.compound.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Compound
                </TabsTrigger>
                <TabsTrigger
                  value="dca-buy"
                  data-ocid="calc.dca-buy.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  DCA Buy
                </TabsTrigger>
                <TabsTrigger
                  value="profit-loss"
                  data-ocid="calc.profit-loss.tab"
                  className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Profit/Loss
                </TabsTrigger>
              </TabsList>

              <TabsContent value="converter">
                <CryptoConverterTool />
              </TabsContent>
              <TabsContent value="position-size">
                <PositionSizeTool />
              </TabsContent>
              <TabsContent value="fibonacci">
                <FibonacciTool />
              </TabsContent>
              <TabsContent value="dca">
                <DCATool />
              </TabsContent>
              <TabsContent value="volatility">
                <VolatilityTool />
              </TabsContent>
              <TabsContent value="pip">
                <PipCalculatorTool />
              </TabsContent>
              <TabsContent value="leverage">
                <LeverageCalculatorTool />
              </TabsContent>
              <TabsContent value="breakeven">
                <BreakevenCalculatorTool />
              </TabsContent>
              <TabsContent value="ath">
                <ATHDistanceTool />
              </TabsContent>
              <TabsContent value="pos-size-v2">
                <PositionSizeCalcTool />
              </TabsContent>
              <TabsContent value="compound">
                <CompoundInterestTool />
              </TabsContent>
              <TabsContent value="dca-buy">
                <DCABuyTool />
              </TabsContent>
              <TabsContent value="profit-loss">
                <ProfitLossCalcTool />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 md:px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Trade Smarter?
            </h2>
            <p className="text-gray-500 mb-8">
              Start with G-MAN Intel for live trading signals, then track your
              sentiment with the Fear & Greed Index.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                data-ocid="trading-tools.gman.primary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold"
              >
                Open G-MAN Intel <Zap className="ml-2 w-4 h-4" />
              </Button>
              <Button
                data-ocid="trading-tools.fear-greed.secondary_button"
                onClick={() => navigate({ to: "/fear-greed" })}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Fear & Greed Index <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
