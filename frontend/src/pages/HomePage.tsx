import { TrendingUp, Shield, Zap, Users, Globe, Lock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { PageHead } from '@/components/PageHead';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHead title="Home" description="Return Be Superior - Advanced blockchain solutions and RBS token ecosystem" />
      
      <div className="min-h-screen">
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/generated/rbs-token-hero.dim_1600x900.png"
              alt="RBS Token Hero"
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-5xl mx-auto text-center mex-fade-in">
              <div className="flex justify-center mb-8">
                <img
                  src="/assets/generated/rbs-token-logo.dim_512x512.png"
                  alt="RBS Token"
                  className="w-32 h-32 object-contain mex-scale-in"
                  style={{ width: '128px', height: '128px' }}
                />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 shimmer-gold leading-tight">
                Return Be Superior
              </h1>
              
              <p className="text-xl md:text-2xl metallic-text-secondary font-inter mb-12 max-w-3xl mx-auto leading-relaxed">
                Advanced blockchain solutions powered by the RBS token ecosystem. 
                Experience superior trading intelligence, real-time market analytics, and community-driven governance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mex-fade-up animation-delay-200">
                <Button
                  onClick={() => navigate({ to: '/acquisition' })}
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-black font-poppins font-bold text-lg px-8 py-6 mex-hover-lift mex-focus-ring"
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => navigate({ to: '/whitepaper' })}
                  size="lg"
                  variant="outline"
                  className="border-2 border-gold text-gold hover:bg-gold/10 font-poppins font-bold text-lg px-8 py-6 mex-hover-lift mex-focus-ring"
                >
                  Read Whitepaper
                </Button>
              </div>
            </div>
          </div>
        </section>

        <SmokySectionTransition>
          <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-poppins font-bold metallic-text-hero mb-4">
                  Platform Features
                </h2>
                <p className="text-xl metallic-text-secondary font-inter max-w-2xl mx-auto">
                  Comprehensive tools and services for the modern blockchain ecosystem
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <Card className="glass-card glow-border mex-hover-lift mex-scale-in">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-gold">Live Market Data</CardTitle>
                    <CardDescription>Real-time price tracking and market analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="metallic-text-secondary">
                      Access live price feeds, volume data, and market cap information with automatic refresh intervals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card glow-border mex-hover-lift mex-scale-in animation-delay-100">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-gold">Market Intelligence</CardTitle>
                    <CardDescription>Advanced trading signals and technical analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="metallic-text-secondary">
                      Professional-grade indicators including RSI, MACD, Bollinger Bands, VWAP, and more.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card glow-border mex-hover-lift mex-scale-in animation-delay-200">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-gold">AI Sentiment Analysis</CardTitle>
                    <CardDescription>Machine learning-powered market sentiment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="metallic-text-secondary">
                      Real-time sentiment scoring with confidence metrics and historical accuracy tracking.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card glow-border mex-hover-lift mex-scale-in animation-delay-300">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-gold">Community Governance</CardTitle>
                    <CardDescription>Decentralized decision-making platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="metallic-text-secondary">
                      Participate in protocol governance with proposal creation and voting mechanisms.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card glow-border mex-hover-lift mex-scale-in animation-delay-400">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <Globe className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-gold">Advanced Analytics</CardTitle>
                    <CardDescription>Comprehensive market data dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="metallic-text-secondary">
                      Aggregated insights from multiple data sources with coverage reporting and historical views.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card glow-border mex-hover-lift mex-scale-in animation-delay-500">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <Lock className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-gold">Secure & Transparent</CardTitle>
                    <CardDescription>Built on Internet Computer Protocol</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="metallic-text-secondary">
                      Leveraging ICP's security and transparency with Internet Identity authentication.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </SmokySectionTransition>

        <SmokySectionTransition>
          <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-poppins font-bold metallic-text-hero mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl metallic-text-secondary font-inter mb-12 max-w-2xl mx-auto">
                Join the RBS ecosystem today and experience the future of blockchain trading intelligence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate({ to: '/acquisition' })}
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-black font-poppins font-bold text-lg px-8 py-6 mex-hover-lift mex-focus-ring"
                >
                  Join Presale
                </Button>
                <Button
                  onClick={() => navigate({ to: '/market-intel' })}
                  size="lg"
                  variant="outline"
                  className="border-2 border-gold text-gold hover:bg-gold/10 font-poppins font-bold text-lg px-8 py-6 mex-hover-lift mex-focus-ring"
                >
                  Explore Market Intel
                </Button>
              </div>
            </div>
          </section>
        </SmokySectionTransition>
      </div>
    </>
  );
}
