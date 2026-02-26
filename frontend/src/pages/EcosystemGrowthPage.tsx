import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Rocket, Target } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { useParallax } from '../hooks/useParallax';

const growthStrategies = [
  {
    icon: Users,
    title: 'Community Expansion',
    description: 'Building a global community through education, engagement, and rewards',
    metrics: ['50K+ Active Members', 'Global Presence', 'Ambassador Program'],
  },
  {
    icon: Rocket,
    title: 'Market Penetration',
    description: 'Strategic partnerships and integrations to expand RBS reach',
    metrics: ['Major Exchange Listings', 'DeFi Integrations', 'Enterprise Adoption'],
  },
  {
    icon: Target,
    title: 'Product Development',
    description: 'Continuous innovation and feature expansion based on community feedback',
    metrics: ['Monthly Updates', 'New Features', 'User-Driven Roadmap'],
  },
  {
    icon: TrendingUp,
    title: 'Value Creation',
    description: 'Sustainable growth through deflationary mechanics and utility expansion',
    metrics: ['Token Burns', 'Staking Rewards', 'Governance Rights'],
  },
];

export default function EcosystemGrowthPage() {
  const { offset: parallaxOffset } = useParallax(0.3);

  return (
    <>
      <PageHead
        title="Ecosystem Growth | RBS"
        description="RBS ecosystem growth strategies and community expansion"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
        <SmokySectionTransition>
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Ecosystem Growth
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Strategic initiatives driving RBS adoption and community expansion
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {growthStrategies.map((strategy, index) => {
                const Icon = strategy.icon;
                return (
                  <SmokySectionTransition key={strategy.title} delay={100 * (index + 1)}>
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
                          <CardTitle className="text-xl">{strategy.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {strategy.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-muted-foreground mb-3">
                            Key Metrics:
                          </p>
                          <ul className="space-y-2">
                            {strategy.metrics.map((metric) => (
                              <li key={metric} className="flex items-center gap-2 text-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </SmokySectionTransition>
                );
              })}
            </div>

            <SmokySectionTransition delay={500}>
              <Card className="glass-card border-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Growth Milestones</CardTitle>
                  <CardDescription>Our journey so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-gold">50K+</div>
                      <p className="text-sm text-muted-foreground">Community Members</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-gold">100+</div>
                      <p className="text-sm text-muted-foreground">Strategic Partners</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-gold">$10M+</div>
                      <p className="text-sm text-muted-foreground">Total Value Locked</p>
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
