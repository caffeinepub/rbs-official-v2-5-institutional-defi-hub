import { useMemo } from "react";
import { useCommunityVoting } from "./useCommunityVoting";
import { useInternetIdentity } from "./useInternetIdentity";

export interface LeaderboardEntry {
  rank: number;
  principal: string;
  username: string;
  displayName: string;
  email?: string;
  totalVotes: number;
  pollsParticipated: number;
  badge: string;
  score: number;
}

function getUsernameFromStorage(principal: string): string {
  try {
    const raw = localStorage.getItem(`rbsLocalProfile_${principal}`);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.username ?? "";
  } catch {
    return "";
  }
}

export function useCommunityLeaderboard() {
  const { polls, isLoading } = useCommunityVoting();
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString() ?? "";

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
      .map(([principal, data]) => {
        const score = data.totalVotes + data.pollsCreated * 5;
        const username = getUsernameFromStorage(principal);
        return {
          rank: 0,
          principal,
          username,
          displayName: username
            ? `@${username}`
            : `${principal.slice(0, 8)}...${principal.slice(-4)}`,
          totalVotes: data.totalVotes,
          pollsParticipated: data.pollsCreated,
          score,
          badge:
            score >= 100
              ? "🏆"
              : score >= 50
                ? "🥇"
                : score >= 20
                  ? "🥈"
                  : "🥉",
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    return entries;
  }, [polls]);

  const currentUserEntry = leaderboard.find(
    (e) => e.principal === currentPrincipal,
  );

  return { leaderboard, isLoading, currentPrincipal, currentUserEntry };
}
