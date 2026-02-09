import { useEffect, useRef, useState } from 'react';
import { FileText, Shield, Network, Users, TrendingUp, Zap, Lock, Globe, Code, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHead } from '@/components/PageHead';

const CHAPTERS = [
  { id: 'executive', title: 'Executive Summary', icon: FileText },
  { id: 'tokenomics', title: 'Token Scarcity & Economics', icon: TrendingUp },
  { id: 'mesh', title: 'Neural Mesh Technology', icon: Network },
  { id: 'governance', title: 'Governance Framework', icon: Users },
  { id: 'security', title: 'Security Architecture', icon: Lock },
  { id: 'institutional', title: 'Institutional Integration', icon: Globe },
  { id: 'roadmap', title: 'Strategic Roadmap', icon: TrendingUp },
  { id: 'technical', title: 'Technical Stack', icon: Zap },
  { id: 'conclusion', title: 'Conclusion', icon: Code },
];

export default function WhitepaperPage() {
  const [activeChapter, setActiveChapter] = useState('executive');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    CHAPTERS.forEach((chapter) => {
      const element = sectionRefs.current[chapter.id];
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set(prev).add(chapter.id));
              if (entry.intersectionRatio > 0.5) {
                setActiveChapter(chapter.id);
              }
            }
          },
          { threshold: [0.1, 0.5] }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const scrollToChapter = (chapterId: string) => {
    const element = sectionRefs.current[chapterId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveChapter(chapterId);
    }
  };

  return (
    <>
      <PageHead title="Whitepaper" description="Comprehensive technical overview of the RBS ecosystem" />
      <div className="min-h-screen pb-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FileText className="h-10 w-10 text-gold" />
                <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold tracking-tight">
                  Whitepaper
                </h1>
              </div>
              <p className="text-xl metallic-text-secondary font-inter leading-relaxed">
                Comprehensive technical overview of the RBS ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 animate-fade-in-up animation-delay-200">
                <div className="sticky top-4 glass-card-gold p-6 glow-border">
                  <h2 className="text-xl font-poppins font-bold text-gold mb-4">Chapters</h2>
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <nav className="space-y-2">
                      {CHAPTERS.map((chapter) => {
                        const Icon = chapter.icon;
                        return (
                          <Button
                            key={chapter.id}
                            variant="ghost"
                            onClick={() => scrollToChapter(chapter.id)}
                            className={`w-full justify-start text-left transition-all duration-300 hover:bg-gold/10 hover:translate-x-2 ${
                              activeChapter === chapter.id
                                ? 'bg-gold/20 text-gold border-l-4 border-gold'
                                : 'text-gold/70 hover:text-gold'
                            }`}
                          >
                            <Icon className="h-4 w-4 mr-2 shrink-0" />
                            <span className="text-sm font-inter truncate">{chapter.title}</span>
                            {activeChapter === chapter.id && (
                              <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
                            )}
                          </Button>
                        );
                      })}
                    </nav>
                  </ScrollArea>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="space-y-12">
                  <div
                    ref={(el) => {
                      sectionRefs.current['executive'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('executive') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Executive Summary</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      RBS Official represents a paradigm shift in institutional decentralized finance, combining cutting-edge blockchain technology with enterprise-grade security and scalability. Built on the Internet Computer Protocol, RBS leverages neural mesh architecture to deliver sub-second transaction finality while maintaining the highest standards of decentralization and security.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Our mission is to bridge the gap between traditional finance and decentralized systems, providing institutional investors with the tools, infrastructure, and confidence needed to participate in the digital asset revolution. Through innovative tokenomics, robust governance mechanisms, and a commitment to transparency, RBS is positioned to become the premier institutional DeFi platform.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      This whitepaper outlines the technical architecture, economic model, governance framework, and strategic roadmap that will guide RBS through its evolution from launch to market leadership. We invite you to explore the future of institutional finance.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['tokenomics'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('tokenomics') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Token Scarcity & Economics</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      RBS implements a deflationary tokenomics model with a fixed maximum supply of 100,000 tokens, ensuring deliberate scarcity for long-term value appreciation through controlled emission rates and strategic burn events tied to protocol usage.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Our token distribution follows institutional-grade standards: 40% allocated to liquidity provision, 20% to presale participants, 15% to strategic burns, 10% to the founding team with vesting, 8% to community rewards, and 7% to airdrop distribution.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      The deflationary mechanism operates through multiple channels. Transaction fees are partially burned, permanently removing tokens from circulation. Protocol revenue contributes to buyback-and-burn programs. Governance-approved burn events can be triggered during major milestones.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      Token utility extends beyond simple value storage. RBS tokens grant governance rights, staking mechanisms provide yield generation, premium features require RBS holdings, and cross-chain operations utilize RBS as the native settlement layer.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['mesh'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('mesh') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Network className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Neural Mesh Technology</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      The Neural Mesh architecture represents a breakthrough in decentralized consensus mechanisms, combining proof-of-stake security with proof-of-authority efficiency. We achieve sub-second finality while maintaining enterprise-grade security standards.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Each mesh node operates as an autonomous validator, contributing to network resilience through distributed redundancy. The system automatically rebalances computational load and optimizes routing paths based on real-time network conditions, ensuring 99.99% uptime.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      The consensus mechanism employs a three-phase validation process: preliminary validation by receiving nodes, comprehensive verification by a randomly selected committee, and finalization through Byzantine Fault Tolerant consensus.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Performance metrics demonstrate superiority: transaction throughput exceeds 10,000 TPS under normal conditions with burst capacity reaching 50,000 TPS. Finality time averages 0.8 seconds. Network latency remains below 100ms for 99% of transactions.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      Security audits by leading blockchain security firms have verified implementation robustness. Formal verification ensures mathematical correctness. Continuous monitoring detects anomalous behavior in real-time.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['governance'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('governance') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Governance Framework</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      RBS token holders participate in protocol governance through a sophisticated weighted voting system. Proposals require 10% quorum and 66% supermajority approval, ensuring broad consensus while preventing gridlock.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Governance domains encompass fee structures, emission schedules, treasury allocation, strategic partnerships, ecosystem fund distribution, and technical upgrades. Time-locked voting prevents flash loan attacks with minimum 7-day discussion periods.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      The governance process follows a structured lifecycle: proposal submission, community discussion, formal voting, and automated execution. Delegation mechanisms allow token holders to assign voting power to trusted representatives.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Delegates are incentivized through reputation systems and potential rewards. Delegation can be revoked at any time, maintaining ultimate control with token holders.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      Emergency governance procedures exist for critical security situations. A security council can implement urgent fixes with accelerated timelines, subject to retroactive approval by token holders.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['security'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Security Architecture</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Security forms the foundation of RBS infrastructure with multiple protection layers. Military-grade encryption protects all data. Multi-signature requirements govern critical operations. Hardware security modules safeguard private keys.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Smart contract security receives particular attention. All contracts undergo formal verification using mathematical proof systems. Multiple independent audits identify vulnerabilities before deployment. Comprehensive test suites cover edge cases and attack vectors.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Operational security follows industry best practices. Access controls implement principle of least privilege. Multi-factor authentication protects administrative functions. Incident response procedures enable rapid reaction to security events.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      Insurance mechanisms provide additional protection. Protocol-owned insurance funds cover potential smart contract vulnerabilities. Partnerships with decentralized insurance protocols offer optional coverage for large positions.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['institutional'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('institutional') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Globe className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Institutional Integration</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      RBS bridges traditional finance and decentralized systems through purpose-built institutional infrastructure. Custody solutions meet regulatory requirements while maintaining self-sovereign principles. API integrations enable seamless connection with existing financial systems.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Institutional-grade features include advanced order types, algorithmic trading support, and sophisticated risk management tools. Dedicated institutional portals provide enhanced analytics, reporting capabilities, and white-glove support.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      Partnerships with traditional financial institutions create bridges between legacy systems and blockchain innovation. Fiat on-ramps and off-ramps enable smooth capital flows. Compliance frameworks ensure regulatory adherence across jurisdictions.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['roadmap'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('roadmap') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Strategic Roadmap</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      Our strategic roadmap spans multiple years with clear milestones and deliverables. Phase 1 focuses on platform launch, initial exchange listings, and community building. Phase 2 expands ecosystem features and institutional partnerships. Phase 3 achieves full decentralization and global scale.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      Each phase includes specific technical deliverables, partnership announcements, and community growth targets. Regular progress updates maintain transparency and accountability to token holders.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['technical'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('technical') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Technical Stack</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      RBS leverages the Internet Computer Protocol for its core infrastructure, providing web-speed performance and unlimited scalability. Smart contracts are written in Motoko, a purpose-built language for the Internet Computer with built-in security features.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      The frontend utilizes modern React with TypeScript for type safety and developer productivity. Tailwind CSS provides a consistent design system. The architecture follows best practices for security, performance, and maintainability.
                    </p>
                  </div>

                  <div
                    ref={(el) => {
                      sectionRefs.current['conclusion'] = el;
                    }}
                    className={`glass-card p-10 glow-border transition-all duration-700 ${
                      visibleSections.has('conclusion') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Code className="h-7 w-7 text-gold" />
                      <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">Conclusion</h2>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                    <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                      RBS represents the convergence of institutional finance and decentralized technology. Through innovative tokenomics, robust governance, and enterprise-grade infrastructure, we are building the future of digital assets.
                    </p>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      We invite you to join us on this journey. Whether you're an institutional investor, developer, or community member, there's a place for you in the RBS ecosystem. Together, we will shape the future of finance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
