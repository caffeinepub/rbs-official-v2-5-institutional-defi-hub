import { REDIRECT_CONFIG } from "@/constants/redirectConfig";

/**
 * Builds a WhatsApp URL with pre-filled message using the configured direct number.
 * Always uses REDIRECT_CONFIG.whatsapp.directUrl for consistency.
 */
export function buildWhatsAppURL(
  subject: string,
  data: Record<string, string>,
): string {
  const message = formatWhatsAppMessage(subject, data);
  const encodedMessage = encodeURIComponent(message);
  return `${REDIRECT_CONFIG.whatsapp.directUrl}?text=${encodedMessage}`;
}

/**
 * Redirects to WhatsApp with pre-filled message using window.location.assign
 * for better mobile compatibility.
 */
export function redirectToWhatsApp(
  subject: string,
  data: Record<string, string>,
): void {
  const url = buildWhatsAppURL(subject, data);
  // Use window.location.assign for better mobile compatibility
  window.location.assign(url);
}

/**
 * Opens WhatsApp in a new window with pre-filled message.
 * Uses the configured direct number from REDIRECT_CONFIG.
 */
export function openWhatsApp(
  subject: string,
  data: Record<string, string>,
): void {
  const url = buildWhatsAppURL(subject, data);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Formats data into a WhatsApp message with proper structure.
 */
function formatWhatsAppMessage(
  subject: string,
  data: Record<string, string>,
): string {
  let message = `*${subject}*\n\n`;

  for (const [key, value] of Object.entries(data)) {
    message += `*${key}:* ${value}\n`;
  }

  message += "\n_Sent via RBS Acquisition Portal_";

  return message;
}
