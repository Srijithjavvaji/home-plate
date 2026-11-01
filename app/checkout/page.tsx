"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  ArrowRight,
  Clock,
  Sparkles,
  ChefHat,
  Calendar,
  AlertTriangle,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, discount, total, appliedCoupon, clearCart } =
    useCart();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const MIN_ORDER_VALUE = 149;

  const [customerName, setCustomerName] = useState(user?.full_name || "Rahul Sharma");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "+91 98765 22001");
  const [addressLine1, setAddressLine1] = useState("Flat 401, Sapphire Heights, Hitec City");
  const [addressLine2, setAddressLine2] = useState("Near Cyber Towers");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("500081");
  const [notes, setNotes] = useState("");
  const [deliverySlot, setDeliverySlot] = useState<"asap" | "scheduled">("asap");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Group items by seller for multi-kitchen transparency
  const sellerGroups = items.reduce((acc, it) => {
    const sId = it.food.seller_id || "single";
    const sName = it.food.seller?.kitchen_name || "Verified Homemaker Kitchen";
    if (!acc[sId]) acc[sId] = { name: sName, items: [] };
    acc[sId].items.push(it);
    return acc;
  }, {} as Record<string, { name: string; items: typeof items }>);

  const uniqueSellersCount = Object.keys(sellerGroups).length;

  useEffect(() => {
    if (items.length > 0 && subtotal < MIN_ORDER_VALUE) {
      toastError("Minimum Order Value", `Minimum order value is ₹${MIN_ORDER_VALUE}. Redirecting to cart.`);
      router.push("/cart");
    }
  }, [subtotal, items.length, router, toastError]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#fffdfa]">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-orange-100 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Cart is empty</h2>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            Add some homemade delicacies to checkout.
          </p>
          <Button onClick={() => router.push("/foods")} className="w-full bg-orange-600 hover:bg-orange-700">
            Explore Foods
          </Button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (subtotal < MIN_ORDER_VALUE) {
      setErrorMessage(`Minimum order value is ₹${MIN_ORDER_VALUE}. Current subtotal: ${formatPrice(subtotal)}`);
      return;
    }

    setIsProcessing(true);

    const deliveryAddress = {
      name: customerName,
      phone: customerPhone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      pincode,
    };

    try {
      if (paymentMethod === "cod") {
        // Cash on Delivery
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            deliveryAddress,
            customerId: user?.id,
            notes,
            couponCode: appliedCoupon?.code,
            paymentMethod: "cod",
            deliverySlot,
            scheduledAt: deliverySlot === "scheduled" ? scheduledAt : undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order creation failed");

        clearCart();
        success("Order Placed Successfully!", "Your homemade order will be prepared with care.");
        router.push(`/order-success?orderId=${data.orderId}`);
        return;
      }

      // Razorpay Payment Flow
      const createOrderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          deliveryAddress,
          customerId: user?.id,
          couponCode: appliedCoupon?.code,
          deliverySlot,
          scheduledAt: deliverySlot === "scheduled" ? scheduledAt : undefined,
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      // Open Razorpay Checkout modal
      if (typeof window.Razorpay === "function" && !orderData.keyId.includes("placeholder")) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Home Plate Delivery",
          description: `Order #${orderData.orderNumber}`,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: customerName,
            contact: customerPhone,
            email: user?.email || "customer@homeplate.app",
          },
          theme: {
            color: "#ea580c", // Brand Orange
          },
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              success("Payment Verified!", "Your order is confirmed and sent to kitchen.");
              router.push(`/order-success?orderId=${orderData.orderId}`);
            } else {
              setErrorMessage("Payment verification failed on server.");
              toastError("Verification Failed", "Please contact support.");
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toastError("Payment Cancelled", "You can retry checkout anytime.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setIsProcessing(false);
          const reason = response.error?.description || response.error?.reason || "Payment could not be completed";
          setErrorMessage(reason);
          toastError("Payment Failed", reason);
        });
        rzp.open();
      } else {
        // Test mode fallback
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.razorpayOrderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: "mock_signature_test_mode",
            orderId: orderData.orderId,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          success("Test Payment Verified!", "Home Plate order confirmed successfully.");
          router.push(`/order-success?orderId=${orderData.orderId}`);
        } else {
          throw new Error("Verification failed");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An unexpected error occurred during checkout.");
      toastError("Checkout Error", err?.message || "Please check details and retry.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#fffdfa] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#271b15]">
              Delivery & Checkout
            </h1>
            <p className="text-xs text-[#7c5946] mt-0.5">
              Enter your Hyderabad delivery address, choose your delivery slot and preferred payment method
            </p>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Delivery Address & Payment Method */}
              <div className="lg:col-span-7 space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                    {errorMessage}
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Customer Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      leftIcon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Contact Phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 22001"
                      leftIcon={<Phone className="w-4 h-4" />}
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Hyderabad Delivery Address
                    </h3>
                  </div>

                  <Input
                    label="Flat / House / Building"
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Flat 401, Sapphire Heights"
                  />

                  <Input
                    label="Street / Landmark / Area"
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Near Cyber Towers, Hitec City"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="City"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      label="State"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                    <Input
                      label="Pincode"
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                    />
                  </div>

                  <Input
                    label="Delivery Instructions / Landmarks (Optional)"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave with security / Call upon arrival"
                  />
                </div>

                {/* Delivery Schedule Slot */}
                <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Fulfillment Slot
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliverySlot === "asap"
                          ? "bg-orange-50/70 border-orange-600 ring-2 ring-orange-600/20"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliverySlot"
                        value="asap"
                        checked={deliverySlot === "asap"}
                        onChange={() => setDeliverySlot("asap")}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <strong className="block text-xs font-bold text-gray-900">ASAP Delivery</strong>
                        <span className="text-[11px] text-gray-500">Dispatched in 35-45 minutes</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliverySlot === "scheduled"
                          ? "bg-orange-50/70 border-orange-600 ring-2 ring-orange-600/20"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliverySlot"
                        value="scheduled"
                        checked={deliverySlot === "scheduled"}
                        onChange={() => setDeliverySlot("scheduled")}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <strong className="block text-xs font-bold text-gray-900">Schedule Delivery</strong>
                        <span className="text-[11px] text-gray-500">Evening / Next day batch</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    Select Payment Method
                  </h3>

                  <div className="space-y-3">
                    {/* Razorpay Option */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "razorpay"
                          ? "bg-orange-50/70 border-orange-600 ring-2 ring-orange-600/20"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === "razorpay"}
                        onChange={() => setPaymentMethod("razorpay")}
                        className="mt-1 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-orange-700" />
                          <span className="font-bold text-gray-900 text-sm">
                            Razorpay Online Payment (UPI, Cards, NetBanking, Wallets)
                          </span>
                        </div>
                        <p className="text-xs text-[#7c5946] mt-1 leading-relaxed">
                          Secure 256-bit encrypted gateway. Supports Google Pay, PhonePe, Paytm, BHIM UPI, Debit/Credit cards, and NetBanking.
                        </p>
                      </div>
                    </label>

                    {/* Cash on Delivery Option */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "bg-orange-50/70 border-orange-600 ring-2 ring-orange-600/20"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-1 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-orange-700" />
                          <span className="font-bold text-gray-900 text-sm">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-[#7c5946] mt-1">
                          Pay directly to our delivery courier when your fresh homemade items arrive.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Sidebar */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                      Order Summary ({items.length} items)
                    </h3>
                    <span className="text-xs font-semibold text-orange-700">
                      {uniqueSellersCount} Kitchen{uniqueSellersCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Multi-kitchen grouped items */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 pr-1">
                    {Object.entries(sellerGroups).map(([sId, group]) => (
                      <div key={sId} className="py-2.5">
                        <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                          {group.name}
                        </span>
                        <div className="mt-1 space-y-1.5">
                          {group.items.map(({ food, quantity }) => (
                            <div key={food.id} className="flex items-center justify-between text-xs">
                              <div className="flex-1 pr-3 truncate">
                                <p className="font-semibold text-gray-900 truncate">{food.name}</p>
                                <p className="text-gray-500 text-[10px]">
                                  {quantity} × {formatPrice(food.price)} ({food.net_weight || food.serving_info})
                                </p>
                              </div>
                              <span className="font-bold text-gray-950 shrink-0">
                                {formatPrice(food.price * quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Calculations */}
                  <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Delivery Fee</span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-emerald-700 uppercase text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                          FREE
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-900">{formatPrice(deliveryFee)}</span>
                      )}
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-orange-700 font-semibold">
                        <span>Coupon Savings {appliedCoupon && `(${appliedCoupon.code})`}</span>
                        <span>- {formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-extrabold text-gray-950">
                      <span>Total Amount to Pay</span>
                      <span className="text-2xl text-orange-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <Button
                    type="submit"
                    isLoading={isProcessing}
                    className="w-full py-4 text-base bg-orange-600 hover:bg-orange-700 text-white font-bold"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    {paymentMethod === "razorpay"
                      ? `Pay ${formatPrice(total)} with Razorpay`
                      : `Confirm Cash on Delivery Order`}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Official 256-Bit Razorpay & Shadowfax Integration</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
