# Specification

## Summary
**Goal:** Make AI Sentiment always visible within Market Intel while keeping signals/market data fully passcode-gated per user, remove Live Price/Advanced Analytics, unify and modernize key page designs, strengthen motion/animations, expand Whitepaper + FAQ, and add new real-time oriented pages/sections.

**Planned changes:**
- Adjust Market Intel page gating so AI Sentiment is always shown, while signals + market data stay hidden and do not fetch/compute until passcode unlock.
- Fix backend unlock/lock semantics to be per-user: require passcode every time for unlock and lock, ensure access checks reflect current caller state, and remove any global/shared unlock behavior.
- Update Market Intel UI flow: show a “Signals Locked” panel when locked; add a passcode-confirmed “Lock Market Intel” action when unlocked; clear selected asset/timeframe and clear cached gated query data on lock.
- Remove Live Price and Advanced Analytics routes and all navigation/deep links to `/live-price` and `/advanced-analytics`.
- Modernize and unify design consistency (theme, spacing, typography, contrast) across Insights, Testimonials, Security, Highlights, and Ecosystem.
- Add more noticeable motion design across the site, including stronger section reveal animations and a reusable smoky left↔right transition used across multiple sections.
- Expand the Whitepaper with additional chapters and/or deeper subsections while keeping chapter navigation and scroll-based active tracking accurate.
- Add more FAQ entries with expandable answers, keeping styling consistent and readable.
- Add at least two new real-time oriented pages or major sections (implementer-chosen), integrated into navigation and the unified theme, without reintroducing Live Price or Advanced Analytics as separate pages.

**User-visible outcome:** Users can view AI Sentiment in Market Intel without unlocking, unlock/lock signals securely per user via passcode (with no pre-unlock fetching), navigate a cleaner app without Live Price/Analytics, see a more consistent modern design with stronger animations, read an expanded Whitepaper and FAQ, and access new real-time oriented pages/sections from navigation.
