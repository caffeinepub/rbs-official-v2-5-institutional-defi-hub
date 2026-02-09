import { SOCIAL_LINKS } from '@/constants/socialLinks';

export interface WhatsAppMessageData {
  name: string;
  country: string;
  walletAddress: string;
  rbsAmount: number;
  formType: 'Presale' | 'Airdrop';
}

export interface WhatsAppOpenResult {
  url: string;
  blocked: boolean;
}

export function buildWhatsAppMessage(data: WhatsAppMessageData): string {
  return `RBS ${data.formType} Registration

Name: ${data.name}
Country: ${data.country}
Wallet: ${data.walletAddress}
RBS Amount: ${data.rbsAmount}`;
}

export function createWhatsAppURL(data: WhatsAppMessageData): string {
  const message = buildWhatsAppMessage(data);
  const encodedMessage = encodeURIComponent(message);
  return `${SOCIAL_LINKS.whatsappDirect}?text=${encodedMessage}`;
}

export function openWhatsAppWithFallback(data: WhatsAppMessageData): WhatsAppOpenResult {
  const url = createWhatsAppURL(data);
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  
  return {
    url,
    blocked: !newWindow || newWindow.closed || typeof newWindow.closed === 'undefined',
  };
}

export function openWhatsApp(data: WhatsAppMessageData): void {
  const url = createWhatsAppURL(data);
  window.open(url, '_blank', 'noopener,noreferrer');
}
