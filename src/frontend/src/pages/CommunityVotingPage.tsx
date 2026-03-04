import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  BarChart3,
  Clock,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PollView } from "../backend";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import {
  buildActivityFeed,
  computeCommunityStats,
  getTotalVotes,
  getVotePercentage,
  useCommunityVoting,
} from "../hooks/useCommunityVoting";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function CommunityVotingPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const callerPrincipal = identity?.getPrincipal().toString();

  const {
    polls,
    isLoading,
    createPoll,
    isCreating,
    voteOnPoll,
    isVoting,
    deletePoll,
    isDeleting,
  } = useCommunityVoting();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [passcode, setPasscode] = useState("");
  const [createError, setCreateError] = useState("");

  const stats = computeCommunityStats(polls);
  const activityFeed = buildActivityFeed(polls, 10);

  const handleAddOption = () => setOptions((prev) => [...prev, ""]);
  const handleOptionChange = (i: number, val: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));
  const handleRemoveOption = (i: number) =>
    setOptions((prev) => prev.filter((_, idx) => idx !== i));

  const handleCreatePoll = async () => {
    setCreateError("");
    const validOptions = options.filter((o) => o.trim());
    if (!question.trim()) {
      setCreateError("Question is required");
      return;
    }
    if (validOptions.length < 2) {
      setCreateError("At least 2 options required");
      return;
    }
    if (!passcode.trim()) {
      setCreateError("Passcode is required");
      return;
    }
    try {
      await createPoll({
        question: question.trim(),
        options: validOptions,
        isActive: true,
        code: passcode.trim(),
      });
      toast.success("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]);
      setPasscode("");
      setShowCreateForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create poll";
      setCreateError(msg.includes("passcode") ? "Invalid passcode" : msg);
    }
  };

  const handleVote = async (poll: PollView, optionIndex: number) => {
    try {
      await voteOnPoll(poll.id, BigInt(optionIndex));
      toast.success("Vote submitted!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Vote failed";
      toast.error(
        msg.includes("already voted")
          ? "You have already voted on this poll"
          : msg,
      );
    }
  };

  const handleDelete = async (pollId: bigint) => {
    try {
      await deletePoll(pollId);
      toast.success("Poll deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  };

  return (
    <>
      <PageHead
        title="Community Voting | RBS"
        description="Participate in community governance polls"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
        {/* Hero */}
        <SmokySectionTransition>
          <div className="relative py-16 px-4 text-center border-b border-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-3">
              Community Voting
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Shape the future of RBS through decentralized governance polls
            </p>
          </div>
        </SmokySectionTransition>

        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          {/* Stats */}
          <SmokySectionTransition>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <BarChart3 className="w-5 h-5" />,
                  label: "Total Polls",
                  value: stats.totalPolls,
                },
                {
                  icon: <Vote className="w-5 h-5" />,
                  label: "Total Votes",
                  value: stats.totalVotes,
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "Active Members",
                  value: stats.activeMembers,
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-gray-900/60 border border-amber-500/20 rounded-xl p-5 flex items-center gap-4 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </SmokySectionTransition>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Polls Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Poll Button */}
              {isAuthenticated && (
                <SmokySectionTransition>
                  <Button
                    onClick={() => setShowCreateForm((v) => !v)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {showCreateForm ? "Cancel" : "Create New Poll"}
                  </Button>
                </SmokySectionTransition>
              )}

              {/* Create Form */}
              {showCreateForm && (
                <SmokySectionTransition>
                  <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-amber-400 font-bold text-lg mb-4">
                      Create Poll
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="poll-question"
                          className="text-gray-400 text-sm mb-1 block"
                        >
                          Question
                        </label>
                        <Textarea
                          id="poll-question"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="What should the community decide?"
                          className="bg-black/40 border-gray-700 text-white resize-none"
                          rows={2}
                        />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Options</p>
                        <div className="space-y-2">
                          {options.map((opt, i) => (
                            <div key={opt || `opt-${i}`} className="flex gap-2">
                              <Input
                                value={opt}
                                onChange={(e) =>
                                  handleOptionChange(i, e.target.value)
                                }
                                placeholder={`Option ${i + 1}`}
                                className="bg-black/40 border-gray-700 text-white flex-1"
                              />
                              {options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveOption(i)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleAddOption}
                            className="text-amber-400 hover:text-amber-300"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Option
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="poll-passcode"
                          className="text-gray-400 text-sm mb-1 block"
                        >
                          Market Intel Passcode
                        </label>
                        <Input
                          id="poll-passcode"
                          type="password"
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          placeholder="Enter passcode"
                          className="bg-black/40 border-gray-700 text-white"
                        />
                      </div>
                      {createError && (
                        <p className="text-red-400 text-sm">{createError}</p>
                      )}
                      <Button
                        onClick={handleCreatePoll}
                        disabled={isCreating}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold w-full"
                      >
                        {isCreating ? "Creating..." : "Create Poll"}
                      </Button>
                    </div>
                  </div>
                </SmokySectionTransition>
              )}

              {/* Poll List */}
              {isLoading ? (
                <div className="space-y-4">
                  {(["v1", "v2", "v3"] as const).map((sk) => (
                    <div
                      key={sk}
                      className="h-40 bg-gray-800/50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : polls.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Vote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No polls yet. Be the first to create one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...polls]
                    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                    .map((poll, idx) => (
                      <SmokySectionTransition key={poll.id.toString()}>
                        <PollCard
                          poll={poll}
                          callerPrincipal={callerPrincipal}
                          isAuthenticated={isAuthenticated}
                          isVoting={isVoting}
                          isDeleting={isDeleting}
                          onVote={handleVote}
                          onDelete={handleDelete}
                          animDelay={idx * 50}
                        />
                      </SmokySectionTransition>
                    ))}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <SmokySectionTransition>
                <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-amber-400 font-bold text-base mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Activity Feed
                  </h3>
                  {activityFeed.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No activity yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activityFeed.map((event, i) => (
                        <div
                          key={`${event.type}-${event.question?.slice(0, 10)}-${i}`}
                          className="flex items-start gap-3 text-sm animate-fade-in"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${event.type === "created" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}
                          >
                            {event.type === "created" ? (
                              <Plus className="w-3 h-3" />
                            ) : (
                              <Vote className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-300 truncate">
                              {event.type === "created"
                                ? "Poll created: "
                                : "Vote on: "}
                              <span className="text-white">
                                {event.question.slice(0, 40)}
                                {event.question.length > 40 ? "…" : ""}
                              </span>
                            </p>
                            {event.detail && (
                              <p className="text-gray-500 text-xs">
                                Option: {event.detail}
                              </p>
                            )}
                            <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(
                                Number(event.timestamp) / 1_000_000,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SmokySectionTransition>

              {/* Quick Stats */}
              <SmokySectionTransition>
                <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-amber-400 font-bold text-base mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Top Polls
                  </h3>
                  {polls.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-2">
                      No polls yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {[...polls]
                        .sort((a, b) => getTotalVotes(b) - getTotalVotes(a))
                        .slice(0, 5)
                        .map((poll) => (
                          <div
                            key={poll.id.toString()}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-300 truncate flex-1 mr-2">
                              {poll.question.slice(0, 30)}…
                            </span>
                            <Badge
                              variant="outline"
                              className="border-amber-500/30 text-amber-400 text-xs flex-shrink-0"
                            >
                              {getTotalVotes(poll)} votes
                            </Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </SmokySectionTransition>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Poll Card ─────────────────────────────────────────────────────────────────

interface PollCardProps {
  poll: PollView;
  callerPrincipal?: string;
  isAuthenticated: boolean;
  isVoting: boolean;
  isDeleting: boolean;
  onVote: (poll: PollView, optionIndex: number) => void;
  onDelete: (pollId: bigint) => void;
  animDelay?: number;
}

function PollCard({
  poll,
  callerPrincipal,
  isAuthenticated,
  isVoting,
  isDeleting,
  onVote,
  onDelete,
  animDelay = 0,
}: PollCardProps) {
  const totalVotes = getTotalVotes(poll);
  const isCreator =
    callerPrincipal && poll.creator.toString() === callerPrincipal;

  return (
    <div
      className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base leading-snug">
            {poll.question}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-gray-500 text-xs">{totalVotes} votes</span>
            <Badge
              variant={poll.isActive ? "default" : "secondary"}
              className={`text-xs ${poll.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-700 text-gray-400"}`}
            >
              {poll.isActive ? "Active" : "Closed"}
            </Badge>
          </div>
        </div>
        {isCreator && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Delete Poll?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will permanently delete the poll and all its votes. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-600 text-gray-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(poll.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="space-y-2">
        {poll.options.map((option, i) => {
          const pct = getVotePercentage(poll, option);
          return (
            <div key={option} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">{option}</span>
                <span className="text-gray-500 text-xs">{pct}%</span>
              </div>
              <div className="relative h-7 bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500/40 to-amber-400/20 rounded-lg transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
                {isAuthenticated && poll.isActive && (
                  <button
                    type="button"
                    onClick={() => onVote(poll, i)}
                    disabled={isVoting}
                    className="absolute inset-0 w-full text-left px-3 text-xs text-transparent hover:text-white/60 transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    Vote
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isAuthenticated && (
        <p className="text-gray-600 text-xs mt-3 text-center">Log in to vote</p>
      )}
    </div>
  );
}
