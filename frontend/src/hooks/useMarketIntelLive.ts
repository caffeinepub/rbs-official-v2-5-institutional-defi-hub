import { useQuery } from '@tanstack/react-query';

export interface SignalResult {
  asset: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  rsi: number;
  macdHistogram: number;
  maCrossover: boolean;
  price: number;
  change24h: number;
}

const COINS = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'ripple', symbol: 'XRP' },
];

function computeRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
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
  const k = 2 / (period + 1);
  const ema: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

function computeMACD(closes: number[]): { histogram: number; macdLine: number; signalLine: number } {
  if (closes.length < 26) return { histogram: 0, macdLine: 0, signalLine: 0 };
  const ema12 = computeEMA(closes, 12);
  const ema26 = computeEMA(closes, 26);
  const macdLine = ema12[ema12.length - 1] - ema26[ema26.length - 1];
  const macdSeries = ema12.map((v, i) => v - ema26[i]);
  const signalSeries = computeEMA(macdSeries.slice(-9), 9);
  const signalLine = signalSeries[signalSeries.length - 1];
  return { histogram: macdLine - signalLine, macdLine, signalLine };
}

function computeSignal(rsi: number, macdHistogram: number, maCrossover: boolean): { signal: 'BUY' | 'SELL' | 'HOLD'; confidence: number } {
  let score = 0;
  if (rsi < 30) score += 2;
  else if (rsi < 45) score += 1;
  else if (rsi > 70) score -= 2;
  else if (rsi > 55) score -= 1;

  if (macdHistogram > 0) score += 1;
  else if (macdHistogram < 0) score -= 1;

  if (maCrossover) score += 1;
  else score -= 1;

  const maxScore = 4;
  const confidence = Math.min(100, Math.round((Math.abs(score) / maxScore) * 100));

  if (score >= 2) return { signal: 'BUY', confidence: Math.max(60, confidence) };
  if (score <= -2) return { signal: 'SELL', confidence: Math.max(60, confidence) };
  return { signal: 'HOLD', confidence: Math.max(40, confidence) };
}

async function fetchCoinSignal(coinId: string, symbol: string): Promise<SignalResult> {
  try {
    const [ohlcRes, priceRes] = await Promise.all([
      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=30`),
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`),
    ]);

    const ohlcData: number[][] = await ohlcRes.json();
    const priceData = await priceRes.json();

    const closes = ohlcData.map((c) => c[4]);
    const rsi = computeRSI(closes);
    const { histogram: macdHistogram } = computeMACD(closes);

    const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const ma50 = closes.length >= 50 ? closes.slice(-50).reduce((a, b) => a + b, 0) / 50 : ma20;
    const maCrossover = ma20 > ma50;

    const { signal, confidence } = computeSignal(rsi, macdHistogram, maCrossover);

    const price = priceData[coinId]?.usd ?? 0;
    const change24h = priceData[coinId]?.usd_24h_change ?? 0;

    return { asset: symbol, signal, confidence, rsi, macdHistogram, maCrossover, price, change24h };
  } catch {
    return { asset: symbol, signal: 'HOLD', confidence: 50, rsi: 50, macdHistogram: 0, maCrossover: false, price: 0, change24h: 0 };
  }
}

export function useMarketIntelLive() {
  return useQuery<SignalResult[]>({
    queryKey: ['marketIntelLive'],
    queryFn: async () => {
      const results = await Promise.all(COINS.map((c) => fetchCoinSignal(c.id, c.symbol)));
      return results;
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2,
  });
}
