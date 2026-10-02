import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { store } from "@/lib/data/store";
import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { DeliveryTrackingMap } from "@/components/order/DeliveryTrackingMap";
import { formatPrice, formatDate, getStatusInfo } from "@/lib/utils";
import { ArrowLeft, MapPin, Phone, CreditCard, ShieldCheck, ChefHat, Bike, ExternalLink } from "lucide-react";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;
  const order = await store.getOrderById(id);

  if (!order) {
    notFound();
  }

  const delivery = await store.getDeliveryByOrderId(order.id);
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950">
                Order #{order.order_number}
              </h1>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-500">Total Paid Amount</span>
            <p className="text-2xl font-black text-emerald-700">
              {formatPrice(order.total_amount)}
            </p>
          </div>
        </div>

        {/* Visual Progress Tracker */}
        <div className="mb-6">
          <OrderStatusTracker
            status={order.status}
            estimatedDelivery={order.estimated_delivery_at}
            delivery={delivery}
          />
        </div>

        {/* Live Delivery Route & Tracking Map */}
        <div className="mb-6">
          <DeliveryTrackingMap
            delivery={delivery}
            orderNumber={order.order_number}
            orderStatus={order.status}
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ordered Items */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Items in this Order
            </h3>

            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-900">{item.food_name}</p>
                    <p className="text-gray-500 text-[11px]">
                      {item.quantity} x {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <span className="font-extrabold text-gray-950">
                    {formatPrice(item.total_price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{order.delivery_fee === 0 ? "FREE" : formatPrice(order.delivery_fee)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>- {formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between font-extrabold text-sm text-gray-950">
                <span>Grand Total</span>
                <span className="text-emerald-700">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
                Delivery Location
              </h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p className="font-bold text-gray-900 text-sm">
                  {order.delivery_address?.name || "Customer"}
                </p>
                <p className="text-gray-500">{order.delivery_address?.address_line1}</p>
                {order.delivery_address?.address_line2 && (
                  <p className="text-gray-500">{order.delivery_address.address_line2}</p>
                )}
                <p className="text-gray-500">
                  {order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.pincode}
                </p>
                <p className="text-gray-500 pt-1">
                  Phone: <strong>{order.delivery_address?.phone}</strong>
                </p>
              </div>
            </div>

            {/* Logistics Partner & Rider Details */}
            {delivery && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Logistics Fulfillment
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {delivery.provider}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tracking Reference</span>
                    <span className="font-mono font-bold text-gray-900">
                      {delivery.tracking_id}
                    </span>
                  </div>
                  {delivery.rider_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Courier</span>
                      <span className="font-bold text-purple-700">
                        {delivery.rider_name}
                      </span>
                    </div>
                  )}
                  {delivery.rider_phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Courier Contact</span>
                      <a
                        href={`tel:${delivery.rider_phone}`}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{delivery.rider_phone}</span>
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courier Status</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {delivery.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
                Payment Verification
              </h3>
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Gateway</span>
                  <span className="font-bold uppercase text-gray-900">
                    {order.payment_method === "razorpay" ? "Razorpay Gateway" : "Cash on Delivery"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-bold text-emerald-700 uppercase">
                    {order.payment_status}
                  </span>
                </div>
                {order.razorpay_payment_id && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Razorpay Payment ID</span>
                    <span className="font-mono text-gray-700">
                      {order.razorpay_payment_id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
