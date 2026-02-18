import { useQuery } from '@tanstack/react-query';

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  timestamp: number;
  publishedAt: string;
}

const CRYPTOPANIC_API = 'https://cryptopanic.com/api/v1/posts/';
const REFETCH_INTERVAL = 180000; // 3 minutes

async function fetchCryptoNews(): Promise<NewsItem[]> {
  try {
    // Using CryptoPanic free tier (no auth required for public feed)
    const response = await fetch(
      `${CRYPTOPANIC_API}?auth_token=free&public=true&kind=news`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto news');
    }

    const data = await response.json();

    return data.results.slice(0, 20).map((item: any) => ({
      title: item.title,
      source: item.source?.title || 'Unknown',
      url: item.url,
      timestamp: new Date(item.published_at).getTime(),
      publishedAt: item.published_at,
    }));
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    throw error;
  }
}

export function useCryptoNews() {
  return useQuery<NewsItem[]>({
    queryKey: ['cryptoNews'],
    queryFn: fetchCryptoNews,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: 120000,
    retry: 2,
  });
}

export function formatNewsTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}
