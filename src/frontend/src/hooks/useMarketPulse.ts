import { useQuery } from '@tanstack/react-query';

export interface MarketMomentum {
  status: 'Bullish' | 'Bearish' | 'Neutral';
  rsi: number;
  macd: number;
  ma50: number;
  ma200: number;
  timestamp: number;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const REFETCH_INTERVAL = 20000; // 20 seconds

// Simple RSI calculation
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

// Simple Moving Average
function calculateMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  const slice = prices.slice(-period);
  return slice.reduce((sum, price) => sum + price, 0) / period;
}

// Simple MACD calculation
function calculateMACD(prices: number[]): number {
  const ema12 = calculateMA(prices, 12);
  const ema26 = calculateMA(prices, 26);
  return ema12 - ema26;
}

async function fetchMarketMomentum(): Promise<MarketMomentum> {
  try {
    // Fetch Bitcoin price history for calculations
    const response = await fetch(
      `${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    const data = await response.json();
    const prices = data.prices.map((p: [number, number]) => p[1]);

    const rsi = calculateRSI(prices);
    const macd = calculateMACD(prices);
    const ma50 = calculateMA(prices, Math.min(50, prices.length));
    const ma200 = calculateMA(prices, Math.min(200, prices.length));
    const currentPrice = prices[prices.length - 1];

    // Determine market status
    let status: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
    
    if (rsi > 60 && macd > 0 && currentPrice > ma50) {
      status = 'Bullish';
    } else if (rsi < 40 && macd < 0 && currentPrice < ma50) {
      status = 'Bearish';
    }

    return {
      status,
      rsi,
      macd,
      ma50,
      ma200,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching market momentum:', error);
    throw error;
  }
}

export function useMarketPulse() {
  return useQuery<MarketMomentum>({
    queryKey: ['marketPulse'],
    queryFn: fetchMarketMomentum,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: 15000,
    retry: 2,
  });
}
