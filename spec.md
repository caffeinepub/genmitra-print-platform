# Specification

## Summary
**Goal:** Add a second hardcoded admin seed account (`admin` / `Admin@1234`) to the backend so it is always available after initialization or upgrade.

**Planned changes:**
- In `backend/main.mo`, upsert a user record with username `admin`, password `Admin@1234`, and role `admin` inside `system func init()`
- In `backend/main.mo`, upsert the same `admin` / `Admin@1234` / role `admin` record inside `system func postupgrade()`
- Ensure the existing `genmitra` admin and user seeds remain unaffected

**User-visible outcome:** Logging in with username `admin` and password `Admin@1234` grants admin access and redirects to the admin panel.
