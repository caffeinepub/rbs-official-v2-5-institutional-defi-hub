/**
 * Binance Square Integration
 *
 * API Key: cb3bc3de8e894ccc9625f1fe0ff6bfc2
 *
 * NOTE: Binance Square does NOT provide a public REST write API for third-party
 * programmatic posting from a browser. The official approach for sharing content
 * is via the Binance Square web composer URL or the Binance mobile deep-link.
 *
 * This module provides:
 *  - A shareable deep-link/URL that opens the Binance Square post composer
 *    with the blog content pre-filled as much as the platform allows.
 *  - A helper to detect if the user is on mobile (for deep-link routing).
 *  - The configured API key reference for display/badge purposes.
 */

export const BINANCE_SQUARE_API_KEY = "cb3bc3de8e894ccc9625f1fe0ff6bfc2";
export const BINANCE_SQUARE_HANDLE = "@RBSuperior";
export const BINANCE_SQUARE_POST_URL =
  "https://square.binance.com/en/post/create";

/**
 * Build a Binance Square share URL for a blog post.
 * On mobile, tries to deep-link into the Binance app.
 * On desktop, opens the Binance Square web composer.
 */
export function buildBinanceSquareShareUrl(
  title: string,
  body: string,
  author: string,
): string {
  // Compose a concise share text: title + excerpt + author credit
  const excerpt = body.length > 280 ? `${body.slice(0, 277)}...` : body;
  const shareText = `📝 ${title}\n\n${excerpt}\n\n— ${author} | RBS Official\n#RBS #Crypto #Blockchain`;

  // Binance Square web composer (pre-fills content via query param when supported)
  const encoded = encodeURIComponent(shareText);
  return `${BINANCE_SQUARE_POST_URL}?content=${encoded}`;
}

/**
 * Open the Binance Square post composer with the given content.
 * On mobile devices, attempts the Binance app deep-link first.
 */
export function sharePostToBinanceSquare(
  title: string,
  body: string,
  author: string,
): void {
  const shareUrl = buildBinanceSquareShareUrl(title, body, author);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // Try Binance app deep-link; fall back to web URL after a short delay
    const appDeepLink = "binance://square/create";
    const timer = setTimeout(() => {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }, 1200);

    // Attempt app deep-link
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appDeepLink;
    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
      clearTimeout(timer);
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }, 1200);
  } else {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
}

/** Returns a masked display of the API key for UI display. */
export function getMaskedApiKey(): string {
  return `${BINANCE_SQUARE_API_KEY.slice(0, 8)}...`;
}
