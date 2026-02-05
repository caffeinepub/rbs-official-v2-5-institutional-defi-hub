# Specification

## Summary
**Goal:** Stabilize live-update behaviors and Market Intel reliability/accuracy, fix animation-driven disappearing content, persist Alerts per user, and expand/refresh site content with consistent theming.

**Planned changes:**
- Ensure the app uses a single React Query `QueryClientProvider` so cache/refetch/invalidation is consistent across all routes (including Market Intel and real-time sections).
- Fix animation/transition patterns that hide content after interaction so clicked/targeted content stays visible (including Whitepaper chapter navigation) while respecting reduced-motion preferences.
- Stabilize Market Intel unlock + data loading flows; improve client-side handling so successful API responses render reliably and error states clearly distinguish access/auth vs external API failures with retry.
- Improve Market Intel calculation consistency by removing or isolating simulated/randomized inputs; ensure signals don’t change purely due to randomness when fetched data is unchanged and avoid `Date.now`-seeded indicator values.
- Add backend alert persistence (single Motoko canister) with CRUD endpoints; update the frontend Alerts Center to use React Query against the canister so alerts persist across refresh/sessions and are scoped per Internet Identity principal.
- Expand the Whitepaper by adding multiple new chapters with complete English content while preserving chapter navigation behavior, scrolling visibility, and active-chapter highlighting.
- Apply cohesive theme consistency updates across Insights, Testimonials, Security/Transparency, Community Highlights, and Ecosystem Growth pages (typography, spacing, cards, backgrounds, hovers, and motion) without removing content.
- Add at least two new English-only content sections integrated into existing pages to enrich the experience without adding new backend services.
- Audit and fix site-wide polling/interval live-update behaviors to prevent duplicate timers, UI flicker/disappearing content during refresh, incorrect loading states, and multiplying network calls.

**User-visible outcome:** The app’s live sections and Market Intel behave more reliably and consistently, interactive content no longer disappears due to animations, alerts persist per logged-in user across refresh/devices, the whitepaper includes more chapters, and key pages look and feel consistently updated with additional on-site content.
