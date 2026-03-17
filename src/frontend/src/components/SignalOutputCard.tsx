import {
  Activity,
  AlertCircle,
  BarChart2,
  Clock,
  Cpu,
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
  barColor: string;
  badgeBg: string;
}

function getSignalStyle(signal: string): SignalStyle {
  switch (signal as SignalLabel) {
    case "Strong Buy":
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        icon: TrendingUp,
        barColor: "bg-emerald-500",
        badgeBg: "bg-emerald-100",
      };
    case "Buy":
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: TrendingUp,
        barColor: "bg-green-500",
        badgeBg: "bg-green-100",
      };
    case "Sell":
      return {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: TrendingDown,
        barColor: "bg-orange-500",
        badgeBg: "bg-orange-100",
      };
    case "Strong Sell":
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        icon: TrendingDown,
        barColor: "bg-red-500",
        badgeBg: "bg-red-100",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-600",
        icon: Minus,
        barColor: "bg-sky-400",
        badgeBg: "bg-gray-100",
      };
  }
}

function IndicatorRow({
  label,
  value,
  color,
  index,
}: { label: string; value: string; color?: string; index: number }) {
  return (
    <div
      className={`flex justify-between items-center py-2 px-3 rounded-lg ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span
        className={`text-xs font-mono font-bold ${color ?? "text-gray-800"}`}
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
      <div className="bg-white border border-sky-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              G-Man Intelligence
            </h3>
            <p className="text-xs text-gray-400">Analyzing market data...</p>
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              key={i}
              className="h-10 bg-gray-100 rounded-xl animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
          Running indicator calculations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-sky-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            G-Man Intelligence
          </h3>
        </div>
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-1">
              Signal Generation Failed
            </p>
            <p className="text-xs text-red-500">
              {error || "Unable to fetch market data. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white border border-sky-100 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-3">
          <Cpu className="w-7 h-7 text-sky-300" />
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-1">
          G-Man Intelligence
        </h3>
        <p className="text-xs text-gray-400 max-w-[220px]">
          Select an asset and timeframe, then generate a signal.
        </p>
      </div>
    );
  }

  const style = getSignalStyle(result.signal);
  const SignalIcon = style.icon;
  const { indicators } = result;

  return (
    <div className="bg-white border border-sky-100 rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              G-Man Intelligence
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              {result.asset} · {result.timeframe}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="font-mono">
            {new Date(result.calculatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Signal Badge */}
      <div
        className={`flex items-center justify-between p-4 rounded-2xl mb-5 border ${style.bg} ${style.border}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.badgeBg}`}
          >
            <SignalIcon className={`w-6 h-6 ${style.text}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              Signal
            </p>
            <p className={`text-2xl font-bold ${style.text}`}>
              {result.signal}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">
            Confidence
          </p>
          <p className={`text-3xl font-mono font-bold ${style.text}`}>
            {result.confidence}%
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span className="font-medium">Confidence Level</span>
          <span className="font-mono font-semibold">{result.confidence}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${style.barColor}`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Trend Direction */}
      <div className="flex items-center gap-2 mb-5 p-3 bg-sky-50 border border-sky-100 rounded-xl">
        <Activity className="w-4 h-4 text-sky-500" />
        <span className="text-xs text-gray-500 font-medium">
          Trend Direction:
        </span>
        <span className={`text-sm font-bold ${style.text}`}>
          {result.trendDirection}
        </span>
      </div>

      {/* Indicator Grid */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Indicator Readings
          </span>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <IndicatorRow
              label="RSI (14)"
              value={indicators.rsi.toFixed(1)}
              color={
                indicators.rsi > 70
                  ? "text-red-600"
                  : indicators.rsi < 30
                    ? "text-emerald-600"
                    : "text-gray-800"
              }
              index={0}
            />
            <IndicatorRow
              label="MACD"
              value={indicators.macd.toFixed(5)}
              color={indicators.macd > 0 ? "text-emerald-600" : "text-red-600"}
              index={1}
            />
            <IndicatorRow
              label="EMA (9)"
              value={indicators.ema9.toFixed(4)}
              index={2}
            />
            <IndicatorRow
              label="EMA (21)"
              value={indicators.ema21.toFixed(4)}
              color={
                indicators.ema9 > indicators.ema21
                  ? "text-emerald-600"
                  : "text-red-600"
              }
              index={3}
            />
            <IndicatorRow
              label="BB Upper"
              value={indicators.bollingerUpper.toFixed(4)}
              index={4}
            />
            <IndicatorRow
              label="BB Lower"
              value={indicators.bollingerLower.toFixed(4)}
              index={5}
            />
            <IndicatorRow
              label="ATR"
              value={indicators.atr.toFixed(5)}
              index={6}
            />
            <IndicatorRow
              label="Momentum"
              value={indicators.momentum.toFixed(5)}
              color={
                indicators.momentum > 0 ? "text-emerald-600" : "text-red-600"
              }
              index={7}
            />
            <IndicatorRow
              label="Support"
              value={indicators.support.toFixed(4)}
              color="text-emerald-600"
              index={8}
            />
            <IndicatorRow
              label="Resistance"
              value={indicators.resistance.toFixed(4)}
              color="text-red-600"
              index={9}
            />
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Analysis Summary
        </p>
        <p className="text-xs text-gray-700 leading-relaxed">
          {result.summary}
        </p>
      </div>

      <p className="text-[10px] text-gray-300 mt-3 text-center">
        Not financial advice. For educational purposes only.
      </p>
    </div>
  );
}
