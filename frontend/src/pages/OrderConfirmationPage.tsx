import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useTrackOrder } from '../hooks/useQueries';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ from: '/layout/order-confirmation/$orderId' });
  const { data: order, isLoading } = useTrackOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f6f7' }}>
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f5f6f7' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-card border border-gray-100 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Thank you for your order. We'll start processing it right away.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-medium text-gray-700">#{order.orderId.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-[#2874f0]">₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium text-gray-700">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Est. Delivery</span>
                <span className="font-medium text-gray-700">{order.estimatedDelivery}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}
              className="w-full py-3 bg-[#2874f0] text-white font-semibold rounded hover:bg-[#1f5bb8] transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Track My Order
            </button>
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined, search: undefined } })}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
