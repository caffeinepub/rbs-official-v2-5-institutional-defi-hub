# RBS Official — Gemini AI & Passcode Fix

## Current State
RBS token site with G-Man Intel, Developer Blog, Polls gated by BP2420075112009BP.
Backend setGlobalSectionLock has access control + passcode check causing failures.
Signal generation is math-only, no Gemini.

## Requested Changes (Diff)

### Add
- Gemini AI call in useGenerateSignal.ts after computing 9 indicators

### Modify
- Backend: remove access control gate from setGlobalSectionLock, toggleGlobalSectionLock, createPoll, publishBlogPost, createBlogPost (passcode is the only gate)
- useGenerateSignal.ts: call Gemini 1.5 Flash API to enhance signal
- Show AI Enhanced badge when Gemini responds
- Fix all BNB Chain references
- Improve profile UX

### Remove
- Access control (#user) checks from passcode-gated functions

## Implementation Plan
1. Regenerate backend with passcode-only gates
2. Update useGenerateSignal.ts with Gemini call
3. Fix BNB Chain references and profile UX
