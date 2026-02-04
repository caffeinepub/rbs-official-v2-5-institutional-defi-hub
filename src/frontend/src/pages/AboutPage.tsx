import { Shield, Zap, Globe, Lock, Network, TrendingUp, Target, Award, Users, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const coreValues = [
    {
      icon: Shield,
      title: 'Security First',
      description:
        'Military-grade encryption and multi-layer security protocols ensure your assets remain protected at all times. Our infrastructure undergoes continuous security audits by leading firms.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Sub-second transaction finality powered by our proprietary neural mesh consensus mechanism. Experience unparalleled speed without compromising security or decentralization.',
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description:
        'Distributed infrastructure spanning multiple continents ensures 99.99% uptime and seamless scalability. Built to handle institutional-grade transaction volumes.',
    },
    {
      icon: Lock,
      title: 'Institutional Grade',
      description:
        'Built to meet the stringent requirements of institutional investors and enterprise clients. Compliance-ready with advanced custody and reporting features.',
    },
    {
      icon: Network,
      title: 'True Decentralization',
      description:
        'Our mesh node network ensures no single point of failure. Distributed governance and consensus mechanisms guarantee censorship resistance and network resilience.',
    },
    {
      icon: TrendingUp,
      title: 'Value Driven',
      description:
        'Deflationary tokenomics and strategic scarcity mechanisms designed for long-term value appreciation. Sustainable economic model aligned with stakeholder interests.',
    },
  ];

  const highlights = [
    {
      icon: Target,
      title: 'Deflationary Model',
      description:
        'Fixed supply of 100,000 RBS tokens with strategic burn mechanisms. Regular burn events reduce circulating supply, creating scarcity and supporting long-term value growth.',
    },
    {
      icon: Award,
      title: 'Proven Technology',
      description:
        'Built on battle-tested blockchain infrastructure with proprietary neural mesh technology. Audited smart contracts and transparent on-chain operations.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <Shield className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold mb-6 tracking-tight leading-tight">
              About RBS
            </h1>
            <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
              A professional crypto token project revolutionizing digital assets through cutting-edge technology and unwavering
              commitment to security, scalability, and decentralization
            </p>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-200">
            <div className="glass-card-gold p-10 md:p-12 glow-border">
              <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center tracking-tight">
                Our Mission
              </h2>
              <p className="metallic-text-secondary font-inter text-lg leading-relaxed text-center max-w-4xl mx-auto mb-6">
                RBS is a professional crypto token project revolutionizing digital assets by combining cutting-edge blockchain
                technology with enterprise-grade security and scalability. We're building the
                infrastructure that will power the next generation of decentralized token ecosystems,
                bridging the gap between traditional finance and the decentralized future.
              </p>
              <p className="metallic-text-secondary font-inter text-lg leading-relaxed text-center max-w-4xl mx-auto">
                Our vision is to create a truly decentralized token ecosystem that serves
                institutional clients while maintaining the core principles of blockchain technology:
                transparency, security, and censorship resistance. Through innovative neural mesh
                technology and strategic partnerships, we're making this vision a reality.
              </p>
            </div>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-400">
            <h2 className="text-4xl font-poppins font-bold text-gold mb-10 text-center tracking-tight">
              Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="glass-card p-8 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 glow-border"
                  >
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                        <Icon className="h-8 w-8 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-poppins font-bold text-gold mb-4 text-center tracking-tight">
                      {value.title}
                    </h3>
                    <p className="metallic-text-secondary font-inter text-center leading-relaxed text-lg">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-600">
            <h2 className="text-4xl font-poppins font-bold text-gold mb-10 text-center tracking-tight">
              Deflationary Model Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={index}
                    className="glass-card-gold p-10 glow-border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold/40 flex-shrink-0">
                        <Icon className="h-7 w-7 text-gold" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-poppins font-bold text-gold mb-4 tracking-tight">
                          {highlight.title}
                        </h3>
                        <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-700">
            <div className="glass-card p-10 md:p-12 glow-border">
              <div className="flex items-center justify-center mb-8">
                <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <Users className="h-10 w-10 text-gold" />
                </div>
              </div>
              <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center tracking-tight">
                Governance Model
              </h2>
              <p className="metallic-text-secondary font-inter text-lg leading-relaxed text-center max-w-4xl mx-auto mb-10">
                RBS is a fair, community-driven token where all opinions from the RBS community shape our future. Token holders participate in governance through transparent voting mechanisms, ensuring every voice matters in protocol decisions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card-gold p-8">
                  <h3 className="text-2xl font-poppins font-bold text-gold mb-4 tracking-tight">Democratic Voting</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    One token equals one vote. All proposals undergo community review and transparent on-chain voting. Quorum requirements ensure broad participation in major decisions.
                  </p>
                </div>
                <div className="glass-card-gold p-8">
                  <h3 className="text-2xl font-poppins font-bold text-gold mb-4 tracking-tight">Proposal System</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Community members can submit proposals for protocol changes, partnerships, and treasury allocations. Each proposal includes a discussion period before voting begins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16 animate-fade-in-up animation-delay-800">
            <div className="glass-card-gold p-10 md:p-12 glow-border">
              <div className="flex items-center justify-center mb-8">
                <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <Lightbulb className="h-10 w-10 text-gold" />
                </div>
              </div>
              <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center tracking-tight">
                Vision 2031
              </h2>
              <p className="metallic-text-secondary font-inter text-lg leading-relaxed text-center max-w-4xl mx-auto mb-10">
                Our long-term vision extends beyond 2030, positioning RBS as a leading professional crypto token globally. We're building for the future of digital assets.
              </p>
              <div className="space-y-8">
                <div className="glass-card p-8">
                  <h3 className="text-2xl font-poppins font-bold text-gold mb-4 tracking-tight">Global Adoption</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Partnerships with major financial institutions worldwide, processing billions in daily transaction volume through our neural mesh infrastructure.
                  </p>
                </div>
                <div className="glass-card p-8">
                  <h3 className="text-2xl font-poppins font-bold text-gold mb-4 tracking-tight">Ecosystem Expansion</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Launch of RBS-powered products including staking platforms, governance tools, and cross-chain bridges connecting traditional and decentralized ecosystems.
                  </p>
                </div>
                <div className="glass-card p-8">
                  <h3 className="text-2xl font-poppins font-bold text-gold mb-4 tracking-tight">Technological Innovation</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Quantum-resistant cryptography, AI-powered analytics, and zero-knowledge proof implementations for enhanced privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 text-center animate-fade-in-up animation-delay-900 glow-border">
            <h3 className="text-3xl font-poppins font-bold text-gold mb-6 tracking-tight">
              Join the Revolution
            </h3>
            <p className="metallic-text-secondary font-inter leading-relaxed max-w-3xl mx-auto text-lg">
              Be part of the crypto token revolution. RBS is more than a token—it's a movement
              toward a more transparent, secure, and accessible financial future. Together, we're
              building the infrastructure that will power the next generation of decentralized
              digital assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
