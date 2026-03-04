import { ChevronDown, ChevronUp, Loader2, Search, Users } from "lucide-react";
import React, { useState } from "react";
import type { Order } from "../../backend";
import { useGetAllOrders } from "../../hooks/useQueries";

function formatCurrency(amount: bigint | number): string {
  return `₹${Number(amount).toLocaleString()}`;
}

interface CustomerSummary {
  userId: string;
  name: string;
  phone: string;
  orders: Order[];
  totalSpent: number;
}

export default function CustomerManagementPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group orders by userId
  const customerMap = new Map<string, CustomerSummary>();
  for (const order of orders) {
    const uid = order.userId.toString();
    if (!customerMap.has(uid)) {
      customerMap.set(uid, {
        userId: uid,
        name: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        orders: [],
        totalSpent: 0,
      });
    }
    const c = customerMap.get(uid)!;
    c.orders.push(order);
    c.totalSpent += Number(order.total);
  }

  const customers = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.userId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {customers.length} customers
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, phone, or user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No customers found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Orders
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Total Spent
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => {
                const isExpanded = expandedId === customer.userId;
                return (
                  <React.Fragment key={customer.userId}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {customer.userId.slice(0, 20)}...
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {customer.phone}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {customer.orders.length}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : customer.userId)
                          }
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-4 bg-gray-50 border-t border-gray-100"
                        >
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Order History
                          </h4>
                          <div className="space-y-2">
                            {customer.orders
                              .sort(
                                (a, b) =>
                                  Number(b.createdAt) - Number(a.createdAt),
                              )
                              .map((order) => (
                                <div
                                  key={order.orderId}
                                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100 text-sm"
                                >
                                  <span className="font-mono text-xs text-gray-500">
                                    #{order.orderId.slice(-8)}
                                  </span>
                                  <span className="text-gray-700">
                                    {order.items.length} item
                                    {order.items.length !== 1 ? "s" : ""}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(order.total)}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    {new Date(
                                      Number(order.createdAt) / 1_000_000,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Missing Input import
function Input({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${className ?? ""}`}
    />
  );
}
