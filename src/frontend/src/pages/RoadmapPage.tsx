import { Calendar, Target, Users, Rocket, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function RoadmapPage() {
  const roadmapPhases = [
    {
      year: '2026',
      title: 'Community Growth Year',
      status: 'active',
      icon: Users,
      color: '#D4AF37',
      milestones: [
        { text: 'Launch community channels and social media presence', completed: true },
        { text: 'Early adopter program with exclusive benefits', completed: true },
        { text: 'Whitepaper release and technical documentation', completed: false },
        { text: 'Website launch with full feature set', completed: false },
        { text: 'Community governance framework establishment', completed: false },
      ],
    },
    {
      year: '2027',
      title: 'Presale Launch',
      status: 'upcoming',
      icon: Rocket,
      color: '#4ADE80',
      milestones: [
        { text: 'Token generation event and smart contract deployment', completed: false },
        { text: 'Public presale opens with tiered pricing', completed: false },
        { text: 'Comprehensive smart contract audits by leading firms', completed: false },
        { text: 'Initial DEX listings on major platforms', completed: false },
        { text: 'Liquidity pool creation and management', completed: false },
      ],
    },
    {
      year: '2028',
      title: 'Collaborations & Ecosystem Building',
      status: 'upcoming',
      icon: Globe,
      color: '#3B82F6',
      milestones: [
        { text: 'Strategic partnerships with DeFi protocols', completed: false },
        { text: 'CEX listings on tier-1 exchanges', completed: false },
        { text: 'Cross-chain bridge implementations', completed: false },
        { text: 'Institutional outreach and onboarding program', completed: false },
        { text: 'Developer ecosystem grants and hackathons', completed: false },
      ],
    },
    {
      year: '2029',
      title: 'Airdrop Distribution',
      status: 'upcoming',
      icon: Target,
      color: '#F59E0B',
      milestones: [
        { text: 'Community airdrop to early supporters', completed: false },
        { text: 'Staking rewards program launch', completed: false },
        { text: 'Governance activation and DAO formation', completed: false },
        { text: 'Mobile app release for iOS and Android', completed: false },
        { text: 'Enhanced features and user experience improvements', completed: false },
      ],
    },
    {
      year: '2030',
      title: 'Official Token Launch',
      status: 'upcoming',
      icon: TrendingUp,
      color: '#8B5CF6',
      milestones: [
        { text: 'Full platform launch with all features', completed: false },
        { text: 'Institutional services and custody solutions', completed: false },
        { text: 'Advanced trading tools and analytics', completed: false },
        { text: 'Global expansion and regulatory compliance', completed: false },
        { text: 'Ecosystem maturity and self-sustainability', completed: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <Calendar className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold tracking-tight leading-tight metallic-text-hero mb-6">
              Development Roadmap
            </h1>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed">
              Strategic milestones from 2026 to 2030
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/50 to-transparent hidden md:block" />

            <div className="space-y-12">
              {roadmapPhases.map((phase, index) => {
                const Icon = phase.icon;
                return (
                  <div
                    key={index}
                    className="relative animate-fade-in-up parallax-section"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="hidden md:flex flex-col items-center flex-shrink-0">
                        <div
                          className={`h-16 w-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            phase.status === 'active'
                              ? 'bg-gold/20 border-gold shadow-lg shadow-gold/30 scale-110'
                              : 'bg-white/60 border-gold/30 hover:border-gold/50'
                          }`}
                        >
                          <Icon
                            className={`h-8 w-8 ${
                              phase.status === 'active' ? 'text-gold' : 'text-gold/70'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex-1 glass-card p-8 hover:border-gold/30 transition-all duration-300 glow-border soft-glow">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Calendar className="h-5 w-5 text-gold" />
                              <span className="text-lg font-poppins text-gold font-bold">
                                {phase.year}
                              </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-poppins font-bold text-gold">
                              {phase.title}
                            </h3>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-poppins uppercase ${
                              phase.status === 'active'
                                ? 'bg-gold/20 text-gold border-2 border-gold/30 animate-pulse'
                                : 'bg-white/40 text-gold/70 border-2 border-gold/20'
                            }`}
                          >
                            {phase.status}
                          </span>
                        </div>

                        <ul className="space-y-3">
                          {phase.milestones.map((milestone, mIndex) => (
                            <li key={mIndex} className="flex items-start gap-3 group">
                              {milestone.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gold/30 mt-0.5 flex-shrink-0 group-hover:border-gold/50 transition-colors" />
                              )}
                              <span
                                className={`font-inter leading-relaxed ${
                                  milestone.completed
                                    ? 'metallic-text-secondary line-through opacity-60'
                                    : 'metallic-text-secondary group-hover:text-gold transition-colors'
                                }`}
                              >
                                {milestone.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 glass-card-gold p-10 animate-fade-in-up animation-delay-600 glow-border">
            <h3 className="text-3xl font-poppins font-bold text-gold mb-6 text-center tracking-tight">
              Long-term Vision (Beyond 2030)
            </h3>
            <p className="metallic-text-secondary font-inter leading-relaxed text-center max-w-4xl mx-auto text-lg">
              Beyond 2030, RBS will continue evolving as the premier institutional DeFi platform.
              Our focus shifts to ecosystem expansion, global regulatory compliance, advanced
              financial primitives, and establishing RBS as the standard for institutional
              blockchain infrastructure. Continuous innovation and community-driven development
              will guide our journey toward becoming the backbone of decentralized institutional
              finance. We envision a future where RBS powers the next generation of financial
              services, bridging traditional finance with decentralized technologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
