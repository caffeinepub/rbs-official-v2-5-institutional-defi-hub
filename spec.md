# RBS Official — Bug Fixes & Section Removal

## Current State
Multi-page institutional crypto token website with v113 white theme. Several homepage sections need removal, and multiple features (Market Intel, polls, developer blog, funding rates, acquisition forms, profile) have bugs or incomplete functionality.

## Requested Changes (Diff)

### Add
- Expanded Whitepaper content explaining tokenomics, price, supply, distribution in detail

### Modify
- **HomePage**: Remove Fear & Greed Index widget (lines 1196–1327), Remove Live Market Snapshot section (lines 1329–1466), Remove Live Trading Signals strip (lines 1598–1710), Remove TopMoversSection component call, Remove BTCDominanceSection component call. Also remove TopMoversSection and BTCDominanceSection function definitions and all unused state/effects related to them (fearGreed, quickSignals, prices, liveMarket, fetchFearGreed, fetchQuickSignals, fetchPrices, etc)
- **FundingRatesPage**: Fix CORS error — `fapi.binance.com` is blocked by CORS in browsers. Use `api.binance.com/api/v3/premiumIndex` instead, or use a CORS proxy approach. The endpoint `https://fapi.binance.com/fapi/v1/premiumIndex` fails in browser context. Use `https://api.binance.com/api/v3/ticker/24hr` for price data and a direct approach for funding rates using the spot API or show realistic mock data derived from real spot prices.
- **MarketIntelPage**: Ensure `useGlobalSectionLock` loading is shown correctly. The loading state uses `lockLoading` but the actor might not be ready. Add a minimum loading delay and ensure the lock state initializes to `false` (locked) by default, not showing a blank screen.
- **CommunityVotingPage**: Poll creation UI shows a passcode gate at the top requiring a global unlock — but this is separate from actually creating a poll (which also needs the passcode). Simplify: remove the global unlock gate for polls entirely. Let any logged-in user see polls. Show a "Create Poll" button that expands a form requiring the passcode. Fix the create poll error display.
- **DeveloperBlogPage**: Remove the Binance API direct post attempt (fails due to CORS) — keep only the Share to Binance Square pre-filled composer button. Ensure blogs are visible to all authenticated users. Ensure the author panel unlock uses local passcode check + global lock sync.
- **AcquisitionPage**: Forms are timer-locked (Q1 2027 presale, Q1 2029 airdrop). After unlock, redirect to WhatsApp +923294238997 with pre-filled message. This is already correct — verify no bugs, ensure error states work.
- **ProfilePage**: Fix profile save functions to reliably save name, username to backend. Ensure username uniqueness check works. Fix avatar upload.
- **WhitepaperPage**: Expand content significantly — add detailed tokenomics (supply breakdown, allocation percentages, use cases), price discovery mechanism, token utility, vesting schedules, governance, security, roadmap details.

### Remove
- `FearGreedData` interface and all fear/greed state from HomePage
- `TopMoversSection` component from HomePage
- `BTCDominanceSection` component from HomePage
- `QuickSignal` interface and quick signals state/functions from HomePage
- Crypto prices state and live market snapshot state from HomePage (CRYPTO_IDS, CRYPTO_META, prices state, fetchPrices, etc.)
- Unused imports related to removed sections in HomePage

## Implementation Plan
1. Edit HomePage.tsx to remove 4 sections + their component definitions + related state/imports
2. Fix FundingRatesPage.tsx to use working CORS-friendly API endpoints
3. Fix MarketIntelPage.tsx loading state handling
4. Fix CommunityVotingPage.tsx — simplify poll unlock gate, fix create form flow
5. Fix DeveloperBlogPage.tsx — remove failed Binance API call, keep share button
6. Verify AcquisitionPage.tsx is correct
7. Fix ProfilePage.tsx minor bugs
8. Expand WhitepaperPage.tsx with detailed tokenomics content
