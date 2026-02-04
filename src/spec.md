# Specification

## Summary
**Goal:** Unify AI Sentiment and Market Intelligence into a single experience, correct passcode-based locking so signals stay gated while AI Sentiment remains open, standardize the Interlink-ID-inspired theme across pages, and replace Community Voting with a coming-soon placeholder.

**Planned changes:**
- Merge AI Sentiment and Market Intelligence into one unified page/route and update bottom navigation so there is only one entry point (no separate AI Sentiment destination or reachable blank AI Sentiment page).
- Fix Market Intel lock/unlock gating using passcode `B2420075112009P` so AI Sentiment remains accessible while locked, and Market Intel signals/results are not shown or fetched/computed until unlocked; ensure re-locking clears results and prevents signals from reappearing until unlocked again.
- Apply consistent Interlink-ID-inspired theme styling across all major pages reachable from BottomNav (typography, spacing, contrast, cards, backgrounds) to eliminate mismatched/older styling and readability issues.
- Replace the entire Community Voting page content with only the bold text: "Voting session will coming soon".

**User-visible outcome:** Users access Market Intel + AI Sentiment from one combined page, AI Sentiment is always viewable, trading signals remain inaccessible until the correct passcode unlocks them (and reliably re-lock), all pages share a consistent visual theme, and the Voting page shows only a bold coming-soon message.
