import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Shield,
  TrendingUp,
  Unlock,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHead } from "../components/PageHead";
import SignalGeneratorWizard from "../components/SignalGeneratorWizard";
import SignalOutputCard from "../components/SignalOutputCard";
import { useActor } from "../hooks/useActor";
import { type SignalData, useGenerateSignal } from "../hooks/useGenerateSignal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMarketIntelLive } from "../hooks/useMarketIntelLive";

export default function MarketIntelPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Passcode gate state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  // Lock prompt state
  const [showLockPrompt, setShowLockPrompt] = useState(false);
  const [lockPasscode, setLockPasscode] = useState("");
  const [lockError, setLockError] = useState("");
  const [isLocking, setIsLocking] = useState(false);
  const [showLockPasscode, setShowLockPasscode] = useState(false);

  // Signal generator state
  const [generatedSignal, setGeneratedSignal] = useState<SignalData | null>(
    null,
  );
  const [signalError, setSignalError] = useState<string | null>(null);

  const generateSignalMutation = useGenerateSignal();
  const {
    data: liveSignals,
    isLoading: liveLoading,
    refetch: refetchLive,
  } = useMarketIntelLive();

  const handleUnlock = async () => {
    if (!passcode.trim()) {
      setPasscodeError("Please enter the passcode");
      return;
    }
    if (!actor) {
      setPasscodeError("Please wait for the system to initialize");
      return;
    }
    setIsVerifying(true);
    setPasscodeError("");
    try {
      const valid = await actor.verifyMarketIntelPasscode(passcode.trim());
      if (valid) {
        setIsUnlocked(true);
        setPasscode("");
        toast.success("G-MAN Intel unlocked successfully");
      } else {
        setPasscodeError("Invalid passcode. Access denied.");
      }
    } catch {
      setPasscodeError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLockRequest = () => {
    setShowLockPrompt(true);
    setLockPasscode("");
    setLockError("");
  };

  const handleLockConfirm = async () => {
    if (!lockPasscode.trim()) {
      setLockError("Please enter the passcode to lock");
      return;
    }
    if (!actor) {
      setLockError("System not ready");
      return;
    }
    setIsLocking(true);
    setLockError("");
    try {
      const valid = await actor.verifyMarketIntelPasscode(lockPasscode.trim());
      if (valid) {
        setIsUnlocked(false);
        setShowLockPrompt(false);
        setLockPasscode("");
        toast.success("G-MAN Intel locked successfully");
      } else {
        setLockError("Invalid passcode. Cannot lock.");
      }
    } catch {
      setLockError("Verification failed. Please try again.");
    } finally {
      setIsLocking(false);
    }
  };

  const handleGenerateSignal = async (
    asset: string,
    timeframe: string,
    _category: string,
  ) => {
    setSignalError(null);
    try {
      const result = await generateSignalMutation.mutateAsync({
        asset,
        timeframe,
      });
      setGeneratedSignal(result);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Signal generation failed";
      setSignalError(msg);
      toast.error("Signal generation failed. Please try again.");
    }
  };

  // ── Lock Screen ──────────────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <>
        <PageHead
          title="G-MAN Intel | RBS"
          description="Access G-MAN Intelligence signals with passcode"
        />
        <div
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage:
              "url(/assets/generated/gman-intel-bg.dim_1200x800.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md mx-auto px-4">
            <div className="bg-black/60 border border-amber-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-amber-500/10">
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <img
                  src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
                  alt="G-MAN Intelligence"
                  className="w-20 h-20 mb-4 drop-shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <h1 className="text-3xl font-bold text-amber-400 tracking-wider">
                  G-MAN Intel
                </h1>
                <p className="text-amber-200/60 text-sm mt-1 text-center">
                  Advanced Market Intelligence System
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-500/80 text-xs font-mono uppercase tracking-widest">
                    Secured Access
                  </span>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="mb-4 p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-amber-300 text-xs">
                    Please log in to access G-MAN Intel
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="market-intel-passcode"
                    className="text-amber-300/80 text-xs font-mono uppercase tracking-widest mb-2 block"
                  >
                    Enter Passcode
                  </label>
                  <div className="relative">
                    <Input
                      id="market-intel-passcode"
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setPasscodeError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                      placeholder="••••••••••••••••"
                      className="bg-black/40 border-amber-500/30 text-amber-100 placeholder:text-amber-900/50 pr-10 font-mono"
                      disabled={!isAuthenticated || isVerifying}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-400"
                    >
                      {showPasscode ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passcodeError && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {passcodeError}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUnlock}
                  disabled={!isAuthenticated || isVerifying || !passcode.trim()}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold tracking-wider"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Unlock className="w-4 h-4" /> Unlock G-MAN Intel
                    </span>
                  )}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-amber-500/10 grid grid-cols-3 gap-3 text-center">
                {[
                  {
                    icon: <TrendingUp className="w-4 h-4" />,
                    label: "Real-Time Signals",
                  },
                  { icon: <Zap className="w-4 h-4" />, label: "AI-Powered" },
                  {
                    icon: <Shield className="w-4 h-4" />,
                    label: "Secure Access",
                  },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col items-center gap-1 text-amber-500/60"
                  >
                    {f.icon}
                    <span className="text-xs">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Unlocked View ────────────────────────────────────────────────────────────
  return (
    <>
      <PageHead
        title="G-MAN Intel | RBS"
        description="Real-time market intelligence signals"
      />

      {/* Lock Prompt Modal */}
      {showLockPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-amber-400 font-bold text-lg mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5" /> Lock G-MAN Intel
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Enter your passcode to lock the system.
            </p>
            <div className="relative mb-3">
              <Input
                type={showLockPasscode ? "text" : "password"}
                value={lockPasscode}
                onChange={(e) => {
                  setLockPasscode(e.target.value);
                  setLockError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLockConfirm()}
                placeholder="Enter passcode"
                className="bg-black/40 border-amber-500/30 text-amber-100 pr-10 font-mono"
                disabled={isLocking}
              />
              <button
                type="button"
                onClick={() => setShowLockPasscode((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-400"
              >
                {showLockPasscode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {lockError && (
              <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {lockError}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleLockConfirm}
                disabled={isLocking || !lockPasscode.trim()}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                {isLocking ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm Lock"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowLockPrompt(false);
                  setLockPasscode("");
                  setLockError("");
                }}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
        {/* Header */}
        <div className="border-b border-amber-500/20 bg-black/40 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
                alt="G-MAN"
                className="w-8 h-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <h1 className="text-amber-400 font-bold text-lg leading-none">
                  G-MAN Intel
                </h1>
                <p className="text-amber-500/50 text-xs">
                  Advanced Market Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-green-500/50 text-green-400 text-xs"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse inline-block" />
                Live
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLockRequest}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs"
              >
                <Lock className="w-3 h-3 mr-1" /> Lock
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
          {/* Live Signals Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-amber-400">
                  Live Market Signals
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Real-time signals for crypto and precious metals — refreshes
                  every 30s
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchLive()}
                className="text-amber-400 hover:bg-amber-500/10"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${liveLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {liveLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(["m1", "m2", "m3", "m4", "m5", "m6", "m7"] as const).map(
                  (sk) => (
                    <div
                      key={sk}
                      className="h-48 bg-gray-800/50 rounded-xl animate-pulse border border-gray-700/30"
                    />
                  ),
                )}
              </div>
            ) : liveSignals && liveSignals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {liveSignals.map((signal) => (
                  <LiveSignalCard key={signal.asset} signal={signal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Loading live signals...</p>
              </div>
            )}
          </section>

          {/* Gradient Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Signal Generator */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-400">
                Signal Generator
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Generate detailed technical analysis for any asset
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <SignalGeneratorWizard
                  onGenerateSignal={handleGenerateSignal}
                  isLoading={generateSignalMutation.isPending}
                />
              </div>
              <div>
                <SignalOutputCard
                  data={generatedSignal ?? undefined}
                  isLoading={generateSignalMutation.isPending}
                  error={signalError}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// ── Live Signal Card ──────────────────────────────────────────────────────────

interface LiveSignalItem {
  asset: string;
  signal: string;
  confidence: number;
  rsi?: number;
  macd?: number;
  ema?: number;
  price?: number;
  change24h?: number;
}

function LiveSignalCard({ signal }: { signal: LiveSignalItem }) {
  const isBuy = signal.signal.toLowerCase().includes("buy");
  const isSell = signal.signal.toLowerCase().includes("sell");
  const cardClass = isBuy
    ? "text-green-400 border-green-500/30 bg-green-500/5"
    : isSell
      ? "text-red-400 border-red-500/30 bg-red-500/5"
      : "text-amber-400 border-amber-500/30 bg-amber-500/5";

  const barClass = isBuy
    ? "bg-green-400"
    : isSell
      ? "bg-red-400"
      : "bg-amber-400";

  const isGold =
    signal.asset === "XAU" ||
    signal.asset === "GOLD" ||
    signal.asset === "XAUUSD";
  const isSilver =
    signal.asset === "XAG" ||
    signal.asset === "SILVER" ||
    signal.asset === "XAGUSD";

  return (
    <div
      className={`border rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10 ${cardClass}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isGold ? (
            <img
              src="/assets/generated/gold-signal-icon.dim_128x128.png"
              alt="Gold"
              className="w-7 h-7 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : isSilver ? (
            <img
              src="/assets/generated/silver-signal-icon.dim_128x128.png"
              alt="Silver"
              className="w-7 h-7 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
              {signal.asset.slice(0, 2)}
            </div>
          )}
          <span className="font-bold text-white text-sm">{signal.asset}</span>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cardClass}`}
        >
          {signal.signal}
        </span>
      </div>

      {signal.price !== undefined && (
        <div className="mb-2">
          <span className="text-white font-mono text-sm">
            $
            {signal.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {signal.change24h !== undefined && (
            <span
              className={`ml-2 text-xs ${signal.change24h >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {signal.change24h >= 0 ? "+" : ""}
              {signal.change24h.toFixed(2)}%
            </span>
          )}
        </div>
      )}

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Confidence</span>
          <span className="font-bold">{signal.confidence}%</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barClass}`}
            style={{ width: `${signal.confidence}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-xs">
        {signal.rsi !== undefined && (
          <div className="bg-black/20 rounded p-1 text-center">
            <div className="text-gray-500">RSI</div>
            <div className="text-white font-mono">{signal.rsi.toFixed(1)}</div>
          </div>
        )}
        {signal.macd !== undefined && (
          <div className="bg-black/20 rounded p-1 text-center">
            <div className="text-gray-500">MACD</div>
            <div className="text-white font-mono">{signal.macd.toFixed(2)}</div>
          </div>
        )}
        {signal.ema !== undefined && (
          <div className="bg-black/20 rounded p-1 text-center">
            <div className="text-gray-500">EMA</div>
            <div className="text-white font-mono">{signal.ema.toFixed(0)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
