import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, TrendingUp, Trophy, Users } from "lucide-react";
import type React from "react";
import { useCommunityLeaderboard } from "../hooks/useCommunityLeaderboard";
import {
  useScrollAnimation,
  useScrollAnimationClass,
} from "../hooks/useScrollAnimation";

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
      className={`bg-card border border-border rounded-xl p-5 text-center ${useScrollAnimationClass(cardAnim.isVisible, "scale-up")}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

export default function CommunityLeaderboardPage() {
  const { leaderboard, isLoading } = useCommunityLeaderboard();
  const heroAnim = useScrollAnimation({ threshold: 0.1 });
  const tableAnim = useScrollAnimation({ threshold: 0.05 });
  const statsAnim = useScrollAnimation({ threshold: 0.1 });

  const totalVotes = leaderboard.reduce((sum, e) => sum + e.totalVotes, 0);

  const howToItems = [
    {
      emoji: "🗳️",
      title: "Create Polls",
      desc: "Use the community passcode to create polls and engage the community.",
    },
    {
      emoji: "📊",
      title: "Get Votes",
      desc: "The more votes your polls receive, the higher you rank on the leaderboard.",
    },
    {
      emoji: "🏆",
      title: "Earn Badges",
      desc: "Unlock special badges as your community influence grows.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section
        ref={heroAnim.ref as React.RefObject<HTMLElement>}
        className={`relative py-20 px-4 text-center overflow-hidden ${useScrollAnimationClass(heroAnim.isVisible, "fade-up")}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-background to-primary/10 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">
              Community Leaderboard
            </span>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-primary to-yellow-400 bg-clip-text text-transparent">
            Top Contributors
          </h1>
          <p className="text-xl text-muted-foreground">
            Recognizing the most active members of the RBS community based on
            poll participation and engagement.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsAnim.ref as React.RefObject<HTMLElement>}
        className={`py-8 px-4 bg-card/30 ${useScrollAnimationClass(statsAnim.isVisible, "fade-up")}`}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              label: "Total Contributors",
              value: leaderboard.length.toString(),
            },
            {
              icon: <TrendingUp className="h-6 w-6 text-green-400" />,
              label: "Total Votes Cast",
              value: totalVotes.toLocaleString(),
            },
            {
              icon: <Trophy className="h-6 w-6 text-yellow-400" />,
              label: "Active Polls",
              value: leaderboard
                .reduce((sum, e) => sum + e.pollsParticipated, 0)
                .toString(),
            },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 text-center"
              style={{
                opacity: statsAnim.isVisible ? 1 : 0,
                transform: statsAnim.isVisible
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: `opacity 0.5s ease ${idx * 100}ms, transform 0.5s ease ${idx * 100}ms`,
              }}
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl font-black text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Table */}
      <section
        ref={tableAnim.ref as React.RefObject<HTMLElement>}
        className={`py-12 px-4 ${useScrollAnimationClass(tableAnim.isVisible, "fade-up")}`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Rankings</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading leaderboard...
              </span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-2xl">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No data yet
              </h3>
              <p className="text-muted-foreground">
                Be the first to create polls and earn your spot!
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-16">
                      Rank
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Contributor
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Polls Created
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Total Votes
                    </TableHead>
                    <TableHead className="text-muted-foreground text-center">
                      Badge
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((entry, idx) => (
                    <TableRow
                      key={entry.principal}
                      className="border-border hover:bg-primary/5 transition-colors"
                      style={{
                        opacity: tableAnim.isVisible ? 1 : 0,
                        transform: tableAnim.isVisible
                          ? "translateX(0)"
                          : "translateX(-20px)",
                        transition: `opacity 0.4s ease ${idx * 60}ms, transform 0.4s ease ${idx * 60}ms`,
                      }}
                    >
                      <TableCell>
                        <span
                          className={`font-black text-lg ${
                            entry.rank === 1
                              ? "text-yellow-400"
                              : entry.rank === 2
                                ? "text-gray-400"
                                : entry.rank === 3
                                  ? "text-orange-400"
                                  : "text-muted-foreground"
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm text-foreground">
                          {entry.principal.slice(0, 12)}...
                          {entry.principal.slice(-6)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {entry.pollsParticipated}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {entry.totalVotes.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-2xl">
                        {entry.badge}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      {/* How to Earn */}
      <section className="py-12 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            How to Climb the Ranks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}
