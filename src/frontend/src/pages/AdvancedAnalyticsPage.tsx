import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Target, LineChart, PieChart, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdvancedAnalyticsPage() {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  
  const portfolioData = {
    totalValue: 125430.50,
    dayChange: 3.2,
    weekChange: 8.7,
    monthChange: 15.3,
  };

  const riskMetrics = {
    volatility: 42.5,
    sharpeRatio: 1.85,
    maxDrawdown: 18.2,
    beta: 1.12,
  };

  const correlationData = [
    { pair: 'BTC-ETH', correlation: 0.87 },
    { pair: 'BTC-SOL', correlation: 0.72 },
    { pair: 'ETH-BNB', correlation: 0.65 },
    { pair: 'XRP-ADA', correlation: 0.58 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <BarChart3 className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold tracking-tight leading-tight metallic-text-hero mb-8">
              Advanced Analytics
            </h1>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed max-w-3xl mx-auto">
              Multi-asset portfolio analysis with risk assessment and correlation matrices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in-up animation-delay-200">
            <div className="glass-card-gold p-8 glow-border">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-gold" />
                <h3 className="text-lg font-poppins font-bold metallic-text">Portfolio Value</h3>
              </div>
              <p className="text-4xl font-inter font-bold text-gold mb-2">
                ${portfolioData.totalValue.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-inter font-bold">+{portfolioData.dayChange}%</span>
                <span className="text-sm metallic-text-secondary">24h</span>
              </div>
            </div>

            <div className="glass-card-gold p-8 glow-border">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-6 w-6 text-gold" />
                <h3 className="text-lg font-poppins font-bold metallic-text">Volatility</h3>
              </div>
              <p className="text-4xl font-inter font-bold text-gold mb-2">
                {riskMetrics.volatility}%
              </p>
              <Progress value={riskMetrics.volatility} className="h-3" />
            </div>

            <div className="glass-card-gold p-8 glow-border">
              <div className="flex items-center gap-3 mb-4">
                <LineChart className="h-6 w-6 text-gold" />
                <h3 className="text-lg font-poppins font-bold metallic-text">Sharpe Ratio</h3>
              </div>
              <p className="text-4xl font-inter font-bold text-gold mb-2">
                {riskMetrics.sharpeRatio}
              </p>
              <span className="text-sm metallic-text-secondary">Risk-adjusted return</span>
            </div>

            <div className="glass-card-gold p-8 glow-border">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-gold" />
                <h3 className="text-lg font-poppins font-bold metallic-text">Max Drawdown</h3>
              </div>
              <p className="text-4xl font-inter font-bold text-red-600 mb-2">
                -{riskMetrics.maxDrawdown}%
              </p>
              <span className="text-sm metallic-text-secondary">Peak to trough</span>
            </div>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-300">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-10 tracking-tight">
              Correlation Matrix
            </h2>
            <div className="glass-card p-10 glow-border">
              <div className="space-y-6">
                {correlationData.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-inter metallic-text">{item.pair}</span>
                      <span className="text-lg font-inter text-gold font-bold">
                        {(item.correlation * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={item.correlation * 100} className="h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-10 tracking-tight">
              Performance Tracking
            </h2>
            <Tabs defaultValue="day" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-10 bg-white/60 border-2 border-gold/30 p-1">
                <TabsTrigger value="day" className="font-poppins font-bold data-[state=active]:bg-gold data-[state=active]:text-black">
                  24H
                </TabsTrigger>
                <TabsTrigger value="week" className="font-poppins font-bold data-[state=active]:bg-gold data-[state=active]:text-black">
                  7D
                </TabsTrigger>
                <TabsTrigger value="month" className="font-poppins font-bold data-[state=active]:bg-gold data-[state=active]:text-black">
                  30D
                </TabsTrigger>
              </TabsList>

              <TabsContent value="day">
                <div className="glass-card-gold p-10 glow-border">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-poppins font-bold metallic-text">24 Hour Performance</h3>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <span className="text-3xl font-inter font-bold text-green-600">
                        +{portfolioData.dayChange}%
                      </span>
                    </div>
                  </div>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Your portfolio has gained ${(portfolioData.totalValue * portfolioData.dayChange / 100).toFixed(2)} in the last 24 hours.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="week">
                <div className="glass-card-gold p-10 glow-border">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-poppins font-bold metallic-text">7 Day Performance</h3>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <span className="text-3xl font-inter font-bold text-green-600">
                        +{portfolioData.weekChange}%
                      </span>
                    </div>
                  </div>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Your portfolio has gained ${(portfolioData.totalValue * portfolioData.weekChange / 100).toFixed(2)} in the last 7 days.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="month">
                <div className="glass-card-gold p-10 glow-border">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-poppins font-bold metallic-text">30 Day Performance</h3>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <span className="text-3xl font-inter font-bold text-green-600">
                        +{portfolioData.monthChange}%
                      </span>
                    </div>
                  </div>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Your portfolio has gained ${(portfolioData.totalValue * portfolioData.monthChange / 100).toFixed(2)} in the last 30 days.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
