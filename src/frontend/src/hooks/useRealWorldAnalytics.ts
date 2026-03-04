import { useQuery } from "@tanstack/react-query";

export interface GlobalMarketData {
  totalMarketCap: number;
  btcDominance: number;
  ethDominance: number;
  totalVolume24h: number;
  marketCapChange24h: number;
  activeCryptocurrencies: number;
  lastUpdated: Date;
  trendUp: boolean;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}

export function useRealWorldAnalytics() {
  return useQuery<GlobalMarketData>({
    queryKey: ["realWorldAnalytics"],
    queryFn: async () => {
      const res = await fetch("https://api.coingecko.com/api/v3/global");
      if (!res.ok) throw new Error("Failed to fetch global market data");
      const data = await res.json();
      const d = data.data ?? {};

      const totalMarketCap = d.total_market_cap?.usd ?? 0;
      const btcDominance = d.market_cap_percentage?.btc ?? 0;
      const ethDominance = d.market_cap_percentage?.eth ?? 0;
      const totalVolume24h = d.total_volume?.usd ?? 0;
      const marketCapChange24h = d.market_cap_change_percentage_24h_usd ?? 0;
      const activeCryptocurrencies = d.active_cryptocurrencies ?? 0;

      return {
        totalMarketCap,
        btcDominance,
        ethDominance,
        totalVolume24h,
        marketCapChange24h,
        activeCryptocurrencies,
        lastUpdated: new Date(),
        trendUp: marketCapChange24h >= 0,
      };
    },
    refetchInterval: 60000,
    staleTime: 55000,
    retry: 2,
  });
}
