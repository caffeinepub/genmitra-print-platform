import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ from: '/layout/order-confirmation/$orderId' });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">
          Thank you for your order. We've received your request and will start processing it shortly.
        </p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-8">
            Order ID: <span className="font-mono font-medium text-gray-600">{orderId}</span>
          </p>
        )}

        <div className="bg-blue-50 rounded-xl p-4 mb-8 flex items-center gap-3">
          <Package className="w-6 h-6 text-primary flex-shrink-0" />
          <p className="text-sm text-gray-700 text-left">
            You'll receive an email confirmation shortly. Track your order status in{' '}
            <strong>My Orders</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() =>
              navigate({
                to: '/order/$orderId',
                params: { orderId },
                search: { category: undefined },
              })
            }
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Track Order
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate({ to: '/', search: { category: undefined } })}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
