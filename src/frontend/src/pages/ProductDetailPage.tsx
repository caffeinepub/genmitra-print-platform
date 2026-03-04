import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  Heart,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useGetProduct } from "../hooks/useQueries";
import { getDemoProductById } from "../lib/demoProducts";
import {
  addToWishlistLS,
  isInWishlistLS,
  removeFromWishlistLS,
} from "../lib/wishlistStorage";
import { getImageSrc } from "../utils/imageHelpers";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/layout/product/$productId" });
  const { data: backendProduct, isLoading } = useGetProduct(productId);

  const product = backendProduct ?? getDemoProductById(productId);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(() =>
    product ? isInWishlistLS(product.id) : false,
  );

  const handleToggleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlistLS(product.id);
      setInWishlist(false);
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      addToWishlistLS(product);
      setInWishlist(true);
      toast.success("Added to wishlist ❤️");
    }
  };

  if (isLoading && !product) {
    return (
      <div style={{ backgroundColor: "#f5f6f7" }} className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{ backgroundColor: "#f5f6f7" }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center bg-white rounded-lg shadow-card p-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Product not found
          </h2>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/",
                search: { category: undefined, search: undefined },
              })
            }
            className="px-6 py-2 bg-[#2874f0] text-white rounded font-medium hover:bg-[#1f5bb8] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const imgSrc = getImageSrc(product.imageData);
  const sizeToUse = selectedSize || (product.sizeOptions[0] ?? "A4");
  const priceNum = Number(product.price);
  const originalPrice = Math.round(priceNum * 1.2);

  const isMagnet = product.category === "Photo Magnets";
  const isCircleMagnet = product.category === "Circle Magnets";

  const handleStartCustomizing = () => {
    if (isCircleMagnet) {
      navigate({
        to: "/circle-magnet-editor/$productId",
        params: { productId: product.id },
        search: { size: sizeToUse },
      });
    } else if (isMagnet) {
      navigate({
        to: "/magnet-editor/$productId",
        params: { productId: product.id },
        search: { magnet: sizeToUse },
      });
    } else {
      navigate({
        to: "/editor/$productId",
        params: { productId: product.id },
        search: { size: sizeToUse },
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f6f7" }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/",
                search: { category: undefined, search: undefined },
              })
            }
            className="hover:text-[#2874f0] transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/",
                search: { category: product.category, search: undefined },
              })
            }
            className="hover:text-[#2874f0] transition-colors"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-50">
              <img
                src={
                  imgSrc || "/assets/generated/photo-print-1.dim_600x600.png"
                }
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/generated/photo-print-1.dim_600x600.png";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
              <p className="text-sm text-[#2874f0] font-medium mb-1">
                {product.category}
              </p>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{priceNum.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  17% off
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizeOptions.length > 0 && (
              <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${
                        (selectedSize || product.sizeOptions[0]) === size
                          ? "border-[#2874f0] bg-blue-50 text-[#2874f0]"
                          : "border-gray-300 text-gray-700 hover:border-[#2874f0]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors font-bold"
                >
                  −
                </button>
                <span className="text-lg font-semibold text-gray-800 w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                data-ocid="product.primary_button"
                onClick={handleStartCustomizing}
                className={`w-full py-3 font-bold rounded transition-colors flex items-center justify-center gap-2 text-base ${
                  isCircleMagnet
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : isMagnet
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-[#2874f0] text-white hover:bg-[#1f5bb8]"
                }`}
              >
                <Zap className="w-5 h-5" />
                {isCircleMagnet
                  ? "Design your Circle Magnet"
                  : isMagnet
                    ? "Create your Design"
                    : "Customize & Add to Cart"}
              </button>
              <button
                type="button"
                data-ocid="product.secondary_button"
                onClick={handleToggleWishlist}
                className={`w-full py-3 border font-semibold rounded transition-colors flex items-center justify-center gap-2 text-base ${
                  inWishlist
                    ? "border-red-400 text-red-500 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
                />
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-lg shadow-card border border-gray-100 p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-[#2874f0]" />
                  <span className="text-xs text-gray-600 font-medium">
                    Free Delivery
                  </span>
                  <span className="text-xs text-gray-400">Above ₹499</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-5 h-5 text-[#2874f0]" />
                  <span className="text-xs text-gray-600 font-medium">
                    Secure Pay
                  </span>
                  <span className="text-xs text-gray-400">100% Safe</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-5 h-5 text-[#2874f0]" />
                  <span className="text-xs text-gray-600 font-medium">
                    Easy Return
                  </span>
                  <span className="text-xs text-gray-400">7 Days</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-700 font-medium">
                Estimated delivery: {product.deliveryTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
