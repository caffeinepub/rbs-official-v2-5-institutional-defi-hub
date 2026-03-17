import type { PollView } from "../backend";
import {
  useCreatePoll,
  useDeletePoll,
  useDeletePollWithPasscode,
  useGetAllPolls,
  useVoteOnPoll,
} from "./useQueries";

export type { PollView };

export function getTotalVotes(poll: PollView): number {
  return poll.votes.reduce((sum, kv) => sum + Number(kv.value), 0);
}

export function getVoteForOption(poll: PollView, option: string): number {
  const kv = poll.votes.find((v) => v.key === option);
  return kv ? Number(kv.value) : 0;
}

export function getVotePercentage(poll: PollView, option: string): number {
  const total = getTotalVotes(poll);
  if (total === 0) return 0;
  return Math.round((getVoteForOption(poll, option) / total) * 100);
}

export function computeCommunityStats(polls: PollView[]) {
  const totalPolls = polls.length;
  const totalVotes = polls.reduce((sum, p) => sum + getTotalVotes(p), 0);
  const uniqueCreators = new Set(polls.map((p) => p.creator.toString())).size;
  return { totalPolls, totalVotes, activeMembers: uniqueCreators };
}

export function buildActivityFeed(polls: PollView[], limit = 10) {
  const events: Array<{
    type: "created" | "voted";
    pollId: bigint;
    question: string;
    timestamp: bigint;
    detail?: string;
  }> = [];
  for (const poll of polls) {
    events.push({
      type: "created",
      pollId: poll.id,
      question: poll.question,
      timestamp: poll.createdAt,
    });
    for (const kv of poll.votes) {
      if (Number(kv.value) > 0) {
        events.push({
          type: "voted",
          pollId: poll.id,
          question: poll.question,
          timestamp: poll.createdAt,
          detail: kv.key,
        });
      }
    }
  }
  events.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  return events.slice(0, limit);
}

export function useCommunityVoting() {
  const { data: polls = [], isLoading, error, refetch } = useGetAllPolls();
  const createPollMutation = useCreatePoll();
  const voteOnPollMutation = useVoteOnPoll();
  const deletePollMutation = useDeletePoll();
  const deletePollWithPasscodeMutation = useDeletePollWithPasscode();

  const voteOnPoll = async (pollId: bigint, optionIndex: bigint) => {
    return voteOnPollMutation.mutateAsync({ pollId, optionIndex });
  };

  const deletePollSecure = async (pollId: bigint, passcode: string) => {
    return deletePollWithPasscodeMutation.mutateAsync({ pollId, passcode });
  };

  return {
    polls,
    isLoading,
    error,
    refetch,
    createPoll: createPollMutation.mutateAsync,
    isCreating: createPollMutation.isPending,
    voteOnPoll,
    isVoting: voteOnPollMutation.isPending,
    deletePoll: deletePollMutation.mutateAsync,
    deletePollSecure,
    isDeleting:
      deletePollMutation.isPending || deletePollWithPasscodeMutation.isPending,
    deleteError:
      deletePollMutation.error || deletePollWithPasscodeMutation.error,
  };
}
