import { useNavigate } from '@tanstack/react-router';
import { useGetMyOrders } from '../hooks/useQueries';
import { getImageSrc } from '../utils/imageHelpers';
import { Package, ShoppingBag, ChevronRight, Clock, CheckCircle, Truck, Printer, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../backend';

function getStatusConfig(status: OrderStatus) {
  switch (status) {
    case OrderStatus.New:
      return { label: 'Order Placed', color: 'bg-orange-100 text-orange-700', icon: AlertCircle };
    case OrderStatus.Processing:
      return { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Clock };
    case OrderStatus.Printed:
      return { label: 'Printed', color: 'bg-purple-100 text-purple-700', icon: Printer };
    case OrderStatus.Shipped:
      return { label: 'Shipped', color: 'bg-blue-100 text-blue-700', icon: Truck };
    case OrderStatus.Delivered:
      return { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: Package };
  }
}

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetMyOrders();

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-card p-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Unable to load orders</h2>
            <p className="text-gray-500 mb-6">Please login to view your orders.</p>
            <button
              onClick={() => navigate({ to: '/login', search: { mode: undefined, redirect: '/my-orders' } })}
              className="px-6 py-2 bg-[#2874f0] text-white rounded font-medium hover:bg-[#1f5bb8] transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderList = orders ?? [];

  if (orderList.length === 0) {
    return (
      <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-card p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">You haven't placed any orders. Start shopping now!</p>
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined, search: undefined } })}
              className="px-8 py-3 bg-[#2874f0] text-white font-semibold rounded hover:bg-[#1f5bb8] transition-colors"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

        <div className="space-y-4">
          {orderList.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            const firstItem = order.items[0];
            const imgSrc = firstItem ? getImageSrc(firstItem.customImageData || firstItem.product.imageData) : null;
            const createdDate = new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer"
                onClick={() => navigate({ to: '/order/$orderId', params: { orderId: order.orderId } })}
              >
                {/* Order Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div>
                      <span className="uppercase font-semibold">Order ID</span>
                      <p className="text-gray-700 font-mono text-xs mt-0.5 truncate max-w-[120px]">
                        #{order.orderId.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="uppercase font-semibold">Order Placed</span>
                      <p className="text-gray-700 mt-0.5">{createdDate}</p>
                    </div>
                    <div>
                      <span className="uppercase font-semibold">Total</span>
                      <p className="text-gray-700 font-bold mt-0.5">₹{order.total.toFixed(0)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>

                {/* Order Items */}
                <div className="p-4 flex items-center gap-4">
                  {imgSrc && (
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded border border-gray-200 overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={firstItem?.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {firstItem?.product.name}
                      {order.items.length > 1 && (
                        <span className="text-gray-500 font-normal"> +{order.items.length - 1} more</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {firstItem?.selectedSize} · Qty: {Number(firstItem?.quantity)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Est. Delivery: {order.estimatedDelivery}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
