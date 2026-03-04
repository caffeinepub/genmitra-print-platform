import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  ShoppingCart,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend";
import type { Order } from "../../backend";
import { useGetAllOrders, useUpdateOrderStatus } from "../../hooks/useQueries";
import { getImageSrc } from "../../utils/imageHelpers";

const STATUS_OPTIONS: OrderStatus[] = [
  OrderStatus.New,
  OrderStatus.Processing,
  OrderStatus.Printed,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
];

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

function formatCurrency(amount: bigint | number): string {
  return `₹${Number(amount).toLocaleString()}`;
}

export default function OrderManagementPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({
        orderId: order.orderId,
        status: newStatus,
      });
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", ...STATUS_OPTIONS] as const).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((order) => {
            const isExpanded = expandedId === order.orderId;
            return (
              <div
                key={order.orderId}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Order Row */}
                <button
                  type="button"
                  className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors w-full text-left"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : order.orderId)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-500">
                        #{order.orderId.slice(-8)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(
                        Number(order.createdAt) / 1_000_000,
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-4">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-700">
                        {order.shippingAddress.fullName},{" "}
                        {order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2
                          ? `, ${order.shippingAddress.addressLine2}`
                          : ""}
                        , {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>
                      <p className="text-sm text-gray-500">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={`${item.product.id}-${item.selectedSize ?? "default"}`}
                            className="flex items-center gap-3 bg-white rounded-lg p-2 border border-gray-100"
                          >
                            {item.product.imageData && (
                              <img
                                src={getImageSrc(item.product.imageData)}
                                alt={item.product.name}
                                className="w-10 h-10 rounded object-cover border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Size: {item.selectedSize} · Qty:{" "}
                                {Number(item.quantity)}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(
                                Number(item.product.price) *
                                  Number(item.quantity),
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">
                        Payment: <strong>{order.paymentMethod}</strong>
                      </span>
                      <Badge
                        variant={
                          order.paymentStatus === "paid"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Update Status
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => handleStatusChange(order, s)}
                            disabled={
                              order.status === s || updateStatus.isPending
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              order.status === s
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {updateStatus.isPending && order.status !== s ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : (
                              s
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
