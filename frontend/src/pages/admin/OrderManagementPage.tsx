import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, FileText, Search } from 'lucide-react';
import { useGetAllOrders, useUpdateOrderStatus, useSetProductionFileData } from '../../hooks/useQueries';
import { getImageSrc } from '../../utils/imageHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { OrderStatus } from '../../backend';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: OrderStatus.New, label: 'New' },
  { value: OrderStatus.Processing, label: 'Processing' },
  { value: OrderStatus.Printed, label: 'Printed' },
  { value: OrderStatus.Shipped, label: 'Shipped' },
  { value: OrderStatus.Delivered, label: 'Delivered' },
];

function getStatusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Delivered: return 'default' as const;
    case OrderStatus.Shipped: return 'secondary' as const;
    default: return 'outline' as const;
  }
}

export default function OrderManagementPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const setProductionFileData = useSetProductionFileData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handleDownloadCustomImage = (customImageData: string, orderId: string) => {
    const src = getImageSrc(customImageData);
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `custom-image-${orderId}.jpg`;
    link.click();
  };

  const handleGenerateProductionFile = async (orderId: string) => {
    const fileData = `Production file for order ${orderId} - Generated at ${new Date().toISOString()}`;
    try {
      await setProductionFileData.mutateAsync({ orderId, fileData });
      toast.success('Production file generated');
    } catch {
      toast.error('Failed to generate production file');
    }
  };

  const handleDownloadProductionFile = (productionFileData: string, orderId: string) => {
    if (!productionFileData) return;
    const blob = new Blob([productionFileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `production-file-${orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and track all customer orders</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No orders found</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((order) => {
              const isExpanded = expandedOrder === order.orderId;
              return (
                <div key={order.orderId}>
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{order.orderId}</p>
                      <p className="text-xs text-muted-foreground">{order.shippingAddress.fullName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary text-sm">₹{order.total.toFixed(2)}</p>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs mt-1">
                        {order.status}
                      </Badge>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 bg-muted/20 space-y-4">
                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-2">Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => {
                            const productImageSrc = getImageSrc(item.product.imageData);
                            const customImageSrc = getImageSrc(item.customImageData);
                            return (
                              <div key={idx} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                  {customImageSrc ? (
                                    <img src={customImageSrc} alt="Custom" className="w-full h-full object-cover" />
                                  ) : productImageSrc ? (
                                    <img src={productImageSrc} alt={item.product.name} className="w-full h-full object-cover" />
                                  ) : null}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground text-sm truncate">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">Size: {item.selectedSize} · Qty: {Number(item.quantity)}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  {item.customImageData && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownloadCustomImage(item.customImageData, order.orderId)}
                                    >
                                      <Download className="w-3 h-3 mr-1" /> Custom Image
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <Select
                            value={order.status}
                            onValueChange={(val) => handleStatusChange(order.orderId, val as OrderStatus)}
                          >
                            <SelectTrigger className="w-36 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.filter((o) => o.value !== 'all').map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateProductionFile(order.orderId)}
                          disabled={setProductionFileData.isPending}
                        >
                          <FileText className="w-3 h-3 mr-1" /> Generate Production File
                        </Button>

                        {order.productionFileData && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadProductionFile(order.productionFileData, order.orderId)}
                          >
                            <Download className="w-3 h-3 mr-1" /> Download Production File
                          </Button>
                        )}
                      </div>

                      {/* Shipping Address */}
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Ship to: </span>
                        {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
