import { Newspaper, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useCryptoNews, formatNewsTime } from '@/hooks/useCryptoNews';

export default function CryptoNewsPage() {
  const { identity } = useInternetIdentity();
  const { data: news, isLoading, error } = useCryptoNews();

  if (!identity) {
    return (
      <>
        <PageHead title="Crypto News" description="Latest cryptocurrency news and updates" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 mex-scale-in">
            <CardHeader>
              <CardTitle className="text-gold">Authentication Required</CardTitle>
              <CardDescription>Please log in to access Crypto News</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Crypto News" description="Latest cryptocurrency news and updates" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 mex-fade-in">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Newspaper className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold mb-6 tracking-tight leading-tight">
                Crypto News
              </h1>
              <p className="text-xl metallic-text-secondary font-inter max-w-2xl mx-auto leading-relaxed">
                Stay updated with the latest cryptocurrency news and market developments
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-8 mex-fade-up">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to fetch crypto news. Please check your connection and try again.
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="glass-card">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : news && news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item, index) => (
                  <Card
                    key={index}
                    className="glass-card glow-border mex-hover-lift"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-gold mb-2 hover:underline">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-2"
                            >
                              {item.title}
                              <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1" />
                            </a>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 flex-wrap">
                            <Badge variant="outline" className="text-gold border-gold/30">
                              {item.source}
                            </Badge>
                            <span className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3" />
                              {formatNewsTime(item.timestamp)}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg metallic-text">No news available at the moment</p>
                </CardContent>
              </Card>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                News updates automatically every 3 minutes • Powered by CryptoPanic
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
