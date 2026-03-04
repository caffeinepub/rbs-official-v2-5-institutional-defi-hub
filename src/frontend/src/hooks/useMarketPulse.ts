import { useQuery } from "@tanstack/react-query";

export interface MarketPulseData {
  status: "Bullish" | "Bearish" | "Neutral";
  rsi: number;
  macdHistogram: number;
  macdLine: number;
  signalLine: number;
  price: number;
  change24h: number;
  lastUpdated: Date;
}

function computeRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function computeEMA(data: number[], period: number): number[] {
  if (data.length === 0) return [];
  const k = 2 / (period + 1);
  const ema: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

function computeMACD(closes: number[]): {
  histogram: number;
  macdLine: number;
  signalLine: number;
} {
  if (closes.length < 26) return { histogram: 0, macdLine: 0, signalLine: 0 };
  const ema12 = computeEMA(closes, 12);
  const ema26 = computeEMA(closes, 26);
  const macdLine = ema12[ema12.length - 1] - ema26[ema26.length - 1];
  const macdSeries = ema12.map((v, i) => v - ema26[i]);
  const signalSeries = computeEMA(macdSeries.slice(-9), 9);
  const signalLine = signalSeries[signalSeries.length - 1] ?? 0;
  return { histogram: macdLine - signalLine, macdLine, signalLine };
}

export function useMarketPulse() {
  return useQuery<MarketPulseData>({
    queryKey: ["marketPulse"],
    queryFn: async () => {
      const [chartRes, priceRes] = await Promise.all([
        fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily",
        ),
        fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
        ),
      ]);

      const chartData = await chartRes.json();
      const priceData = await priceRes.json();

      const closes: number[] = (chartData.prices ?? []).map(
        (p: number[]) => p[1],
      );
      const rsi = computeRSI(closes);
      const {
        histogram: macdHistogram,
        macdLine,
        signalLine,
      } = computeMACD(closes);

      const price = priceData.bitcoin?.usd ?? 0;
      const change24h = priceData.bitcoin?.usd_24h_change ?? 0;

      let status: "Bullish" | "Bearish" | "Neutral" = "Neutral";
      if (rsi > 55 && macdHistogram > 0) status = "Bullish";
      else if (rsi < 45 && macdHistogram < 0) status = "Bearish";

      return {
        status,
        rsi,
        macdHistogram,
        macdLine,
        signalLine,
        price,
        change24h,
        lastUpdated: new Date(),
      };
    },
    refetchInterval: 20000,
    staleTime: 15000,
    retry: 2,
  });
}
