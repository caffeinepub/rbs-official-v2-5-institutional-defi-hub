import { useQuery } from '@tanstack/react-query';

export interface TokenAnalytics {
  symbol: string;
  name: string;
  price: number;
  marketCapRank: number;
  volume24h: number;
  ath: number;
  supplyRatio: number;
  volatilityScore: number;
  rsi: number;
  trendSignal: 'Bullish' | 'Bearish' | 'Neutral';
  riskLevel: 'Low' | 'Medium' | 'High';
  marketStrength: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  volumeTrend: 'Rising' | 'Falling' | 'Stable';
  change7d: number;
  change30d: number;
}

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

function computeBollingerBands(closes: number[], period = 20): { upper: number; middle: number; lower: number } {
  if (closes.length < period) {
    const last = closes[closes.length - 1] ?? 0;
    return { upper: last, middle: last, lower: last };
  }
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  return { upper: mean + 2 * stdDev, middle: mean, lower: mean - 2 * stdDev };
}

function computeVolatility(closes: number[]): number {
  if (closes.length < 2) return 0;
  const returns = closes.slice(1).map((c, i) => Math.log(c / closes[i]));
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(365) * 100;
}

function computeMarketStrength(rsi: number, trendSignal: string, volumeTrend: string, volatility: number): number {
  let score = 50;
  if (rsi > 60) score += 15;
  else if (rsi < 40) score -= 15;
  if (trendSignal === 'Bullish') score += 20;
  else if (trendSignal === 'Bearish') score -= 20;
  if (volumeTrend === 'Rising') score += 10;
  else if (volumeTrend === 'Falling') score -= 10;
  if (volatility > 80) score -= 15;
  else if (volatility < 30) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function useTokenAdvancedAnalytics(tokenSymbol: string) {
  return useQuery<TokenAnalytics>({
    queryKey: ['tokenAdvancedAnalytics', tokenSymbol],
    queryFn: async () => {
      const searchRes = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(tokenSymbol)}`
      );
      const searchData = await searchRes.json();
      const coinId = searchData.coins?.[0]?.id;
      if (!coinId) throw new Error(`Token ${tokenSymbol} not found`);

      const [coinRes, chartRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`),
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`),
      ]);

      const coinData = await coinRes.json();
      const chartData = await chartRes.json();

      const closes: number[] = (chartData.prices ?? []).map((p: number[]) => p[1]);
      const volumes: number[] = (chartData.total_volumes ?? []).map((v: number[]) => v[1]);

      const rsi = computeRSI(closes);
      const { upper: bollingerUpper, middle: bollingerMiddle, lower: bollingerLower } = computeBollingerBands(closes);
      const volatilityScore = computeVolatility(closes);

      // Volume trend: compare last 7 days avg vs previous 7 days avg
      const recentVol = volumes.slice(-7).reduce((a, b) => a + b, 0) / 7;
      const prevVol = volumes.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
      const volumeTrend: 'Rising' | 'Falling' | 'Stable' =
        recentVol > prevVol * 1.05 ? 'Rising' : recentVol < prevVol * 0.95 ? 'Falling' : 'Stable';

      // 7d and 30d change
      const price = closes[closes.length - 1] ?? 0;
      const price7dAgo = closes.length >= 7 ? closes[closes.length - 7] : closes[0];
      const price30dAgo = closes[0] ?? price;
      const change7d = price7dAgo ? ((price - price7dAgo) / price7dAgo) * 100 : 0;
      const change30d = price30dAgo ? ((price - price30dAgo) / price30dAgo) * 100 : 0;

      const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, closes.length);
      const ma50 = closes.length >= 50 ? closes.slice(-50).reduce((a, b) => a + b, 0) / 50 : ma20;
      const trendSignal: 'Bullish' | 'Bearish' | 'Neutral' =
        ma20 > ma50 && rsi > 50 ? 'Bullish' : ma20 < ma50 && rsi < 50 ? 'Bearish' : 'Neutral';

      const riskLevel: 'Low' | 'Medium' | 'High' =
        volatilityScore < 40 ? 'Low' : volatilityScore < 80 ? 'Medium' : 'High';

      const marketStrength = computeMarketStrength(rsi, trendSignal, volumeTrend, volatilityScore);

      const marketData = coinData.market_data ?? {};
      const ath = marketData.ath?.usd ?? 0;
      const circulatingSupply = marketData.circulating_supply ?? 0;
      const totalSupply = marketData.total_supply ?? circulatingSupply;
      const supplyRatio = totalSupply > 0 ? (circulatingSupply / totalSupply) * 100 : 0;

      return {
        symbol: (coinData.symbol ?? tokenSymbol).toUpperCase(),
        name: coinData.name ?? tokenSymbol,
        price,
        marketCapRank: coinData.market_cap_rank ?? 0,
        volume24h: marketData.total_volume?.usd ?? 0,
        ath,
        supplyRatio,
        volatilityScore,
        rsi,
        trendSignal,
        riskLevel,
        marketStrength,
        bollingerUpper,
        bollingerMiddle,
        bollingerLower,
        volumeTrend,
        change7d,
        change30d,
      };
    },
    enabled: !!tokenSymbol,
    staleTime: 60000,
    retry: 2,
  });
}
