import { useState } from 'react';
import { Lock, Unlock, Activity, BarChart3, AlertCircle, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCheckMarketIntelAccess, useGrantMarketIntelAccess, useRevokeMarketIntelAccessWithPassword } from '@/hooks/useQueries';
import { useGetLiveMarketIntel, useRefreshMarketIntel, isDataStale, formatLastUpdated } from '@/hooks/useMarketIntelLive';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';
import { PageHead } from '@/components/PageHead';

const ASSETS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'LTC', 'DOT',
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
  'GOLD', 'SILVER', 'OIL', 'NATURAL_GAS', 'COPPER'
];

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

export default function MarketIntelPage() {
  const { identity } = useInternetIdentity();
  const [password, setPassword] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [isLocking, setIsLocking] = useState(false);

  const { data: hasAccess, isLoading: accessLoading, refetch: refetchAccess } = useCheckMarketIntelAccess();
  const grantAccessMutation = useGrantMarketIntelAccess();
  const revokeAccessMutation = useRevokeMarketIntelAccessWithPassword();

  const { data: liveData, isLoading: intelLoading, error: intelError, refetch: refetchIntel } = useGetLiveMarketIntel(
    selectedAsset,
    selectedTimeframe,
    hasAccess || false
  );

  const refreshMutation = useRefreshMarketIntel();

  const handleManualRefresh = async () => {
    if (!selectedAsset || !selectedTimeframe) return;
    
    try {
      await refreshMutation.mutateAsync({ asset: selectedAsset, timeframe: selectedTimeframe });
      toast.success('Market Intel refreshed');
      await refetchIntel();
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh data');
    }
  };

  const handleUnlock = async () => {
    if (!password.trim()) {
      toast.error('Please enter the access password');
      return;
    }

    try {
      const granted = await grantAccessMutation.mutateAsync(password);
      if (granted) {
        toast.success('Market Intel access granted!');
        setPassword('');
        await refetchAccess();
      } else {
        toast.error('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error('Failed to unlock Market Intel');
    }
  };

  const handleLock = async () => {
    if (!password.trim()) {
      toast.error('Please enter the password to lock');
      return;
    }

    setIsLocking(true);
    try {
      const revoked = await revokeAccessMutation.mutateAsync(password);
      if (revoked) {
        toast.success('Market Intel access locked');
        setPassword('');
        setSelectedAsset('');
        setSelectedTimeframe('1h');
        await refetchAccess();
      } else {
        toast.error('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Lock error:', error);
      toast.error('Failed to lock Market Intel');
    } finally {
      setIsLocking(false);
    }
  };

  if (!identity) {
    return (
      <>
        <PageHead title="Market Intel" description="Advanced market intelligence and trading signals" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 mex-scale-in">
            <CardHeader>
              <CardTitle className="text-gold">Authentication Required</CardTitle>
              <CardDescription>Please log in to access Market Intel</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  if (accessLoading) {
    return (
      <>
        <PageHead title="Market Intel" description="Advanced market intelligence and trading signals" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <div className="text-center mex-fade-in">
            <Activity className="h-12 w-12 text-gold mx-auto mb-4 animate-spin" />
            <p className="text-lg metallic-text">Loading Market Intel...</p>
          </div>
        </div>
      </>
    );
  }

  if (!hasAccess) {
    return (
      <>
        <PageHead title="Market Intel" description="Advanced market intelligence and trading signals" />
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 mex-scale-in">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <Lock className="h-8 w-8 text-gold" />
                </div>
              </div>
              <CardTitle className="text-center text-gold">Market Intel Access</CardTitle>
              <CardDescription className="text-center">
                Enter password to unlock advanced market intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password">Access Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    placeholder="Enter password"
                    className="mt-2 mex-focus-ring"
                  />
                </div>
                <Button
                  onClick={handleUnlock}
                  disabled={grantAccessMutation.isPending || !password.trim()}
                  className="w-full bg-gold hover:bg-gold/90 text-black mex-hover-lift mex-focus-ring"
                >
                  {grantAccessMutation.isPending ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Unlocking...
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Unlock Market Intel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const marketIntel = liveData?.intel;
  const dataIsStale = liveData ? liveData.isStale || isDataStale(liveData.lastUpdated) : false;
  const fetchFailed = liveData?.fetchFailed || false;

  return (
    <>
      <PageHead title="Market Intel" description="Advanced market intelligence and trading signals" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mex-fade-up">
              <div>
                <h1 className="text-4xl md:text-5xl font-poppins font-bold metallic-text-hero mb-2">
                  Market Intelligence
                </h1>
                <p className="text-lg metallic-text-secondary">
                  Live trading signals and market analysis
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Badge variant="outline" className="text-green-500 border-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Access Granted
                </Badge>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password to lock"
                    className="w-40 mex-focus-ring"
                  />
                  <Button
                    onClick={handleLock}
                    disabled={isLocking || !password.trim()}
                    variant="outline"
                    size="sm"
                    className="mex-hover-lift mex-focus-ring"
                  >
                    {isLocking ? (
                      <Activity className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mex-fade-up animation-delay-200">
              <div>
                <Label htmlFor="asset">Select Asset</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger id="asset" className="mt-2 mex-focus-ring">
                    <SelectValue placeholder="Choose an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSETS.map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger id="timeframe" className="mt-2 mex-focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEFRAMES.map((tf) => (
                      <SelectItem key={tf} value={tf}>
                        {tf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!selectedAsset ? (
              <Card className="mex-scale-in">
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-gold mx-auto mb-4" />
                  <p className="text-lg metallic-text">Select an asset to view market intelligence</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6 mex-fade-up animation-delay-400">
                {fetchFailed && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to fetch latest data. Showing cached results. Try manual refresh.
                    </AlertDescription>
                  </Alert>
                )}

                {liveData && (
                  <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm border border-gold/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-sm font-medium text-gold">Last Updated</p>
                        <p className="text-xs text-muted-foreground">{formatLastUpdated(liveData.lastUpdated)}</p>
                      </div>
                      {dataIsStale && (
                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                          Stale Data
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={handleManualRefresh}
                      disabled={refreshMutation.isPending}
                      size="sm"
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold/10 mex-hover-lift"
                    >
                      {refreshMutation.isPending ? (
                        <>
                          <Activity className="mr-2 h-4 w-4 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Manual Refresh
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {intelLoading ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Activity className="h-12 w-12 text-gold mx-auto mb-4 animate-spin" />
                      <p className="text-lg metallic-text">Loading market intelligence...</p>
                    </CardContent>
                  </Card>
                ) : intelError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to load market intelligence. Please try again later.
                    </AlertDescription>
                  </Alert>
                ) : marketIntel ? (
                  <Card className="glass-card border-gold/30">
                    <CardHeader>
                      <CardTitle className="text-2xl text-gold">
                        {selectedAsset} - {selectedTimeframe}
                      </CardTitle>
                      <CardDescription>
                        Technical analysis and trading signals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gold/5 rounded-lg border border-gold/20">
                          <span className="font-semibold text-lg">Overall Signal</span>
                          <Badge
                            variant="outline"
                            className={`text-lg px-4 py-1 ${
                              marketIntel.overallSignal === 'strongBuy'
                                ? 'bg-green-500/10 text-green-600 border-green-500'
                                : marketIntel.overallSignal === 'buy'
                                ? 'bg-green-400/10 text-green-500 border-green-400'
                                : marketIntel.overallSignal === 'neutral'
                                ? 'bg-gray-400/10 text-gray-600 border-gray-400'
                                : marketIntel.overallSignal === 'sell'
                                ? 'bg-red-400/10 text-red-500 border-red-400'
                                : 'bg-red-500/10 text-red-600 border-red-500'
                            }`}
                          >
                            {marketIntel.overallSignal === 'strongBuy'
                              ? 'STRONG BUY'
                              : marketIntel.overallSignal === 'buy'
                              ? 'BUY'
                              : marketIntel.overallSignal === 'neutral'
                              ? 'NEUTRAL'
                              : marketIntel.overallSignal === 'sell'
                              ? 'SELL'
                              : 'STRONG SELL'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {marketIntel.indicators.map((indicator, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-white/50 rounded-lg border border-gold/20 mex-hover-lift"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gold">
                                  {indicator.indicatorType === 'rsi'
                                    ? 'RSI'
                                    : indicator.indicatorType === 'macd'
                                    ? 'MACD'
                                    : indicator.indicatorType === 'bollingerBands'
                                    ? 'Bollinger Bands'
                                    : indicator.indicatorType === 'vwap'
                                    ? 'VWAP'
                                    : indicator.indicatorType === 'movingAverage'
                                    ? 'Moving Average'
                                    : indicator.indicatorType === 'fvg'
                                    ? 'Fair Value Gap'
                                    : 'Order Blocks'}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={
                                    indicator.signal === 'strongBuy'
                                      ? 'bg-green-500/10 text-green-600 border-green-500'
                                      : indicator.signal === 'buy'
                                      ? 'bg-green-400/10 text-green-500 border-green-400'
                                      : indicator.signal === 'neutral'
                                      ? 'bg-gray-400/10 text-gray-600 border-gray-400'
                                      : indicator.signal === 'sell'
                                      ? 'bg-red-400/10 text-red-500 border-red-400'
                                      : 'bg-red-500/10 text-red-600 border-red-500'
                                  }
                                >
                                  {indicator.signal === 'strongBuy'
                                    ? 'Strong Buy'
                                    : indicator.signal === 'buy'
                                    ? 'Buy'
                                    : indicator.signal === 'neutral'
                                    ? 'Neutral'
                                    : indicator.signal === 'sell'
                                    ? 'Sell'
                                    : 'Strong Sell'}
                                </Badge>
                              </div>
                              <p className="text-2xl font-bold text-gray-800">
                                {indicator.value.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-gold/5 rounded-lg border border-gold/20">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gold">Historical Accuracy</span>
                            <span className="text-2xl font-bold text-gray-800">
                              {(marketIntel.historicalAccuracy * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <AlertCircle className="h-12 w-12 text-gold mx-auto mb-4" />
                      <p className="text-lg metallic-text">No data available for this asset and timeframe</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Market intelligence is currently being generated. Please check back later.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
