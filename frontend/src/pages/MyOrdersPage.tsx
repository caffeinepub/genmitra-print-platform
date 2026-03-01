import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyOrders } from '../hooks/useQueries';
import { OrderStatus } from '../backend';
import type { Order } from '../backend';

function statusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.New: return 'bg-gray-100 text-gray-700';
    case OrderStatus.Processing: return 'bg-blue-100 text-blue-700';
    case OrderStatus.Printed: return 'bg-purple-100 text-purple-700';
    case OrderStatus.Shipped: return 'bg-orange-100 text-orange-700';
    case OrderStatus.Delivered: return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const statusStr = String(order.status);

  return (
    <div
      className="bg-card rounded-2xl shadow-card border border-border p-5 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
      onClick={() => navigate({ to: '/order/$orderId', params: { orderId: order.orderId } })}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              Order #{order.orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.total.toFixed(0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
            {statusStr}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Est. delivery: {order.estimatedDelivery}</span>
        <span>{order.paymentMethod}</span>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetMyOrders();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground font-display mb-8">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-8">Start shopping to see your orders here</p>
          <Button
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
            onClick={() => navigate({ to: '/', search: { category: undefined } })}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
