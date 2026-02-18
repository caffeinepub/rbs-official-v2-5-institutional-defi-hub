import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { PageHead } from '@/components/PageHead';
import { Shield, Zap, Users, TrendingUp, Target, Award, CheckCircle, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <PageHead 
        title="About RBS" 
        description="Learn about the Resonance Blockchain System, our mission, values, and vision for the future of decentralized finance."
      />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <SmokySectionTransition>
            <div className="text-center mb-16 mex-fade-up">
              <h1 className="text-4xl md:text-6xl font-poppins font-bold metallic-text-hero mb-6">
                About <span className="text-gold">RBS Protocol</span>
              </h1>
              <p className="text-xl metallic-text-secondary max-w-3xl mx-auto">
                Building the future of decentralized finance through innovation, transparency, and community empowerment
              </p>
            </div>
          </SmokySectionTransition>

          <SmokySectionTransition delay={100}>
            <section className="mb-16">
              <div className="glass-card-gold p-8 md:p-12 mex-hover-lift">
                <h2 className="text-3xl font-poppins font-bold metallic-text mb-6">Our Mission</h2>
                <p className="text-lg metallic-text-secondary leading-relaxed">
                  RBS Protocol is revolutionizing blockchain technology by combining cutting-edge mesh architecture with 
                  deflationary tokenomics and community-driven governance. We're building a sustainable, scalable, and 
                  secure ecosystem that empowers users worldwide to participate in the decentralized economy.
                </p>
              </div>
            </section>
          </SmokySectionTransition>

          <SmokySectionTransition delay={200}>
            <section className="mb-16">
              <h2 className="text-3xl font-poppins font-bold metallic-text mb-8 text-center">
                Core <span className="text-gold">Values</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 text-center mex-hover-lift mex-hover-glow mex-scale-in">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 border-2 border-gold/30">
                    <Shield className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold metallic-text mb-3">Security First</h3>
                  <p className="metallic-text-secondary">
                    Military-grade encryption and multi-layer security protocols protect your assets
                  </p>
                </div>

                <div className="glass-card p-6 text-center mex-hover-lift mex-hover-glow mex-scale-in animation-delay-200">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 border-2 border-gold/30">
                    <Zap className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold metallic-text mb-3">Innovation</h3>
                  <p className="metallic-text-secondary">
                    Pioneering mesh technology and advanced consensus mechanisms
                  </p>
                </div>

                <div className="glass-card p-6 text-center mex-hover-lift mex-hover-glow mex-scale-in animation-delay-400">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 border-2 border-gold/30">
                    <Users className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold metallic-text mb-3">Community</h3>
                  <p className="metallic-text-secondary">
                    Democratic governance where every voice matters in protocol decisions
                  </p>
                </div>

                <div className="glass-card p-6 text-center mex-hover-lift mex-hover-glow mex-scale-in animation-delay-600">
                  <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 border-2 border-gold/30">
                    <TrendingUp className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold metallic-text mb-3">Sustainability</h3>
                  <p className="metallic-text-secondary">
                    Deflationary model ensures long-term value and ecosystem health
                  </p>
                </div>
              </div>
            </section>
          </SmokySectionTransition>

          <SmokySectionTransition delay={300}>
            <section className="mb-16">
              <h2 className="text-3xl font-poppins font-bold metallic-text mb-8 text-center">
                What We <span className="text-gold">Deliver</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card-gold p-8 mex-hover-lift">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border-2 border-gold/40">
                      <Target className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-poppins font-bold metallic-text mb-2">Enterprise Solutions</h3>
                      <p className="metallic-text-secondary">
                        Scalable blockchain infrastructure for businesses of all sizes
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 metallic-text-secondary">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>Custom smart contract development and deployment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>Integration support with existing systems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>24/7 technical support and monitoring</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>Compliance and regulatory guidance</span>
                    </li>
                  </ul>
                </div>

                <div className="glass-card-gold p-8 mex-hover-lift">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border-2 border-gold/40">
                      <Award className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-poppins font-bold metallic-text mb-2">Developer Tools</h3>
                      <p className="metallic-text-secondary">
                        Comprehensive toolkit for building on RBS Protocol
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 metallic-text-secondary">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>Full SDK with multiple language support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>Extensive API documentation and examples</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>Testing frameworks and debugging tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>Active developer community and forums</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </SmokySectionTransition>

          <SmokySectionTransition delay={400}>
            <section className="mb-16">
              <h2 className="text-3xl font-poppins font-bold metallic-text mb-8 text-center">
                How It <span className="text-gold">Works</span>
              </h2>
              <div className="glass-card p-8 md:p-12">
                <div className="space-y-8">
                  <div className="flex items-start gap-6 mex-fade-up">
                    <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border-2 border-gold/40 text-gold font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-poppins font-bold metallic-text mb-2">Mesh Network Architecture</h3>
                      <p className="metallic-text-secondary">
                        Our revolutionary mesh topology creates a self-healing, highly resilient network where every node 
                        contributes to overall system stability and performance. Unlike traditional blockchain architectures, 
                        our mesh design eliminates single points of failure and enables true decentralization.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 mex-fade-up animation-delay-200">
                    <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border-2 border-gold/40 text-gold font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-poppins font-bold metallic-text mb-2">Consensus & Validation</h3>
                      <p className="metallic-text-secondary">
                        Advanced consensus mechanism combines the best of Proof of Stake with innovative mesh validation. 
                        Transactions are verified across multiple pathways simultaneously, ensuring speed without compromising 
                        security. Our system achieves finality in seconds while maintaining Byzantine fault tolerance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 mex-fade-up animation-delay-400">
                    <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border-2 border-gold/40 text-gold font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-poppins font-bold metallic-text mb-2">Token Economics</h3>
                      <p className="metallic-text-secondary">
                        RBS implements a carefully designed deflationary model where 15% of the total supply is permanently 
                        burned, creating natural scarcity. Every transaction includes a small burn mechanism, continuously 
                        reducing circulating supply. This economic model rewards long-term holders and ensures sustainable growth.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 mex-fade-up animation-delay-600">
                    <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border-2 border-gold/40 text-gold font-bold text-xl">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-poppins font-bold metallic-text mb-2">Community Governance</h3>
                      <p className="metallic-text-secondary">
                        Token holders participate directly in protocol governance through our democratic voting system. 
                        Propose changes, vote on upgrades, and shape the future of RBS. Voting power is proportional to 
                        stake, ensuring those most invested in the ecosystem have the strongest voice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SmokySectionTransition>

          <SmokySectionTransition delay={200}>
            <section className="mb-16">
              <h2 className="text-3xl font-poppins font-bold metallic-text mb-8 text-center">
                Deflationary <span className="text-gold">Model</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card-gold p-6 text-center mex-hover-lift mex-scale-in">
                  <div className="text-4xl font-bold text-gold mb-2">15%</div>
                  <div className="text-sm metallic-text-secondary mb-4">Initial Burn</div>
                  <p className="metallic-text-secondary text-sm">
                    Permanently removed from circulation at launch
                  </p>
                </div>

                <div className="glass-card-gold p-6 text-center mex-hover-lift mex-scale-in animation-delay-200">
                  <div className="text-4xl font-bold text-gold mb-2">0.1%</div>
                  <div className="text-sm metallic-text-secondary mb-4">Transaction Burn</div>
                  <p className="metallic-text-secondary text-sm">
                    Automatic burn on every transaction
                  </p>
                </div>

                <div className="glass-card-gold p-6 text-center mex-hover-lift mex-scale-in animation-delay-400">
                  <div className="text-4xl font-bold text-gold mb-2">100K</div>
                  <div className="text-sm metallic-text-secondary mb-4">Total Supply</div>
                  <p className="metallic-text-secondary text-sm">
                    Fixed maximum supply, decreasing over time
                  </p>
                </div>
              </div>
            </section>
          </SmokySectionTransition>

          <SmokySectionTransition delay={300}>
            <section className="mb-16">
              <h2 className="text-3xl font-poppins font-bold metallic-text mb-8 text-center">
                Governance <span className="text-gold">Model</span>
              </h2>
              <div className="glass-card p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="mex-fade-up">
                    <h3 className="text-xl font-poppins font-bold metallic-text mb-4">Proposal System</h3>
                    <p className="metallic-text-secondary mb-4">
                      Any token holder can submit proposals for protocol improvements, new features, or parameter changes. 
                      Proposals require a minimum stake threshold to prevent spam and ensure serious consideration.
                    </p>
                    <ul className="space-y-2 metallic-text-secondary">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                        Minimum 100 RBS to submit proposals
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                        7-day discussion period
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                        Community feedback and refinement
                      </li>
                    </ul>
                  </div>

                  <div className="mex-fade-up animation-delay-200">
                    <h3 className="text-xl font-poppins font-bold metallic-text mb-4">Voting Power</h3>
                    <p className="metallic-text-secondary mb-4">
                      Voting power is determined by your RBS stake. The longer you hold, the more weight your vote carries. 
                      This system rewards committed community members and ensures long-term thinking.
                    </p>
                    <ul className="space-y-2 metallic-text-secondary">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                        1 RBS = 1 vote (base power)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                        Bonus multiplier for long-term holders
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                        Transparent on-chain voting records
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </SmokySectionTransition>

          <SmokySectionTransition delay={400}>
            <section>
              <div className="glass-card-gold p-8 md:p-12 text-center mex-hover-lift">
                <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6 border-2 border-gold/40">
                  <Rocket className="h-8 w-8 text-gold" />
                </div>
                <h2 className="text-3xl font-poppins font-bold metallic-text mb-4">
                  Vision <span className="text-gold">2031</span>
                </h2>
                <p className="text-lg metallic-text-secondary max-w-3xl mx-auto">
                  By 2031, RBS Protocol will be the leading blockchain infrastructure powering millions of transactions 
                  daily across global enterprises, DeFi platforms, and decentralized applications. Our mesh technology 
                  will set the standard for scalability, security, and sustainability in the blockchain industry.
                </p>
              </div>
            </section>
          </SmokySectionTransition>
        </div>
      </div>
    </>
  );
}
