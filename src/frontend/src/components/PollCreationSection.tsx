import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
  Vote,
} from "lucide-react";
import React, { useState } from "react";
import type { PollView } from "../backend";
import { useCommunityVoting } from "../hooks/useCommunityVoting";

const MARKET_INTEL_CODE = "BP2420075112009BP";

function PollCard({
  poll,
  onVote,
  isVoting,
}: {
  poll: PollView;
  onVote: (pollId: bigint, idx: bigint) => void;
  isVoting: boolean;
}) {
  const [voted, setVoted] = useState(false);
  const totalVotes = poll.votes.reduce((sum, kv) => sum + Number(kv.value), 0);

  const handleVote = (idx: number) => {
    if (voted) return;
    setVoted(true);
    onVote(poll.id, BigInt(idx));
  };

  return (
    <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
      <p className="text-sm font-semibold text-slate-200 mb-3">
        {poll.question}
      </p>
      <div className="space-y-2">
        {poll.options.map((opt, idx) => {
          const voteKv = poll.votes.find((kv) => kv.key === opt);
          const count = voteKv ? Number(voteKv.value) : 0;
          const pct =
            totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => handleVote(idx)}
              disabled={voted || isVoting}
              className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                voted
                  ? "cursor-default"
                  : "hover:border-gold-accent/50 cursor-pointer"
              } border-slate-600 bg-slate-900/40`}
            >
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">{opt}</span>
                <span className="font-mono text-slate-400">{pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-gradient rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-600 mt-2">{totalVotes} total votes</p>
    </div>
  );
}

export default function PollCreationSection() {
  const {
    polls,
    isLoading: isLoadingPolls,
    createPoll,
    isCreating,
    voteOnPoll,
    isVoting,
  } = useCommunityVoting();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const addOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleVote = async (pollId: bigint, optionIndex: bigint) => {
    try {
      await voteOnPoll(pollId, optionIndex);
    } catch {
      // silently handled; PollCard tracks voted state locally
    }
  };

  const handleCreate = async () => {
    setCreateError("");
    setCreateSuccess(false);
    const validOptions = options.filter((o) => o.trim());
    if (!question.trim()) {
      setCreateError("Please enter a question.");
      return;
    }
    if (validOptions.length < 2) {
      setCreateError("Please add at least 2 options.");
      return;
    }
    try {
      await createPoll({
        question: question.trim(),
        options: validOptions,
        isActive: true,
        code: MARKET_INTEL_CODE,
      });
      setQuestion("");
      setOptions(["", ""]);
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : "Failed to create poll.");
    }
  };

  return (
    <div className="gman-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
          <Vote className="w-5 h-5 text-black" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gold-accent">
            Community Polls
          </h3>
          <p className="text-xs text-slate-400">
            Create &amp; vote on market polls
          </p>
        </div>
      </div>

      {/* Create Poll Form */}
      <div className="mb-5 p-4 bg-slate-800/40 border border-slate-700 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Create New Poll
        </p>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your poll question..."
          className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-accent/60 transition-colors"
        />
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: options are mutable form inputs requiring index-based keys
              key={idx}
              className="flex gap-2"
            >
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-accent/60 transition-colors"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-accent transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Option
          </button>
        )}
        {createError && (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {createError}
          </div>
        )}
        {createSuccess && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            Poll created successfully!
          </div>
        )}
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full py-2.5 bg-gold-gradient text-black text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Poll
            </>
          )}
        </button>
      </div>

      {/* Polls List */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Active Polls
        </p>
        {isLoadingPolls ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 text-gold-accent animate-spin" />
          </div>
        ) : polls.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No polls yet. Create the first one!
          </p>
        ) : (
          polls
            .slice(0, 3)
            .map((poll) => (
              <PollCard
                key={poll.id.toString()}
                poll={poll}
                onVote={handleVote}
                isVoting={isVoting}
              />
            ))
        )}
      </div>
    </div>
  );
}
