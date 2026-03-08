import {
  AlertDialog,
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
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
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
import { useActor } from "../hooks/useActor";
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
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const {
    polls,
    isLoading,
    createPoll,
    isCreating,
    voteOnPoll,
    isVoting,
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
      await createPoll({
        question: question.trim(),
        options: validOptions,
        isActive: true,
        code: "BP2420075112009BP",
      });
      toast.success("Poll created! Visible to all users in real-time.");
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
      toast.success("Vote submitted! Visible to all users instantly.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Vote failed";
      toast.error(
        msg.includes("already voted")
          ? "You have already voted on this poll"
          : msg,
      );
    }
  };

  const handleDelete = async (
    pollId: bigint,
    passcode: string,
  ): Promise<boolean> => {
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return false;
    }
    try {
      const result = await actor.deletePollWithPasscode(pollId, passcode);
      if (result.__kind__ === "err") {
        toast.error(
          result.err || "Delete failed — wrong passcode or poll not found",
        );
        return false;
      }
      toast.success("Poll deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["polls"] });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
      return false;
    }
  };

  return (
    <>
      <PageHead
        title="Community Voting | RBS"
        description="Participate in community governance polls"
      />
      <div className="min-h-screen bg-white text-gray-900">
        {/* Global real-time banner — always visible */}
        <div
          className="w-full px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium"
          style={{
            background:
              "linear-gradient(90deg, rgba(14,165,233,0.06) 0%, rgba(16,185,129,0.08) 50%, rgba(14,165,233,0.06) 100%)",
            borderBottom: "1px solid rgba(14, 165, 233, 0.15)",
          }}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-emerald-700">
            All polls are visible to every user in real-time
          </span>
          {pollsUnlocked && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Poll creation globally enabled — anyone with the code can create
            </Badge>
          )}
        </div>

        {/* Hero */}
        <SmokySectionTransition>
          <div
            className="relative py-10 sm:py-14 md:py-16 px-3 sm:px-4 text-center border-b"
            style={{
              background:
                "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8faff 100%)",
              borderColor: "rgba(14, 165, 233, 0.15)",
            }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
              Community Voting
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto px-2">
              Shape the future of RBS through decentralized governance polls
            </p>
            {pollsUnlocked && (
              <div className="inline-flex items-center gap-2 mt-3 sm:mt-4 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Globe className="w-3.5 h-3.5" />
                Poll creation globally enabled for all users
              </div>
            )}
          </div>
        </SmokySectionTransition>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
          {/* Stats */}
          <SmokySectionTransition>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
                  label: "Total Polls",
                  value: stats.totalPolls,
                },
                {
                  icon: <Vote className="w-4 h-4 sm:w-5 sm:h-5" />,
                  label: "Total Votes",
                  value: stats.totalVotes,
                },
                {
                  icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
                  label: "Active Members",
                  value: stats.activeMembers,
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SmokySectionTransition>

          {/* Passcode Gate for unlocking polls creation */}
          {isAuthenticated && !pollsUnlocked && (
            <SmokySectionTransition>
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6"
                style={{
                  background: "rgba(240, 249, 255, 0.8)",
                  border: "1px solid rgba(14, 165, 233, 0.2)",
                  boxShadow: "0 4px 20px rgba(14, 165, 233, 0.06)",
                }}
              >
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  <h3 className="text-gray-900 font-bold text-sm sm:text-base">
                    Unlock Poll Creation
                  </h3>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 max-w-md">
                  Enter the passcode to enable poll creation globally for all
                  users. Polls are always visible — only creation requires the
                  code.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-sm">
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
                      className="bg-white border-gray-300 text-gray-900 pr-10 font-mono w-full"
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
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold w-full sm:w-auto"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Polls Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Lock/Create Poll Controls */}
              {isAuthenticated && pollsUnlocked && (
                <SmokySectionTransition>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button
                      data-ocid="polls.create.button"
                      onClick={() => setShowCreateForm((v) => !v)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
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
                          className="bg-gray-50 border-gray-300 text-gray-900 font-mono w-full sm:w-48 text-sm"
                          disabled={isLocking}
                        />
                        <div className="flex gap-2">
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
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-6"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(14, 165, 233, 0.2)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-4">
                      Create Poll
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
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
                          className="bg-gray-50 border-gray-300 text-gray-900 resize-none w-full"
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
                                className="bg-gray-50 border-gray-300 text-gray-900 flex-1 w-full"
                              />
                              {options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveOption(i)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
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
              {/* Note: votes are visible to all authenticated users in real-time */}
              {!isAuthenticated ? (
                <div
                  data-ocid="polls.empty_state"
                  className="text-center py-12 sm:py-16 text-gray-400"
                >
                  <Vote className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm sm:text-base">
                    Log in to view and vote on community polls.
                  </p>
                  <p className="text-xs sm:text-sm mt-1 text-gray-500">
                    All votes are visible to every logged-in user in real-time.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {(["v1", "v2", "v3"] as const).map((sk) => (
                    <div
                      key={sk}
                      className="h-36 sm:h-40 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : polls.length === 0 ? (
                <div
                  data-ocid="polls.empty_state"
                  className="text-center py-12 sm:py-16 text-gray-400"
                >
                  <Vote className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm sm:text-base">No polls yet.</p>
                  {pollsUnlocked ? (
                    <p className="text-xs sm:text-sm mt-1 text-gray-500">
                      Use the form above to create the first poll.
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm mt-1 text-gray-500">
                      Enter the passcode above to create the first poll.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {[...polls]
                    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                    .map((poll, idx) => (
                      <SmokySectionTransition key={poll.id.toString()}>
                        <PollCard
                          poll={poll}
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
            <div className="space-y-3 sm:space-y-4">
              <SmokySectionTransition>
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(14, 165, 233, 0.15)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <h3 className="text-gray-900 font-bold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> Activity
                    Feed
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(16, 185, 129, 0.1)",
                        color: "#059669",
                      }}
                    >
                      Live
                    </span>
                  </h3>
                  {activityFeed.length === 0 ? (
                    <p className="text-gray-400 text-xs sm:text-sm text-center py-4">
                      No activity yet
                    </p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {activityFeed.map((event, i) => (
                        <div
                          key={`${event.type}-${event.question?.slice(0, 10)}-${i}`}
                          className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${event.type === "created" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}
                          >
                            {event.type === "created" ? (
                              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            ) : (
                              <Vote className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(14, 165, 233, 0.15)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <h3 className="text-gray-900 font-bold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Top
                    Polls
                  </h3>
                  {polls.length === 0 ? (
                    <p className="text-gray-400 text-xs sm:text-sm text-center py-2">
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
                            className="flex items-center justify-between text-xs sm:text-sm"
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
  isAuthenticated: boolean;
  isVoting: boolean;
  isDeleting: boolean;
  onVote: (poll: PollView, optionIndex: number) => void;
  onDelete: (pollId: bigint, passcode: string) => Promise<boolean>;
  animDelay?: number;
  index: number;
}

function PollCard({
  poll,
  isAuthenticated,
  isVoting,
  isDeleting,
  onVote,
  onDelete,
  animDelay = 0,
  index,
}: PollCardProps) {
  const totalVotes = getTotalVotes(poll);
  const [deletePasscode, setDeletePasscode] = useState("");
  const [showDeletePasscode, setShowDeletePasscode] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletePasscode.trim()) {
      setDeleteError("Passcode is required to delete a poll");
      return;
    }
    setIsSubmittingDelete(true);
    setDeleteError("");
    const success = await onDelete(poll.id, deletePasscode.trim());
    setIsSubmittingDelete(false);
    if (success) {
      setDeletePasscode("");
      setIsDeleteOpen(false);
    } else {
      setDeleteError("Wrong passcode or poll not found. Try again.");
    }
  };

  return (
    <div
      data-ocid={`polls.item.${index}`}
      className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:border-emerald-300 transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-snug">
            {poll.question}
          </h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
            <span className="text-gray-400 text-xs">{totalVotes} votes</span>
            <Badge
              variant={poll.isActive ? "default" : "secondary"}
              className={`text-xs ${poll.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
            >
              {poll.isActive ? "Active" : "Closed"}
            </Badge>
            {/* Real-time indicator */}
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
              Live
            </span>
          </div>
        </div>
        {isAuthenticated && (
          <AlertDialog
            open={isDeleteOpen}
            onOpenChange={(open) => {
              setIsDeleteOpen(open);
              if (!open) {
                setDeletePasscode("");
                setDeleteError("");
                setShowDeletePasscode(false);
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                data-ocid={`polls.delete_button.${index}`}
                variant="ghost"
                size="icon"
                className="text-red-400/60 hover:text-red-500 hover:bg-red-50 flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9"
                disabled={isDeleting || isSubmittingDelete}
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid="polls.delete.dialog"
              className="bg-white border-gray-200 w-[calc(100vw-2rem)] sm:max-w-md mx-auto"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900">
                  Delete Poll?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500">
                  This will permanently delete the poll and all its votes. Enter
                  the admin passcode to confirm deletion.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="px-0 py-2">
                <label
                  htmlFor={`delete-passcode-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admin Passcode
                </label>
                <div className="relative">
                  <Input
                    id={`delete-passcode-${index}`}
                    data-ocid={`polls.delete.passcode.input.${index}`}
                    type={showDeletePasscode ? "text" : "password"}
                    value={deletePasscode}
                    onChange={(e) => {
                      setDeletePasscode(e.target.value);
                      setDeleteError("");
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleDeleteConfirm()
                    }
                    placeholder="Enter admin passcode"
                    className="bg-gray-50 border-gray-300 text-gray-900 font-mono pr-10 w-full"
                    disabled={isSubmittingDelete}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePasscode((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showDeletePasscode ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {deleteError && (
                  <p
                    data-ocid={`polls.delete.error_state.${index}`}
                    className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" /> {deleteError}
                  </p>
                )}
              </div>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <AlertDialogCancel
                  data-ocid="polls.delete.cancel_button"
                  className="border-gray-300 text-gray-700 w-full sm:w-auto"
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  data-ocid="polls.delete.confirm_button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmittingDelete || !deletePasscode.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                >
                  {isSubmittingDelete ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Deleting...
                    </span>
                  ) : (
                    "Delete Poll"
                  )}
                </Button>
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
                <span className="text-gray-700 text-xs sm:text-sm">
                  {option}
                </span>
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
