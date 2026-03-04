import { AnimatedSection } from "@/components/AnimatedSection";
import { PageHead } from "@/components/PageHead";
import { ParticleField } from "@/components/ParticleField";
import { SmokySectionTransition } from "@/components/SmokySectionTransition";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Coins,
  Globe,
  Lock,
  MessageCircle,
  Send,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  {
    label: "Total Supply",
    value: "100,000 RBS",
    icon: Coins,
    color: "text-amber-400",
  },
  {
    label: "Presale Opens",
    value: "Q1 2027",
    icon: Calendar,
    color: "text-green-400",
  },
  {
    label: "Liquidity Pool",
    value: "40%",
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    label: "Community Pool",
    value: "8,000 RBS",
    icon: Users,
    color: "text-purple-400",
  },
  {
    label: "Airdrop Opens",
    value: "Q1 2029",
    icon: Globe,
    color: "text-pink-400",
  },
  { label: "Token Burns", value: "15%", icon: Zap, color: "text-red-400" },
];

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Live Market Data",
    description:
      "Real-time price tracking and market analytics with automatic refresh every 60 seconds.",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    icon: Zap,
    title: "G-MAN Intelligence",
    description:
      "Passcode-locked AI signal engine generating real-time trading signals with RSI, MACD, EMA and more.",
    color: "from-yellow-500/20 to-yellow-500/5",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
  {
    icon: Shield,
    title: "AI Sentiment",
    description:
      "Machine learning-powered market sentiment scoring with confidence metrics and real-time accuracy.",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Users,
    title: "Community Governance",
    description:
      "Decentralized decision-making with proposal creation and open voting for all community members.",
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: Globe,
    title: "Market Dashboard",
    description:
      "Comprehensive market intelligence hub with live prices, news, and analytics in one place.",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: Lock,
    title: "Staking Calculator",
    description:
      "Calculate your RBS staking rewards with compound interest and tier-based APY projections.",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHead
        title="Home"
        description="Return Be Superior — Advanced blockchain solutions and RBS token ecosystem"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
        {/* ── Hero ── */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
          <ParticleField count={40} color="rgba(218, 165, 32, 0.6)" />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-950/80 pointer-events-none"
            style={{ zIndex: 2 }}
          />

          {/* Rotating glow orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ zIndex: 1 }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-600/8 rounded-full blur-3xl pointer-events-none animate-glow-pulse"
            style={{ zIndex: 1, animationDelay: "1.5s" }}
          />

          <div
            className="relative container mx-auto px-4 text-center"
            style={{ zIndex: 3 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-neon-pulse" />
                <img
                  src="/assets/generated/rbs-token-logo.dim_512x512.png"
                  alt="RBS Token"
                  className="w-28 h-28 object-contain relative z-10 animate-float"
                  style={{ width: "112px", height: "112px" }}
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="text-5xl md:text-7xl font-bold mb-6 shimmer-gold leading-tight font-poppins"
            >
              Return Be Superior
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Advanced blockchain solutions powered by the RBS token ecosystem.
              Superior trading intelligence, real-time market analytics, and
              community-driven governance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                data-ocid="home.primary_button"
                onClick={() => navigate({ to: "/acquisition" })}
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-8 py-6 magnetic-hover"
              >
                Get RBS Tokens <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                data-ocid="home.secondary_button"
                onClick={() => navigate({ to: "/market-intel" })}
                size="lg"
                variant="outline"
                className="border-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-bold text-lg px-8 py-6 magnetic-hover"
              >
                G-MAN Intel <Zap className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className="w-6 h-10 border-2 border-amber-500/40 rounded-full flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 bg-amber-400 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats Ticker ── */}
        <SmokySectionTransition>
          <section className="py-10 px-4 border-y border-amber-500/10 bg-black/40 backdrop-blur-sm">
            <div className="container mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="text-center p-3 rounded-xl bg-white/3 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group"
                  >
                    <stat.icon
                      className={`w-5 h-5 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`}
                    />
                    <div className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── Features Grid ── */}
        <SmokySectionTransition delay={100}>
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <AnimatedSection direction="up" className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" /> Platform Features
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 shimmer-gold">
                  Everything You Need
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Comprehensive tools and services for the modern blockchain
                  ecosystem
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className={`relative p-6 rounded-2xl border bg-gradient-to-br ${feature.color} ${feature.border} cursor-default group overflow-hidden`}
                  >
                    {/* Scan line effect on hover */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent animate-scan" />
                    </div>

                    <div
                      className={`w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── Token Distribution ── */}
        <SmokySectionTransition delay={150}>
          <section className="py-20 px-4 bg-black/30 border-y border-amber-500/10">
            <div className="container mx-auto max-w-4xl">
              <AnimatedSection direction="up" className="text-center mb-12">
                <h2 className="text-4xl font-bold shimmer-gold mb-4">
                  Token Distribution
                </h2>
                <p className="text-gray-400">
                  100,000 RBS Fixed Supply — Fair &amp; Transparent
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Liquidity", pct: 40, color: "#3B82F6" },
                  { label: "Presale", pct: 20, color: "#10B981" },
                  { label: "Burn", pct: 15, color: "#EF4444" },
                  { label: "Team", pct: 10, color: "#8B5CF6" },
                  { label: "Community", pct: 8, color: "#F59E0B" },
                  { label: "Airdrop", pct: 7, color: "#EC4899" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-amber-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300 text-sm font-medium">
                        {item.label}
                      </span>
                      <span
                        className="font-bold text-lg"
                        style={{ color: item.color }}
                      >
                        {item.pct}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1 + 0.3,
                          ease: "easeOut",
                        }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {(item.pct * 1000).toLocaleString()} RBS
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── Roadmap Timeline ── */}
        <SmokySectionTransition delay={200}>
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <AnimatedSection direction="up" className="text-center mb-12">
                <h2 className="text-4xl font-bold shimmer-gold mb-4">
                  Roadmap
                </h2>
                <p className="text-gray-400">
                  Our journey to full mainnet launch
                </p>
              </AnimatedSection>

              <div className="relative">
                <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/60 via-amber-500/30 to-transparent" />

                {[
                  {
                    year: "2026",
                    title: "Community Gain",
                    desc: "Building global community, raising awareness, and establishing ecosystem foundations.",
                    side: "left",
                    color: "text-amber-400",
                    done: true,
                  },
                  {
                    year: "2027",
                    title: "Presale Launch",
                    desc: "Presale opens Q1 2027. Early adopters can acquire RBS tokens via WhatsApp portal.",
                    side: "right",
                    color: "text-green-400",
                    done: false,
                  },
                  {
                    year: "2028",
                    title: "Big Year & Collaborations",
                    desc: "Major exchange listings, strategic partnerships, and ecosystem integrations.",
                    side: "left",
                    color: "text-blue-400",
                    done: false,
                  },
                  {
                    year: "2029",
                    title: "Airdrop Distribution",
                    desc: "Airdrop registration opens Q1 2029. Free RBS distribution to eligible wallets.",
                    side: "right",
                    color: "text-purple-400",
                    done: false,
                  },
                  {
                    year: "2030",
                    title: "Full Mainnet Launch",
                    desc: "Complete mainnet deployment with full DeFi capabilities and global adoption.",
                    side: "left",
                    color: "text-pink-400",
                    done: false,
                  },
                ].map((milestone, i) => (
                  <motion.div
                    key={milestone.year}
                    initial={{
                      opacity: 0,
                      x: milestone.side === "left" ? -40 : 40,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.15,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className={`relative mb-12 flex ${milestone.side === "left" ? "flex-row" : "flex-row-reverse"} items-center gap-6 md:gap-12`}
                  >
                    <div
                      className={`flex-1 ${milestone.side === "left" ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block p-5 rounded-2xl bg-white/3 border ${milestone.done ? "border-amber-500/40" : "border-white/8"} hover:border-amber-500/30 transition-all duration-300`}
                      >
                        <div
                          className={`text-2xl font-bold mb-1 ${milestone.color}`}
                        >
                          {milestone.year}
                        </div>
                        <div className="text-white font-bold mb-2">
                          {milestone.title}
                        </div>
                        <div className="text-gray-400 text-sm leading-relaxed">
                          {milestone.desc}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${milestone.done ? "bg-amber-400 border-amber-400 shadow-lg shadow-amber-400/50" : "bg-gray-800 border-gray-600"} z-10`}
                    />
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        {/* ── Social / CTA Section ── */}
        <SmokySectionTransition delay={100}>
          <section className="py-20 px-4 bg-black/40 border-t border-amber-500/10">
            <div className="container mx-auto text-center max-w-3xl">
              <AnimatedSection direction="up">
                <h2 className="text-4xl md:text-5xl font-bold shimmer-gold mb-6">
                  Join the RBS Community
                </h2>
                <p className="text-xl text-gray-400 mb-10">
                  Connect with us on Telegram, WhatsApp, and stay updated on the
                  latest developments
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <a
                    href="https://t.me/RBSuperior"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="home.telegram.link"
                    className="flex items-center gap-3 px-8 py-4 bg-blue-600/20 border border-blue-500/40 text-blue-400 rounded-xl font-bold hover:bg-blue-600/30 hover:border-blue-500/60 transition-all duration-300 magnetic-hover"
                  >
                    <Send className="w-5 h-5" /> Join Telegram
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="home.whatsapp.link"
                    className="flex items-center gap-3 px-8 py-4 bg-green-600/20 border border-green-500/40 text-green-400 rounded-xl font-bold hover:bg-green-600/30 hover:border-green-500/60 transition-all duration-300 magnetic-hover"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp Channel
                  </a>
                  <Button
                    data-ocid="home.cta.primary_button"
                    onClick={() => navigate({ to: "/acquisition" })}
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 magnetic-hover"
                  >
                    Join Presale <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </SmokySectionTransition>
      </div>
    </>
  );
}
