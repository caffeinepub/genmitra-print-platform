import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import type { CartItem } from "../backend";
import { useClearCart, useGetCart, useSaveCart } from "../hooks/useQueries";
import { getImageSrc } from "../utils/imageHelpers";

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems = [], isLoading } = useGetCart();
  const saveCart = useSaveCart();
  const clearCart = useClearCart();

  const [updatingIdx, setUpdatingIdx] = useState<number | null>(null);

  const updateQuantity = async (idx: number, delta: number) => {
    const item = cartItems[idx];
    const newQty = Number(item.quantity) + delta;
    if (newQty < 1) return;
    setUpdatingIdx(idx);
    const updated: CartItem[] = cartItems.map((ci, i) =>
      i === idx ? { ...ci, quantity: BigInt(newQty) } : ci,
    );
    try {
      await saveCart.mutateAsync(updated);
    } finally {
      setUpdatingIdx(null);
    }
  };

  const removeItem = async (idx: number) => {
    const updated = cartItems.filter((_, i) => i !== idx);
    await saveCart.mutateAsync(updated);
  };

  const handleClearCart = async () => {
    if (!confirm("Clear all items from cart?")) return;
    await clearCart.mutateAsync();
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
    0,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div
        data-ocid="cart.empty_state"
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Browse products to add items.</p>
        <Button
          data-ocid="cart.primary_button"
          onClick={() =>
            navigate({
              to: "/",
              search: { category: undefined, search: undefined },
            })
          }
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({cartItems.length})
        </h1>
        <button
          type="button"
          onClick={handleClearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {cartItems.map((item, idx) => (
          <div
            key={`${item.product.id}-${item.selectedSize ?? "default"}`}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            {/* Image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.customImageData ? (
                <img
                  src={item.customImageData}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : item.product.imageData ? (
                <img
                  src={getImageSrc(item.product.imageData)}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
              <p className="text-sm font-medium text-primary mt-1">
                ₹{Number(item.product.price).toLocaleString()} each
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(idx, -1)}
                disabled={updatingIdx === idx || Number(item.quantity) <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-medium">
                {updatingIdx === idx ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  Number(item.quantity)
                )}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(idx, 1)}
                disabled={updatingIdx === idx}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Total */}
            <div className="text-right min-w-[80px]">
              <p className="font-semibold text-gray-900">
                ₹
                {(
                  Number(item.product.price) * Number(item.quantity)
                ).toLocaleString()}
              </p>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => navigate({ to: "/checkout" })}
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
