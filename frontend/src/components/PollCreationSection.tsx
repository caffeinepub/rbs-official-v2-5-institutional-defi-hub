import React, { useState } from 'react';
import { Plus, Vote, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCommunityVoting } from '../hooks/useCommunityVoting';
import type { PollView } from '../backend';

const MARKET_INTEL_CODE = 'BP2420075112009BP';

function PollCard({ poll, onVote, isVoting }: { poll: PollView; onVote: (pollId: bigint, idx: number) => void; isVoting: boolean }) {
  const [voted, setVoted] = useState(false);
  const totalVotes = poll.votes.reduce((sum, kv) => sum + Number(kv.value), 0);

  const handleVote = (idx: number) => {
    if (voted) return;
    setVoted(true);
    onVote(poll.id, idx);
  };

  return (
    <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
      <p className="text-sm font-semibold text-slate-200 mb-3">{poll.question}</p>
      <div className="space-y-2">
        {poll.options.map((opt, idx) => {
          const voteKv = poll.votes.find((kv) => kv.key === opt);
          const count = voteKv ? Number(voteKv.value) : 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          return (
            <button
              key={opt}
              onClick={() => handleVote(idx)}
              disabled={voted || isVoting}
              className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                voted ? 'cursor-default' : 'hover:border-gold-accent/50 cursor-pointer'
              } border-slate-600 bg-slate-900/40`}
            >
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">{opt}</span>
                <span className="font-mono text-slate-400">{pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gold-gradient rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
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
  const { polls, isLoading, createPoll, castVote, isCreating, isVoting } = useCommunityVoting();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const addOption = () => {
    if (options.length < 6) setOptions([...options, '']);
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

  const handleCreate = async () => {
    setCreateError('');
    setCreateSuccess(false);
    const validOptions = options.filter((o) => o.trim());
    if (!question.trim()) { setCreateError('Please enter a question.'); return; }
    if (validOptions.length < 2) { setCreateError('Please add at least 2 options.'); return; }
    try {
      await createPoll(question.trim(), validOptions, MARKET_INTEL_CODE);
      setQuestion('');
      setOptions(['', '']);
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create poll.');
    }
  };

  return (
    <div className="gman-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
          <Vote className="w-5 h-5 text-black" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gold-accent">Community Polls</h3>
          <p className="text-xs text-slate-400">Create & vote on market polls</p>
        </div>
      </div>

      {/* Create Poll Form */}
      <div className="mb-5 p-4 bg-slate-800/40 border border-slate-700 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Create New Poll</p>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your poll question..."
          className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-accent/60 transition-colors"
        />
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-accent/60 transition-colors"
              />
              {options.length > 2 && (
                <button onClick={() => removeOption(idx)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button onClick={addOption} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-accent transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add Option
          </button>
        )}
        {createError && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            {createError}
          </div>
        )}
        {createSuccess && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Poll created successfully!
          </div>
        )}
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full py-2.5 rounded-xl bg-gold-gradient text-black text-sm font-bold flex items-center justify-center gap-2 hover:shadow-gold-sm transition-all disabled:opacity-50"
        >
          {isCreating ? (
            <><div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Creating...</>
          ) : (
            <><Plus className="w-4 h-4" />Create Poll</>
          )}
        </button>
      </div>

      {/* Existing Polls */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Polls</p>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : polls.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No polls yet. Create the first one!</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {polls.slice().reverse().map((poll) => (
              <PollCard key={String(poll.id)} poll={poll} onVote={castVote} isVoting={isVoting} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
