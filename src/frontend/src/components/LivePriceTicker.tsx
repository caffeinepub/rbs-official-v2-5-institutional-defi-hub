import { useCallback, useEffect, useRef, useState } from "react";

interface TickerCoin {
  symbol: string;
  price: number;
  change: number;
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

const DISPLAY_NAMES: Record<string, string> = {
  BTCUSDT: "BTC",
  ETHUSDT: "ETH",
  BNBUSDT: "BNB",
  SOLUSDT: "SOL",
  XRPUSDT: "XRP",
};

function formatPrice(price: number): string {
  if (price >= 1000)
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export default function LivePriceTicker() {
  const [coins, setCoins] = useState<TickerCoin[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const symbolsParam = encodeURIComponent(JSON.stringify(SYMBOLS));
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`,
      );
      if (!res.ok) throw new Error("Binance API error");
      const data = await res.json();
      const mapped: TickerCoin[] = data.map(
        (d: {
          symbol: string;
          lastPrice: string;
          priceChangePercent: string;
        }) => ({
          symbol: DISPLAY_NAMES[d.symbol] ?? d.symbol.replace("USDT", ""),
          price: Number.parseFloat(d.lastPrice),
          change: Number.parseFloat(d.priceChangePercent),
        }),
      );
      setCoins(mapped);
    } catch {
      // Silently ignore errors — ticker just won't show
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPrices]);

  if (coins.length === 0) return null;

  // Duplicate for seamless marquee
  const ticker = [...coins, ...coins];

  return (
    <div
      className="w-full h-8 overflow-hidden flex items-center border-b select-none"
      style={{
        background:
          "linear-gradient(90deg, #f0fdf4 0%, #f0f9ff 50%, #f0fdf4 100%)",
        borderColor: "rgba(16, 185, 129, 0.2)",
      }}
      data-ocid="live-ticker.section"
    >
      {/* LIVE badge */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-3 border-r z-10 h-full bg-white/80"
        style={{ borderColor: "rgba(16, 185, 129, 0.2)" }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"
          style={{ animation: "pulse 2s infinite" }}
        />
        <span className="text-emerald-700 font-bold text-[10px] tracking-widest uppercase">
          Live
        </span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden">
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{
            animation: "ticker-scroll 30s linear infinite",
            width: "max-content",
          }}
        >
          {ticker.map((coin, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: intentional duplicate for marquee
              key={i}
              className="inline-flex items-center gap-2 px-4 h-8"
            >
              <span className="font-bold text-gray-800 text-xs tracking-wide">
                {coin.symbol}
              </span>
              <span
                className="font-mono font-semibold text-xs"
                style={{ color: coin.change >= 0 ? "#059669" : "#dc2626" }}
              >
                ${formatPrice(coin.price)}
              </span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{
                  background:
                    coin.change >= 0
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(220,38,38,0.1)",
                  color: coin.change >= 0 ? "#047857" : "#dc2626",
                }}
              >
                {coin.change >= 0 ? "+" : ""}
                {coin.change.toFixed(2)}%
              </span>
              <span className="text-gray-300 text-xs">|</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
