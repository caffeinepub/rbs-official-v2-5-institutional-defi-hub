import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VoteTally } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetMarketPulseTally() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VoteTally>({
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
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (sentiment: "bullish" | "bearish" | "neutral") => {
      if (!actor) throw new Error("Actor not available");
      if (!identity) throw new Error("Not authenticated");
      return actor.voteMarketPulse(sentiment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketPulseTally"] });
    },
  });
}
