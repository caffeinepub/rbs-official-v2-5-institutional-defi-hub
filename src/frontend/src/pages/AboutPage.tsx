import { AnimatedSection } from "@/components/AnimatedSection";
import { PageHead } from "@/components/PageHead";
import {
  Award,
  Code,
  Globe,
  Lock,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade security protocols protecting your assets and transactions 24/7 on the Internet Computer.",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Sub-second transaction finality on the Internet Computer Protocol with virtually zero fees.",
    color: "from-yellow-500/20 to-yellow-500/5",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Governed by token holders through transparent voting — every voice matters in the RBS ecosystem.",
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: TrendingUp,
    title: "Deflationary Model",
    description:
      "Built-in scarcity mechanisms with 15% burn allocation increase long-term token value.",
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description:
      "Comprehensive APIs and tools for seamless ecosystem integration and expansion.",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: Lock,
    title: "Audited Contracts",
    description:
      "Independently verified and continuously monitored smart contracts for maximum trust.",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

const techPillars = [
  {
    icon: Globe,
    title: "ICP Architecture",
    desc: "Built on the Internet Computer Protocol — the world's first blockchain that runs at web speed with near-zero cost transactions.",
  },
  {
    icon: Award,
    title: "Token Economics",
    desc: "A carefully designed deflationary model with burn mechanisms, staking rewards, and governance rights that align community incentives.",
  },
  {
    icon: Users,
    title: "Governance Model",
    desc: "Democratic decision-making through token-weighted voting, ensuring the community shapes the future direction of the protocol.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="About RBS | Return Be Superior"
        description="Learn about RBS's mission, technology, and vision for the future of decentralized blockchain solutions"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <AnimatedSection direction="up" className="text-center mb-20 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              <Award className="w-4 h-4" /> About RBS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold shimmer-gold mb-6">
              Return Be Superior
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Return Be Superior is pioneering the next generation of blockchain
              solutions on the Internet Computer Protocol. We're building a
              transparent, secure, and scalable ecosystem for the decentralized
              future.
            </p>
          </AnimatedSection>

          {/* Mission Card */}
          <AnimatedSection direction="left" delay={100} className="mb-16">
            <div className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-amber-400" />
                Our Mission
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <p className="text-gray-400 leading-relaxed text-lg">
                  We're building a transparent, secure, and scalable blockchain
                  ecosystem that empowers individuals and organizations to
                  participate in the decentralized economy on their own terms.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Through innovative technology and community-driven governance,
                  RBS is creating the infrastructure for the future of finance —
                  accessible, fair, and built to last.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Features */}
          <AnimatedSection
            direction="up"
            delay={150}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              What We Deliver
            </h2>
            <p className="text-gray-400">Core pillars of the RBS ecosystem</p>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} hover:border-amber-500/40 transition-all duration-300 group`}
                >
                  <div
                    className={`p-3 rounded-xl bg-black/30 w-fit mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* How It Works */}
          <AnimatedSection direction="up" delay={200} className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {techPillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-amber-500/30 transition-all duration-300"
                >
                  <pillar.icon className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-lg font-bold text-amber-400 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection direction="scale" delay={300}>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-blue-500/10 border border-amber-500/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Join the RBS Journey
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                Be part of a movement that's redefining blockchain
                accessibility. With 100,000 RBS fixed supply and a
                community-first approach, RBS is built for long-term success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://t.me/RBSuperior"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600/20 border border-blue-500/40 text-blue-400 rounded-xl font-bold hover:bg-blue-600/30 transition-all duration-300"
                >
                  Join Telegram
                </a>
                <a
                  href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600/20 border border-green-500/40 text-green-400 rounded-xl font-bold hover:bg-green-600/30 transition-all duration-300"
                >
                  WhatsApp Channel
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
