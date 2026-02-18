import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Alert } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 300000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !!identity && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCheckMarketIntelAccess() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['marketIntelAccess'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasMarketIntelAccess();
    },
    enabled: !!actor && !!identity && !actorFetching,
    staleTime: 300000,
    retry: false,
  });
}

export function useGrantMarketIntelAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.grantMarketIntelAccess(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketIntelAccess'] });
    },
  });
}

export function useRevokeMarketIntelAccessWithPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.revokeMarketIntelAccessWithPassword(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketIntelAccess'] });
      queryClient.invalidateQueries({ queryKey: ['liveMarketIntel'] });
    },
  });
}

export function useGetPresaleRemainingTime() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['presaleRemainingTime'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPresaleRemainingTime();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1000,
    retry: 1,
  });
}

export function useGetAirdropRemainingTime() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['airdropRemainingTime'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAirdropRemainingTime();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1000,
    retry: 1,
  });
}

// ============================================
// ALERTS SYSTEM HOOKS
// ============================================

export function useGetAlerts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAlerts();
    },
    enabled: !!actor && !!identity && !actorFetching,
    staleTime: 30000,
    retry: false,
  });
}

export function useCreateAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, message }: { title: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAlert(title, message);
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
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useEnableTrigger() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enable: boolean) => {
      if (!actor) throw new Error('Actor not available');
      await actor.enableTrigger(enable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useCheckAndCreateAutoAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkAndCreateAutoAlert();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
