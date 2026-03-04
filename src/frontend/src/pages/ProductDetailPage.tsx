import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  Heart,
  Info,
  Pencil,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Upload,
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
  const isAcrylicMagnet = product.category === "Acrylic Magnets";

  const handleStartCustomizing = () => {
    if (isCircleMagnet) {
      navigate({
        to: "/circle-magnet-editor/$productId",
        params: { productId: product.id },
        search: { size: sizeToUse },
      });
    } else if (isMagnet || isAcrylicMagnet) {
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

  // Parse bullet description lines (lines starting with •)
  const descriptionLines = product.description.split("\n");
  const descriptionIntro = descriptionLines[0];
  const descriptionBullets = descriptionLines
    .slice(1)
    .filter((l) => l.trim().startsWith("•"))
    .map((l) => l.replace(/^•\s*/, "").trim());

  // Acrylic Magnets get a special product detail layout matching the reference
  if (isAcrylicMagnet) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/",
                  search: { category: undefined, search: undefined },
                })
              }
              className="hover:text-purple-600 transition-colors flex items-center gap-1"
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
              className="hover:text-purple-600 transition-colors"
            >
              {product.category}
            </button>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Product Images */}
            <div>
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-3 border border-gray-100">
                <img
                  src={
                    imgSrc ||
                    "/assets/generated/acrylic-fridge-magnets.dim_600x600.png"
                  }
                  alt={product.name}
                  className="w-full object-contain"
                  style={{ maxHeight: "440px" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/generated/acrylic-fridge-magnets.dim_600x600.png";
                  }}
                />
              </div>
              {/* Thumbnail strip */}
              <div className="flex gap-2">
                <div className="w-20 h-20 border-2 border-purple-600 rounded overflow-hidden cursor-pointer">
                  <img
                    src={
                      imgSrc ||
                      "/assets/generated/acrylic-fridge-magnets.dim_600x600.png"
                    }
                    alt="thumb"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/generated/acrylic-fridge-magnets.dim_600x600.png";
                    }}
                  />
                </div>
                <div className="w-20 h-20 border border-gray-200 rounded overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-xs font-semibold text-gray-500 leading-tight">
                      Size chart
                    </div>
                    <div className="flex gap-0.5 mt-1 justify-center flex-wrap">
                      {["circle", "square", "rect", "circle2"].map((id, _i) => {
                        const shapes: Record<string, string> = {
                          circle: "○",
                          square: "□",
                          rect: "◻",
                          circle2: "○",
                        };
                        return (
                          <span key={id} className="text-gray-400 text-xs">
                            {shapes[id]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 border border-gray-200 rounded overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="text-xs font-semibold text-gray-500 leading-tight">
                      Material chart
                    </div>
                    <div className="flex gap-1 mt-1 justify-center">
                      <div className="w-5 h-5 rounded-full bg-gray-200 border border-gray-300" />
                      <div className="w-5 h-5 rounded-full bg-gray-700 border border-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-4 mt-1"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Short description */}
              <p className="text-sm text-teal-600 mb-3">{descriptionIntro}</p>

              {/* Bullet points */}
              {descriptionBullets.length > 0 && (
                <ul className="mb-5 space-y-1">
                  {descriptionBullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-teal-700"
                    >
                      <span className="text-teal-500 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Shape & Style dropdown */}
              <div className="flex items-center gap-4 mb-4">
                <label
                  htmlFor="shape-style-select"
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap w-28"
                >
                  Shape &amp; Style
                </label>
                <select
                  id="shape-style-select"
                  data-ocid="product.select"
                  value={selectedSize || product.sizeOptions[0]}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-purple-500 bg-white"
                >
                  {product.sizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <label
                  htmlFor="acrylic-quantity-input"
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap w-28"
                >
                  Quantity
                </label>
                <div className="flex-1">
                  <input
                    id="acrylic-quantity-input"
                    type="number"
                    data-ocid="product.input"
                    min={1}
                    max={50}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(50, Number(e.target.value))),
                      )
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Choose a quantity between 1 - 50 for instant ordering. For
                    higher quantities, you will be allowed to request quotations
                    from Sales Team.
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-2xl font-bold text-orange-500">
                    ₹
                    {priceNum.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-sm text-gray-500">
                    inclusive of all taxes
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  for {quantity} Qty (₹
                  {priceNum.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  / piece)
                </p>
                <button
                  type="button"
                  className="text-sm text-purple-600 font-medium mt-1 flex items-center gap-1 hover:underline"
                >
                  Buy in bulk and save
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-5">
                <button
                  type="button"
                  data-ocid="product.upload_button"
                  onClick={handleStartCustomizing}
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload your Files
                </button>
                <button
                  type="button"
                  data-ocid="product.primary_button"
                  onClick={handleStartCustomizing}
                  className="flex-1 border border-gray-300 hover:border-purple-600 hover:text-purple-700 text-gray-700 font-semibold py-3 rounded flex items-center justify-center gap-2 transition-colors bg-white"
                >
                  <Pencil className="w-4 h-4" />
                  Create your Design
                </button>
              </div>

              {/* Wishlist */}
              <button
                type="button"
                data-ocid="product.secondary_button"
                onClick={handleToggleWishlist}
                className={`w-full py-2.5 border font-semibold rounded transition-colors flex items-center justify-center gap-2 text-sm mb-5 ${
                  inWishlist
                    ? "border-red-400 text-red-500 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
                />
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>

              {/* Estimate Delivery */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                  Estimate Delivery
                </h4>
                <input
                  type="text"
                  placeholder="Pincode"
                  data-ocid="product.input"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
