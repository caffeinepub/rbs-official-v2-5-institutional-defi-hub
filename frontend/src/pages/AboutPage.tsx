import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Users, TrendingUp, Code, Lock } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { useParallax } from '../hooks/useParallax';

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security protocols protecting your assets 24/7',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-second transaction finality on the Internet Computer',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Governed by token holders through transparent voting',
  },
  {
    icon: TrendingUp,
    title: 'Deflationary Model',
    description: 'Built-in scarcity mechanisms increase long-term value',
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Comprehensive SDKs and APIs for seamless integration',
  },
  {
    icon: Lock,
    title: 'Audited Smart Contracts',
    description: 'Independently verified and continuously monitored',
  },
];

export default function AboutPage() {
  const { offset: parallaxOffset } = useParallax(0.5);

  return (
    <>
      <PageHead
        title="About RBS | Revolutionary Blockchain Solutions"
        description="Learn about RBS's mission, technology, and vision for the future of decentralized finance"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
        <SmokySectionTransition>
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                About RBS
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Revolutionary Blockchain Solutions is pioneering the next generation of decentralized
                finance infrastructure on the Internet Computer Protocol.
              </p>
            </div>

            <SmokySectionTransition delay={100}>
              <Card className="glass-card border-gold/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-lg">
                  <p className="text-muted-foreground leading-relaxed">
                    We're building a transparent, secure, and scalable blockchain ecosystem that empowers
                    individuals and organizations to participate in the decentralized economy.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Through innovative technology and community-driven governance, RBS is creating the
                    infrastructure for the future of finance.
                  </p>
                </CardContent>
              </Card>
            </SmokySectionTransition>

            <div>
              <SmokySectionTransition delay={200}>
                <h2 className="text-3xl font-bold text-center mb-8">What We Deliver</h2>
              </SmokySectionTransition>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
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
                          <div className="p-3 rounded-lg bg-gold/10 w-fit mb-3">
                            <Icon className="h-6 w-6 text-gold" />
                          </div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </SmokySectionTransition>
                  );
                })}
              </div>
            </div>

            <SmokySectionTransition delay={400}>
              <Card className="glass-card border-gold/20">
                <CardHeader>
                  <CardTitle className="text-3xl">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gold">Mesh Architecture</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our distributed mesh network ensures maximum uptime and resilience through
                        decentralized node infrastructure across the Internet Computer.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gold">Consensus Mechanism</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Leveraging ICP's Chain Key Technology for instant finality and web-speed
                        transactions without compromising security or decentralization.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gold">Token Economics</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        A carefully designed deflationary model with burn mechanisms, staking rewards,
                        and governance rights that align incentives across the ecosystem.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gold">Governance Model</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Democratic decision-making through token-weighted voting, ensuring the community
                        shapes the future direction of the protocol.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SmokySectionTransition>
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
