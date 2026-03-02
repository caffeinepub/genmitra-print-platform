import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { useTrackOrder } from '../hooks/useQueries';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/layout/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useTrackOrder(orderId || '');

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll start processing it right away.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Order Details</h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : order ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium text-foreground">#{order.orderId.slice(-10).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium text-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-foreground">₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-medium text-foreground">{order.paymentMethod} ({order.paymentStatus})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Delivery</span>
                <span className="font-medium text-foreground">{order.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ship to</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">
                  {order.shippingAddress.fullName}, {order.shippingAddress.city}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium text-foreground">#{orderId.slice(-10).toUpperCase()}</span>
              </div>
              <p className="text-muted-foreground text-xs">Order details will be available shortly.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            View My Orders
          </button>
          <button
            onClick={() => navigate({ to: '/', search: { category: undefined } })}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
