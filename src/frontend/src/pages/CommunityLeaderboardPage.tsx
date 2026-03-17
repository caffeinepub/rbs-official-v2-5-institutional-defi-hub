import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Loader2, Medal, TrendingUp, Trophy, Users } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import { useCommunityLeaderboard } from "../hooks/useCommunityLeaderboard";
import {
  useScrollAnimation,
  useScrollAnimationClass,
} from "../hooks/useScrollAnimation";

function copyPrincipal(principal: string) {
  navigator.clipboard.writeText(principal).then(() => {
    toast.success("Principal ID copied!");
  });
}

function PrincipalDisplay({ principal }: { principal: string }) {
  return (
    <span className="inline-flex items-center gap-1 group">
      <span className="font-mono text-[10px] text-gray-400 break-all">
        {principal}
      </span>
      <button
        type="button"
        onClick={() => copyPrincipal(principal)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-sky-500 flex-shrink-0"
        title="Copy Principal ID"
        data-ocid="leaderboard.button"
      >
        <Copy className="h-3 w-3" />
      </button>
    </span>
  );
}

function HowToCard({
  emoji,
  title,
  desc,
  delay,
}: { emoji: string; title: string; desc: string; delay: number }) {
  const cardAnim = useScrollAnimation({ threshold: 0.2 });
  return (
    <div
      ref={cardAnim.ref as React.RefObject<HTMLDivElement>}
      className={`bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm ${useScrollAnimationClass(
        cardAnim.isVisible,
        "scale-up",
      )}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

const RANK_STYLES: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-orange-400",
};

const TOP3_BG: Record<number, string> = {
  1: "bg-yellow-50 border-l-4 border-yellow-400",
  2: "bg-gray-50 border-l-4 border-gray-300",
  3: "bg-orange-50 border-l-4 border-orange-300",
};

export default function CommunityLeaderboardPage() {
  const { leaderboard, isLoading, currentPrincipal, currentUserEntry } =
    useCommunityLeaderboard();
  const heroAnim = useScrollAnimation({ threshold: 0.1 });
  const tableAnim = useScrollAnimation({ threshold: 0.05 });
  const statsAnim = useScrollAnimation({ threshold: 0.1 });

  const totalVotes = leaderboard.reduce((sum, e) => sum + e.totalVotes, 0);
  const totalPolls = leaderboard.reduce(
    (sum, e) => sum + e.pollsParticipated,
    0,
  );
  const activeThisMonth = leaderboard.filter((e) => e.score > 0).length;

  const howToItems = [
    {
      emoji: "🗳️",
      title: "Create Polls",
      desc: "Use the community passcode to create polls and engage with others.",
    },
    {
      emoji: "📊",
      title: "Get Votes",
      desc: "The more votes your polls receive, the higher your score climbs.",
    },
    {
      emoji: "🏆",
      title: "Earn Badges",
      desc: "Unlock special badges as your community influence grows.",
    },
    {
      emoji: "🏅",
      title: "Vote on Polls",
      desc: "Cast your vote on community polls to participate and gain community standing.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section
        ref={heroAnim.ref as React.RefObject<HTMLElement>}
        className={`relative py-20 px-4 text-center overflow-hidden ${useScrollAnimationClass(
          heroAnim.isVisible,
          "fade-up",
        )}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 mb-6">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-600 text-sm font-semibold">
              Community Leaderboard
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-gray-900">
            Top <span className="text-sky-500">Contributors</span>
          </h1>
          <p className="text-lg text-gray-500">
            Recognizing the most active members of the RBS community based on
            poll creation and engagement.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsAnim.ref as React.RefObject<HTMLElement>}
        className={`py-8 px-4 bg-gray-50 border-y border-gray-100 ${useScrollAnimationClass(
          statsAnim.isVisible,
          "fade-up",
        )}`}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Users className="h-6 w-6 text-sky-500" />,
              label: "Total Contributors",
              value: leaderboard.length.toString(),
            },
            {
              icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
              label: "Total Votes Cast",
              value: totalVotes.toLocaleString(),
            },
            {
              icon: <Medal className="h-6 w-6 text-yellow-500" />,
              label: "Polls Created",
              value: totalPolls.toString(),
            },
            {
              icon: <Trophy className="h-6 w-6 text-emerald-500" />,
              label: "Active This Month",
              value: activeThisMonth.toString(),
            },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm"
              style={{
                opacity: statsAnim.isVisible ? 1 : 0,
                transform: statsAnim.isVisible
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: `opacity 0.5s ease ${idx * 100}ms, transform 0.5s ease ${
                  idx * 100
                }ms`,
              }}
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              🏆 Top 3 Champions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map((entry) => (
                <div
                  key={entry.principal}
                  className={`rounded-2xl p-5 text-center border shadow-sm ${
                    entry.rank === 1
                      ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
                      : entry.rank === 2
                        ? "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
                        : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {entry.username ? `@${entry.username}` : entry.displayName}
                  </p>
                  <div className="mt-2 text-left">
                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">
                      🔑 Principal:
                    </p>
                    <div className="bg-white/70 rounded-lg p-2 border border-gray-100">
                      <PrincipalDisplay principal={entry.principal} />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded-lg p-2 border border-gray-100">
                      <span className="font-bold text-sky-500">
                        {entry.totalVotes}
                      </span>
                      <p className="text-gray-400">Votes</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-100">
                      <span className="font-bold text-blue-600">
                        {entry.pollsParticipated}
                      </span>
                      <p className="text-gray-400">Polls</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leaderboard Table */}
      <section
        ref={tableAnim.ref as React.RefObject<HTMLElement>}
        className={`py-12 px-4 ${useScrollAnimationClass(
          tableAnim.isVisible,
          "fade-up",
        )}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Full Rankings</h2>
            {currentPrincipal && (
              <p className="text-xs text-gray-400 font-mono">
                Your ID: {currentPrincipal.slice(0, 12)}...
              </p>
            )}
          </div>

          {/* Your Rank Banner */}
          {currentUserEntry && (
            <div
              className="mb-6 bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
              data-ocid="leaderboard.card"
            >
              <div className="text-2xl">{currentUserEntry.badge}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sky-700 text-sm">
                  Your Rank: #{currentUserEntry.rank}
                  {currentUserEntry.username && (
                    <span className="ml-2 text-sky-500">
                      @{currentUserEntry.username}
                    </span>
                  )}
                </p>
                <div className="mt-1">
                  <PrincipalDisplay principal={currentUserEntry.principal} />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black text-sky-600">
                  {currentUserEntry.score} pts
                </p>
                <p className="text-xs text-gray-400">Your Score</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              <span className="ml-3 text-gray-500">Loading leaderboard...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div
              className="text-center py-20 bg-white border border-gray-100 rounded-2xl"
              data-ocid="leaderboard.empty_state"
            >
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No data yet
              </h3>
              <p className="text-gray-400">
                Be the first to create polls and earn your spot!
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100 bg-gray-50">
                    <TableHead className="text-gray-500 w-16 font-semibold">
                      Rank
                    </TableHead>
                    <TableHead className="text-gray-500 font-semibold">
                      <div>
                        Contributor
                        <span className="block text-[10px] font-normal text-gray-400">
                          Username · Principal ID
                        </span>
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-500 text-right font-semibold">
                      Polls
                    </TableHead>
                    <TableHead className="text-gray-500 text-right font-semibold">
                      Votes
                    </TableHead>
                    <TableHead className="text-gray-500 text-right font-semibold">
                      Score
                    </TableHead>
                    <TableHead className="text-gray-500 text-center font-semibold">
                      Badge
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((entry, idx) => {
                    const isCurrentUser = entry.principal === currentPrincipal;
                    return (
                      <TableRow
                        key={entry.principal}
                        data-ocid={`leaderboard.item.${idx + 1}`}
                        className={`border-gray-100 transition-colors ${
                          isCurrentUser
                            ? "bg-sky-50/60 hover:bg-sky-50"
                            : entry.rank <= 3
                              ? `${TOP3_BG[entry.rank]} hover:bg-opacity-80`
                              : "hover:bg-sky-50/30"
                        }`}
                        style={{
                          opacity: tableAnim.isVisible ? 1 : 0,
                          transform: tableAnim.isVisible
                            ? "translateX(0)"
                            : "translateX(-20px)",
                          transition: `opacity 0.4s ease ${idx * 60}ms, transform 0.4s ease ${
                            idx * 60
                          }ms`,
                        }}
                      >
                        <TableCell>
                          <span
                            className={`font-black text-lg ${
                              RANK_STYLES[entry.rank] ?? "text-gray-400"
                            }`}
                          >
                            #{entry.rank}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-1 text-[9px] bg-sky-100 text-sky-600 px-1 rounded font-bold">
                              YOU
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p
                            className={`font-semibold ${
                              isCurrentUser ? "text-sky-700" : "text-gray-900"
                            }`}
                          >
                            {entry.username
                              ? `@${entry.username}`
                              : entry.displayName}
                          </p>
                          <div className="mt-0.5">
                            <PrincipalDisplay principal={entry.principal} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-700">
                          {entry.pollsParticipated}
                        </TableCell>
                        <TableCell className="text-right font-bold text-sky-500">
                          {entry.totalVotes.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-bold text-blue-600">
                          {entry.score}
                        </TableCell>
                        <TableCell className="text-center text-2xl">
                          {entry.badge}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      {/* How to Earn */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How to Climb the Ranks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {howToItems.map((item, idx) => (
              <HowToCard
                key={item.title}
                emoji={item.emoji}
                title={item.title}
                desc={item.desc}
                delay={idx * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer attribution */}
      <footer className="py-6 px-4 text-center text-xs text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="text-sky-500 hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
