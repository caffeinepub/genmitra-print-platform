import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from 'lucide-react';
import { useTrackOrder } from '../hooks/useQueries';
import { getImageSrc } from '../utils/imageHelpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '../backend';

const statusSteps = [
  { status: OrderStatus.New, label: 'Order Placed', icon: Clock },
  { status: OrderStatus.Processing, label: 'Processing', icon: Package },
  { status: OrderStatus.Printed, label: 'Printed', icon: CheckCircle },
  { status: OrderStatus.Shipped, label: 'Shipped', icon: Truck },
  { status: OrderStatus.Delivered, label: 'Delivered', icon: CheckCircle },
];

const statusOrder = [
  OrderStatus.New,
  OrderStatus.Processing,
  OrderStatus.Printed,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
];

function getStatusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Delivered: return 'default';
    case OrderStatus.Shipped: return 'secondary';
    case OrderStatus.Processing:
    case OrderStatus.Printed: return 'outline';
    default: return 'outline';
  }
}

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/layout/order/$orderId' });
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useTrackOrder(orderId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="bg-muted rounded-xl h-8 w-48 mb-6" />
        <div className="bg-muted rounded-xl h-32 mb-4" />
        <div className="bg-muted rounded-xl h-48" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h2>
        <Button onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}>
          Back to My Orders
        </Button>
      </div>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">Order Details</h1>
          <p className="text-sm text-muted-foreground mt-1">Order ID: {order.orderId}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
      </div>

      {/* Status Timeline */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Order Status</h2>
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            return (
              <div key={step.status} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs text-center ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
                {index < statusSteps.length - 1 && (
                  <div className={`absolute h-0.5 w-full top-5 left-1/2 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => {
            const productImageSrc = getImageSrc(item.product.imageData);
            const customImageSrc = getImageSrc(item.customImageData);
            return (
              <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {customImageSrc ? (
                    <img src={customImageSrc} alt="Custom" className="w-full h-full object-cover" />
                  ) : productImageSrc ? (
                    <img src={productImageSrc} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                  <p className="text-sm text-muted-foreground">Qty: {Number(item.quantity)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{(item.product.price * Number(item.quantity)).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between font-bold text-foreground">
          <span>Total</span>
          <span>₹{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Shipping Address
          </h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Info
          </h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="text-foreground font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="text-foreground font-medium">{order.estimatedDelivery}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
