# Specification

## Summary
**Goal:** Upgrade the RBS Institutional DeFi Hub with real-time data feeds, persistent backend state, fixed countdown timers, working forms, and corrected animations across all secondary pages — without changing any visual design.

**Planned changes:**
- **Market Intel page:** Compute genuine Buy/Sell/Hold signals with confidence scores from live RSI, MACD, and moving average calculations using CoinGecko OHLCV data; display underlying indicator values alongside signal badges; auto-refresh on each polling cycle.
- **Market Pulse page:** Fetch live Bitcoin price history from CoinGecko every 20 seconds; recompute Bullish/Bearish/Neutral status, RSI, and MACD histogram from real data; show last-updated timestamp.
- **Live Price page:** Fix `useLivePrice` hook to fetch real-time USD prices and 24h change for BTC, ETH, BNB, SOL, XRP from CoinGecko every 7 seconds; show live refresh indicator and graceful error fallback.
- **Crypto News / AI Sentiment page:** Fetch real articles from CryptoPanic public API; cache results for 12 hours; show article title, source, published timestamp, sentiment badge (from vote data), and a countdown to next refresh.
- **Advanced Analytics page:** Add Bollinger Bands, volume trend, 7-day and 30-day price change percentages, and a composite Market Strength score (0–100) to `useTokenAdvancedAnalytics` hook using real CoinGecko data; display in existing card layout.
- **Alerts Centre:** Store all alert records in the ICP backend actor keyed by user principal; implement full CRUD (`createAlert`, `getAlerts`, `markAlertRead`, `deleteAlert`, `toggleAlertTrigger`); wire frontend hooks to backend so alerts persist across reloads.
- **Insights page:** Fetch live total crypto market cap, BTC dominance, and top DeFi TVL from CoinGecko `/global` endpoint; show last-updated timestamps and trend arrows on metric cards.
- **Acquisition page timers:** Fix `useCountdownTimer` hook to fetch presale and airdrop timer target timestamps from backend actor, convert nanosecond bigints correctly, tick down every second via `setInterval`; disable submit button while active, enable on unlock.
- **Acquisition page forms:** After timer unlock, make form fields fully editable with correct validation; on submit, fire WhatsApp redirect with all form fields prefilled (name, email, wallet address, amount for pre-sale; name, email, wallet address for airdrop).
- **Community Voting:** Store all Poll records and vote tallies in backend actor with principal-based double-vote prevention; wire `useCommunityVoting` hook to backend CRUD methods; refresh vote counts every 10 seconds.
- **Animations:** Audit and fix `SmokySectionTransition`, parallax hooks, and entry animations on AcquisitionPage, AlertsCenterPage, AdvancedAnalyticsPage, MarketIntelPage, MarketPulsePage, InsightsPage, CommunityVotingPage, AISentimentPage, and LivePricePage; fix broken IntersectionObserver callbacks and CSS keyframe animations; respect reduced-motion preference.
- **Backend (`backend/main.mo`):** Implement or complete stable storage for Alert CRUD, Poll CRUD with voter deduplication, and presale/airdrop timer target timestamps aligned to roadmap phases; generate `migration.mo` for safe canister state upgrade.

**User-visible outcome:** All data-driven pages show live, accurate cryptocurrency data refreshed automatically; alerts and community votes persist after page reload; presale and airdrop countdown timers count down correctly and unlock their forms; form submission sends correctly prefilled WhatsApp messages; all page animations and transitions work smoothly.
