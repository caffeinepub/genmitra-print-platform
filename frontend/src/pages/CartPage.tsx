import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trash2, ShoppingBag, ArrowRight, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useGetCart, useRemoveFromCart, useClearCart, useCreateOrder, useSaveAddress } from '../hooks/useQueries';
import { getImageSrc } from '../utils/imageHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ShippingAddress } from '../backend';
import { toast } from 'sonner';

type CheckoutStep = 'cart' | 'address' | 'payment' | 'success';

export default function CartPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const { data: cartItems = [], isLoading } = useGetCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const createOrder = useCreateOrder();
  const saveAddress = useSaveAddress();

  const total = cartItems.reduce((sum, item) => sum + item.product.price * Number(item.quantity), 0);

  const handleRemove = (productId: string) => {
    removeFromCart.mutate(productId);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAddress.mutateAsync(address);
      setStep('payment');
    } catch {
      toast.error('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const newOrderId = await createOrder.mutateAsync({ paymentMethod, shippingAddress: address });
      setOrderId(newOrderId);
      setStep('success');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-xl h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Step: Success
  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-3">Order Placed!</h1>
        <p className="text-muted-foreground mb-2">Your order has been successfully placed.</p>
        <p className="text-sm text-muted-foreground mb-8">Order ID: <strong className="text-foreground">{orderId}</strong></p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}>
            View My Orders
          </Button>
          <Button onClick={() => navigate({ to: '/', search: { category: undefined } })}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Step: Payment
  if (step === 'payment') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold font-serif text-foreground mb-6">Payment</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Payment Method
              </h2>
              <div className="space-y-3">
                {['COD', 'UPI', 'Card'].map((method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="text-primary"
                    />
                    <span className="text-foreground">
                      {method === 'COD' ? 'Cash on Delivery' : method === 'UPI' ? 'UPI Payment' : 'Credit/Debit Card'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 h-fit">
            <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step: Address
  if (step === 'address') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold font-serif text-foreground mb-6">Shipping Address</h1>
        <form onSubmit={handleAddressSubmit}>
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Delivery Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep('cart')}>
              Back to Cart
            </Button>
            <Button type="submit" disabled={saveAddress.isPending}>
              {saveAddress.isPending ? 'Saving...' : 'Continue to Payment'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Step: Cart
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-foreground mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to get started</p>
        <Button onClick={() => navigate({ to: '/', search: { category: undefined } })}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold font-serif text-foreground mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item, index) => {
            const productImageSrc = getImageSrc(item.product.imageData);
            const customImageSrc = getImageSrc(item.customImageData);
            return (
              <div key={index} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  {customImageSrc ? (
                    <img src={customImageSrc} alt="Custom" className="w-full h-full object-cover" />
                  ) : productImageSrc ? (
                    <img src={productImageSrc} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                  <p className="text-sm text-muted-foreground">Qty: {Number(item.quantity)}</p>
                  <p className="font-bold text-primary mt-1">₹{(item.product.price * Number(item.quantity)).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  disabled={removeFromCart.isPending}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearCart.mutate()}
            disabled={clearCart.isPending}
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 h-fit">
          <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setStep('address')}>
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
