import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useTrackOrder } from '../hooks/useQueries';
import { getImageSrc } from '../utils/imageHelpers';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, CreditCard } from 'lucide-react';
import { OrderStatus } from '../backend';
import type { Order } from '../backend';

const STATUS_STEPS = [
  { key: OrderStatus.New, label: 'Order Placed', icon: Clock },
  { key: OrderStatus.Processing, label: 'Processing', icon: AlertCircle },
  { key: OrderStatus.Printed, label: 'Printed', icon: Package },
  { key: OrderStatus.Shipped, label: 'Shipped', icon: Truck },
  { key: OrderStatus.Delivered, label: 'Delivered', icon: CheckCircle },
];

function getStepIndex(status: OrderStatus): number {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ from: '/layout/order/$orderId' });
  const { data: order, isLoading, error } = useTrackOrder(orderId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Order Not Found</h2>
          <p className="text-red-600">We couldn't find this order. It may have been removed or you may not have access.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <span className="text-sm text-gray-500">#{order.orderId.slice(-8)}</span>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-6">Order Status</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all"
            style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />
          {STATUS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            return (
              <div key={step.key} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Placed on {formatDate(order.createdAt)} · Estimated delivery: {order.estimatedDelivery}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Items ({order.items.length})</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.customImageData ? (
                  <img
                    src={getImageSrc(item.customImageData)}
                    alt="Custom"
                    className="w-full h-full object-cover"
                  />
                ) : item.product.imageData ? (
                  <img
                    src={getImageSrc(item.product.imageData)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                <p className="text-sm text-gray-500">Qty: {Number(item.quantity)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ₹{(item.product.price * Number(item.quantity)).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">₹{item.product.price} each</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-xl text-primary">₹{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Shipping Address</h2>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Payment Info</h2>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="font-medium text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold text-primary">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
