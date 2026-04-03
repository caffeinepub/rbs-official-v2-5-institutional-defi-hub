# RBS Official — Account Counter + Market Intel Accuracy + Bug Fixes

## Current State
- Multi-page RBS token site with Motoko backend, persistent profiles, global passcode system
- Header shows RBSSuperior logo badge at top left
- Market Intel (G-Man Intelligence) uses 10-indicator weighted scoring + Gemini AI
- useActor.ts calls `_initializeAccessControlWithSecret` which throws for non-admin users, potentially causing silent actor failures
- No live account registration count shown anywhere

## Requested Changes (Diff)

### Add
- `getTotalUserCount` public query in backend — returns `Nat` (count of registered profiles)
- `useAccountCount` hook in frontend — polls backend every 30s for live count
- Account count badge in Header, positioned just below the RBSSuperior logo text, showing e.g. "1,247 Members" with a pulsing green dot
- IDL declarations for `getTotalUserCount`

### Modify
- `useActor.ts` — wrap `_initializeAccessControlWithSecret` in try/catch so actor still initializes when it throws for regular users
- `useGenerateSignal.ts` — improve Gemini prompt to be more precise, add stronger confidence weighting for high-confidence signals
- `backend.did.js` and `backend.did.d.ts` — add `getTotalUserCount` method
- Header — add members count widget below logo

### Remove
- Nothing removed

## Implementation Plan
1. Add `getTotalUserCount` query to `main.mo` (returns `userProfiles.size()`)
2. Update `backend.did.js` IDL to include `getTotalUserCount`
3. Update `backend.did.d.ts` to include `getTotalUserCount` type
4. Create `useAccountCount.ts` hook with 30s polling
5. Update `Header.tsx` to show live member count below logo
6. Fix `useActor.ts` to catch `_initializeAccessControlWithSecret` errors silently
7. Enhance `useGenerateSignal.ts` Gemini prompt for accuracy
