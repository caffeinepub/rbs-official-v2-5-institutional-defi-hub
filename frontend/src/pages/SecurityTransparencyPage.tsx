import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, FileCheck } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { useParallax } from '../hooks/useParallax';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Smart Contract Audits',
    description: 'Independently audited by leading blockchain security firms',
    details: ['CertiK Audit', 'Continuous Monitoring', 'Bug Bounty Program'],
  },
  {
    icon: Lock,
    title: 'Multi-Signature Security',
    description: 'Critical operations require multiple approvals for enhanced security',
    details: ['Multi-Sig Wallets', 'Time-Locked Transactions', 'Emergency Pause'],
  },
  {
    icon: Eye,
    title: 'Transparent Operations',
    description: 'All transactions and governance decisions are publicly verifiable',
    details: ['On-Chain Governance', 'Public Treasury', 'Open Source Code'],
  },
  {
    icon: FileCheck,
    title: 'Regular Reports',
    description: 'Quarterly transparency reports and financial disclosures',
    details: ['Financial Reports', 'Development Updates', 'Community Metrics'],
  },
];

export default function SecurityTransparencyPage() {
  const { offset: parallaxOffset } = useParallax(0.3);

  return (
    <>
      <PageHead
        title="Security & Transparency | RBS"
        description="RBS security measures and transparency commitments"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
        <SmokySectionTransition>
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Security & Transparency
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Building trust through robust security and complete transparency
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <SmokySectionTransition key={feature.title} delay={100 * (index + 1)}>
                    <Card
                      className="glass-card border-gold/20 h-full hover:border-gold/40 transition-all duration-300 hover:scale-105"
                      style={{
                        transform: `translateY(${parallaxOffset.y * 0.1}px)`,
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-3 rounded-lg bg-gold/10">
                            <Icon className="h-6 w-6 text-gold" />
                          </div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.details.map((detail) => (
                            <li key={detail} className="flex items-center gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </SmokySectionTransition>
                );
              })}
            </div>

            <SmokySectionTransition delay={500}>
              <Card className="glass-card border-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Our Commitment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    At RBS, security and transparency are not just features—they're fundamental principles
                    that guide every decision we make. We believe that trust is earned through consistent
                    action and complete openness.
                  </p>
                  <p className="leading-relaxed">
                    Our smart contracts undergo rigorous auditing by industry-leading security firms, and
                    we maintain an active bug bounty program to incentivize responsible disclosure. All
                    governance decisions and treasury operations are conducted on-chain, ensuring complete
                    transparency and accountability to our community.
                  </p>
                </CardContent>
              </Card>
            </SmokySectionTransition>
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
