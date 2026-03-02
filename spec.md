# Specification

## Summary
**Goal:** Fix two runtime errors: a disallowed origin error for iframe/postMessage communication and a router crash caused by routes having both an `id` and a `path` option.

**Planned changes:**
- Audit all `postMessage` origin whitelists, hardcoded allowed-origin arrays, and CSP `<meta>` tags in `frontend/index.html` to add `https://sole-aqua-rc6-draft.caffeine.xyz` without removing any existing allowed origins.
- Audit `frontend/src/App.tsx` and remove the conflicting `id` property from any route that simultaneously defines both `id` and `path`, so the router initializes without error.

**User-visible outcome:** The app loads at `https://sole-aqua-rc6-draft.caffeine.xyz` without a "disallowed origin" console error or an uncaught "Route cannot have both an id and a path option" crash, and all existing routes remain accessible.
