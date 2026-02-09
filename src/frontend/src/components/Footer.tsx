import { Heart } from 'lucide-react';
import { SiTelegram, SiWhatsapp } from 'react-icons/si';
import { SOCIAL_LINKS } from '@/constants/socialLinks';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 rounded-full overflow-hidden shadow-md">
                <img
                  src="/assets/IMG_20250821_154306_073.jpg"
                  alt="RBS"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">RBS Official</p>
                <p className="text-xs text-muted-foreground">Professional Crypto Token</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Telegram"
              >
                <SiTelegram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              © 2026. Built with <Heart className="h-4 w-4 text-primary fill-primary" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80 transition-opacity font-semibold"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
