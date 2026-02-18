# Specification

## Summary
**Goal:** Fix Internet Identity authentication reliability and ensure Acquisition Portal timers (Q1 2027 presale, Q1 2029 airdrop) unlock correctly with WhatsApp redirection, without changing the existing visual design.

**Planned changes:**
- Improve frontend login/logout flow to prevent inconsistent authenticated states (e.g., repeated clicks, “already authenticated” loops) and ensure gated pages become accessible immediately after login without a hard refresh.
- Complete/repair actor + AccessControl initialization and cache/cleanup behavior so authenticated pages consistently load data after login and do not call authenticated endpoints with stale identity after logout.
- Fix backend timer timestamp/remaining-time logic so presale (Q1 2027) and airdrop (Q1 2029) unlock at correct UTC times and remaining time values are returned in nanoseconds (0 when passed).
- Ensure both Acquisition Portal forms redirect to WhatsApp (+92 329 4238997 via https://wa.me/923294238997) when unlocked, and that submissions made before unlock auto-redirect once the countdown reaches zero using the existing pending sessionStorage flow.

**User-visible outcome:** Users can reliably log in and log out without refresh loops, authenticated sections consistently work after login, and the presale/airdrop forms unlock at the correct times and open WhatsApp to the configured number (including automatic redirect for submissions made before unlock).
