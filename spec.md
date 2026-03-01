# Specification

## Summary
**Goal:** Fix all compilation and runtime errors preventing the GenMitra Print Platform from deploying and opening in the browser.

**Planned changes:**
- Audit and fix Motoko syntax, type errors, and import issues in `backend/main.mo` and `backend/migration.mo` so the backend canister compiles and deploys successfully
- Ensure init/postupgrade hooks run without trapping and seed data (admin accounts and demo products) is present in stable storage after deploy
- Audit and fix all TypeScript compilation errors across frontend source files (`App.tsx`, page components, hooks, utilities) so the frontend bundle builds without errors
- Ensure the homepage renders without a blank screen or blocking console errors, navigation works without runtime crashes, and the admin route guard correctly redirects unauthenticated users
- Verify and fix `dfx.json` canister configuration so both frontend and backend canisters are correctly specified and the full deployment pipeline completes without errors

**User-visible outcome:** The application opens correctly in a browser, the homepage renders, navigation works, and the backend canister responds to calls without errors.
