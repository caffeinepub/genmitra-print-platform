import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardSummary, useGetAllOrders } from '../../hooks/useQueries';
import { OrderStatus } from '../../backend';
import type { Order } from '../../backend';

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

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();

  const recentOrders = orders?.slice(0, 5) ?? [];

  const stats = [
    {
      label: 'Total Orders',
      value: summaryLoading ? '...' : String(summary?.totalOrders ?? 0),
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Earnings',
      value: summaryLoading ? '...' : `₹${(summary?.totalEarnings ?? 0).toFixed(0)}`,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Users',
      value: summaryLoading ? '...' : String(summary?.totalUsers ?? 0),
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Total Products',
      value: summaryLoading ? '...' : String(summary?.totalProducts ?? 0),
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-display">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl shadow-card border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            {summaryLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            )}
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Recent Orders</h3>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary hover:text-primary"
            onClick={() => navigate({ to: '/admin/orders' })}
          >
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {ordersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Items</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Total</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-3 font-mono text-xs text-foreground">
                      #{order.orderId.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{order.items.length}</td>
                    <td className="py-3 px-3 font-medium text-foreground">₹{order.total.toFixed(0)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                        {String(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
