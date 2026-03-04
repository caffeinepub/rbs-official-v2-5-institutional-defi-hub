import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import type React from "react";
import { REDIRECT_CONFIG } from "../constants/redirectConfig";

interface ContactLink {
  label: string;
  sublabel: string;
  href: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const CONTACT_LINKS: ContactLink[] = [
  {
    label: "WhatsApp Channel",
    sublabel: "Join our official channel",
    href: REDIRECT_CONFIG.whatsapp.channel,
    icon: MessageCircle,
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    label: "Telegram",
    sublabel: "@RBSuperior",
    href: REDIRECT_CONFIG.telegram.channel,
    icon: Send,
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    label: "Presale & Airdrop",
    sublabel: "+92 329 4238997",
    href: REDIRECT_CONFIG.whatsapp.directUrl,
    icon: Phone,
    iconBg: "bg-gold-accent/20",
    iconColor: "text-gold-accent",
  },
  {
    label: "Contact Email",
    sublabel: "design.crafters.official@gmail.com",
    href: "mailto:design.crafters.official@gmail.com",
    icon: Mail,
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
  },
];

export default function ContactInfoSection() {
  return (
    <div className="gman-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
          <MessageCircle className="w-5 h-5 text-black" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gold-accent">
            Contact & Community
          </h3>
          <p className="text-xs text-slate-400">Connect with RBS Superior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONTACT_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-gold-accent/50 hover:bg-slate-800 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${link.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon className={`w-5 h-5 ${link.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-gold-accent transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {link.sublabel}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
