import { Sparkles, Users, Network, Globe, Handshake, Rocket, Target, TrendingUp } from 'lucide-react';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { PageHead } from '@/components/PageHead';

export default function EcosystemGrowthPage() {
  return (
    <>
      <PageHead 
        title="Ecosystem Growth" 
        description="Building a thriving community-driven ecosystem with strategic integrations and partnerships"
      />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SmokySectionTransition>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                  <Sparkles className="h-10 w-10 text-gold" />
                </div>
                <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 leading-tight metallic-text-hero">
                  Ecosystem Growth
                </h1>
                <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                  Building a thriving community-driven ecosystem with strategic integrations and partnerships.
                </p>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={100}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass-card-gold p-8 glow-border transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold/20">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-4">
                    <Users className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-gold mb-3">Community Building</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-sm">
                    Growing a global community of token holders, developers, and enthusiasts through educational initiatives, AMAs, and engagement programs.
                  </p>
                </div>

                <div className="glass-card-gold p-8 glow-border transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold/20">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-4">
                    <Network className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-gold mb-3">Strategic Partnerships</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-sm">
                    Collaborating with leading blockchain projects, DeFi protocols, and institutional partners to expand utility and adoption.
                  </p>
                </div>

                <div className="glass-card-gold p-8 glow-border transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold/20">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 mb-4">
                    <Globe className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-gold mb-3">Platform Integrations</h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-sm">
                    Integrating RBS across multiple platforms including wallets, exchanges, DeFi protocols, and payment systems for seamless usability.
                  </p>
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={200}>
              <div className="glass-card p-8 md:p-12 mb-12 glow-border">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center">
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
                      <h3 className="text-2xl font-poppins font-bold text-gold mb-3">Partnership Opportunities</h3>
                      <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                        We actively seek partnerships with projects that align with our vision of building a robust crypto token ecosystem. Our partnership framework focuses on mutual growth, technical integration, and community value creation.
                      </p>
                      <ul className="space-y-2 metallic-text-secondary font-inter text-sm">
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
                      <h3 className="text-2xl font-poppins font-bold text-gold mb-3">Community Engagement Programs</h3>
                      <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                        Our community is the heart of RBS. We invest in programs that educate, engage, and empower our token holders to actively participate in the ecosystem's growth and governance.
                      </p>
                      <ul className="space-y-2 metallic-text-secondary font-inter text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-1">•</span>
                          <span>Educational workshops and webinars</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-1">•</span>
                          <span>Ambassador and contributor reward programs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-1">•</span>
                          <span>Regular AMAs and community governance sessions</span>
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
                      <h3 className="text-2xl font-poppins font-bold text-gold mb-3">Integration Roadmap</h3>
                      <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                        Our integration roadmap outlines strategic milestones for expanding RBS utility across the blockchain ecosystem. We prioritize integrations that provide immediate value to our community.
                      </p>
                      <ul className="space-y-2 metallic-text-secondary font-inter text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-1">•</span>
                          <span>Major exchange listings and liquidity partnerships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-1">•</span>
                          <span>DeFi protocol integrations for staking and yield</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-1">•</span>
                          <span>Cross-chain bridges and multi-chain deployment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={300}>
              <div className="glass-card-gold p-12 mb-12 glow-border">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center">
                  Growth Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gold mx-auto mb-4" />
                    <p className="text-5xl font-jetbrains font-bold text-gold mb-2">10,000+</p>
                    <p className="text-sm metallic-text-secondary font-inter">Community Members</p>
                  </div>
                  <div className="text-center">
                    <Network className="h-12 w-12 text-gold mx-auto mb-4" />
                    <p className="text-5xl font-jetbrains font-bold text-gold mb-2">25+</p>
                    <p className="text-sm metallic-text-secondary font-inter">Strategic Partners</p>
                  </div>
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-gold mx-auto mb-4" />
                    <p className="text-5xl font-jetbrains font-bold text-gold mb-2">30+</p>
                    <p className="text-sm metallic-text-secondary font-inter">Countries Reached</p>
                  </div>
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={400}>
              <div className="glass-card p-8 text-center glow-border">
                <Sparkles className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-2xl font-poppins font-bold text-gold mb-4">
                  Join the Ecosystem
                </h3>
                <p className="metallic-text-secondary font-inter leading-relaxed max-w-2xl mx-auto mb-6">
                  Whether you're a developer, partner, or community member, there's a place for you in the RBS ecosystem.
                  All opinions about RBS will be taken from the RBS community to ensure it remains fairly community-driven.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://t.me/RBSuperior"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gold hover:bg-gold/90 text-black font-poppins font-bold rounded-lg transition-all duration-300 metallic-button"
                  >
                    Join Community
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white border-2 border-gold/30 hover:border-gold text-gold font-poppins font-bold rounded-lg transition-all duration-300"
                  >
                    Partner With Us
                  </a>
                </div>
              </div>
            </SmokySectionTransition>
          </div>
        </div>
      </div>
    </>
  );
}
