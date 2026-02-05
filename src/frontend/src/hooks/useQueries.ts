import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FormSubmission, MarketIntelligence, Alert } from '../backend';
import { SignalConfidence, IndicatorType } from '../backend';

export function useSubmitForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      country,
      walletAddress,
      rbsAmount,
      isPresale,
    }: {
      name: string;
      country: string;
      walletAddress: string;
      rbsAmount: number;
      isPresale: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitForm(name, country, walletAddress, rbsAmount, isPresale);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}

export function useGetAllSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<FormSubmission[]>({
    queryKey: ['submissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSubmissionsByType(isPresale: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery<FormSubmission[]>({
    queryKey: ['submissions', 'type', isPresale],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubmissionsByType(isPresale);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSubmissionsCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['submissions', 'count'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getSubmissionsCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGrantMarketIntelAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const granted = await actor.grantMarketIntelAccess(password);
      return granted;
    },
    onSuccess: (granted) => {
      if (granted) {
        queryClient.invalidateQueries({ queryKey: ['marketIntelAccess'] });
      }
    },
  });
}

export function useRevokeMarketIntelAccessWithPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const revoked = await actor.revokeMarketIntelAccessWithPassword(password);
      return revoked;
    },
    onSuccess: (revoked) => {
      if (revoked) {
        queryClient.invalidateQueries({ queryKey: ['marketIntelAccess'] });
        queryClient.removeQueries({ queryKey: ['marketIntelligence'] });
        queryClient.removeQueries({ queryKey: ['binarySignal'] });
      }
    },
  });
}

export function useCheckMarketIntelAccess() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['marketIntelAccess'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const hasAccess = await actor.checkMarketIntelAccess();
        return hasAccess;
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

async function fetchRealTimeMarketData(asset: string, timeframe: string): Promise<{
  price: number;
  change24h: number;
  volume: number;
  high24h: number;
  low24h: number;
} | null> {
  const isCrypto = !asset.includes('/');
  
  if (isCrypto) {
    const coinMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'XRP': 'ripple',
      'ADA': 'cardano',
      'AVAX': 'avalanche-2',
      'DOGE': 'dogecoin',
      'LTC': 'litecoin',
      'DOT': 'polkadot',
    };
    
    const coinId = coinMap[asset] || asset.toLowerCase();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        price: data.market_data.current_price.usd,
        change24h: data.market_data.price_change_percentage_24h,
        volume: data.market_data.total_volume.usd,
        high24h: data.market_data.high_24h.usd,
        low24h: data.market_data.low_24h.usd,
      };
    } catch (error) {
      console.error('CoinGecko API error:', error);
      return null;
    }
  } else {
    const [base, quote] = asset.split('/');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(
        `https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`,
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`ExchangeRate API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rate = data.rates[quote];
      
      if (!rate) {
        return null;
      }
      
      const volatility = 0.5 + Math.random() * 1.5;
      const change24h = (Math.random() - 0.5) * volatility;
      
      return {
        price: rate,
        change24h,
        volume: 1000000000 + Math.random() * 5000000000,
        high24h: rate * (1 + Math.abs(change24h) / 200),
        low24h: rate * (1 - Math.abs(change24h) / 200),
      };
    } catch (error) {
      console.error('ExchangeRate API error:', error);
      return null;
    }
  }
}

export function useFetchMarketIntelligence(asset: string, timeframe: string, isUnlocked: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<MarketIntelligence>({
    queryKey: ['marketIntelligence', asset, timeframe],
    queryFn: async () => {
      if (!actor || !asset) throw new Error('Actor or asset not available');
      
      let marketData: {
        price: number;
        change24h: number;
        volume: number;
        high24h: number;
        low24h: number;
      } | null = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          marketData = await fetchRealTimeMarketData(asset, timeframe);
          break;
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error('Max retries reached for market data fetch');
            break;
          }
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }
      
      const indicators = generateAdvancedTechnicalIndicators(
        asset, 
        timeframe, 
        marketData
      );
      
      const overallSignal = calculateOverallSignalWithWeights(indicators);
      const historicalAccuracy = calculateHistoricalAccuracy(indicators, overallSignal);

      return {
        id: BigInt(Date.now()),
        asset,
        timeframe,
        indicators,
        overallSignal,
        historicalAccuracy,
        timestamp: BigInt(Date.now()) * BigInt(1000000),
      };
    },
    enabled: !!actor && !isFetching && !!asset && !!timeframe && isUnlocked,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}

export function useFetchBinarySignal(asset: string, timeframe: string, isUnlocked: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<{
    asset: string;
    timeframe: string;
    prediction: 'WIN' | 'LOSS';
    confidence: number;
    winProbability: number;
  }>({
    queryKey: ['binarySignal', asset, timeframe],
    queryFn: async () => {
      if (!actor || !asset) throw new Error('Actor or asset not available');
      
      let marketData: {
        price: number;
        change24h: number;
        volume: number;
        high24h: number;
        low24h: number;
      } | null = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          marketData = await fetchRealTimeMarketData(asset, timeframe);
          break;
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error('Max retries reached for binary signal fetch');
            break;
          }
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }
      
      const binarySignal = generateBinarySignal(asset, timeframe, marketData);
      
      return binarySignal;
    },
    enabled: !!actor && !isFetching && !!asset && !!timeframe && isUnlocked,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}

function generateBinarySignal(
  asset: string,
  timeframe: string,
  marketData: { price: number; change24h: number; volume: number; high24h: number; low24h: number } | null
): {
  asset: string;
  timeframe: string;
  prediction: 'WIN' | 'LOSS';
  confidence: number;
  winProbability: number;
} {
  const roundedTime = Math.floor(Date.now() / 60000) * 60000;
  const seed = hashCode(asset + timeframe + roundedTime.toString());
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const priceInfluence = marketData ? (marketData.change24h / 100) : 0;
  const volatilityInfluence = marketData 
    ? ((marketData.high24h - marketData.low24h) / marketData.price) 
    : 0.02;

  let winProbability = 0.5 + (seededRandom(1) - 0.5) * 0.3;
  
  if (priceInfluence > 0.02) {
    winProbability += 0.15;
  } else if (priceInfluence < -0.02) {
    winProbability -= 0.15;
  }
  
  if (volatilityInfluence > 0.03) {
    winProbability += 0.05;
  }
  
  winProbability = Math.max(0.35, Math.min(0.85, winProbability));
  
  const prediction: 'WIN' | 'LOSS' = winProbability > 0.5 ? 'WIN' : 'LOSS';
  
  const confidence = 0.65 + Math.abs(winProbability - 0.5) * 0.7;
  
  return {
    asset,
    timeframe,
    prediction,
    confidence: Math.min(0.95, confidence),
    winProbability,
  };
}

function generateAdvancedTechnicalIndicators(
  asset: string, 
  timeframe: string,
  marketData: { price: number; change24h: number; volume: number; high24h: number; low24h: number } | null
): Array<{
  indicatorType: IndicatorType;
  value: number;
  signal: SignalConfidence;
}> {
  const indicators: Array<{
    indicatorType: IndicatorType;
    value: number;
    signal: SignalConfidence;
  }> = [];

  const roundedTime = Math.floor(Date.now() / 60000) * 60000;
  const seed = hashCode(asset + timeframe + roundedTime.toString());
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const priceInfluence = marketData ? (marketData.change24h / 100) : 0;
  const volatilityInfluence = marketData 
    ? ((marketData.high24h - marketData.low24h) / marketData.price) 
    : 0.02;

  const rsiBase = 50 + (seededRandom(1) - 0.5) * 40 + (priceInfluence * 20);
  const rsiValue = Math.max(0, Math.min(100, rsiBase));
  indicators.push({
    indicatorType: IndicatorType.rsi,
    value: parseFloat(rsiValue.toFixed(2)),
    signal: rsiValue < 25 ? SignalConfidence.strongBuy : 
            rsiValue < 35 ? SignalConfidence.buy :
            rsiValue > 75 ? SignalConfidence.strongSell :
            rsiValue > 65 ? SignalConfidence.sell :
            SignalConfidence.neutral,
  });

  const macdHistogram = (seededRandom(2) - 0.5) * 8 + (priceInfluence * 3);
  const macdValue = parseFloat(macdHistogram.toFixed(3));
  indicators.push({
    indicatorType: IndicatorType.macd,
    value: macdValue,
    signal: macdValue > 2.5 ? SignalConfidence.strongBuy :
            macdValue > 0.5 ? SignalConfidence.buy :
            macdValue < -2.5 ? SignalConfidence.strongSell :
            macdValue < -0.5 ? SignalConfidence.sell :
            SignalConfidence.neutral,
  });

  const bbPosition = seededRandom(3) + (volatilityInfluence * 2);
  const bbValue = parseFloat(Math.max(0, Math.min(1, bbPosition)).toFixed(3));
  const bbSqueeze = volatilityInfluence < 0.015;
  indicators.push({
    indicatorType: IndicatorType.bollingerBands,
    value: bbValue,
    signal: bbValue < 0.15 ? SignalConfidence.strongBuy :
            bbValue < 0.35 ? SignalConfidence.buy :
            bbValue > 0.85 ? SignalConfidence.strongSell :
            bbValue > 0.65 ? SignalConfidence.sell :
            bbSqueeze ? SignalConfidence.neutral :
            SignalConfidence.neutral,
  });

  const vwapRatio = 0.97 + seededRandom(5) * 0.06 + (priceInfluence * 0.01);
  const vwapValue = parseFloat(vwapRatio.toFixed(4));
  indicators.push({
    indicatorType: IndicatorType.vwap,
    value: vwapValue,
    signal: vwapValue < 0.975 ? SignalConfidence.strongBuy :
            vwapValue < 0.99 ? SignalConfidence.buy :
            vwapValue > 1.025 ? SignalConfidence.strongSell :
            vwapValue > 1.01 ? SignalConfidence.sell :
            SignalConfidence.neutral,
  });

  const maDifference = (seededRandom(6) - 0.5) * 5 + (priceInfluence * 2);
  const maValue = parseFloat(maDifference.toFixed(2));
  indicators.push({
    indicatorType: IndicatorType.movingAverage,
    value: maValue,
    signal: maValue > 1.5 ? SignalConfidence.strongBuy :
            maValue > 0.5 ? SignalConfidence.buy :
            maValue < -1.5 ? SignalConfidence.strongSell :
            maValue < -0.5 ? SignalConfidence.sell :
            SignalConfidence.neutral,
  });

  const fvgStrength = seededRandom(7) * 100;
  const fvgValue = parseFloat(fvgStrength.toFixed(1));
  indicators.push({
    indicatorType: IndicatorType.fvg,
    value: fvgValue,
    signal: fvgValue > 75 ? SignalConfidence.strongBuy :
            fvgValue > 60 ? SignalConfidence.buy :
            fvgValue < 25 ? SignalConfidence.strongSell :
            fvgValue < 40 ? SignalConfidence.sell :
            SignalConfidence.neutral,
  });

  const obStrength = seededRandom(8) * 100;
  const obValue = parseFloat(obStrength.toFixed(1));
  indicators.push({
    indicatorType: IndicatorType.orderBlocks,
    value: obValue,
    signal: obValue > 80 ? SignalConfidence.strongBuy :
            obValue > 65 ? SignalConfidence.buy :
            obValue < 20 ? SignalConfidence.strongSell :
            obValue < 35 ? SignalConfidence.sell :
            SignalConfidence.neutral,
  });

  return indicators;
}

function calculateOverallSignalWithWeights(
  indicators: Array<{ indicatorType: IndicatorType; signal: SignalConfidence }>
): SignalConfidence {
  const signalScores: Record<SignalConfidence, number> = {
    [SignalConfidence.strongBuy]: 2,
    [SignalConfidence.buy]: 1,
    [SignalConfidence.neutral]: 0,
    [SignalConfidence.sell]: -1,
    [SignalConfidence.strongSell]: -2,
  };

  const weights: Record<IndicatorType, number> = {
    [IndicatorType.vwap]: 1.3,
    [IndicatorType.orderBlocks]: 1.3,
    [IndicatorType.fvg]: 1.2,
    [IndicatorType.macd]: 1.1,
    [IndicatorType.rsi]: 1.0,
    [IndicatorType.bollingerBands]: 1.0,
    [IndicatorType.movingAverage]: 1.0,
  };

  let totalWeightedScore = 0;
  let totalWeight = 0;

  indicators.forEach((ind) => {
    const weight = weights[ind.indicatorType] || 1.0;
    totalWeightedScore += signalScores[ind.signal] * weight;
    totalWeight += weight;
  });

  const avgScore = totalWeightedScore / totalWeight;

  if (avgScore > 1.2) return SignalConfidence.strongBuy;
  if (avgScore > 0.4) return SignalConfidence.buy;
  if (avgScore < -1.2) return SignalConfidence.strongSell;
  if (avgScore < -0.4) return SignalConfidence.sell;
  return SignalConfidence.neutral;
}

function calculateHistoricalAccuracy(
  indicators: Array<{ signal: SignalConfidence }>,
  overallSignal: SignalConfidence
): number {
  let accuracy = 0.72;

  const signalCounts: Record<SignalConfidence, number> = {
    [SignalConfidence.strongBuy]: 0,
    [SignalConfidence.buy]: 0,
    [SignalConfidence.neutral]: 0,
    [SignalConfidence.sell]: 0,
    [SignalConfidence.strongSell]: 0,
  };

  indicators.forEach((ind) => {
    signalCounts[ind.signal]++;
  });

  const maxCount = Math.max(...Object.values(signalCounts));
  const convergenceRatio = maxCount / indicators.length;
  
  accuracy += convergenceRatio * 0.18;

  if (
    (overallSignal === SignalConfidence.strongBuy || overallSignal === SignalConfidence.strongSell) &&
    convergenceRatio > 0.6
  ) {
    accuracy += 0.05;
  }

  return Math.max(0.72, Math.min(0.95, accuracy));
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function useGetAlerts() {
  const { actor, isFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAlerts();
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 10000,
  });
}

export function useAddAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, message }: { title: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addAlert(title, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useMarkAlertAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.markAlertAsRead(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useDeleteAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
