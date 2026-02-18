import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Activity, BarChart3, Brain, Search, AlertCircle, Shield } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { PageHead } from '@/components/PageHead';
import { useTokenAdvancedAnalytics } from '@/hooks/useTokenAdvancedAnalytics';
import { toast } from 'sonner';

export default function AdvancedAnalyticsPage() {
  const { identity } = useInternetIdentity();
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');
  
  const { data: analytics, isLoading, error } = useTokenAdvancedAnalytics(
    searchSymbol,
    !!searchSymbol
  );

  const handleSearch = () => {
    if (!tokenSymbol.trim()) {
      toast.error('Please enter a token symbol');
      return;
    }
    setSearchSymbol(tokenSymbol.trim().toUpperCase());
  };

  if (!identity) {
    return (
      <>
        <PageHead title="Advanced Analytics" description="AI-powered cryptocurrency analytics" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 mex-scale-in">
            <CardHeader>
              <CardTitle className="text-gold">Authentication Required</CardTitle>
              <CardDescription>Please log in to access Advanced Analytics</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Advanced Analytics" description="AI-powered cryptocurrency analytics" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 mex-fade-in">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Brain className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold mb-6 tracking-tight leading-tight">
                Advanced Analytics
              </h1>
              <p className="text-xl metallic-text-secondary font-inter max-w-2xl mx-auto leading-relaxed">
                Deep dive into cryptocurrency market analysis with AI-powered insights
              </p>
            </div>

            <Card className="glass-card-gold glow-border mb-8 mex-fade-up">
              <CardHeader>
                <CardTitle className="text-gold">Token Analysis</CardTitle>
                <CardDescription>Enter a token symbol to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="token-symbol" className="sr-only">Token Symbol</Label>
                    <Input
                      id="token-symbol"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Enter token symbol (e.g., BTC, ETH, BNB)"
                      className="mex-focus-ring"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={!tokenSymbol.trim() || isLoading}
                    className="bg-gold hover:bg-gold/90 text-black mex-hover-lift"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive" className="mb-8 mex-fade-up">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to fetch analytics for {searchSymbol}. Please check the symbol and try again.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              </div>
            )}

            {analytics && !isLoading && (
              <div className="space-y-6 mex-fade-up">
                <Card className="glass-card-gold glow-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-gold">{analytics.symbol} Analysis</CardTitle>
                      <Badge variant="outline" className="text-gold border-gold/30">
                        Live Data
                      </Badge>
                    </div>
                    <CardDescription>
                      Updated: {new Date(analytics.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-gold" />
                          <span className="font-inter metallic-text font-semibold">Trend Overview</span>
                        </div>
                        <p className="text-2xl font-poppins font-bold text-gold mb-2">
                          {analytics.trendOverview}
                        </p>
                      </div>

                      <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-5 w-5 text-gold" />
                          <span className="font-inter metallic-text font-semibold">Risk Level</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-lg px-4 py-2 ${
                            analytics.riskLevel === 'Low'
                              ? 'text-green-600 border-green-600/30 bg-green-50'
                              : analytics.riskLevel === 'High'
                              ? 'text-red-600 border-red-600/30 bg-red-50'
                              : 'text-yellow-600 border-yellow-600/30 bg-yellow-50'
                          }`}
                        >
                          {analytics.riskLevel}
                        </Badge>
                      </div>

                      <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="h-5 w-5 text-gold" />
                          <span className="font-inter metallic-text font-semibold">Volatility Score</span>
                        </div>
                        <p className="text-2xl font-poppins font-bold text-gold">
                          {analytics.volatilityScore}%
                        </p>
                      </div>

                      <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="h-5 w-5 text-gold" />
                          <span className="font-inter metallic-text font-semibold">Market Strength</span>
                        </div>
                        <p className="text-2xl font-poppins font-bold text-gold">
                          {analytics.marketStrength}/100
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-5 w-5 text-gold" />
                        <span className="font-inter metallic-text font-semibold">Volume Analysis</span>
                      </div>
                      <p className="metallic-text-secondary">{analytics.volumeAnalysis}</p>
                    </div>

                    <div className="pt-4 border-t border-gold/20">
                      <p className="text-sm text-muted-foreground mb-2">Data Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {analytics.sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!searchSymbol && !isLoading && (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg metallic-text">Enter a token symbol to begin analysis</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
