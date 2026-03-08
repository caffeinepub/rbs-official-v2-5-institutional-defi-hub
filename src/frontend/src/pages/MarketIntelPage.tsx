import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Globe,
  Lock,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Unlock,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "../components/PageHead";
import SignalGeneratorWizard from "../components/SignalGeneratorWizard";
import SignalOutputCard from "../components/SignalOutputCard";
import { type SignalData, useGenerateSignal } from "../hooks/useGenerateSignal";
import { useGlobalSectionLock } from "../hooks/useGlobalSectionLock";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ── Real Binance API helpers ──────────────────────────────────────────────────

interface Kline {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

async function fetchKlines(
  symbol: string,
  interval: string,
  limit = 100,
): Promise<Kline[]> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  );
  if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
  const data: [string, string, string, string, string, string][] =
    await res.json();
  return data.map((k) => ({
    open: Number.parseFloat(k[1]),
    high: Number.parseFloat(k[2]),
    low: Number.parseFloat(k[3]),
    close: Number.parseFloat(k[4]),
    volume: Number.parseFloat(k[5]),
  }));
}

function calculateRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }
  const recentGains = gains.slice(-period);
  const recentLosses = losses.slice(-period);
  const avgGain = recentGains.reduce((a, b) => a + b, 0) / period;
  const avgLoss = recentLosses.reduce((a, b) => a + b, 0) / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateEMA(data: number[], period: number): number {
  if (data.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}

function calculateMACD(closes: number[]): number {
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  return ema12 - ema26;
}

interface SignalResult {
  signal: string;
  color: string;
  confidence: number;
  rsi: number;
  macd: number;
  ema: number;
  price: number;
  change24h?: number;
}

function determineSignal(
  rsi: number,
  macd: number,
  closes: number[],
): Pick<SignalResult, "signal" | "color" | "confidence"> {
  let score = 0;
  if (rsi < 30) score += 2;
  else if (rsi < 45) score += 1;
  else if (rsi > 70) score -= 2;
  else if (rsi > 55) score -= 1;

  if (macd > 0) score += 1;
  else score -= 1;

  if (closes.length >= 20) {
    const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    if (closes[closes.length - 1] > sma20) score += 1;
    else score -= 1;
  }

  if (score >= 3)
    return {
      signal: "Strong Buy",
      color: "#16a34a",
      confidence: Math.min(95, 70 + score * 5),
    };
  if (score >= 1)
    return {
      signal: "Buy",
      color: "#22c55e",
      confidence: Math.min(80, 60 + score * 5),
    };
  if (score === 0)
    return { signal: "Neutral", color: "#f59e0b", confidence: 50 };
  if (score >= -2)
    return {
      signal: "Sell",
      color: "#ef4444",
      confidence: Math.min(80, 60 + Math.abs(score) * 5),
    };
  return {
    signal: "Strong Sell",
    color: "#dc2626",
    confidence: Math.min(95, 70 + Math.abs(score) * 5),
  };
}

// Map asset names to Binance symbols
const BINANCE_SYMBOL_MAP: Record<string, string> = {
  "BTC/USDT": "BTCUSDT",
  "ETH/USDT": "ETHUSDT",
  "BNB/USDT": "BNBUSDT",
  "XRP/USDT": "XRPUSDT",
  "SOL/USDT": "SOLUSDT",
  "ADA/USDT": "ADAUSDT",
  "DOGE/USDT": "DOGEUSDT",
  "DOT/USDT": "DOTUSDT",
  BTCUSDT: "BTCUSDT",
  ETHUSDT: "ETHUSDT",
  Bitcoin: "BTCUSDT",
  Ethereum: "ETHUSDT",
  Solana: "SOLUSDT",
};

// Interval map from user-facing to Binance intervals
const INTERVAL_MAP: Record<string, string> = {
  "1M": "1m",
  "5M": "5m",
  "15M": "15m",
  "30M": "30m",
  "1H": "1h",
  "4H": "4h",
  "1D": "1d",
};

interface LiveSignalItem {
  asset: string;
  signal: string;
  confidence: number;
  rsi?: number;
  macd?: number;
  ema?: number;
  price?: number;
  change24h?: number;
  color?: string;
}

const LIVE_ASSETS = [
  { id: "BTCUSDT", label: "BTC" },
  { id: "ETHUSDT", label: "ETH" },
  { id: "BNBUSDT", label: "BNB" },
  { id: "SOLUSDT", label: "SOL" },
  { id: "XRPUSDT", label: "XRP" },
  { id: "ADAUSDT", label: "ADA" },
  { id: "DOGEUSDT", label: "DOGE" },
];

async function computeLiveSignal(
  symbol: string,
  label: string,
): Promise<LiveSignalItem> {
  try {
    const klines = await fetchKlines(symbol, "1h", 100);
    const closes = klines.map((k) => k.close);
    const price = closes[closes.length - 1];
    const rsi = calculateRSI(closes);
    const macd = calculateMACD(closes);
    const ema = calculateEMA(closes, 20);
    const change24h =
      closes.length >= 24
        ? ((price - closes[closes.length - 25]) / closes[closes.length - 25]) *
          100
        : 0;
    const { signal, color, confidence } = determineSignal(rsi, macd, closes);
    return {
      asset: label,
      signal,
      confidence,
      rsi,
      macd,
      ema,
      price,
      change24h,
      color,
    };
  } catch {
    return { asset: label, signal: "N/A", confidence: 0 };
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MarketIntelPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Global section lock — synced across all users
  const {
    isUnlocked,
    isLoading: lockLoading,
    setLock,
    refresh: refreshLock,
  } = useGlobalSectionLock("marketIntel");

  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  const [showLockPrompt, setShowLockPrompt] = useState(false);
  const [lockPasscode, setLockPasscode] = useState("");
  const [lockError, setLockError] = useState("");
  const [isLocking, setIsLocking] = useState(false);
  const [showLockPasscode, setShowLockPasscode] = useState(false);

  const [generatedSignal, setGeneratedSignal] = useState<SignalData | null>(
    null,
  );
  const [signalError, setSignalError] = useState<string | null>(null);

  const [liveSignals, setLiveSignals] = useState<LiveSignalItem[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateSignalMutation = useGenerateSignal();

  const fetchLiveSignals = useCallback(async () => {
    setLiveLoading(true);
    try {
      const results = await Promise.all(
        LIVE_ASSETS.map((a) => computeLiveSignal(a.id, a.label)),
      );
      setLiveSignals(results);
      setLastUpdated(new Date());
    } catch {
      // keep previous
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;
    fetchLiveSignals();
    const interval = setInterval(fetchLiveSignals, 10000);
    return () => clearInterval(interval);
  }, [isUnlocked, fetchLiveSignals]);

  const handleUnlock = async () => {
    if (!passcode.trim()) {
      setPasscodeError("Please enter the passcode");
      return;
    }
    setIsVerifying(true);
    setPasscodeError("");
    try {
      // Globally unlock for all users
      await setLock(passcode.trim(), true);
      setPasscode("");
      toast.success("G-MAN Intel unlocked globally for all users");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("passcode") ||
        msg.toLowerCase().includes("wrong")
      ) {
        setPasscodeError("Invalid passcode. Access denied.");
      } else {
        setPasscodeError("Verification failed. Please try again.");
      }
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
    setIsLocking(true);
    setLockError("");
    try {
      // Globally lock for all users
      await setLock(lockPasscode.trim(), false);
      setShowLockPrompt(false);
      setLockPasscode("");
      toast.success("G-MAN Intel locked globally for all users");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("passcode") ||
        msg.toLowerCase().includes("wrong")
      ) {
        setLockError("Invalid passcode. Cannot lock.");
      } else {
        setLockError("Lock failed. Please try again.");
      }
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
    const binanceSymbol = BINANCE_SYMBOL_MAP[asset] ?? asset;
    const interval = INTERVAL_MAP[timeframe] ?? "1h";
    try {
      const klines = await fetchKlines(binanceSymbol, interval, 100);
      const closes = klines.map((k) => k.close);
      const rsi = calculateRSI(closes);
      const macd = calculateMACD(closes);
      const ema = calculateEMA(closes, 20);
      const { signal, confidence } = determineSignal(rsi, macd, closes);
      const sma200 =
        closes.slice(-Math.min(200, closes.length)).reduce((a, b) => a + b, 0) /
        Math.min(200, closes.length);
      const bollingerSlice = closes.slice(-20);
      const bbMid = bollingerSlice.reduce((a, b) => a + b, 0) / 20;
      const bbStd = Math.sqrt(
        bollingerSlice.reduce((sum, c) => sum + (c - bbMid) ** 2, 0) / 20,
      );
      const syntheticResult: SignalData = {
        asset,
        timeframe,
        signal,
        confidence,
        trendDirection: macd > 0 ? "Bullish" : "Bearish",
        indicators: {
          rsi,
          macd,
          macdSignal: 0,
          macdHistogram: 0,
          ema20: ema,
          ema50: calculateEMA(closes, 50),
          sma200,
          bollingerUpper: bbMid + 2 * bbStd,
          bollingerLower: bbMid - 2 * bbStd,
          bollingerMid: bbMid,
          atr: 0,
          volumeRatio: 1,
          support: Math.min(...closes.slice(-20)),
          resistance: Math.max(...closes.slice(-20)),
          momentum:
            closes.length >= 10
              ? closes[closes.length - 1] - closes[closes.length - 10]
              : 0,
        },
        summary: `${asset} showing ${signal} on ${timeframe}. RSI: ${rsi.toFixed(1)}, MACD: ${macd > 0 ? "bullish" : "bearish"}, EMA20: ${ema.toFixed(2)}.`,
        calculatedAt: Date.now(),
      };
      setGeneratedSignal(syntheticResult);
    } catch {
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
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (lockLoading) {
    return (
      <>
        <PageHead
          title="G-MAN Intel | RBS"
          description="Access G-MAN Intelligence signals with passcode"
        />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading system status...</p>
          </div>
        </div>
      </>
    );
  }

  // ── Lock Screen ──────────────────────────────────────────────────────────
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
            background:
              "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8faff 100%)",
          }}
        >
          {/* Decorative orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(14, 165, 233, 0.08)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(14, 165, 233, 0.05)" }}
          />

          <div className="relative z-10 w-full max-w-md mx-auto px-3 sm:px-4">
            <div
              className="rounded-2xl p-8 shadow-xl"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(14, 165, 233, 0.25)",
                boxShadow:
                  "0 8px 40px rgba(14, 165, 233, 0.1), 0 20px 60px rgba(0,0,0,0.08)",
              }}
            >
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <img
                  src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
                  alt="G-MAN Intelligence"
                  className="w-20 h-20 mb-4 drop-shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  G-MAN Intel
                </h1>
                <p className="text-gray-500 text-sm mt-1 text-center">
                  Advanced Market Intelligence System
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600/80 text-xs font-mono uppercase tracking-widest">
                    Secured Access
                  </span>
                </div>
              </div>

              {!isAuthenticated && (
                <div
                  className="mb-4 p-3 rounded-lg flex items-center gap-2"
                  style={{
                    background: "rgba(14, 165, 233, 0.06)",
                    border: "1px solid rgba(14, 165, 233, 0.2)",
                  }}
                >
                  <AlertTriangle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-emerald-700 text-xs">
                    Please log in to access G-MAN Intel
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="market-intel-passcode"
                    className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2 block"
                  >
                    Enter Passcode
                  </label>
                  <div className="relative">
                    <Input
                      id="market-intel-passcode"
                      data-ocid="market-intel.passcode.input"
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setPasscodeError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                      placeholder="Enter your passcode"
                      className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 pr-10 font-mono"
                      disabled={!isAuthenticated || isVerifying}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasscode ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passcodeError && (
                    <p
                      data-ocid="market-intel.passcode.error_state"
                      className="text-red-500 text-xs mt-2 flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" /> {passcodeError}
                    </p>
                  )}
                </div>

                <Button
                  data-ocid="market-intel.unlock.button"
                  onClick={handleUnlock}
                  disabled={!isAuthenticated || isVerifying || !passcode.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wider"
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

              <div
                className="mt-6 pt-6 grid grid-cols-3 gap-3 text-center"
                style={{ borderTop: "1px solid rgba(14, 165, 233, 0.1)" }}
              >
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
                    className="flex flex-col items-center gap-1 text-emerald-600/70"
                  >
                    {f.icon}
                    <span className="text-xs text-gray-500">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Unlocked View ────────────────────────────────────────────────────────
  return (
    <>
      <PageHead
        title="G-MAN Intel | RBS"
        description="Real-time market intelligence signals"
      />

      {/* Lock Prompt Modal */}
      {showLockPrompt && (
        <div
          data-ocid="market-intel.dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
            style={{
              background: "rgba(255, 255, 255, 0.98)",
              border: "1px solid rgba(14, 165, 233, 0.25)",
            }}
          >
            <h3 className="text-gray-900 font-bold text-lg mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" /> Lock G-MAN Intel
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Enter your passcode to globally lock the system for all users.
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
                className="bg-gray-50 border-gray-300 text-gray-900 pr-10 font-mono"
                disabled={isLocking}
              />
              <button
                type="button"
                onClick={() => setShowLockPasscode((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showLockPasscode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {lockError && (
              <p
                data-ocid="market-intel.lock.error_state"
                className="text-red-500 text-xs mb-3 flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" /> {lockError}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                data-ocid="market-intel.lock.confirm_button"
                onClick={handleLockConfirm}
                disabled={isLocking || !lockPasscode.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                {isLocking ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm Lock"
                )}
              </Button>
              <Button
                data-ocid="market-intel.lock.cancel_button"
                variant="outline"
                onClick={() => {
                  setShowLockPrompt(false);
                  setLockPasscode("");
                  setLockError("");
                }}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <div
          className="backdrop-blur-md sticky top-16 z-40"
          style={{
            borderBottom: "1px solid rgba(14, 165, 233, 0.15)",
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
                alt="G-MAN"
                className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="min-w-0">
                <h1 className="text-gray-900 font-bold text-base sm:text-lg leading-none">
                  G-MAN Intel
                </h1>
                <p className="text-gray-400 text-xs hidden sm:block">
                  Advanced Market Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-end">
              <Badge
                variant="outline"
                className="border-green-400 text-green-600 text-xs bg-green-50"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse inline-block" />
                Live
              </Badge>
              {lastUpdated && (
                <span className="text-gray-400 text-xs hidden md:block">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              {/* Global unlock indicator — prominent */}
              <Badge
                variant="outline"
                className="border-emerald-400 text-emerald-600 text-xs bg-emerald-50"
              >
                <Globe className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Globally </span>Unlocked
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void fetchLiveSignals();
                  void refreshLock();
                }}
                className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs"
              >
                <RefreshCw
                  className={`w-3 h-3 mr-1 ${liveLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLockRequest}
                className="border-gray-300 text-gray-500 hover:bg-gray-50 text-xs"
              >
                <Lock className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Lock</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Global unlock banner */}
        <div
          className="w-full px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium"
          style={{
            background:
              "linear-gradient(90deg, rgba(16,185,129,0.07) 0%, rgba(6,182,212,0.09) 50%, rgba(16,185,129,0.07) 100%)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-emerald-700 text-center">
            Market Intel is globally unlocked — all users can access without
            individual passcode
          </span>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
            Globally Active
          </Badge>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
          {/* Live Signals Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Live Market Signals
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Real Binance API kline data — RSI + MACD + EMA calculated
                  live. Auto-refreshes every 10s.
                </p>
              </div>
            </div>

            {liveLoading && liveSignals.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {["m1", "m2", "m3", "m4", "m5", "m6", "m7"].map((sk) => (
                  <div
                    key={sk}
                    className="h-48 rounded-xl animate-pulse bg-gray-100"
                  />
                ))}
              </div>
            ) : liveSignals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {liveSignals.map((signal) => (
                  <LiveSignalCard key={signal.asset} signal={signal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Loading live signals from Binance...</p>
              </div>
            )}
          </section>

          {/* Gradient Divider */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(14,165,233,0.3), transparent)",
            }}
          />

          {/* Signal Generator */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Signal Generator
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Generate detailed technical analysis — powered by real Binance
                kline data
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
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

          {/* Gradient Divider */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(14,165,233,0.3), transparent)",
            }}
          />

          {/* Top 10 Cryptocurrencies */}
          <TopCryptoSection />

          {/* Gradient Divider */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(14,165,233,0.3), transparent)",
            }}
          />

          {/* Forex & Metals Snapshot */}
          <ForexMetalsSection />
        </div>
      </div>
    </>
  );
}

// ── Live Signal Card ──────────────────────────────────────────────────────────

function LiveSignalCard({ signal }: { signal: LiveSignalItem }) {
  const isBuy = signal.signal.toLowerCase().includes("buy");
  const isSell = signal.signal.toLowerCase().includes("sell");

  const borderColor = isBuy
    ? "rgba(34, 197, 94, 0.3)"
    : isSell
      ? "rgba(239, 68, 68, 0.3)"
      : "rgba(14, 165, 233, 0.3)";

  const textColor = isBuy
    ? "text-green-600"
    : isSell
      ? "text-red-600"
      : "text-emerald-600";

  const barBg = isBuy ? "#22c55e" : isSell ? "#ef4444" : "#0ea5e9";
  const bgColor = isBuy
    ? "rgba(240, 253, 244, 0.8)"
    : isSell
      ? "rgba(254, 242, 242, 0.8)"
      : "rgba(240, 249, 255, 0.8)";

  return (
    <div
      className="rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: barBg,
            }}
          >
            {signal.asset.slice(0, 3)}
          </div>
          <span className="font-bold text-gray-900 text-sm">
            {signal.asset}
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${textColor}`}
          style={{ background: `${barBg}18`, border: `1px solid ${barBg}30` }}
        >
          {signal.signal}
        </span>
      </div>

      {signal.price !== undefined && (
        <div className="mb-2">
          <span className="text-gray-900 font-mono text-sm">
            $
            {signal.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {signal.change24h !== undefined && (
            <span
              className={`ml-2 text-xs ${signal.change24h >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {signal.change24h >= 0 ? "+" : ""}
              {signal.change24h.toFixed(2)}%
            </span>
          )}
        </div>
      )}

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Confidence</span>
          <span className="font-bold text-gray-700">{signal.confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden bg-gray-200">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${signal.confidence}%`, background: barBg }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-xs">
        {signal.rsi !== undefined && (
          <div className="rounded p-1 text-center bg-white/70">
            <div className="text-gray-400">RSI</div>
            <div className="text-gray-800 font-mono">
              {signal.rsi.toFixed(1)}
            </div>
          </div>
        )}
        {signal.macd !== undefined && (
          <div className="rounded p-1 text-center bg-white/70">
            <div className="text-gray-400">MACD</div>
            <div className="text-gray-800 font-mono">
              {signal.macd.toFixed(3)}
            </div>
          </div>
        )}
        {signal.ema !== undefined && (
          <div className="rounded p-1 text-center bg-white/70">
            <div className="text-gray-400">EMA</div>
            <div className="text-gray-800 font-mono">
              {signal.ema.toFixed(0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Top 10 Cryptocurrencies Section ──────────────────────────────────────────

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
}

function TopCryptoSection() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCoins = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      );
      if (!res.ok) throw new Error("API error");
      const data: CoinData[] = await res.json();
      setCoins(data);
      setLastUpdated(new Date());
    } catch {
      // keep previous
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, [fetchCoins]);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Top 10 Cryptocurrencies
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Live market cap data from CoinGecko — auto-refreshes every 30s
            {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCoins}
          disabled={loading}
          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs"
        >
          <RefreshCw
            className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading && coins.length === 0 ? (
        <div className="space-y-3" data-ocid="market-intel.top10.loading_state">
          {Array.from({ length: 5 }, (_, i) => i).map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              data-ocid="market-intel.top10.table"
            >
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">
                    Asset
                  </th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs">
                    24h %
                  </th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs hidden md:table-cell">
                    Market Cap
                  </th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs hidden lg:table-cell">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin, i) => {
                  const isPos = coin.price_change_percentage_24h >= 0;
                  return (
                    <motion.tr
                      key={coin.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      data-ocid={`market-intel.top10.row.${i + 1}`}
                    >
                      <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                        {coin.market_cap_rank}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <div>
                            <div className="font-bold text-gray-900 text-sm">
                              {coin.symbol.toUpperCase()}
                            </div>
                            <div className="text-gray-400 text-xs hidden sm:block">
                              {coin.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                        $
                        {coin.current_price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                        })}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold text-sm ${isPos ? "text-green-600" : "text-red-600"}`}
                      >
                        <span className="flex items-center justify-end gap-0.5">
                          {isPos ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {isPos ? "+" : ""}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500 text-xs hidden md:table-cell font-mono">
                        ${(coin.market_cap / 1e9).toFixed(1)}B
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500 text-xs hidden lg:table-cell font-mono">
                        ${(coin.total_volume / 1e9).toFixed(1)}B
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Forex & Metals Snapshot Section ──────────────────────────────────────────

interface ForexMetalItem {
  label: string;
  symbol: string;
  price: number | null;
  flag: string;
  change?: number;
}

function ForexMetalsSection() {
  const [items, setItems] = useState<ForexMetalItem[]>([
    { label: "Gold", symbol: "XAU/USD", price: null, flag: "🥇" },
    { label: "Silver", symbol: "XAG/USD", price: null, flag: "🥈" },
    { label: "EUR/USD", symbol: "EUR", price: null, flag: "🇪🇺" },
    { label: "GBP/USD", symbol: "GBP", price: null, flag: "🇬🇧" },
    { label: "JPY/USD", symbol: "JPY", price: null, flag: "🇯🇵" },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [goldRes, silverRes, forexRes] = await Promise.all([
        fetch("https://api.coinbase.com/v2/prices/XAU-USD/spot"),
        fetch("https://api.coinbase.com/v2/prices/XAG-USD/spot"),
        fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP,JPY",
        ),
      ]);

      const updates: Partial<Record<string, number>> = {};

      if (goldRes.ok) {
        const d = await goldRes.json();
        if (d?.data?.amount)
          updates["XAU/USD"] = Number.parseFloat(d.data.amount);
      }
      if (silverRes.ok) {
        const d = await silverRes.json();
        if (d?.data?.amount)
          updates["XAG/USD"] = Number.parseFloat(d.data.amount);
      }
      if (forexRes.ok) {
        const d = await forexRes.json();
        if (d?.rates) {
          if (d.rates.EUR) updates.EUR = 1 / d.rates.EUR;
          if (d.rates.GBP) updates.GBP = 1 / d.rates.GBP;
          if (d.rates.JPY) updates.JPY = 1 / d.rates.JPY;
        }
      }

      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          price: updates[item.symbol] ?? item.price,
        })),
      );
    } catch {
      // keep previous
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatPrice = (price: number | null, symbol: string): string => {
    if (price === null) return "Loading...";
    if (symbol === "XAU/USD")
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (symbol === "XAG/USD") return `$${price.toFixed(2)}`;
    if (symbol === "JPY") return price.toFixed(6);
    return price.toFixed(4);
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Forex &amp; Metals Snapshot
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Live gold, silver, and major forex pairs — auto-refreshes every 60s
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-emerald-300 hover:shadow-sm transition-all duration-300"
            data-ocid={`market-intel.forex.item.${i + 1}`}
          >
            <div className="text-3xl mb-2">{item.flag}</div>
            <div className="text-gray-900 font-bold text-sm">{item.label}</div>
            <div className="text-gray-400 text-xs mb-2">{item.symbol}</div>
            {loading && item.price === null ? (
              <div className="h-6 bg-gray-100 rounded animate-pulse mx-auto w-20" />
            ) : (
              <div className="font-mono font-bold text-emerald-600 text-sm">
                {formatPrice(item.price, item.symbol)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
