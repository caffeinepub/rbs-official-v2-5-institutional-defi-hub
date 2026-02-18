import { useQuery } from '@tanstack/react-query';

export interface TokenAnalytics {
  symbol: string;
  trendOverview: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  volatilityScore: number;
  marketStrength: number;
  volumeAnalysis: string;
  timestamp: number;
  sources: string[];
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

async function fetchTokenAnalytics(symbol: string): Promise<TokenAnalytics> {
  try {
    const coinId = symbol.toLowerCase() === 'btc' ? 'bitcoin' : 
                   symbol.toLowerCase() === 'eth' ? 'ethereum' :
                   symbol.toLowerCase() === 'bnb' ? 'binancecoin' :
                   symbol.toLowerCase();

    const [marketResponse, historyResponse] = await Promise.all([
      fetch(`${COINGECKO_API}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`),
      fetch(`${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=30`)
    ]);

    if (!marketResponse.ok || !historyResponse.ok) {
      throw new Error('Failed to fetch token analytics');
    }

    const marketData = await marketResponse.json();
    const historyData = await historyResponse.json();

    const prices = historyData.prices.map((p: [number, number]) => p[1]);
    const volumes = historyData.total_volumes.map((v: [number, number]) => v[1]);

    // Calculate volatility
    const avgPrice = prices.reduce((sum: number, p: number) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum: number, p: number) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / avgPrice * 100;

    // Calculate market strength (based on price trend and volume)
    const priceChange = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
    const avgVolume = volumes.reduce((sum: number, v: number) => sum + v, 0) / volumes.length;
    const recentVolume = volumes.slice(-7).reduce((sum: number, v: number) => sum + v, 0) / 7;
    const volumeStrength = (recentVolume / avgVolume) * 50;
    const marketStrength = Math.min(100, Math.max(0, 50 + priceChange + volumeStrength));

    // Determine risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    if (volatility < 5) riskLevel = 'Low';
    else if (volatility > 15) riskLevel = 'High';

    // Trend overview
    let trendOverview = 'Neutral';
    if (priceChange > 5) trendOverview = 'Strong Uptrend';
    else if (priceChange > 0) trendOverview = 'Mild Uptrend';
    else if (priceChange < -5) trendOverview = 'Strong Downtrend';
    else if (priceChange < 0) trendOverview = 'Mild Downtrend';

    // Volume analysis
    const volumeAnalysis = recentVolume > avgVolume * 1.2 
      ? 'Above average volume indicates strong interest'
      : recentVolume < avgVolume * 0.8
      ? 'Below average volume indicates weak interest'
      : 'Volume is at average levels';

    return {
      symbol: symbol.toUpperCase(),
      trendOverview,
      riskLevel,
      volatilityScore: Math.round(volatility * 10) / 10,
      marketStrength: Math.round(marketStrength),
      volumeAnalysis,
      timestamp: Date.now(),
      sources: ['CoinGecko Market Data', 'Historical Price Analysis'],
    };
  } catch (error) {
    console.error('Error fetching token analytics:', error);
    throw error;
  }
}

export function useTokenAdvancedAnalytics(symbol: string, enabled: boolean = false) {
  return useQuery<TokenAnalytics>({
    queryKey: ['tokenAnalytics', symbol],
    queryFn: () => fetchTokenAnalytics(symbol),
    enabled: enabled && !!symbol,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
}
