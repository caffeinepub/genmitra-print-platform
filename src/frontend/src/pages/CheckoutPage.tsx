import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  MapPin,
  Package,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CartItem, Order, ShippingAddress } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useClearCart,
  useGetCart,
  useGetShippingAddress,
  usePlaceOrder,
  useSaveShippingAddress,
} from "../hooks/useQueries";
import { getImageSrc } from "../utils/imageHelpers";

type Step = "address" | "payment";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cartItems = [], isLoading: cartLoading } = useGetCart();
  const { data: savedAddress } = useGetShippingAddress();
  const placeOrder = usePlaceOrder();
  const clearCart = useClearCart();
  const saveAddress = useSaveShippingAddress();

  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, [savedAddress]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
    0,
  );

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.fullName ||
      !address.addressLine1 ||
      !address.city ||
      !address.pincode ||
      !address.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await saveAddress.mutateAsync(address);
    } catch {
      // Non-critical
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (!identity) {
      toast.error("Please log in to place an order");
      navigate({
        to: "/login",
        search: { mode: undefined, redirect: "/checkout" },
      });
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const now = BigInt(Date.now()) * BigInt(1_000_000);

    // Build order with correct OrderStatus variant format for Motoko
    const order = {
      orderId,
      userId: identity.getPrincipal(),
      items: cartItems as CartItem[],
      total: BigInt(subtotal),
      status: { New: null } as unknown as import("../backend").OrderStatus,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      shippingAddress: address,
      createdAt: now,
      estimatedDelivery: "5-7 business days",
      productionFileData: "",
    } as Order;

    try {
      await placeOrder.mutateAsync(order);
      await clearCart.mutateAsync();
      navigate({ to: "/order-confirmation/$orderId", params: { orderId } });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Button
          onClick={() =>
            navigate({
              to: "/",
              search: { category: undefined, search: undefined },
            })
          }
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "address" ? "text-primary" : "text-green-600"}`}
        >
          {step === "payment" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
          Shipping Address
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "payment" ? "text-primary" : "text-gray-400"}`}
        >
          <CreditCard className="w-5 h-5" />
          Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {step === "address" ? (
            <form
              onSubmit={handleAddressSubmit}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
            >
              <h2 className="font-semibold text-gray-900 mb-2">
                Shipping Address
              </h2>
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, fullName: e.target.value }))
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addr1">Address Line 1 *</Label>
                <Input
                  id="addr1"
                  value={address.addressLine1}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, addressLine1: e.target.value }))
                  }
                  placeholder="House/Flat No., Street"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addr2">Address Line 2</Label>
                <Input
                  id="addr2"
                  value={address.addressLine2}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, addressLine2: e.target.value }))
                  }
                  placeholder="Area, Landmark (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, city: e.target.value }))
                    }
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, state: e.target.value }))
                    }
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, pincode: e.target.value }))
                    }
                    placeholder="6-digit pincode"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, phone: e.target.value }))
                    }
                    placeholder="10-digit mobile"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={saveAddress.isPending}
              >
                {saveAddress.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </form>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 mb-2">
                Payment Method
              </h2>
              <div className="space-y-3">
                {(["COD", "Online"] as const).map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === method
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="accent-primary"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {method === "COD"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {method === "COD"
                          ? "Pay when your order arrives"
                          : "Pay securely online"}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("address")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  className="flex-1"
                  disabled={placeOrder.isPending}
                >
                  {placeOrder.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize ?? "default"}`}
                className="flex justify-between items-center gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.product.imageData && (
                    <img
                      src={getImageSrc(item.product.imageData)}
                      alt={item.product.name}
                      className="w-10 h-10 rounded object-cover border border-gray-100 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {Number(item.quantity)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  ₹
                  {(
                    Number(item.product.price) * Number(item.quantity)
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-primary">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
