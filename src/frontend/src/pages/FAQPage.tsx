import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is RBS and what makes it unique?",
      answer:
        "RBS (Return. Be Superior.) is a professional crypto token project built on cutting-edge neural mesh technology. Our unique deflationary tokenomics, fixed supply of 100,000 tokens, and community-driven governance model set us apart. We combine enterprise-level security with true decentralization and fair community governance.",
    },
    {
      question: "How does the community governance work?",
      answer:
        "RBS is a fairly community-driven token where all major decisions are made through community voting. All opinions about RBS will be taken from the RBS community to make it fair and transparent. Token holders can propose and vote on protocol changes, treasury allocations, partnership decisions, and strategic initiatives. Every voice matters in shaping the future of RBS.",
    },
    {
      question: "What is the total supply and tokenomics structure?",
      answer:
        "RBS has a fixed total supply of 100,000 tokens with a deflationary model. Distribution: 40% Liquidity, 20% Presale, 15% Burn, 10% Team, 8% Community Rewards, and 7% Airdrop. Regular burn events reduce circulating supply, creating scarcity and supporting long-term value growth.",
    },
    {
      question: "When will the token officially launch?",
      answer:
        "According to our roadmap, the official token launch with CEX/DEX liquidity is planned for 2030. Before that, we focus on community growth (2026), presale launch (2027), ecosystem collaborations (2028), and airdrop distribution (2029).",
    },
    {
      question: "How can I participate in the presale or airdrop?",
      answer:
        "Visit our Acquisition Portal to register for either the presale or airdrop. The presale form unlocks automatically on January 1, 2027, and the airdrop form unlocks on January 1, 2029. Once unlocked, complete the registration form with your details, and you'll be redirected to WhatsApp for final confirmation.",
    },
    {
      question: "What is the Neural Mesh technology?",
      answer:
        "Neural Mesh is our proprietary consensus mechanism that enables sub-second transaction finality while maintaining true decentralization. It uses a distributed node network spanning multiple continents to ensure 99.99% uptime, no single point of failure, and institutional-grade scalability.",
    },
    {
      question: "What are the benefits of holding RBS tokens?",
      answer:
        "RBS token holders enjoy multiple benefits including governance rights to vote on protocol decisions, staking rewards from the community rewards pool, access to premium ecosystem features, reduced fees on platform services, and participation in exclusive community events. The deflationary model also supports long-term value appreciation.",
    },
    {
      question: "How secure is the RBS platform?",
      answer:
        "RBS employs military-grade encryption, multi-layer security protocols, and regular security audits. Our neural mesh technology ensures no single point of failure, and all smart contracts undergo rigorous testing before deployment. We prioritize security at every level of our infrastructure.",
    },
    {
      question: "Can I stake my RBS tokens?",
      answer:
        "Yes, staking functionality will be available after the official token launch in 2030. Token holders will be able to stake their RBS to earn rewards from the 8% community rewards allocation. Detailed staking mechanics and reward structures will be announced closer to launch.",
    },
    {
      question: "How can I stay updated on RBS developments?",
      answer:
        "Join our official Telegram channel (t.me/Rsuperior) and WhatsApp channel for real-time updates. Follow our Community Updates section on the homepage for major announcements, and check our Roadmap page for milestone progress. We regularly engage with our community through AMAs and educational content.",
    },
    {
      question: "What makes RBS different from other crypto tokens?",
      answer:
        "RBS stands out through its combination of institutional-grade technology, true community governance, fixed supply with deflationary mechanics, and professional positioning. Unlike many tokens, we prioritize long-term sustainability over short-term hype, with a clear roadmap extending to 2031 and beyond.",
    },
    {
      question: "Will RBS be listed on major exchanges?",
      answer:
        "Yes, our roadmap includes listings on both centralized (CEX) and decentralized (DEX) exchanges in 2030. We are actively building relationships with major exchange platforms and will announce specific listings as partnerships are finalized. 40% of our total supply is allocated to ensure deep liquidity.",
    },
    {
      question: "What is the deflationary model and how does it work?",
      answer:
        "RBS implements a deflationary model through regular token burns from the 15% burn allocation. As tokens are burned, the circulating supply decreases, creating scarcity. This mechanism is designed to support long-term value appreciation for holders while maintaining a healthy ecosystem balance.",
    },
    {
      question: "How does the G-MAN Oracle Intelligence work?",
      answer:
        "The G-MAN Oracle Intelligence is our advanced market analysis tool that processes real-time data from multiple sources including Chainlink Price Feeds, Mesh Node Consensus, and On-Chain Analytics. It generates trading signals with confidence levels and provides transparent grounding evidence for all recommendations.",
    },
    {
      question: "What are the team allocation vesting terms?",
      answer:
        "The 10% team allocation follows a strict vesting schedule to ensure long-term commitment and alignment with community interests. Detailed vesting terms will be published in our tokenomics documentation, with gradual releases over multiple years to prevent market impact.",
    },
    {
      question: "How can I propose changes to the protocol?",
      answer:
        "Token holders meeting the minimum threshold can submit proposals through our governance portal. Proposals undergo a 7-day discussion period where the community can provide feedback before voting begins. All proposals and votes are recorded on-chain for complete transparency.",
    },
    {
      question: "What partnerships is RBS pursuing?",
      answer:
        "We are actively pursuing partnerships with leading blockchain projects, DeFi protocols, institutional partners, and payment systems. Our focus is on strategic collaborations that expand RBS utility and adoption. Major partnership announcements will be made through official channels as they are finalized.",
    },
    {
      question:
        "Is there a minimum holding requirement for governance participation?",
      answer:
        "While all token holders can vote on proposals, there is a minimum threshold for submitting new proposals to prevent spam. This threshold ensures that proposal creators have meaningful stake in the ecosystem. Delegation options are available for passive holders who want their tokens to participate in governance.",
    },
    {
      question: "What security audits has RBS undergone?",
      answer:
        "RBS smart contracts undergo rigorous security audits by leading blockchain security firms. We conduct regular audits throughout development and before major releases. Audit reports are published for community review, demonstrating our commitment to transparency and security.",
    },
    {
      question: "How does RBS ensure regulatory compliance?",
      answer:
        "RBS is designed with regulatory compliance in mind, working with legal advisors to ensure adherence to applicable regulations. We maintain transparency in our operations and are committed to evolving with the regulatory landscape while protecting community interests.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <HelpCircle className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 tracking-tight leading-tight metallic-text-hero">
              Frequently Asked Questions
            </h1>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed">
              Everything you need to know about RBS crypto token
            </p>
          </div>

          <div className="space-y-4 animate-fade-in-up animation-delay-200">
            {faqs.map((faq, index) => (
              <Collapsible
                key={faq.question ?? index}
                open={openFaq === index}
                onOpenChange={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
              >
                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden hover:border-gold/30 transition-all duration-300 glow-border">
                  <CollapsibleTrigger className="w-full p-8 flex items-center justify-between text-left group">
                    <h3 className="text-xl font-poppins font-bold text-gold group-hover:text-gold/90 transition-colors pr-4 tracking-tight">
                      {faq.question}
                    </h3>
                    {openFaq === index ? (
                      <ChevronUp className="h-6 w-6 text-gold flex-shrink-0 transition-transform" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gold flex-shrink-0 transition-transform" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="faq-content">
                    <div className="px-8 pb-8 pt-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-6" />
                      <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>

          <div className="mt-12 text-center animate-fade-in-up animation-delay-400">
            <div className="bg-white border border-gray-200 shadow-sm-gold p-10 glow-border">
              <h3 className="text-3xl font-poppins font-bold text-gold mb-6 tracking-tight">
                Still have questions?
              </h3>
              <p className="metallic-text-secondary font-inter mb-8 text-lg leading-relaxed">
                Our team is here to help. Reach out through our official
                channels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://t.me/Rsuperior"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gold hover:bg-gold/90 text-black font-poppins font-bold rounded-lg transition-colors metallic-button text-lg"
                >
                  Join Telegram
                </a>
                <a
                  href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white border-2 border-gold/30 hover:border-gold text-gold font-poppins font-bold rounded-lg transition-colors text-lg"
                >
                  Join WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
