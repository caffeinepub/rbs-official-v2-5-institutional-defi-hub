import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Lock, Users, Droplet, Flame, Coins } from 'lucide-react';

export default function TokenomicsPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const tokenomicsData = [
    { name: 'Liquidity', value: 40, color: '#DAA520', icon: TrendingUp },
    { name: 'Presale', value: 20, color: '#4ADE80', icon: Coins },
    { name: 'Burn', value: 15, color: '#EF4444', icon: Flame },
    { name: 'Team', value: 10, color: '#8B5CF6', icon: Lock },
    { name: 'Community Rewards', value: 8, color: '#3B82F6', icon: Users },
    { name: 'Airdrop', value: 7, color: '#F59E0B', icon: Droplet },
  ];

  const totalSupply = 100000;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <Coins className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold tracking-tight leading-tight metallic-text-hero mb-6">
              Tokenomics
            </h1>
            <p className="text-xl metallic-text-secondary font-inter mb-6 leading-relaxed">
              Strategic token distribution and economic model
            </p>
            <div className="inline-block glass-card-gold border-2 border-gold/30 rounded-lg px-8 py-4 mt-4">
              <p className="text-3xl font-poppins font-bold text-gold">
                Total Supply: {totalSupply.toLocaleString()} RBS (Fixed)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 animate-fade-in-up animation-delay-200">
            <div className="glass-card p-8 glow-border">
              <h2 className="text-3xl font-poppins font-bold text-gold mb-8 text-center tracking-tight">
                Distribution Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={tokenomicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {tokenomicsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                        stroke={activeIndex === index ? '#DAA520' : 'none'}
                        strokeWidth={activeIndex === index ? 3 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #DAA520',
                      borderRadius: '12px',
                      color: '#0A0A0A',
                      fontWeight: 600,
                    }}
                    formatter={(value: number) => [`${value}%`, 'Allocation']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="metallic-text-secondary font-inter text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {tokenomicsData.map((item, index) => {
                const Icon = item.icon;
                const amount = (totalSupply * item.value) / 100;
                return (
                  <div
                    key={index}
                    className={`glass-card p-6 transition-all duration-300 cursor-pointer ${
                      activeIndex === index
                        ? 'border-gold/50 shadow-lg shadow-gold/20 scale-105'
                        : 'border-gray-200 hover:border-gold/30'
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${item.color}20`, border: `2px solid ${item.color}` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: item.color }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-poppins font-bold text-gold">{item.name}</h3>
                          <p className="text-sm font-inter metallic-text-secondary">
                            {amount.toLocaleString()} RBS
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-poppins font-bold" style={{ color: item.color }}>
                          {item.value}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up animation-delay-400">
            <div className="glass-card-gold p-10 glow-border">
              <h3 className="text-3xl font-poppins font-bold text-gold mb-8 tracking-tight">Deflationary Model</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Flame className="h-7 w-7 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-poppins font-bold metallic-text mb-2">Token Burns</h4>
                    <p className="metallic-text-secondary font-inter text-base leading-relaxed">
                      15% of total supply allocated for strategic burns. Regular burn events reduce
                      circulating supply, creating scarcity and supporting long-term value appreciation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="h-7 w-7 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-poppins font-bold metallic-text mb-2">Transaction Fees</h4>
                    <p className="metallic-text-secondary font-inter text-base leading-relaxed">
                      A portion of transaction fees contributes to the burn mechanism, ensuring
                      continuous deflationary pressure as network activity increases.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lock className="h-7 w-7 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-poppins font-bold metallic-text mb-2">Vesting Schedule</h4>
                    <p className="metallic-text-secondary font-inter text-base leading-relaxed">
                      Team tokens locked with 4-year vesting period, ensuring long-term alignment
                      with project success and preventing market manipulation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card-gold p-10 glow-border">
              <h3 className="text-3xl font-poppins font-bold text-gold mb-8 tracking-tight">Utility & Benefits</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Users className="h-7 w-7 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-poppins font-bold metallic-text mb-2">Governance Rights</h4>
                    <p className="metallic-text-secondary font-inter text-base leading-relaxed">
                      Token holders participate in protocol governance, voting on upgrades, treasury
                      allocation, and strategic decisions shaping the ecosystem's future.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Coins className="h-7 w-7 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-poppins font-bold metallic-text mb-2">Staking Rewards</h4>
                    <p className="metallic-text-secondary font-inter text-base leading-relaxed">
                      Earn passive income by staking RBS tokens. Stakers secure the network and
                      receive rewards from transaction fees and protocol revenue.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Droplet className="h-7 w-7 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-poppins font-bold metallic-text mb-2">Premium Access</h4>
                    <p className="metallic-text-secondary font-inter text-base leading-relaxed">
                      RBS tokens required for accessing premium features, institutional services,
                      and advanced trading tools within the ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 glass-card p-10 text-center animate-fade-in-up animation-delay-600 glow-border">
            <h3 className="text-3xl font-poppins font-bold text-gold mb-6 tracking-tight">
              Economic Sustainability
            </h3>
            <p className="metallic-text-secondary font-inter text-lg leading-relaxed max-w-4xl mx-auto">
              RBS tokenomics are designed for long-term sustainability and value creation. The fixed
              supply of 100,000 RBS combined with deflationary mechanisms ensures scarcity. Strategic
              allocation supports ecosystem development, community growth, and institutional adoption.
              Our economic model balances immediate utility with long-term value appreciation, creating
              a sustainable foundation for the future of decentralized digital assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
