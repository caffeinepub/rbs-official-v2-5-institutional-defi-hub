import {
  CheckCircle,
  Coins,
  Gift,
  Globe,
  Handshake,
  Rocket,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "../components/AnimatedSection";
import { PageHead } from "../components/PageHead";

const phases = [
  {
    year: "2026",
    title: "Community Gain",
    status: "active",
    icon: Users,
    gradientFrom: "#F59E0B",
    gradientTo: "#D97706",
    milestones: [
      "Build and grow the RBS community base globally",
      "Launch social media presence and engagement campaigns",
      "Onboard early adopters and community ambassadors",
      "Establish governance framework foundations",
    ],
  },
  {
    year: "2027",
    title: "Pre-Sale of RBS",
    status: "upcoming",
    icon: Coins,
    gradientFrom: "#10B981",
    gradientTo: "#059669",
    milestones: [
      "Presale launch — token distribution begins Q1 2027",
      "KYC/AML compliance integration",
      "Early investor allocation rounds via WhatsApp portal",
      "Token smart contract audit and deployment",
    ],
  },
  {
    year: "2028",
    title: "Big Year for RBS",
    status: "upcoming",
    icon: Handshake,
    gradientFrom: "#3B82F6",
    gradientTo: "#2563EB",
    milestones: [
      "Multiple strategic collaborations and partnerships announced",
      "Exchange listings on major platforms",
      "DeFi protocol integrations and ecosystem expansion",
      "Developer grants program launched",
    ],
  },
  {
    year: "2029",
    title: "Airdrop Registration & Distribution",
    status: "upcoming",
    icon: Gift,
    gradientFrom: "#8B5CF6",
    gradientTo: "#7C3AED",
    milestones: [
      "Airdrop sign-up opens Q1 2029 — free RBS for eligible wallets",
      "Community reward programs fully activated",
      "Staking and yield farming launch",
      "Cross-chain bridge deployment",
    ],
  },
  {
    year: "2030",
    title: "Full Mainnet Launch",
    status: "upcoming",
    icon: Globe,
    gradientFrom: "#EC4899",
    gradientTo: "#DB2777",
    milestones: [
      "Complete mainnet deployment with full liquidity provisioning",
      "Full decentralized governance activation",
      "Global institutional partnerships established",
      "RBS ecosystem fully operational at scale",
    ],
  },
];

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    if (prefersReduced.current) {
      setValue(target);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

export default function RoadmapPage() {
  const phases5 = useCountUp(5);
  const years5 = useCountUp(5);
  const milestones20 = useCountUp(20);
  const year2030 = useCountUp(2030);

  return (
    <>
      <PageHead
        title="Roadmap | RBS Superior"
        description="RBS Superior development roadmap from 2026 to 2030 — community growth, presale, partnerships, airdrop, and full mainnet launch."
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-amber-500/5 pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <AnimatedSection direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" />
                Development Roadmap
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 shimmer-gold">
                The RBS Journey
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Five transformative phases from community building to full
                mainnet launch — charting the path to a decentralized future.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/80 via-amber-500/40 to-amber-500/10 transform md:-translate-x-0.5" />

            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={phase.year}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className={`relative flex items-start mb-16 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
                >
                  {/* Icon bubble */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white/10 hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${phase.gradientFrom}, ${phase.gradientTo})`,
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-24 md:ml-0 ${isLeft ? "md:mr-auto md:pr-16 md:pl-0 md:w-5/12" : "md:ml-auto md:pl-16 md:pr-0 md:w-5/12"} w-full`}
                  >
                    <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 group">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-3xl font-bold"
                          style={{ color: phase.gradientFrom }}
                        >
                          {phase.year}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {phase.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${phase.status === "active" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}
                          >
                            {phase.status === "active"
                              ? "● Active Now"
                              : "◌ Upcoming"}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {phase.milestones.map((m) => (
                          <li
                            key={m}
                            className="flex items-start gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <AnimatedSection direction="up" delay={100}>
          <section className="py-16 px-6 bg-black/30 border-t border-amber-500/10">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Phases", value: phases5 },
                { label: "Years", value: years5 },
                { label: "Milestones", value: milestones20 },
                { label: "Launch Year", value: year2030 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-900/60 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all duration-300"
                >
                  <div className="text-4xl font-bold text-amber-400">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      </div>
    </>
  );
}
