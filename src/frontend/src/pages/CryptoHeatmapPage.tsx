import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Globe, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  image: string;
}

type FilterType = "all" | "top10" | "top25" | "top50";

function getCellColor(pct: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (pct < -5)
    return { bg: "bg-red-700", text: "text-white", border: "border-red-800" };
  if (pct < -2)
    return { bg: "bg-red-500", text: "text-white", border: "border-red-600" };
  if (pct < -0.5)
    return { bg: "bg-red-200", text: "text-red-900", border: "border-red-300" };
  if (pct <= 0.5)
    return {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    };
  if (pct <= 2)
    return {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
    };
  if (pct <= 5)
    return {
      bg: "bg-emerald-400",
      text: "text-white",
      border: "border-emerald-500",
    };
  return {
    bg: "bg-emerald-600",
    text: "text-white",
    border: "border-emerald-700",
  };
}

function getCellSize(rank: number): string {
  if (rank <= 5) return "col-span-2 row-span-2 min-h-[120px]";
  if (rank <= 10) return "col-span-2 min-h-[80px]";
  if (rank <= 20) return "col-span-1 min-h-[72px]";
  return "col-span-1 min-h-[60px]";
}

export default function CryptoHeatmapPage() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [hoveredCoin, setHoveredCoin] = useState<CoinData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCoins = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h",
      );
      if (!res.ok) throw new Error("API error");
      const data: CoinData[] = await res.json();
      setCoins(data);
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCoins();
  };

  const filterCount: Record<FilterType, number> = {
    all: 50,
    top10: 10,
    top25: 25,
    top50: 50,
  };

  const displayed = coins.slice(0, filterCount[filter]);

  const biggestGainer = displayed.reduce<CoinData | null>(
    (best, c) =>
      best === null ||
      c.price_change_percentage_24h > best.price_change_percentage_24h
        ? c
        : best,
    null,
  );
  const biggestLoser = displayed.reduce<CoinData | null>(
    (worst, c) =>
      worst === null ||
      c.price_change_percentage_24h < worst.price_change_percentage_24h
        ? c
        : worst,
    null,
  );
  const avgChange =
    displayed.length > 0
      ? displayed.reduce((sum, c) => sum + c.price_change_percentage_24h, 0) /
        displayed.length
      : 0;

  return (
    <>
      <PageHead
        title="Crypto Market Heatmap | RBS"
        description="Visual crypto market heatmap of top 50 coins colored by 24h price change. Spot trends at a glance."
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section
          className="pt-24 pb-12 px-4 text-center border-b border-gray-100"
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-200 bg-teal-50 text-teal-700 text-sm font-medium mb-6">
                <Globe className="w-4 h-4" /> Market Heatmap
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Crypto Market <span className="shimmer-turquoise">Heatmap</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Visual overview of the top 50 coins by market cap. Color-coded
                by 24h price change — green means up, red means down.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Summary stats */}
        {!loading && displayed.length > 0 && (
          <section className="py-6 px-4 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {biggestGainer && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Biggest Gainer
                      </div>
                      <div className="font-bold text-emerald-700 uppercase">
                        {biggestGainer.symbol}
                      </div>
                      <div className="text-sm text-emerald-600 font-semibold">
                        +{biggestGainer.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                )}
                {biggestLoser && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200"
                  >
                    <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Biggest Loser</div>
                      <div className="font-bold text-red-700 uppercase">
                        {biggestLoser.symbol}
                      </div>
                      <div className="text-sm text-red-600 font-semibold">
                        {biggestLoser.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${avgChange >= 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}
                >
                  <Globe
                    className={`w-5 h-5 flex-shrink-0 ${avgChange >= 0 ? "text-green-600" : "text-orange-600"}`}
                  />
                  <div>
                    <div className="text-xs text-gray-500">Market Average</div>
                    <div
                      className={`font-bold ${avgChange >= 0 ? "text-green-700" : "text-orange-700"}`}
                    >
                      {avgChange >= 0 ? "+" : ""}
                      {avgChange.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">24h change avg</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Heatmap section */}
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters & Refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                {(["all", "top10", "top25", "top50"] as FilterType[]).map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      data-ocid={`heatmap.filter.${f}.tab`}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        filter === f
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"
                      }`}
                    >
                      {f === "all" ? "All (50)" : f.replace("top", "Top ")}
                    </button>
                  ),
                )}
              </div>
              <div className="flex items-center gap-2">
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <Button
                  data-ocid="heatmap.refresh.button"
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing || loading}
                  className="border-teal-300 text-teal-700 hover:bg-teal-50"
                >
                  <RefreshCw
                    className={`w-3 h-3 mr-1 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Color legend */}
            <div className="flex flex-wrap gap-2 mb-6 text-xs">
              {[
                { label: "<-5%", bg: "bg-red-700", text: "text-white" },
                { label: "-2% to -5%", bg: "bg-red-500", text: "text-white" },
                {
                  label: "-0.5% to -2%",
                  bg: "bg-red-200",
                  text: "text-red-900",
                },
                { label: "±0.5%", bg: "bg-gray-100", text: "text-gray-700" },
                {
                  label: "+0.5% to +2%",
                  bg: "bg-emerald-100",
                  text: "text-emerald-800",
                },
                {
                  label: "+2% to +5%",
                  bg: "bg-emerald-400",
                  text: "text-white",
                },
                { label: ">+5%", bg: "bg-emerald-600", text: "text-white" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`px-2 py-1 rounded ${item.bg} ${item.text} border font-medium`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                {Array.from({ length: 32 }, (_, i) => `sk-${i}`).map((k) => (
                  <div
                    key={k}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 auto-rows-auto">
                {displayed.map((coin, i) => {
                  const colors = getCellColor(coin.price_change_percentage_24h);
                  const sizeClass = getCellSize(coin.market_cap_rank);

                  return (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.02 }}
                      className={`${sizeClass} ${colors.bg} ${colors.text} ${colors.border} border rounded-xl p-2 relative cursor-pointer overflow-hidden group transition-all duration-200 hover:scale-105 hover:shadow-lg hover:z-10 flex flex-col justify-center items-center text-center`}
                      onMouseEnter={(e) => {
                        setHoveredCoin(coin);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredCoin(null)}
                      onMouseMove={(e) =>
                        setTooltipPos({ x: e.clientX, y: e.clientY })
                      }
                      data-ocid={`heatmap.coin.item.${i + 1}`}
                    >
                      {/* Shimmer scan on hover */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-scan" />
                      </div>
                      <div className="font-bold text-xs sm:text-sm uppercase leading-tight">
                        {coin.symbol}
                      </div>
                      {coin.market_cap_rank <= 20 && (
                        <div className="text-xs opacity-75 font-mono leading-tight">
                          $
                          {coin.current_price < 1
                            ? coin.current_price.toFixed(4)
                            : coin.current_price > 1000
                              ? `${(coin.current_price / 1000).toFixed(1)}k`
                              : coin.current_price.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs font-bold leading-tight">
                        {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                        {coin.price_change_percentage_24h.toFixed(1)}%
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Tooltip */}
        {hoveredCoin && (
          <div
            className="fixed z-50 pointer-events-none bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[200px]"
            style={{
              left: Math.min(
                tooltipPos.x + 15,
                typeof window !== "undefined" ? window.innerWidth - 220 : 0,
              ),
              top: Math.min(
                tooltipPos.y - 10,
                typeof window !== "undefined" ? window.innerHeight - 180 : 0,
              ),
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={hoveredCoin.image}
                alt={hoveredCoin.name}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <div className="font-bold text-gray-900">
                  {hoveredCoin.name}
                </div>
                <div className="text-xs text-gray-400 uppercase">
                  {hoveredCoin.symbol}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Price</span>
                <span className="font-mono font-bold text-gray-900">
                  $
                  {hoveredCoin.current_price.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">24h Change</span>
                <span
                  className={`font-bold ${hoveredCoin.price_change_percentage_24h >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {hoveredCoin.price_change_percentage_24h >= 0 ? "+" : ""}
                  {hoveredCoin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Market Cap</span>
                <span className="font-semibold text-gray-700">
                  ${(hoveredCoin.market_cap / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Volume</span>
                <span className="font-semibold text-gray-700">
                  ${(hoveredCoin.total_volume / 1e6).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Dive Deeper Into Markets
            </h2>
            <p className="text-gray-500 mb-6">
              Use G-MAN Intelligence for real-time trading signals and advanced
              technical analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="heatmap.market-intel.primary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold"
              >
                G-MAN Intel
              </Button>
              <Button
                data-ocid="heatmap.trading-tools.secondary_button"
                onClick={() => navigate({ to: "/trading-tools" })}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Trading Tools
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
