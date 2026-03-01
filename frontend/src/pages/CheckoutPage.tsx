import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CreditCard, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGetCart, useCreateOrder, useGetMyAddress, useSaveAddress } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { ShippingAddress } from '../backend';

type PaymentMethod = 'COD' | 'UPI' | 'CARD' | 'NETBANKING';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems } = useGetCart();
  const { data: savedAddress } = useGetMyAddress();
  const createOrder = useCreateOrder();
  const saveAddress = useSaveAddress();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [showMockPayment, setShowMockPayment] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: savedAddress?.fullName || '',
    addressLine1: savedAddress?.addressLine1 || '',
    addressLine2: savedAddress?.addressLine2 || '',
    city: savedAddress?.city || '',
    state: savedAddress?.state || '',
    pincode: savedAddress?.pincode || '',
    phone: savedAddress?.phone || '',
  });

  const subtotal = cartItems?.reduce(
    (sum, item) => sum + item.product.price * Number(item.quantity),
    0
  ) ?? 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required: (keyof ShippingAddress)[] = ['fullName', 'addressLine1', 'city', 'state', 'pincode', 'phone'];
    for (const field of required) {
      if (!address[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (address.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (paymentMethod !== 'COD') {
      setShowMockPayment(true);
      return;
    }

    await submitOrder('COD');
  };

  const submitOrder = async (method: string) => {
    setProcessingPayment(true);
    try {
      await saveAddress.mutateAsync(address);
      const orderId = await createOrder.mutateAsync({
        paymentMethod: method,
        shippingAddress: address,
      });
      toast.success('Order placed successfully!');
      // Use window.location to navigate to avoid TypeScript route type issues
      window.location.href = `/order-confirmation/${encodeURIComponent(orderId)}`;
    } catch {
      toast.error('Failed to place order. Please login and try again.');
    } finally {
      setProcessingPayment(false);
      setShowMockPayment(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Mock Payment Modal */}
      {showMockPayment && (
        <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl shadow-card-hover p-8 w-full max-w-sm border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">Complete Payment</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Total: <strong className="text-foreground">₹{total.toFixed(0)}</strong>
            </p>
            <div className="space-y-3 mb-6">
              {(['UPI', 'CARD', 'NETBANKING'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    paymentMethod === m
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  {m === 'UPI' ? 'UPI (GPay, PhonePe, Paytm)' : m === 'CARD' ? 'Credit / Debit Card' : 'Net Banking'}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowMockPayment(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
                onClick={() => submitOrder(paymentMethod)}
                disabled={processingPayment}
              >
                {processingPayment ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        className="gap-2 mb-6 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: '/cart' })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-3xl font-bold text-foreground font-display mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Address + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={address.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  value={address.addressLine1}
                  onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                  placeholder="House/Flat No., Street"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={address.addressLine2}
                  onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                  placeholder="Area, Landmark (optional)"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Mumbai"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                { value: 'UPI', label: 'UPI', desc: 'GPay, PhonePe, Paytm' },
                { value: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                { value: 'NETBANKING', label: 'Net Banking', desc: 'All major banks supported' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPaymentMethod(option.value as PaymentMethod)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    paymentMethod === option.value ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {paymentMethod === option.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 sticky top-24">
            <h2 className="font-bold text-foreground text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems?.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product.name} × {Number(item.quantity)}
                  </span>
                  <span className="text-foreground font-medium shrink-0">
                    ₹{(item.product.price * Number(item.quantity)).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-foreground'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>

            <Button
              className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90 rounded-xl h-12 text-base font-semibold shadow-purple gap-2"
              onClick={handlePlaceOrder}
              disabled={processingPayment || createOrder.isPending}
            >
              {processingPayment || createOrder.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>

            {shipping > 0 && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Add ₹{(999 - subtotal).toFixed(0)} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
