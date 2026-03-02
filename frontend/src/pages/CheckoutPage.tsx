import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useCreateOrder, useSaveAddress } from '../hooks/useQueries';
import { getImageSrc } from '../utils/imageHelpers';
import { Package, CreditCard, Truck, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import type { ShippingAddress } from '../backend';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { id: 'UPI', label: 'UPI Payment', icon: '📱' },
  { id: 'Card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'NetBanking', label: 'Net Banking', icon: '🏦' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems } = useGetCart();
  const createOrder = useCreateOrder();
  const saveAddress = useSaveAddress();

  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const total = cartItems?.reduce(
    (sum, item) => sum + item.product.price * Number(item.quantity),
    0
  ) ?? 0;

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAddress.mutateAsync(address);
    } catch {
      // continue even if save fails
    }
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setPaymentDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    try {
      const orderId = await createOrder.mutateAsync({ paymentMethod, shippingAddress: address });
      setPaymentDialogOpen(false);
      navigate({
        to: '/order-confirmation/$orderId',
        params: { orderId },
        search: { category: undefined },
      });
    } catch (err) {
      console.error('Order creation failed:', err);
      setPaymentDialogOpen(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <button
          onClick={() => navigate({ to: '/', search: { category: undefined } })}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {['address', 'payment'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step === s ? 'text-primary font-semibold' : 'text-gray-400'}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              <span className="capitalize">{s}</span>
            </div>
            {i < 1 && <div className="flex-1 h-0.5 bg-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 'address' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={address.addressLine2}
                      onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saveAddress.isPending}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saveAddress.isPending ? 'Saving...' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.label}</span>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('address')}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.imageData ? (
                      <img
                        src={getImageSrc(item.product.imageData)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {Number(item.quantity)}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{(item.product.price * Number(item.quantity)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Review your order details before confirming payment.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-primary text-lg">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery to</span>
              <span className="font-medium">{address.city}{address.state ? `, ${address.state}` : ''}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPaymentDialogOpen(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={createOrder.isPending}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createOrder.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm & Pay'
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
