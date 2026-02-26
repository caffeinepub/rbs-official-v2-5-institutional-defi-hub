import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingDown, Lock, Users, Droplet, Coins, Zap } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { useParallax } from '../hooks/useParallax';

const distributionData = [
  { name: 'Liquidity Pool', value: 40, color: '#D4AF37' },
  { name: 'Presale', value: 20, color: '#F4D03F' },
  { name: 'Burn Mechanism', value: 15, color: '#E67E22' },
  { name: 'Team & Development', value: 10, color: '#3498DB' },
  { name: 'Community Rewards', value: 8, color: '#9B59B6' },
  { name: 'Airdrop', value: 7, color: '#1ABC9C' },
];

const utilityFeatures = [
  {
    icon: Zap,
    title: 'Transaction Fees',
    description: 'Pay network fees with RBS tokens at discounted rates',
  },
  {
    icon: Lock,
    title: 'Staking Rewards',
    description: 'Earn passive income by staking your RBS tokens',
  },
  {
    icon: Users,
    title: 'Governance Rights',
    description: 'Vote on protocol upgrades and treasury allocation',
  },
  {
    icon: Coins,
    title: 'Premium Features',
    description: 'Access advanced analytics and trading tools',
  },
];

export default function TokenomicsPage() {
  const { offset: parallaxOffset } = useParallax(0.3);

  return (
    <>
      <PageHead
        title="Tokenomics | RBS"
        description="Explore RBS token distribution, utility, and deflationary mechanics"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
        <SmokySectionTransition>
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                RBS Tokenomics
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Total Supply: <span className="text-gold font-bold">100,000 RBS</span>
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <SmokySectionTransition delay={100}>
                <Card
                  className="glass-card border-gold/20 h-full"
                  style={{
                    transform: `translateY(${parallaxOffset.y * 0.2}px)`,
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">Token Distribution</CardTitle>
                    <CardDescription>How RBS tokens are allocated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </SmokySectionTransition>

              <div className="space-y-4">
                {distributionData.map((item, index) => (
                  <SmokySectionTransition key={item.name} delay={100 * (index + 1)}>
                    <Card className="glass-card border-gold/20 hover:border-gold/40 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          <span className="text-lg font-bold text-gold">{item.value}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </SmokySectionTransition>
                ))}
              </div>
            </div>

            <SmokySectionTransition delay={300}>
              <Card className="glass-card border-gold/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-6 w-6 text-gold" />
                    <div>
                      <CardTitle className="text-2xl">Deflationary Model</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Built-in mechanisms to reduce supply over time
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-gold" />
                        Transaction Burns
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        A percentage of each transaction is permanently burned, reducing total supply
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-gold" />
                        Staking Locks
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Staked tokens are locked, reducing circulating supply and increasing scarcity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SmokySectionTransition>

            <div>
              <SmokySectionTransition delay={400}>
                <h2 className="text-3xl font-bold text-center mb-8">Token Utility</h2>
              </SmokySectionTransition>
              <div className="grid gap-6 md:grid-cols-2">
                {utilityFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <SmokySectionTransition key={feature.title} delay={100 * (index + 1)}>
                      <Card className="glass-card border-gold/20 hover:border-gold/40 transition-all duration-300 hover:scale-105">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gold/10">
                              <Icon className="h-6 w-6 text-gold" />
                            </div>
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                          </div>
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
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
