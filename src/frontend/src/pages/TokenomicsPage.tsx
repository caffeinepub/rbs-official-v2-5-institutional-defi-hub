import React, { useState, useRef } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  useScrollAnimation,
  useScrollAnimationClass,
} from "../hooks/useScrollAnimation";

const TOTAL_SUPPLY = 100_000;

const TOKENOMICS_DATA = [
  {
    name: "💧 Liquidity",
    emoji: "💧",
    percentage: 40,
    amount: 40_000,
    color: "#3B82F6",
    description:
      "Ensures deep liquidity pools for seamless trading and price stability.",
  },
  {
    name: "🌱 Presale",
    emoji: "🌱",
    percentage: 20,
    amount: 20_000,
    color: "#10B981",
    description:
      "Early adopter allocation for presale participants at discounted rates.",
  },
  {
    name: "🔥 Burn",
    emoji: "🔥",
    percentage: 15,
    amount: 15_000,
    color: "#EF4444",
    description:
      "Deflationary mechanism to reduce supply and increase token value over time.",
  },
  {
    name: "👥 Team",
    emoji: "👥",
    percentage: 10,
    amount: 10_000,
    color: "#8B5CF6",
    description:
      "Core team allocation with vesting schedule to align long-term incentives.",
  },
  {
    name: "🎁 Community Rewards",
    emoji: "🎁",
    percentage: 8,
    amount: 8_000,
    color: "#F59E0B",
    description:
      "Rewards for active community members, stakers, and governance participants.",
  },
  {
    name: "🚀 Airdrop",
    emoji: "🚀",
    percentage: 7,
    amount: 7_000,
    color: "#EC4899",
    description:
      "Free distribution to eligible wallets to grow the RBS ecosystem.",
  },
];

function AnimatedCounter({
  target,
  duration = 2000,
}: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const hasAnimated = useRef(false);

  React.useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [isVisible, target, duration]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {count.toLocaleString()}
    </span>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-bold text-foreground">{data.name}</p>
        <p className="text-primary">
          {data.percentage}% — {data.amount.toLocaleString()} RBS
        </p>
      </div>
    );
  }
  return null;
};

export default function TokenomicsPage() {
  const heroAnim = useScrollAnimation({ threshold: 0.1 });
  const chartAnim = useScrollAnimation({ threshold: 0.1 });
  const statsAnim = useScrollAnimation({ threshold: 0.1 });
  const utilityAnim = useScrollAnimation({ threshold: 0.1 });
  const deflationAnim = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section
        ref={heroAnim.ref as React.RefObject<HTMLElement>}
        className={`relative py-24 px-4 text-center overflow-hidden ${useScrollAnimationClass(heroAnim.isVisible, "fade-up")}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <span className="text-primary text-sm font-semibold">
              Token Distribution
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent">
            RBS Tokenomics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A carefully designed token economy built for long-term
            sustainability, community growth, and deflationary value.
          </p>
          <div className="inline-block bg-card border border-primary/40 rounded-2xl px-8 py-4 shadow-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Supply</p>
            <p className="text-4xl font-black text-primary">
              <AnimatedCounter target={TOTAL_SUPPLY} /> RBS
            </p>
          </div>
        </div>
      </section>

      {/* Pie Chart */}
      <section
        ref={chartAnim.ref as React.RefObject<HTMLElement>}
        className={`py-16 px-4 ${useScrollAnimationClass(chartAnim.isVisible, "fade-up")}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Token Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOKENOMICS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={3}
                    dataKey="percentage"
                  >
                    {TOKENOMICS_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span className="text-foreground text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {TOKENOMICS_DATA.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="text-primary font-bold">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: chartAnim.isVisible
                            ? `${item.percentage}%`
                            : "0%",
                          backgroundColor: item.color,
                          transitionDelay: `${idx * 100 + 300}ms`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.amount.toLocaleString()} RBS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section
        ref={statsAnim.ref as React.RefObject<HTMLElement>}
        className={`py-16 px-4 bg-card/30 ${useScrollAnimationClass(statsAnim.isVisible, "fade-up")}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Allocation Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOKENOMICS_DATA.map((item, idx) => (
              <div
                key={item.name}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                style={{
                  transitionDelay: `${idx * 100}ms`,
                  opacity: statsAnim.isVisible ? 1 : 0,
                  transform: statsAnim.isVisible
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transition: `opacity 0.6s ease ${idx * 100}ms, transform 0.6s ease ${idx * 100}ms`,
                }}
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.name.replace(`${item.emoji} `, "")}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    className="text-3xl font-black"
                    style={{ color: item.color }}
                  >
                    {item.percentage}%
                  </span>
                  <span className="text-muted-foreground text-sm">
                    of supply
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-3">
                  <AnimatedCounter target={item.amount} /> RBS
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Utility */}
      <section
        ref={utilityAnim.ref as React.RefObject<HTMLElement>}
        className={`py-16 px-4 ${useScrollAnimationClass(utilityAnim.isVisible, "fade-up")}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Token Utility
          </h2>
          <p className="text-muted-foreground mb-12 text-lg">
            RBS powers the entire ecosystem with multiple use cases designed for
            long-term value.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "🗳️",
                title: "Governance Voting",
                desc: "Participate in protocol decisions and shape the future of RBS.",
              },
              {
                icon: "💎",
                title: "Staking Rewards",
                desc: "Earn passive income by staking RBS in the community rewards pool.",
              },
              {
                icon: "🔥",
                title: "Deflationary Burns",
                desc: "Regular burn events reduce supply, increasing scarcity and value.",
              },
              {
                icon: "🌐",
                title: "Ecosystem Access",
                desc: "Unlock premium features, Market Intel, and exclusive community benefits.",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-6 text-left hover:border-primary/50 transition-all duration-300"
                style={{
                  opacity: utilityAnim.isVisible ? 1 : 0,
                  transform: utilityAnim.isVisible
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transition: `opacity 0.6s ease ${idx * 120}ms, transform 0.6s ease ${idx * 120}ms`,
                }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deflationary Model */}
      <section
        ref={deflationAnim.ref as React.RefObject<HTMLElement>}
        className={`py-16 px-4 bg-card/30 ${useScrollAnimationClass(deflationAnim.isVisible, "fade-up")}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            🔥 Deflationary Model
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            15,000 RBS (15% of total supply) is allocated for systematic burns,
            creating a deflationary pressure that increases the value of
            remaining tokens over time.
          </p>
          <div className="bg-card border border-primary/30 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-foreground font-semibold">
                Burn Progress
              </span>
              <span className="text-primary font-bold">5,000 / 15,000 RBS</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-2000"
                style={{
                  width: deflationAnim.isVisible ? "33.3%" : "0%",
                  transition: "width 2s ease 0.3s",
                }}
              />
            </div>
            <p className="text-muted-foreground text-sm mt-3">
              33.3% of burn target completed
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
