import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Users, Package, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useGetDashboardSummary, useGetAllOrders } from '../../hooks/useQueries';
import { OrderStatus } from '../../backend';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();

  const recentOrders = orders?.slice(0, 5) ?? [];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.New: return 'bg-blue-100 text-blue-800';
      case OrderStatus.Processing: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.Printed: return 'bg-purple-100 text-purple-800';
      case OrderStatus.Shipped: return 'bg-orange-100 text-orange-800';
      case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      icon: DollarSign,
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
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Manage Products', path: '/admin/products', icon: Package },
          { label: 'View Orders', path: '/admin/orders', icon: ShoppingBag },
          { label: 'Customers', path: '/admin/customers', icon: Users },
          { label: 'Settings', path: '/admin/settings', icon: TrendingUp },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate({ to: action.path as any })}
            className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-muted transition-colors"
          >
            <action.icon className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Orders</h2>
          <button
            onClick={() => navigate({ to: '/admin/orders' })}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="divide-y divide-border">
          {ordersLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.orderId} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">#{order.orderId.slice(-8)}</p>
                  <p className="text-xs text-muted-foreground">{order.shippingAddress.fullName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
