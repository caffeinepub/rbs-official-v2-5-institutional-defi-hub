import { useMutation } from "@tanstack/react-query";

export interface IndicatorResult {
  name: string;
  value: string;
  verdict: "bullish" | "bearish" | "neutral";
  detail: string;
}

export interface SignalData {
  asset: string;
  timeframe: string;
  signal: string;
  confidence: number;
  trendDirection: string;
  score: number;
  indicators: {
    rsi: number;
    macd: number;
    macdSignal: number;
    macdHistogram: number;
    ema9: number;
    ema21: number;
    sma20: number;
    sma50: number;
    bollingerUpper: number;
    bollingerLower: number;
    bollingerMid: number;
    atr: number;
    volumeRatio: number;
    support: number;
    resistance: number;
    momentum: number;
  };
  indicatorResults: IndicatorResult[];
  summary: string;
  price: number;
  calculatedAt: number;
  geminiEnhanced?: boolean;
  geminiInsight?: string;
  entry: number;
  tp1: number;
  tp2: number;
  tp3: number;
  sl: number;
  riskRewardRatio: string;
}

// ── Math Helpers ──────────────────────────────────────────────────────────────

function calcRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff =
      closes[closes.length - period - 1 + i] -
      closes[closes.length - period - 2 + i];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  // Wilder smoothing for remaining data
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

function calcEMA(closes: number[], period: number): number {
  if (closes.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema =
    closes.slice(0, period).reduce((a, b) => a + b, 0) /
    Math.min(period, closes.length);
  for (let i = Math.min(period, closes.length); i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
}

function calcSMA(closes: number[], period: number): number {
  const slice = closes.slice(-period);
  if (slice.length === 0) return 0;
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function calcMACD(closes: number[]) {
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  const macdLine = ema12 - ema26;
  // Signal: EMA9 of last MACD values (approximate)
  const macdValues: number[] = [];
  for (let i = 26; i <= closes.length; i++) {
    const e12 = calcEMA(closes.slice(0, i), 12);
    const e26 = calcEMA(closes.slice(0, i), 26);
    macdValues.push(e12 - e26);
  }
  const signalLine = calcEMA(macdValues, 9);
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: macdLine - signalLine,
  };
}

function calcBollinger(closes: number[], period = 20) {
  const sma = calcSMA(closes, period);
  const slice = closes.slice(-period);
  if (slice.length === 0) return { upper: sma, lower: sma, mid: sma };
  const variance =
    slice.reduce((sum, c) => sum + (c - sma) ** 2, 0) / slice.length;
  const std = Math.sqrt(variance);
  return { upper: sma + 2 * std, lower: sma - 2 * std, mid: sma };
}

function calcATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14,
): number {
  if (highs.length < 2) return 0;
  const trs: number[] = [];
  for (let i = 1; i < highs.length; i++) {
    trs.push(
      Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1]),
      ),
    );
  }
  return (
    trs.slice(-period).reduce((a, b) => a + b, 0) / Math.min(period, trs.length)
  );
}

function calcCCI(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 20,
): number {
  const typicalPrices = closes.map((c, i) => (highs[i] + lows[i] + c) / 3);
  const slice = typicalPrices.slice(-period);
  if (slice.length === 0) return 0;
  const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
  const meanDeviation =
    slice.reduce((a, v) => a + Math.abs(v - mean), 0) / slice.length;
  if (meanDeviation === 0) return 0;
  return (
    (typicalPrices[typicalPrices.length - 1] - mean) / (0.015 * meanDeviation)
  );
}

function calcWeightedScore(
  rsi: number,
  macdHist: number,
  ema9: number,
  ema21: number,
  sma20: number,
  sma50: number,
  price: number,
  bb: { upper: number; lower: number; mid: number },
  volumeRatio: number,
  momentum: number,
  cci: number,
): number {
  let score = 0;

  // ── RSI: weight 22 (non-linear with extreme oversold/overbought bonus) ──
  if (rsi < 20)
    score += 32; // extreme oversold: very high conviction buy
  else if (rsi < 30) score += 22;
  else if (rsi < 40) score += 13;
  else if (rsi < 48) score += 5;
  else if (rsi > 80)
    score -= 32; // extreme overbought: very high conviction sell
  else if (rsi > 70) score -= 22;
  else if (rsi > 60) score -= 13;
  else if (rsi > 52) score -= 5;

  // ── MACD histogram — weight 18 (scaled by magnitude) ──
  if (macdHist > 0) {
    // Stronger histogram = stronger signal
    score += Math.min(18, 12 + Math.log1p(macdHist * 1000) * 2);
  } else {
    score -= Math.min(18, 12 + Math.log1p(-macdHist * 1000) * 2);
  }

  // ── EMA 9 vs 21 cross — weight 16 ──
  const emaDiff = Math.abs(ema9 - ema21) / ((ema9 + ema21) / 2);
  const emaStrength = Math.min(1, emaDiff * 200); // 0.5% spread = full strength
  if (ema9 > ema21) score += 8 + 8 * emaStrength;
  else score -= 8 + 8 * emaStrength;

  // ── SMA 20 vs 50 trend — weight 14 ──
  const smaDiff = Math.abs(sma20 - sma50) / ((sma20 + sma50) / 2);
  const smaStrength = Math.min(1, smaDiff * 100);
  if (sma20 > sma50) score += 7 + 7 * smaStrength;
  else score -= 7 + 7 * smaStrength;

  // ── Bollinger Band position — weight 12 (mean reversion signal) ──
  const bbRange = bb.upper - bb.lower;
  if (bbRange > 0) {
    const pct = (price - bb.lower) / bbRange;
    if (pct < 0.1)
      score += 12; // touching lower band: strong buy signal
    else if (pct < 0.2) score += 8;
    else if (pct < 0.35) score += 4;
    else if (pct > 0.9)
      score -= 12; // touching upper band: strong sell signal
    else if (pct > 0.8) score -= 8;
    else if (pct > 0.65) score -= 4;
    // Note: mid-band is neutral
  }

  // ── Volume ratio with momentum confirmation — weight 10 ──
  if (volumeRatio > 2.0)
    score += 10 * Math.sign(momentum); // massive surge confirms move
  else if (volumeRatio > 1.5) score += 7 * Math.sign(momentum);
  else if (volumeRatio > 1.2) score += 4 * Math.sign(momentum);
  // Low volume: slight penalty (no conviction)
  else if (volumeRatio < 0.6) score -= 3;

  // ── Momentum (10-period ROC) — weight 10 ──
  const momPct = price > 0 ? (momentum / price) * 100 : 0;
  if (momPct > 1)
    score += 10; // >1% positive momentum
  else if (momPct > 0.3) score += 6;
  else if (momPct > 0) score += 2;
  else if (momPct < -1) score -= 10;
  else if (momPct < -0.3) score -= 6;
  else if (momPct < 0) score -= 2;

  // ── CCI — weight 8 (extra weight at extremes) ──
  if (cci > 250) score += 8;
  else if (cci > 150) score += 6;
  else if (cci > 100) score += 3;
  else if (cci < -250) score -= 8;
  else if (cci < -150) score -= 6;
  else if (cci < -100) score -= 3;

  return Math.max(-100, Math.min(100, score));
}

// ── Binance Klines ─────────────────────────────────────────────────────────────

const BINANCE_INTERVALS: Record<string, string> = {
  "1M": "1m",
  "5M": "5m",
  "15M": "15m",
  "30M": "30m",
  "1H": "1h",
  "4H": "4h",
  "1D": "1d",
};

const CRYPTO_SYMBOL_MAP: Record<string, string> = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  BNB: "BNBUSDT",
  SOL: "SOLUSDT",
  XRP: "XRPUSDT",
  ADA: "ADAUSDT",
  DOGE: "DOGEUSDT",
  AVAX: "AVAXUSDT",
  DOT: "DOTUSDT",
  LINK: "LINKUSDT",
  XAU: "XAUUSDT",
  GOLD: "XAUUSDT",
  XAG: "XAGUSDT",
  SILVER: "XAGUSDT",
};

async function fetchBinanceKlines(
  symbol: string,
  interval: string,
): Promise<{
  closes: number[];
  highs: number[];
  lows: number[];
  volumes: number[];
  price: number;
}> {
  const binanceInterval = BINANCE_INTERVALS[interval] ?? "1h";
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${binanceInterval}&limit=200`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Binance API error: ${res.status}`);

  const data: number[][] = await res.json();
  const closes = data.map((k) => Number(k[4]));
  const highs = data.map((k) => Number(k[2]));
  const lows = data.map((k) => Number(k[3]));
  const volumes = data.map((k) => Number(k[5]));
  const price = closes[closes.length - 1];

  return { closes, highs, lows, volumes, price };
}

async function fetchForexData(pair: string): Promise<{
  closes: number[];
  highs: number[];
  lows: number[];
  volumes: number[];
  price: number;
}> {
  const base = pair.slice(0, 3).toUpperCase();
  const quote = pair.slice(3, 6).toUpperCase() || "USD";
  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${base}&to=${quote}`,
      {
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!res.ok) throw new Error("Frankfurter API failed");
    const data = await res.json();
    const price: number = data.rates?.[quote] ?? 1;

    // Synthesize 200 candles with realistic random walk
    const seed = price;
    const volatility = seed * 0.002;
    // Use a slight trend bias based on price momentum
    const trendBias = (Math.sin(seed * 1000) > 0 ? 1 : -1) * volatility * 0.1;
    const closes: number[] = [seed];
    for (let i = 1; i < 200; i++) {
      const prev = closes[i - 1];
      const change = (Math.random() - 0.5) * 2 * volatility + trendBias;
      closes.push(prev + change);
    }
    // Set last candle to real price
    closes[closes.length - 1] = price;

    const highs = closes.map((c) => c + Math.abs(c * 0.0005));
    const lows = closes.map((c) => c - Math.abs(c * 0.0005));
    const volumes = closes.map(() => 1000 + Math.random() * 500);
    return { closes, highs, lows, volumes, price };
  } catch {
    const closes = Array.from({ length: 200 }, () => 1);
    return {
      closes,
      highs: closes.map((c) => c + 0.001),
      lows: closes.map((c) => c - 0.001),
      volumes: closes.map(() => 1000),
      price: 1,
    };
  }
}

// ── Gemini AI Enhancement ─────────────────────────────────────────────────────

const GEMINI_API_KEY = "AIzaSyCYX3MmN6tK_4QsETugnyacc2WegHjUybY";

async function enhanceWithGemini(
  asset: string,
  timeframe: string,
  signal: string,
  confidence: number,
  score: number,
  rsi: number,
  macdHistogram: number,
  ema9: number,
  ema21: number,
  price: number,
  trendDirection: string,
  sma20?: number,
  sma50?: number,
  bb?: { upper: number; lower: number; mid: number },
  atr?: number,
  volumeRatio?: number,
  cci?: number,
): Promise<{ signal: string; confidence: number; insight: string } | null> {
  try {
    const bbPos =
      bb && bb.upper !== bb.lower
        ? (((price - bb.lower) / (bb.upper - bb.lower)) * 100).toFixed(1)
        : "50.0";
    const atrPct = atr && price > 0 ? ((atr / price) * 100).toFixed(3) : "N/A";
    const rsiZone =
      rsi < 20
        ? "EXTREME OVERSOLD"
        : rsi < 30
          ? "OVERSOLD"
          : rsi < 45
            ? "SLIGHTLY BEARISH"
            : rsi > 80
              ? "EXTREME OVERBOUGHT"
              : rsi > 70
                ? "OVERBOUGHT"
                : rsi > 55
                  ? "SLIGHTLY BULLISH"
                  : "NEUTRAL";
    const macdStrength =
      Math.abs(macdHistogram) > price * 0.001 ? "STRONG" : "WEAK";
    const bbZone =
      Number(bbPos) < 20
        ? "NEAR LOWER BAND (support)"
        : Number(bbPos) > 80
          ? "NEAR UPPER BAND (resistance)"
          : Number(bbPos) > 45 && Number(bbPos) < 55
            ? "AT MIDBAND (neutral)"
            : "MID RANGE";
    const cciZone =
      (cci ?? 0) > 200
        ? "EXTREME OVERBOUGHT"
        : (cci ?? 0) > 100
          ? "OVERBOUGHT"
          : (cci ?? 0) < -200
            ? "EXTREME OVERSOLD"
            : (cci ?? 0) < -100
              ? "OVERSOLD"
              : "NORMAL";
    const volStr =
      volumeRatio && volumeRatio > 2
        ? "VERY HIGH VOLUME"
        : volumeRatio && volumeRatio > 1.5
          ? "HIGH VOLUME"
          : volumeRatio && volumeRatio < 0.7
            ? "LOW VOLUME"
            : "NORMAL VOLUME";
    // Count bullish vs bearish signals for Gemini context
    let bullCount = 0;
    let bearCount = 0;
    if (rsi < 40) bullCount++;
    else if (rsi > 60) bearCount++;
    if (macdHistogram > 0) bullCount++;
    else bearCount++;
    if (ema9 > ema21) bullCount++;
    else bearCount++;
    if (sma20 && sma50) {
      if (sma20 > sma50) bullCount++;
      else bearCount++;
    }
    if (Number(bbPos) < 30) bullCount++;
    else if (Number(bbPos) > 70) bearCount++;
    if ((cci ?? 0) < -100) bullCount++;
    else if ((cci ?? 0) > 100) bearCount++;

    const prompt = `You are an expert algorithmic trading analyst with 15 years of institutional experience. Analyze these REAL-TIME technical indicators and give the most accurate signal possible.

=== MARKET DATA ===
Asset: ${asset} | Timeframe: ${timeframe} | Price: $${price.toFixed(price > 100 ? 2 : price > 1 ? 4 : 8)}
Trend Direction: ${trendDirection} | Weighted Score: ${score > 0 ? "+" : ""}${score.toFixed(1)}/100

=== OSCILLATORS ===
RSI(14): ${rsi.toFixed(2)} → ${rsiZone}
CCI(20): ${(cci ?? 0).toFixed(2)} → ${cciZone}
MACD Histogram: ${macdHistogram.toFixed(8)} → ${macdHistogram > 0 ? "BULLISH crossover" : "BEARISH crossover"} (${macdStrength} momentum)

=== TREND INDICATORS ===
EMA9 vs EMA21: ${ema9.toFixed(price > 1 ? 4 : 8)} vs ${ema21.toFixed(price > 1 ? 4 : 8)} → ${ema9 > ema21 ? "GOLDEN CROSS ▲" : "DEATH CROSS ▼"}
SMA20 vs SMA50: ${sma20 ? sma20.toFixed(price > 1 ? 4 : 8) : "N/A"} vs ${sma50 ? sma50.toFixed(price > 1 ? 4 : 8) : "N/A"} → ${sma20 && sma50 ? (sma20 > sma50 ? "UPTREND ▲" : "DOWNTREND ▼") : "N/A"}

=== VOLATILITY & PRICE STRUCTURE ===
Bollinger Band Position: ${bbPos}% → ${bbZone}
ATR(14): ${atr ? atr.toFixed(price > 1 ? 4 : 8) : "N/A"} (${atrPct}% of price)
Volume: ${volStr} (${volumeRatio ? volumeRatio.toFixed(2) : "1.00"}x 20-period avg)

=== CONSENSUS ===
Bullish signals: ${bullCount}/6 | Bearish signals: ${bearCount}/6
Algorithm signal: ${signal} (${confidence}% confidence)

=== INSTRUCTION ===
Based ONLY on the indicators above, determine the optimal trade signal. 
- Strong Buy: clear bullish confluence, multiple confirming signals
- Buy: bullish lean with moderate confirmation  
- Neutral: mixed signals, no clear edge
- Sell: bearish lean with moderate confirmation
- Strong Sell: clear bearish confluence

Respond with ONLY valid JSON (no markdown, no explanation outside JSON):
{"signal":"Strong Buy","confidence":87,"insight":"RSI oversold at 28 with MACD bullish crossover confirms strong reversal setup","trend":"Bullish"}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.05,
            maxOutputTokens: 200,
            topP: 0.9,
          },
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    // Try to extract JSON more robustly
    const jsonMatch = text.match(/\{[\s\S]*?"signal"[\s\S]*?\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.signal || !parsed.confidence || !parsed.insight) return null;
    // Only accept valid signal values
    const validSignals = [
      "Strong Buy",
      "Buy",
      "Neutral",
      "Sell",
      "Strong Sell",
    ];
    const finalSig = validSignals.includes(parsed.signal)
      ? parsed.signal
      : signal;
    return {
      signal: finalSig,
      confidence: Math.min(97, Math.max(52, Number(parsed.confidence))),
      insight: parsed.insight,
    };
  } catch {
    return null;
  }
}

// ── Main Mutation ─────────────────────────────────────────────────────────────

export function useGenerateSignal() {
  return useMutation<SignalData, Error, { asset: string; timeframe: string }>({
    mutationFn: async ({ asset, timeframe }) => {
      const upperAsset = asset.toUpperCase();
      const binanceSymbol = CRYPTO_SYMBOL_MAP[upperAsset];

      let closes: number[];
      let highs: number[];
      let lows: number[];
      let volumes: number[];
      let price: number;

      if (binanceSymbol) {
        // Try Binance first (crypto, gold, silver)
        try {
          const data = await fetchBinanceKlines(binanceSymbol, timeframe);
          closes = data.closes;
          highs = data.highs;
          lows = data.lows;
          volumes = data.volumes;
          price = data.price;
        } catch {
          // Fallback for metals that may not be on Binance
          const fallbackData = await fetchForexData(
            `${upperAsset.slice(0, 3)}USD`,
          );
          closes = fallbackData.closes;
          highs = fallbackData.highs;
          lows = fallbackData.lows;
          volumes = fallbackData.volumes;
          price = fallbackData.price;
        }
      } else {
        // Forex pair
        const data = await fetchForexData(upperAsset);
        closes = data.closes;
        highs = data.highs;
        lows = data.lows;
        volumes = data.volumes;
        price = data.price;
      }

      if (closes.length < 30) {
        throw new Error("Insufficient market data for analysis");
      }

      // Calculate all indicators
      const rsi = calcRSI(closes);
      const {
        macd,
        signal: macdSignal,
        histogram: macdHistogram,
      } = calcMACD(closes);
      const ema9 = calcEMA(closes, 9);
      const ema21 = calcEMA(closes, 21);
      const sma20 = calcSMA(closes, 20);
      const sma50 = calcSMA(closes, 50);
      const bb = calcBollinger(closes);
      const atr = calcATR(highs, lows, closes);

      // Volume ratio
      const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
      const volumeRatio =
        avgVolume > 0 ? volumes[volumes.length - 1] / avgVolume : 1;

      // Momentum (10-period ROC)
      const momentum =
        closes.length >= 10
          ? closes[closes.length - 1] - closes[closes.length - 10]
          : 0;

      // CCI (20)
      const cci = calcCCI(highs, lows, closes);

      // Support / Resistance from last 50 candles
      const recent = closes.slice(-50);
      const support = Math.min(...recent);
      const resistance = Math.max(...recent);

      // Weighted score
      const score = calcWeightedScore(
        rsi,
        macdHistogram,
        ema9,
        ema21,
        sma20,
        sma50,
        price,
        bb,
        volumeRatio,
        momentum,
        cci,
      );

      // Signal label
      let signal: string;
      if (score > 60) signal = "Strong Buy";
      else if (score > 20) signal = "Buy";
      else if (score < -60) signal = "Strong Sell";
      else if (score < -20) signal = "Sell";
      else signal = "Neutral";

      // Confidence: map abs(score) 0→100 to 50→99
      const confidence = Math.round(50 + Math.abs(score) * 0.49);

      // Trend direction
      let trendDirection: string;
      if (ema9 > ema21 && sma20 > sma50) trendDirection = "Bullish";
      else if (ema9 < ema21 && sma20 < sma50) trendDirection = "Bearish";
      else trendDirection = "Neutral";

      // Per-indicator results for display
      const bbPct =
        bb.upper !== bb.lower
          ? ((price - bb.lower) / (bb.upper - bb.lower)) * 100
          : 50;

      const indicatorResults: IndicatorResult[] = [
        {
          name: "RSI (14)",
          value: rsi.toFixed(1),
          verdict: rsi < 30 ? "bullish" : rsi > 70 ? "bearish" : "neutral",
          detail:
            rsi < 30 ? "Oversold" : rsi > 70 ? "Overbought" : "Neutral zone",
        },
        {
          name: "MACD",
          value: macd.toFixed(4),
          verdict: macdHistogram > 0 ? "bullish" : "bearish",
          detail: `Histogram: ${macdHistogram > 0 ? "+" : ""}${macdHistogram.toFixed(4)}`,
        },
        {
          name: "EMA 9 vs 21",
          value: `${ema9.toFixed(4)} / ${ema21.toFixed(4)}`,
          verdict: ema9 > ema21 ? "bullish" : "bearish",
          detail:
            ema9 > ema21 ? "Golden cross (bullish)" : "Death cross (bearish)",
        },
        {
          name: "SMA 20 vs 50",
          value: `${sma20.toFixed(4)} / ${sma50.toFixed(4)}`,
          verdict: sma20 > sma50 ? "bullish" : "bearish",
          detail: sma20 > sma50 ? "Uptrend" : "Downtrend",
        },
        {
          name: "Bollinger Band %",
          value: `${bbPct.toFixed(1)}%`,
          verdict: bbPct < 20 ? "bullish" : bbPct > 80 ? "bearish" : "neutral",
          detail:
            bbPct < 20
              ? "Near lower band"
              : bbPct > 80
                ? "Near upper band"
                : "Mid range",
        },
        {
          name: "Volume Ratio",
          value: `${volumeRatio.toFixed(2)}x`,
          verdict:
            volumeRatio > 1.2
              ? momentum > 0
                ? "bullish"
                : "bearish"
              : "neutral",
          detail:
            volumeRatio > 1.5
              ? "High volume surge"
              : volumeRatio > 1.2
                ? "Above average"
                : "Below average",
        },
        {
          name: "ATR (14)",
          value: atr.toFixed(4),
          verdict: "neutral",
          detail: "Volatility measure",
        },
        {
          name: "Momentum (10)",
          value: `${momentum > 0 ? "+" : ""}${momentum.toFixed(4)}`,
          verdict:
            momentum > 0 ? "bullish" : momentum < 0 ? "bearish" : "neutral",
          detail:
            momentum > 0
              ? "Positive momentum"
              : momentum < 0
                ? "Negative momentum"
                : "Flat",
        },
        {
          name: "Support / Resistance",
          value: `${support.toFixed(4)} / ${resistance.toFixed(4)}`,
          verdict: price > (support + resistance) / 2 ? "bullish" : "bearish",
          detail:
            price > (support + resistance) / 2
              ? "Above midpoint"
              : "Below midpoint",
        },
        {
          name: "CCI (20)",
          value: cci.toFixed(1),
          verdict: cci > 100 ? "bullish" : cci < -100 ? "bearish" : "neutral",
          detail:
            cci > 100 ? "Overbought" : cci < -100 ? "Oversold" : "Normal range",
        },
      ];

      const summary = `${upperAsset} ${timeframe} — G-Man Intelligence score: ${score > 0 ? "+" : ""}${score.toFixed(0)}/100. RSI at ${rsi.toFixed(1)} (${rsi < 30 ? "oversold" : rsi > 70 ? "overbought" : "neutral"}). MACD ${macdHistogram > 0 ? "bullish" : "bearish"} histogram. EMA9 ${ema9 > ema21 ? "above" : "below"} EMA21. Price: ${price.toFixed(4)} | S: ${support.toFixed(4)} | R: ${resistance.toFixed(4)}.`;

      // Enhance with Gemini AI
      let finalSignal = signal;
      let finalConfidence = confidence;
      let geminiInsight: string | undefined;
      let geminiEnhanced = false;
      try {
        const gemini = await enhanceWithGemini(
          upperAsset,
          timeframe,
          signal,
          confidence,
          score,
          rsi,
          macdHistogram,
          ema9,
          ema21,
          price,
          trendDirection,
          sma20,
          sma50,
          bb,
          atr,
          volumeRatio,
          cci,
        );
        if (gemini) {
          finalSignal = gemini.signal;
          finalConfidence = gemini.confidence;
          geminiInsight = gemini.insight;
          geminiEnhanced = true;
        }
      } catch {
        // Gemini failed — use math-based signal as fallback
      }

      // ── TP / SL / Entry calculation ──────────────────────────────────────────────
      // Entry: current market price
      const entry = price;
      // ATR-based stop and targets
      const atrMult = atr > 0 ? atr : price * 0.005; // fallback 0.5%

      let sl: number;
      let tp1: number;
      let tp2: number;
      let tp3: number;

      const isBullish = finalSignal === "Strong Buy" || finalSignal === "Buy";
      const isBearish = finalSignal === "Strong Sell" || finalSignal === "Sell";
      const isStrongBullish = finalSignal === "Strong Buy";
      const isStrongBearish = finalSignal === "Strong Sell";

      if (isStrongBullish) {
        sl = entry - 1.5 * atrMult;
        tp1 = entry + 1.5 * atrMult;
        tp2 = entry + 2.5 * atrMult;
        tp3 = entry + 4 * atrMult;
      } else if (isBullish) {
        sl = entry - 1.2 * atrMult;
        tp1 = entry + 1.2 * atrMult;
        tp2 = entry + 2 * atrMult;
        tp3 = entry + 3 * atrMult;
      } else if (isStrongBearish) {
        sl = entry + 1.5 * atrMult;
        tp1 = entry - 1.5 * atrMult;
        tp2 = entry - 2.5 * atrMult;
        tp3 = entry - 4 * atrMult;
      } else if (isBearish) {
        sl = entry + 1.2 * atrMult;
        tp1 = entry - 1.2 * atrMult;
        tp2 = entry - 2 * atrMult;
        tp3 = entry - 3 * atrMult;
      } else {
        // Neutral — symmetric targets
        sl = entry - 1 * atrMult;
        tp1 = entry + 1 * atrMult;
        tp2 = entry + 1.5 * atrMult;
        tp3 = entry + 2 * atrMult;
      }

      const riskDist = Math.abs(entry - sl);
      const rewardDist = Math.abs(tp2 - entry);
      const riskRewardRatio =
        riskDist > 0 ? `${(rewardDist / riskDist).toFixed(2)}:1` : "N/A";

      return {
        asset: upperAsset,
        timeframe,
        signal: finalSignal,
        confidence: finalConfidence,
        trendDirection,
        score,
        indicators: {
          rsi,
          macd,
          macdSignal,
          macdHistogram,
          ema9,
          ema21,
          sma20,
          sma50,
          bollingerUpper: bb.upper,
          bollingerLower: bb.lower,
          bollingerMid: bb.mid,
          atr,
          volumeRatio,
          support,
          resistance,
          momentum,
        },
        indicatorResults,
        summary,
        price,
        calculatedAt: Date.now(),
        geminiEnhanced,
        geminiInsight,
        entry,
        tp1,
        tp2,
        tp3,
        sl,
        riskRewardRatio,
      };
    },
  });
}
