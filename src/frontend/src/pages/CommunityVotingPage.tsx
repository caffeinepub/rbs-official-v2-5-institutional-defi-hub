import { PageHead } from '@/components/PageHead';
import { PageShell } from '@/components/PageShell';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { Vote, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

/**
 * Community voting page with complete content explaining the upcoming voting
 * system, how users can participate, and what features are planned.
 */
export default function CommunityVotingPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHead
        title="Community Voting"
        description="Participate in RBS community governance through decentralized voting on proposals and protocol decisions."
      />
      <PageShell>
        <SmokySectionTransition>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8 animate-fade-in-up">
              <Vote className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold metallic-text-hero mb-8 animate-fade-in-up animation-delay-100 leading-tight">
              Community Voting
            </h1>
            <p className="text-xl metallic-text-secondary font-inter leading-relaxed animate-fade-in-up animation-delay-200">
              Decentralized governance platform coming soon. Shape the future of RBS through community-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up animation-delay-300">
            <div className="glass-card-gold p-8 glow-border">
              <Calendar className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Scheduled Proposals</h3>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                Vote on upcoming protocol upgrades, feature implementations, and strategic partnerships.
              </p>
              <ul className="space-y-2 metallic-text-secondary font-inter text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Quarterly governance proposals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Emergency protocol decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Treasury allocation votes</span>
                </li>
              </ul>
            </div>

            <div className="glass-card-gold p-8 glow-border">
              <Users className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Voting Power</h3>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                Your voting power is determined by your RBS token holdings and staking duration.
              </p>
              <ul className="space-y-2 metallic-text-secondary font-inter text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>1 RBS = 1 vote (base power)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Staking multiplier up to 2x</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Delegation to trusted voters</span>
                </li>
              </ul>
            </div>

            <div className="glass-card-gold p-8 glow-border">
              <TrendingUp className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Proposal Process</h3>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                Community members can submit proposals that meet minimum threshold requirements.
              </p>
              <ul className="space-y-2 metallic-text-secondary font-inter text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Minimum 1000 RBS to propose</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>7-day discussion period</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>3-day voting window</span>
                </li>
              </ul>
            </div>

            <div className="glass-card-gold p-8 glow-border">
              <Vote className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">How to Participate</h3>
              <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                Connect your wallet and start voting on active proposals to shape RBS's future.
              </p>
              <ul className="space-y-2 metallic-text-secondary font-inter text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Connect wallet with RBS tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Review proposal details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Cast your vote on-chain</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center glass-card-gold p-12 animate-fade-in-up animation-delay-400">
            <h3 className="text-3xl font-poppins font-bold metallic-text mb-4">
              Voting Platform Launching Soon
            </h3>
            <p className="text-lg metallic-text-secondary font-inter mb-8 max-w-2xl mx-auto leading-relaxed">
              Our decentralized voting platform is currently in development. Join our community to stay updated on the launch date.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate({ to: '/community-governance' })}
                size="lg"
                className="bg-gradient-to-r from-gold-matte to-gold-light hover:from-gold-light hover:to-gold-matte text-dark-matter font-poppins font-bold"
              >
                Learn About Governance
              </Button>
              <Button
                onClick={() => navigate({ to: '/contact' })}
                size="lg"
                variant="outline"
                className="border-2 border-gold-matte text-gold-matte hover:bg-gold-matte/10 font-poppins font-bold"
              >
                Get Notified
              </Button>
            </div>
          </div>
        </SmokySectionTransition>
      </PageShell>
    </>
  );
}
