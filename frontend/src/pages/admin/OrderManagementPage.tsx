import React, { useState } from 'react';
import { Download, Eye, FileImage, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAllOrders,
  useUpdateOrderStatus,
  useSetProductionFileData,
} from '../../hooks/useQueries';
import { toast } from 'sonner';
import { OrderStatus } from '../../backend';
import type { Order, CartItem } from '../../backend';

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Printed: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-orange-100 text-orange-700',
  Delivered: 'bg-green-100 text-green-700',
};

const STATUS_OPTIONS = [
  OrderStatus.New,
  OrderStatus.Processing,
  OrderStatus.Printed,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
];

function downloadCustomImage(item: CartItem) {
  if (item.customImageData) {
    const a = document.createElement('a');
    a.href = item.customImageData;
    a.download = `custom-image-${item.product.id}.png`;
    a.click();
  }
}

function downloadProductionFile(order: Order) {
  if (!order.productionFileData) {
    toast.error('No production file available');
    return;
  }
  const a = document.createElement('a');
  a.href = order.productionFileData;
  a.download = `production-${order.orderId}.png`;
  a.click();
}

async function generateProductionFile(order: Order): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Order: ${order.orderId}`, 20, 40);
    ctx.font = '14px sans-serif';
    ctx.fillText(`Customer: ${order.shippingAddress.fullName}`, 20, 70);
    ctx.fillText(`Total: ₹${order.total}`, 20, 95);

    let yOffset = 130;
    let itemsProcessed = 0;
    const totalItems = order.items.length;

    if (totalItems === 0) {
      resolve(canvas.toDataURL());
      return;
    }

    order.items.forEach((item, index) => {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`${index + 1}. ${item.product.name} (${item.selectedSize}) x${Number(item.quantity)}`, 20, yOffset);
      yOffset += 20;

      if (item.customImageData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 20, yOffset, 100, 100);
          yOffset += 120;
          itemsProcessed++;
          if (itemsProcessed === totalItems) {
            resolve(canvas.toDataURL());
          }
        };
        img.onerror = () => {
          itemsProcessed++;
          yOffset += 20;
          if (itemsProcessed === totalItems) {
            resolve(canvas.toDataURL());
          }
        };
        img.src = item.customImageData;
      } else {
        yOffset += 20;
        itemsProcessed++;
        if (itemsProcessed === totalItems) {
          resolve(canvas.toDataURL());
        }
      }
    });
  });
}

export default function OrderManagementPage() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const setProductionFile = useSetProductionFileData();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredOrders =
    filterStatus === 'All'
      ? orders
      : orders?.filter((o) => o.status.toString() === filterStatus);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleGenerateProductionFile = async (order: Order) => {
    try {
      const fileData = await generateProductionFile(order);
      await setProductionFile.mutateAsync({ orderId: order.orderId, fileData });
      toast.success('Production file generated');
    } catch {
      toast.error('Failed to generate production file');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Orders</h2>
          <p className="text-muted-foreground mt-1">Manage and process customer orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status.toString()}
              onClick={() => setFilterStatus(status.toString())}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                filterStatus === status.toString()
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
              }`}
            >
              {status.toString()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : !filteredOrders || filteredOrders.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Order Header */}
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground truncate">{order.orderId}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status.toString()] || 'bg-secondary text-muted-foreground'}`}
                    >
                      {order.status.toString()}
                    </span>
                  </div>
                  <p className="font-medium text-foreground mt-0.5">{order.shippingAddress.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.total} · {order.paymentMethod}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${expandedOrder === order.orderId ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.orderId && (
                <div className="border-t border-border p-4 space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2 text-sm">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-secondary/30 rounded-xl p-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <img
                              src={item.product.imageData || item.product.templateImageData || '/assets/generated/frame-product-mockup.dim_800x800.png'}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.selectedSize} · Qty: {Number(item.quantity)} · ₹{item.product.price * Number(item.quantity)}
                            </p>
                          </div>
                          {item.customImageData && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl gap-1 shrink-0"
                              onClick={() => downloadCustomImage(item)}
                            >
                              <FileImage className="h-3 w-3" />
                              Custom
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="font-medium text-foreground mb-1 text-sm">Shipping Address</h4>
                    <p className="text-xs text-muted-foreground">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''},{' '}
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    <p className="text-xs text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <select
                        value={order.status.toString()}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                        className="text-sm px-3 py-1.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        disabled={updateStatus.isPending}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-1"
                      onClick={() => handleGenerateProductionFile(order)}
                      disabled={setProductionFile.isPending}
                    >
                      <Eye className="h-3 w-3" />
                      Generate File
                    </Button>

                    {order.productionFileData && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-1"
                        onClick={() => downloadProductionFile(order)}
                      >
                        <Download className="h-3 w-3" />
                        Download File
                      </Button>
                    )}
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
