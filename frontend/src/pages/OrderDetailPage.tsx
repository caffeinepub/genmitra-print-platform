import React from 'react';
import { Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import { useTrackOrder } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

const ORDER_STATUS_STEPS = ['New', 'Processing', 'Printed', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/layout/order/$orderId' });
  const { data: order, isLoading, error } = useTrackOrder(orderId);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-destructive">Order not found or you don't have permission to view it.</p>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUS_STEPS.indexOf(order.status.toString());

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">Order Details</h1>
        <p className="text-muted-foreground text-sm mt-1 font-mono">{order.orderId}</p>
      </div>

      {/* Status Tracker */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Order Status
        </h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary transition-all"
            style={{ width: `${(currentStatusIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
          />
          {ORDER_STATUS_STEPS.map((status, index) => (
            <div key={status} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  index <= currentStatusIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Items ({order.items.length})
        </h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                <img
                  src={
                    item.product.imageData ||
                    item.product.templateImageData ||
                    '/assets/generated/frame-product-mockup.dim_800x800.png'
                  }
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size: {item.selectedSize} · Qty: {Number(item.quantity)}
                </p>
              </div>
              <p className="font-semibold text-foreground text-sm shrink-0">
                ₹{item.product.price * Number(item.quantity)}
              </p>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Delivery Address
        </h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
            {order.shippingAddress.pincode}
          </p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          Payment
        </h2>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Method</span>
            <span className="text-foreground font-medium">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`font-medium ${
                order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span className="text-foreground">{order.estimatedDelivery}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
