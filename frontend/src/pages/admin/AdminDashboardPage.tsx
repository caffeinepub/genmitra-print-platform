import { useNavigate } from '@tanstack/react-router';
import { Package, Users, ShoppingBag, TrendingUp, Clock, Eye } from 'lucide-react';
import { useGetDashboardSummary, useGetAllOrders } from '../../hooks/useQueries';
import { getImageSrc } from '../../utils/imageHelpers';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '../../backend';

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Delivered: return 'default';
    case OrderStatus.Shipped: return 'secondary';
    case OrderStatus.Processing:
    case OrderStatus.Printed: return 'outline';
    default: return 'outline';
  }
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'Total Orders',
      value: summaryLoading ? '...' : String(summary?.totalOrders ?? 0),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Earnings',
      value: summaryLoading ? '...' : `₹${(summary?.totalEarnings ?? 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Users',
      value: summaryLoading ? '...' : String(summary?.totalUsers ?? 0),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Products',
      value: summaryLoading ? '...' : String(summary?.totalProducts ?? 0),
      icon: Package,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent Orders
          </h2>
          <button
            onClick={() => navigate({ to: '/admin/orders' })}
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>
        {ordersLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded h-12" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No orders yet</div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => {
              const firstItem = order.items[0];
              const productImageSrc = firstItem ? getImageSrc(firstItem.product.imageData) : '';
              return (
                <div key={order.orderId} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    {productImageSrc ? (
                      <img src={productImageSrc} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{order.orderId}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingAddress.fullName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary text-sm">₹{order.total.toFixed(2)}</p>
                    <Badge variant={getStatusColor(order.status)} className="text-xs mt-1">
                      {order.status}
                    </Badge>
                  </div>
                  <button
                    onClick={() => navigate({ to: '/admin/orders' })}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
