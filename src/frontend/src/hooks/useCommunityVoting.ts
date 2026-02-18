import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PollView, CreatePollInput } from '../backend';

const POLLING_INTERVAL = 10000; // 10 seconds for live updates

// Transform backend PollView to frontend Poll format
interface Poll {
  id: bigint;
  question: string;
  options: string[];
  createdAt: bigint;
  creator: string;
  code: string;
  votes: Record<string, bigint>;
  isActive: boolean;
  hasVoted: boolean;
}

function transformPollView(pollView: PollView, hasVoted: boolean = false): Poll {
  const votes: Record<string, bigint> = {};
  pollView.votes.forEach(kv => {
    votes[kv.key] = kv.value;
  });
  
  return {
    id: pollView.id,
    question: pollView.question,
    options: pollView.options,
    createdAt: pollView.createdAt,
    creator: pollView.creator.toString(),
    code: pollView.code,
    votes,
    isActive: pollView.isActive,
    hasVoted,
  };
}

export function useGetPollsByCode(code: string, enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Poll[]>({
    queryKey: ['polls', code],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const allPolls = await actor.getAllPolls();
      // Filter by code on frontend since backend doesn't have a filter method
      const filtered = allPolls.filter(poll => poll.code === code);
      return filtered.map(poll => transformPollView(poll));
    },
    enabled: !!actor && !actorFetching && enabled && !!code,
    refetchInterval: enabled ? POLLING_INTERVAL : false,
    staleTime: 5000,
    retry: 1,
  });
}

export function useGetPollById(pollId: bigint | null, enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Poll>({
    queryKey: ['poll', pollId?.toString()],
    queryFn: async () => {
      if (!actor || !pollId) throw new Error('Actor or poll ID not available');
      const pollView = await actor.getPoll(pollId);
      if (!pollView) throw new Error('Poll not found');
      return transformPollView(pollView);
    },
    enabled: !!actor && !actorFetching && enabled && pollId !== null,
    refetchInterval: enabled ? POLLING_INTERVAL : false,
    staleTime: 5000,
    retry: 1,
  });
}

export function useCreatePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, question, options, passcode }: { 
      code: string; 
      question: string; 
      options: string[];
      passcode: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Validate passcode (Market Intel passcode)
      const hasAccess = await actor.hasMarketIntelAccess();
      if (!hasAccess) {
        // Try to grant access with the passcode
        const granted = await actor.grantMarketIntelAccess(passcode);
        if (!granted) {
          throw new Error('Invalid passcode');
        }
      }
      
      const input: CreatePollInput = {
        question,
        options,
        code,
        isActive: true,
      };
      
      return actor.createPoll(input);
    },
    onSuccess: (pollId, variables) => {
      queryClient.invalidateQueries({ queryKey: ['polls', variables.code] });
    },
  });
}

export function useCastVote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, optionIndex }: { pollId: bigint; optionIndex: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitVote(pollId, optionIndex);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['poll', variables.pollId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
}

export function calculateTotalVotes(votes: Record<string, bigint>): number {
  return Object.values(votes).reduce((sum, count) => sum + Number(count), 0);
}

export function calculatePercentage(votes: bigint, total: number): number {
  if (total === 0) return 0;
  return (Number(votes) / total) * 100;
}
