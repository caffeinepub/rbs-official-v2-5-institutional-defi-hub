import { TrendingUp, BarChart3, PieChart, Activity, Zap, Globe, Target, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function InsightsPage() {
  const marketInsights = [
    {
      title: 'Crypto Market Trends 2026',
      category: 'Market Analysis',
      date: 'January 2026',
      icon: TrendingUp,
      content: 'The crypto market is experiencing a paradigm shift towards institutional adoption and regulatory clarity. Professional tokens with strong fundamentals, transparent governance, and real utility are gaining traction. RBS is positioned at the forefront of this movement with its enterprise-grade infrastructure and community-driven approach.',
      metrics: [
        { label: 'Institutional Interest', value: 87, color: 'bg-green-500' },
        { label: 'Regulatory Clarity', value: 72, color: 'bg-blue-500' },
        { label: 'Market Maturity', value: 65, color: 'bg-purple-500' },
      ],
    },
    {
      title: 'Deflationary Tokenomics Impact',
      category: 'Economic Analysis',
      date: 'January 2026',
      icon: PieChart,
      content: 'Deflationary token models with fixed supply and burn mechanisms have demonstrated superior long-term value retention. RBS\'s 15% burn allocation combined with the 100,000 token fixed supply creates sustainable scarcity. Historical data shows deflationary tokens outperform inflationary models by 3-5x over 5-year periods.',
      metrics: [
        { label: 'Supply Reduction Rate', value: 15, color: 'bg-gold' },
        { label: 'Value Retention', value: 94, color: 'bg-green-500' },
        { label: 'Holder Confidence', value: 89, color: 'bg-blue-500' },
      ],
    },
    {
      title: 'Community Governance Evolution',
      category: 'Governance Insights',
      date: 'January 2026',
      icon: Target,
      content: 'Community-driven governance models are proving more resilient and adaptive than centralized alternatives. Projects with active governance participation show 40% higher retention rates and 60% better long-term performance. RBS\'s transparent voting system and proposal mechanism set new standards for decentralized decision-making.',
      metrics: [
        { label: 'Governance Participation', value: 76, color: 'bg-purple-500' },
        { label: 'Proposal Success Rate', value: 82, color: 'bg-green-500' },
        { label: 'Community Satisfaction', value: 91, color: 'bg-gold' },
      ],
    },
  ];

  const technicalInsights = [
    {
      title: 'Neural Mesh Technology',
      icon: Activity,
      description: 'Sub-second finality with distributed consensus across global nodes',
      impact: 'High',
    },
    {
      title: 'Quantum-Resistant Roadmap',
      icon: Zap,
      description: 'Future-proofing against emerging quantum computing threats',
      impact: 'Critical',
    },
    {
      title: 'Cross-Chain Integration',
      icon: Globe,
      description: 'Seamless interoperability with major blockchain ecosystems',
      impact: 'High',
    },
    {
      title: 'Scalability Architecture',
      icon: Rocket,
      description: 'Designed to handle billions in daily transaction volume',
      impact: 'Critical',
    },
  ];

  const industryTrends = [
    { trend: 'Institutional Adoption', growth: 145, period: 'YoY' },
    { trend: 'DeFi Integration', growth: 230, period: 'YoY' },
    { trend: 'Regulatory Compliance', growth: 180, period: 'YoY' },
    { trend: 'Community Governance', growth: 195, period: 'YoY' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-black/95 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8 animate-pulse-glow">
              <BarChart3 className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-8 leading-tight">
              <span className="shimmer-gold">Market Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver/80 font-inter max-w-3xl mx-auto leading-relaxed">
              Professional market analysis, trend forecasts, and expert opinions on the crypto landscape
            </p>
          </div>

          <div className="space-y-12 mb-20">
            {marketInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm border-2 border-gold/30 rounded-xl p-10 md:p-12 glow-border transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                    <insight.icon className="h-8 w-8 text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-sm font-inter text-gold">
                        {insight.category}
                      </span>
                      <span className="text-sm text-silver/60 font-inter">{insight.date}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-gold mb-6">{insight.title}</h2>
                    <p className="text-lg text-silver/80 font-inter leading-relaxed mb-8">{insight.content}</p>

                    <div className="space-y-6">
                      {insight.metrics.map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-base font-inter text-silver">{metric.label}</span>
                            <span className="text-lg font-jetbrains font-bold text-gold">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-20 animate-fade-in-up animation-delay-600">
            <h2 className="text-4xl font-orbitron font-bold text-gold mb-10 text-center">Technical Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {technicalInsights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-black/60 backdrop-blur-sm border-2 border-gold/30 rounded-xl p-8 glow-border transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20"
                >
                  <div className="flex items-start gap-5 mb-6">
                    <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                      <insight.icon className="h-7 w-7 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-orbitron font-bold text-gold mb-3">{insight.title}</h3>
                      <p className="text-base text-silver/80 font-inter leading-relaxed mb-4">{insight.description}</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-inter ${
                        insight.impact === 'Critical' 
                          ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                          : 'bg-green-500/20 border border-green-500/40 text-green-400'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gold/10 to-black/60 backdrop-blur-sm border-2 border-gold/40 rounded-xl p-12 glow-border animate-fade-in-up animation-delay-800">
            <h2 className="text-4xl font-orbitron font-bold text-gold mb-10 text-center">Industry Growth Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {industryTrends.map((trend, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm text-silver/70 font-inter mb-3">{trend.trend}</p>
                  <p className="text-5xl font-jetbrains font-bold text-gold mb-2">+{trend.growth}%</p>
                  <p className="text-xs text-silver/60 font-inter">{trend.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
