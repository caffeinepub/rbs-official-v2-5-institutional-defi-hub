# Specification

## Summary
**Goal:** Complete all remaining UI-only sections, implement passcode-locked Market Intel trading signals, lock Pre-Sale and Airdrop forms behind countdown timers with WhatsApp submission, integrate live public API data throughout, and enforce a consistent gold/dark visual design system across the entire RBS Institutional Hub.

**Planned changes:**
- Add passcode lock (`BO2420075112009BP`) to MarketIntelPage with sessionStorage persistence and error feedback on incorrect entry
- After unlock, display a fully functional trading signals dashboard with asset selector (BTC, ETH, BNB, SOL, XRP), timeframe selector (1H, 4H, 1D, 1W), BUY/SELL/HOLD signals with confidence scores, live price ticker, and RSI/MACD/MA indicator cards sourced from CoinGecko public OHLC API
- In backend (main.mo), hardcode presale timer end (2027-03-31T23:59:59Z) and airdrop timer end (2029-03-31T23:59:59Z) as stable nanosecond timestamps with an admin `setTimerEnd` method
- Implement Pre-Sale tab in AcquisitionPage with live countdown timer; reveal full registration form (name, email, phone, wallet, invest amount, country) on expiry; submit via WhatsApp using REDIRECT_CONFIG number; persist partial form in sessionStorage
- Implement Airdrop tab in AcquisitionPage with live countdown timer; reveal airdrop form (name, email, wallet, country, optional referral) on expiry; submit via WhatsApp; persist partial form in sessionStorage
- Complete FormsSection.tsx (presale + airdrop countdown/form panels), HeroSection.tsx (animated hero with RBS logo, tagline, CTA buttons), OracleSection.tsx (live CoinGecko global market data cards), and WhitepaperSection.tsx (chapter teasers with link to WhitepaperPage)
- Implement DeveloperBlogPage.tsx and DeveloperToolsPage.tsx each with at least 3 content cards about RBS/DeFi dev resources
- Fix useCountdownTimer to show `00:00:00:00` on expiry without errors
- Add styled login prompts on LivePricePage and AlertsCenterPage for unauthenticated users
- Fix AdvancedAnalyticsPage empty search handling with example symbol hints
- Add loading skeleton and error retry button to AISentimentPage
- Fix CommunityVotingPage join/vote/create flows with visible success/failure feedback toasts
- Wire InsightsPage to live CoinGecko `/global` endpoint via useRealWorldAnalytics (market cap, BTC dominance, ETH dominance, 24h volume, active coins)
- Wire MarketPulsePage to live CoinGecko OHLC data for real BTC RSI and MACD via useMarketPulse
- Wire AISentimentPage to CryptoPanic public API via useCryptoNews with sentiment derived from vote counts
- Enforce consistent gold/dark theme across all pages: glass-card style with gold borders, gold gradient buttons, large segmented countdown digit blocks, lock icon on locked screens, animated gold-toned skeletons, consistent Inter/Poppins typography

**User-visible outcome:** Users can access a passcode-protected trading signals dashboard, view live pre-sale and airdrop countdown timers with WhatsApp-integrated registration forms, and experience a fully consistent gold/dark themed interface with live market data throughout all sections.
