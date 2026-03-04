import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssetData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h?: number;
}

interface MarketHeatmapProps {
  data: AssetData[];
}

function getHeatColor(change: number): string {
  const abs = Math.abs(change);
  if (change > 0) {
    if (abs >= 5) return "bg-emerald-500/80 border-emerald-400";
    if (abs >= 2) return "bg-emerald-600/60 border-emerald-500";
    return "bg-emerald-700/40 border-emerald-600";
  }
  if (change < 0) {
    if (abs >= 5) return "bg-red-500/80 border-red-400";
    if (abs >= 2) return "bg-red-600/60 border-red-500";
    return "bg-red-700/40 border-red-600";
  }
  return "bg-zinc-700/40 border-zinc-600";
}

function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

function formatVolume(vol?: number): string {
  if (!vol) return "N/A";
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
  return `$${vol.toLocaleString()}`;
}

export function MarketHeatmap({ data }: MarketHeatmapProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-5 gap-2">
        {data.map((asset) => (
          <Tooltip key={asset.symbol}>
            <TooltipTrigger asChild>
              <div
                className={`relative flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${getHeatColor(asset.change24h)}`}
                style={{ minHeight: "80px" }}
              >
                <span className="text-white font-bold text-sm">
                  {asset.symbol}
                </span>
                <span
                  className={`text-xs font-semibold mt-1 ${asset.change24h >= 0 ? "text-emerald-200" : "text-red-200"}`}
                >
                  {asset.change24h >= 0 ? "+" : ""}
                  {asset.change24h.toFixed(2)}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 border border-zinc-700 text-white p-3 rounded-lg shadow-xl">
              <div className="space-y-1 text-sm">
                <div className="font-bold text-[var(--rbs-gold)]">
                  {asset.symbol}
                </div>
                <div>
                  Price:{" "}
                  <span className="text-white">{formatPrice(asset.price)}</span>
                </div>
                <div>
                  24h:{" "}
                  <span
                    className={
                      asset.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {asset.change24h >= 0 ? "+" : ""}
                    {asset.change24h.toFixed(2)}%
                  </span>
                </div>
                <div>
                  Volume:{" "}
                  <span className="text-zinc-300">
                    {formatVolume(asset.volume24h)}
                  </span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
