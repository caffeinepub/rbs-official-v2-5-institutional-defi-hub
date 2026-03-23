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
      className="border-t pt-12 pb-6"
      style={{
        background: "rgba(248, 250, 252, 0.97)",
        borderColor: "rgba(14, 165, 233, 0.15)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className="h-px mb-10"
            style={{
              background:
                "linear-gradient(to right, transparent, #0ea5e9, transparent)",
              opacity: 0.4,
            }}
          />

          {/* Main footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(14, 165, 233, 0.1)",
                    border: "1px solid rgba(14, 165, 233, 0.25)",
                  }}
                >
                  <span className="text-sky-600 font-black text-xs">RBS</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    RBS Official
                  </p>
                  <p className="text-xs text-sky-600 font-semibold tracking-wide">
                    Always stay SUPERIOR
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                Always stay SUPERIOR — The next generation crypto token built on
                BNB Chain (BEP-20).
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-500 transition-colors"
                  aria-label="Telegram"
                >
                  <SiTelegram className="h-5 w-5" />
                </a>
                <a
                  href={SOCIAL_LINKS.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-500 transition-colors"
                  aria-label="WhatsApp"
                >
                  <SiWhatsapp className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Token info */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Token</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Total Supply</span>
                  <span className="font-semibold text-gray-700">
                    100,000 RBS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Presale Opens</span>
                  <span className="font-semibold text-emerald-600">
                    Q1 2027
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Airdrop Opens</span>
                  <span className="font-semibold text-purple-600">Q1 2029</span>
                </div>
                <div className="flex justify-between">
                  <span>Blockchain</span>
                  <span className="font-semibold text-gray-700">BNB Chain</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="pt-6 border-t text-center"
            style={{ borderColor: "rgba(14, 165, 233, 0.12)" }}
          >
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              © {new Date().getFullYear()}. Built with{" "}
              <Heart className="h-4 w-4 text-sky-500 fill-sky-500" /> using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:text-sky-500 transition-colors font-semibold"
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
