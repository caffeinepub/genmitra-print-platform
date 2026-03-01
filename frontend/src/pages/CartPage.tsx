import React, { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCart, useRemoveFromCart, useClearCart, useCreateOrder, useIsPincodeAvailable, useSaveAddress } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { ShippingAddress } from '../backend';

const emptyAddress: ShippingAddress = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
};

export default function CartPage() {
  const { data: cartItems, isLoading } = useGetCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const createOrder = useCreateOrder();
  const saveAddress = useSaveAddress();

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'success'>('cart');
  const [orderId, setOrderId] = useState('');

  const { data: pincodeAvailable } = useIsPincodeAvailable(address.pincode);

  const total = cartItems?.reduce(
    (sum, item) => sum + item.product.price * Number(item.quantity),
    0
  ) ?? 0;

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.addressLine1 || !address.city || !address.pincode || !address.phone) {
      toast.error('Please fill in all required address fields');
      return;
    }
    if (address.pincode.length === 6 && pincodeAvailable === false) {
      toast.error('Sorry, we do not deliver to this pincode');
      return;
    }
    try {
      await saveAddress.mutateAsync(address);
      const newOrderId = await createOrder.mutateAsync({ paymentMethod, shippingAddress: address });
      setOrderId(newOrderId);
      setStep('success');
      toast.success('Order placed successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-secondary rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-card rounded-3xl border border-border p-10 shadow-card">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display mb-2">Order Placed!</h2>
          <p className="text-muted-foreground mb-4">
            Your order <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">{orderId}</span> has been placed successfully.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Payment: <strong>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong>
          </p>
          <Button
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
            onClick={() => window.location.href = '/'}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-card rounded-3xl border border-border p-10 shadow-card">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Button
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
            onClick={() => window.location.href = '/'}
          >
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">
        {step === 'cart' ? 'Your Cart' : step === 'address' ? 'Delivery Address' : 'Payment'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {step === 'cart' && (
            <>
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img
                      src={item.product.imageData || item.product.templateImageData || '/assets/generated/frame-product-mockup.dim_800x800.png'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.selectedSize}</p>
                    <p className="text-sm text-muted-foreground">Qty: {Number(item.quantity)}</p>
                    <p className="font-bold text-foreground mt-1">₹{item.product.price * Number(item.quantity)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    onClick={() => handleRemove(item.product.id)}
                    disabled={removeFromCart.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive rounded-xl"
                onClick={() => clearCart.mutateAsync()}
                disabled={clearCart.isPending}
              >
                Clear Cart
              </Button>
            </>
          )}

          {step === 'address' && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Delivery Address</h2>
              </div>
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="mt-1 rounded-xl"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label>Address Line 1 *</Label>
                <Input
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="mt-1 rounded-xl"
                  placeholder="House/Flat No., Street"
                />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  className="mt-1 rounded-xl"
                  placeholder="Area, Landmark (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="mt-1 rounded-xl"
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="mt-1 rounded-xl"
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pincode *</Label>
                  <Input
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="mt-1 rounded-xl"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {address.pincode.length === 6 && pincodeAvailable === false && (
                    <p className="text-xs text-destructive mt-1">Delivery not available to this pincode</p>
                  )}
                  {address.pincode.length === 6 && pincodeAvailable === true && (
                    <p className="text-xs text-green-600 mt-1">✓ Delivery available</p>
                  )}
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="mt-1 rounded-xl"
                    placeholder="10-digit mobile"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'Online' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === 'Online'}
                    onChange={() => setPaymentMethod('Online')}
                    className="accent-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">Online Payment</p>
                    <p className="text-xs text-muted-foreground">Pay securely online</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate mr-2">{item.product.name} ×{Number(item.quantity)}</span>
                  <span>₹{item.product.price * Number(item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {step === 'cart' && (
                <Button
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2"
                  onClick={() => setStep('address')}
                >
                  Proceed to Address
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {step === 'address' && (
                <>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2"
                    onClick={() => setStep('payment')}
                    disabled={!address.fullName || !address.addressLine1 || !address.city || !address.pincode || !address.phone}
                  >
                    Continue to Payment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl" onClick={() => setStep('cart')}>
                    Back to Cart
                  </Button>
                </>
              )}
              {step === 'payment' && (
                <>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2"
                    onClick={handlePlaceOrder}
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl" onClick={() => setStep('address')}>
                    Back to Address
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
