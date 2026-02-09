import { TrendingUp } from 'lucide-react';
import { RegistrationForms } from '@/components/RegistrationForms';
import { MySubmissions } from '@/components/MySubmissions';
import { PageHead } from '@/components/PageHead';

export default function AcquisitionPage() {
  return (
    <>
      <PageHead
        title="Acquisition Portal"
        description="Register for RBS presale or airdrop to secure your tokens"
      />
      <div className="min-h-screen pt-12 pb-32 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center gap-4 mb-6">
                <TrendingUp className="h-12 w-12 text-primary animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-foreground">
                  Acquisition Portal
                </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Secure your position in the RBS ecosystem through our presale or airdrop programs
              </p>
            </div>

            <RegistrationForms />

            <div className="mt-16 animate-fade-in-up animation-delay-200">
              <MySubmissions />
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-300">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100,000</div>
                <div className="text-sm text-muted-foreground font-medium">Total Supply</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">20%</div>
                <div className="text-sm text-muted-foreground font-medium">Presale Allocation</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">7%</div>
                <div className="text-sm text-muted-foreground font-medium">Airdrop Allocation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
