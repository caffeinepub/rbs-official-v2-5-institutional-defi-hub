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
    title: "Market Pulse",
    description:
      "Real-time Bitcoin market sentiment tracker with live RSI and MACD indicators. Vote and see community consensus.",
    features: [
      "Live BTC RSI/MACD",
      "Community voting",
      "Sentiment gauge",
      "Auto-refresh 20s",
    ],
    path: "/market-pulse",
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
];

const QUICK_STATS = [
  {
    label: "Live Tools",
    value: "8+",
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
          className="pt-24 pb-16 px-4 text-center border-b border-gray-100"
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
                <BarChart2 className="w-4 h-4" /> Professional Trading Tools
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Your <span className="shimmer-turquoise">Trading Arsenal</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
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
        <section className="py-8 px-4 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                All Trading Tools
              </h2>
              <p className="text-gray-500">
                Click any tool to open it instantly
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
        <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
                <Calculator className="w-4 h-4" /> Interactive Calculators
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Professional Trading Calculators
              </h2>
              <p className="text-gray-500">
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
            </Tabs>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
