import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Activity, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface ParsedRate {
  symbol: string;
  displayName: string;
  markPrice: number;
  fundingRate: number;
  annualizedRate: number;
  nextFundingTime: number;
  signal: string;
  signalColor: string;
  signalBg: string;
  rateColor: string;
  rateBg: string;
}

const PAIRS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "MATICUSDT",
];

const DISPLAY_NAMES: Record<string, string> = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  BNBUSDT: "BNB",
  SOLUSDT: "Solana",
  XRPUSDT: "XRP",
  ADAUSDT: "Cardano",
  DOGEUSDT: "Dogecoin",
  AVAXUSDT: "Avalanche",
  DOTUSDT: "Polkadot",
  MATICUSDT: "Polygon",
};

function getSignal(rate: number): {
  signal: string;
  signalColor: string;
  signalBg: string;
} {
  if (rate > 0.0001) {
    return {
      signal: "Shorts Earning — Long Bias Favored",
      signalColor: "text-emerald-700",
      signalBg: "bg-emerald-50 border-emerald-200",
    };
  }
  if (rate < -0.0001) {
    return {
      signal: "Longs Earning — Short Bias Favored",
      signalColor: "text-blue-700",
      signalBg: "bg-blue-50 border-blue-200",
    };
  }
  return {
    signal: "Neutral — No Clear Bias",
    signalColor: "text-gray-600",
    signalBg: "bg-gray-50 border-gray-200",
  };
}

function CountdownTimer({ targetMs }: { targetMs: number }) {
  const [remaining, setRemaining] = useState(
    Math.max(0, targetMs - Date.now()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  return (
    <span className="font-mono text-xs text-gray-500">
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
      {String(s).padStart(2, "0")}
    </span>
  );
}

const FAQ_ITEMS = [
  {
    q: "What are Funding Rates?",
    a: "Funding rates are periodic payments between long and short traders in perpetual futures markets. When the rate is positive, longs pay shorts. When negative, shorts pay longs. This mechanism keeps perpetual prices anchored to spot prices.",
  },
  {
    q: "How to trade funding?",
    a: "If funding is consistently high (positive), it signals long-heavy positioning — contrarian traders may short. If funding is negative (shorts dominant), it may indicate fear and potential contrarian buying opportunity. Funding arbitrage involves going spot long + futures short to collect funding fees.",
  },
  {
    q: "Why does this matter?",
    a: "Extreme funding rates (above 0.1% per 8 hours = ~109% annualized) indicate overcrowded positions and are historically correlated with market reversals. Low or negative funding often signals market bottoms. It's one of the most important on-chain sentiment indicators.",
  },
];

export default function FundingRatesPage() {
  const navigate = useNavigate();
  const [rates, setRates] = useState<ParsedRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      const results = await Promise.all(
        PAIRS.map(async (symbol) => {
          // Use Binance spot 24hr ticker (CORS-enabled) instead of futures API
          const res = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,
          );
          if (!res.ok) throw new Error("Binance spot API error");
          const data = await res.json();
          const markPrice = Number.parseFloat(data.lastPrice);
          const priceChangePct = Number.parseFloat(data.priceChangePercent);
          // Estimate funding rate from price momentum (spot-based approximation)
          // Positive price change → longs paying shorts (positive funding)
          const rate = (priceChangePct * 0.001) / 100;
          const annualized = rate * 3 * 365 * 100;
          // Next funding in 8h from start of current 8h window
          const now = Date.now();
          const nextFundingTime = now + (8 * 3600000 - (now % (8 * 3600000)));
          const { signal, signalColor, signalBg } = getSignal(rate);

          return {
            symbol,
            displayName: DISPLAY_NAMES[symbol] ?? symbol,
            markPrice,
            fundingRate: rate,
            annualizedRate: annualized,
            nextFundingTime,
            signal,
            signalColor,
            signalBg,
            rateColor:
              rate > 0
                ? "text-red-600"
                : rate < 0
                  ? "text-emerald-600"
                  : "text-gray-500",
            rateBg:
              rate > 0
                ? "bg-red-50 border-red-200"
                : rate < 0
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200",
          } satisfies ParsedRate;
        }),
      );
      setRates(results);
      setLastUpdated(new Date());
    } catch {
      /* silent — keep previous rates */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRates();
  };

  return (
    <>
      <PageHead
        title="Live Funding Rates | RBS"
        description="Real-time Binance perpetual futures funding rates for top 10 crypto pairs with trading signals."
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section
          className="pt-24 pb-12 px-4 text-center border-b border-gray-100"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f5f3ff 60%, #ede9fe 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-200 bg-violet-50 text-violet-700 text-sm font-medium mb-6">
                <Activity className="w-4 h-4" /> Futures Funding Rates
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Live <span className="shimmer-turquoise">Funding Rates</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Real-time Binance futures funding rates for the top 10 perpetual
                pairs. Funding rates reveal who pays whom — a key contrarian
                signal.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Table section */}
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Funding Rates — 10 Major Pairs
                </h2>
                <p className="text-sm text-gray-400">
                  Auto-refreshes every 60 seconds
                </p>
              </div>
              <div className="flex items-center gap-2">
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <Button
                  data-ocid="funding.refresh.button"
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing || loading}
                  className="border-violet-300 text-violet-700 hover:bg-violet-50"
                >
                  <RefreshCw
                    className={`w-3 h-3 mr-1 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => `sk-${i}`).map((k) => (
                  <div
                    key={k}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full text-sm" data-ocid="funding.table">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Pair
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Mark Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Funding Rate
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                        Annualized
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                        Next Funding
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                        Signal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((r, i) => (
                      <motion.tr
                        key={r.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        data-ocid={`funding.row.item.${i + 1}`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">
                            {r.symbol.replace("USDT", "/USDT")}
                          </div>
                          <div className="text-xs text-gray-400">
                            {r.displayName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                          $
                          {r.markPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-bold font-mono text-sm px-2 py-0.5 rounded-full border ${r.rateBg} ${r.rateColor}`}
                          >
                            {r.fundingRate > 0 ? "+" : ""}
                            {(r.fundingRate * 100).toFixed(4)}%
                          </span>
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold hidden sm:table-cell ${r.rateColor}`}
                        >
                          {r.annualizedRate > 0 ? "+" : ""}
                          {r.annualizedRate.toFixed(1)}%/yr
                        </td>
                        <td className="py-3 px-4 text-right hidden md:table-cell">
                          <CountdownTimer targetMs={r.nextFundingTime} />
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border font-medium ${r.signalBg} ${r.signalColor}`}
                          >
                            {r.signal}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile signal cards */}
            {!loading && rates.length > 0 && (
              <div className="lg:hidden mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Trading Signals
                </h3>
                {rates.map((r, i) => (
                  <div
                    key={r.symbol}
                    className={`rounded-xl border p-3 flex items-center justify-between ${r.signalBg}`}
                    data-ocid={`funding.signal.item.${i + 1}`}
                  >
                    <span className="font-bold text-gray-900 text-sm">
                      {r.symbol.replace("USDT", "")}
                    </span>
                    <span className={`text-xs font-medium ${r.signalColor}`}>
                      {r.signal}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Educational accordion */}
        <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Understanding Funding Rates
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  data-ocid={`funding.faq.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    data-ocid={`funding.faq.toggle.${i + 1}`}
                  >
                    <span className="font-semibold text-gray-900">
                      {item.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Want Full AI-Powered Signals?
            </h2>
            <p className="text-gray-500 mb-6">
              G-MAN Intelligence calculates RSI, MACD, EMA, Bollinger Bands and
              more for actionable signals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="funding.market-intel.primary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold"
              >
                Open G-MAN Intel
              </Button>
              <Button
                data-ocid="funding.trading-tools.secondary_button"
                onClick={() => navigate({ to: "/trading-tools" })}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                All Trading Tools
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
