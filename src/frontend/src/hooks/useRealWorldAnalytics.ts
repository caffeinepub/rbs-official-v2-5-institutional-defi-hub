import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Temporary local types until backend is updated
interface GlobalCryptoMetrics {
  totalMarketCap: number;
  total24hVolume: number;
  btcDominance: number;
  activeCryptocurrencies: bigint;
  timestamp: bigint;
}

interface SentimentSnapshot {
  fearGreedIndex: number;
  sentimentLabel: string;
  timestamp: bigint;
}

interface AnalyticsSnapshot {
  cryptoMetrics: GlobalCryptoMetrics | null;
  sentiment: SentimentSnapshot | null;
  lastUpdated: bigint;
  isStale: boolean;
}

const POLLING_INTERVAL = 120000; // 2 minutes

export function useGetAnalyticsSnapshot(enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AnalyticsSnapshot>({
    queryKey: ['analyticsSnapshot'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Temporary mock data until backend implements getAnalyticsSnapshot
      return {
        cryptoMetrics: null,
        sentiment: null,
        lastUpdated: BigInt(Date.now() * 1_000_000),
        isStale: false,
      };
    },
    enabled: !!actor && !actorFetching && enabled,
    refetchInterval: enabled ? POLLING_INTERVAL : false,
    staleTime: 60000,
    retry: 1,
  });
}

export function useRefreshAnalytics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Temporary no-op until backend implements refreshAnalytics
      console.log('Refresh analytics');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyticsSnapshot'] });
    },
  });
}

export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toFixed(2)}`;
}
