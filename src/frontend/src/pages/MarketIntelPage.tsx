import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Database, TrendingUp, TrendingDown, Minus, Lock, Unlock, Activity, BarChart3, Zap, AlertCircle, RefreshCw, Target, LineChart, Newspaper, Brain, DollarSign, AlertTriangle, MessageCircle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFetchMarketIntelligence, useFetchBinarySignal, useGrantMarketIntelAccess, useCheckMarketIntelAccess, useRevokeMarketIntelAccessWithPassword } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { SignalConfidence } from '@/backend';
import { useQueryClient } from '@tanstack/react-query';

const CRYPTO_ASSETS = [
  { value: 'BTC', label: 'Bitcoin', symbol: '₿' },
  { value: 'ETH', label: 'Ethereum', symbol: 'Ξ' },
  { value: 'BNB', label: 'Binance Coin', symbol: 'BNB' },
  { value: 'SOL', label: 'Solana', symbol: 'SOL' },
  { value: 'XRP', label: 'Ripple', symbol: 'XRP' },
  { value: 'ADA', label: 'Cardano', symbol: 'ADA' },
  { value: 'AVAX', label: 'Avalanche', symbol: 'AVAX' },
  { value: 'DOGE', label: 'Dogecoin', symbol: 'Ð' },
  { value: 'LTC', label: 'Litecoin', symbol: 'Ł' },
  { value: 'DOT', label: 'Polkadot', symbol: 'DOT' },
];

const FOREX_ASSETS = [
  { value: 'XAU/USD', label: 'Gold', symbol: '🥇' },
  { value: 'XAG/USD', label: 'Silver', symbol: '🥈' },
  { value: 'EUR/USD', label: 'Euro/Dollar', symbol: '€/$' },
  { value: 'GBP/USD', label: 'Pound/Dollar', symbol: '£/$' },
  { value: 'USD/JPY', label: 'Dollar/Yen', symbol: '$/¥' },
  { value: 'USD/CHF', label: 'Dollar/Franc', symbol: '$/₣' },
  { value: 'AUD/USD', label: 'Aussie/Dollar', symbol: 'A$/$' },
  { value: 'NZD/USD', label: 'Kiwi/Dollar', symbol: 'NZ$/$' },
  { value: 'USD/CAD', label: 'Dollar/Loonie', symbol: '$/C$' },
  { value: 'EUR/GBP', label: 'Euro/Pound', symbol: '€/£' },
];

const TIMEFRAMES = [
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
];

const INDICATOR_LABELS: Record<string, string> = {
  rsi: 'RSI',
  macd: 'MACD',
  bollingerBands: 'Bollinger Bands',
  vwap: 'VWAP',
  movingAverage: 'Moving Average',
  fvg: 'Fair Value Gap',
  orderBlocks: 'Order Blocks',
};

const INDICATOR_DESCRIPTIONS: Record<string, string> = {
  rsi: 'Momentum oscillator measuring overbought/oversold conditions',
  macd: 'Trend-following momentum indicator showing signal line crossovers',
  bollingerBands: 'Volatility bands indicating price extremes and squeeze patterns',
  vwap: 'Volume-weighted average price used by institutional traders',
  movingAverage: 'Trend direction and golden/death cross signals',
  fvg: 'Institutional imbalance zones indicating potential price targets',
  orderBlocks: 'Support/resistance levels from institutional order flow',
};

export default function MarketIntelPage() {
  const queryClient = useQueryClient();
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [lockPasscode, setLockPasscode] = useState('');
  const [lockPasscodeError, setLockPasscodeError] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1h');
  const [assetCategory, setAssetCategory] = useState<'crypto' | 'forex'>('crypto');
  const [tradingMode, setTradingMode] = useState<'standard' | 'binary'>('standard');

  const { data: hasAccess, isLoading: checkingAccess, refetch: refetchAccess } = useCheckMarketIntelAccess();
  const grantAccessMutation = useGrantMarketIntelAccess();
  const revokeAccessMutation = useRevokeMarketIntelAccessWithPassword();
  
  const { data: marketData, isLoading: loadingStandard, error: errorStandard, refetch: refetchStandard, isFetching: fetchingStandard } = useFetchMarketIntelligence(
    selectedAsset, 
    selectedTimeframe,
    hasAccess === true
  );
  
  const { data: binaryData, isLoading: loadingBinary, error: errorBinary, refetch: refetchBinary, isFetching: fetchingBinary } = useFetchBinarySignal(
    selectedAsset, 
    selectedTimeframe,
    hasAccess === true
  );

  const isUnlocked = hasAccess === true;
  const isLoading = tradingMode === 'standard' ? loadingStandard : loadingBinary;
  const error = tradingMode === 'standard' ? errorStandard : errorBinary;
  const isFetching = tradingMode === 'standard' ? fetchingStandard : fetchingBinary;

  // Simulated AI Sentiment Data (always accessible)
  const [sentimentData, setSentimentData] = useState({
    overall: 'Bullish',
    score: 72,
    socialVolume: 145230,
    newsImpact: 8.5,
    trendingTopics: ['Bitcoin ETF', 'DeFi Growth', 'Layer 2 Scaling', 'NFT Market'],
  });

  const [socialMetrics, setSocialMetrics] = useState([
    { platform: 'Twitter', sentiment: 68, volume: 52340 },
    { platform: 'Reddit', sentiment: 75, volume: 38920 },
    { platform: 'Telegram', sentiment: 81, volume: 29450 },
    { platform: 'Discord', sentiment: 70, volume: 24520 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSentimentData(prev => ({
        ...prev,
        score: Math.max(50, Math.min(95, prev.score + (Math.random() - 0.5) * 5)),
        socialVolume: prev.socialVolume + Math.floor((Math.random() - 0.5) * 1000),
        newsImpact: Math.max(5, Math.min(10, prev.newsImpact + (Math.random() - 0.5) * 0.5)),
      }));
      
      setSocialMetrics(prev => prev.map(metric => ({
        ...metric,
        sentiment: Math.max(50, Math.min(95, metric.sentiment + (Math.random() - 0.5) * 3)),
        volume: metric.volume + Math.floor((Math.random() - 0.5) * 500),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUnlock = async () => {
    if (!passcode.trim()) {
      toast.error('Please enter a passcode');
      return;
    }

    try {
      const granted = await grantAccessMutation.mutateAsync(passcode);
      if (granted) {
        setPasscodeError(false);
        setPasscode('');
        toast.success('Access granted to Market Intelligence', {
          description: 'Market Intel unlocked successfully',
        });
        await refetchAccess();
      } else {
        setPasscodeError(true);
        toast.error('Invalid passcode', {
          description: 'Access denied. Please check your passcode and try again.',
        });
        setTimeout(() => setPasscodeError(false), 2000);
      }
    } catch (error: any) {
      setPasscodeError(true);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error('Authentication failed', {
        description: errorMessage.includes('network') 
          ? 'Network error. Please check your connection and try again.'
          : 'Failed to verify passcode. Please try again.',
      });
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  const handleLockRequest = () => {
    setShowLockDialog(true);
    setLockPasscode('');
    setLockPasscodeError(false);
  };

  const handleLockConfirm = async () => {
    if (!lockPasscode.trim()) {
      toast.error('Please enter passcode to lock');
      return;
    }

    try {
      const revoked = await revokeAccessMutation.mutateAsync(lockPasscode);
      if (revoked) {
        setLockPasscodeError(false);
        setLockPasscode('');
        setShowLockDialog(false);
        
        // Clear Market Intel UI state
        setSelectedAsset('');
        setSelectedTimeframe('1h');
        
        // Clear cached Market Intel query results
        queryClient.removeQueries({ queryKey: ['marketIntelligence'] });
        queryClient.removeQueries({ queryKey: ['binarySignal'] });
        
        toast.success('Market Intel locked successfully', {
          description: 'Access has been revoked. Enter passcode to unlock again.',
        });
        await refetchAccess();
      } else {
        setLockPasscodeError(true);
        toast.error('Invalid passcode', {
          description: 'Lock operation denied. Please check your passcode.',
        });
        setTimeout(() => setLockPasscodeError(false), 2000);
      }
    } catch (error: any) {
      setLockPasscodeError(true);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error('Lock operation failed', {
        description: errorMessage.includes('network')
          ? 'Network error. Please check your connection and try again.'
          : errorMessage.includes('Unauthorized')
          ? 'Invalid passcode. Access denied.'
          : 'Failed to lock Market Intel. Please try again.',
      });
      setTimeout(() => setLockPasscodeError(false), 2000);
    }
  };

  const handleAssetSelect = (asset: string) => {
    if (!isUnlocked) return;
    setSelectedAsset(asset);
    toast.info(`Analyzing ${asset} market data...`, {
      description: 'Fetching real-time data from external APIs',
    });
  };

  const handleRefresh = () => {
    if (selectedAsset && selectedTimeframe && isUnlocked) {
      if (tradingMode === 'standard') {
        refetchStandard();
      } else {
        refetchBinary();
      }
      toast.info('Refreshing market intelligence...', {
        description: 'Updating real-time data feeds',
      });
    }
  };

  useEffect(() => {
    if (selectedAsset && selectedTimeframe && isUnlocked) {
      if (tradingMode === 'standard') {
        refetchStandard();
      } else {
        refetchBinary();
      }
    }
  }, [selectedAsset, selectedTimeframe, tradingMode, isUnlocked]);

  const getSignalColor = (signal: SignalConfidence): string => {
    switch (signal) {
      case SignalConfidence.strongBuy:
        return 'text-green-600';
      case SignalConfidence.buy:
        return 'text-green-500';
      case SignalConfidence.neutral:
        return 'text-gray-600';
      case SignalConfidence.sell:
        return 'text-red-500';
      case SignalConfidence.strongSell:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSignalBgColor = (signal: SignalConfidence): string => {
    switch (signal) {
      case SignalConfidence.strongBuy:
        return 'bg-green-50 border-green-300';
      case SignalConfidence.buy:
        return 'bg-green-50/50 border-green-200';
      case SignalConfidence.neutral:
        return 'bg-gray-50 border-gray-200';
      case SignalConfidence.sell:
        return 'bg-red-50/50 border-red-200';
      case SignalConfidence.strongSell:
        return 'bg-red-50 border-red-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSignalIcon = (signal: SignalConfidence) => {
    if (signal === SignalConfidence.strongBuy || signal === SignalConfidence.buy) {
      return <TrendingUp className="h-6 w-6" />;
    } else if (signal === SignalConfidence.strongSell || signal === SignalConfidence.sell) {
      return <TrendingDown className="h-6 w-6" />;
    }
    return <Minus className="h-6 w-6" />;
  };

  const formatSignalLabel = (signal: SignalConfidence): string => {
    switch (signal) {
      case SignalConfidence.strongBuy:
        return 'STRONG BUY';
      case SignalConfidence.buy:
        return 'BUY';
      case SignalConfidence.neutral:
        return 'NEUTRAL';
      case SignalConfidence.sell:
        return 'SELL';
      case SignalConfidence.strongSell:
        return 'STRONG SELL';
      default:
        return 'UNKNOWN';
    }
  };

  const calculateConfidencePercentage = (signal: SignalConfidence): number => {
    switch (signal) {
      case SignalConfidence.strongBuy:
        return 95;
      case SignalConfidence.buy:
        return 75;
      case SignalConfidence.neutral:
        return 50;
      case SignalConfidence.sell:
        return 75;
      case SignalConfidence.strongSell:
        return 95;
      default:
        return 50;
    }
  };

  const getTrendSummary = () => {
    if (!marketData) return null;
    
    const bullishCount = marketData.indicators.filter(i => 
      i.signal === SignalConfidence.strongBuy || i.signal === SignalConfidence.buy
    ).length;
    const bearishCount = marketData.indicators.filter(i => 
      i.signal === SignalConfidence.strongSell || i.signal === SignalConfidence.sell
    ).length;
    
    const trend = bullishCount > bearishCount ? 'Bullish' : bearishCount > bullishCount ? 'Bearish' : 'Neutral';
    const strength = Math.abs(bullishCount - bearishCount) / marketData.indicators.length;
    const momentum = strength > 0.5 ? 'Strong' : strength > 0.3 ? 'Moderate' : 'Weak';
    
    return { trend, momentum, bullishCount, bearishCount };
  };

  const getMarketSentiment = () => {
    if (!marketData) return null;
    
    const trendData = getTrendSummary();
    if (!trendData) return null;
    
    const sentimentScore = (trendData.bullishCount - trendData.bearishCount) / marketData.indicators.length;
    const sentiment = sentimentScore > 0.3 ? 'Very Bullish' : 
                     sentimentScore > 0.1 ? 'Bullish' :
                     sentimentScore < -0.3 ? 'Very Bearish' :
                     sentimentScore < -0.1 ? 'Bearish' : 'Neutral';
    
    return { sentiment, score: sentimentScore };
  };

  if (checkingAccess) {
    return (
      <div className="page-shell">
        <div className="page-content-center">
          <div className="text-center animate-fade-in-up">
            <div className="oracle-pulse mb-8 mx-auto" />
            <p className="text-2xl font-poppins text-gold tracking-tight">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="page-shell">
        <div className="page-content-center">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gold/10 border-2 border-gold/30 mb-10 lock-pulse">
                <Lock className="h-14 w-14 text-gold" />
              </div>
              <h1 className="text-5xl md:text-6xl font-poppins font-bold mb-8 tracking-tight leading-tight metallic-text-hero">
                Restricted Access
              </h1>
              <p className="text-xl metallic-text-secondary font-inter leading-relaxed">
                Enter passcode to access Market Intelligence signals
              </p>
            </div>

            <div className="glass-card-gold p-12 animate-fade-in-up animation-delay-200 glow-border">
              <div className="space-y-10">
                <div>
                  <Input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    placeholder="Enter passcode"
                    disabled={grantAccessMutation.isPending}
                    className={`bg-white/40 border-2 text-center text-2xl font-inter tracking-widest transition-all duration-700 h-16 ${
                      passcodeError ? 'border-red-500 shake' : 'border-gold/30 focus:border-gold'
                    }`}
                  />
                  {passcodeError && (
                    <p className="text-red-600 text-sm font-inter mt-4 text-center animate-fade-in-up">
                      Invalid passcode. Access denied.
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUnlock}
                  disabled={grantAccessMutation.isPending}
                  className="w-full bg-gold hover:bg-gold/90 text-black font-poppins font-bold text-lg py-8 metallic-button transition-all duration-700 hover:scale-105 disabled:hover:scale-100"
                >
                  {grantAccessMutation.isPending ? 'Verifying...' : 'Unlock Access'}
                </Button>
              </div>
            </div>

            <p className="text-center metallic-text-secondary text-sm font-inter mt-10 animate-fade-in-up animation-delay-400 leading-relaxed">
              AI Sentiment Analysis is always accessible. Market Intel signals require authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const trendSummary = getTrendSummary();
  const sentimentDataMarket = getMarketSentiment();

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="flex items-center justify-center gap-5 mb-8">
              <h1 className="text-5xl md:text-7xl font-poppins font-bold tracking-tight leading-tight metallic-text-hero">
                Unified Analytics Platform
              </h1>
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 border-2 border-green-300 animate-pulse">
                <Unlock className="h-7 w-7 text-green-600" />
              </div>
            </div>
            <p className="text-xl metallic-text-secondary font-inter mb-8 leading-relaxed max-w-3xl mx-auto">
              Real-time Market Intelligence & AI Sentiment Analysis for 20 assets
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gold/70 mb-8">
              <Activity className="h-6 w-6 animate-pulse" />
              <span className="font-inter tracking-wide">Live data • 10 Crypto + 10 Forex • Updated every 60 seconds</span>
            </div>
            
            <Button
              onClick={handleLockRequest}
              disabled={revokeAccessMutation.isPending}
              variant="outline"
              className="border-2 border-gold/30 text-gold hover:border-gold hover:bg-gold/10 font-poppins font-bold tracking-wide px-10 py-4 transition-all duration-700 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Lock className="h-5 w-5 mr-2" />
              {revokeAccessMutation.isPending ? 'Locking...' : 'Lock Market Intel'}
            </Button>
          </div>

          {/* AI Sentiment Section - Always Visible */}
          <div className="mb-16 animate-fade-in-up animation-delay-200">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-10 tracking-tight">AI Sentiment Analysis</h2>
            
            <div className="glass-card-gold p-10 glow-border">
              <div className="flex items-center gap-4 mb-8">
                <Brain className="h-8 w-8 text-gold" />
                <h3 className="text-3xl font-poppins font-bold text-gold tracking-tight">Real-Time Market Sentiment</h3>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-inter metallic-text">Overall Sentiment</span>
                  <span className={`text-2xl font-poppins font-bold ${
                    sentimentData.overall.includes('Bullish') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sentimentData.overall}
                  </span>
                </div>
                <Progress value={sentimentData.score} className="h-4 mb-2" />
                <div className="flex items-center justify-between text-sm metallic-text-secondary">
                  <span>Sentiment Score</span>
                  <span className="font-bold text-gold">{sentimentData.score}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {socialMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/40 rounded-lg p-4 border border-gold/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-inter metallic-text">{metric.platform}</span>
                      <span className="text-sm metallic-text-secondary">{metric.volume.toLocaleString()} posts</span>
                    </div>
                    <Progress value={metric.sentiment} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm metallic-text-secondary">
                <Activity className="h-5 w-5 animate-pulse" />
                <span>Real-time AI analysis • Updated every 5 minutes • Always accessible</span>
              </div>
            </div>
          </div>

          {/* Market Intel Section - Requires Unlock */}
          <div className="mb-16 animate-fade-in-up animation-delay-200">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-10 tracking-tight">Market Intelligence Signals</h2>
            
            <Tabs value={tradingMode} onValueChange={(v) => setTradingMode(v as 'standard' | 'binary')} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 bg-white/60 border-2 border-gold/30 p-1">
                <TabsTrigger 
                  value="standard" 
                  className="font-poppins font-bold data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-700 flex items-center gap-2"
                >
                  <LineChart className="h-5 w-5" />
                  Standard Trading
                </TabsTrigger>
                <TabsTrigger 
                  value="binary" 
                  className="font-poppins font-bold data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-700 flex items-center gap-2"
                >
                  <Target className="h-5 w-5" />
                  Binary Trading
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-200">
            <h3 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-10 tracking-tight">Select Asset</h3>
            
            <Tabs value={assetCategory} onValueChange={(v) => setAssetCategory(v as 'crypto' | 'forex')} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 bg-white/60 border-2 border-gold/30 p-1">
                <TabsTrigger 
                  value="crypto" 
                  className="font-poppins font-bold data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-700"
                >
                  Crypto (10)
                </TabsTrigger>
                <TabsTrigger 
                  value="forex" 
                  className="font-poppins font-bold data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-700"
                >
                  Forex (10)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crypto" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-6">
                  {CRYPTO_ASSETS.map((asset) => (
                    <button
                      key={asset.value}
                      onClick={() => handleAssetSelect(asset.value)}
                      disabled={isLoading || isFetching}
                      className={`asset-card p-8 rounded-xl border-2 transition-all duration-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedAsset === asset.value
                          ? 'bg-gold/20 border-gold shadow-lg shadow-gold/30'
                          : 'bg-white/60 border-gray-200 hover:border-gold/40'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-4">{asset.symbol}</div>
                        <div className="font-poppins font-bold text-lg text-gold tracking-wide">{asset.value}</div>
                        <div className="font-inter text-xs metallic-text-secondary mt-3">{asset.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="forex" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-6">
                  {FOREX_ASSETS.map((asset) => (
                    <button
                      key={asset.value}
                      onClick={() => handleAssetSelect(asset.value)}
                      disabled={isLoading || isFetching}
                      className={`asset-card p-8 rounded-xl border-2 transition-all duration-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedAsset === asset.value
                          ? 'bg-gold/20 border-gold shadow-lg shadow-gold/30'
                          : 'bg-white/60 border-gray-200 hover:border-gold/40'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-4">{asset.symbol}</div>
                        <div className="font-poppins font-bold text-lg text-gold tracking-wide">{asset.value}</div>
                        <div className="font-inter text-xs metallic-text-secondary mt-3">{asset.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-300">
            <h3 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-10 tracking-tight">Select Timeframe</h3>
            <div className="flex gap-6 flex-wrap items-center">
              {TIMEFRAMES.map((tf) => (
                <Button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value)}
                  disabled={isLoading || isFetching}
                  variant={selectedTimeframe === tf.value ? 'default' : 'outline'}
                  className={`font-poppins font-bold transition-all duration-700 hover:scale-105 disabled:opacity-50 tracking-wide px-10 py-7 text-lg ${
                    selectedTimeframe === tf.value
                      ? 'bg-gold hover:bg-gold/90 text-black'
                      : 'border-gray-300 metallic-text hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  {tf.label}
                </Button>
              ))}
              {selectedAsset && (
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading || isFetching}
                  variant="outline"
                  className="border-gold/30 text-gold hover:border-gold hover:bg-gold/10 disabled:opacity-50 font-poppins tracking-wide px-10 py-7 text-lg transition-all duration-700"
                >
                  <RefreshCw className={`h-6 w-6 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>
          </div>

          {error && selectedAsset && (
            <Alert variant="destructive" className="mb-12 animate-fade-in-up">
              <AlertCircle className="h-6 w-6" />
              <AlertDescription className="font-inter text-lg flex items-center justify-between">
                <span>Failed to load market data. Retrying automatically with fallback...</span>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="ml-4 border-red-400 text-red-400 hover:bg-red-400/10 transition-all duration-700"
                >
                  Retry Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {(isLoading || isFetching) && selectedAsset && (
            <div className="oracle-result-card mb-12 animate-fade-in-up">
              <div className="flex flex-col items-center justify-center py-20">
                <div className="oracle-pulse mb-10" />
                <p className="text-3xl font-poppins text-gold mb-8 tracking-tight">Processing Market Intelligence</p>
                <Progress value={66} className="w-full max-w-md h-4" />
                <p className="text-lg font-inter metallic-text-secondary mt-8 tracking-wide">
                  Analyzing {selectedAsset} on {selectedTimeframe} timeframe...
                </p>
                <p className="text-base font-inter metallic-text-secondary mt-4 leading-relaxed">
                  {tradingMode === 'binary' 
                    ? 'Computing binary trading signals with Win/Loss probability analysis'
                    : 'Fetching real-time data and computing RSI, MACD, Bollinger Bands, VWAP, Moving Averages, FVG, and Order Blocks'
                  }
                </p>
              </div>
            </div>
          )}

          {selectedAsset && !isLoading && !error && (
            <>
              <div className="grid grid-cols-1 gap-8 mb-16 animate-fade-in-up animation-delay-400">
                {tradingMode === 'binary' && binaryData && (
                  <div className={`signal-card-glow p-10 rounded-xl border-2 ${binaryData.prediction === 'WIN' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} transition-all duration-1000`}>
                    <div className="flex items-center gap-4 mb-6">
                      <Target className="h-8 w-8 text-gold" />
                      <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Binary Signal</h2>
                    </div>
                    
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`p-5 rounded-full bg-white/40 ${binaryData.prediction === 'WIN' ? 'text-green-600' : 'text-red-600'}`}>
                        {binaryData.prediction === 'WIN' ? <TrendingUp className="h-8 w-8" /> : <TrendingDown className="h-8 w-8" />}
                      </div>
                      <div>
                        <p className={`text-5xl font-poppins font-bold ${binaryData.prediction === 'WIN' ? 'text-green-600' : 'text-red-600'} tracking-tight`}>
                          {binaryData.prediction}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-2xl font-inter font-bold text-gold">
                            {(binaryData.confidence * 100).toFixed(1)}%
                          </span>
                          <span className="text-sm font-inter metallic-text-secondary">Confidence</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm metallic-text-secondary mb-2">Win Probability</p>
                          <p className="text-3xl font-inter font-bold text-green-600">
                            {(binaryData.winProbability * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm metallic-text-secondary mb-2">Loss Probability</p>
                          <p className="text-3xl font-inter font-bold text-red-600">
                            {((1 - binaryData.winProbability) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tradingMode === 'standard' && marketData && (
                  <div className={`signal-card-glow p-10 rounded-xl border-2 ${getSignalBgColor(marketData.overallSignal)} transition-all duration-1000`}>
                    <div className="flex items-center gap-4 mb-6">
                      <BarChart3 className="h-8 w-8 text-gold" />
                      <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Market Signal</h2>
                    </div>
                    
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`p-5 rounded-full bg-white/40 ${getSignalColor(marketData.overallSignal)}`}>
                        {getSignalIcon(marketData.overallSignal)}
                      </div>
                      <div>
                        <p className={`text-5xl font-poppins font-bold ${getSignalColor(marketData.overallSignal)} tracking-tight`}>
                          {formatSignalLabel(marketData.overallSignal)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-2xl font-inter font-bold text-gold">
                            {calculateConfidencePercentage(marketData.overallSignal)}%
                          </span>
                          <span className="text-sm font-inter metallic-text-secondary">Confidence</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/40 rounded-lg p-6 border border-gold/20">
                      <p className="text-sm metallic-text-secondary mb-2">Historical Accuracy</p>
                      <p className="text-5xl font-inter font-bold text-gold shimmer-gold">
                        {(marketData.historicalAccuracy * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {tradingMode === 'standard' && marketData && trendSummary && sentimentDataMarket && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up animation-delay-400">
                  <div className="glass-card-gold p-8 glow-border">
                    <div className="flex items-center gap-4 mb-6">
                      <TrendingUp className="h-7 w-7 text-gold" />
                      <h3 className="text-2xl font-poppins font-bold text-gold tracking-tight">Trend Summary</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-gold/20">
                        <span className="font-inter metallic-text">Market Trend</span>
                        <span className={`font-poppins font-bold text-xl ${
                          trendSummary.trend === 'Bullish' ? 'text-green-600' :
                          trendSummary.trend === 'Bearish' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {trendSummary.trend}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-gold/20">
                        <span className="font-inter metallic-text">Momentum</span>
                        <span className="font-poppins font-bold text-xl text-gold">{trendSummary.momentum}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-inter metallic-text-secondary mb-2">Bullish Signals</p>
                          <p className="text-3xl font-poppins font-bold text-green-600">{trendSummary.bullishCount}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm font-inter metallic-text-secondary mb-2">Bearish Signals</p>
                          <p className="text-3xl font-poppins font-bold text-red-600">{trendSummary.bearishCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card-gold p-8 glow-border">
                    <div className="flex items-center gap-4 mb-6">
                      <Newspaper className="h-7 w-7 text-gold" />
                      <h3 className="text-2xl font-poppins font-bold text-gold tracking-tight">Market Sentiment</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-gold/20">
                        <span className="font-inter metallic-text">Overall Sentiment</span>
                        <span className={`font-poppins font-bold text-xl ${
                          sentimentDataMarket.sentiment.includes('Bullish') ? 'text-green-600' :
                          sentimentDataMarket.sentiment.includes('Bearish') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {sentimentDataMarket.sentiment}
                        </span>
                      </div>
                      <div className="p-4 bg-white/40 rounded-lg border border-gold/20">
                        <p className="text-sm font-inter metallic-text-secondary mb-3">Sentiment Score</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-inter metallic-text">
                              {sentimentDataMarket.score > 0 ? 'Bullish' : sentimentDataMarket.score < 0 ? 'Bearish' : 'Neutral'}
                            </span>
                            <span className="text-lg font-poppins font-bold text-gold">
                              {(Math.abs(sentimentDataMarket.score) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.abs(sentimentDataMarket.score) * 100} 
                            className="h-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tradingMode === 'standard' && marketData && (
                <div className="glass-card p-10 md:p-12 glow-border mb-16 animate-fade-in-up animation-delay-400">
                  <div className="flex items-center gap-5 mb-12">
                    <BarChart3 className="h-8 w-8 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Technical Indicators</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketData.indicators.map((indicator, index) => (
                      <div
                        key={index}
                        className={`indicator-card p-8 rounded-xl border-2 ${getSignalBgColor(indicator.signal)} transition-all duration-700 hover:scale-105 animate-fade-in-up group`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-5">
                          <span className="font-poppins font-bold text-lg text-gold tracking-wide">
                            {INDICATOR_LABELS[indicator.indicatorType] || indicator.indicatorType}
                          </span>
                          <Badge variant="outline" className={`${getSignalColor(indicator.signal)} border-current text-sm`}>
                            {formatSignalLabel(indicator.signal)}
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-4 mb-3">
                          <span className="text-4xl font-inter font-bold metallic-text">
                            {indicator.value.toFixed(2)}
                          </span>
                          <div className={getSignalColor(indicator.signal)}>
                            {getSignalIcon(indicator.signal)}
                          </div>
                        </div>
                        <div className="mb-5">
                          <span className="text-xl font-inter font-bold text-gold">
                            {calculateConfidencePercentage(indicator.signal)}%
                          </span>
                          <span className="text-sm font-inter metallic-text-secondary ml-2">confidence</span>
                        </div>
                        <p className="text-sm font-inter metallic-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-700 leading-relaxed">
                          {INDICATOR_DESCRIPTIONS[indicator.indicatorType]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!selectedAsset && !isLoading && (
            <div className="text-center py-24 animate-fade-in-up animation-delay-400">
              <div className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gold/10 border-2 border-gold/30 mb-10">
                <Activity className="h-14 w-14 text-gold" />
              </div>
              <h3 className="text-4xl font-poppins font-bold text-gold mb-8 tracking-tight">
                Select an Asset to Begin
              </h3>
              <p className="metallic-text-secondary font-inter max-w-md mx-auto leading-relaxed text-xl">
                Choose from 20 assets (10 crypto + 10 forex) above to view real-time technical analysis and trading signals.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <DialogContent className="bg-white/95 border-2 border-gold/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-poppins text-gold flex items-center gap-4">
              <Lock className="h-7 w-7" />
              Lock Market Intel
            </DialogTitle>
            <DialogDescription className="metallic-text-secondary font-inter text-lg leading-relaxed">
              Enter passcode to lock Market Intelligence signals and revoke access. AI Sentiment will remain accessible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            <div>
              <Input
                type="password"
                value={lockPasscode}
                onChange={(e) => setLockPasscode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLockConfirm()}
                placeholder="Enter passcode"
                disabled={revokeAccessMutation.isPending}
                className={`bg-white/40 border-2 text-center text-2xl font-inter tracking-widest transition-all duration-700 h-14 ${
                  lockPasscodeError ? 'border-red-500 shake' : 'border-gold/30 focus:border-gold'
                }`}
              />
              {lockPasscodeError && (
                <p className="text-red-600 text-sm font-inter mt-4 text-center animate-fade-in-up">
                  Invalid passcode. Lock operation denied.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowLockDialog(false);
                setLockPasscode('');
                setLockPasscodeError(false);
              }}
              disabled={revokeAccessMutation.isPending}
              className="border-gray-300 metallic-text hover:border-gray-400 hover:bg-gray-100 font-poppins transition-all duration-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLockConfirm}
              disabled={revokeAccessMutation.isPending}
              className="bg-gold hover:bg-gold/90 text-black font-poppins font-bold metallic-button transition-all duration-700"
            >
              {revokeAccessMutation.isPending ? 'Locking...' : 'Confirm Lock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
