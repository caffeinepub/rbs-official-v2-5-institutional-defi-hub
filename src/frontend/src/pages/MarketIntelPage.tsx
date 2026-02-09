import { useState } from 'react';
import { Lock, Unlock, TrendingUp, TrendingDown, Activity, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHead } from '@/components/PageHead';
import { PageShell } from '@/components/PageShell';
import { MarketIntelSkeleton } from '@/components/MarketIntelSkeleton';
import { useGrantMarketIntelAccess, useRevokeMarketIntelAccess, useCheckMarketIntelAccess, useFetchMarketIntelligence, useFetchBinarySignal } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';
import { processBinarySignal } from '@/utils/binarySignal';
import type { TechnicalIndicator } from '@/backend';

const ASSET_CATEGORIES = {
  crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'XRP/USD'],
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
};

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

export default function MarketIntelPage() {
  const { identity } = useInternetIdentity();
  const [passcode, setPasscode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'crypto' | 'forex'>('crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTC/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [tradingMode, setTradingMode] = useState<'standard' | 'binary'>('standard');

  const { data: hasAccess, isLoading: checkingAccess, refetch: refetchAccess } = useCheckMarketIntelAccess();
  const grantAccessMutation = useGrantMarketIntelAccess();
  const revokeAccessMutation = useRevokeMarketIntelAccess();

  const {
    data: marketIntel,
    isLoading: loadingIntel,
    error: intelError,
    refetch: refetchIntel,
  } = useFetchMarketIntelligence(selectedTimeframe, selectedAsset, hasAccess || false);

  const {
    data: binaryData,
    isLoading: loadingBinary,
    error: binaryError,
    refetch: refetchBinary,
  } = useFetchBinarySignal(selectedTimeframe, selectedAsset, hasAccess || false);

  const binarySignal = processBinarySignal(binaryData);

  const handleUnlock = async () => {
    if (!identity) {
      toast.error('Please log in to access Market Intelligence');
      return;
    }

    if (!passcode.trim()) {
      toast.error('Please enter the access passcode');
      return;
    }

    try {
      await grantAccessMutation.mutateAsync(passcode);
      toast.success('Market Intelligence unlocked successfully!');
      setPasscode('');
      refetchAccess();
    } catch (error: any) {
      toast.error(error.message || 'Invalid passcode. Please try again.');
    }
  };

  const handleLock = async () => {
    if (!identity) {
      toast.error('Please log in first');
      return;
    }

    if (!passcode.trim()) {
      toast.error('Please enter the access passcode to lock');
      return;
    }

    try {
      await revokeAccessMutation.mutateAsync(passcode);
      toast.success('Market Intelligence locked successfully');
      setPasscode('');
      refetchAccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to lock access');
    }
  };

  const handleRefresh = () => {
    if (tradingMode === 'standard') {
      refetchIntel();
    } else {
      refetchBinary();
    }
    toast.success('Data refreshed');
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strongBuy':
        return 'text-green-700 bg-green-100 border-green-300';
      case 'buy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'neutral':
        return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'sell':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'strongSell':
        return 'text-red-700 bg-red-100 border-red-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getSignalIcon = (signal: string) => {
    if (signal.includes('Buy')) return <TrendingUp className="h-4 w-4" />;
    if (signal.includes('Sell')) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  if (!identity) {
    return (
      <>
        <PageHead title="Market Intelligence" description="Advanced market analysis and trading signals" />
        <PageShell>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-card-gold p-12 max-w-md text-center glow-border">
              <Lock className="h-16 w-16 text-gold mx-auto mb-6" />
              <h2 className="text-3xl font-poppins font-bold metallic-text mb-4">Authentication Required</h2>
              <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                Please log in to access Market Intelligence features.
              </p>
            </div>
          </div>
        </PageShell>
      </>
    );
  }

  if (checkingAccess) {
    return (
      <>
        <PageHead title="Market Intelligence" description="Advanced market analysis and trading signals" />
        <PageShell>
          <MarketIntelSkeleton />
        </PageShell>
      </>
    );
  }

  if (!hasAccess) {
    return (
      <>
        <PageHead title="Market Intelligence" description="Advanced market analysis and trading signals" />
        <PageShell>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-card-gold p-12 max-w-md glow-border">
              <Lock className="h-16 w-16 text-gold mx-auto mb-6" />
              <h2 className="text-3xl font-poppins font-bold metallic-text mb-6 text-center">Market Intelligence</h2>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-8 text-center text-base">
                Enter your access passcode to unlock advanced market analysis and trading signals.
              </p>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  className="text-center font-inter"
                  disabled={grantAccessMutation.isPending}
                />
                <Button
                  onClick={handleUnlock}
                  disabled={grantAccessMutation.isPending || !passcode.trim()}
                  className="w-full bg-gradient-to-r from-gold-matte to-gold-light hover:from-gold-light hover:to-gold-matte text-dark-matter font-poppins font-bold"
                >
                  {grantAccessMutation.isPending ? 'Unlocking...' : 'Unlock Access'}
                </Button>
              </div>
            </div>
          </div>
        </PageShell>
      </>
    );
  }

  return (
    <>
      <PageHead title="Market Intelligence" description="Advanced market analysis and trading signals" />
      <PageShell>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-gold" />
                <h1 className="text-4xl font-poppins font-bold metallic-text">Market Intelligence</h1>
              </div>
              <p className="metallic-text-secondary font-inter text-base">Advanced market analysis and trading signals</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-gold/30 hover:bg-gold/10"
                disabled={loadingIntel || loadingBinary}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${(loadingIntel || loadingBinary) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="glass-card px-4 py-2">
                <div className="flex items-center gap-2">
                  <Unlock className="h-4 w-4 text-gold" />
                  <span className="text-sm font-inter font-semibold text-gold">Access Granted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-inter font-semibold metallic-text mb-2 block">Asset Category</label>
                <Select value={selectedCategory} onValueChange={(value: 'crypto' | 'forex') => {
                  setSelectedCategory(value);
                  setSelectedAsset(ASSET_CATEGORIES[value][0]);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-inter font-semibold metallic-text mb-2 block">Asset</label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_CATEGORIES[selectedCategory].map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-inter font-semibold metallic-text mb-2 block">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
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

              <div>
                <label className="text-sm font-inter font-semibold metallic-text mb-2 block">Trading Mode</label>
                <Tabs value={tradingMode} onValueChange={(value) => setTradingMode(value as 'standard' | 'binary')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="standard">Standard</TabsTrigger>
                    <TabsTrigger value="binary">Binary</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gold/20">
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  placeholder="Enter passcode to lock"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-48 text-sm"
                  disabled={revokeAccessMutation.isPending}
                />
                <Button
                  onClick={handleLock}
                  variant="outline"
                  size="sm"
                  disabled={revokeAccessMutation.isPending || !passcode.trim()}
                  className="border-gold/30 hover:bg-gold/10"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Access
                </Button>
              </div>
            </div>
          </div>

          {tradingMode === 'standard' ? (
            <>
              {loadingIntel && <MarketIntelSkeleton />}
              {intelError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{intelError.message}</AlertDescription>
                </Alert>
              )}
              {marketIntel && marketIntel.length > 0 && (
                <div className="space-y-6">
                  {marketIntel.map((intel) => (
                    <div key={Number(intel.id)} className="glass-card-gold p-8 glow-border">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-poppins font-bold metallic-text mb-2">
                            {intel.asset} - {intel.timeframe}
                          </h3>
                          <p className="text-sm metallic-text-secondary font-inter">
                            Analysis generated: {new Date(Number(intel.timestamp) / 1000000).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={`${getSignalColor(intel.overallSignal)} border px-4 py-2`}>
                          <span className="flex items-center gap-2 font-inter font-semibold">
                            {getSignalIcon(intel.overallSignal)}
                            {intel.overallSignal.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </Badge>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-inter font-semibold metallic-text">Historical Accuracy</span>
                          <span className="text-sm font-inter font-bold text-gold">{intel.historicalAccuracy.toFixed(1)}%</span>
                        </div>
                        <Progress value={intel.historicalAccuracy} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {intel.indicators.map((indicator: TechnicalIndicator, idx: number) => (
                          <div key={idx} className="glass-card p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-inter font-semibold metallic-text uppercase">
                                {indicator.indicatorType.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <Badge className={`${getSignalColor(indicator.signal)} border text-xs`}>
                                {indicator.signal.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            </div>
                            <p className="text-2xl font-poppins font-bold text-gold">{indicator.value.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {loadingBinary && <MarketIntelSkeleton />}
              {binaryError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{binaryError.message}</AlertDescription>
                </Alert>
              )}
              {binarySignal && (
                <div className="glass-card-gold p-8 glow-border">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-poppins font-bold metallic-text mb-2">Binary Options Signal</h3>
                    <p className="text-lg metallic-text-secondary font-inter">
                      {selectedAsset} - {selectedTimeframe}
                    </p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className={`glass-card p-8 text-center ${binarySignal.signal === 'CALL' ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}>
                      {binarySignal.signal === 'CALL' ? (
                        <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      ) : (
                        <TrendingDown className="h-16 w-16 text-red-600 mx-auto mb-4" />
                      )}
                      <h4 className="text-4xl font-poppins font-bold mb-4" style={{ color: binarySignal.signal === 'CALL' ? '#16a34a' : '#dc2626' }}>
                        {binarySignal.signal}
                      </h4>
                      <div className="mb-6">
                        <p className="text-sm font-inter font-semibold metallic-text mb-2">Confidence Level</p>
                        <p className="text-3xl font-poppins font-bold text-gold">{binarySignal.confidence}%</p>
                        <Progress value={binarySignal.confidence} className="h-3 mt-3" />
                      </div>
                      <p className="text-sm metallic-text-secondary font-inter">
                        Based on {binarySignal.rawData?.indicators.length || 0} technical indicators
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PageShell>
    </>
  );
}
