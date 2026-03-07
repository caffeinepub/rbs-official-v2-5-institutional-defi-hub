import { AnimatedSection } from "@/components/AnimatedSection";
import { PageHead } from "@/components/PageHead";
import {
  Award,
  CheckCircle,
  Eye,
  FileCheck,
  Globe,
  Lock,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";

const securityFeatures = [
  {
    icon: Shield,
    title: "Smart Contract Audits",
    description:
      "Independently audited by leading blockchain security firms with continuous monitoring.",
    details: [
      "CertiK-Level Audit",
      "Continuous Monitoring",
      "Bug Bounty Program",
      "Real-time Alerts",
    ],
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Lock,
    title: "Multi-Signature Security",
    description:
      "Critical operations require multiple approvals for enhanced security and trust.",
    details: [
      "Multi-Sig Wallets",
      "Time-Locked Transactions",
      "Emergency Pause",
      "2-of-3 Threshold",
    ],
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    icon: Eye,
    title: "Transparent Operations",
    description:
      "All transactions and governance decisions are publicly verifiable on-chain.",
    details: [
      "On-Chain Governance",
      "Public Treasury",
      "Open Source Code",
      "Immutable Records",
    ],
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    icon: FileCheck,
    title: "Regular Reports",
    description:
      "Quarterly transparency reports and financial disclosures for full accountability.",
    details: [
      "Financial Reports",
      "Development Updates",
      "Community Metrics",
      "Risk Assessments",
    ],
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
];

const trustMetrics = [
  { icon: Award, value: "100%", label: "Open Source", color: "text-amber-400" },
  { icon: Globe, value: "24/7", label: "Monitoring", color: "text-green-400" },
  { icon: Shield, value: "0", label: "Exploits Ever", color: "text-blue-400" },
  {
    icon: CheckCircle,
    value: "100K",
    label: "Fixed Supply",
    color: "text-purple-400",
  },
];

export default function SecurityTransparencyPage() {
  return (
    <>
      <PageHead
        title="Security & Transparency | RBS"
        description="RBS security measures and transparency commitments"
      />
      <div className="min-h-screen bg-white text-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <AnimatedSection direction="up" className="text-center mb-16 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> Security & Transparency
            </div>
            <h1 className="text-4xl md:text-6xl font-bold shimmer-gold mb-6">
              Built for Trust
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Building confidence through robust security protocols and complete
              operational transparency
            </p>
          </AnimatedSection>

          {/* Trust Metrics */}
          <AnimatedSection
            direction="up"
            delay={100}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {trustMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-amber-500/30 transition-all duration-300 text-center"
              >
                <metric.icon
                  className={`w-8 h-8 mx-auto mb-3 ${metric.color}`}
                />
                <div className={`text-3xl font-bold mb-1 ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-gray-500 text-sm">{metric.label}</div>
              </motion.div>
            ))}
          </AnimatedSection>

          {/* Security Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 mb-16">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
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
                  className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} hover:border-amber-500/40 transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gray-50 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Commitment Card */}
          <AnimatedSection direction="up" delay={200}>
            <div className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-amber-400" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Our Security Commitment
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <p className="text-gray-500 leading-relaxed">
                  At RBS, security and transparency are not just
                  features—they're fundamental principles that guide every
                  decision we make. We believe trust is earned through
                  consistent action and complete openness with our community.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Our smart contracts undergo rigorous auditing by
                  industry-leading security firms, and we maintain an active bug
                  bounty program. All governance decisions and treasury
                  operations are conducted on-chain, ensuring complete
                  accountability to our community.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
