import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, FileText } from 'lucide-react';
import { useGetAllOrders, useUpdateOrderStatus, useSetProductionFileData } from '../../hooks/useQueries';
import { OrderStatus } from '../../backend';
import type { Order } from '../../backend';
import { toast } from 'sonner';

const STATUS_OPTIONS: OrderStatus[] = [
  OrderStatus.New,
  OrderStatus.Processing,
  OrderStatus.Printed,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
];

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.New]: 'bg-blue-100 text-blue-800',
  [OrderStatus.Processing]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.Printed]: 'bg-purple-100 text-purple-800',
  [OrderStatus.Shipped]: 'bg-orange-100 text-orange-800',
  [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
};

export default function OrderManagementPage() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const setProductionFile = useSetProductionFileData();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders?.filter(o =>
    filterStatus === 'all' || o.status === filterStatus
  ) ?? [];

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDownloadCustomImage = (order: Order) => {
    const item = order.items[0];
    if (!item?.customImageData) {
      toast.error('No custom image available');
      return;
    }
    try {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${item.customImageData}`;
      link.download = `order-${order.orderId}-custom.jpg`;
      link.click();
    } catch {
      toast.error('Failed to download image');
    }
  };

  const handleGenerateProductionFile = async (order: Order) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('Canvas not available');
        return;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Order: ${order.orderId}`, 40, 60);
      ctx.font = '18px Arial';
      ctx.fillText(`Customer: ${order.shippingAddress.fullName}`, 40, 100);
      ctx.fillText(`Total: ₹${order.total.toFixed(2)}`, 40, 130);
      ctx.fillText(`Status: ${order.status}`, 40, 160);
      ctx.fillText(`Payment: ${order.paymentMethod} - ${order.paymentStatus}`, 40, 190);

      ctx.fillText('Items:', 40, 240);
      let y = 270;
      for (const item of order.items) {
        ctx.fillText(`- ${item.product.name} x${Number(item.quantity)} (${item.selectedSize})`, 60, y);
        y += 30;
      }

      const fileData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
      await setProductionFile.mutateAsync({ orderId: order.orderId, fileData });

      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${fileData}`;
      link.download = `production-${order.orderId}.jpg`;
      link.click();

      toast.success('Production file generated and saved');
    } catch {
      toast.error('Failed to generate production file');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Orders</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-card border border-border rounded-xl overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="font-medium text-sm">#{order.orderId.slice(-8)}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingAddress.fullName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold">₹{order.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(order.orderId, e.target.value as OrderStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs px-2 py-1 border border-border rounded bg-background focus:outline-none"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {expandedOrder === order.orderId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {expandedOrder === order.orderId && (
                <div className="border-t border-border p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Order Details</h4>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                        <p>Estimated: {order.estimatedDelivery}</p>
                        <p>Items: {order.items.length}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 bg-muted rounded overflow-hidden shrink-0">
                            {item.customImageData ? (
                              <img
                                src={`data:image/jpeg;base64,${item.customImageData}`}
                                alt="Custom"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Size: {item.selectedSize} · Qty: {Number(item.quantity)}</p>
                          </div>
                          <p className="font-semibold">₹{(item.product.price * Number(item.quantity)).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleDownloadCustomImage(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Image
                    </button>
                    <button
                      onClick={() => handleGenerateProductionFile(order)}
                      disabled={setProductionFile.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {setProductionFile.isPending ? 'Generating...' : 'Generate Production File'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
