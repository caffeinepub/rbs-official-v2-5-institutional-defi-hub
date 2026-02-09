import { useEffect, useState } from 'react';
import { TrendingUp, Activity, Network, Shield, Zap, Globe, Lock, Users, Target, Coins, Rocket, Vote, Sparkles, Calendar, MessageCircle, Lightbulb, Handshake, Server, Gauge, BarChart3, TrendingDown } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { MotionSafe } from '@/components/MotionSafe';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomePage() {
  const [greeting, setGreeting] = useState(getGreeting());
  const [resonanceScore, setResonanceScore] = useState(87.3);
  const [globalNodes, setGlobalNodes] = useState(12847);
  const [meshParity, setMeshParity] = useState(94.2);
  const [activeValidators, setActiveValidators] = useState(1247);
  const [txVolume, setTxVolume] = useState(8934567);
  const [governanceParticipation, setGovernanceParticipation] = useState(76.8);

  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    const dataInterval = setInterval(() => {
      setResonanceScore((prev) => +(prev + (Math.random() - 0.5) * 2).toFixed(1));
      setGlobalNodes((prev) => prev + Math.floor(Math.random() * 5));
      setMeshParity((prev) => +(prev + (Math.random() - 0.5) * 0.5).toFixed(1));
      setActiveValidators((prev) => prev + Math.floor(Math.random() * 3 - 1));
      setTxVolume((prev) => prev + Math.floor(Math.random() * 10000));
      setGovernanceParticipation((prev) => +(prev + (Math.random() - 0.5) * 0.3).toFixed(1));
    }, 3000);

    return () => {
      clearInterval(greetingInterval);
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <>
      <PageHead 
        title="Home" 
        description="RBS - Return. Be Superior. Professional crypto token powered by advanced blockchain technology with community-driven governance and deflationary tokenomics."
      />
      <div className="min-h-screen">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <MotionSafe animation="scale" delay={100}>
                <div className="flex justify-center mb-12">
                  <img 
                    src="/assets/IMG_20250821_154306_073.jpg" 
                    alt="RBS Logo" 
                    className="h-40 w-40 rounded-full object-cover shadow-gold-xl hover:scale-110 transition-all duration-500"
                  />
                </div>
              </MotionSafe>
              
              <MotionSafe animation="fade" delay={200}>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-poppins font-bold mb-10 metallic-text-hero leading-tight">
                  {greeting}!
                </h1>
              </MotionSafe>
              
              <MotionSafe animation="fade" delay={400}>
                <h2 className="text-4xl md:text-6xl font-poppins font-bold mb-10 shimmer-gold leading-tight">
                  Return. Be Superior.
                </h2>
              </MotionSafe>
              
              <MotionSafe animation="fade" delay={600}>
                <div className="mb-10">
                  <p className="text-2xl md:text-3xl text-gold font-poppins font-semibold mb-6 leading-relaxed">
                    All opinions about RBS will be taken from the RBS community to make it a fair, community-driven token.
                  </p>
                </div>
              </MotionSafe>
              
              <MotionSafe animation="fade" delay={800}>
                <p className="text-xl md:text-2xl metallic-text mb-6 font-inter">
                  Professional Crypto Token
                </p>
                <p className="text-lg md:text-xl metallic-text-secondary mb-16 max-w-3xl mx-auto font-inter leading-relaxed">
                  Next-generation crypto token powered by advanced technology.
                  Secure, scalable, and built for the future of decentralized digital assets.
                </p>
              </MotionSafe>

              <MotionSafe animation="slide" delay={1000}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                  <div className="protocol-ticker-card">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-gold" />
                      <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                        Resonance Score
                      </h3>
                    </div>
                    <p className="text-4xl font-poppins font-bold text-gold">{resonanceScore}%</p>
                  </div>

                  <div className="protocol-ticker-card">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Network className="h-6 w-6 text-gold" />
                      <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                        Global Nodes
                      </h3>
                    </div>
                    <p className="text-4xl font-poppins font-bold text-gold">
                      {globalNodes.toLocaleString()}
                    </p>
                  </div>

                  <div className="protocol-ticker-card">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Activity className="h-6 w-6 text-gold" />
                      <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                        Mesh Parity
                      </h3>
                    </div>
                    <p className="text-4xl font-poppins font-bold text-gold">{meshParity}%</p>
                  </div>
                </div>
              </MotionSafe>

              <MotionSafe animation="slide" delay={1200}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="protocol-ticker-card">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Server className="h-6 w-6 text-gold" />
                      <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                        Active Validators
                      </h3>
                    </div>
                    <p className="text-4xl font-poppins font-bold text-gold">{activeValidators.toLocaleString()}</p>
                  </div>

                  <div className="protocol-ticker-card">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Zap className="h-6 w-6 text-gold" />
                      <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                        TX Volume (24h)
                      </h3>
                    </div>
                    <p className="text-4xl font-poppins font-bold text-gold">
                      {(txVolume / 1000000).toFixed(2)}M
                    </p>
                  </div>

                  <div className="protocol-ticker-card">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Gauge className="h-6 w-6 text-gold" />
                      <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                        Governance Rate
                      </h3>
                    </div>
                    <p className="text-4xl font-poppins font-bold text-gold">{governanceParticipation}%</p>
                  </div>
                </div>
              </MotionSafe>
            </div>
          </div>
        </section>

        <SmokySectionTransition delay={200}>
          <section className="section-spacing bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                  <h2 className="section-heading mb-8">
                    Mission & Vision
                  </h2>
                  <p className="section-description">
                    RBS is a professional crypto token project revolutionizing digital assets through cutting-edge blockchain technology
                    with enterprise-grade security and scalability.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="core-value-card">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                        <Shield className="h-10 w-10 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4 text-center">
                      Security First
                    </h3>
                    <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                      Military-grade encryption and multi-layer security protocols ensure your assets
                      remain protected at all times.
                    </p>
                  </div>

                  <div className="core-value-card">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                        <Zap className="h-10 w-10 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4 text-center">
                      Lightning Fast
                    </h3>
                    <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                      Sub-second transaction finality powered by our proprietary consensus
                      mechanism.
                    </p>
                  </div>

                  <div className="core-value-card">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                        <Globe className="h-10 w-10 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4 text-center">
                      Global Scale
                    </h3>
                    <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                      Distributed infrastructure spanning multiple continents ensures 99.99% uptime
                      and seamless scalability.
                    </p>
                  </div>

                  <div className="core-value-card">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                        <Lock className="h-10 w-10 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4 text-center">
                      Institutional Grade
                    </h3>
                    <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                      Built to meet the stringent requirements of institutional investors and
                      enterprise clients.
                    </p>
                  </div>

                  <div className="core-value-card">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                        <Network className="h-10 w-10 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4 text-center">
                      Decentralized
                    </h3>
                    <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                      True decentralization through our network ensures no single point
                      of failure.
                    </p>
                  </div>

                  <div className="core-value-card">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                        <TrendingUp className="h-10 w-10 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4 text-center">
                      Value Driven
                    </h3>
                    <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                      Deflationary tokenomics and strategic scarcity mechanisms designed for
                      long-term value appreciation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={300}>
          <section className="section-spacing bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                    <Coins className="h-10 w-10 text-gold" />
                  </div>
                  <h2 className="section-heading mb-8">
                    Token Utility Overview
                  </h2>
                  <p className="section-description">
                    RBS token powers our ecosystem with multiple use cases and benefits for holders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="glass-card-gold p-10 glow-border">
                    <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Governance Rights</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                      Token holders participate in protocol governance, voting on proposals, treasury allocations, and strategic decisions.
                    </p>
                    <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Vote on protocol upgrades and changes</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Propose new features and initiatives</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Influence partnership decisions</span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass-card-gold p-10 glow-border">
                    <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Staking Rewards</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                      Stake your RBS tokens to earn rewards. Long-term holders benefit from deflationary mechanics.
                    </p>
                    <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Earn passive income through staking</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Benefit from deflationary token burns</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Access to exclusive holder benefits</span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass-card-gold p-10 glow-border">
                    <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Ecosystem Access</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                      RBS tokens provide access to premium features and exclusive ecosystem benefits.
                    </p>
                    <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Priority access to new features</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Reduced fees on platform services</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Exclusive community events</span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass-card-gold p-10 glow-border">
                    <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Trading & Liquidity</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                      Trade RBS on major exchanges with deep liquidity pools.
                    </p>
                    <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Listed on major exchanges</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Deep liquidity for seamless trading</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1 text-xl">•</span>
                        <span>Competitive trading fees</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={400}>
          <section className="section-spacing bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                    <BarChart3 className="h-10 w-10 text-gold" />
                  </div>
                  <h2 className="section-heading mb-8">
                    Market Performance
                  </h2>
                  <p className="section-description">
                    Track RBS performance metrics and market indicators in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass-card p-8 text-center">
                    <TrendingUp className="h-12 w-12 text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-2">Market Cap</h3>
                    <p className="text-3xl font-poppins font-bold text-gold mb-2">$12.4M</p>
                    <p className="text-sm text-gold font-inter">+24.5% (24h)</p>
                  </div>

                  <div className="glass-card p-8 text-center">
                    <Activity className="h-12 w-12 text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-2">24h Volume</h3>
                    <p className="text-3xl font-poppins font-bold text-gold mb-2">$2.8M</p>
                    <p className="text-sm text-gold font-inter">+18.2% (24h)</p>
                  </div>

                  <div className="glass-card p-8 text-center">
                    <Users className="h-12 w-12 text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-2">Holders</h3>
                    <p className="text-3xl font-poppins font-bold text-gold mb-2">8,547</p>
                    <p className="text-sm text-gold font-inter">+12.3% (7d)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={500}>
          <section className="section-spacing bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                    <Rocket className="h-10 w-10 text-gold" />
                  </div>
                  <h2 className="section-heading mb-8">
                    Why Choose RBS?
                  </h2>
                  <p className="section-description">
                    Discover what makes RBS the superior choice for your digital asset portfolio.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="glass-card p-10">
                    <Target className="h-12 w-12 text-gold mb-6" />
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Strategic Vision</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Our long-term roadmap focuses on sustainable growth, continuous innovation, and delivering value to our community through strategic partnerships and technological advancement.
                    </p>
                  </div>

                  <div className="glass-card p-10">
                    <Vote className="h-12 w-12 text-gold mb-6" />
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Community Driven</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Every major decision is made by the community through our transparent governance system. Your voice matters, and your vote shapes the future of RBS.
                    </p>
                  </div>

                  <div className="glass-card p-10">
                    <Sparkles className="h-12 w-12 text-gold mb-6" />
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Innovation First</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      We continuously push the boundaries of what's possible in blockchain technology, implementing cutting-edge solutions that set new industry standards.
                    </p>
                  </div>

                  <div className="glass-card p-10">
                    <Handshake className="h-12 w-12 text-gold mb-6" />
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Trusted Partners</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Strategic partnerships with leading institutions and technology providers ensure RBS remains at the forefront of the digital asset revolution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={600}>
          <section className="section-spacing bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                    <Calendar className="h-10 w-10 text-gold" />
                  </div>
                  <h2 className="section-heading mb-8">
                    Upcoming Milestones
                  </h2>
                  <p className="section-description">
                    Stay informed about our development progress and upcoming releases.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="glass-card-gold p-8 glow-border">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold">
                        <span className="text-2xl font-poppins font-bold text-gold">Q1</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Platform Launch</h3>
                        <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                          Official launch of the RBS platform with full trading capabilities, staking mechanisms, and governance features.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card-gold p-8 glow-border">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold">
                        <span className="text-2xl font-poppins font-bold text-gold">Q2</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Exchange Listings</h3>
                        <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                          Strategic listings on major centralized and decentralized exchanges to increase liquidity and accessibility.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card-gold p-8 glow-border">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold">
                        <span className="text-2xl font-poppins font-bold text-gold">Q3</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Ecosystem Expansion</h3>
                        <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                          Launch of additional ecosystem products including mobile apps, browser extensions, and developer tools.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={700}>
          <section className="section-spacing bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="glass-card-gold p-12 glow-border">
                  <MessageCircle className="h-16 w-16 text-gold mx-auto mb-8" />
                  <h2 className="text-4xl md:text-5xl font-poppins font-bold metallic-text mb-6">
                    Join the RBS Community
                  </h2>
                  <p className="text-xl metallic-text-secondary font-inter leading-relaxed mb-8">
                    Be part of the future of decentralized finance. Connect with thousands of RBS holders, participate in governance, and shape the future together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/acquisition"
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-matte to-gold-light hover:from-gold-light hover:to-gold-matte text-dark-matter font-poppins font-bold rounded-lg shadow-gold-md hover:shadow-gold-lg transition-all"
                    >
                      Get Started
                    </a>
                    <a
                      href="/whitepaper"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gold-matte text-gold-matte hover:bg-gold-matte/10 font-poppins font-bold rounded-lg transition-all"
                    >
                      Read Whitepaper
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>
      </div>
    </>
  );
}
