import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetMyOrders } from '../hooks/useQueries';
import { Package, ChevronRight, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import type { Order } from '../backend';
import { OrderStatus } from '../backend';

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case OrderStatus.New:
      return <Clock className="w-4 h-4 text-blue-500" />;
    case OrderStatus.Processing:
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case OrderStatus.Printed:
      return <Package className="w-4 h-4 text-purple-500" />;
    case OrderStatus.Shipped:
      return <Truck className="w-4 h-4 text-orange-500" />;
    case OrderStatus.Delivered:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.New: return 'bg-blue-100 text-blue-700';
    case OrderStatus.Processing: return 'bg-yellow-100 text-yellow-700';
    case OrderStatus.Printed: return 'bg-purple-100 text-purple-700';
    case OrderStatus.Shipped: return 'bg-orange-100 text-orange-700';
    case OrderStatus.Delivered: return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">Failed to load orders. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order: Order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              navigate({
                to: '/order/$orderId',
                params: { orderId: order.orderId },
                search: { category: undefined },
              })
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">Order #{order.orderId.slice(-8)}</span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · Placed on {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Payment: <span className="font-medium">{order.paymentMethod}</span> ·{' '}
                  <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">₹{order.total.toFixed(2)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
