import { Sparkles, Users, Network, Globe, Handshake, Rocket, Target, TrendingUp } from 'lucide-react';

export default function EcosystemGrowthPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-black/95 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gold/10 border-2 border-gold/30 mb-6">
              <Sparkles className="h-8 w-8 text-gold" />
            </div>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
              <span className="shimmer-gold">Ecosystem Growth</span>
            </h1>
            <p className="text-lg text-silver/80 font-inter max-w-3xl mx-auto leading-relaxed">
              Building a thriving community-driven ecosystem with strategic integrations and partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in-up animation-delay-200">
            <div className="bg-black/60 backdrop-blur-sm border-2 border-gold/30 rounded-lg p-8 glow-border hover-lift">
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-4">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-gold mb-3">Community Building</h3>
              <p className="text-silver/80 font-inter leading-relaxed text-sm">
                Growing a global community of token holders, developers, and enthusiasts through educational initiatives, AMAs, and engagement programs.
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-sm border-2 border-gold/30 rounded-lg p-8 glow-border hover-lift">
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-4">
                <Network className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-gold mb-3">Strategic Partnerships</h3>
              <p className="text-silver/80 font-inter leading-relaxed text-sm">
                Collaborating with leading blockchain projects, DeFi protocols, and institutional partners to expand utility and adoption.
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-sm border-2 border-gold/30 rounded-lg p-8 glow-border hover-lift">
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-4">
                <Globe className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-gold mb-3">Platform Integrations</h3>
              <p className="text-silver/80 font-inter leading-relaxed text-sm">
                Integrating RBS across multiple platforms including wallets, exchanges, DeFi protocols, and payment systems for seamless usability.
              </p>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-sm border-2 border-gold/30 rounded-lg p-8 md:p-12 mb-12 animate-fade-in-up animation-delay-400 glow-border">
            <h2 className="text-3xl font-orbitron font-bold text-gold mb-8 text-center">
              Growth Initiatives
            </h2>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <Handshake className="h-8 w-8 text-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-orbitron font-bold text-gold mb-3">Partnership Opportunities</h3>
                  <p className="text-silver/80 font-inter leading-relaxed mb-4">
                    We actively seek partnerships with projects that align with our vision of building a robust crypto token ecosystem. Our partnership framework focuses on mutual growth, technical integration, and community value creation.
                  </p>
                  <ul className="space-y-2 text-silver/70 font-inter text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Technical integration support and documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Co-marketing initiatives and community engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Shared liquidity pools and cross-chain bridges</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <Rocket className="h-8 w-8 text-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-orbitron font-bold text-gold mb-3">Community Engagement Programs</h3>
                  <p className="text-silver/80 font-inter leading-relaxed mb-4">
                    Our community is the heart of RBS. We invest in programs that educate, engage, and empower our token holders to actively participate in the ecosystem's growth and governance.
                  </p>
                  <ul className="space-y-2 text-silver/70 font-inter text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Regular AMAs with the core team and partners</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Educational content and technical workshops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Community rewards and incentive programs</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <Target className="h-8 w-8 text-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-orbitron font-bold text-gold mb-3">Integration Roadmap</h3>
                  <p className="text-silver/80 font-inter leading-relaxed mb-4">
                    Our integration strategy focuses on expanding RBS accessibility and utility across the crypto ecosystem. We prioritize integrations that provide immediate value to our community.
                  </p>
                  <ul className="space-y-2 text-silver/70 font-inter text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Major wallet integrations for easy token management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>DEX and CEX listings for enhanced liquidity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>DeFi protocol integrations for yield opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up animation-delay-600">
            <div className="bg-gradient-to-br from-gold/10 to-transparent border-2 border-gold/30 rounded-lg p-8 glow-border hover-lift">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <TrendingUp className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold text-gold">Growth Metrics</h3>
              </div>
              <p className="text-silver/80 font-inter leading-relaxed mb-4">
                We track key metrics to measure ecosystem health and growth, ensuring transparency and accountability to our community.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gold/10">
                  <span className="text-silver/70 font-inter text-sm">Community Members</span>
                  <span className="text-gold font-jetbrains font-bold">12,847+</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gold/10">
                  <span className="text-silver/70 font-inter text-sm">Active Partnerships</span>
                  <span className="text-gold font-jetbrains font-bold">15+</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gold/10">
                  <span className="text-silver/70 font-inter text-sm">Platform Integrations</span>
                  <span className="text-gold font-jetbrains font-bold">8+</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gold/10 to-transparent border-2 border-gold/30 rounded-lg p-8 glow-border hover-lift">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <Sparkles className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold text-gold">Get Involved</h3>
              </div>
              <p className="text-silver/80 font-inter leading-relaxed mb-6">
                Join our growing ecosystem and contribute to the future of RBS. Whether you're a developer, partner, or community member, there's a place for you.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://t.me/Rsuperior"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gold hover:bg-gold/90 text-black font-orbitron font-bold rounded-lg transition-colors metallic-button text-center"
                >
                  Join Community
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-black border-2 border-gold/30 hover:border-gold text-gold font-orbitron font-bold rounded-lg transition-colors text-center"
                >
                  Partnership Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
