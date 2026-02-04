import { useEffect, useState } from 'react';
import { TrendingUp, Activity, Network, Shield, Zap, Globe, Lock, Users, Target, Coins, Rocket, Vote, Sparkles, Calendar, MessageCircle, Lightbulb, Handshake, Server, Gauge } from 'lucide-react';

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
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-12 animate-fade-in-up">
              <img 
                src="/assets/IMG_20250821_154306_073.jpg" 
                alt="RBS Logo" 
                className="h-40 w-40 rounded-full object-cover shadow-gold-xl hover:scale-110 transition-all duration-500"
              />
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-poppins font-bold mb-10 metallic-text-hero animate-fade-in-up leading-tight">
              {greeting}!
            </h1>
            <h2 className="text-4xl md:text-6xl font-poppins font-bold mb-10 shimmer-gold animate-fade-in-up animation-delay-200 leading-tight">
              Return. Be Superior.
            </h2>
            <div className="mb-10 animate-fade-in-up animation-delay-300">
              <p className="text-2xl md:text-3xl text-gold font-poppins font-semibold mb-6 leading-relaxed">
                All opinions about RBS will be taken from the RBS community to make it a fair, community-driven token.
              </p>
            </div>
            <p className="text-xl md:text-2xl metallic-text mb-6 font-inter animate-fade-in-up animation-delay-400">
              Professional Crypto Token
            </p>
            <p className="text-lg md:text-xl metallic-text-secondary mb-16 max-w-3xl mx-auto font-inter leading-relaxed animate-fade-in-up animation-delay-400">
              Next-generation crypto token powered by advanced technology.
              Secure, scalable, and built for the future of decentralized digital assets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-up animation-delay-600">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 animate-fade-in-up animation-delay-700">
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
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Mission & Vision
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                RBS is a professional crypto token project revolutionizing digital assets through cutting-edge blockchain technology
                with enterprise-grade security and scalability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in-up animation-delay-200">
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

      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Coins className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Token Utility Overview
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                RBS token powers our ecosystem with multiple use cases and benefits for holders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in-up animation-delay-200">
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
                    <span>Listed on major CEX and DEX platforms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>40% of supply allocated to liquidity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Transparent on-chain trading data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Sparkles className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Ecosystem Growth
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Building a thriving community-driven ecosystem with strategic integrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in-up animation-delay-200">
              <div className="glass-card p-10 glow-border">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-6">
                  <Users className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Community Building</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Growing a global community through educational initiatives and engagement programs.
                </p>
              </div>

              <div className="glass-card p-10 glow-border">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-6">
                  <Network className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Strategic Partnerships</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Collaborating with leading blockchain projects and institutional partners.
                </p>
              </div>

              <div className="glass-card p-10 glow-border">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-6">
                  <Globe className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Platform Integrations</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Integrating RBS across multiple platforms for seamless usability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Vote className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold mb-8 leading-tight metallic-text-hero">
                Governance and Voting
              </h2>
              <p className="text-2xl md:text-3xl text-gold font-poppins font-semibold mb-6 leading-relaxed">
                All opinions about RBS are community-driven
              </p>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Every major decision is made through transparent community voting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 animate-fade-in-up animation-delay-200">
              <div className="glass-card-gold p-10 glow-border">
                <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Proposal System</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                  Token holders can submit proposals for protocol changes and strategic initiatives.
                </p>
                <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Minimum token threshold for proposals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>7-day discussion period before voting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Transparent on-chain voting</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card-gold p-10 glow-border">
                <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Voting Power</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                  Voting power is proportional to token holdings for fair representation.
                </p>
                <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>One token equals one vote</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Quorum requirements for proposals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Delegation options available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <MessageCircle className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Community Voices
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Hear from our community members about their RBS experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in-up animation-delay-200">
              <div className="glass-card p-10 glow-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <Users className="h-7 w-7 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-lg font-poppins font-bold metallic-text">Community Member</h4>
                    <p className="text-sm metallic-text-secondary font-inter">Early Adopter</p>
                  </div>
                </div>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base italic">
                  "RBS represents the future of community-driven crypto projects. The transparency is unmatched."
                </p>
              </div>

              <div className="glass-card p-10 glow-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <Users className="h-7 w-7 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-lg font-poppins font-bold metallic-text">Token Holder</h4>
                    <p className="text-sm metallic-text-secondary font-inter">Active Participant</p>
                  </div>
                </div>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base italic">
                  "The deflationary mechanics make RBS a compelling long-term investment with real utility."
                </p>
              </div>

              <div className="glass-card p-10 glow-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <Users className="h-7 w-7 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-lg font-poppins font-bold metallic-text">Governance Voter</h4>
                    <p className="text-sm metallic-text-secondary font-inter">Active Contributor</p>
                  </div>
                </div>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base italic">
                  "Having a real voice through governance is what sets RBS apart from other tokens."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Lightbulb className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Future Utilities
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Planned token use cases and ecosystem integrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in-up animation-delay-200">
              <div className="glass-card-gold p-10 glow-border">
                <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">DeFi Integration</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                  Integration with leading DeFi protocols for lending, borrowing, and yield farming.
                </p>
                <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Lending and borrowing protocols</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Yield farming opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Cross-chain bridge support</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card-gold p-10 glow-border">
                <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Payment Solutions</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                  RBS will be integrated into payment gateways for real-world transactions.
                </p>
                <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Merchant payment integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>E-commerce platform support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Point-of-sale solutions</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card-gold p-10 glow-border">
                <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">NFT Marketplace</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                  Launch of RBS-powered NFT marketplace with exclusive collections.
                </p>
                <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Exclusive NFT collections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Creator monetization tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Community curation system</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card-gold p-10 glow-border">
                <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Gaming Integration</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed mb-5 text-base">
                  RBS will be integrated into blockchain gaming ecosystems.
                </p>
                <ul className="space-y-3 metallic-text-secondary font-inter text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>In-game currency and rewards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Gaming DAO governance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1 text-xl">•</span>
                    <span>Play-to-earn mechanics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Handshake className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Partnership Opportunities
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Collaboration frameworks and growth initiatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in-up animation-delay-200">
              <div className="glass-card p-10 glow-border">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-6">
                  <Network className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Technology Partners</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Collaborate on blockchain infrastructure and technical innovations.
                </p>
              </div>

              <div className="glass-card p-10 glow-border">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-6">
                  <Globe className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Institutional Partners</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Partner with financial institutions for large-scale adoption.
                </p>
              </div>

              <div className="glass-card p-10 glow-border">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-6">
                  <Users className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Community Partners</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Join forces with other crypto communities and projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Rocket className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Community Updates
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Stay informed with the latest developments from the RBS project.
              </p>
            </div>

            <div className="space-y-8 animate-fade-in-up animation-delay-200">
              <div className="glass-card p-8 glow-border">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                    <span className="text-gold font-poppins font-bold text-lg">Q1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">2026 Community Growth Initiative</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Building our global community with educational content and engagement programs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 glow-border">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                    <span className="text-gold font-poppins font-bold text-lg">Q2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Technology Development</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Continuous enhancement of our technology and smart contract infrastructure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 glow-border">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                    <span className="text-gold font-poppins font-bold text-lg">Q3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Partnership Announcements</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Strategic partnerships with leading blockchain projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Target className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                RBS Vision 2031+
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Our long-term vision extends beyond 2030.
              </p>
            </div>

            <div className="glass-card p-12 md:p-16 glow-border mb-10 animate-fade-in-up animation-delay-200">
              <div className="space-y-10">
                <div>
                  <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Global Adoption</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    By 2031, RBS aims to be a leading professional crypto token with partnerships worldwide.
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div>
                  <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Ecosystem Expansion</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Launch of RBS-powered products including staking platforms and governance tools.
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div>
                  <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Technological Innovation</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Continued advancement with quantum-resistant cryptography and AI-powered analytics.
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div>
                  <h3 className="text-3xl font-poppins font-bold metallic-text mb-5">Community Empowerment</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Full decentralization of governance with community-controlled treasury.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Calendar className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Future Vision
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Interactive timeline describing beyond-2031 goals.
              </p>
            </div>

            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/50 via-gold/30 to-transparent" />

              <div className="space-y-16">
                <div className="relative pl-24">
                  <div className="absolute left-0 top-0 h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-poppins font-bold text-base">2032</span>
                  </div>
                  <div className="glass-card p-8 glow-border">
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Quantum Integration</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Implementation of quantum-resistant cryptography to future-proof RBS.
                    </p>
                  </div>
                </div>

                <div className="relative pl-24">
                  <div className="absolute left-0 top-0 h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-poppins font-bold text-base">2035</span>
                  </div>
                  <div className="glass-card p-8 glow-border">
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">AI-Powered Governance</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Integration of AI-assisted governance tools for informed decisions.
                    </p>
                  </div>
                </div>

                <div className="relative pl-24">
                  <div className="absolute left-0 top-0 h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-poppins font-bold text-base">2040</span>
                  </div>
                  <div className="glass-card p-8 glow-border">
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Global Financial Integration</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      Full integration with traditional financial systems worldwide.
                    </p>
                  </div>
                </div>

                <div className="relative pl-24">
                  <div className="absolute left-0 top-0 h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-poppins font-bold text-base">2050</span>
                  </div>
                  <div className="glass-card p-8 glow-border">
                    <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Decentralized Autonomous Future</h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      RBS evolves into a fully autonomous decentralized organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
