import { Heart } from 'lucide-react';
import { SiTelegram, SiWhatsapp } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-transparent to-white/50 border-t border-gold-matte/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-gold-matte to-transparent mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="coin-3d" style={{ width: '32px', height: '32px' }}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-light via-gold-matte to-gold-dark shadow-md" />
              </div>
              <div>
                <p className="text-sm font-poppins text-dark-matter font-bold">RBS Official</p>
                <p className="text-xs text-dark-matter opacity-90">Professional Crypto Token</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://t.me/Rsuperior"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-matter hover:text-gold-matte transition-colors opacity-90 hover:opacity-100"
                aria-label="Telegram"
              >
                <SiTelegram className="h-5 w-5" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-matter hover:text-gold-matte transition-colors opacity-90 hover:opacity-100"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gold-matte/20 text-center">
            <p className="text-sm text-dark-matter opacity-90 font-inter flex items-center justify-center gap-2">
              © 2025. Built with <Heart className="h-4 w-4 text-gold-matte fill-gold-matte" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-matte hover:opacity-80 transition-opacity font-semibold"
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
