import { useMemo } from "react";
import { useCommunityVoting } from "./useCommunityVoting";

export interface LeaderboardEntry {
  rank: number;
  principal: string;
  totalVotes: number;
  pollsParticipated: number;
  badge: string;
}

export function useCommunityLeaderboard() {
  const { polls, isLoading } = useCommunityVoting();

  const leaderboard = useMemo((): LeaderboardEntry[] => {
    if (!polls || polls.length === 0) return [];

    const creatorMap = new Map<
      string,
      { totalVotes: number; pollsCreated: number }
    >();

    for (const poll of polls) {
      const creatorStr = poll.creator.toString();
      const totalVotes = poll.votes.reduce(
        (sum, kv) => sum + Number(kv.value),
        0,
      );
      const existing = creatorMap.get(creatorStr) ?? {
        totalVotes: 0,
        pollsCreated: 0,
      };
      creatorMap.set(creatorStr, {
        totalVotes: existing.totalVotes + totalVotes,
        pollsCreated: existing.pollsCreated + 1,
      });
    }

    const entries: LeaderboardEntry[] = Array.from(creatorMap.entries())
      .map(([principal, data]) => ({
        rank: 0,
        principal,
        totalVotes: data.totalVotes,
        pollsParticipated: data.pollsCreated,
        badge:
          data.totalVotes >= 100
            ? "🏆"
            : data.totalVotes >= 50
              ? "🥇"
              : data.totalVotes >= 20
                ? "🥈"
                : "🥉",
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    return entries;
  }, [polls]);

  return { leaderboard, isLoading };
}
