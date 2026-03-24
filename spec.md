# RBS Official

## Current State
Profile badge tags are calculated from `registrationDateMs` (account age since first registration), which is correct in intent but broken in practice — the badge never shows if the backend call returns null (no localStorage fallback for badge calculation). Username is permanently locked after first save (backend traps on any username change). localStorage username takes priority over backend, causing stale data to shadow correct backend values. Display name and username save/load is partially broken due to these conflicts.

## Requested Changes (Diff)

### Add
- localStorage fallback for registration date used in badge calculation (so badge shows even if backend query fails)
- `updateCallerUsername` backend method that checks uniqueness but allows username changes
- Real-time backend source of truth for both username and display name (backend always wins over localStorage)

### Modify
- Backend `saveCallerUserProfile`: remove the hard trap that prevents username changes; allow updates with uniqueness enforcement
- `ProfilePage.tsx`: backend value is source of truth for username (not localStorage); add fallback chain for registration date
- `ProfileSetupModal.tsx`: ensure registration timestamp is persisted in localStorage as fallback at first save
- Upgrade profile page UI with better layout, cleaner badge display, and improved edit flows

### Remove
- Logic where `localProfile?.username` shadows backend username

## Implementation Plan
1. Fix `main.mo`: remove username-change trap, enforce uniqueness on updates
2. Fix `ProfilePage.tsx`: backend username as source of truth, localStorage fallback for registration date badge
3. Fix `ProfileSetupModal.tsx`: ensure registration date fallback is set
4. Upgrade profile page visual design and UX
