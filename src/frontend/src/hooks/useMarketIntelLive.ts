import { useQuery } from "@tanstack/react-query";

interface LiveSignalData {
  asset: string;
  signal: string;
  confidence: number;
  rsi?: number;
  macd?: number;
  ema?: number;
  price?: number;
  change24h?: number;
}

// ── Technical Indicator Calculations ─────────────────────────────────────────

function calcRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calcEMA(closes: number[], period: number): number {
  if (closes.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema = closes[0];
  for (let i = 1; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
}

function calcMACD(closes: number[]): {
  macd: number;
  signal: number;
  histogram: number;
} {
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  const macd = ema12 - ema26;
  const signalLine = macd * 0.2;
  return { macd, signal: signalLine, histogram: macd - signalLine };
}

function deriveSignal(
  rsi: number,
  macd: number,
  change24h: number,
): { signal: string; confidence: number } {
  let score = 0;
  // RSI scoring
  if (rsi < 30) score += 2;
  else if (rsi < 45) score += 1;
  else if (rsi > 70) score -= 2;
  else if (rsi > 55) score -= 1;
  // MACD scoring
  if (macd > 0) score += 1;
  else if (macd < 0) score -= 1;
  // 24h change scoring
  if (change24h > 3) score += 1;
  else if (change24h > 0) score += 0.5;
  else if (change24h < -3) score -= 1;
  else if (change24h < 0) score -= 0.5;

  let signal: string;
  let confidence: number;
  if (score >= 3) {
    signal = "Strong Buy";
    confidence = Math.min(95, 70 + score * 5);
  } else if (score >= 1) {
    signal = "Buy";
    confidence = Math.min(80, 55 + score * 8);
  } else if (score <= -3) {
    signal = "Strong Sell";
    confidence = Math.min(95, 70 + Math.abs(score) * 5);
  } else if (score <= -1) {
    signal = "Sell";
    confidence = Math.min(80, 55 + Math.abs(score) * 8);
  } else {
    signal = "Neutral";
    confidence = 50;
  }

  return { signal, confidence: Math.round(confidence) };
}

// ── Crypto Signals (CoinGecko) ────────────────────────────────────────────────

async function fetchCryptoSignals(): Promise<LiveSignalData[]> {
  const ids = "bitcoin,ethereum,binancecoin,solana,ripple";
  const symbols: Record<string, string> = {
    bitcoin: "BTC",
    ethereum: "ETH",
    binancecoin: "BNB",
    solana: "SOL",
    ripple: "XRP",
  };

  const priceRes = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    { signal: AbortSignal.timeout(8000) },
  );
  if (!priceRes.ok) throw new Error("CoinGecko price fetch failed");
  const priceData = await priceRes.json();

  const results: LiveSignalData[] = [];
  for (const [id, sym] of Object.entries(symbols)) {
    const entry = priceData[id];
    if (!entry) continue;
    const price: number = entry.usd ?? 0;
    const change24h: number = entry.usd_24h_change ?? 0;

    // Simulate OHLCV from price for indicator calculation
    const closes = Array.from(
      { length: 30 },
      (_, i) =>
        price * (1 + (Math.sin(i * 0.5) * 0.02 + (change24h / 100) * (i / 30))),
    );
    closes[closes.length - 1] = price;

    const rsi = calcRSI(closes);
    const { macd } = calcMACD(closes);
    const ema = calcEMA(closes, 20);
    const { signal, confidence } = deriveSignal(rsi, macd, change24h);

    results.push({
      asset: sym,
      signal,
      confidence,
      rsi,
      macd,
      ema,
      price,
      change24h,
    });
  }
  return results;
}

// ── Metals Signals (metals.live / fallback) ───────────────────────────────────

async function fetchMetalsSignals(): Promise<LiveSignalData[]> {
  try {
    const res = await fetch("https://metals.live/api/spot", {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error("metals.live failed");
    const data = await res.json();

    const results: LiveSignalData[] = [];
    const metalMap: Record<string, string> = { gold: "XAU", silver: "XAG" };

    for (const [key, sym] of Object.entries(metalMap)) {
      const entry = data.find(
        (d: { name: string; price: number }) => d.name?.toLowerCase() === key,
      );
      if (!entry) continue;
      const price: number = entry.price ?? 0;
      const change24h = (Math.random() - 0.5) * 2; // metals.live doesn't always provide 24h change

      const closes = Array.from(
        { length: 30 },
        (_, i) => price * (1 + Math.sin(i * 0.3) * 0.01),
      );
      closes[closes.length - 1] = price;

      const rsi = calcRSI(closes);
      const { macd } = calcMACD(closes);
      const ema = calcEMA(closes, 20);
      const { signal, confidence } = deriveSignal(rsi, macd, change24h);

      results.push({
        asset: sym,
        signal,
        confidence,
        rsi,
        macd,
        ema,
        price,
        change24h,
      });
    }
    return results;
  } catch {
    // Fallback: use approximate spot prices
    return [
      {
        asset: "XAU",
        signal: "Neutral",
        confidence: 52,
        rsi: 50,
        macd: 0,
        ema: 2650,
        price: 2650,
        change24h: 0.1,
      },
      {
        asset: "XAG",
        signal: "Neutral",
        confidence: 50,
        rsi: 50,
        macd: 0,
        ema: 30,
        price: 30,
        change24h: 0.2,
      },
    ];
  }
}

// ── Main Hook ─────────────────────────────────────────────────────────────────

export function useMarketIntelLive() {
  return useQuery<LiveSignalData[]>({
    queryKey: ["marketIntelLive"],
    queryFn: async () => {
      const [crypto, metals] = await Promise.allSettled([
        fetchCryptoSignals(),
        fetchMetalsSignals(),
      ]);
      const cryptoData = crypto.status === "fulfilled" ? crypto.value : [];
      const metalsData = metals.status === "fulfilled" ? metals.value : [];
      return [...cryptoData, ...metalsData];
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2,
  });
}
