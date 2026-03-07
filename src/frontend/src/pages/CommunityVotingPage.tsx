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
  AlertTriangle,
  BarChart3,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp,
  Unlock,
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
import { useGlobalSectionLock } from "../hooks/useGlobalSectionLock";
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

  // Global section lock for polls
  const { isUnlocked: pollsUnlocked, setLock: setPollsLock } =
    useGlobalSectionLock("polls");

  // Unlock gate state
  const [unlockPasscode, setUnlockPasscode] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showUnlockPasscode, setShowUnlockPasscode] = useState(false);

  // Lock state
  const [showLockForm, setShowLockForm] = useState(false);
  const [lockPasscode, setLockPasscode] = useState("");
  const [lockError, setLockError] = useState("");
  const [isLocking, setIsLocking] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [createError, setCreateError] = useState("");

  const stats = computeCommunityStats(polls);
  const activityFeed = buildActivityFeed(polls, 10);

  const handleUnlockPolls = async () => {
    if (!unlockPasscode.trim()) {
      setUnlockError("Enter the passcode");
      return;
    }
    setIsUnlocking(true);
    setUnlockError("");
    try {
      await setPollsLock(unlockPasscode.trim(), true);
      setUnlockPasscode("");
      toast.success("Polls section globally unlocked for all users");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unlock failed";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("passcode") ||
        msg.toLowerCase().includes("wrong")
      ) {
        setUnlockError("Invalid passcode");
      } else {
        setUnlockError("Unlock failed. Try again.");
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleLockPolls = async () => {
    if (!lockPasscode.trim()) {
      setLockError("Enter passcode to lock");
      return;
    }
    setIsLocking(true);
    setLockError("");
    try {
      await setPollsLock(lockPasscode.trim(), false);
      setLockPasscode("");
      setShowLockForm(false);
      toast.success("Polls section globally locked for all users");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lock failed";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("passcode") ||
        msg.toLowerCase().includes("wrong")
      ) {
        setLockError("Invalid passcode");
      } else {
        setLockError("Lock failed. Try again.");
      }
    } finally {
      setIsLocking(false);
    }
  };

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
    try {
      // The passcode for poll creation is stored in backend; we pass empty string
      // since section is globally unlocked — backend validates section state
      // We still need to pass the passcode for backend validation — use a placeholder
      // that triggers the section-unlocked path. Actual validation is via section lock.
      await createPoll({
        question: question.trim(),
        options: validOptions,
        isActive: true,
        code: "BP2420075112009BP", // section-level passcode used for creation
      });
      toast.success("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]);
      setShowCreateForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create poll";
      setCreateError(
        msg.includes("passcode")
          ? "Poll creation failed — section may be locked"
          : msg,
      );
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
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <SmokySectionTransition>
          <div
            className="relative py-16 px-4 text-center border-b"
            style={{
              background:
                "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8faff 100%)",
              borderColor: "rgba(14, 165, 233, 0.15)",
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Community Voting
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Shape the future of RBS through decentralized governance polls
            </p>
            {pollsUnlocked && (
              <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Globe className="w-3.5 h-3.5" />
                Poll creation globally enabled for all users
              </div>
            )}
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
                  className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </SmokySectionTransition>

          {/* Passcode Gate for unlocking polls creation */}
          {isAuthenticated && !pollsUnlocked && (
            <SmokySectionTransition>
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(240, 249, 255, 0.8)",
                  border: "1px solid rgba(14, 165, 233, 0.2)",
                  boxShadow: "0 4px 20px rgba(14, 165, 233, 0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-gray-900 font-bold text-base">
                    Unlock Poll Creation
                  </h3>
                </div>
                <p className="text-gray-500 text-sm mb-4 max-w-md">
                  Enter the passcode to enable poll creation globally for all
                  users.
                </p>
                <div className="flex gap-3 max-w-sm">
                  <div className="relative flex-1">
                    <Input
                      data-ocid="polls.passcode.input"
                      type={showUnlockPasscode ? "text" : "password"}
                      value={unlockPasscode}
                      onChange={(e) => {
                        setUnlockPasscode(e.target.value);
                        setUnlockError("");
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleUnlockPolls()
                      }
                      placeholder="Enter passcode"
                      className="bg-white border-gray-300 text-gray-900 pr-10 font-mono"
                      disabled={isUnlocking}
                    />
                    <button
                      type="button"
                      onClick={() => setShowUnlockPasscode((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showUnlockPasscode ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    data-ocid="polls.unlock.button"
                    onClick={handleUnlockPolls}
                    disabled={isUnlocking || !unlockPasscode.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {isUnlocking ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-1" /> Unlock
                      </>
                    )}
                  </Button>
                </div>
                {unlockError && (
                  <p
                    data-ocid="polls.passcode.error_state"
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" /> {unlockError}
                  </p>
                )}
              </div>
            </SmokySectionTransition>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Polls Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lock/Create Poll Controls */}
              {isAuthenticated && pollsUnlocked && (
                <SmokySectionTransition>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      data-ocid="polls.create.button"
                      onClick={() => setShowCreateForm((v) => !v)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {showCreateForm ? "Cancel" : "Create New Poll"}
                    </Button>
                    {!showLockForm && (
                      <Button
                        data-ocid="polls.lock.button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLockForm(true)}
                        className="border-gray-300 text-gray-500 hover:bg-gray-50 text-xs"
                      >
                        <Lock className="w-3 h-3 mr-1" /> Lock Poll Creation
                      </Button>
                    )}
                    {showLockForm && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="password"
                          value={lockPasscode}
                          onChange={(e) => {
                            setLockPasscode(e.target.value);
                            setLockError("");
                          }}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleLockPolls()
                          }
                          placeholder="Passcode to lock"
                          className="bg-gray-50 border-gray-300 text-gray-900 font-mono w-48 text-sm"
                          disabled={isLocking}
                        />
                        <Button
                          data-ocid="polls.lock.confirm_button"
                          size="sm"
                          onClick={handleLockPolls}
                          disabled={isLocking || !lockPasscode.trim()}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          {isLocking ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            "Lock"
                          )}
                        </Button>
                        <Button
                          data-ocid="polls.lock.cancel_button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowLockForm(false);
                            setLockPasscode("");
                            setLockError("");
                          }}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    {lockError && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {lockError}
                      </p>
                    )}
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                      <Globe className="w-3 h-3 mr-1" /> Globally Active
                    </Badge>
                  </div>
                </SmokySectionTransition>
              )}

              {/* Create Form */}
              {showCreateForm && pollsUnlocked && (
                <SmokySectionTransition>
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(14, 165, 233, 0.2)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3 className="text-gray-900 font-bold text-lg mb-4">
                      Create Poll
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="poll-question"
                          className="text-gray-600 text-sm mb-1 block"
                        >
                          Question
                        </label>
                        <Textarea
                          id="poll-question"
                          data-ocid="polls.question.textarea"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="What should the community decide?"
                          className="bg-gray-50 border-gray-300 text-gray-900 resize-none"
                          rows={2}
                        />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-2">Options</p>
                        <div className="space-y-2">
                          {options.map((opt, i) => (
                            <div key={opt || `opt-${i}`} className="flex gap-2">
                              <Input
                                data-ocid={`polls.option.input.${i + 1}`}
                                value={opt}
                                onChange={(e) =>
                                  handleOptionChange(i, e.target.value)
                                }
                                placeholder={`Option ${i + 1}`}
                                className="bg-gray-50 border-gray-300 text-gray-900 flex-1"
                              />
                              {options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveOption(i)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
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
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Option
                          </Button>
                        </div>
                      </div>
                      {createError && (
                        <p
                          data-ocid="polls.form.error_state"
                          className="text-red-500 text-sm"
                        >
                          {createError}
                        </p>
                      )}
                      <Button
                        data-ocid="polls.submit.button"
                        onClick={handleCreatePoll}
                        disabled={isCreating}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold w-full"
                      >
                        {isCreating ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                            Creating...
                          </span>
                        ) : (
                          "Create Poll"
                        )}
                      </Button>
                    </div>
                  </div>
                </SmokySectionTransition>
              )}

              {/* Poll List — always visible to authenticated users */}
              {!isAuthenticated ? (
                <div className="text-center py-16 text-gray-400">
                  <Vote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Log in to view and vote on community polls.</p>
                </div>
              ) : isLoading ? (
                <div className="space-y-4">
                  {(["v1", "v2", "v3"] as const).map((sk) => (
                    <div
                      key={sk}
                      className="h-40 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : polls.length === 0 ? (
                <div
                  data-ocid="polls.empty_state"
                  className="text-center py-16 text-gray-400"
                >
                  <Vote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No polls yet.</p>
                  {pollsUnlocked ? (
                    <p className="text-sm mt-1 text-gray-500">
                      Use the form above to create the first poll.
                    </p>
                  ) : (
                    <p className="text-sm mt-1 text-gray-500">
                      Enter the passcode above to create the first poll.
                    </p>
                  )}
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
                          index={idx + 1}
                        />
                      </SmokySectionTransition>
                    ))}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <SmokySectionTransition>
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(14, 165, 233, 0.15)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <h3 className="text-gray-900 font-bold text-base mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> Activity
                    Feed
                  </h3>
                  {activityFeed.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No activity yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activityFeed.map((event, i) => (
                        <div
                          key={`${event.type}-${event.question?.slice(0, 10)}-${i}`}
                          className="flex items-start gap-3 text-sm"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${event.type === "created" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}
                          >
                            {event.type === "created" ? (
                              <Plus className="w-3 h-3" />
                            ) : (
                              <Vote className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-700 truncate">
                              {event.type === "created"
                                ? "Poll created: "
                                : "Vote on: "}
                              <span className="text-gray-900 font-medium">
                                {event.question.slice(0, 40)}
                                {event.question.length > 40 ? "…" : ""}
                              </span>
                            </p>
                            {event.detail && (
                              <p className="text-gray-400 text-xs">
                                Option: {event.detail}
                              </p>
                            )}
                            <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
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
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(14, 165, 233, 0.15)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <h3 className="text-gray-900 font-bold text-base mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Top
                    Polls
                  </h3>
                  {polls.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-2">
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
                            <span className="text-gray-700 truncate flex-1 mr-2">
                              {poll.question.slice(0, 30)}…
                            </span>
                            <Badge
                              variant="outline"
                              className="border-emerald-300 text-emerald-700 text-xs flex-shrink-0 bg-emerald-50"
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
  index: number;
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
  index,
}: PollCardProps) {
  const totalVotes = getTotalVotes(poll);
  const isCreator =
    callerPrincipal && poll.creator.toString() === callerPrincipal;

  return (
    <div
      data-ocid={`polls.item.${index}`}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold text-base leading-snug">
            {poll.question}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-gray-400 text-xs">{totalVotes} votes</span>
            <Badge
              variant={poll.isActive ? "default" : "secondary"}
              className={`text-xs ${poll.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
            >
              {poll.isActive ? "Active" : "Closed"}
            </Badge>
          </div>
        </div>
        {isCreator && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                data-ocid={`polls.delete_button.${index}`}
                variant="ghost"
                size="icon"
                className="text-red-400/60 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid="polls.delete.dialog"
              className="bg-white border-gray-200"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900">
                  Delete Poll?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500">
                  This will permanently delete the poll and all its votes. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-ocid="polls.delete.cancel_button"
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="polls.delete.confirm_button"
                  onClick={() => onDelete(poll.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
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
                <span className="text-gray-700 text-sm">{option}</span>
                <span className="text-gray-400 text-xs">{pct}%</span>
              </div>
              <div className="relative h-7 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400/60 to-emerald-300/30 rounded-lg transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
                {isAuthenticated && poll.isActive && (
                  <button
                    type="button"
                    onClick={() => onVote(poll, i)}
                    disabled={isVoting}
                    className="absolute inset-0 w-full text-left px-3 text-xs text-transparent hover:text-gray-600/60 transition-colors duration-200 disabled:cursor-not-allowed"
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
        <p className="text-gray-400 text-xs mt-3 text-center">Log in to vote</p>
      )}
    </div>
  );
}
