import {
  Clock,
  ExternalLink,
  Minus,
  Newspaper,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { useCryptoNews } from "../hooks/useCryptoNews";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Refreshing soon...";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export default function AISentimentPage() {
  const {
    data: news,
    isLoading,
    isRefetching,
    error,
    dataUpdatedAt,
  } = useCryptoNews();
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!dataUpdatedAt) return;
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    const tick = () => {
      const elapsed = Date.now() - dataUpdatedAt;
      const remaining = Math.max(0, TWELVE_HOURS - elapsed);
      setCountdown(formatCountdown(remaining));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dataUpdatedAt]);

  const sentimentConfig = {
    positive: {
      label: "Positive",
      color: "text-green-500",
      bg: "bg-green-500/10 border-green-500/30",
      Icon: TrendingUp,
    },
    negative: {
      label: "Negative",
      color: "text-red-500",
      bg: "bg-red-500/10 border-red-500/30",
      Icon: TrendingDown,
    },
    neutral: {
      label: "Neutral",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10 border-yellow-500/30",
      Icon: Minus,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHead
        title="Crypto News | RBS"
        description="Latest cryptocurrency news with sentiment analysis."
      />

      <SmokySectionTransition>
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Crypto News
              </h1>
              <p className="text-muted-foreground mt-1">
                Latest news with community sentiment — cached for 12 hours
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {isRefetching && (
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
              )}
              {countdown && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>Next refresh: {countdown}</span>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
                  key={i}
                  className="glass-card p-5 animate-pulse"
                >
                  <div className="h-5 bg-muted rounded mb-3 w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Unable to load news. CryptoPanic API may be temporarily
                unavailable.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Will retry automatically on next refresh cycle.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(news ?? []).map((item) => {
                const cfg = sentimentConfig[item.sentiment];
                const SentIcon = cfg.Icon;
                return (
                  <div
                    key={item.id}
                    className="glass-card p-5 hover:scale-[1.005] transition-transform"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground font-semibold hover:text-primary transition-colors line-clamp-2 flex items-start gap-2 group"
                        >
                          <span className="flex-1">{item.title}</span>
                          <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            {item.source}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(item.publishedAt)}
                          </span>
                          {item.currencies.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {item.currencies.slice(0, 4).map((c) => (
                                <span
                                  key={c}
                                  className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold flex-shrink-0 ${cfg.bg} ${cfg.color}`}
                      >
                        <SentIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-6">
            News sourced from CryptoPanic public API. Sentiment derived from
            community votes. Cached for 12 hours.
          </p>
        </section>
      </SmokySectionTransition>
    </div>
  );
}
