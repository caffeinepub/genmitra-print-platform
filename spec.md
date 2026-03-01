# Specification

## Summary
**Goal:** Fix "disallowed origin" CORS errors in the frontend by allowing the Caffeine preview domain `https://sole-aqua-rc6-draft.caffeine.xyz` across all origin checks.

**Planned changes:**
- Add `https://sole-aqua-rc6-draft.caffeine.xyz` to all hardcoded origin whitelist arrays in the frontend codebase
- Update all `window.addEventListener('message', ...)` handlers that perform origin checks to permit the Caffeine preview domain
- Remove or update any Content-Security-Policy meta tags in `index.html` that would block scripts, frames, or connections from the Caffeine preview domain
- Ensure all `postMessage` calls in the canvas-based editor (EditorPage.tsx) and related components explicitly allow this origin

**User-visible outcome:** The canvas customization editor loads and functions correctly (image upload, drag, zoom, rotation) on the Caffeine preview deployment without any "disallowed origin" errors in the browser console.
