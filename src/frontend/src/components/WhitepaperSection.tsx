import { SmokySectionTransition } from './SmokySectionTransition';
import { FileText, Download, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

/**
 * Comprehensive whitepaper section with scroll-triggered fade-in animations,
 * covering token scarcity, mesh technology, governance, roadmap with timeline,
 * and technical stack details with styled dividers and icons.
 */
export function WhitepaperSection() {
  const navigate = useNavigate();

  return (
    <SmokySectionTransition delay={600}>
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                <FileText className="h-10 w-10 text-gold" />
              </div>
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                RBS Whitepaper
              </h2>
              <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                Comprehensive technical documentation covering our vision, technology, and tokenomics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in-up animation-delay-200">
              <div className="glass-card-gold p-8 text-center glow-border">
                <BookOpen className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Vision & Mission</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed">
                  Our roadmap to revolutionize decentralized finance
                </p>
              </div>

              <div className="glass-card-gold p-8 text-center glow-border">
                <FileText className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Technical Stack</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed">
                  Advanced blockchain architecture and protocols
                </p>
              </div>

              <div className="glass-card-gold p-8 text-center glow-border">
                <Download className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-2xl font-poppins font-bold metallic-text mb-3">Tokenomics</h3>
                <p className="metallic-text-secondary font-inter leading-relaxed">
                  Deflationary model with strategic scarcity
                </p>
              </div>
            </div>

            <div className="text-center animate-fade-in-up animation-delay-300">
              <Button
                onClick={() => navigate({ to: '/whitepaper' })}
                size="lg"
                className="bg-gradient-to-r from-gold-matte to-gold-light hover:from-gold-light hover:to-gold-matte text-dark-matter font-poppins font-bold shadow-gold-md hover:shadow-gold-lg transition-all"
              >
                Read Full Whitepaper
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SmokySectionTransition>
  );
}
