import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrackOrder } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/layout/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useTrackOrder(orderId as string);

  const safeOrderId = (orderId as string) || '';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-foreground font-display mb-2">
        Order Confirmed! 🎉
      </h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your order. We'll start processing it right away.
      </p>

      {/* Order Details Card */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6 text-left mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-foreground">Order Details</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : order ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-foreground text-xs">{order.orderId.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span className="text-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">₹{order.total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment</span>
              <span className="text-foreground">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="text-foreground font-medium">{order.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {String(order.status)}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-foreground text-xs">{safeOrderId.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-600 font-medium">Confirmed</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2 shadow-purple"
          onClick={() => navigate({ to: '/my-orders' })}
        >
          <Package className="h-4 w-4" />
          Track Order
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="rounded-xl gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => navigate({ to: '/', search: { category: undefined } })}
        >
          <Home className="h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
