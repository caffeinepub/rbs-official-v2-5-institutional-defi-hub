import { SOCIAL_LINKS } from "@/constants/socialLinks";
import { Heart } from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";

export function Footer() {
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "rbs-app";

  return (
    <footer
      className="border-t py-12"
      style={{
        background: "rgba(248, 250, 252, 0.97)",
        borderColor: "rgba(14, 165, 233, 0.15)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="h-px mb-8"
            style={{
              background:
                "linear-gradient(to right, transparent, #0ea5e9, transparent)",
              opacity: 0.4,
            }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(14, 165, 233, 0.1)",
                  border: "1px solid rgba(14, 165, 233, 0.25)",
                }}
              >
                <img
                  src="/assets/uploads/IMG_20250821_154306_073-4-1.jpg"
                  alt="RBS Token Logo"
                  className="w-5 h-5 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">RBS Official</p>
                <p className="text-xs text-gray-500">
                  Professional Crypto Token
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-emerald-600 transition-colors"
                aria-label="Telegram"
              >
                <SiTelegram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-emerald-600 transition-colors"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div
            className="mt-8 pt-6 border-t text-center"
            style={{ borderColor: "rgba(14, 165, 233, 0.12)" }}
          >
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              © {new Date().getFullYear()}. Built with{" "}
              <Heart className="h-4 w-4 text-emerald-500 fill-emerald-500" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-500 transition-colors font-semibold"
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
