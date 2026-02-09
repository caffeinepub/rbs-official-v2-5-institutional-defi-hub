import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MarketIntelligence, Alert } from '../backend';
import { sanitizeErrorMessage } from '@/utils/errors';

// Form submission hook
export function useSubmitForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      country: string;
      walletAddress: string;
      rbsAmount: number;
      isPresale: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitForm(
        data.name,
        data.country,
        data.walletAddress,
        data.rbsAmount,
        data.isPresale
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
    onError: (error) => {
      // Log for debugging but don't expose to user
      console.error('Form submission error:', error);
    },
  });
}

// Get my submissions
export function useGetMySubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['mySubmissions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getMySubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Timer queries
export function useGetPresaleRemainingTime() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['presaleRemainingTime'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getPresaleRemainingTime();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

export function useGetAirdropRemainingTime() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['airdropRemainingTime'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAirdropRemainingTime();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

// Market Intel Access
export function useGrantMarketIntelAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.grantMarketIntelAccess(password);
      if (!result) {
        throw new Error('Invalid passcode');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketIntelAccess'] });
      queryClient.invalidateQueries({ queryKey: ['marketIntelligence'] });
    },
    onError: (error) => {
      console.error('Market Intel access error:', error);
    },
  });
}

export function useRevokeMarketIntelAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.revokeMarketIntelAccessWithPassword(password);
      if (!result) {
        throw new Error('Invalid passcode');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Market Intel revoke error:', error);
    },
  });
}

// Alias for backward compatibility
export const useRevokeMarketIntelAccessWithPassword = useRevokeMarketIntelAccess;

export function useCheckMarketIntelAccess() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['marketIntelAccess'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkMarketIntelAccess();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Market Intelligence queries
export function useGetMarketIntelligenceByTimeframeAndAsset(
  timeframe: string,
  asset: string
) {
  const { actor, isFetching } = useActor();

  return useQuery<MarketIntelligence[]>({
    queryKey: ['marketIntelligence', timeframe, asset],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getMarketIntelligenceByTimeframeAndAsset(timeframe, asset);
    },
    enabled: !!actor && !isFetching && !!timeframe && !!asset,
    retry: 1,
  });
}

// Fetch market intelligence (standard mode)
export function useFetchMarketIntelligence(
  asset: string,
  timeframe: string,
  enabled: boolean = true
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MarketIntelligence[]>({
    queryKey: ['marketIntelligence', asset, timeframe],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getMarketIntelligenceByTimeframeAndAsset(timeframe, asset);
    },
    enabled: !!actor && !actorFetching && !!asset && !!timeframe && enabled,
    retry: 1,
  });
}

// Fetch binary signal (binary options mode)
// Note: This uses the same backend data but could be processed differently on the frontend
export function useFetchBinarySignal(
  asset: string,
  timeframe: string,
  enabled: boolean = true
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MarketIntelligence[]>({
    queryKey: ['binarySignal', asset, timeframe],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getMarketIntelligenceByTimeframeAndAsset(timeframe, asset);
    },
    enabled: !!actor && !actorFetching && !!asset && !!timeframe && enabled,
    retry: 1,
  });
}

// Alerts
export function useGetAlerts() {
  const { actor, isFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addAlert(data.title, data.message);
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

export function useClearAlerts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.clearAlerts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
