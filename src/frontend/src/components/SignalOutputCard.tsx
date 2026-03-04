import {
  Activity,
  AlertCircle,
  BarChart2,
  Clock,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import type { SignalData } from "../hooks/useGenerateSignal";

interface Props {
  data?: SignalData;
  isLoading?: boolean;
  error?: string | null;
}

type SignalLabel = "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";

interface SignalStyle {
  bg: string;
  border: string;
  text: string;
  icon: React.ElementType;
  glow: string;
}

function getSignalStyle(signal: string): SignalStyle {
  switch (signal as SignalLabel) {
    case "Strong Buy":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/50",
        text: "text-emerald-400",
        icon: TrendingUp,
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      };
    case "Buy":
      return {
        bg: "bg-green-500/10",
        border: "border-green-500/40",
        text: "text-green-400",
        icon: TrendingUp,
        glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]",
      };
    case "Sell":
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/40",
        text: "text-red-400",
        icon: TrendingDown,
        glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
      };
    case "Strong Sell":
      return {
        bg: "bg-rose-500/10",
        border: "border-rose-500/50",
        text: "text-rose-400",
        icon: TrendingDown,
        glow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
      };
    default:
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/40",
        text: "text-amber-400",
        icon: Minus,
        glow: "",
      };
  }
}

function IndicatorRow({
  label,
  value,
  color,
}: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span
        className={`text-xs font-mono font-semibold ${color ?? "text-slate-200"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function SignalOutputCard({
  data: result,
  isLoading,
  error,
}: Props) {
  if (isLoading) {
    return (
      <div className="gman-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
            alt="G-Man Intelligence"
            className="w-10 h-10 rounded-xl object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <h3 className="text-lg font-bold text-gold-accent">
              G-Man Intelligence
            </h3>
            <p className="text-xs text-slate-400">Analyzing market data...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
              key={i}
              className="h-8 bg-slate-800/60 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <div className="w-4 h-4 border-2 border-gold-accent/30 border-t-gold-accent rounded-full animate-spin" />
          Running indicator calculations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gman-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
            alt="G-Man Intelligence"
            className="w-10 h-10 rounded-xl object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <h3 className="text-lg font-bold text-gold-accent">
            G-Man Intelligence
          </h3>
        </div>
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">
              Signal Generation Failed
            </p>
            <p className="text-xs text-slate-400">
              {error || "Unable to fetch market data. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="gman-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <img
          src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
          alt="G-Man Intelligence"
          className="w-12 h-12 rounded-xl object-cover mb-3 opacity-50"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <h3 className="text-base font-bold text-gold-accent mb-1">
          G-Man Intelligence
        </h3>
        <p className="text-xs text-slate-500">
          Select an asset and timeframe, then generate a signal.
        </p>
      </div>
    );
  }

  const style = getSignalStyle(result.signal);
  const SignalIcon = style.icon;
  const { indicators } = result;

  return (
    <div
      className={`gman-card rounded-2xl p-6 border ${style.border} ${style.glow} transition-all`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/gman-intelligence-logo.dim_256x256.png"
            alt="G-Man Intelligence"
            className="w-10 h-10 rounded-xl object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <h3 className="text-lg font-bold text-gold-accent">
              G-Man Intelligence
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {result.asset} · {result.timeframe}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span className="font-mono">
              {new Date(result.calculatedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Signal Badge */}
      <div
        className={`flex items-center justify-between p-4 rounded-xl mb-5 ${style.bg} border ${style.border}`}
      >
        <div className="flex items-center gap-3">
          <SignalIcon className={`w-8 h-8 ${style.text}`} />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Signal
            </p>
            <p className={`text-2xl font-bold ${style.text}`}>
              {result.signal}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Confidence
          </p>
          <p className={`text-3xl font-mono font-bold ${style.text}`}>
            {result.confidence}%
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Confidence Level</span>
          <span className="font-mono">{result.confidence}%</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              result.signal === "Strong Buy" || result.signal === "Buy"
                ? "bg-gradient-to-r from-green-600 to-emerald-400"
                : result.signal === "Strong Sell" || result.signal === "Sell"
                  ? "bg-gradient-to-r from-red-600 to-rose-400"
                  : "bg-gradient-to-r from-amber-600 to-yellow-400"
            }`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Trend Direction */}
      <div className="flex items-center gap-2 mb-5 p-3 bg-slate-800/40 rounded-xl">
        <Activity className="w-4 h-4 text-gold-accent" />
        <span className="text-xs text-slate-400">Trend Direction:</span>
        <span className={`text-sm font-semibold ${style.text}`}>
          {result.trendDirection}
        </span>
      </div>

      {/* Indicator Grid */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-4 h-4 text-gold-accent" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Indicator Readings
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <IndicatorRow
            label="RSI (14)"
            value={indicators.rsi.toFixed(1)}
            color={
              indicators.rsi > 70
                ? "text-red-400"
                : indicators.rsi < 30
                  ? "text-emerald-400"
                  : "text-slate-200"
            }
          />
          <IndicatorRow
            label="MACD"
            value={indicators.macd.toFixed(5)}
            color={indicators.macd > 0 ? "text-emerald-400" : "text-red-400"}
          />
          <IndicatorRow label="EMA (20)" value={indicators.ema20.toFixed(4)} />
          <IndicatorRow
            label="EMA (50)"
            value={indicators.ema50.toFixed(4)}
            color={
              indicators.ema20 > indicators.ema50
                ? "text-emerald-400"
                : "text-red-400"
            }
          />
          <IndicatorRow
            label="BB Upper"
            value={indicators.bollingerUpper.toFixed(4)}
          />
          <IndicatorRow
            label="BB Lower"
            value={indicators.bollingerLower.toFixed(4)}
          />
          <IndicatorRow label="ATR" value={indicators.atr.toFixed(5)} />
          <IndicatorRow
            label="Momentum"
            value={indicators.momentum.toFixed(5)}
            color={
              indicators.momentum > 0 ? "text-emerald-400" : "text-red-400"
            }
          />
          <IndicatorRow
            label="Support"
            value={indicators.support.toFixed(4)}
            color="text-emerald-400"
          />
          <IndicatorRow
            label="Resistance"
            value={indicators.resistance.toFixed(4)}
            color="text-red-400"
          />
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="p-3 bg-slate-800/40 rounded-xl">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Analysis Summary
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          {result.summary}
        </p>
      </div>

      <p className="text-xs text-slate-600 mt-3 text-center">
        Not financial advice. For educational purposes only.
      </p>
    </div>
  );
}
