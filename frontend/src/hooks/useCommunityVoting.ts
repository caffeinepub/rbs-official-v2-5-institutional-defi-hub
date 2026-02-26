import { useQueryClient } from '@tanstack/react-query';
import {
  useGetPollsByCode,
  useGetAllPolls,
  useCreatePoll,
  useVoteOnPoll,
} from './useQueries';
import type { PollView } from '../backend';

export type { PollView };

// Re-export helpers for backward compatibility
export function calculateTotalVotes(votes: Record<string, bigint>): number {
  return Object.values(votes).reduce((sum, count) => sum + Number(count), 0);
}

export function calculatePercentage(votes: bigint, total: number): number {
  if (total === 0) return 0;
  return (Number(votes) / total) * 100;
}

export function useCommunityVoting(joinCode?: string) {
  const queryClient = useQueryClient();

  const pollsByCodeQuery = useGetPollsByCode(joinCode ?? '');
  const allPollsQuery = useGetAllPolls();
  const createPollMutation = useCreatePoll();
  const voteMutation = useVoteOnPoll();

  const polls: PollView[] = joinCode
    ? (pollsByCodeQuery.data ?? [])
    : (allPollsQuery.data ?? []);

  const isLoading = joinCode ? pollsByCodeQuery.isLoading : allPollsQuery.isLoading;
  const error = joinCode ? pollsByCodeQuery.error : allPollsQuery.error;

  const createPoll = async (question: string, options: string[], code: string) => {
    return createPollMutation.mutateAsync({
      question,
      options,
      isActive: true,
      code,
    });
  };

  const castVote = async (pollId: bigint, optionIndex: number) => {
    return voteMutation.mutateAsync({ pollId, optionIndex: BigInt(optionIndex) });
  };

  const refreshPolls = () => {
    queryClient.invalidateQueries({ queryKey: ['allPolls'] });
    queryClient.invalidateQueries({ queryKey: ['pollsByCode'] });
  };

  return {
    polls,
    isLoading,
    error,
    createPoll,
    castVote,
    refreshPolls,
    isCreating: createPollMutation.isPending,
    isVoting: voteMutation.isPending,
    createError: createPollMutation.error,
    voteError: voteMutation.error,
  };
}
