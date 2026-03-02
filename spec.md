# Specification

## Summary
**Goal:** Fix all TypeScript compilation errors, routing issues, backend Motoko compilation errors, and runtime bugs across the GenMitra application so that it deploys and runs successfully.

**Planned changes:**
- Fix all TypeScript compilation errors in the frontend codebase (App.tsx, page components, hooks, utility files) so the frontend bundle builds without errors
- Remove conflicting `id` + `path` properties on route objects in App.tsx so the router initializes without errors
- Fix Motoko compilation and runtime errors in `backend/main.mo` and `backend/migration.mo` so the canister deploys successfully
- Fix `imageHelpers.ts` and all image-rendering components to remove erroneous `data:image/...;base64,` prefixes prepended to plain HTTP URLs
- Fix `useAdminSession.ts` so the `login` function correctly accepts both hardcoded admin credentials (`genmitra`/`12345678` and `admin`/`Admin@1234`)
- Fix `LoginPage.tsx` to show only the username/password form in admin mode and correctly call the appropriate login hook based on mode, with proper redirects
- Fix `AdminGuard.tsx` to only use `useAdminSession` for session checking and never trigger Internet Identity
- Fix backend role-check guards in `main.mo` for all write-protected functions, and ensure both admin seed accounts and the user seed are upserted in `init()` and `postupgrade()`
- Fix all mutation hooks in `useQueries.ts` to use the authenticated actor instead of an anonymous actor
- Fix `useGetProduct` hook and `ProductDetailPage.tsx` to correctly extract and pass the product ID, and ensure demo product seeds are always present after deploy
- Fix `index.html` CSP meta tag to remove `frame-ancestors` and add `https://sole-aqua-rc6-draft.caffeine.xyz` to all relevant directives and origin whitelists
- Add missing `<DialogDescription>` elements to every `DialogContent` across the frontend codebase

**User-visible outcome:** The application builds and deploys without errors. Admin login works with valid credentials, product images display correctly, admin CRUD operations succeed, product detail pages load properly, and no accessibility warnings or CSP errors appear in the browser console.
