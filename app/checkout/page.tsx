"use client";

import React, { useState } from "react";
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

  const [customerName, setCustomerName] = useState(user?.full_name || "Rahul Sharma");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "+91 98765 22001");
  const [addressLine1, setAddressLine1] = useState("Flat 401, Sapphire Heights, Hitec City");
  const [addressLine2, setAddressLine2] = useState("Near Cyber Towers");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("500081");
  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Cart is empty</h2>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            Add some homemade delicacies to checkout.
          </p>
          <Button onClick={() => router.push("/foods")} className="w-full">
            Explore Foods
          </Button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
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
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order creation failed");

        clearCart();
        success("Order Placed Successfully!", "Your order will be prepared fresh.");
        router.push(`/order-success?orderId=${data.orderId}`);
        return;
      }

      // Razorpay Payment Flow
      // 1. Create Order on SERVER with secure validation
      const createOrderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          deliveryAddress,
          customerId: user?.id,
          couponCode: appliedCoupon?.code,
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      // 2. Open Razorpay Checkout modal
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
            color: "#059669", // emerald-600
          },
          handler: async function (response: any) {
            // 3. SERVER-SIDE SIGNATURE VERIFICATION
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
        rzp.open();
      } else {
        // Smooth Test Mode verification fallback (when using placeholder Razorpay credentials)
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

      <div className="min-h-screen bg-gray-50/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
              Delivery & Checkout
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter your delivery address and choose your payment method
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
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-emerald-600" />
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
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Delivery Address
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

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Cooking or Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Please make slightly less spicy / Ring bell on arrival"
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    Select Payment Method
                  </h3>

                  <div className="space-y-3">
                    {/* Razorpay Option */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "razorpay"
                          ? "bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === "razorpay"}
                        onChange={() => setPaymentMethod("razorpay")}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-gray-900 text-sm">
                            Razorpay Online Payment (UPI, Cards, NetBanking)
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Secure 256-bit encrypted gateway. Supports Google Pay, PhonePe, Paytm, UPI, Debit/Credit cards, and NetBanking.
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Razorpay Test Mode Ready
                        </span>
                      </div>
                    </label>

                    {/* Cash on Delivery Option */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-gray-900 text-sm">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Pay with cash or UPI directly to our delivery rider when your food arrives.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Sidebar */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                      Order Summary ({items.length} items)
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700">
                      Home Plate Kitchens
                    </span>
                  </div>

                  {/* Items Mini List */}
                  <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
                    {items.map(({ food, quantity }) => (
                      <div key={food.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex-1 pr-3">
                          <p className="font-bold text-gray-900 truncate">{food.name}</p>
                          <p className="text-gray-500 text-[11px]">
                            {quantity} x {formatPrice(food.price)}
                          </p>
                        </div>
                        <span className="font-bold text-gray-950">
                          {formatPrice(food.price * quantity)}
                        </span>
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
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Savings {appliedCoupon && `(${appliedCoupon.code})`}</span>
                        <span>- {formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-extrabold text-gray-950">
                      <span>Total Amount to Pay</span>
                      <span className="text-2xl text-emerald-700">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <Button
                    type="submit"
                    isLoading={isProcessing}
                    className="w-full py-4 text-base"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    {paymentMethod === "razorpay"
                      ? `Pay ${formatPrice(total)} with Razorpay`
                      : `Confirm Cash on Delivery Order`}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Server-verified payment • 100% moneyback guarantee</span>
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
