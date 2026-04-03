import { SOCIAL_LINKS } from "@/constants/socialLinks";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Heart } from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";

export function Footer() {
  const navigate = useNavigate();
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "rbs-app";

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About RBS", path: "/about" },
    { label: "Market Intel", path: "/market-intel" },
    { label: "Trading Tools", path: "/trading-tools" },
    { label: "Funding Rates", path: "/funding-rates" },
    { label: "Whitepaper", path: "/whitepaper" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer
      className="border-t"
      style={{
        background: "rgba(248, 250, 252, 0.97)",
        borderColor: "rgba(14, 165, 233, 0.15)",
      }}
    >
      <div className="container mx-auto px-4 pt-12 pb-6 max-w-6xl">
        <div
          className="h-px mb-10"
          style={{
            background:
              "linear-gradient(to right, transparent, #0ea5e9, transparent)",
            opacity: 0.4,
          }}
        />

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(14, 165, 233, 0.12)",
                  border: "1px solid rgba(14, 165, 233, 0.3)",
                }}
              >
                <span className="text-sky-600 font-black text-xs">RBS</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">RBS Official</p>
                <p className="text-xs text-sky-600 font-semibold tracking-wide">
                  Always stay SUPERIOR
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mb-4">
              The next-generation crypto token built on BNB Chain (BEP-20).
              Fixed supply. Community governed. Superior intelligence.
            </p>
            <div className="flex items-center gap-4">
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

          {/* Col 2: Token Info */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
              RBS Token
            </p>
            <div className="space-y-2.5 text-xs">
              {[
                {
                  label: "Total Supply",
                  value: "100,000 RBS",
                  color: "text-gray-800",
                },
                {
                  label: "Blockchain",
                  value: "BNB Chain (BEP-20)",
                  color: "text-yellow-600",
                },
                {
                  label: "Token Burn",
                  value: "15% of supply",
                  color: "text-red-500",
                },
                {
                  label: "Presale Opens",
                  value: "Q1 2027",
                  color: "text-emerald-600",
                },
                {
                  label: "Airdrop Opens",
                  value: "Q1 2029",
                  color: "text-purple-600",
                },
                { label: "Standard", value: "BEP-20", color: "text-sky-600" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-400">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
              Quick Links
            </p>
            <div className="space-y-1.5">
              {quickLinks.map((link) => (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => navigate({ to: link.path as "/" })}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-sky-600 transition-colors group w-full text-left"
                >
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-sky-500" />
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(14, 165, 233, 0.12)" }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Built on BNB Chain (BEP-20)
            </span>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            © {new Date().getFullYear()} RBS Official. Built with{" "}
            <Heart className="h-3.5 w-3.5 text-sky-500 fill-sky-500" /> using{" "}
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
    </footer>
  );
}
