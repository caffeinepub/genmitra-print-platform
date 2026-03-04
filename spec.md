# GenMitra Print Platform

## Current State
Full-stack print and personalised gifts platform with Photo Prints, Photo Frames, Photo Magnets (square/rectangle), Circle Magnets, Mugs, and Corporate Gifts. Includes magnet editors (MagnetEditorPage, CircleMagnetEditorPage), a frame editor (EditorPage), product detail pages, admin panel, cart, checkout, and user profile.

## Requested Changes (Diff)

### Add
- New demo product "Acrylic Photo Fridge Magnets" (id: demo-acrylic-fridge-magnet-1, category: "Acrylic Magnets", price ₹884, sizeOptions: Circle/Square/Rectangle/Heart/Star, bullet-point description)
- Generated product image for acrylic fridge magnets
- "Acrylic Magnets" category entry in ProductCategoryGrid (6th category, pink theme)
- Special ProductDetailPage layout for isAcrylicMagnet products matching the reference: Shape & Style dropdown, quantity number input with helper text, price in orange with tax info, bulk savings link, "Upload your Files" purple CTA + "Create your Design" outlined CTA, pincode delivery estimate, thumbnail strip

### Modify
- demoProducts.ts — added acrylic fridge magnet entry
- ProductDetailPage.tsx — added isAcrylicMagnet detection and dedicated layout branch
- ProductCategoryGrid.tsx — added Acrylic Magnets category, grid updated to 6 columns

### Remove
- Nothing removed

## Implementation Plan
1. Generate acrylic-fridge-magnets product image
2. Add demo product entry to demoProducts.ts
3. Add Acrylic Magnets category to ProductCategoryGrid
4. Add isAcrylicMagnet layout branch to ProductDetailPage with full reference-matching UI
5. Deploy
