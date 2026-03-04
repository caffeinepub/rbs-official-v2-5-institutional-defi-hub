import { ChevronRight, Cpu, RotateCcw } from "lucide-react";
import React, { useState } from "react";

interface MarketCategory {
  id: string;
  label: string;
  assets: string[];
  apiCategory: string;
}

const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: "crypto",
    label: "Top 10 Crypto",
    apiCategory: "crypto",
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
    assets: ["XAUUSD"],
  },
  {
    id: "silver",
    label: "Silver",
    apiCategory: "metal",
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

  return (
    <div className="gman-card rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gold-accent">
              G-Man Intelligence
            </h3>
            <p className="text-xs text-slate-400">AI Signal Generator</p>
          </div>
        </div>
        {selectedCategory && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-gold-accent transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Step 1: Market Category */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full bg-gold-gradient text-black text-xs font-bold flex items-center justify-center">
            1
          </span>
          <span className="text-sm font-semibold text-slate-200">
            Choose Market Type
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MARKET_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                selectedCategory?.id === cat.id
                  ? "bg-gold-gradient text-black border-transparent shadow-gold-sm"
                  : "bg-slate-800/60 text-slate-300 border-slate-700 hover:border-gold-accent/50 hover:text-gold-accent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Asset Selection */}
      {selectedCategory && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-gold-gradient text-black text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-sm font-semibold text-slate-200">
              Select Asset
            </span>
            {selectedAsset && (
              <span className="ml-auto text-xs text-gold-accent font-mono">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                  selectedAsset === asset
                    ? "bg-gold-gradient text-black border-transparent shadow-gold-sm"
                    : "bg-slate-800/60 text-slate-300 border-slate-700 hover:border-gold-accent/50 hover:text-gold-accent"
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
            <span className="w-5 h-5 rounded-full bg-gold-gradient text-black text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span className="text-sm font-semibold text-slate-200">
              Select Timeframe
            </span>
            {selectedTimeframe && (
              <span className="ml-auto text-xs text-gold-accent font-mono">
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
                className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all border min-w-[52px] ${
                  selectedTimeframe === tf
                    ? "bg-gold-gradient text-black border-transparent shadow-gold-sm"
                    : "bg-slate-800/60 text-slate-300 border-slate-700 hover:border-gold-accent/50 hover:text-gold-accent"
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
            ? "bg-gold-gradient text-black shadow-gold-md hover:shadow-gold-lg hover:scale-[1.01]"
            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
        <p className="text-center text-xs text-slate-500">
          {!selectedCategory
            ? "Select a market type to begin"
            : !selectedAsset
              ? "Select an asset"
              : "Select a timeframe"}
        </p>
      )}
    </div>
  );
}
