import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Coins, RefreshCw } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { useLivePrice } from '@/hooks/useLivePrice';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LivePricePage() {
  const { identity } = useInternetIdentity();
  const { data: prices, isLoading, error, refetch } = useLivePrice();

  useEffect(() => {
    document.body.style.setProperty('--animate-duration', '0.6s');
    return () => {
      document.body.style.removeProperty('--animate-duration');
    };
  }, []);

  const getAssetType = (symbol: string): 'crypto' | 'metal' => {
    return ['BTC', 'ETH', 'BNB'].includes(symbol) ? 'crypto' : 'metal';
  };

  if (!identity) {
    return (
      <>
        <PageHead title="Live Price" description="Real-time cryptocurrency and precious metals prices" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Alert className="animate-fade-in">
                <AlertDescription>
                  Please log in to view live price data.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Live Price" description="Real-time cryptocurrency and precious metals prices" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-poppins font-bold metallic-text-hero mb-4">
                Live Price Dashboard
              </h1>
              <p className="text-lg metallic-text-secondary mb-6">
                Real-time market data for cryptocurrencies and precious metals
              </p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="mex-hover-lift transition-all duration-300"
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Prices
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 animate-fade-in">
                <AlertDescription>
                  Failed to load price data. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && !prices && (
              <div className="text-center py-12 animate-pulse">
                <p className="text-muted-foreground">Loading live prices...</p>
              </div>
            )}

            {prices && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prices.map((asset, index) => {
                  const assetType = getAssetType(asset.symbol);
                  return (
                    <Card
                      key={asset.symbol}
                      className="glass-card mex-hover-lift transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {assetType === 'crypto' ? (
                              <Coins className="h-5 w-5 text-gold" />
                            ) : (
                              <DollarSign className="h-5 w-5 text-gold" />
                            )}
                            {asset.name}
                          </span>
                          <span className="text-sm font-normal text-muted-foreground">
                            {asset.symbol}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          {assetType === 'crypto' ? 'Cryptocurrency' : 'Precious Metal'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-3xl font-bold text-gold transition-all duration-300">
                              ${asset.price.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Current Price</p>
                          </div>
                          <div
                            className={`flex items-center gap-2 transition-all duration-300 ${
                              asset.change24h >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {asset.change24h >= 0 ? (
                              <TrendingUp className="h-4 w-4 animate-pulse" />
                            ) : (
                              <TrendingDown className="h-4 w-4 animate-pulse" />
                            )}
                            <span className="font-semibold">
                              {asset.change24h >= 0 ? '+' : ''}
                              {asset.change24h.toFixed(2)}%
                            </span>
                            <span className="text-sm text-muted-foreground">24h</span>
                          </div>
                          {asset.timestamp && (
                            <p className="text-xs text-muted-foreground">
                              Updated: {new Date(asset.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="text-sm text-muted-foreground">
                Prices update automatically every 7 seconds
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Data sourced from backend price engine
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
