import { Shield, Lock, Eye, FileCheck, AlertTriangle, CheckCircle, Activity, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { PageHead } from '@/components/PageHead';

export default function SecurityTransparencyPage() {
  const securityMeasures = [
    {
      title: 'Military-Grade Encryption',
      description: 'All data transmissions and storage use AES-256 encryption with end-to-end security protocols',
      icon: Lock,
      status: 'Active',
    },
    {
      title: 'Multi-Layer Security Protocols',
      description: 'Comprehensive security architecture with redundant protection layers and real-time threat monitoring',
      icon: Shield,
      status: 'Active',
    },
    {
      title: 'Smart Contract Audits',
      description: 'Regular security audits by leading blockchain security firms to ensure code integrity',
      icon: FileCheck,
      status: 'Ongoing',
    },
    {
      title: 'Decentralized Infrastructure',
      description: 'No single point of failure with distributed node network across multiple continents',
      icon: Database,
      status: 'Active',
    },
    {
      title: 'Real-Time Monitoring',
      description: '24/7 automated security monitoring with instant alert systems for anomaly detection',
      icon: Activity,
      status: 'Active',
    },
    {
      title: 'Bug Bounty Program',
      description: 'Community-driven security with rewards for responsible disclosure of vulnerabilities',
      icon: AlertTriangle,
      status: 'Active',
    },
  ];

  const transparencyMetrics = [
    {
      metric: 'On-Chain Transparency',
      value: '100%',
      description: 'All transactions and governance decisions recorded on-chain',
      icon: Eye,
    },
    {
      metric: 'Code Verification',
      value: '100%',
      description: 'All smart contracts verified and publicly accessible',
      icon: FileCheck,
    },
    {
      metric: 'Security Coverage',
      value: '100%',
      description: 'Complete security coverage across all critical systems',
      icon: Shield,
    },
    {
      metric: 'Uptime Guarantee',
      value: '99.99%',
      description: 'Institutional-grade reliability with redundant infrastructure',
      icon: Activity,
    },
  ];

  const riskManagement = [
    {
      category: 'Smart Contract Risk',
      mitigation: 'Multiple independent audits, formal verification, and bug bounty program',
      level: 'Low',
    },
    {
      category: 'Operational Risk',
      mitigation: 'Decentralized infrastructure, automated monitoring, and incident response protocols',
      level: 'Low',
    },
    {
      category: 'Market Risk',
      mitigation: 'Deflationary tokenomics, liquidity reserves, and community governance',
      level: 'Medium',
    },
    {
      category: 'Regulatory Risk',
      mitigation: 'Legal compliance framework, transparent operations, and proactive engagement',
      level: 'Medium',
    },
  ];

  return (
    <>
      <PageHead 
        title="Security & Transparency" 
        description="Comprehensive security measures and complete transparency for institutional-grade trust"
      />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SmokySectionTransition>
              <div className="text-center mb-20">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                  <Shield className="h-10 w-10 text-gold" />
                </div>
                <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 leading-tight metallic-text-hero">
                  Security & Transparency
                </h1>
                <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                  Comprehensive security measures and complete transparency for institutional-grade trust
                </p>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={100}>
              <div className="mb-20">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-10 tracking-tight text-center">Security Measures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {securityMeasures.map((measure, index) => (
                    <div
                      key={index}
                      className="glass-card p-8 glow-border transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold/20"
                    >
                      <div className="flex items-start gap-5 mb-5">
                        <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                          <measure.icon className="h-7 w-7 text-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-poppins font-bold text-gold">
                              {measure.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`${
                                measure.status === 'Active'
                                  ? 'text-green-400 border-green-400/30'
                                  : 'text-gold border-gold/30'
                              }`}
                            >
                              {measure.status}
                            </Badge>
                          </div>
                          <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                            {measure.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={200}>
              <div className="mb-20">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-10 tracking-tight text-center">
                  Transparency Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {transparencyMetrics.map((item, index) => (
                    <div
                      key={index}
                      className="glass-card-gold p-8 glow-border transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold/20"
                    >
                      <div className="flex items-start gap-5">
                        <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                          <item.icon className="h-7 w-7 text-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-poppins font-bold text-gold mb-3">
                            {item.metric}
                          </h3>
                          <p className="text-5xl font-jetbrains font-bold text-gold mb-4 shimmer-gold">
                            {item.value}
                          </p>
                          <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={300}>
              <div className="mb-20">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-10 tracking-tight text-center">
                  Risk Management Framework
                </h2>
                <div className="space-y-5">
                  {riskManagement.map((risk, index) => (
                    <div
                      key={index}
                      className="glass-card p-8 glow-border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold/20"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-xl font-poppins font-bold text-gold">
                              {risk.category}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`${
                                risk.level === 'Low'
                                  ? 'text-green-400 border-green-400/30'
                                  : 'text-yellow-400 border-yellow-400/30'
                              }`}
                            >
                              {risk.level} Risk
                            </Badge>
                          </div>
                          <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                            <span className="metallic-text">Mitigation: </span>
                            {risk.mitigation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={400}>
              <div className="glass-card-gold p-12 glow-border text-center">
                <CheckCircle className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-2xl font-poppins font-bold text-gold mb-4">
                  Community Oversight
                </h3>
                <p className="metallic-text-secondary font-inter leading-relaxed max-w-2xl mx-auto">
                  All opinions about RBS will be taken from the RBS community to ensure it remains fairly community-driven.
                  Our transparent governance model ensures every token holder has a voice in the project's direction.
                </p>
              </div>
            </SmokySectionTransition>
          </div>
        </div>
      </div>
    </>
  );
}
