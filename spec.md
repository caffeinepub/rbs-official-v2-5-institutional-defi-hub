# RBS Official — Profile Immutability, Visual Upgrades & Full Review

## Current State
- Profile system stores `username` and `displayName` in Motoko backend; both fields are editable on ProfilePage after first set
- `saveCallerUserProfile` allows unlimited re-saving, including changing username/displayName
- Market Intel uses `useGlobalSectionLock` with `setGlobalSectionLock` and `toggleGlobalSectionLock`; actor initialization wraps `_initializeAccessControlWithSecret` which can fail for normal users
- ProfilePage allows editing display name and username via inline edit buttons at any time
- ProfileSetupModal allows initial profile creation (username + displayName)
- Visual design is white theme with sky-500 accents; various pages are functional
- Account age badges based on `userRegistrationDates` backend storage
- All navigation, footer links, trading tools, market intel are present

## Requested Changes (Diff)

### Add
- Backend: `profileLocked` boolean field tracked per-user in backend — once both `username` and `displayName` are set (i.e. profile saved at least once), a flag is set and subsequent saves are only allowed for `avatarUrl` and `email` fields
- Backend: new function `isProfileLocked(principal)` — query that returns bool
- Backend: `getCallerProfileLockStatus()` — query for caller to check if their profile is locked
- Profile page: locked state indicator — show a lock icon badge next to username/displayName once locked, hide Edit buttons for those fields
- Profile setup modal: display a clear notice that username and display name cannot be changed after creation
- Visual improvements across: hero section, profile page cards, market intel lock screen, header glow, footer

### Modify
- Backend `saveCallerUserProfile`: after the first successful profile save (profile exists), reject any attempt to change `username` or `displayName`; only allow updating `avatarUrl` and `email`
- ProfilePage: remove Edit buttons for `displayName` and `username` once profile is locked; only avatar change and email remain editable
- ProfileSetupModal: add warning text "Username and display name are permanent — choose carefully"
- `useActor`: wrap `_initializeAccessControlWithSecret` in try/catch (already done) — verify it stays correct
- Visual design: improve cards, gradients, spacing, animations across ProfilePage, MarketIntelPage, Header, Footer

### Remove
- ProfilePage edit buttons for username and display name after the profile is locked
- Any stale references to removed sections in navigation or dead links

## Implementation Plan

1. **Motoko backend** — Add `profileLockedUsers` map to track which principals have a locked profile. Modify `saveCallerUserProfile` to:
   - On first save (no existing profile): save normally, then mark the profile as locked
   - On subsequent saves: only allow updating `avatarUrl` and `email`; reject `username`/`displayName` changes with a trap
   - Add `getCallerProfileLockStatus()` query function

2. **IDL declarations** — Add `getCallerProfileLockStatus` to both `backend.did.js` IDL and `backend.did.d.ts`

3. **ProfileSetupModal** — Add warning text: "Your username and display name are permanent and cannot be changed after registration"

4. **ProfilePage** — Query `getCallerProfileLockStatus()` on load. If locked, hide Edit buttons for `displayName` and `username`; show a lock badge icon instead. Keep avatar and (future) email editable. Improve visual layout with better card design, gradient badges, animated lock indicators.

5. **Visual upgrades** — Improve overall visual quality: better gradient hero banners, refined card shadows and borders, smoother animations, premium typography hierarchy on ProfilePage, MarketIntelPage lock screen, and HomePage.
