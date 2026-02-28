import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useHasMarketIntelAccess, useGrantMarketIntelAccess } from '../hooks/useQueries';
import { SmokySectionTransition } from '../components/SmokySectionTransition';
import { PageHead } from '../components/PageHead';
import { Lock, Eye, EyeOff, RefreshCw, Cpu, Shield } from 'lucide-react';
import SignalGeneratorWizard from '../components/SignalGeneratorWizard';
import SignalOutputCard from '../components/SignalOutputCard';
import MarketPulseVoting from '../components/MarketPulseVoting';
import ContactInfoSection from '../components/ContactInfoSection';
import PollCreationSection from '../components/PollCreationSection';
import { useGenerateSignal } from '../hooks/useGenerateSignal';

export default function MarketIntelPage() {
  const { identity } = useInternetIdentity();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');

  const { data: hasAccess, isLoading: accessLoading } = useHasMarketIntelAccess();
  const grantAccess = useGrantMarketIntelAccess();
  const signalMutation = useGenerateSignal();

  const handleUnlock = async () => {
    setError('');
    try {
      await grantAccess.mutateAsync(passcode);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid passcode');
    }
  };

  const handleGenerateSignal = (asset: string, timeframe: string, category: string) => {
    signalMutation.mutate({ asset, timeframe, category });
  };

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!identity) {
    return (
      <div className="min-h-screen market-intel-bg flex items-center justify-center px-4">
        <PageHead title="Market Intelligence | RBS" description="G-Man Intelligence — Real-time AI trading signals." />
        <div className="gman-card rounded-2xl p-8 text-center max-w-md w-full">
          <Lock className="w-12 h-12 text-gold-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gold-accent mb-2">Authentication Required</h2>
          <p className="text-slate-400 text-sm">Please log in to access Market Intelligence.</p>
        </div>
      </div>
    );
  }

  // ── Loading access check ───────────────────────────────────────────────────
  if (accessLoading) {
    return (
      <div className="min-h-screen market-intel-bg flex items-center justify-center">
        <PageHead title="Market Intelligence | RBS" description="G-Man Intelligence — Real-time AI trading signals." />
        <div className="gman-card rounded-2xl p-8 text-center">
          <RefreshCw className="w-8 h-8 text-gold-accent mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">Checking access...</p>
        </div>
      </div>
    );
  }

  // ── Passcode gate ──────────────────────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div className="min-h-screen market-intel-bg flex items-center justify-center px-4">
        <PageHead title="Market Intelligence | RBS" description="G-Man Intelligence — Real-time AI trading signals." />
        <div className="gman-card rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold-md">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-gold-accent mb-1">Market Intelligence</h2>
            <p className="text-slate-400 text-sm">Powered by G-Man Intelligence AI</p>
            <p className="text-slate-500 text-xs mt-2">Enter your passcode to access live trading signals.</p>
          </div>
          <div className="relative mb-4">
            <input
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter passcode"
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-accent/60 focus:ring-1 focus:ring-gold-accent/30 transition-all pr-12"
            />
            <button
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-accent transition-colors"
            >
              {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <button
            onClick={handleUnlock}
            disabled={grantAccess.isPending || !passcode}
            className="w-full bg-gold-gradient text-black rounded-xl py-3 font-bold hover:shadow-gold-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {grantAccess.isPending ? (
              <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Verifying...</>
            ) : (
              <><Cpu className="w-4 h-4" />Unlock Access</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ── Unlocked Dashboard ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen market-intel-bg">
      <PageHead title="Market Intelligence | RBS" description="G-Man Intelligence — Real-time AI trading signals." />

      <SmokySectionTransition>
        <section className="py-12 px-4 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
                alt="G-Man Intelligence"
                className="w-12 h-12 rounded-xl object-cover shadow-gold-sm"
              />
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gold-accent">Market Intelligence</h1>
                <p className="text-slate-400 text-sm">Powered by G-Man Intelligence AI</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Data
              </span>
              <span className="text-xs text-slate-500">RSI · MACD · EMA · SMA · BB · ATR · Volume · Momentum</span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Signal Generator + Output */}
            <div className="space-y-6">
              <SignalGeneratorWizard
                onGenerateSignal={handleGenerateSignal}
                isLoading={signalMutation.isPending}
              />
              {(signalMutation.isPending || signalMutation.data || signalMutation.error) && (
                <SignalOutputCard
                  result={signalMutation.data ?? null}
                  isLoading={signalMutation.isPending}
                  error={signalMutation.error as Error | null}
                />
              )}
            </div>

            {/* Right Column: Market Pulse + Polls + Contact */}
            <div className="space-y-6">
              <MarketPulseVoting />
              <PollCreationSection />
              <ContactInfoSection />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 gman-card rounded-xl text-center">
            <p className="text-xs text-slate-500">
              G-Man Intelligence uses real-time public market data. All signals are for educational purposes only and do not constitute financial advice. Always do your own research.
            </p>
          </div>
        </section>
      </SmokySectionTransition>
    </div>
  );
}
