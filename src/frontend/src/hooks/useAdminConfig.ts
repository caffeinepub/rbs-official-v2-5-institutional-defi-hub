import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// Temporary local types until backend is updated
interface ApiKeyStatus {
  provider: string;
  configured: boolean;
  lastUpdated: bigint | null;
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 300000,
  });
}

export function useGetApiKeyStatuses() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin } = useIsAdmin();

  return useQuery<ApiKeyStatus[]>({
    queryKey: ["apiKeyStatuses"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      // Temporary mock data until backend implements getApiKeyStatuses
      return [
        { provider: "coingecko", configured: false, lastUpdated: null },
        { provider: "cryptocompare", configured: false, lastUpdated: null },
        { provider: "alternative", configured: false, lastUpdated: null },
        { provider: "binance", configured: false, lastUpdated: null },
      ];
    },
    enabled: !!actor && !actorFetching && !!isAdmin,
    staleTime: 60000,
  });
}

export function useSetApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      provider,
      key: _key,
    }: { provider: string; key: string }) => {
      if (!actor) throw new Error("Actor not available");
      // Temporary mock until backend implements setApiKey
      console.log("Set API key for provider:", provider);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeyStatuses"] });
    },
  });
}
