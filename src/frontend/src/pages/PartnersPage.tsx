import { Building2, Sparkles } from 'lucide-react';
import { PageHead } from '@/components/PageHead';

export default function PartnersPage() {
  return (
    <>
      <PageHead title="Partners & Ecosystem" description="RBS strategic partners and ecosystem collaborations" />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 mex-fade-in">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <Building2 className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold mb-6 tracking-tight leading-tight">
                Partners & Ecosystem
              </h1>
              <p className="text-xl metallic-text-secondary font-inter max-w-2xl mx-auto leading-relaxed">
                Strategic collaborations driving the RBS ecosystem forward
              </p>
            </div>

            <div className="glass-card-gold p-16 text-center mex-fade-up">
              <Sparkles className="h-16 w-16 text-gold mx-auto mb-6" />
              <h2 className="text-4xl font-poppins font-bold text-gold mb-4">
                Coming Soon
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-xl mx-auto">
                We're building strategic partnerships to expand the RBS ecosystem. Check back soon for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
