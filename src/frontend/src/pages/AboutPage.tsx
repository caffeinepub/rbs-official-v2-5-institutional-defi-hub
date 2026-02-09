import { Shield, Zap, Globe, Lock, Network, TrendingUp, TrendingDown, Users, Target } from 'lucide-react';
import { PageHead } from '@/components/PageHead';
import { PageShell } from '@/components/PageShell';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';

export default function AboutPage() {
  return (
    <>
      <PageHead title="About RBS" description="Learn about RBS mission, vision, and core values" />
      <PageShell maxWidth="2xl">
        <SmokySectionTransition>
          <div className="text-center mb-16">
            <h1 className="section-heading mb-6">About RBS</h1>
            <p className="section-description">
              Building the future of decentralized finance with community-driven innovation
            </p>
          </div>
        </SmokySectionTransition>

        <SmokySectionTransition delay={200}>
          <section className="mb-20">
            <h2 className="text-3xl font-poppins font-bold metallic-text mb-8 text-center">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="core-value-card">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                    <Shield className="h-10 w-10 text-gold" />
                  </div>
                </div>
                <h3 className="text-xl font-poppins font-bold metallic-text mb-3 text-center">Security First</h3>
                <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                  Enterprise-grade security protecting your digital assets with military-grade encryption.
                </p>
              </div>

              <div className="core-value-card">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                    <Users className="h-10 w-10 text-gold" />
                  </div>
                </div>
                <h3 className="text-xl font-poppins font-bold metallic-text mb-3 text-center">Community Driven</h3>
                <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                  Every decision shaped by our community through transparent governance.
                </p>
              </div>

              <div className="core-value-card">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                    <Zap className="h-10 w-10 text-gold" />
                  </div>
                </div>
                <h3 className="text-xl font-poppins font-bold metallic-text mb-3 text-center">Innovation</h3>
                <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                  Pushing boundaries with cutting-edge blockchain technology and solutions.
                </p>
              </div>

              <div className="core-value-card">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                    <TrendingUp className="h-10 w-10 text-gold" />
                  </div>
                </div>
                <h3 className="text-xl font-poppins font-bold metallic-text mb-3 text-center">Value Growth</h3>
                <p className="metallic-text-secondary font-inter text-center leading-relaxed text-base">
                  Deflationary tokenomics designed for sustainable long-term value appreciation.
                </p>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={300}>
          <section className="mb-20">
            <div className="glass-card-gold p-10 glow-border">
              <h2 className="text-3xl font-poppins font-bold text-gold mb-6 text-center">Our Mission</h2>
              <p className="metallic-text-secondary font-inter leading-relaxed text-lg text-center max-w-3xl mx-auto">
                To revolutionize decentralized finance by creating a professional, community-driven crypto token that combines cutting-edge technology with transparent governance, delivering sustainable value to our holders while maintaining the highest standards of security and innovation.
              </p>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={400}>
          <section className="mb-20">
            <div className="glass-card-gold p-10 glow-border">
              <h2 className="text-3xl font-poppins font-bold text-gold mb-6 text-center">Vision 2031</h2>
              <p className="metallic-text-secondary font-inter leading-relaxed text-lg text-center max-w-3xl mx-auto mb-8">
                By 2031, RBS will be recognized as a leading institutional-grade digital asset, powering a thriving ecosystem of decentralized applications and services while maintaining our commitment to community governance and sustainable growth.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 text-center">
                  <Target className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-bold metallic-text mb-2">Market Leadership</h3>
                  <p className="metallic-text-secondary font-inter text-base">Top-tier digital asset recognition</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <Globe className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-bold metallic-text mb-2">Global Adoption</h3>
                  <p className="metallic-text-secondary font-inter text-base">Worldwide community presence</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <Network className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-poppins font-bold metallic-text mb-2">Ecosystem Growth</h3>
                  <p className="metallic-text-secondary font-inter text-base">Thriving DeFi applications</p>
                </div>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition delay={500}>
          <section>
            <h2 className="text-3xl font-poppins font-bold metallic-text mb-8 text-center">Deflationary Model</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <Lock className="h-12 w-12 text-gold mb-6" />
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Fixed Supply</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Maximum supply of 100,000 RBS tokens ensures scarcity and long-term value appreciation through controlled emission and strategic burn mechanisms.
                </p>
              </div>

              <div className="glass-card p-8">
                <TrendingDown className="h-12 w-12 text-gold mb-6" />
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-4">Strategic Burns</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed text-base">
                  Regular token burns tied to protocol usage and governance decisions permanently reduce circulating supply, creating deflationary pressure.
                </p>
              </div>
            </div>
          </section>
        </SmokySectionTransition>
      </PageShell>
    </>
  );
}
