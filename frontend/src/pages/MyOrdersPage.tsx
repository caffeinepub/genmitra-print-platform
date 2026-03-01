import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Package, ChevronRight, Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import { useGetMyOrders } from '../hooks/useQueries';
import { OrderStatus } from '../backend';
import type { Order } from '../backend';

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Delivered: return <CheckCircle className="w-4 h-4 text-green-500" />;
    case OrderStatus.Shipped: return <Truck className="w-4 h-4 text-orange-500" />;
    case OrderStatus.Processing:
    case OrderStatus.Printed: return <Clock className="w-4 h-4 text-blue-500" />;
    default: return <Package className="w-4 h-4 text-muted-foreground" />;
  }
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
    case OrderStatus.Shipped: return 'bg-orange-100 text-orange-800';
    case OrderStatus.Processing: return 'bg-blue-100 text-blue-800';
    case OrderStatus.Printed: return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetMyOrders();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
            <Package className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
          <button
            onClick={() => navigate({ to: '/', search: { category: undefined } })}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div
              key={order.orderId}
              onClick={() => navigate({ to: '/order/$orderId', params: { orderId: order.orderId }, search: { category: undefined } })}
              className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="font-semibold text-foreground text-sm">
                    #{order.orderId.slice(-10).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </span>
                <span className="font-bold text-foreground">₹{order.total.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Est. delivery: {order.estimatedDelivery}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
