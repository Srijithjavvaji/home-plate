import { NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { store } from "@/lib/data/store";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = event.payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId && paymentId) {
        await store.markOrderPaid(orderId, paymentId);
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = event.payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        const order = await store.getOrderById(orderId);
        if (order) {
          await store.updateOrderStatus(order.id, "payment_pending");
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
