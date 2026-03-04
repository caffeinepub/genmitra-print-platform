import {
  Clock,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { OrderStatus } from "../../backend";
import { useGetAllOrders, useGetProducts } from "../../hooks/useQueries";
import { getImageSrc } from "../../utils/imageHelpers";

function formatCurrency(amount: bigint | number): string {
  return `₹${Number(amount).toLocaleString()}`;
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.New:
      return "bg-blue-100 text-blue-700";
    case OrderStatus.Processing:
      return "bg-yellow-100 text-yellow-700";
    case OrderStatus.Printed:
      return "bg-purple-100 text-purple-700";
    case OrderStatus.Shipped:
      return "bg-orange-100 text-orange-700";
    case OrderStatus.Delivered:
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminDashboardPage() {
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();
  const { data: products = [], isLoading: productsLoading } = useGetProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const newOrders = orders.filter((o) => o.status === OrderStatus.New).length;
  const processingOrders = orders.filter(
    (o) =>
      o.status === OrderStatus.Processing || o.status === OrderStatus.Printed,
  ).length;

  const recentOrders = [...orders]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 10);

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "New Orders",
      value: newOrders.toString(),
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const isLoading = ordersLoading || productsLoading;

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 font-medium">
                      {stat.label}
                    </span>
                    <div className={`${stat.bg} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Processing Orders */}
          {processingOrders > 0 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
              <strong>{processingOrders}</strong> order(s) currently in
              processing/printed stage.
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Order ID
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Items
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Total
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order) => (
                      <tr
                        key={order.orderId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          #{order.orderId.slice(-8)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {order.items[0]?.product?.imageData && (
                              <img
                                src={getImageSrc(
                                  order.items[0].product.imageData,
                                )}
                                alt=""
                                className="w-8 h-8 rounded object-cover border border-gray-200"
                              />
                            )}
                            <span className="text-gray-700">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(
                            Number(order.createdAt) / 1_000_000,
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
