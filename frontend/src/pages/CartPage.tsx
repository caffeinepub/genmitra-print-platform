import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useRemoveFromCart, useClearCart } from '../hooks/useQueries';
import { getImageSrc } from '../utils/imageHelpers';
import { ShoppingCart, Trash2, Package, AlertCircle, Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import type { CartItem } from '../backend';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading } = useGetCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const total = cartItems?.reduce(
    (sum, item) => sum + item.product.price * Number(item.quantity),
    0
  ) ?? 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started.</p>
          <button
            onClick={() => navigate({ to: '/', search: { category: undefined } })}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
        </h1>
        <button
          onClick={() => setClearDialogOpen(true)}
          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item: CartItem, index: number) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.customImageData ? (
                    <img
                      src={getImageSrc(item.customImageData)}
                      alt="Custom"
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
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                  <p className="text-sm text-gray-500">Category: {item.product.category}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{Number(item.quantity)}</span>
                      <button className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">
                        ₹{(item.product.price * Number(item.quantity)).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart.mutate(item.product.id)}
                        disabled={removeFromCart.isPending}
                        className="text-red-400 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-primary text-xl">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate({ to: '/checkout', search: { category: undefined } })}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
              className="w-full mt-3 text-primary border border-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Clear Cart Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Clear Cart</DialogTitle>
            <DialogDescription className="sr-only">
              Confirm clearing all items from your cart
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-2">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-gray-600">Are you sure you want to remove all items from your cart?</p>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() => setClearDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                clearCart.mutate();
                setClearDialogOpen(false);
              }}
              disabled={clearCart.isPending}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
