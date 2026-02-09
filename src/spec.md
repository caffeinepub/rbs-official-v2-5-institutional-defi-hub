# Specification

## Summary
**Goal:** Deliver a cohesive, modern UI redesign across the existing multipage site while fixing Telegram/WhatsApp redirects, ensuring all forms (including Presale/Airdrop) submit reliably with timer-based locking and submission logs, and implementing a working site search.

**Planned changes:**
- Apply a consistent, modern design system site-wide (typography, spacing, colors, and unified styling for cards/buttons/inputs/backgrounds) without breaking any existing routes on mobile or desktop.
- Centralize and correct all Telegram/WhatsApp links so every related button/link opens the correct destination in a new tab/window using `frontend/src/constants/socialLinks.ts` (no hardcoded URLs elsewhere).
- Fix Presale and Airdrop registration forms end-to-end: validation, backend submission, clear success/error toasts, disabled/loading states, and WhatsApp redirect after success with a correctly encoded prefilled message plus a popup-blocked fallback link.
- Enforce timer-based lock/unlock for Presale/Airdrop forms based strictly on backend remaining-time values; prevent submission while locked and display clear English locked-state messaging with a smoothly updating countdown.
- Add a “My Submissions” view/area that fetches from the backend and shows the user’s Presale/Airdrop submission history (type, timestamp, key fields), updating after successful submission and not exposing other users’ records.
- Fix all other site forms to provide English validation and explicit success/error feedback, and to prevent unintended multiple submissions via proper loading/disabled handling.
- Implement a functional search box (desktop and mobile) that searches site content/pages (at minimum page titles/primary sections), shows results, and navigates to the selected route with graceful empty/no-match states.
- Preserve multipage router-based navigation while improving usability via consistent page shells/navigation so all routes remain reachable and route-change scroll behavior remains sensible.

**User-visible outcome:** The site looks modern and consistent, all routes remain usable, Telegram/WhatsApp links open the correct targets, Presale/Airdrop (and other) forms submit reliably with clear feedback and timer-based locking, users can view their own submission history, and the search box returns results and navigates to relevant pages.
