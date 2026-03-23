import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart2,
  ChevronRight,
  Code,
  FileText,
  Globe,
  Lock,
  Network,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { id: "executive", title: "Executive Summary", icon: FileText },
  { id: "tokenomics", title: "Tokenomics & Distribution", icon: BarChart2 },
  { id: "price", title: "Price Discovery", icon: TrendingUp },
  { id: "supply", title: "Supply Mechanics", icon: Zap },
  { id: "vesting", title: "Vesting Schedules", icon: Lock },
  { id: "utility", title: "Token Utility", icon: Shield },
  { id: "governance", title: "Governance Framework", icon: Users },
  { id: "security", title: "Security Architecture", icon: Lock },
  { id: "economic", title: "Economic Model", icon: TrendingUp },
  { id: "mesh", title: "Neural Mesh Technology", icon: Network },
  { id: "institutional", title: "Institutional Integration", icon: Globe },
  { id: "roadmap", title: "Strategic Roadmap", icon: TrendingUp },
  { id: "technical", title: "Technical Stack", icon: Code },
  { id: "bnb-architecture", title: "BNB Chain Architecture", icon: Network },
  {
    id: "token-distribution",
    title: "Token Distribution Deep Dive",
    icon: BarChart2,
  },
  {
    id: "price-mechanics",
    title: "Price Discovery & Market Mechanics",
    icon: TrendingUp,
  },
  { id: "dao-structure", title: "Governance & DAO Structure", icon: Users },
  { id: "staking-arch", title: "Staking Architecture", icon: Zap },
  { id: "security-framework", title: "Security Framework", icon: Shield },
  { id: "regulatory", title: "Regulatory Considerations", icon: Globe },
  {
    id: "market-intel-platform",
    title: "Market Intelligence Platform",
    icon: Code,
  },
  { id: "risk-factors", title: "Risk Factors", icon: Shield },
  { id: "conclusion", title: "Conclusion", icon: FileText },
];

export default function WhitepaperPage() {
  const [activeChapter, setActiveChapter] = useState("executive");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const chapter of CHAPTERS) {
      const element = sectionRefs.current[chapter.id];
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set(prev).add(chapter.id));
              if (entry.intersectionRatio > 0.5) {
                setActiveChapter(chapter.id);
              }
            }
          },
          { threshold: [0.1, 0.5] },
        );
        observer.observe(element);
        observers.push(observer);
      }
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, []);

  const scrollToChapter = (chapterId: string) => {
    const element = sectionRefs.current[chapterId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveChapter(chapterId);
    }
  };

  const sectionClass = (id: string) =>
    `bg-white border border-gray-200 shadow-sm p-10 glow-border transition-all duration-700 ${
      visibleSections.has(id)
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-8"
    }`;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FileText className="h-10 w-10 text-gold" />
              <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold tracking-tight">
                Whitepaper
              </h1>
            </div>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed">
              Comprehensive technical and economic overview of the RBS token
              ecosystem
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm metallic-text-secondary">
              <span>Version 2.0</span>
              <span>•</span>
              <span>Fixed Supply: 100,000 RBS</span>
              <span>•</span>
              <span>BNB Smart Chain</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chapter Navigation Sidebar */}
            <div className="lg:col-span-1 animate-fade-in-up animation-delay-200">
              <div className="sticky top-24 bg-white border border-gray-200 shadow-sm-gold p-6 glow-border">
                <h2 className="text-xl font-poppins font-bold text-gold mb-4">
                  Chapters
                </h2>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-2">
                    {CHAPTERS.map((chapter) => {
                      const Icon = chapter.icon;
                      return (
                        <Button
                          key={chapter.id}
                          variant="ghost"
                          onClick={() => scrollToChapter(chapter.id)}
                          className={`w-full justify-start text-left transition-all duration-300 hover:bg-gold/10 hover:translate-x-2 ${
                            activeChapter === chapter.id
                              ? "bg-gold/20 text-gold border-l-4 border-gold"
                              : "text-gold/70 hover:text-gold"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2 shrink-0" />
                          <span className="text-sm font-inter truncate">
                            {chapter.title}
                          </span>
                          {activeChapter === chapter.id && (
                            <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
                          )}
                        </Button>
                      );
                    })}
                  </nav>
                </ScrollArea>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                {/* Executive Summary */}
                <div
                  ref={(el) => {
                    sectionRefs.current.executive = el;
                  }}
                  className={sectionClass("executive")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Executive Summary
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS Official represents a paradigm shift in institutional
                    decentralized finance, combining cutting-edge blockchain
                    technology with enterprise-grade security and scalability.
                    Built on the BNB Smart Chain (BNB Chain), RBS leverages
                    advanced architecture to deliver sub-second transaction
                    finality while maintaining the highest standards of
                    decentralization and security.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS token is a fixed-supply digital asset with a total
                    cap of 100,000 tokens — making it one of the most scarce
                    utility tokens in the blockchain space. This extreme
                    scarcity, combined with deflationary burn mechanisms and
                    growing utility, creates a powerful long-term value
                    proposition.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Our mission is to bridge the gap between traditional finance
                    and decentralized systems, providing professional users with
                    the tools, infrastructure, and confidence needed to
                    participate in the digital asset revolution. Through
                    innovative tokenomics, robust governance mechanisms, and a
                    commitment to transparency, RBS is positioned to become a
                    premier DeFi platform.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    This whitepaper outlines the complete technical
                    architecture, economic model, governance framework, vesting
                    schedules, price discovery mechanics, and strategic roadmap
                    guiding RBS through its evolution from launch to market
                    leadership.
                  </p>
                </div>

                {/* Tokenomics */}
                <div
                  ref={(el) => {
                    sectionRefs.current.tokenomics = el;
                  }}
                  className={sectionClass("tokenomics")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart2 className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Tokenomics &amp; Distribution
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />

                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS implements a meticulously designed tokenomics model with
                    a fixed maximum supply of exactly{" "}
                    <strong className="text-gold">100,000 RBS tokens</strong>.
                    No additional tokens can ever be created. This hard cap,
                    enforced at the smart contract level on the Internet
                    Computer Protocol, ensures permanent scarcity and protects
                    holders from inflationary dilution.
                  </p>

                  <h3 className="text-2xl font-poppins font-bold text-gold mb-4">
                    Token Distribution Breakdown
                  </h3>

                  <div className="space-y-4 mb-8">
                    {[
                      {
                        icon: "💧",
                        category: "Liquidity Pool",
                        amount: "40,000 RBS",
                        pct: "40%",
                        color: "border-blue-300 bg-blue-50",
                        desc: "Allocated to decentralized exchange liquidity pools and market-making operations. This ensures sufficient trading depth, reduces slippage, and supports healthy price discovery from day one of trading.",
                      },
                      {
                        icon: "🌱",
                        category: "Presale",
                        amount: "20,000 RBS",
                        pct: "20%",
                        color: "border-emerald-300 bg-emerald-50",
                        desc: "Reserved for early investors and presale participants (Q1 2027). Presale tokens are subject to vesting schedules to prevent immediate sell pressure and reward long-term commitment.",
                      },
                      {
                        icon: "🔥",
                        category: "Burn Reserve",
                        amount: "15,000 RBS",
                        pct: "15%",
                        color: "border-red-300 bg-red-50",
                        desc: "Dedicated deflationary reserve to be burned progressively through protocol milestones, governance votes, and automated burn events. Once burned, these tokens are permanently removed from circulation.",
                      },
                      {
                        icon: "👥",
                        category: "Team & Development",
                        amount: "10,000 RBS",
                        pct: "10%",
                        color: "border-purple-300 bg-purple-50",
                        desc: "Allocated to the founding team, core developers, and advisors. Subject to a 6-month cliff followed by 24-month linear vesting, fully aligning the team's interests with long-term token appreciation.",
                      },
                      {
                        icon: "🎁",
                        category: "Community Rewards",
                        amount: "8,000 RBS",
                        pct: "8%",
                        color: "border-yellow-300 bg-yellow-50",
                        desc: "Reserved for community incentives including staking rewards, trading competitions, governance participation bonuses, bug bounties, and ecosystem growth initiatives.",
                      },
                      {
                        icon: "🚀",
                        category: "Airdrop",
                        amount: "7,000 RBS",
                        pct: "7%",
                        color: "border-pink-300 bg-pink-50",
                        desc: "Distributed to eligible community members in Q1 2029 based on engagement, holding duration, and contribution to the ecosystem. Airdrops reward early adopters and broaden token distribution.",
                      },
                    ].map((item) => (
                      <div
                        key={item.category}
                        className={`border ${item.color} rounded-xl p-5`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <span className="font-poppins font-bold text-gold text-lg">
                                {item.category}
                              </span>
                              <span className="ml-3 text-sm metallic-text-secondary">
                                {item.pct} — {item.amount}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="metallic-text-secondary font-inter text-sm leading-relaxed ml-11">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h4 className="font-poppins font-bold text-gold text-lg mb-3">
                      Distribution Rationale
                    </h4>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                      The distribution strategy prioritizes liquidity (40%) to
                      ensure market stability, while keeping circulating supply
                      initially low through vesting mechanisms. The large burn
                      reserve (15%) signals long-term commitment to scarcity.
                      Community-facing allocations (presale + airdrop + rewards
                      = 35%) ensure broad decentralization and community
                      ownership.
                    </p>
                  </div>
                </div>

                {/* Price Discovery */}
                <div
                  ref={(el) => {
                    sectionRefs.current.price = el;
                  }}
                  className={sectionClass("price")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Price Discovery
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />

                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS price discovery follows a structured, multi-phase
                    approach designed to establish a fair initial market price
                    while preventing manipulation, front-running, and artificial
                    inflation.
                  </p>

                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Phase 1: Presale Pricing (Q1 2027)
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-4 text-base">
                    The presale price is determined by a tiered structure. Early
                    participants receive preferential pricing in recognition of
                    the elevated risk they assume. Presale prices are set based
                    on a target fully-diluted valuation that reflects the
                    project's development stage, comparable assets, and
                    realistic growth potential. Presale proceeds fund liquidity
                    bootstrapping and development.
                  </p>

                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Phase 2: Initial DEX Listing
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-4 text-base">
                    Upon the initial DEX listing, price is determined by the
                    liquidity seeding ratio — the amount of RBS tokens and
                    paired assets (USDT/BNB) deposited into the pool. The
                    liquidity provision of 40,000 RBS tokens ensures immediate
                    trading depth and reduces initial price volatility. Market
                    makers provide additional depth through coordinated
                    liquidity programs.
                  </p>

                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Phase 3: Market-Driven Pricing
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-base">
                    After initial listing, RBS price is driven by open market
                    forces: supply and demand dynamics, trading volume, holder
                    sentiment, ecosystem growth metrics, and macro crypto market
                    conditions. The protocol does not intervene in price
                    formation except through pre-announced burn events.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h4 className="font-poppins font-bold text-gold text-lg mb-3">
                      Key Price Drivers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Declining circulating supply from burn events",
                        "Growing platform utility and user adoption",
                        "Governance participation creating token lock-up",
                        "Staking yield attracting long-term holders",
                        "Exchange listings increasing accessibility",
                        "Community growth and ecosystem expansion",
                      ].map((driver) => (
                        <div key={driver} className="flex items-start gap-2">
                          <span className="text-gold mt-1">▸</span>
                          <span className="metallic-text-secondary font-inter text-sm">
                            {driver}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Supply Mechanics */}
                <div
                  ref={(el) => {
                    sectionRefs.current.supply = el;
                  }}
                  className={sectionClass("supply")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Supply Mechanics
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />

                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The supply mechanics of RBS are engineered for long-term
                    value preservation and scarcity amplification. The
                    fundamental parameters are permanently fixed at the protocol
                    level.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        label: "Maximum Supply",
                        value: "100,000 RBS",
                        note: "Absolute hard cap — no exceptions",
                      },
                      {
                        label: "Minting Policy",
                        value: "Zero",
                        note: "No new tokens can ever be minted",
                      },
                      {
                        label: "Deflationary",
                        value: "Yes",
                        note: "15,000 RBS burn reserve reduces supply",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-center"
                      >
                        <div className="text-2xl font-poppins font-bold text-gold mb-1">
                          {item.value}
                        </div>
                        <div className="text-sm font-bold metallic-text-secondary mb-1">
                          {item.label}
                        </div>
                        <div className="text-xs metallic-text-secondary">
                          {item.note}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Deflationary Burn Mechanism
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-4 text-base">
                    RBS employs multiple deflationary channels to progressively
                    reduce the available supply:
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      {
                        title: "Milestone Burns",
                        desc: "Scheduled burns tied to platform development milestones. When key targets are achieved, pre-defined token quantities are sent to the null address, permanently removing them from supply.",
                      },
                      {
                        title: "Governance Burns",
                        desc: "Token holders can vote to execute additional burn events from the 15,000 RBS burn reserve. This democratic control over supply reduction aligns burns with community consensus.",
                      },
                      {
                        title: "Protocol Revenue Burns",
                        desc: "A portion of platform fees and ecosystem revenue is used to buy back and burn RBS tokens from the open market, creating continuous buy pressure and supply reduction.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="border border-gray-200 rounded-xl p-4"
                      >
                        <h4 className="font-poppins font-semibold text-gold mb-1">
                          {item.title}
                        </h4>
                        <p className="metallic-text-secondary font-inter text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Circulating Supply Timeline
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                    At launch, circulating supply begins with the liquidity
                    allocation (40,000 RBS) plus any airdrop distribution.
                    Presale tokens unlock according to vesting schedules. Team
                    tokens vest over 30 months. As burns occur, total supply
                    decreases permanently. Projected circulating supply by 2030:
                    approximately 60,000–75,000 RBS after accounting for
                    vesting, burns, and locked staking positions.
                  </p>
                </div>

                {/* Vesting Schedules */}
                <div
                  ref={(el) => {
                    sectionRefs.current.vesting = el;
                  }}
                  className={sectionClass("vesting")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Vesting Schedules
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />

                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Vesting schedules are critical to preventing early sell
                    pressure and ensuring long-term alignment between token
                    holders, the team, and the protocol. All vesting is enforced
                    at the smart contract level and cannot be modified.
                  </p>

                  <div className="space-y-6 mb-8">
                    {[
                      {
                        category: "Team & Development (10,000 RBS)",
                        icon: "👥",
                        cliff: "6 months",
                        duration: "24 months linear post-cliff",
                        total: "30 months total",
                        detail:
                          "Team tokens are completely locked for 6 months from the token generation event (TGE). After the cliff, 1/24th of the allocation unlocks monthly over 24 months. This 30-month total schedule ensures the team's long-term commitment.",
                      },
                      {
                        category: "Liquidity (40,000 RBS)",
                        icon: "💧",
                        cliff: "None",
                        duration: "Locked 36 months in LP",
                        total: "LP tokens burned after lock",
                        detail:
                          "Liquidity pool tokens are locked for a minimum of 36 months via smart contract. LP tokens are time-locked and cannot be withdrawn. This prevents rug-pull scenarios and ensures permanent trading liquidity.",
                      },
                      {
                        category: "Presale (20,000 RBS)",
                        icon: "🌱",
                        cliff: "3 months",
                        duration: "12 months linear post-cliff",
                        total: "15 months total",
                        detail:
                          "Presale participants receive a 3-month cliff followed by linear monthly unlocks over 12 months. 10% may unlock at TGE for early liquidity, with the remainder vesting over 15 months.",
                      },
                      {
                        category: "Community Rewards (8,000 RBS)",
                        icon: "🎁",
                        cliff: "None",
                        duration: "Distributed over 36 months",
                        total: "Ongoing incentives",
                        detail:
                          "Community reward tokens are distributed gradually through staking programs, governance participation, and ecosystem incentives over a 36-month period. No large single unlocks.",
                      },
                      {
                        category: "Airdrop (7,000 RBS)",
                        icon: "🚀",
                        cliff: "Until Q1 2029",
                        duration: "Immediate at airdrop",
                        total: "Single distribution event",
                        detail:
                          "Airdrop tokens are fully locked until Q1 2029. At the distribution date, eligible wallets receive their allocation in a single event. Eligibility is determined by a snapshot of engagement metrics.",
                      },
                      {
                        category: "Burn Reserve (15,000 RBS)",
                        icon: "🔥",
                        cliff: "N/A",
                        duration: "Governance-controlled",
                        total: "Never enters circulation",
                        detail:
                          "Burn reserve tokens are held in a dedicated smart contract. They can only be burned, never transferred or sold. Each burn requires a governance vote or automatic milestone trigger. These tokens reduce total supply permanently.",
                      },
                    ].map((item) => (
                      <div
                        key={item.category}
                        className="border border-gray-200 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">{item.icon}</span>
                          <h3 className="font-poppins font-bold text-gold text-lg">
                            {item.category}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs metallic-text-secondary mb-1">
                              Cliff
                            </div>
                            <div className="font-semibold text-gold text-sm">
                              {item.cliff}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs metallic-text-secondary mb-1">
                              Duration
                            </div>
                            <div className="font-semibold text-gold text-sm">
                              {item.duration}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs metallic-text-secondary mb-1">
                              Total Lock
                            </div>
                            <div className="font-semibold text-gold text-sm">
                              {item.total}
                            </div>
                          </div>
                        </div>
                        <p className="metallic-text-secondary font-inter text-sm leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Token Utility */}
                <div
                  ref={(el) => {
                    sectionRefs.current.utility = el;
                  }}
                  className={sectionClass("utility")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Token Utility
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />

                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS is not a speculative asset — it is a multi-utility token
                    with real, measurable use cases within the RBS ecosystem.
                    Each utility creates organic demand and incentivizes
                    long-term holding.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      {
                        icon: "🔐",
                        title: "Market Intelligence Access",
                        desc: "RBS tokens gate access to the G-MAN Intelligence platform — AI-powered trading signals using RSI, MACD, EMA, Bollinger Bands, and more. Holders receive real-time market analysis and automated signal generation across crypto, forex, gold, and silver markets.",
                      },
                      {
                        icon: "🗳️",
                        title: "Governance & Voting",
                        desc: "Every RBS token represents voting power in the decentralized governance system. Token holders vote on protocol upgrades, fee structures, treasury allocations, burn schedules, and strategic partnerships. One token = one vote, with delegation support.",
                      },
                      {
                        icon: "💰",
                        title: "Staking & Yield",
                        desc: "Token holders can stake RBS to earn yield from protocol revenue. Staking locks tokens, reducing circulating supply. Staking tiers provide enhanced rewards for longer lock durations, incentivizing long-term commitment and ecosystem stability.",
                      },
                      {
                        icon: "✍️",
                        title: "Developer Blog Publishing",
                        desc: "RBS holders can publish technical blogs and research articles visible to the entire ecosystem. Published content reaches a global audience of traders and investors, creating a professional publishing platform for the crypto community.",
                      },
                      {
                        icon: "🏆",
                        title: "Leaderboard & Recognition",
                        desc: "Active RBS holders and platform contributors earn recognition on the community leaderboard. Top traders, governance participants, and content creators gain platform status and additional reward multipliers.",
                      },
                      {
                        icon: "🌐",
                        title: "Ecosystem Expansion Rights",
                        desc: "Early RBS holders gain priority access to future products, partnerships, and platform features before public release. This includes early access to new trading tools, API integrations, and cross-chain bridges as the ecosystem expands.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="border border-gray-200 rounded-xl p-5 hover:border-gold/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{item.icon}</span>
                          <h3 className="font-poppins font-bold text-gold">
                            {item.title}
                          </h3>
                        </div>
                        <p className="metallic-text-secondary font-inter text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Governance Framework */}
                <div
                  ref={(el) => {
                    sectionRefs.current.governance = el;
                  }}
                  className={sectionClass("governance")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Governance Framework
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS token holders participate in protocol governance through
                    a sophisticated weighted voting system. Proposals require
                    10% quorum and 66% supermajority approval, ensuring broad
                    consensus while preventing gridlock or minority capture.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Governance domains encompass fee structures, emission
                    schedules, treasury allocation, strategic partnerships,
                    ecosystem fund distribution, burn schedule adjustments, and
                    technical upgrades. Time-locked voting prevents flash loan
                    attacks, with minimum 7-day discussion periods before any
                    vote concludes.
                  </p>
                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Governance Process
                  </h3>
                  <div className="space-y-3 mb-6">
                    {[
                      {
                        step: "1",
                        title: "Proposal Submission",
                        desc: "Any holder of 100+ RBS can submit a governance proposal with a detailed specification, rationale, and implementation plan.",
                      },
                      {
                        step: "2",
                        title: "Community Discussion",
                        desc: "A minimum 7-day open discussion period allows community members to debate, refine, and provide feedback on the proposal.",
                      },
                      {
                        step: "3",
                        title: "Formal Voting",
                        desc: "A 5-day on-chain voting period where token holders cast votes. Quorum of 10% of circulating supply is required for validity.",
                      },
                      {
                        step: "4",
                        title: "Timelock Execution",
                        desc: "Approved proposals enter a 48-hour timelock before execution, giving the community time to react to any last-minute concerns.",
                      },
                      {
                        step: "5",
                        title: "Automated Execution",
                        desc: "Smart contracts automatically execute approved changes, ensuring no single party can override the democratic outcome.",
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex gap-4 p-4 border border-gray-200 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-poppins font-semibold text-gold mb-1">
                            {item.title}
                          </h4>
                          <p className="metallic-text-secondary font-inter text-sm leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                    Emergency governance procedures exist for critical security
                    situations. A security council can implement urgent fixes
                    with accelerated timelines (24-hour fast-track), subject to
                    retroactive approval by token holders within 72 hours.
                  </p>
                </div>

                {/* Security Architecture */}
                <div
                  ref={(el) => {
                    sectionRefs.current.security = el;
                  }}
                  className={sectionClass("security")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Security Architecture
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Security forms the foundation of RBS infrastructure.
                    Multiple protection layers defend against both technical and
                    social engineering attacks. All security measures are
                    verified by independent auditors.
                  </p>
                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Smart Contract Security
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-4 text-base">
                    All Motoko smart contracts undergo formal verification using
                    mathematical proof systems before mainnet deployment.
                    Multiple independent security firms conduct comprehensive
                    code audits. Comprehensive test suites cover edge cases,
                    attack vectors, reentrancy attacks, integer overflows, and
                    denial-of-service scenarios. Audit reports are published
                    publicly for community review.
                  </p>
                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Operational Security
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-4 text-base">
                    Administrative functions require multi-signature
                    authorization from multiple key holders across different
                    jurisdictions. Hardware security modules safeguard private
                    keys. Access controls implement principle of least
                    privilege. Multi-factor authentication protects all
                    administrative interfaces. Incident response procedures
                    enable rapid reaction to security events with predefined
                    escalation paths.
                  </p>
                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Insurance &amp; Risk Management
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                    Protocol-owned insurance funds cover potential smart
                    contract vulnerabilities. Partnerships with decentralized
                    insurance protocols offer optional coverage for large
                    positions. Bug bounty programs incentivize responsible
                    disclosure with rewards up to 50,000 USD equivalent. All
                    discovered vulnerabilities are patched and disclosed
                    publicly after remediation.
                  </p>
                </div>

                {/* Economic Model */}
                <div
                  ref={(el) => {
                    sectionRefs.current.economic = el;
                  }}
                  className={sectionClass("economic")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Economic Model
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />

                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS economic model is engineered around three pillars:
                    absolute scarcity, utility-driven demand, and progressive
                    deflationary pressure. Together, these create a
                    self-reinforcing value loop that rewards long-term holders.
                  </p>

                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Value Drivers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      {
                        title: "Fixed Supply + Burns",
                        desc: "Maximum 100,000 RBS with 15,000 designated for permanent burns. As adoption grows and tokens are burned, each remaining token represents a larger share of the ecosystem.",
                      },
                      {
                        title: "Utility Demand",
                        desc: "Real platform use cases create organic buying pressure. Market intelligence access, governance rights, and staking rewards create multiple reasons to acquire and hold RBS.",
                      },
                      {
                        title: "Staking Lock-up",
                        desc: "Staking programs lock tokens for set periods, reducing effective circulating supply. Higher staking participation = lower circulating supply = increased scarcity.",
                      },
                      {
                        title: "Protocol Buybacks",
                        desc: "A percentage of platform revenue goes to market buybacks, creating consistent buy pressure. Bought tokens are either burned or redistributed as staking rewards.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="bg-gold/5 border border-gold/20 rounded-xl p-4"
                      >
                        <h4 className="font-poppins font-semibold text-gold mb-2">
                          {item.title}
                        </h4>
                        <p className="metallic-text-secondary font-inter text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-poppins font-bold text-gold mb-4">
                    Long-Term Economic Sustainability
                  </h3>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-4 text-base">
                    Unlike inflationary tokens that dilute existing holders
                    through continuous minting, RBS maintains economic
                    sustainability through fee revenue, not token printing. The
                    platform generates revenue from trading tools subscriptions,
                    market intelligence fees, and ecosystem partnerships. This
                    revenue funds ongoing development, community rewards, and
                    buyback programs.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                    Treasury management follows conservative DeFi principles:
                    diversified holdings, yield-bearing stablecoins for
                    operational expenses, and transparent on-chain treasury with
                    community oversight. Treasury allocation decisions require
                    governance approval, preventing unilateral misuse of funds.
                  </p>
                </div>

                {/* Neural Mesh Technology */}
                <div
                  ref={(el) => {
                    sectionRefs.current.mesh = el;
                  }}
                  className={sectionClass("mesh")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Network className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Neural Mesh Technology
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The Neural Mesh architecture represents a breakthrough in
                    decentralized consensus mechanisms, combining proof-of-stake
                    security with efficiency. We achieve sub-second finality
                    while maintaining enterprise-grade security standards on the
                    BNB Smart Chain.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Performance metrics: transaction throughput exceeds 10,000
                    TPS under normal conditions. Finality averages 0.8 seconds.
                    Network latency remains below 100ms for 99% of transactions.
                    The system automatically rebalances computational load and
                    optimizes routing paths based on real-time network
                    conditions, ensuring 99.99% uptime.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    The G-MAN Oracle aggregates data from multiple sources
                    including live price feeds, Band Protocol data streams, and
                    proprietary consensus mechanisms. Cryptographic proofs
                    verify data integrity throughout the pipeline, ensuring
                    signals are based on real, unmanipulated market data.
                  </p>
                </div>

                {/* Institutional Integration */}
                <div
                  ref={(el) => {
                    sectionRefs.current.institutional = el;
                  }}
                  className={sectionClass("institutional")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Institutional Integration
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS bridges traditional finance and decentralized systems
                    through purpose-built institutional infrastructure. Custody
                    solutions meet regulatory requirements while maintaining
                    self-sovereign principles. API integrations enable seamless
                    connection with existing financial systems.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Institutional-grade features include advanced order types,
                    algorithmic trading support, and sophisticated risk
                    management tools. Dedicated institutional portals provide
                    enhanced analytics, reporting capabilities, and white-glove
                    support for high-value participants.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Partnerships with exchanges, market makers, and financial
                    service providers create bridges between legacy systems and
                    blockchain innovation. Regulatory engagement ensures
                    compliance with evolving legal frameworks across multiple
                    jurisdictions. Fiat on-ramps enable smooth capital flows for
                    institutional entry.
                  </p>
                </div>

                {/* Strategic Roadmap */}
                <div
                  ref={(el) => {
                    sectionRefs.current.roadmap = el;
                  }}
                  className={sectionClass("roadmap")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Strategic Roadmap
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <div className="space-y-6">
                    {[
                      {
                        year: "2026",
                        title: "Community Gain Phase",
                        items: [
                          "Community building and awareness campaigns",
                          "Platform development and smart contract deployment",
                          "Smart contract security audits",
                          "Whitepaper and technical documentation release",
                          "Initial user onboarding and community formation",
                          "G-MAN Intelligence beta launch for early users",
                        ],
                      },
                      {
                        year: "2027",
                        title: "RBS Presale",
                        items: [
                          "Q1 2027: Presale opens for 20,000 RBS allocation",
                          "Presale whitelist and KYC process",
                          "Tiered presale pricing structure",
                          "Initial DEX listing with 40,000 RBS liquidity",
                          "Governance system activation",
                          "Staking program launch",
                        ],
                      },
                      {
                        year: "2028",
                        title: "Big Year — Major Collaborations",
                        items: [
                          "Strategic partnerships with major exchanges and DeFi protocols",
                          "Cross-chain bridge deployments",
                          "Institutional custody solution launch",
                          "Developer grants program ($500K+ in RBS)",
                          "Advanced trading tools and API platform",
                          "Multiple CEX listings for broader accessibility",
                        ],
                      },
                      {
                        year: "2029",
                        title: "Airdrop Registration & Distribution",
                        items: [
                          "Q1 2029: Airdrop distribution of 7,000 RBS",
                          "Eligibility snapshot of long-term holders",
                          "Enterprise API platform launch",
                          "Global expansion to new markets",
                          "Layer 2 scaling solutions integration",
                          "Decentralized insurance protocol partnerships",
                        ],
                      },
                      {
                        year: "2030",
                        title: "Full Mainnet Launch",
                        items: [
                          "Full mainnet launch with all liquidity deployed",
                          "Complete DeFi ecosystem activation",
                          "All trading tools and calculators live",
                          "Full governance decentralization achieved",
                          "Continued innovation and new financial primitives",
                          "Always stay SUPERIOR — long-term ecosystem flourishing",
                        ],
                      },
                    ].map((phase) => (
                      <div
                        key={phase.year}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gold/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-3 w-3 rounded-full bg-gold animate-pulse" />
                          <h3 className="text-2xl font-poppins text-gold font-bold">
                            {phase.year} — {phase.title}
                          </h3>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {phase.items.map((item) => (
                            <li
                              key={item}
                              className="metallic-text-secondary font-inter text-sm flex items-start gap-2"
                            >
                              <span className="text-gold mt-1 text-xs">▸</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Stack */}
                <div
                  ref={(el) => {
                    sectionRefs.current.technical = el;
                  }}
                  className={sectionClass("technical")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Technical Stack
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Built on the BNB Smart Chain (BNB Chain), RBS leverages
                    cutting-edge blockchain infrastructure for unparalleled
                    performance. BNB Chain provides web-speed transactions,
                    infinite scalability, and native integration with web
                    technologies — making it ideal for a consumer-facing DeFi
                    platform.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Smart contracts are written in Motoko, ensuring type safety,
                    formal verification capabilities, and seamless integration
                    with the actor model. This approach eliminates entire
                    classes of vulnerabilities common in EVM-based platforms
                    like reentrancy and integer overflow.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The frontend architecture utilizes React 19 with TypeScript
                    for type-safe development. Real-time data is sourced from
                    public APIs including Binance (price/kline data), CoinGecko
                    (market data), and metals price feeds. All external data
                    sources are verified and cross-referenced for accuracy.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                    Infrastructure monitoring and observability tools provide
                    real-time insights into system health. Automated alerting
                    enables rapid response to anomalies. Comprehensive logging
                    facilitates debugging and maintains complete audit trails
                    for all protocol actions.
                  </p>
                </div>

                {/* BNB Chain Architecture */}
                <div
                  ref={(el) => {
                    sectionRefs.current["bnb-architecture"] = el;
                  }}
                  className={sectionClass("bnb-architecture")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Network className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      BNB Chain Smart Contract Architecture
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS token is deployed as a BEP-20 compliant smart
                    contract on the BNB Smart Chain, one of the world's
                    highest-throughput public blockchains. The BEP-20 standard
                    represents a superset of the widely adopted ERC-20
                    specification, providing full compatibility with the broader
                    DeFi ecosystem while benefiting from BNB Chain's superior
                    transaction throughput, sub-second finality, and negligible
                    gas fees compared to Ethereum mainnet. This architectural
                    choice was deliberate: it places RBS directly within the
                    largest retail-facing DeFi ecosystem in the world, ensuring
                    maximum accessibility for token holders across every major
                    exchange and wallet provider.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS contract enforces an absolutely fixed total supply
                    of 100,000 tokens at the bytecode level. There is no mint
                    function, no inflation mechanism, and no administrative
                    backdoor that could increase the circulating supply at any
                    future date. This immutability is not a governance parameter
                    — it is hard-coded into the contract's constructor and
                    cannot be overridden by any entity, including the founding
                    team. The contract's source code has been verified on
                    BscScan, allowing any independent party to audit the logic
                    at any time without requiring trust in the development
                    team's assertions.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Administrative functions, including the ability to designate
                    burn addresses and adjust liquidity parameters, are
                    protected by a multi-signature wallet structure requiring
                    approval from a minimum of three out of five authorized
                    signatories. This arrangement prevents any single actor —
                    including any founding team member — from unilaterally
                    executing administrative operations that could affect token
                    holders. All multi-sig wallet addresses are published
                    publicly, enabling the community to monitor all proposed and
                    executed transactions in real time.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Time-locked upgrade mechanisms provide an additional layer
                    of protection. Any proposed change to contract parameters is
                    subject to a mandatory delay period before execution, giving
                    token holders and the community sufficient time to review,
                    debate, and contest changes that conflict with the
                    protocol's stated principles. This governance delay acts as
                    a circuit breaker against rushed or malicious upgrades,
                    ensuring that the long-term integrity of the RBS contract is
                    protected even as the ecosystem evolves.
                  </p>
                </div>

                {/* Token Distribution Deep Dive */}
                <div
                  ref={(el) => {
                    sectionRefs.current["token-distribution"] = el;
                  }}
                  className={sectionClass("token-distribution")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart2 className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Token Distribution Deep Dive
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS distribution model was designed to balance three
                    competing priorities: long-term ecosystem sustainability,
                    fair community access, and responsible team incentive
                    alignment. After extensive review of comparable token
                    launches and post-mortem analyses of failed projects, the
                    founding team concluded that concentrating too much supply
                    in team or investor wallets was the single most common cause
                    of early price collapse and community erosion. Accordingly,
                    the RBS distribution deliberately minimizes insiders' share
                    and maximizes community-facing allocations.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Community Rewards receive the largest allocation at 35,000
                    RBS (35%), distributed over a rolling five-year schedule to
                    reward staking participants, governance voters, and
                    ecosystem contributors. Ecosystem Development receives
                    25,000 RBS (25%) to fund protocol integrations, developer
                    grants, partnership programs, and marketing initiatives. The
                    Founding Team allocation stands at 15,000 RBS (15%), subject
                    to a twelve-month cliff and a subsequent twenty-four-month
                    linear vesting schedule — meaning no team tokens are liquid
                    until one full year after the mainnet launch, and complete
                    vesting requires three years of continued contribution.
                    Liquidity Pool seeding receives 15,000 RBS (15%) to ensure
                    deep, stable trading liquidity from day one. The remaining
                    10,000 RBS (10%) constitutes the Strategic Burns reserve,
                    allocated for periodic deflationary burn events according to
                    a predetermined schedule published in the roadmap.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Cliff periods are enforced at the contract level, not merely
                    as social commitments. The vesting smart contract holds all
                    team and ecosystem allocations in escrow and releases them
                    according to a time-based schedule that cannot be
                    accelerated. Emergency unlock provisions are deliberately
                    absent, as the founding team believes that the credibility
                    of a vesting commitment is only meaningful when it cannot be
                    revoked. This structure aligns team incentives with the
                    long-term health of the token over a multi-year horizon.
                  </p>
                </div>

                {/* Price Discovery & Market Mechanics */}
                <div
                  ref={(el) => {
                    sectionRefs.current["price-mechanics"] = el;
                  }}
                  className={sectionClass("price-mechanics")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Price Discovery & Market Mechanics
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS will establish its initial listing price through a
                    presale process scheduled for Q1 2027. The presale price is
                    determined by a combination of comparable token valuations
                    at comparable supply levels, the fundamental utility value
                    of the ecosystem at launch, and the capital requirements for
                    sustainable liquidity pool seeding. The founding team will
                    publish a detailed price derivation document prior to the
                    presale opening, providing full transparency into the
                    methodology and assumptions underlying the initial
                    valuation.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Upon listing, RBS will utilize PancakeSwap V3 as its primary
                    decentralized exchange, leveraging the Automated Market
                    Maker model for continuous price discovery. AMM mechanics
                    ensure that a buyer or seller can always find a counterparty
                    at a fair price determined by the constant product formula,
                    without relying on a traditional order book that could be
                    thin or manipulated. The liquidity pool will be seeded with
                    the full 15,000 RBS liquidity allocation alongside a
                    proportional BNB reserve, establishing sufficient depth to
                    absorb early trading volume without excessive slippage.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Anti-dump provisions form a critical component of the RBS
                    market structure. Large sell orders from presale
                    participants are subject to graduated time-lock conditions
                    that stagger potential selling pressure across a defined
                    window following the initial listing. This mechanism does
                    not prevent holders from exiting positions but ensures that
                    large volumes cannot be deposited and immediately dumped in
                    a manner that would harm the broader community of retail
                    purchasers. The specific parameters of these provisions will
                    be published alongside the presale terms and incorporated
                    into the vesting contract.
                  </p>
                </div>

                {/* Governance & DAO Structure */}
                <div
                  ref={(el) => {
                    sectionRefs.current["dao-structure"] = el;
                  }}
                  className={sectionClass("dao-structure")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Governance & DAO Structure
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS governance model transitions from a
                    founding-team-led structure to a full decentralized
                    autonomous organization over a three-phase timeline. During
                    the first phase, covering the period from token launch
                    through the first community governance vote, core protocol
                    parameters are managed by the founding multi-sig council.
                    This transitional period allows time for the community to
                    grow to a size sufficient for meaningful on-chain
                    participation without the risk of governance attacks from
                    small but coordinated voter blocs.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Proposal submission requires a minimum holding of 500 RBS to
                    prevent spam and ensure that only stakeholders with genuine
                    economic alignment can initiate governance actions. Each
                    proposal enters a three-day discussion period followed by a
                    seven-day on-chain voting window. Quorum is set at 10% of
                    circulating supply, a threshold calibrated to be achievable
                    by an engaged community while protecting against low-turnout
                    governance capture. Proposals reaching quorum and majority
                    approval are automatically queued for execution after a
                    mandatory 48-hour time lock, providing a final window for
                    the community to raise objections or for the security
                    council to veto clearly malicious actions.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Treasury management operates through a community-controlled
                    multi-sig wallet funded by protocol fees and ecosystem
                    development allocations. Spending proposals above defined
                    thresholds require full governance approval, while routine
                    operational expenses below those thresholds can be
                    authorized by the multi-sig council. All treasury
                    transactions are published on-chain and accompanied by
                    detailed spending justifications to maintain community
                    accountability. Quarterly treasury reports are published in
                    the developer blog section of the RBS platform.
                  </p>
                </div>

                {/* Staking Architecture */}
                <div
                  ref={(el) => {
                    sectionRefs.current["staking-arch"] = el;
                  }}
                  className={sectionClass("staking-arch")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Staking Architecture
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS staking system provides four duration-tiered pools
                    designed to reward long-term commitment while maintaining
                    sufficient flexibility for participants with varying
                    liquidity needs. The thirty-day pool offers a base APY
                    appropriate for short-term liquidity providers, while the
                    ninety-day, one-hundred-eighty-day, and
                    three-hundred-sixty-five-day pools provide progressively
                    higher APY rates that reflect the genuine economic value of
                    committing liquidity over longer horizons. The exact APY
                    figures for each pool are published in the staking
                    calculator and updated quarterly based on
                    governance-approved parameters.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Reward distribution is calculated on a per-block basis using
                    a weighted proportional system. A staker's share of rewards
                    for any given block equals their staked balance divided by
                    the total staked balance across all participants in that
                    pool tier. This mechanism ensures that rewards scale
                    linearly with contribution and that no participant receives
                    disproportionate rewards by virtue of timing their entry.
                    The reward pool is funded from the 35,000 RBS Community
                    Rewards allocation, providing several years of sustain at
                    projected staking participation rates.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Compounding mechanics allow stakers to automatically
                    reinvest earned rewards into their staking position without
                    claiming and re-depositing manually. Auto-compound
                    transactions are executed by a keeper bot at regular
                    intervals, and the associated gas costs are covered from the
                    protocol treasury as an incentive for long-term staking
                    participation. Early exit from a locked staking pool
                    triggers a graduated penalty that declines linearly as the
                    lock period approaches completion, ensuring that exit
                    penalties are proportional to the unexpired commitment
                    rather than a flat fee that would be unusually punitive for
                    late-stage withdrawals.
                  </p>
                </div>

                {/* Security Framework */}
                <div
                  ref={(el) => {
                    sectionRefs.current["security-framework"] = el;
                  }}
                  className={sectionClass("security-framework")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Security Framework
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Smart contract security is treated as a first-order concern
                    throughout the RBS development process, not an afterthought
                    addressed at the end of the development cycle. The core RBS
                    contract and all associated staking, vesting, and governance
                    contracts undergo a minimum of two independent security
                    audits by firms with demonstrated expertise in BEP-20
                    contract security prior to mainnet deployment. Audit reports
                    are published in full on the RBS website and on-chain,
                    including any identified issues and the fixes applied.
                    Contracts with unresolved high-severity findings are not
                    deployed under any circumstances.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    A public bug bounty program provides ongoing financial
                    incentives for independent security researchers to identify
                    and responsibly disclose vulnerabilities. Bounties are
                    tiered by severity, with critical vulnerabilities qualifying
                    for awards commensurate with the potential impact of
                    exploitation. The bounty program operates through a
                    dedicated platform that ensures clear communication channels
                    and guaranteed payment for valid submissions. All disclosed
                    vulnerabilities are triaged, remediated, and disclosed
                    publicly once fixes are deployed, maintaining a complete
                    public record of the protocol's security evolution.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Emergency pause functionality is built into all RBS smart
                    contracts, allowing the multi-sig council to temporarily
                    halt protocol operations in the event of a detected exploit
                    or critical vulnerability. This functionality is designed
                    with narrow scope — it can halt token transfers and staking
                    operations but cannot move or redirect user funds. An
                    insurance fund equivalent to a defined percentage of the
                    treasury is maintained in stablecoins to provide coverage
                    against losses resulting from smart contract failures,
                    providing token holders with an additional layer of
                    financial protection beyond the technical security measures.
                  </p>
                </div>

                {/* Regulatory Considerations */}
                <div
                  ref={(el) => {
                    sectionRefs.current.regulatory = el;
                  }}
                  className={sectionClass("regulatory")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Regulatory Considerations
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The RBS team has conducted a good-faith analysis of the
                    token's classification under applicable frameworks, with
                    primary focus on jurisdictions where the community has the
                    largest concentration of participants. The token is designed
                    to function as a utility token within the RBS ecosystem,
                    providing governance rights, staking rewards, and access to
                    premium platform features. It is not structured as a
                    security, does not carry promises of profit derived from the
                    efforts of others in the manner contemplated by the Howey
                    test, and does not represent ownership in any legal entity.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The presale process will incorporate KYC and AML screening
                    procedures appropriate for the jurisdictions of
                    participating buyers. Participants from jurisdictions with
                    explicit prohibitions on participation in digital asset
                    sales, including the United States, will be restricted from
                    the presale process. These restrictions are implemented both
                    at the smart contract level and through the presale platform
                    interface, with geolocation and identity verification
                    serving as complementary enforcement mechanisms.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    This whitepaper does not constitute legal advice, financial
                    advice, or an offer or solicitation to buy or sell
                    securities in any jurisdiction. Potential participants
                    should consult their own legal and financial advisors to
                    understand the implications of participation under the laws
                    of their applicable jurisdictions. The regulatory landscape
                    for digital assets continues to evolve rapidly, and the RBS
                    team is committed to maintaining dialogue with legal counsel
                    and adapting compliance procedures as the regulatory
                    environment develops.
                  </p>
                </div>

                {/* Market Intelligence Platform */}
                <div
                  ref={(el) => {
                    sectionRefs.current["market-intel-platform"] = el;
                  }}
                  className={sectionClass("market-intel-platform")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Market Intelligence Platform
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The G-Man Intelligence platform represents one of the most
                    distinctive utility components of the RBS ecosystem. It
                    provides RBS token holders with access to professional-grade
                    trading signal generation that would typically require
                    expensive subscriptions to institutional data providers. The
                    signal engine operates across multiple asset classes
                    including the top ten cryptocurrency pairs by market
                    capitalization, the ten most actively traded forex pairs,
                    and precious metals including gold and silver, providing
                    genuine cross-market intelligence rather than narrow
                    crypto-centric analysis.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The signal methodology is built on a weighted composite of
                    nine technical indicators computed from live Binance API
                    data. These indicators include RSI with Wilder smoothing,
                    MACD with standard parameter settings, EMA crossover
                    analysis using the 9 and 21-period pair, SMA crossover using
                    the 20 and 50-period pair, Bollinger Band position analysis,
                    volume ratio against a 20-period moving average, ATR for
                    volatility quantification, ten-period momentum, and
                    dynamically computed support and resistance levels derived
                    from local price extrema. Each indicator is assigned a
                    weight in the composite scoring function based on its
                    historically demonstrated reliability across the relevant
                    asset class.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Google Gemini AI augments the technical signal with natural
                    language interpretation and contextual market awareness.
                    After the quantitative indicators produce a raw signal
                    score, the Gemini integration performs a second-pass
                    analysis that incorporates broader market context,
                    interprets the combined weight of the indicator evidence,
                    and produces a human-readable signal narrative alongside the
                    numeric output. When the AI enhancement is active, signal
                    cards are marked with the AI Enhanced badge and include a
                    one-sentence insight that explains the primary driver of the
                    signal recommendation. The combined quantitative and
                    qualitative output consistently outperforms either component
                    in isolation across backtested scenarios.
                  </p>
                </div>

                {/* Risk Factors */}
                <div
                  ref={(el) => {
                    sectionRefs.current["risk-factors"] = el;
                  }}
                  className={sectionClass("risk-factors")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Risk Factors
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Market risk is inherent in any digital asset and RBS is not
                    exempt from this reality. The price of RBS tokens will
                    fluctuate based on supply and demand dynamics, broader
                    cryptocurrency market sentiment, macroeconomic conditions,
                    and factors specific to the RBS ecosystem. Potential
                    participants should only commit capital that they are
                    prepared to lose in its entirety. The deflationary mechanics
                    and utility design of RBS are intended to support long-term
                    value, but no mechanism can guarantee price appreciation or
                    protect against losses in a declining market environment.
                    Historical performance of comparable tokens is not a
                    reliable predictor of future RBS price performance.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Smart contract risk remains present despite the
                    comprehensive audit and security program described in this
                    whitepaper. No audit process can guarantee the absence of
                    all vulnerabilities, and the complexity of interacting with
                    other DeFi protocols introduces additional attack surface
                    that is difficult to fully enumerate in advance. The
                    insurance fund provides partial coverage but may not be
                    sufficient to make all affected parties whole in the event
                    of a significant exploit. Participants should assess their
                    individual risk tolerance in light of these inherent
                    limitations.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Regulatory risk has grown significantly across the digital
                    asset industry and has the potential to materially affect
                    the RBS ecosystem, including the availability of the
                    presale, the ability to list on centralized exchanges in
                    certain jurisdictions, and the legal status of staking
                    rewards in various tax regimes. Changes in applicable law
                    could require modifications to the platform, restrict
                    participation by certain users, or in extreme cases require
                    the wind-down of certain ecosystem features. The founding
                    team is committed to proactive regulatory engagement but
                    cannot guarantee that future legal developments will not
                    adversely affect token holders. Liquidity risk, team risk,
                    and execution risk round out the primary risk categories,
                    each addressed in detail in the full risk disclosure
                    document available on the RBS website.
                  </p>
                </div>

                {/* Conclusion */}
                <div
                  ref={(el) => {
                    sectionRefs.current.conclusion = el;
                  }}
                  className={sectionClass("conclusion")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-7 w-7 text-gold" />
                    <h2 className="text-4xl font-poppins font-bold text-gold tracking-tight">
                      Conclusion
                    </h2>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent mb-8 rounded-full" />
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    RBS Official represents the convergence of institutional
                    finance and decentralized technology. Through a fixed supply
                    of 100,000 tokens, innovative deflationary mechanics,
                    multi-utility design, and unwavering commitment to security,
                    we are building infrastructure that will power the next
                    generation of financial services.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    The tokenomics are designed for long-term value: extreme
                    scarcity (100K cap), progressive deflation (15K burn
                    reserve), real utility (6 proven use cases), and aligned
                    incentives (vesting schedules for all stakeholders).
                    Combined with the G-MAN Intelligence platform, developer
                    ecosystem, and community governance, RBS is positioned for
                    sustained growth.
                  </p>
                  <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                    Our vision extends beyond simple token creation. We are
                    establishing a comprehensive ecosystem where professional
                    investors and traders can access institutional-quality
                    tools, participate in meaningful governance, and benefit
                    from a deflationary asset with real utility. The 2030 full
                    mainnet launch marks the culmination of this vision.
                  </p>
                  <div className="bg-gold/5 border border-gold/30 rounded-xl p-6 text-center">
                    <p className="text-gold font-poppins leading-relaxed text-2xl font-bold">
                      Join us in building the future of finance.
                    </p>
                    <p className="text-gold/70 font-inter mt-2 text-lg">
                      Return. Be Superior. — Always stay SUPERIOR.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
