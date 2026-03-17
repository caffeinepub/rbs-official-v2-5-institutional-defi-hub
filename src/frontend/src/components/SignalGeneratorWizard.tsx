import { ChevronRight, Cpu, RotateCcw } from "lucide-react";
import { useState } from "react";

interface MarketCategory {
  id: string;
  label: string;
  assets: string[];
  apiCategory: string;
  emoji: string;
}

const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: "crypto",
    label: "Top 10 Crypto",
    apiCategory: "crypto",
    emoji: "₿",
    assets: [
      "BTC",
      "ETH",
      "BNB",
      "SOL",
      "XRP",
      "ADA",
      "DOGE",
      "AVAX",
      "DOT",
      "LINK",
    ],
  },
  {
    id: "forex",
    label: "Top 10 Forex",
    apiCategory: "forex",
    emoji: "💱",
    assets: [
      "EUR/USD",
      "GBP/USD",
      "USD/JPY",
      "USD/CHF",
      "AUD/USD",
      "USD/CAD",
      "NZD/USD",
      "EUR/GBP",
      "EUR/JPY",
      "GBP/JPY",
    ],
  },
  {
    id: "gold",
    label: "Gold",
    apiCategory: "metal",
    emoji: "🥇",
    assets: ["XAUUSD"],
  },
  {
    id: "silver",
    label: "Silver",
    apiCategory: "metal",
    emoji: "🥈",
    assets: ["XAGUSD"],
  },
];

const TIMEFRAMES = ["1M", "5M", "15M", "30M", "1H", "4H", "1D"];

interface Props {
  onGenerateSignal: (
    asset: string,
    timeframe: string,
    category: string,
  ) => void;
  isLoading: boolean;
}

export default function SignalGeneratorWizard({
  onGenerateSignal,
  isLoading,
}: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState<MarketCategory | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(
    null,
  );

  const handleCategorySelect = (cat: MarketCategory) => {
    setSelectedCategory(cat);
    setSelectedAsset(null);
    setSelectedTimeframe(null);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedAsset(null);
    setSelectedTimeframe(null);
  };

  const canGenerate = !!selectedAsset && !!selectedTimeframe;

  const currentStep = !selectedCategory
    ? 1
    : !selectedAsset
      ? 2
      : !selectedTimeframe
        ? 3
        : 4;

  return (
    <div className="bg-white border border-sky-100 rounded-2xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              G-Man Intelligence
            </h3>
            <p className="text-xs text-gray-400">AI Signal Generator</p>
          </div>
        </div>
        {selectedCategory && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-sky-600 transition-colors px-2 py-1 rounded-lg hover:bg-sky-50"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep > step
                  ? "bg-sky-500 text-white"
                  : currentStep === step
                    ? "bg-sky-500 text-white ring-4 ring-sky-100"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {currentStep > step ? "✓" : step}
            </div>
            {step < 3 && (
              <div
                className={`h-0.5 w-8 rounded-full transition-all ${
                  currentStep > step ? "bg-sky-500" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-gray-400">
          {currentStep === 1
            ? "Choose market"
            : currentStep === 2
              ? "Select asset"
              : currentStep === 3
                ? "Pick timeframe"
                : "Ready!"}
        </span>
      </div>

      {/* Step 1: Market Category */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
              currentStep > 1
                ? "bg-sky-500 text-white"
                : "bg-sky-500 text-white"
            }`}
          >
            1
          </span>
          <span className="text-sm font-semibold text-gray-700">
            Choose Market Type
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MARKET_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 flex items-center gap-2 ${
                selectedCategory?.id === cat.id
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-gray-100 bg-white text-gray-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Asset Selection */}
      {selectedCategory && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Select Asset
            </span>
            {selectedAsset && (
              <span className="ml-auto text-xs text-sky-600 font-mono font-bold bg-sky-50 px-2 py-0.5 rounded-md">
                {selectedAsset}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory.assets.map((asset) => (
              <button
                type="button"
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border-2 ${
                  selectedAsset === asset
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-gray-100 bg-white text-gray-600 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Timeframe */}
      {selectedAsset && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Select Timeframe
            </span>
            {selectedTimeframe && (
              <span className="ml-auto text-xs text-sky-600 font-mono font-bold bg-sky-50 px-2 py-0.5 rounded-md">
                {selectedTimeframe}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map((tf) => (
              <button
                type="button"
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all border-2 min-w-[52px] ${
                  selectedTimeframe === tf
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-gray-100 bg-white text-gray-600 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="button"
        onClick={() => {
          if (canGenerate && selectedCategory) {
            onGenerateSignal(
              selectedAsset!,
              selectedTimeframe!,
              selectedCategory.apiCategory,
            );
          }
        }}
        disabled={!canGenerate || isLoading}
        className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          canGenerate && !isLoading
            ? "bg-sky-500 hover:bg-sky-600 text-white shadow-sm hover:shadow-sky-200 hover:shadow-md"
            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing Market Data...
          </>
        ) : (
          <>
            <Cpu className="w-4 h-4" />
            Generate Signal
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>

      {!canGenerate && !isLoading && (
        <p className="text-center text-xs text-gray-400">
          {!selectedCategory
            ? "Select a market type to begin"
            : !selectedAsset
              ? "Select an asset to continue"
              : "Select a timeframe to generate"}
        </p>
      )}
    </div>
  );
}
