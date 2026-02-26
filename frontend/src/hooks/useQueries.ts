import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Alert, PollView, CreatePollInput } from '../backend';
import { TimerType } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Market Intel Access ──────────────────────────────────────────────────────

export function useHasMarketIntelAccess() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['marketIntelAccess', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasMarketIntelAccess();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

export function useGrantMarketIntelAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.grantMarketIntelAccess(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketIntelAccess', identity?.getPrincipal().toString()] });
    },
  });
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export function useGetAlerts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Alert[]>({
    queryKey: ['alerts', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlerts();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 30000,
    retry: false,
  });
}

export function useCreateAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ title, message }: { title: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAlert(title, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', identity?.getPrincipal().toString()] });
    },
  });
}

export function useMarkAlertAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markAlertAsRead(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', identity?.getPrincipal().toString()] });
    },
  });
}

export function useDeleteAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', identity?.getPrincipal().toString()] });
    },
  });
}

export function useToggleAlertTrigger() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleAlertTrigger(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', identity?.getPrincipal().toString()] });
    },
  });
}

// ─── Polls / Community Voting ─────────────────────────────────────────────────

export function useGetPollsByCode(code: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PollView[]>({
    queryKey: ['pollsByCode', code],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPollsByCode(code);
    },
    enabled: !!actor && !actorFetching && !!identity && !!code,
    refetchInterval: 10000,
    retry: false,
  });
}

export function useGetAllPolls() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PollView[]>({
    queryKey: ['allPolls'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPolls();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 10000,
    retry: false,
  });
}

export function useCreatePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePollInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPoll(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPolls'] });
      queryClient.invalidateQueries({ queryKey: ['pollsByCode'] });
    },
  });
}

export function useVoteOnPoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, optionIndex }: { pollId: bigint; optionIndex: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitVote(pollId, optionIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPolls'] });
      queryClient.invalidateQueries({ queryKey: ['pollsByCode'] });
    },
  });
}

// ─── Timer State ──────────────────────────────────────────────────────────────

export function useTimerState(timerType: 'presale' | 'airdrop') {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const type = timerType === 'presale' ? TimerType.presale : TimerType.airdrop;

  return useQuery({
    queryKey: ['timerState', timerType],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTimerState(type);
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

// ─── Form Submissions ─────────────────────────────────────────────────────────

export function useSubmitPresaleForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, country, walletAddress, rbsAmount }: { name: string; country: string; walletAddress: string; rbsAmount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPresaleForm(name, country, walletAddress, rbsAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
  });
}

export function useSubmitAirdropForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, country, walletAddress, rbsAmount }: { name: string; country: string; walletAddress: string; rbsAmount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAirdropForm(name, country, walletAddress, rbsAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
  });
}

export function useGetMySubmissions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['mySubmissions', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySubmissions();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}
