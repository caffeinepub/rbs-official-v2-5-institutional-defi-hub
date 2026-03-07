import {
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";

export default function CommunityGovernancePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <Vote className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 tracking-tight leading-tight metallic-text-hero">
              Community Governance
            </h1>
            <p className="text-2xl md:text-3xl text-gold font-poppins font-semibold mb-6 leading-relaxed shimmer-gold">
              All opinions about RBS are community-driven
            </p>
            <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
              True decentralized governance where every token holder has a voice
              in shaping the future of RBS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fade-in-up animation-delay-200">
            <div className="bg-white border border-gray-200 shadow-sm-gold p-10 glow-border hover-lift soft-glow">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <FileText className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-3xl font-poppins font-bold text-gold tracking-tight">
                  Proposal System
                </h3>
              </div>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                Token holders can submit proposals for protocol changes,
                treasury allocations, partnership decisions, and strategic
                initiatives. Each proposal undergoes community review before
                voting.
              </p>
              <ul className="space-y-3 metallic-text-secondary font-inter">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>Minimum token threshold for proposal submission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>7-day discussion period before voting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>Transparent on-chain voting mechanism</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>Community feedback integration process</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm-gold p-10 glow-border hover-lift soft-glow">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <CheckCircle className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-3xl font-poppins font-bold text-gold tracking-tight">
                  Voting Power
                </h3>
              </div>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-6 text-lg">
                Voting power is proportional to token holdings, ensuring fair
                representation. All votes are recorded on-chain for complete
                transparency and accountability.
              </p>
              <ul className="space-y-3 metallic-text-secondary font-inter">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>One token equals one vote</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>Quorum requirements for proposal passage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>Delegation options for passive holders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1 text-xl">•</span>
                  <span>Real-time vote tracking and results</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm p-10 md:p-12 mb-12 animate-fade-in-up animation-delay-400 glow-border">
            <h2 className="text-4xl font-poppins font-bold text-gold mb-10 text-center tracking-tight">
              Governance Structure
            </h2>
            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <span className="text-gold font-poppins font-bold text-xl">
                      1
                    </span>
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-gold tracking-tight">
                    Proposal Submission
                  </h3>
                </div>
                <p className="metallic-text-secondary font-inter leading-relaxed ml-16 text-lg">
                  Token holders meeting the minimum threshold submit detailed
                  proposals through the governance portal. Proposals must
                  include clear objectives, implementation plans, and expected
                  outcomes.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <span className="text-gold font-poppins font-bold text-xl">
                      2
                    </span>
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-gold tracking-tight">
                    Community Discussion
                  </h3>
                </div>
                <p className="metallic-text-secondary font-inter leading-relaxed ml-16 text-lg">
                  A 7-day discussion period allows community members to review,
                  ask questions, and provide feedback. Proposal creators can
                  refine their submissions based on community input.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <span className="text-gold font-poppins font-bold text-xl">
                      3
                    </span>
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-gold tracking-tight">
                    Voting Period
                  </h3>
                </div>
                <p className="metallic-text-secondary font-inter leading-relaxed ml-16 text-lg">
                  After the discussion period, voting opens for 5 days. Token
                  holders cast their votes on-chain, with results visible in
                  real-time. Quorum requirements must be met for proposals to
                  pass.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <span className="text-gold font-poppins font-bold text-xl">
                      4
                    </span>
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-gold tracking-tight">
                    Implementation
                  </h3>
                </div>
                <p className="metallic-text-secondary font-inter leading-relaxed ml-16 text-lg">
                  Approved proposals are implemented by the development team
                  with full transparency. Progress updates are shared with the
                  community, and implementation timelines are clearly
                  communicated.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-600">
            <div className="bg-white border border-gray-200 shadow-sm p-8 glow-border hover-lift">
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <Users className="h-8 w-8 text-gold" />
                </div>
              </div>
              <h3 className="text-2xl font-poppins font-bold text-gold mb-4 text-center tracking-tight">
                Community First
              </h3>
              <p className="metallic-text-secondary font-inter text-center leading-relaxed text-lg">
                Every decision prioritizes community interests and long-term
                ecosystem health over short-term gains.
              </p>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm p-8 glow-border hover-lift">
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <Clock className="h-8 w-8 text-gold" />
                </div>
              </div>
              <h3 className="text-2xl font-poppins font-bold text-gold mb-4 text-center tracking-tight">
                Transparent Process
              </h3>
              <p className="metallic-text-secondary font-inter text-center leading-relaxed text-lg">
                All governance activities are recorded on-chain with full
                transparency and public accessibility.
              </p>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm p-8 glow-border hover-lift">
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                  <TrendingUp className="h-8 w-8 text-gold" />
                </div>
              </div>
              <h3 className="text-2xl font-poppins font-bold text-gold mb-4 text-center tracking-tight">
                Continuous Evolution
              </h3>
              <p className="metallic-text-secondary font-inter text-center leading-relaxed text-lg">
                Governance mechanisms evolve based on community feedback and
                emerging best practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
