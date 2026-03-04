import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Heart, SearchX, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetProducts } from "../hooks/useQueries";
import { demoProducts } from "../lib/demoProducts";
import {
  addToWishlistLS,
  getWishlistLS,
  isInWishlistLS,
  removeFromWishlistLS,
} from "../lib/wishlistStorage";
import { getImageSrc } from "../utils/imageHelpers";

interface FeaturedProductsProps {
  categoryFilter?: string;
  searchQuery?: string;
}

export default function FeaturedProducts({
  categoryFilter,
  searchQuery,
}: FeaturedProductsProps) {
  const navigate = useNavigate();
  const { data: backendProducts, isLoading } = useGetProducts();

  // Track wishlist state locally so heart button updates instantly
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(
    () => new Set(getWishlistLS().map((p) => p.id)),
  );

  // Keep wishlist in sync when localStorage changes (cross-tab)
  useEffect(() => {
    const sync = () =>
      setWishlistIds(new Set(getWishlistLS().map((p) => p.id)));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Merge: backend products + demo products (demo fills gaps, backend overrides demo by id)
  const backendIds = new Set((backendProducts || []).map((p) => p.id));
  const allProducts = [
    ...(backendProducts || []),
    ...demoProducts.filter((p) => !backendIds.has(p.id)),
  ];

  let filteredProducts = allProducts;

  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === categoryFilter.toLowerCase(),
    );
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const toggleWishlist = (
    e: React.MouseEvent,
    product: (typeof allProducts)[0],
  ) => {
    e.stopPropagation();
    if (isInWishlistLS(product.id)) {
      removeFromWishlistLS(product.id);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      addToWishlistLS(product);
      setWishlistIds((prev) => new Set([...prev, product.id]));
      toast.success("Added to wishlist ❤️");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"].map(
          (sk) => (
            <div key={sk} className="bg-white rounded-lg p-3 shadow-card">
              <Skeleton className="w-full aspect-square rounded mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ),
        )}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div
        data-ocid="products.empty_state"
        className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-card"
      >
        <SearchX className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {searchQuery
            ? `No products found for "${searchQuery}"`
            : "No products available"}
        </h3>
        <p className="text-gray-500 mb-6">
          {searchQuery
            ? "Try a different search term or browse our categories."
            : "Check back later for new products."}
        </p>
        <button
          type="button"
          data-ocid="products.primary_button"
          onClick={() =>
            navigate({
              to: "/",
              search: { category: undefined, search: undefined },
            })
          }
          className="px-6 py-2 bg-[#2874f0] text-white rounded font-medium hover:bg-[#1f5bb8] transition-colors"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  return (
    <section className="mb-8">
      {!searchQuery && !categoryFilter && (
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-[#2874f0]" />
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
        </div>
      )}
      <div
        data-ocid="products.list"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {filteredProducts.map((product, index) => {
          const imgSrc = getImageSrc(product.imageData);
          const inWishlist = wishlistIds.has(product.id);
          return (
            <div
              key={product.id}
              data-ocid={`products.item.${index + 1}`}
              className="relative bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group overflow-hidden border border-gray-100"
            >
              {/* Wishlist heart */}
              <button
                type="button"
                data-ocid={`products.toggle.${index + 1}`}
                aria-label={
                  inWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
                onClick={(e) => toggleWishlist(e, product)}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    inWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                />
              </button>

              <button
                type="button"
                className="w-full text-left"
                onClick={() =>
                  navigate({
                    to: "/product/$productId",
                    params: { productId: product.id },
                    search: { category: undefined },
                  })
                }
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={
                      imgSrc ||
                      "/assets/generated/photo-print-1.dim_600x600.png"
                    }
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (
                        img.src !==
                        `${window.location.origin}/assets/generated/photo-print-1.dim_600x600.png`
                      ) {
                        img.src =
                          "/assets/generated/photo-print-1.dim_600x600.png";
                      }
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#2874f0] font-medium mb-1 truncate">
                    {product.category}
                  </p>
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-gray-900">
                      ₹{Number(product.price).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {product.deliveryTime}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
