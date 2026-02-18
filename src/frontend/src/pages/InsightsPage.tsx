import { TrendingUp, BarChart3, PieChart, Activity, Zap, Globe, Target, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { PageHead } from '@/components/PageHead';

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
    <>
      <PageHead 
        title="Market Insights" 
        description="Professional market analysis, trend forecasts, and expert opinions on the crypto landscape"
      />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SmokySectionTransition>
              <div className="text-center mb-20">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                  <BarChart3 className="h-10 w-10 text-gold" />
                </div>
                <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-8 leading-tight metallic-text-hero">
                  Market Insights
                </h1>
                <p className="text-xl md:text-2xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                  Professional market analysis, trend forecasts, and expert opinions on the crypto landscape
                </p>
              </div>
            </SmokySectionTransition>

            <div className="space-y-12 mb-20">
              {marketInsights.map((insight, index) => (
                <SmokySectionTransition key={index} delay={index * 100}>
                  <div className="glass-card-gold p-10 md:p-12 glow-border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold/20">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                        <insight.icon className="h-8 w-8 text-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-sm font-inter text-gold">
                            {insight.category}
                          </span>
                          <span className="text-sm metallic-text-secondary font-inter">{insight.date}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gold mb-6">{insight.title}</h2>
                        <p className="text-lg metallic-text-secondary font-inter leading-relaxed mb-8">{insight.content}</p>

                        <div className="space-y-6">
                          {insight.metrics.map((metric, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-base font-inter metallic-text">{metric.label}</span>
                                <span className="text-lg font-jetbrains font-bold text-gold">{metric.value}%</span>
                              </div>
                              <Progress value={metric.value} className="h-3" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SmokySectionTransition>
              ))}
            </div>

            <SmokySectionTransition delay={300}>
              <div className="mb-20">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-10 text-center">Technical Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {technicalInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="glass-card p-8 glow-border transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold/20"
                    >
                      <div className="flex items-start gap-5 mb-6">
                        <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                          <insight.icon className="h-7 w-7 text-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-poppins font-bold text-gold mb-3">{insight.title}</h3>
                          <p className="text-base metallic-text-secondary font-inter leading-relaxed mb-4">{insight.description}</p>
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
            </SmokySectionTransition>

            <SmokySectionTransition delay={400}>
              <div className="glass-card-gold p-12 glow-border">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-10 text-center">Industry Growth Trends</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {industryTrends.map((trend, index) => (
                    <div key={index} className="text-center">
                      <p className="text-sm metallic-text-secondary font-inter mb-3">{trend.trend}</p>
                      <p className="text-5xl font-jetbrains font-bold text-gold mb-2">+{trend.growth}%</p>
                      <p className="text-xs metallic-text-secondary font-inter">{trend.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SmokySectionTransition>
          </div>
        </div>
      </div>
    </>
  );
}
