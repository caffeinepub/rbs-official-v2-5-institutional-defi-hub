import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogPost, TimerType } from "../backend";
import { useActor } from "./useActor";

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
    mutationFn: async (profile: { name: string; email?: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Market Intel Access ──────────────────────────────────────────────────────

export function useHasMarketIntelAccess() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["marketIntelAccess"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasMarketIntelAccess();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useVerifyMarketIntelPasscode() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (passcode: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.verifyMarketIntelPasscode(passcode);
    },
  });
}

export function useGrantMarketIntelAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.grantMarketIntelAccess(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketIntelAccess"] });
    },
  });
}

// ─── Timer State ──────────────────────────────────────────────────────────────

export function useTimerState(timerType: TimerType) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["timerState", timerType],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTimerState(timerType);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000,
    retry: false,
  });
}

// ─── Polls ────────────────────────────────────────────────────────────────────

export function useGetAllPolls() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["polls"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPolls();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreatePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      question: string;
      options: string[];
      isActive: boolean;
      code: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPoll(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
}

export function useVoteOnPoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pollId,
      optionIndex,
    }: { pollId: bigint; optionIndex: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitVote(pollId, optionIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
}

export function useDeletePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pollId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.deletePoll(pollId);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export function useGetAlerts() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlerts();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      message,
    }: { title: string; message: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createAlert(title, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useMarkAlertAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markAlertAsRead(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useDeleteAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useToggleAlertTrigger() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleAlertTrigger(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export function usePublishedPosts() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["publishedPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedPosts();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      post,
      passcode,
    }: { post: BlogPost; passcode: string }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createBlogPost(post, passcode);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishedPosts"] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      authorCode,
    }: { id: bigint; authorCode: string }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.deleteBlogPost(id, authorCode);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishedPosts"] });
    },
  });
}

// ─── Market Pulse Voting ──────────────────────────────────────────────────────

export function useGetMarketPulseTally() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["marketPulseTally"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getMarketPulseTally();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
    retry: false,
  });
}

export function useVoteMarketPulse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sentiment: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.voteMarketPulse(sentiment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketPulseTally"] });
    },
  });
}
