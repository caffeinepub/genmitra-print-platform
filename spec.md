# Specification

## Summary
**Goal:** Remove the multi-row product listing grid section from the homepage.

**Planned changes:**
- Remove the product listing grid section from `frontend/src/pages/HomePage.tsx` and any component it delegates to that displays product cards with category labels, prices, and delivery times (e.g., Digital Printed Notebook, Digital Wall Art, Custom Canvas Prints, Custom Water Bottles, Wooden Photo Frame, Metallic Frame, Collage Frame, Square Photo Magnets, Family Magnet Set, Classic White Photo Mug, Color Changing Mug, Classic 4×6 Prints, Premium Matte Prints, Square Prints, etc.)

**User-visible outcome:** The homepage no longer shows the multi-row product listing grid, while all other sections (hero banner, category grid, featured products, shop frames by size, offers banner, trust features, customer reviews, FAQ, footer) remain intact.
