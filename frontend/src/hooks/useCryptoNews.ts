import { useQuery } from '@tanstack/react-query';

export interface CryptoNewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  currencies: string[];
}

function deriveSentiment(votes: { positive?: number; negative?: number; important?: number; liked?: number; disliked?: number; lol?: number; toxic?: number; saved?: number; comments?: number } | null): 'positive' | 'negative' | 'neutral' {
  if (!votes) return 'neutral';
  const pos = (votes.positive ?? 0) + (votes.liked ?? 0) + (votes.important ?? 0);
  const neg = (votes.negative ?? 0) + (votes.disliked ?? 0) + (votes.toxic ?? 0);
  if (pos > neg && pos > 0) return 'positive';
  if (neg > pos && neg > 0) return 'negative';
  return 'neutral';
}

export function useCryptoNews() {
  return useQuery<CryptoNewsItem[]>({
    queryKey: ['cryptoNews'],
    queryFn: async () => {
      try {
        const res = await fetch(
          'https://cryptopanic.com/api/v1/posts/?auth_token=public&public=true&kind=news'
        );
        if (!res.ok) throw new Error('CryptoPanic fetch failed');
        const data = await res.json();
        const results = data.results ?? [];
        return results.slice(0, 20).map((item: {
          id: number;
          title: string;
          url: string;
          source?: { title?: string };
          published_at: string;
          votes?: { positive?: number; negative?: number; important?: number; liked?: number; disliked?: number; lol?: number; toxic?: number; saved?: number; comments?: number } | null;
          currencies?: Array<{ code: string }>;
        }) => ({
          id: item.id,
          title: item.title,
          url: item.url,
          source: item.source?.title ?? 'Unknown',
          publishedAt: item.published_at,
          sentiment: deriveSentiment(item.votes ?? null),
          currencies: (item.currencies ?? []).map((c: { code: string }) => c.code),
        }));
      } catch {
        // Fallback: try alternative public endpoint
        const res2 = await fetch(
          'https://cryptopanic.com/api/v1/posts/?auth_token=public&public=true'
        );
        if (!res2.ok) throw new Error('All CryptoPanic endpoints failed');
        const data2 = await res2.json();
        const results2 = data2.results ?? [];
        return results2.slice(0, 20).map((item: {
          id: number;
          title: string;
          url: string;
          source?: { title?: string };
          published_at: string;
          votes?: { positive?: number; negative?: number; important?: number; liked?: number; disliked?: number; lol?: number; toxic?: number; saved?: number; comments?: number } | null;
          currencies?: Array<{ code: string }>;
        }) => ({
          id: item.id,
          title: item.title,
          url: item.url,
          source: item.source?.title ?? 'Unknown',
          publishedAt: item.published_at,
          sentiment: deriveSentiment(item.votes ?? null),
          currencies: (item.currencies ?? []).map((c: { code: string }) => c.code),
        }));
      }
    },
    staleTime: 12 * 60 * 60 * 1000,
    refetchInterval: 12 * 60 * 60 * 1000,
    retry: 2,
  });
}
