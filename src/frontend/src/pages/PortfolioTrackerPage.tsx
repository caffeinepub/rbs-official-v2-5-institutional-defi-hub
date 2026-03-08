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
import { useNavigate } from "@tanstack/react-router";
import { Coins, Copy, Plus, RefreshCw, Trash2, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Holding {
  id: string;
  coinId: string;
  symbol: string;
  displayName: string;
  amount: string;
  buyPrice: string;
}

interface LivePrice {
  usd: number;
  usd_24h_change: number;
}

const COIN_OPTIONS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon" },
];

const PORTFOLIO_KEY = "rbs_portfolio_holdings";

const RING_COLORS = [
  "#10b981",
  "#0ea5e9",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#a78bfa",
];

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);
  const frameRef = useRef<number>(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = start + (end - start) * eased;
      prevRef.current = next;
      setDisplayed(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return (
    <span>
      $
      {displayed.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

export default function PortfolioTrackerPage() {
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<Record<string, LivePrice>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Add form state
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIO_KEY);
      if (saved) {
        setHoldings(JSON.parse(saved));
      }
    } catch {
      /* silent */
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(holdings));
  }, [holdings]);

  const fetchPrices = useCallback(async (coinIds: string[]) => {
    if (coinIds.length === 0) return;
    setLoadingPrices(true);
    try {
      const ids = [...new Set(coinIds)].join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setPrices((prev) => ({ ...prev, ...data }));
      setLastUpdated(new Date());
    } catch {
      /* silent */
    } finally {
      setLoadingPrices(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch prices on holdings change
  useEffect(() => {
    const coinIds = holdings.map((h) => h.coinId);
    if (coinIds.length > 0) {
      fetchPrices(coinIds);
    }
  }, [holdings, fetchPrices]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPrices(holdings.map((h) => h.coinId));
  };

  const addHolding = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const coin = COIN_OPTIONS.find((c) => c.id === selectedCoin);
    if (!coin) return;

    const newHolding: Holding = {
      id: `${selectedCoin}_${Date.now()}`,
      coinId: selectedCoin,
      symbol: coin.symbol,
      displayName: coin.name,
      amount,
      buyPrice,
    };
    setHoldings((prev) => [...prev, newHolding]);
    setAmount("");
    setBuyPrice("");
    toast.success(`Added ${coin.symbol} to portfolio`);
  };

  const removeHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
    toast.success("Holding removed");
  };

  // Calculate totals
  const totalValue = holdings.reduce((sum, h) => {
    const price = prices[h.coinId]?.usd ?? 0;
    return sum + price * Number.parseFloat(h.amount || "0");
  }, 0);

  const totalCost = holdings.reduce((sum, h) => {
    if (!h.buyPrice) return sum;
    return (
      sum + Number.parseFloat(h.buyPrice) * Number.parseFloat(h.amount || "0")
    );
  }, 0);

  const totalPnl = totalCost > 0 ? totalValue - totalCost : null;
  const totalPnlPct =
    totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : null;

  const exportSummary = () => {
    const lines = [
      "RBS Portfolio Tracker Export",
      `Generated: ${new Date().toLocaleString()}`,
      `Total Value: $${totalValue.toFixed(2)}`,
      "",
      "Holdings:",
      ...holdings.map((h) => {
        const price = prices[h.coinId]?.usd ?? 0;
        const value = price * Number.parseFloat(h.amount || "0");
        return `  ${h.symbol}: ${h.amount} × $${price.toFixed(4)} = $${value.toFixed(2)}`;
      }),
    ];
    if (totalPnl !== null) {
      lines.push(
        `\nP&L: ${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)} (${totalPnlPct?.toFixed(2)}%)`,
      );
    }

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      toast.success("Portfolio summary copied to clipboard!");
    });
  };

  return (
    <>
      <PageHead
        title="Portfolio Tracker | RBS"
        description="Track your crypto portfolio value in real-time with live prices and % allocation breakdown."
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section
          className="pt-24 pb-12 px-4 text-center border-b border-gray-100"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #ecfdf5 60%, #d1fae5 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 text-sm font-medium mb-6">
                <Coins className="w-4 h-4" /> Portfolio Tracker
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Your <span className="shimmer-turquoise">Portfolio</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Track your crypto holdings in real-time. Live prices from
                CoinGecko. Saved locally in your browser.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Add holding form */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cyan-600" /> Add Holding
                </h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-gray-600 text-sm">Coin</Label>
                    <Select
                      value={selectedCoin}
                      onValueChange={setSelectedCoin}
                    >
                      <SelectTrigger
                        data-ocid="portfolio.coin.select"
                        className="border-gray-200"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COIN_OPTIONS.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.symbol} — {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-600 text-sm">Amount held</Label>
                    <Input
                      data-ocid="portfolio.amount.input"
                      type="number"
                      placeholder="e.g. 0.5"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-600 text-sm">
                      Buy price (optional, for P&L)
                    </Label>
                    <Input
                      data-ocid="portfolio.buyprice.input"
                      type="number"
                      placeholder="e.g. 40000"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      className="border-gray-200"
                    />
                  </div>
                  <Button
                    data-ocid="portfolio.add.primary_button"
                    onClick={addHolding}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add to Portfolio
                  </Button>
                </div>
              </motion.div>

              {/* Total Value Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl border border-cyan-200 p-6"
              >
                <div className="text-sm text-gray-500 mb-1">
                  Total Portfolio Value
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  <AnimatedNumber value={totalValue} />
                </div>
                {totalPnl !== null && (
                  <div
                    className={`mt-2 text-sm font-semibold ${totalPnl >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} (
                    {totalPnlPct?.toFixed(2)}% overall P&L)
                  </div>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {lastUpdated && (
                      <span className="text-xs text-gray-400">
                        {lastUpdated.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <Button
                    data-ocid="portfolio.refresh.button"
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={
                      refreshing || loadingPrices || holdings.length === 0
                    }
                    className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 ml-auto"
                  >
                    <RefreshCw
                      className={`w-3 h-3 mr-1 ${refreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              </motion.div>

              {/* Export */}
              {holdings.length > 0 && (
                <Button
                  data-ocid="portfolio.export.secondary_button"
                  onClick={exportSummary}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 mr-2" /> Export Summary
                </Button>
              )}
            </div>

            {/* Right: Holdings table + allocation */}
            <div className="lg:col-span-2 space-y-6">
              {/* Holdings table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Holdings</h2>
                  {loadingPrices && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Updating...
                    </span>
                  )}
                </div>

                {holdings.length === 0 ? (
                  <div
                    className="py-16 text-center text-gray-400"
                    data-ocid="portfolio.holdings.empty_state"
                  >
                    <Coins className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="font-medium">No holdings yet</p>
                    <p className="text-sm">
                      Add a coin using the form on the left
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table
                      className="w-full text-sm"
                      data-ocid="portfolio.holdings.table"
                    >
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                          <th className="text-left py-2 px-4">Coin</th>
                          <th className="text-right py-2 px-4">Amount</th>
                          <th className="text-right py-2 px-4">Price</th>
                          <th className="text-right py-2 px-4">Value</th>
                          <th className="text-right py-2 px-4">%</th>
                          {holdings.some((h) => h.buyPrice) && (
                            <th className="text-right py-2 px-4 hidden sm:table-cell">
                              P&L
                            </th>
                          )}
                          <th className="py-2 px-4" />
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {holdings.map((h, i) => {
                            const price = prices[h.coinId]?.usd ?? 0;
                            const value =
                              price * Number.parseFloat(h.amount || "0");
                            const pct =
                              totalValue > 0 ? (value / totalValue) * 100 : 0;
                            const change24h =
                              prices[h.coinId]?.usd_24h_change ?? 0;
                            let pnlPct: number | null = null;
                            if (
                              h.buyPrice &&
                              Number.parseFloat(h.buyPrice) > 0
                            ) {
                              pnlPct =
                                ((price - Number.parseFloat(h.buyPrice)) /
                                  Number.parseFloat(h.buyPrice)) *
                                100;
                            }

                            return (
                              <motion.tr
                                key={h.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: i * 0.04 }}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                data-ocid={`portfolio.holding.item.${i + 1}`}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-bold text-gray-900">
                                    {h.symbol}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {h.displayName}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-gray-700">
                                  {h.amount}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="font-mono text-gray-900">
                                    $
                                    {price > 0
                                      ? price.toLocaleString(undefined, {
                                          maximumFractionDigits: 4,
                                        })
                                      : "—"}
                                  </div>
                                  {change24h !== 0 && (
                                    <div
                                      className={`text-xs ${change24h >= 0 ? "text-emerald-600" : "text-red-500"}`}
                                    >
                                      {change24h >= 0 ? "▲" : "▼"}
                                      {Math.abs(change24h).toFixed(2)}%
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-gray-900">
                                  ${value.toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${Math.min(pct, 100)}%`,
                                          backgroundColor:
                                            RING_COLORS[i % RING_COLORS.length],
                                        }}
                                      />
                                    </div>
                                    <span className="text-gray-600 text-xs font-medium">
                                      {pct.toFixed(1)}%
                                    </span>
                                  </div>
                                </td>
                                {holdings.some((hh) => hh.buyPrice) && (
                                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                                    {pnlPct !== null ? (
                                      <span
                                        className={`text-sm font-semibold ${pnlPct >= 0 ? "text-emerald-600" : "text-red-600"}`}
                                      >
                                        {pnlPct >= 0 ? "+" : ""}
                                        {pnlPct.toFixed(2)}%
                                      </span>
                                    ) : (
                                      <span className="text-gray-300 text-xs">
                                        —
                                      </span>
                                    )}
                                  </td>
                                )}
                                <td className="py-3 px-4">
                                  <button
                                    type="button"
                                    data-ocid={`portfolio.remove.delete_button.${i + 1}`}
                                    onClick={() => removeHolding(h.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                    aria-label="Remove holding"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* CSS Allocation Ring visualization */}
              {holdings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                >
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-600" /> Allocation
                    Breakdown
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Ring chart using conic-gradient */}
                    <div className="flex-shrink-0">
                      {(() => {
                        let cumulativePct = 0;
                        const segments = holdings
                          .map((h, i) => {
                            const price = prices[h.coinId]?.usd ?? 0;
                            const value =
                              price * Number.parseFloat(h.amount || "0");
                            const pct =
                              totalValue > 0 ? (value / totalValue) * 100 : 0;
                            return {
                              pct,
                              color: RING_COLORS[i % RING_COLORS.length],
                            };
                          })
                          .filter((s) => s.pct > 0);

                        const conicStr = segments
                          .map((s) => {
                            const start = cumulativePct;
                            cumulativePct += s.pct;
                            return `${s.color} ${start.toFixed(1)}% ${cumulativePct.toFixed(1)}%`;
                          })
                          .join(", ");

                        return (
                          <div
                            className="w-24 h-24 rounded-full relative"
                            style={{
                              background: conicStr
                                ? `conic-gradient(${conicStr})`
                                : "#f3f4f6",
                            }}
                          >
                            <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">
                                {holdings.length}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Legend */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {holdings.map((h, i) => {
                        const price = prices[h.coinId]?.usd ?? 0;
                        const value =
                          price * Number.parseFloat(h.amount || "0");
                        const pct =
                          totalValue > 0 ? (value / totalValue) * 100 : 0;
                        return (
                          <div key={h.id} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:
                                  RING_COLORS[i % RING_COLORS.length],
                              }}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {h.symbol}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Trade Smarter
            </h2>
            <p className="text-gray-500 mb-6">
              Use G-MAN Intelligence for real-time signals on the assets you're
              holding.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="portfolio.market-intel.primary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold"
              >
                G-MAN Intel
              </Button>
              <Button
                data-ocid="portfolio.heatmap.secondary_button"
                onClick={() => navigate({ to: "/crypto-heatmap" })}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Crypto Heatmap
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
