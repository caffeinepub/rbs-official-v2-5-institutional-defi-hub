import { useQuery } from '@tanstack/react-query';

export interface LivePriceAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  timestamp: number;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const METALS_API = 'https://api.metals.live/v1/spot';
const REFETCH_INTERVAL = 7000; // 7 seconds (within 5-10s range)

async function fetchCryptoPrices(): Promise<LivePriceAsset[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    
    const data = await response.json();
    
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: data.bitcoin?.usd || 0,
        change24h: data.bitcoin?.usd_24h_change || 0,
        timestamp: Date.now(),
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: data.ethereum?.usd || 0,
        change24h: data.ethereum?.usd_24h_change || 0,
        timestamp: Date.now(),
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        price: data.binancecoin?.usd || 0,
        change24h: data.binancecoin?.usd_24h_change || 0,
        timestamp: Date.now(),
      },
    ];
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
}

async function fetchMetalsPrices(): Promise<LivePriceAsset[]> {
  try {
    const response = await fetch(`${METALS_API}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metals prices');
    }
    
    const data = await response.json();
    
    // Calculate 24h change (metals API doesn't provide this, so we'll use 0 for now)
    return [
      {
        symbol: 'XAU',
        name: 'Gold',
        price: data.gold || 0,
        change24h: 0,
        timestamp: Date.now(),
      },
      {
        symbol: 'XAG',
        name: 'Silver',
        price: data.silver || 0,
        change24h: 0,
        timestamp: Date.now(),
      },
    ];
  } catch (error) {
    console.error('Error fetching metals prices:', error);
    throw error;
  }
}

export function useLivePrice() {
  return useQuery<LivePriceAsset[]>({
    queryKey: ['livePrice'],
    queryFn: async () => {
      const [cryptoPrices, metalsPrices] = await Promise.all([
        fetchCryptoPrices(),
        fetchMetalsPrices(),
      ]);
      return [...cryptoPrices, ...metalsPrices];
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: 5000,
    retry: 2,
  });
}
