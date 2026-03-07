import { AnimatedSection } from "@/components/AnimatedSection";
import { PageHead } from "@/components/PageHead";
import {
  Award,
  BarChart3,
  Globe,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const growthStrategies = [
  {
    icon: Users,
    title: "Community Expansion",
    description:
      "Building a global community through education, engagement, and community rewards.",
    metrics: [
      "50K+ Active Members Target",
      "Global Presence in 30+ Countries",
      "Ambassador Program Active",
    ],
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: Rocket,
    title: "Market Penetration",
    description:
      "Strategic partnerships and integrations to expand RBS ecosystem reach globally.",
    metrics: [
      "Major Exchange Listings",
      "DeFi Protocol Integrations",
      "Enterprise Adoption Drive",
    ],
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Target,
    title: "Product Development",
    description:
      "Continuous innovation and feature expansion based on community feedback and research.",
    metrics: [
      "Monthly Platform Updates",
      "New Features Every Quarter",
      "User-Driven Roadmap",
    ],
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Value Creation",
    description:
      "Sustainable growth through deflationary mechanics and utility expansion for holders.",
    metrics: [
      "15% Token Burns Allocated",
      "Staking Rewards (8-20% APY)",
      "Governance Rights Included",
    ],
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
];

const milestones = [
  {
    icon: Users,
    value: "50K+",
    label: "Community Members",
    color: "text-purple-400",
  },
  {
    icon: Globe,
    value: "100+",
    label: "Strategic Partners",
    color: "text-blue-400",
  },
  {
    icon: BarChart3,
    value: "$10M+",
    label: "Ecosystem Value",
    color: "text-amber-400",
  },
  {
    icon: Award,
    value: "30+",
    label: "Countries Reached",
    color: "text-green-400",
  },
  {
    icon: Zap,
    value: "99.9%",
    label: "Platform Uptime",
    color: "text-emerald-500",
  },
  {
    icon: Rocket,
    value: "2030",
    label: "Full Launch Year",
    color: "text-pink-400",
  },
];

export default function EcosystemGrowthPage() {
  return (
    <>
      <PageHead
        title="Ecosystem Growth | RBS"
        description="RBS ecosystem growth strategies and community expansion"
      />
      <div className="min-h-screen bg-white text-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <AnimatedSection direction="up" className="text-center mb-16 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" /> Ecosystem Growth
            </div>
            <h1 className="text-4xl md:text-6xl font-bold shimmer-gold mb-6">
              Growing Together
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Strategic initiatives driving RBS adoption and community expansion
              across the globe
            </p>
          </AnimatedSection>

          {/* Milestones strip */}
          <AnimatedSection
            direction="up"
            delay={100}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
          >
            {milestones.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-amber-500/30 transition-all duration-300 text-center group"
              >
                <m.icon
                  className={`w-6 h-6 mx-auto mb-2 ${m.color} group-hover:scale-110 transition-transform`}
                />
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
              </motion.div>
            ))}
          </AnimatedSection>

          {/* Growth Strategies Grid */}
          <div className="grid gap-6 md:grid-cols-2 mb-16">
            {growthStrategies.map((strategy, index) => {
              const Icon = strategy.icon;
              return (
                <motion.div
                  key={strategy.title}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -40 : 40,
                    filter: "blur(4px)",
                  }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${strategy.color} border ${strategy.border} hover:border-amber-500/40 transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gray-50 ${strategy.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {strategy.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    {strategy.description}
                  </p>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                      Key Metrics
                    </p>
                    <ul className="space-y-2">
                      {strategy.metrics.map((metric) => (
                        <li
                          key={metric}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Vision Banner */}
          <AnimatedSection direction="scale" delay={200}>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-center">
              <Rocket className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-float" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                The Path to 2030
              </h2>
              <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
                From community foundation in 2026 through strategic partnerships
                in 2028 to full mainnet launch in 2030 — every phase of RBS
                growth is planned with precision to deliver maximum value to our
                community members.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
