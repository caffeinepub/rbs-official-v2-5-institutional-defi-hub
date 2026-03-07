import { MarketHeatmap } from "@/components/MarketHeatmap";
import { PageHead } from "@/components/PageHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCryptoNews } from "@/hooks/useCryptoNews";
import { useLivePrice } from "@/hooks/useLivePrice";
import { useMarketPulse } from "@/hooks/useMarketPulse";
import { usePortfolioTracker } from "@/hooks/usePortfolioTracker";
import { useTokenAdvancedAnalytics } from "@/hooks/useTokenAdvancedAnalytics";
import { useWatchlist } from "@/hooks/useWatchlist";
import {
  Activity,
  AlertCircle,
  BarChart2,
  DollarSign,
  Globe,
  Newspaper,
  PieChart as PieChartIcon,
  RefreshCw,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const ASSET_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  BNB: "#F3BA2F",
  SOL: "#9945FF",
  XRP: "#346AA9",
};

function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

function formatLargeNumber(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

// ─── Live Prices Tab ──────────────────────────────────────────────────────────
function LivePricesTab() {
  const { data: prices, isLoading, error, dataUpdatedAt } = useLivePrice();
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (dataUpdatedAt) setLastUpdate(new Date(dataUpdatedAt));
  }, [dataUpdatedAt]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: isInWatchlist is stable helper derived from watchlist
  const sortedPrices = React.useMemo(() => {
    if (!prices) return [];
    return [...prices].sort((a, b) => {
      const aW = isInWatchlist(a.symbol) ? 0 : 1;
      const bW = isInWatchlist(b.symbol) ? 0 : 1;
      return aW - bW;
    });
  }, [prices, watchlist]);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(["d1", "d2", "d3", "d4", "d5"] as const).map((sk) => (
          <Skeleton key={sk} className="h-40 rounded-xl" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex items-center gap-2 text-red-400 p-4">
        <AlertCircle size={18} /> Failed to load live prices. Please try again.
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <RefreshCw size={12} className="animate-spin" /> Auto-refreshes every
          7s
        </span>
        <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPrices.map((asset) => {
          const inWatchlist = isInWatchlist(asset.symbol);
          const isPositive = asset.change24h >= 0;
          return (
            <div
              key={asset.symbol}
              className={`relative rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default
                ${
                  inWatchlist
                    ? "border-[var(--rbs-gold)] bg-[var(--rbs-gold)]/5 shadow-[0_0_12px_rgba(184,134,11,0.2)]"
                    : "border-gray-200 bg-white"
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-gray-900"
                    style={{
                      backgroundColor: ASSET_COLORS[asset.symbol] || "#888",
                    }}
                  >
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {asset.name}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleWatchlist(asset.symbol)}
                  className="p-1 rounded-full hover:bg-zinc-700/50 transition-colors"
                  title={
                    inWatchlist ? "Remove from watchlist" : "Add to watchlist"
                  }
                >
                  <Star
                    size={16}
                    className={
                      inWatchlist
                        ? "fill-[var(--rbs-gold)] text-[var(--rbs-gold)]"
                        : "text-gray-500"
                    }
                  />
                </button>
              </div>

              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatPrice(asset.price)}
              </div>

              <div
                className={`flex items-center gap-1 text-sm font-semibold mb-3 ${isPositive ? "text-emerald-400" : "text-red-400"}`}
              >
                {isPositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {isPositive ? "+" : ""}
                {asset.change24h.toFixed(2)}% (24h)
              </div>

              {asset.marketCap > 0 && (
                <div className="text-xs text-muted-foreground">
                  MCap: {formatLargeNumber(asset.marketCap)}
                </div>
              )}
              {asset.volume24h > 0 && (
                <div className="text-xs text-muted-foreground">
                  Vol: {formatLargeNumber(asset.volume24h)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Market Heatmap */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-[var(--rbs-gold)] mb-3 flex items-center gap-2">
          <Activity size={14} /> Market Heatmap — 24h Performance
        </h3>
        {prices && prices.length > 0 && (
          <MarketHeatmap
            data={prices.map((p) => ({
              symbol: p.symbol,
              price: p.price,
              change24h: p.change24h,
              volume24h: p.volume24h,
            }))}
          />
        )}
      </div>
    </div>
  );
}

// ─── Market Pulse Tab ─────────────────────────────────────────────────────────
function MarketPulseTab() {
  const { data: pulse, isLoading, error } = useMarketPulse();

  if (isLoading)
    return (
      <div className="space-y-4">
        {(["mp1", "mp2", "mp3", "mp4"] as const).map((sk) => (
          <Skeleton key={sk} className="h-24 rounded-xl" />
        ))}
      </div>
    );

  if (error || !pulse)
    return (
      <div className="flex items-center gap-2 text-red-400 p-4">
        <AlertCircle size={18} /> Failed to load market pulse data.
      </div>
    );

  const statusColor =
    pulse.status === "Bullish"
      ? "text-emerald-400"
      : pulse.status === "Bearish"
        ? "text-red-400"
        : "text-yellow-400";
  const statusBg =
    pulse.status === "Bullish"
      ? "bg-emerald-500/10 border-emerald-500/30"
      : pulse.status === "Bearish"
        ? "bg-red-500/10 border-red-500/30"
        : "bg-yellow-500/10 border-yellow-500/30";

  // Use the correct field names from MarketPulseData
  const currentPrice = pulse.price ?? 0;
  const macdValue = pulse.macdLine ?? 0;
  const macdSignalValue = pulse.signalLine ?? 0;
  const macdHistValue = pulse.macdHistogram ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <RefreshCw size={12} className="animate-spin" /> Auto-refreshes every
          20s
        </span>
      </div>

      {/* Overall Status */}
      <div
        className={`rounded-xl p-5 border ${statusBg} flex items-center justify-between`}
      >
        <div>
          <div className="text-xs text-muted-foreground mb-1">
            Overall Market Status
          </div>
          <div
            className={`text-3xl font-bold ${statusColor} flex items-center gap-2`}
          >
            <span
              className={`inline-block w-3 h-3 rounded-full animate-pulse ${pulse.status === "Bullish" ? "bg-emerald-400" : pulse.status === "Bearish" ? "bg-red-400" : "bg-yellow-400"}`}
            />
            {pulse.status}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">BTC Price</div>
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(currentPrice)}
          </div>
          <div
            className={`text-sm ${(pulse.change24h ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {(pulse.change24h ?? 0) >= 0 ? "+" : ""}
            {(pulse.change24h ?? 0).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* RSI */}
        <div className="rounded-xl p-4 border border-gray-200 bg-white">
          <div className="text-xs text-muted-foreground mb-2">RSI (14)</div>
          <div
            className={`text-2xl font-bold mb-2 ${(pulse.rsi ?? 50) > 70 ? "text-red-400" : (pulse.rsi ?? 50) < 30 ? "text-emerald-400" : "text-yellow-400"}`}
          >
            {(pulse.rsi ?? 50).toFixed(1)}
          </div>
          <Progress value={pulse.rsi ?? 50} className="h-2 mb-1" />
          <div className="text-xs text-muted-foreground">
            {(pulse.rsi ?? 50) > 70
              ? "Overbought"
              : (pulse.rsi ?? 50) < 30
                ? "Oversold"
                : "Neutral Zone"}
          </div>
        </div>

        {/* MACD */}
        <div className="rounded-xl p-4 border border-gray-200 bg-white">
          <div className="text-xs text-muted-foreground mb-2">MACD</div>
          <div
            className={`text-2xl font-bold mb-2 ${macdValue >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {macdValue.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground">
            Signal: {macdSignalValue.toFixed(4)}
          </div>
          <div
            className={`text-xs mt-1 font-semibold ${macdHistValue >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {macdHistValue >= 0 ? "▲ Bullish Crossover" : "▼ Bearish Crossover"}
          </div>
        </div>

        {/* Histogram */}
        <div className="rounded-xl p-4 border border-gray-200 bg-white">
          <div className="text-xs text-muted-foreground mb-2">
            MACD Histogram
          </div>
          <div
            className={`text-2xl font-bold mb-2 ${macdHistValue >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {macdHistValue.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground">
            Momentum: {macdHistValue >= 0 ? "Positive" : "Negative"}
          </div>
          <div
            className={`text-xs mt-1 font-semibold ${macdHistValue >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {macdHistValue >= 0 ? "Bullish momentum" : "Bearish momentum"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Crypto News Tab ──────────────────────────────────────────────────────────
function CryptoNewsTab() {
  const { data: news, isLoading, error } = useCryptoNews();

  if (isLoading)
    return (
      <div className="space-y-3">
        {(["n1", "n2", "n3", "n4", "n5"] as const).map((sk) => (
          <Skeleton key={sk} className="h-28 rounded-xl" />
        ))}
      </div>
    );

  if (error || !news)
    return (
      <div className="flex items-center gap-2 text-red-400 p-4">
        <AlertCircle size={18} /> Failed to load crypto news.
      </div>
    );

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "positive")
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (sentiment === "negative")
      return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-zinc-700/40 text-gray-400 border-zinc-600/30";
  };

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
      {news.map((article) => (
        <a
          key={article.url ?? article.title}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl p-4 border border-gray-200 bg-white hover:border-[var(--rbs-gold)]/40 hover:bg-gray-50 transition-all duration-200 hover:scale-[1.01]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                {article.title}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {article.source}
                </span>
                {article.currencies?.slice(0, 3).map((c) => (
                  <Badge
                    key={c}
                    variant="outline"
                    className="text-xs px-1.5 py-0 border-zinc-600 text-gray-400"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge
              className={`text-xs shrink-0 border ${getSentimentColor(article.sentiment ?? "neutral")}`}
            >
              {article.sentiment ?? "neutral"}
            </Badge>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Token Analytics Tab ──────────────────────────────────────────────────────
function TokenAnalyticsTab() {
  const [searchSymbol, setSearchSymbol] = useState("");
  const [activeSymbol, setActiveSymbol] = useState("");
  const {
    data: analytics,
    isLoading,
    error,
  } = useTokenAdvancedAnalytics(activeSymbol);

  const handleSearch = () => {
    if (searchSymbol.trim()) setActiveSymbol(searchSymbol.trim().toLowerCase());
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-emerald-400";
    if (risk === "High") return "text-red-400";
    return "text-yellow-400";
  };

  const getTrendColor = (trend: string) => {
    if (trend === "Bullish" || trend === "Strong Buy")
      return "text-emerald-400";
    if (trend === "Bearish" || trend === "Strong Sell") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter token symbol (e.g. bitcoin, ethereum)"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
        />
        <Button
          onClick={handleSearch}
          className="bg-[var(--rbs-gold)] text-black hover:bg-[var(--rbs-gold)]/80 shrink-0"
        >
          <Search size={16} />
        </Button>
      </div>

      {!activeSymbol && (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart2 size={40} className="mx-auto mb-3 opacity-30" />
          <p>Enter a token symbol to view advanced analytics</p>
          <p className="text-xs mt-1">
            Try: bitcoin, ethereum, solana, binancecoin
          </p>
        </div>
      )}

      {isLoading && activeSymbol && (
        <div className="space-y-3">
          {(["an1", "an2", "an3", "an4"] as const).map((sk) => (
            <Skeleton key={sk} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {error && activeSymbol && (
        <div className="flex items-center gap-2 text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
          <AlertCircle size={18} /> Failed to load analytics for "{activeSymbol}
          ". Check the symbol and try again.
        </div>
      )}

      {analytics && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--rbs-gold)] uppercase">
              {activeSymbol}
            </h3>
            <Badge
              className={`${getTrendColor(analytics.trendSignal ?? "")} bg-transparent border border-current`}
            >
              {analytics.trendSignal ?? "N/A"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="text-xs text-muted-foreground mb-1">
                Market Cap Rank
              </div>
              <div className="text-xl font-bold text-gray-900">
                #{analytics.marketCapRank ?? "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="text-xs text-muted-foreground mb-1">
                24h Volume
              </div>
              <div className="text-xl font-bold text-gray-900">
                {analytics.volume24h
                  ? formatLargeNumber(analytics.volume24h)
                  : "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="text-xs text-muted-foreground mb-1">ATH</div>
              <div className="text-xl font-bold text-gray-900">
                {analytics.ath ? formatPrice(analytics.ath) : "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="text-xs text-muted-foreground mb-1">RSI (14)</div>
              <div
                className={`text-xl font-bold ${(analytics.rsi ?? 50) > 70 ? "text-red-400" : (analytics.rsi ?? 50) < 30 ? "text-emerald-400" : "text-yellow-400"}`}
              >
                {analytics.rsi ? analytics.rsi.toFixed(1) : "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="text-xs text-muted-foreground mb-1">
                Volatility
              </div>
              <div className="text-xl font-bold text-gray-900">
                {analytics.volatilityScore
                  ? analytics.volatilityScore.toFixed(2)
                  : "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-3 border border-gray-200 bg-white">
              <div className="text-xs text-muted-foreground mb-1">
                Risk Level
              </div>
              <div
                className={`text-xl font-bold ${getRiskColor(analytics.riskLevel ?? "")}`}
              >
                {analytics.riskLevel ?? "N/A"}
              </div>
            </div>
          </div>

          {analytics.supplyRatio != null && (
            <div className="rounded-xl p-4 border border-gray-200 bg-white">
              <div className="text-xs text-muted-foreground mb-2">
                Supply Ratio
              </div>
              <Progress
                value={analytics.supplyRatio * 100}
                className="h-3 mb-1"
              />
              <div className="text-xs text-muted-foreground">
                {(analytics.supplyRatio * 100).toFixed(1)}% of max supply in
                circulation
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Global Markets Tab ───────────────────────────────────────────────────────
function GlobalMarketsTab() {
  const { data: prices } = useLivePrice();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const metrics = React.useMemo(() => {
    if (!prices || prices.length === 0) return null;
    const totalMarketCap = prices.reduce(
      (sum, p) => sum + (p.marketCap || 0),
      0,
    );
    const totalVolume = prices.reduce((sum, p) => sum + (p.volume24h || 0), 0);
    const btc = prices.find((p) => p.symbol === "BTC");
    const eth = prices.find((p) => p.symbol === "ETH");
    const btcDominance =
      totalMarketCap > 0 ? ((btc?.marketCap || 0) / totalMarketCap) * 100 : 0;
    const ethDominance =
      totalMarketCap > 0 ? ((eth?.marketCap || 0) / totalMarketCap) * 100 : 0;
    const avgChange =
      prices.reduce((sum, p) => sum + p.change24h, 0) / prices.length;
    const sentiment =
      avgChange > 1 ? "Greed" : avgChange < -1 ? "Fear" : "Neutral";
    return {
      totalMarketCap,
      totalVolume,
      btcDominance,
      ethDominance,
      btcChange: btc?.change24h || 0,
      ethChange: eth?.change24h || 0,
      sentiment,
      avgChange,
    };
  }, [prices]);

  const sentimentColor =
    metrics?.sentiment === "Greed"
      ? "text-emerald-400"
      : metrics?.sentiment === "Fear"
        ? "text-red-400"
        : "text-yellow-400";
  const sentimentBg =
    metrics?.sentiment === "Greed"
      ? "bg-emerald-500/10 border-emerald-500/30"
      : metrics?.sentiment === "Fear"
        ? "bg-red-500/10 border-red-500/30"
        : "bg-yellow-500/10 border-yellow-500/30";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Globe size={12} /> Global Crypto Market Overview
        </span>
        <span className="flex items-center gap-1">
          <RefreshCw
            size={12}
            className={countdown <= 5 ? "animate-spin" : ""}
          />
          Refreshes in {countdown}s
        </span>
      </div>

      {!metrics ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(["gm1", "gm2", "gm3", "gm4", "gm5", "gm6"] as const).map((sk) => (
            <Skeleton key={sk} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-xl p-4 border border-gray-200 bg-white hover:border-[var(--rbs-gold)]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={14} className="text-[var(--rbs-gold)]" />
              <span className="text-xs text-muted-foreground">
                Total Market Cap
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {formatLargeNumber(metrics.totalMarketCap)}
            </div>
            <div
              className={`text-xs mt-1 flex items-center gap-1 ${metrics.avgChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {metrics.avgChange >= 0 ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              {metrics.avgChange >= 0 ? "+" : ""}
              {metrics.avgChange.toFixed(2)}% avg
            </div>
          </div>

          <div className="rounded-xl p-4 border border-gray-200 bg-white hover:border-[var(--rbs-gold)]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-[var(--rbs-gold)]" />
              <span className="text-xs text-muted-foreground">
                24h Trading Volume
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {formatLargeNumber(metrics.totalVolume)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Across top 5 assets
            </div>
          </div>

          <div className="rounded-xl p-4 border border-gray-200 bg-white hover:border-[var(--rbs-gold)]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#F7931A]">₿</span>
              <span className="text-xs text-muted-foreground">
                BTC Dominance
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {metrics.btcDominance.toFixed(1)}%
            </div>
            <div
              className={`text-xs mt-1 flex items-center gap-1 ${metrics.btcChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {metrics.btcChange >= 0 ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              BTC {metrics.btcChange >= 0 ? "+" : ""}
              {metrics.btcChange.toFixed(2)}%
            </div>
          </div>

          <div className="rounded-xl p-4 border border-gray-200 bg-white hover:border-[var(--rbs-gold)]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#627EEA]">Ξ</span>
              <span className="text-xs text-muted-foreground">
                ETH Dominance
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {metrics.ethDominance.toFixed(1)}%
            </div>
            <div
              className={`text-xs mt-1 flex items-center gap-1 ${metrics.ethChange >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {metrics.ethChange >= 0 ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              ETH {metrics.ethChange >= 0 ? "+" : ""}
              {metrics.ethChange.toFixed(2)}%
            </div>
          </div>

          <div className="rounded-xl p-4 border border-gray-200 bg-white hover:border-[var(--rbs-gold)]/40 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-[var(--rbs-gold)]" />
              <span className="text-xs text-muted-foreground">
                Tracked Assets
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {prices?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Live price feeds
            </div>
          </div>

          <div
            className={`rounded-xl p-4 border ${sentimentBg} hover:scale-[1.02] transition-all`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-[var(--rbs-gold)]" />
              <span className="text-xs text-muted-foreground">
                Market Sentiment
              </span>
            </div>
            <div className={`text-xl font-bold ${sentimentColor}`}>
              {metrics.sentiment}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on 24h trends
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Portfolio Tracker Tab ────────────────────────────────────────────────────
function PortfolioTrackerTab() {
  const { data: prices } = useLivePrice();
  const livePriceData = React.useMemo(() => prices || [], [prices]);
  const portfolio = usePortfolioTracker(livePriceData);

  const totalValue = portfolio.getTotalValue();
  const pnl = portfolio.get24hPnL();
  const pnlPct = portfolio.get24hPnLPercentage();
  const allocation = portfolio.getAllocationData();
  const isPositive = pnl >= 0;

  const pieData = allocation
    .filter((a) => a.value > 0)
    .map((a) => ({
      name: a.symbol,
      value: Number.parseFloat(a.value.toFixed(2)),
      percentage: a.percentage,
    }));

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 border border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-[var(--rbs-gold)] mb-3 flex items-center gap-2">
          <DollarSign size={14} /> Enter Your Holdings
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {portfolio.assets.map((sym) => (
            <div key={sym} className="space-y-1">
              <label
                htmlFor={`portfolio-${sym}`}
                className="text-xs text-muted-foreground font-medium"
              >
                {sym}
              </label>
              <Input
                id={`portfolio-${sym}`}
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={portfolio.quantities[sym] || ""}
                onChange={(e) =>
                  portfolio.setAssetQuantity(
                    sym,
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                className="bg-zinc-800/60 border-gray-200 text-gray-900 text-sm h-8"
              />
              <div className="text-xs text-muted-foreground">
                ≈ {formatUSD(portfolio.getAssetValue(sym))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalValue === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <PieChartIcon size={36} className="mx-auto mb-2 opacity-30" />
          <p>Add quantities to track your portfolio</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl p-4 border border-[var(--rbs-gold)]/30 bg-[var(--rbs-gold)]/5">
              <div className="text-xs text-muted-foreground mb-1">
                Total Portfolio Value
              </div>
              <div className="text-2xl font-bold text-[var(--rbs-gold)]">
                {formatUSD(totalValue)}
              </div>
            </div>
            <div
              className={`rounded-xl p-4 border ${isPositive ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}
            >
              <div className="text-xs text-muted-foreground mb-1">24h P&L</div>
              <div
                className={`text-2xl font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}
              >
                {isPositive ? "+" : ""}
                {formatUSD(pnl)}
              </div>
            </div>
            <div
              className={`rounded-xl p-4 border ${isPositive ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}
            >
              <div className="text-xs text-muted-foreground mb-1">
                24h P&L %
              </div>
              <div
                className={`text-2xl font-bold flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}
              >
                {isPositive ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )}
                {isPositive ? "+" : ""}
                {pnlPct.toFixed(2)}%
              </div>
            </div>
          </div>

          {pieData.length > 0 && (
            <div className="rounded-xl p-4 border border-gray-200 bg-white">
              <h3 className="text-sm font-semibold text-[var(--rbs-gold)] mb-3 flex items-center gap-2">
                <PieChartIcon size={14} /> Portfolio Allocation
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={ASSET_COLORS[entry.name] || "#888"}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [
                      formatUSD(value),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "#a1a1aa", fontSize: "12px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {allocation.map((a) => (
                  <div key={a.symbol} className="text-center">
                    <div
                      className="text-xs font-bold"
                      style={{ color: ASSET_COLORS[a.symbol] }}
                    >
                      {a.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {a.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Coin type for Screener ───────────────────────────────────────────────────
interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  market_cap_rank: number;
}

type SortKey =
  | "market_cap"
  | "current_price"
  | "price_change_percentage_24h"
  | "total_volume";

// ─── Crypto Screener Tab ──────────────────────────────────────────────────────
function CryptoScreenerTab() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCoins = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
      );
      if (!res.ok) throw new Error("API error");
      const data: CoinData[] = await res.json();
      setCoins(data);
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, [fetchCoins]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCoins();
    setIsRefreshing(false);
  };

  const filtered = React.useMemo(() => {
    let list = [...coins];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      if (sortKey === "price_change_percentage_24h") {
        return (b[sortKey] ?? 0) - (a[sortKey] ?? 0);
      }
      return (b[sortKey] ?? 0) - (a[sortKey] ?? 0);
    });
    return list;
  }, [coins, search, sortKey]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            data-ocid="screener.search_input"
            type="text"
            placeholder="Search coin name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />
        </div>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger
            data-ocid="screener.sort.select"
            className="w-44 border-gray-200 bg-white text-gray-900 text-sm"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market_cap">Market Cap</SelectItem>
            <SelectItem value="current_price">Price</SelectItem>
            <SelectItem value="price_change_percentage_24h">
              24h Change
            </SelectItem>
            <SelectItem value="total_volume">Volume</SelectItem>
          </SelectContent>
        </Select>
        <Button
          data-ocid="screener.refresh.button"
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
        {lastUpdated && (
          <span className="text-xs text-gray-400 hidden sm:block">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {(
            ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"] as const
          ).map((sk) => (
            <div
              key={sk}
              className="h-12 rounded-lg bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="screener.table">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Coin</th>
                <th className="text-right py-3 px-2">Price</th>
                <th className="text-right py-3 px-2">24h %</th>
                <th className="text-right py-3 px-2 hidden md:table-cell">
                  Volume
                </th>
                <th className="text-right py-3 px-2 hidden lg:table-cell">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin, index) => {
                const isPositive = coin.price_change_percentage_24h >= 0;
                return (
                  <tr
                    key={coin.id}
                    data-ocid={`screener.row.item.${index + 1}`}
                    className="border-b border-gray-100 hover:bg-emerald-50 transition-colors"
                  >
                    <td className="py-3 px-2 text-gray-400 text-xs">
                      {coin.market_cap_rank}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <span className="font-semibold text-gray-900">
                          {coin.name}
                        </span>
                        <span className="text-gray-400 text-xs uppercase">
                          {coin.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-semibold text-gray-900">
                      {formatPrice(coin.current_price)}
                    </td>
                    <td
                      className={`py-3 px-2 text-right font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {isPositive ? "+" : ""}
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td className="py-3 px-2 text-right text-gray-500 text-xs hidden md:table-cell">
                      {formatLargeNumber(coin.total_volume)}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-500 text-xs hidden lg:table-cell">
                      {formatLargeNumber(coin.market_cap)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div
              className="text-center py-12 text-gray-400"
              data-ocid="screener.empty_state"
            >
              <Search size={32} className="mx-auto mb-2 opacity-40" />
              <p>No coins match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── On-chain Metrics Widget ──────────────────────────────────────────────────
function OnChainMetricsWidget() {
  const [metrics, setMetrics] = useState<{
    total_market_cap: { usd: number };
    market_cap_change_percentage_24h_usd: number;
    btc_dominance: number;
    eth_dominance: number;
    active_cryptocurrencies: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/global");
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setMetrics(json.data);
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMetrics();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["om1", "om2", "om3", "om4"] as const).map((sk) => (
          <div key={sk} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const totalMcap = metrics.total_market_cap?.usd ?? 0;
  const mcapChange = metrics.market_cap_change_percentage_24h_usd ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
          <Globe size={14} /> On-chain Global Metrics
        </h3>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            data-ocid="onchain.refresh.button"
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 border border-emerald-200 bg-emerald-50">
          <div className="text-xs text-gray-500 mb-1">Total Market Cap</div>
          <div className="text-lg font-bold text-emerald-700">
            {formatLargeNumber(totalMcap)}
          </div>
          <div
            className={`text-xs ${mcapChange >= 0 ? "text-emerald-600" : "text-red-500"} mt-1`}
          >
            {mcapChange >= 0 ? "+" : ""}
            {mcapChange.toFixed(2)}% (24h)
          </div>
        </div>
        <div className="rounded-xl p-4 border border-orange-200 bg-orange-50">
          <div className="text-xs text-gray-500 mb-1">BTC Dominance</div>
          <div className="text-lg font-bold text-orange-600">
            {metrics.btc_dominance?.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">of total market</div>
        </div>
        <div className="rounded-xl p-4 border border-blue-200 bg-blue-50">
          <div className="text-xs text-gray-500 mb-1">ETH Dominance</div>
          <div className="text-lg font-bold text-blue-600">
            {metrics.eth_dominance?.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">of total market</div>
        </div>
        <div className="rounded-xl p-4 border border-purple-200 bg-purple-50">
          <div className="text-xs text-gray-500 mb-1">Active Cryptos</div>
          <div className="text-lg font-bold text-purple-600">
            {(metrics.active_cryptocurrencies ?? 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">tracked tokens</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MarketDashboardPage() {
  const { watchlist } = useWatchlist();
  const watchlistCount = watchlist.length;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PageHead
        title="Market Dashboard | RBS Superior"
        description="Live crypto prices, market pulse, news, analytics, and portfolio tracker."
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800/50 py-10 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.08),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 size={28} className="text-[var(--rbs-gold)]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Market Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Real-time crypto intelligence — prices, pulse, news, analytics &
            portfolio tracking
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="live-prices">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl mb-6">
            <TabsTrigger
              value="live-prices"
              className="text-xs sm:text-sm data-[state=active]:bg-[var(--rbs-gold)] data-[state=active]:text-black"
            >
              Live Prices{" "}
              {watchlistCount > 0 && (
                <span className="ml-1.5 bg-[var(--rbs-gold)] text-black text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {watchlistCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="market-pulse"
              className="text-xs sm:text-sm data-[state=active]:bg-[var(--rbs-gold)] data-[state=active]:text-black"
            >
              Market Pulse
            </TabsTrigger>
            <TabsTrigger
              value="crypto-news"
              className="text-xs sm:text-sm data-[state=active]:bg-[var(--rbs-gold)] data-[state=active]:text-black"
            >
              Crypto News
            </TabsTrigger>
            <TabsTrigger
              value="token-analytics"
              className="text-xs sm:text-sm data-[state=active]:bg-[var(--rbs-gold)] data-[state=active]:text-black"
            >
              Token Analytics
            </TabsTrigger>
            <TabsTrigger
              value="global-markets"
              className="text-xs sm:text-sm data-[state=active]:bg-[var(--rbs-gold)] data-[state=active]:text-black"
            >
              Global Markets
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="text-xs sm:text-sm data-[state=active]:bg-[var(--rbs-gold)] data-[state=active]:text-black"
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="screener"
              data-ocid="dashboard.screener.tab"
              className="text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Screener
            </TabsTrigger>
          </TabsList>

          {/* On-chain metrics always visible */}
          <div className="mb-6">
            <OnChainMetricsWidget />
          </div>

          <TabsContent value="live-prices">
            <LivePricesTab />
          </TabsContent>
          <TabsContent value="market-pulse">
            <MarketPulseTab />
          </TabsContent>
          <TabsContent value="crypto-news">
            <CryptoNewsTab />
          </TabsContent>
          <TabsContent value="token-analytics">
            <TokenAnalyticsTab />
          </TabsContent>
          <TabsContent value="global-markets">
            <GlobalMarketsTab />
          </TabsContent>
          <TabsContent value="portfolio">
            <PortfolioTrackerTab />
          </TabsContent>
          <TabsContent value="screener">
            <CryptoScreenerTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
