# Specification

## Summary
**Goal:** Rebuild the Market Intel page into a professional G-Man Intelligence signal dashboard with passcode protection, real-time AI trading signals, Market Pulse voting, poll creation, and a contact info section — backed by a new Motoko backend that fetches live market data and computes technical indicators server-side.

**Planned changes:**
- Remove the Advanced Analytics, Live Price, and Crypto News sections from MarketIntelPage.tsx (standalone routes for those pages remain untouched)
- Keep the existing passcode gate on Market Intel; unlock state persists within the browser session
- Build a G-Man Intelligence signal generator wizard: Step 1 — select market category (Top 10 Crypto, Top 10 Forex, Gold, Silver) then pick a specific asset; Step 2 — select a timeframe (1M, 5M, 15M, 30M, 1H, 4H, 1D); Generate Signal button activates only when both are chosen
- Add a new Motoko backend function `generateSignal(symbol, timeframe)` that fetches live OHLCV data from CoinGecko (crypto) and a free Forex/metals API (Forex, Gold, Silver), computes RSI, MACD, EMA, SMA, Bollinger Bands, Volume, ATR, Trend Strength, Support & Resistance, and Momentum in Motoko, then returns a weighted signal result (StrongBuy/Buy/Neutral/Sell/StrongSell), confidence %, indicator summary, trend direction, and timestamp; API keys stored in stable backend state only
- Display the signal output card branded "G-Man Intelligence" with colour-coded signal label, confidence bar, indicator summary, trend direction, loading spinner, and error handling
- Add Market Pulse voting (Bullish / Bearish / Neutral, one vote per session) backed by `voteMarketPulse` and `getMarketPulseTally` backend functions; frontend polls tally every 10 seconds and shows live percentage bars
- Keep the existing poll creation UI (useCommunityVoting) accessible within the unlocked Market Intel page
- Add a Contact Information section (visible after unlock) with links for WhatsApp Channel, Telegram, Presale & Airdrop WhatsApp (wa.me), and Contact Email (mailto)
- Apply a dark background with gold accent colours, card layouts with subtle borders/glows, monospaced typography for numeric values, and full mobile/desktop responsiveness

**User-visible outcome:** After unlocking Market Intel with the existing passcode, users can generate AI-powered trading signals for crypto, forex, gold, and silver assets across multiple timeframes, vote on live Market Pulse sentiment, create community polls, and access all RBS contact links — all within a professional dark-gold trading dashboard UI.
