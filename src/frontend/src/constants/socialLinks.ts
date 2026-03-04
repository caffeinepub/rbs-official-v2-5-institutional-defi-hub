import { REDIRECT_CONFIG } from "./redirectConfig";

export const SOCIAL_LINKS = {
  telegram: REDIRECT_CONFIG.telegram.channel,
  whatsappChannel: REDIRECT_CONFIG.whatsapp.channel,
  whatsappDirect: REDIRECT_CONFIG.whatsapp.directUrl,
  binanceSquare: REDIRECT_CONFIG.binance.webUrl,
  binanceSquareDeepLink: REDIRECT_CONFIG.binance.deepLink,
} as const;
