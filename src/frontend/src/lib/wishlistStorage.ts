import type { ProductInfo } from "../backend";

const WISHLIST_KEY = "user_wishlist";

export function getWishlistLS(): ProductInfo[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ProductInfo[];
  } catch {
    return [];
  }
}

export function addToWishlistLS(product: ProductInfo): void {
  const current = getWishlistLS();
  if (current.some((p) => p.id === product.id)) return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify([...current, product]));
}

export function removeFromWishlistLS(id: string): void {
  const current = getWishlistLS();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
}

export function isInWishlistLS(id: string): boolean {
  return getWishlistLS().some((p) => p.id === id);
}
