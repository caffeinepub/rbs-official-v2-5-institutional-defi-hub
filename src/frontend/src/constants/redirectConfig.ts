// Redirect configuration for WhatsApp, Telegram, and Binance Square
// These values are based on the user's requirements and are used throughout the app

export const REDIRECT_CONFIG = {
  whatsapp: {
    direct: "+92 329 4238997",
    directUrl: "https://wa.me/923294238997",
    channel: "https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P",
  },
  telegram: {
    channel: "https://t.me/RBSuperior",
    username: "@RBSuperior",
  },
  binance: {
    square: "@RBSuperior",
    // Deep link for Binance app (if installed)
    deepLink: "binance://square/profile/RBSuperior",
    // Web fallback
    webUrl: "https://www.binance.com/en/square/profile/RBSuperior",
  },
} as const;

// Helper to build Binance Square link with app detection
export function getBinanceSquareLink(): string {
  // Try to detect if user is on mobile and might have Binance app
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Return deep link that will fallback to web if app not installed
    return REDIRECT_CONFIG.binance.deepLink;
  }

  return REDIRECT_CONFIG.binance.webUrl;
}
