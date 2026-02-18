import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Temporary local types until backend is updated
interface LiveMarketIntel {
  intel: any | null;
  lastUpdated: bigint;
  isStale: boolean;
  fetchFailed: boolean;
}

const POLLING_INTERVAL = 60000; // 1 minute
const STALE_THRESHOLD = 15 * 60 * 1000; // 15 minutes in milliseconds

export function useGetLiveMarketIntel(asset: string, timeframe: string, enabled: boolean) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LiveMarketIntel>({
    queryKey: ['liveMarketIntel', asset, timeframe],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Temporary mock data until backend implements getLiveMarketIntel
      return {
        intel: null,
        lastUpdated: BigInt(Date.now() * 1_000_000),
        isStale: false,
        fetchFailed: false,
      };
    },
    enabled: !!actor && !actorFetching && enabled && !!asset && !!timeframe,
    refetchInterval: enabled ? POLLING_INTERVAL : false,
    staleTime: 30000,
    retry: 1,
  });
}

export function useRefreshMarketIntel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ asset, timeframe }: { asset: string; timeframe: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Temporary no-op until backend implements refreshMarketIntel
      console.log('Refresh market intel:', asset, timeframe);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['liveMarketIntel', variables.asset, variables.timeframe] });
    },
  });
}

export function isDataStale(timestamp: bigint): boolean {
  const now = Date.now();
  const dataTime = Number(timestamp) / 1_000_000;
  return (now - dataTime) > STALE_THRESHOLD;
}

export function formatLastUpdated(timestamp: bigint): string {
  const dataTime = Number(timestamp) / 1_000_000;
  const now = Date.now();
  const diffMs = now - dataTime;
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}
