# RBS Official — Version 125

## Current State

Multi-page RBS token website with persistent Motoko backend. Features include: Market Intel (G-Man Intelligence), Community Voting/Polls, Developer Blog, Presale/Airdrop Acquisition forms (timer-locked, WhatsApp redirect), Trading Tools, Fear & Greed Index, Crypto Heatmap, Funding Rates, Portfolio Tracker, Staking Calculator, Alerts Center, Market Dashboard, AI Sentiment, Live Price Ticker, and more. White theme is enforced. RBS logo is displayed throughout. All social links (Telegram, WhatsApp) and the contact form email are correctly configured.

## Requested Changes (Diff)

### Add
- Use new RBS logo images (uploaded: IMG_20250821_154306_073-8-1.jpg, -9-2.jpg, -10-3.jpg) throughout the site — replace old logo path with the new ones
- Poll deletion must now require a passcode (BP2420075112009BP) before deleting — add a passcode input step in the delete dialog flow
- New backend method `deletePollWithPasscode(pollId, passcode)` that validates the passcode server-side before deleting

### Modify
- **Remove InsightsPage (news/crypto news)** — delete the `/insights` route and remove it from navigation/footer; it requires real-time external API data that is unreliable
- **Remove AdvancedAnalyticsPage** — same reason; was still partially UI-only
- **Remove AISentimentPage** — UI-only sentiment scoring, no real backend
- **Remove MarketPulsePage** (standalone) — merge Market Pulse voting widget into the existing MarketIntelPage instead
- **Remove LivePricePage** — standalone live price page; live prices are already on HomePage and in the ticker
- **Acquisition page** — Presale/Airdrop forms: already redirect to WhatsApp +92 3294238997 with pre-filled message; confirm this works correctly after unlock based on countdown timer
- **Contact page** — already redirects to design.crafters.official@gmail.com via mailto; ensure it is clean and correct
- **FAQ page** — remove the FAQ page entirely; remove `/faq` route from App.tsx and from navigation
- **Footer** — remove FAQ link; ensure Telegram points to https://t.me/RBSuperior and WhatsApp points to https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P
- **Header/Nav** — remove FAQ, InsightsPage, LivePrice, AISentiment, AdvancedAnalytics nav links
- **Poll deletion** — change delete flow to require passcode (BP2420075112009BP) input before confirming deletion; any user can delete if they know the passcode (not just poll creator)
- **Logo** — update all references to use new uploaded logo: `/assets/uploads/IMG_20250821_154306_073-8-1.jpg` as the primary logo image

### Remove
- InsightsPage.tsx route + nav entry
- AdvancedAnalyticsPage.tsx route + nav entry  
- AISentimentPage.tsx route + nav entry
- LivePricePage.tsx route + nav entry
- MarketPulsePage.tsx route + nav entry (standalone page; keep MarketPulse as embedded component in MarketIntel)
- FAQPage.tsx route + nav entry
- All news/crypto-news API calls that were hardcoded in any page

## Implementation Plan

1. Update backend: add `deletePollWithPasscode(pollId: bigint, passcode: string)` method that checks passcode before deleting poll
2. Update `backend.d.ts` with new method signature
3. Frontend: Remove routes for /insights, /analytics, /sentiment, /live-price, /market-pulse, /faq from App.tsx
4. Frontend: Update CommunityVotingPage — change poll delete dialog to require passcode input, call new `deletePollWithPasscode`
5. Frontend: Update Header component — remove nav links for removed pages
6. Frontend: Update Footer — remove FAQ link, verify Telegram/WhatsApp links correct
7. Frontend: Update logo references throughout (HomePage hero, Footer, Header) to use new uploaded image `/assets/uploads/IMG_20250821_154306_073-8-1.jpg`
8. Frontend: Clean up AcquisitionPage — ensure WhatsApp redirect with pre-filled message works correctly post-unlock
9. Frontend: Verify ContactPage — mailto link goes to design.crafters.official@gmail.com
10. Frontend: Ensure all remaining real-time sections (Fear & Greed, Trading Tools, Market Dashboard, Live Ticker) are fully functional with their API calls intact
