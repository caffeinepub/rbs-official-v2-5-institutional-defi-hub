# Backend-Only Alerts System Implementation

This build adds backend persistence and API for the Persistent Alerts System.

## Scope
- Backend methods for creating, fetching, marking read, and deleting alerts
- Backend trigger system for automated alert generation
- Frontend React Query hooks for alerts management
- **NO visual design changes** to any frontend pages

## Out of Scope
- No modifications to `frontend/src/pages/AlertsCenterPage.tsx` styling or layout
- No changes to `frontend/src/index.css` theme variables
- No changes to `frontend/tailwind.config.js`
- No new UI components or notification prompts

## Backend Methods Added
- `createAlert(title, message)` - Create a new alert
- `getAlerts()` - Fetch all alerts for the caller
- `markAlertAsRead(alertId)` - Mark an alert as read
- `deleteAlert(alertId)` - Delete an alert
- `enableTrigger(enable)` - Enable/disable automatic alert generation
- `checkAndCreateAutoAlert()` - Manually trigger auto-alert creation

## Frontend Integration
React Query hooks added to `frontend/src/hooks/useQueries.ts`:
- `useGetAlerts()` - Query hook for fetching alerts
- `useCreateAlert()` - Mutation hook for creating alerts
- `useMarkAlertAsRead()` - Mutation hook for marking alerts as read
- `useDeleteAlert()` - Mutation hook for deleting alerts
- `useEnableTrigger()` - Mutation hook for enabling/disabling triggers
- `useCheckAndCreateAutoAlert()` - Mutation hook for manual trigger

All alerts are persisted per Principal and survive logout/login and canister upgrades.
