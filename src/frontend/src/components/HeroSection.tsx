import { useEffect, useState } from 'react';
import { TrendingUp, Activity, Network } from 'lucide-react';
import { SmokySectionTransition } from './SmokySectionTransition';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

/**
 * Hero section with neural mesh background, animated shimmer gold title,
 * introductory text, and three live protocol ticker cards showing dynamic
 * simulated values for Resonance Score, Global Nodes, and Mesh Parity.
 */
export function HeroSection() {
  const navigate = useNavigate();
  const [resonanceScore, setResonanceScore] = useState(87.3);
  const [globalNodes, setGlobalNodes] = useState(12847);
  const [meshParity, setMeshParity] = useState(94.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setResonanceScore((prev) => +(prev + (Math.random() - 0.5) * 2).toFixed(1));
      setGlobalNodes((prev) => prev + Math.floor(Math.random() * 5));
      setMeshParity((prev) => +(prev + (Math.random() - 0.5) * 0.5).toFixed(1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SmokySectionTransition>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-12 animate-fade-in-up">
              <img 
                src="/assets/IMG_20250821_154306_073.jpg" 
                alt="RBS Logo" 
                className="h-40 w-40 rounded-full object-cover shadow-gold-xl hover:scale-110 transition-all duration-500"
              />
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-poppins font-bold mb-10 shimmer-gold animate-fade-in-up leading-tight">
              Return. Be Superior.
            </h1>
            
            <p className="text-2xl md:text-3xl metallic-text-secondary mb-8 font-inter animate-fade-in-up animation-delay-200 leading-relaxed">
              Professional Crypto Token powered by advanced blockchain technology
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
              <Button
                onClick={() => navigate({ to: '/acquisition' })}
                size="lg"
                className="bg-gradient-to-r from-gold-matte to-gold-light hover:from-gold-light hover:to-gold-matte text-dark-matter font-poppins font-bold shadow-gold-md hover:shadow-gold-lg transition-all"
              >
                Get RBS Now
              </Button>
              <Button
                onClick={() => navigate({ to: '/whitepaper' })}
                size="lg"
                variant="outline"
                className="border-2 border-gold-matte text-gold-matte hover:bg-gold-matte/10 font-poppins font-bold transition-all"
              >
                Read Whitepaper
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-400">
              <div className="protocol-ticker-card">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-gold" />
                  <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                    Resonance Score
                  </h3>
                </div>
                <p className="text-4xl font-poppins font-bold text-gold">{resonanceScore}%</p>
              </div>

              <div className="protocol-ticker-card">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Network className="h-6 w-6 text-gold" />
                  <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                    Global Nodes
                  </h3>
                </div>
                <p className="text-4xl font-poppins font-bold text-gold">
                  {globalNodes.toLocaleString()}
                </p>
              </div>

              <div className="protocol-ticker-card">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Activity className="h-6 w-6 text-gold" />
                  <h3 className="text-base font-inter font-semibold metallic-text uppercase tracking-wider">
                    Mesh Parity
                  </h3>
                </div>
                <p className="text-4xl font-poppins font-bold text-gold">{meshParity}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SmokySectionTransition>
  );
}
