import {
  AlertCircle,
  Clock,
  ExternalLink,
  Globe,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  categories: string[];
}

type FilterTab = "all" | "bitcoin" | "ethereum" | "defi";

const FILTER_KEYWORDS: Record<FilterTab, string[]> = {
  all: [],
  bitcoin: ["bitcoin", "btc"],
  ethereum: ["ethereum", "eth"],
  defi: [
    "defi",
    "dex",
    "decentralized",
    "uniswap",
    "aave",
    "compound",
    "yield",
  ],
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function InsightsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");

  const fetchNews = useCallback(async () => {
    setError(false);
    try {
      // Try CryptoPanic first
      let items: NewsItem[] = [];
      try {
        const res = await fetch(
          "https://cryptopanic.com/api/v1/posts/?auth_token=free&public=true&kind=news",
        );
        if (!res.ok) throw new Error("CryptoPanic error");
        const data = await res.json();
        items = (data.results ?? []).slice(0, 30).map(
          (item: {
            id: number;
            title: string;
            url: string;
            source: { title: string };
            published_at: string;
            currencies?: { code: string }[];
          }) => ({
            id: String(item.id),
            title: item.title,
            url: item.url,
            source: item.source?.title ?? "CryptoPanic",
            publishedAt: item.published_at,
            categories: (item.currencies ?? []).map((c: { code: string }) =>
              c.code.toLowerCase(),
            ),
          }),
        );
      } catch {
        // Fallback: CoinGecko news
        const res2 = await fetch("https://api.coingecko.com/api/v3/news");
        if (!res2.ok) throw new Error("CoinGecko news error");
        const data2 = await res2.json();
        items = (data2.data ?? []).slice(0, 30).map(
          (item: {
            id: string;
            title: string;
            url: string;
            author: { name?: string };
            updated_at: number;
          }) => ({
            id: item.id,
            title: item.title,
            url: item.url,
            source: item.author?.name ?? "CoinGecko",
            publishedAt: new Date(item.updated_at * 1000).toISOString(),
            categories: [],
          }),
        );
      }

      setNews(items);
      setLastUpdated(new Date());
    } catch {
      setError(true);
    }
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    await fetchNews();
    setIsLoading(false);
  }, [fetchNews]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNews();
    setIsRefreshing(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(fetchNews, 120000); // 2 min
    return () => clearInterval(id);
  }, [load, fetchNews]);

  const filteredNews =
    filter === "all"
      ? news
      : news.filter((item) => {
          const kw = FILTER_KEYWORDS[filter];
          const titleLower = item.title.toLowerCase();
          return (
            item.categories.some((c) => kw.some((k) => c.includes(k))) ||
            kw.some((k) => titleLower.includes(k))
          );
        });

  return (
    <>
      <PageHead
        title="Crypto News | RBS"
        description="Live cryptocurrency news feed with Bitcoin, Ethereum, and DeFi filters."
      />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div
          className="border-b pt-20 pb-8 px-4"
          style={{
            background:
              "linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 50%, #f8faff 100%)",
            borderColor: "rgba(14, 165, 233, 0.15)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Crypto News
                </h1>
                <p className="text-gray-500 mt-1">
                  Live news feed — auto-refreshes every 2 minutes
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {lastUpdated && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-700 font-medium">
                    Live
                  </span>
                </div>
                <Button
                  data-ocid="insights.refresh.button"
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing || isLoading}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <SmokySectionTransition>
          <section className="py-8 px-4 max-w-5xl mx-auto">
            {/* Filter Tabs */}
            <div className="mb-6">
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as FilterTab)}
              >
                <TabsList className="bg-gray-100 border border-gray-200">
                  <TabsTrigger
                    value="all"
                    data-ocid="insights.all.tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:font-bold text-sm"
                  >
                    All News
                  </TabsTrigger>
                  <TabsTrigger
                    value="bitcoin"
                    data-ocid="insights.bitcoin.tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:font-bold text-sm"
                  >
                    Bitcoin
                  </TabsTrigger>
                  <TabsTrigger
                    value="ethereum"
                    data-ocid="insights.ethereum.tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:font-bold text-sm"
                  >
                    Ethereum
                  </TabsTrigger>
                  <TabsTrigger
                    value="defi"
                    data-ocid="insights.defi.tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:font-bold text-sm"
                  >
                    DeFi
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Error state */}
            {error && (
              <div
                data-ocid="insights.error_state"
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-6"
              >
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-semibold">
                  News feed temporarily unavailable
                </p>
                <p className="text-red-400 text-sm mt-1">
                  CryptoPanic and CoinGecko APIs may be temporarily unavailable.
                </p>
                <Button
                  data-ocid="insights.retry.button"
                  onClick={load}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div data-ocid="insights.loading_state" className="space-y-4">
                {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
                  >
                    <div className="h-5 bg-gray-100 rounded mb-3 w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Count */}
                {!error && (
                  <p className="text-xs text-gray-400 mb-4">
                    Showing {filteredNews.length} articles
                  </p>
                )}

                {/* Empty filtered state */}
                {filteredNews.length === 0 && !error && !isLoading && (
                  <div
                    data-ocid="insights.empty_state"
                    className="text-center py-12 text-gray-400"
                  >
                    <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      No news matching this filter right now.
                    </p>
                  </div>
                )}

                {/* News grid */}
                <div className="space-y-3">
                  {filteredNews.map((item, idx) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`insights.item.${idx + 1}`}
                      className="block bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-emerald-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-semibold text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Globe className="w-3 h-3" />
                              {item.source}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(item.publishedAt)}
                            </span>
                            {item.categories.slice(0, 3).map((c) => (
                              <span
                                key={c}
                                className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100"
                              >
                                {c.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 flex-shrink-0 mt-1 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            <p className="text-xs text-gray-400 text-center mt-8">
              News sourced from CryptoPanic &amp; CoinGecko public APIs. Not
              financial advice.
            </p>
          </section>
        </SmokySectionTransition>
      </div>
    </>
  );
}
