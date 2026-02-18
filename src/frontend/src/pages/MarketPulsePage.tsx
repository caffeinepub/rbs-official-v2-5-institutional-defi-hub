import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { useMarketPulse } from '@/hooks/useMarketPulse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MarketPulsePage() {
  const { data: pulse, isLoading, error, refetch } = useMarketPulse();

  useEffect(() => {
    document.body.style.setProperty('--animate-duration', '0.6s');
    return () => {
      document.body.style.removeProperty('--animate-duration');
    };
  }, []);

  const getMomentumIcon = () => {
    if (!pulse) return <Activity className="h-6 w-6" />;
    switch (pulse.status) {
      case 'Bullish':
        return <TrendingUp className="h-6 w-6 text-green-600 animate-pulse" />;
      case 'Bearish':
        return <TrendingDown className="h-6 w-6 text-red-600 animate-pulse" />;
      default:
        return <Minus className="h-6 w-6 text-yellow-600 animate-pulse" />;
    }
  };

  const getMomentumColor = () => {
    if (!pulse) return 'text-muted-foreground';
    switch (pulse.status) {
      case 'Bullish':
        return 'text-green-600 dark:text-green-400';
      case 'Bearish':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <>
      <PageHead title="Market Pulse" description="Real-time market momentum and technical indicators" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-poppins font-bold metallic-text-hero mb-4">
                Market Pulse
              </h1>
              <p className="text-lg metallic-text-secondary mb-6">
                Real-time technical analysis and market momentum
              </p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="mex-hover-lift transition-all duration-300"
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Analysis
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 animate-fade-in">
                <AlertDescription>
                  Failed to load market data. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && !pulse && (
              <div className="text-center py-12 animate-pulse">
                <p className="text-muted-foreground">Analyzing market conditions...</p>
              </div>
            )}

            {pulse && (
              <div className="space-y-6">
                {/* Market Momentum Card */}
                <Card className="glass-card-gold glow-border animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {getMomentumIcon()}
                        Market Momentum
                      </span>
                      <Badge
                        variant={pulse.status === 'Bullish' ? 'default' : pulse.status === 'Bearish' ? 'destructive' : 'secondary'}
                        className="transition-all duration-300"
                      >
                        {pulse.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Current market sentiment based on technical indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${getMomentumColor()} transition-all duration-300`}>
                      {pulse.status} Market Conditions
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Analysis based on RSI, MACD, and moving averages
                    </p>
                  </CardContent>
                </Card>

                {/* Technical Indicators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* RSI Card */}
                  <Card className="glass-card mex-hover-lift transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <CardHeader>
                      <CardTitle className="text-gold">RSI</CardTitle>
                      <CardDescription>Relative Strength Index</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-gold transition-all duration-300">
                        {pulse.rsi.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {pulse.rsi > 70 ? 'Overbought' : pulse.rsi < 30 ? 'Oversold' : 'Neutral'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* MACD Card */}
                  <Card className="glass-card mex-hover-lift transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <CardHeader>
                      <CardTitle className="text-gold">MACD</CardTitle>
                      <CardDescription>Moving Average Convergence Divergence</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-gold transition-all duration-300">
                        {pulse.macd.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {pulse.macd > 0 ? 'Bullish Signal' : 'Bearish Signal'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Moving Average Card */}
                  <Card className="glass-card mex-hover-lift transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <CardHeader>
                      <CardTitle className="text-gold">MA (50)</CardTitle>
                      <CardDescription>50-Period Moving Average</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-gold transition-all duration-300">
                        ${pulse.ma50.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Trend indicator
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Last Update Info */}
                <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <p className="text-sm text-muted-foreground">
                    Analysis updates automatically every 20 seconds
                  </p>
                  {pulse.timestamp && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {new Date(pulse.timestamp).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Data sourced from backend market pulse engine
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
