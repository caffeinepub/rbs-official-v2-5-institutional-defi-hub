import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Users } from 'lucide-react';
import { useGetMarketPulseTally, useVoteMarketPulse } from '../hooks/useMarketPulseVoting';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

type Sentiment = 'bullish' | 'bearish' | 'neutral';

const SESSION_KEY = 'market_pulse_vote';

export default function MarketPulseVoting() {
  const { identity } = useInternetIdentity();
  const { data: tally, isLoading, isRefetching } = useGetMarketPulseTally();
  const voteMutation = useVoteMarketPulse();
  const [userVote, setUserVote] = useState<Sentiment | null>(() => {
    try { return sessionStorage.getItem(SESSION_KEY) as Sentiment | null; } catch { return null; }
  });
  const [voteError, setVoteError] = useState('');

  useEffect(() => {
    if (userVote) {
      try { sessionStorage.setItem(SESSION_KEY, userVote); } catch { /* ignore */ }
    }
  }, [userVote]);

  const total = tally ? Number(tally.total) : 0;
  const bullish = tally ? Number(tally.bullish) : 0;
  const bearish = tally ? Number(tally.bearish) : 0;
  const neutral = tally ? Number(tally.neutral) : 0;

  const pct = (val: number) => total > 0 ? Math.round((val / total) * 100) : 0;

  const handleVote = async (sentiment: Sentiment) => {
    if (!identity) { setVoteError('Please log in to vote.'); return; }
    if (userVote === sentiment) return;
    setVoteError('');
    try {
      await voteMutation.mutateAsync(sentiment);
      setUserVote(sentiment);
    } catch (e: unknown) {
      setVoteError(e instanceof Error ? e.message : 'Vote failed. Please try again.');
    }
  };

  const buttons: { sentiment: Sentiment; label: string; icon: React.ElementType; activeClass: string; barClass: string }[] = [
    { sentiment: 'bullish', label: 'Bullish', icon: TrendingUp, activeClass: 'border-emerald-500 bg-emerald-500/20 text-emerald-400', barClass: 'bg-gradient-to-r from-emerald-600 to-emerald-400' },
    { sentiment: 'bearish', label: 'Bearish', icon: TrendingDown, activeClass: 'border-red-500 bg-red-500/20 text-red-400', barClass: 'bg-gradient-to-r from-red-600 to-red-400' },
    { sentiment: 'neutral', label: 'Neutral', icon: Minus, activeClass: 'border-slate-400 bg-slate-500/20 text-slate-300', barClass: 'bg-gradient-to-r from-slate-600 to-slate-400' },
  ];

  const counts = { bullish, bearish, neutral };

  return (
    <div className="gman-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
            <Users className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gold-accent">Market Pulse</h3>
            <p className="text-xs text-slate-400">Community Sentiment</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRefetching && <RefreshCw className="w-3.5 h-3.5 text-gold-accent animate-spin" />}
          <span className="text-xs text-slate-500 font-mono">{total} votes</span>
        </div>
      </div>

      {/* Voting Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {buttons.map(({ sentiment, label, icon: Icon, activeClass }) => {
          const isSelected = userVote === sentiment;
          const isDisabled = voteMutation.isPending;
          return (
            <button
              key={sentiment}
              onClick={() => handleVote(sentiment)}
              disabled={isDisabled || isSelected}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all font-semibold text-sm ${
                isSelected
                  ? `${activeClass} shadow-md scale-[1.02]`
                  : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              } disabled:cursor-not-allowed`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
              {isSelected && <span className="text-xs font-mono opacity-75">✓ Voted</span>}
            </button>
          );
        })}
      </div>

      {voteError && (
        <p className="text-xs text-red-400 mb-3 text-center">{voteError}</p>
      )}

      {/* Live Percentage Bars */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-slate-800/60 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {buttons.map(({ sentiment, label, barClass }) => {
            const count = counts[sentiment];
            const percentage = pct(count);
            const isSelected = userVote === sentiment;
            return (
              <div key={sentiment}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-semibold ${isSelected ? 'text-gold-accent' : 'text-slate-400'}`}>
                    {label} {isSelected && '(Your Vote)'}
                  </span>
                  <span className="font-mono text-slate-300">{percentage}% <span className="text-slate-500">({count})</span></span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-600 mt-4 text-center">
        Auto-refreshes every 10 seconds · One vote per session
      </p>
    </div>
  );
}
