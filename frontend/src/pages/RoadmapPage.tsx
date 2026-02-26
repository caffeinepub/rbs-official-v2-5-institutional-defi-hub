import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { useParallax } from '../hooks/useParallax';

const roadmapPhases = [
  {
    year: '2026',
    quarter: 'Q1-Q2',
    title: 'Foundation & Launch',
    status: 'completed',
    milestones: [
      'Smart contract development and auditing',
      'Presale launch and token distribution',
      'Community building and governance setup',
      'Initial DEX listings',
    ],
  },
  {
    year: '2026',
    quarter: 'Q3-Q4',
    title: 'Ecosystem Expansion',
    status: 'in-progress',
    milestones: [
      'Advanced analytics platform launch',
      'Market Intel features rollout',
      'Strategic partnerships announcement',
      'Mobile app development',
    ],
  },
  {
    year: '2027',
    quarter: 'Q1-Q2',
    title: 'DeFi Integration',
    status: 'upcoming',
    milestones: [
      'Staking and yield farming launch',
      'Cross-chain bridge implementation',
      'Liquidity mining programs',
      'DAO governance activation',
    ],
  },
  {
    year: '2027',
    quarter: 'Q3-Q4',
    title: 'Global Adoption',
    status: 'upcoming',
    milestones: [
      'Major CEX listings',
      'Enterprise partnerships',
      'Developer grants program',
      'International expansion',
    ],
  },
  {
    year: '2028',
    quarter: 'Q1-Q4',
    title: 'Innovation & Scale',
    status: 'upcoming',
    milestones: [
      'Layer 2 scaling solutions',
      'Advanced DeFi products',
      'AI-powered trading tools',
      'Institutional adoption',
    ],
  },
];

export default function RoadmapPage() {
  const { offset: parallaxOffset } = useParallax(0.4);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-6 w-6 text-gold" />;
      default:
        return <Circle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-gold/20 text-gold border-gold/30">In Progress</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <>
      <PageHead
        title="Roadmap | RBS"
        description="RBS development roadmap and future milestones"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
        <SmokySectionTransition>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Development Roadmap
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our journey to revolutionize decentralized finance
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-transparent" />
              
              <div className="space-y-8">
                {roadmapPhases.map((phase, index) => (
                  <SmokySectionTransition key={`${phase.year}-${phase.quarter}`} delay={100 * (index + 1)}>
                    <div
                      className="relative pl-20"
                      style={{
                        transform: `translateX(${parallaxOffset.y * 0.1}px)`,
                      }}
                    >
                      <div className="absolute left-5 top-6 -translate-x-1/2">
                        {getStatusIcon(phase.status)}
                      </div>
                      
                      <Card className="glass-card border-gold/20 hover:border-gold/40 transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {phase.year} {phase.quarter}
                                </Badge>
                                {getStatusBadge(phase.status)}
                              </div>
                              <CardTitle className="text-2xl">{phase.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {phase.milestones.map((milestone, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="mt-1">
                                  <div className="h-2 w-2 rounded-full bg-gold" />
                                </div>
                                <span className="text-muted-foreground">{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </SmokySectionTransition>
                ))}
              </div>
            </div>
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
