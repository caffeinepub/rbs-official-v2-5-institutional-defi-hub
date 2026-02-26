import { useQuery } from '@tanstack/react-query';

export interface LivePriceData {
  symbol: string;
  name: string;
  id: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
];

export function useLivePrice() {
  return useQuery<LivePriceData[]>({
    queryKey: ['livePrices'],
    queryFn: async () => {
      const ids = COINS.map((c) => c.id).join(',');
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );
      if (!res.ok) throw new Error('Failed to fetch prices');
      const data = await res.json();
      return COINS.map((coin) => ({
        symbol: coin.symbol,
        name: coin.name,
        id: coin.id,
        price: data[coin.id]?.usd ?? 0,
        change24h: data[coin.id]?.usd_24h_change ?? 0,
        marketCap: data[coin.id]?.usd_market_cap ?? 0,
        volume24h: data[coin.id]?.usd_24h_vol ?? 0,
      }));
    },
    refetchInterval: 7000,
    staleTime: 5000,
    retry: 2,
  });
}
