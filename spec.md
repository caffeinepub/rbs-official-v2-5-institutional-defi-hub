# RBS Official — Crypto Token Website

## Current State

A full multi-page React/TypeScript + Motoko (ICP) crypto token website for the RBS token (100,000 fixed supply). The site has:
- 34+ pages including: Home, About, Whitepaper, Tokenomics, Roadmap, Market Intelligence, Market Dashboard, Market Pulse, Trading Tools, Fear & Greed, Community Voting/Governance, Developer Blog, Staking, Alerts, Acquisition/Presale/Airdrop, and more
- Persistent Motoko backend with: user profiles, polls/voting, blog posts, alerts, market intel access, global section locks (passcode BP2420075112009BP), presale/airdrop timers, Market Pulse voting, HTTP outcalls
- Real-time frontend data fetching via CoinGecko and Binance APIs
- White theme (bg-white + gray text + cyan accents), forcedTheme="light" in ThemeProvider
- RBS logo used in hero: `/assets/generated/rbs-token-logo.dim_512x512.png`
- Animations: Framer Motion scroll-triggered, ParticleField, SmokySectionTransition, AnimatedSection
- Header with full nav dropdowns; Footer with social links
- Global passcode system for Market Intel / Blog / Polls sections

## Requested Changes (Diff)

### Add
- **RBS Logo update**: Use newly uploaded RBS coin logo images (`/assets/uploads/IMG_20250821_154306_073-4-1.jpg`) as the primary logo throughout the site — in Header, Hero section, footer, and any page that displays the logo. The logo shows a green metallic coin "RETURN BE SUPERIOR".
- **Color palette derived from RBS logo**: The logo is deep teal/emerald green (#1a7a5a, #2d9e6b) with gold/bronze rim accents (#c9a227, #d4af37). Apply these brand colors as accent colors throughout the site where cyan was used. Keep white backgrounds, use teal-green as the primary accent instead of cyan.
- **Refresh button on real-time sections**: Every section displaying live prices or search results must have a visible "Refresh" button at the top. Clicking it instantly re-fetches live data.
- **New Trading Tool Pages / Sections** (functional, not UI-only):
  - **Crypto Converter** (on Trading Tools page): Convert between crypto amounts and USD using live prices
  - **Position Size Calculator**: Input entry price, stop loss, account size — outputs position size, risk amount, R:R ratio
  - **Pip/Move Calculator**: For forex/crypto, calculate move value based on lot size and price
  - **Fibonacci Retracement Calculator**: Input high/low — outputs 23.6%, 38.2%, 50%, 61.8%, 78.6% levels
  - **Compound Interest / DCA Calculator**: Input recurring investment amount + frequency + expected APY — outputs projected portfolio value over time
  - **Volatility Meter**: Live ATR-based volatility score for BTC/ETH/BNB using Binance API
  - **Crypto Screener** (on Market Dashboard page): Search/filter top 50 coins by price, volume, 24h change — with live data from CoinGecko
  - **On-chain Metrics Widget**: Bitcoin dominance, total market cap, altcoin season index (from CoinGecko global endpoint)
- **More homepage sections**:
  - RBS token stats bar (already exists, enhance with live market cap estimate)
  - "How to Get RBS" step-by-step section
  - Community stats section (poll count, blog post count, community members)
- **Live Forex/Metals in Market Intel**: Already partially implemented — ensure Gold (XAU) and Silver (XAG) use live metal price APIs, show correct prices with refresh

### Modify
- **Logo replacement**: Replace all instances of `/assets/generated/rbs-token-logo.dim_512x512.png` with the actual uploaded logo `/assets/uploads/IMG_20250821_154306_073-4-1.jpg`
- **Brand colors**: Update accent color from cyan (#0ea5e9) to RBS teal-green (#16a34a / emerald-600) throughout. Keep white backgrounds and gray text. Cards: white bg, teal-green borders and icons.
- **HomePage Live Market Snapshot**: Add a "Refresh" button at the top of the section
- **MarketDashboardPage**: Add Crypto Screener section with search + live CoinGecko top-50 data + Refresh button. Add On-chain Metrics widget.
- **TradingToolsPage**: Expand with the new calculators listed above, all fully functional
- **MarketIntelPage**: Add Refresh button to the live data display. Ensure Gold/Silver prices use live metal API data.
- **LivePricePage**: Add Refresh button at the top
- **MarketPulsePage**: Add Refresh button
- **FearGreedPage**: Add Refresh button
- **AdvancedAnalyticsPage**: Add Refresh button to price-fetching sections
- **Header logo**: Display the actual RBS coin logo image in the header alongside the brand name
- **Footer logo**: Use the actual RBS coin logo

### Remove
- Nothing to remove — preserve all existing pages and features

## Implementation Plan

1. **Copy uploaded logo to a stable path** — use `/assets/uploads/IMG_20250821_154306_073-4-1.jpg` as the canonical logo path
2. **Update Header** — show actual RBS coin logo image (48px) next to brand name "RBS"
3. **Update Footer** — show RBS coin logo in footer branding section
4. **Update HomePage hero** — replace generated logo with uploaded photo
5. **Update brand colors globally** — swap cyan-500/600 → emerald-600/green-600 for icon accents and active borders. Keep white backgrounds.
6. **Add Refresh buttons** — to: HomePage Live Market, MarketDashboardPage, LivePricePage, MarketIntelPage, MarketPulsePage, FearGreedPage, AdvancedAnalyticsPage
7. **Expand TradingToolsPage** — add 6 new calculators: Crypto Converter, Position Size Calc, Fibonacci Calc, Pip/Move Calc, DCA/Compound Calc, Volatility Meter (all functional with live data where applicable)
8. **Enhance MarketDashboardPage** — add Crypto Screener section (top-50 CoinGecko search/filter) + On-chain Metrics (dominance, total mcap, altcoin season)
9. **Enhance HomePage** — add "How to Get RBS" steps section and community stats section
10. **Backend** — backend is already fully implemented; no new backend APIs needed. All new tools are purely frontend with external API calls.
