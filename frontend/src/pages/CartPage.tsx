import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useRemoveFromCart, useClearCart } from '../hooks/useQueries';
import { getImageSrc } from '../utils/imageHelpers';
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading } = useGetCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const items = cartItems ?? [];

  const subtotal = items.reduce((sum, item) => {
    return sum + item.product.price * Number(item.quantity);
  }, 0);

  const shipping = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-card p-12 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty!</h2>
            <p className="text-gray-500 mb-8">Add items to it now.</p>
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined, search: undefined } })}
              className="px-8 py-3 bg-[#2874f0] text-white font-semibold rounded hover:bg-[#1f5bb8] transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Cart ({items.length} items)</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-3">
            {items.map((item, index) => {
              const imgSrc = getImageSrc(item.customImageData || item.product.imageData);
              const itemTotal = item.product.price * Number(item.quantity);

              return (
                <div key={`${item.product.id}-${index}`} className="bg-white rounded-lg shadow-card p-4 border border-gray-100">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded border border-gray-200 overflow-hidden">
                      <img
                        src={imgSrc || '/assets/generated/photo-print-1.dim_600x600.png'}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">Size: {item.selectedSize}</p>
                      <p className="text-xs text-gray-500 mb-2">Category: {item.product.category}</p>

                      <div className="flex items-center gap-4 flex-wrap">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded">
                            {Number(item.quantity)}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">₹{item.product.price.toFixed(0)} × {Number(item.quantity)}</span>
                          <span className="text-base font-bold text-gray-900">= ₹{itemTotal.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      disabled={removeFromCart.isPending}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={handleClear}
                disabled={clearCart.isPending}
                className="text-sm text-red-500 hover:text-red-700 transition-colors underline"
              >
                {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-card border border-gray-100 sticky top-24">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Price Details</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Price ({items.length} items)</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Delivery Charges</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>GST (18%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-green-600 text-xs mt-1 font-medium">
                      You save ₹49 on delivery!
                    </p>
                  )}
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => navigate({ to: '/checkout' })}
                  className="w-full py-3 bg-[#2874f0] text-white font-semibold rounded hover:bg-[#1f5bb8] transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                  <ShoppingBag className="w-4 h-4 text-[#2874f0]" />
                  <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
