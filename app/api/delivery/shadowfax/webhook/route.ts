import { NextResponse } from "next/server";
import { store } from "@/lib/data/store";
import { shadowfaxInstance } from "@/lib/delivery/provider";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-shadowfax-signature") || "";

    // Verify webhook signature if secret configured
    if (shadowfaxInstance.isConfigured()) {
      const isValid = shadowfaxInstance.verifyWebhookSignature(signature, rawBody);
      if (!isValid) {
        console.warn("[Shadowfax Webhook] Invalid signature rejected");
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    const event = shadowfaxInstance.parseWebhookPayload(payload);
    console.info(`[Shadowfax Webhook Received] Tracking: ${event.tracking_id} Status: ${event.status}`);

    // Lookup delivery by tracking id or client order number
    let delivery = await store.getDeliveryById(event.tracking_id);
    if (!delivery && event.order_number) {
      const order = await store.getOrderById(event.order_number);
      if (order) {
        delivery = await store.getDeliveryByOrderId(order.id);
      }
    }

    if (!delivery) {
      console.warn(`[Shadowfax Webhook] No matching delivery found for tracking_id: ${event.tracking_id}`);
      return NextResponse.json({ success: true, warning: "Delivery record not found" });
    }

    // Append to status history
    const existingHistory = delivery.status_history || [];
    const newEntry = {
      status: event.status,
      timestamp: event.timestamp || new Date().toISOString(),
      description: event.notes || `Shadowfax event: ${event.status.replace(/_/g, " ")}`,
    };

    // Update delivery record
    const updatedDelivery = await store.updateDelivery(delivery.id, {
      status: event.status,
      rider_name: event.rider?.name || delivery.rider_name,
      rider_phone: event.rider?.phone || delivery.rider_phone,
      rider_lat: event.rider?.latitude || delivery.rider_lat,
      rider_lng: event.rider?.longitude || delivery.rider_lng,
      actual_pickup_at: event.status === "picked_up" ? new Date().toISOString() : delivery.actual_pickup_at,
      actual_delivery_at: event.status === "delivered" ? new Date().toISOString() : delivery.actual_delivery_at,
      status_history: [...existingHistory, newEntry],
      raw_response: payload,
    });

    // Synchronize parent order status based on verified external delivery milestones
    const order = await store.getOrderById(delivery.order_id);
    if (order) {
      if (event.status === "out_for_delivery" || event.status === "picked_up") {
        await store.updateOrderStatus(order.id, "out_for_delivery");
        await sendNotification({
          user_id: order.customer_id,
          title: "Out for Delivery",
          message: `${event.rider?.name ? event.rider.name : "Your Shadowfax rider"} is on the way with your food order #${order.order_number}!`,
          type: "delivery",
          link: `/orders/${order.id}`,
        });
      } else if (event.status === "delivered") {
        await store.updateOrderStatus(order.id, "delivered");
        await sendNotification({
          user_id: order.customer_id,
          title: "Order Delivered!",
          message: `Your food order #${order.order_number} has been delivered. Enjoy your delicious homemade meal!`,
          type: "delivery",
          link: `/orders/${order.id}`,
        });
      } else if (event.status === "assigned" && event.rider?.name) {
        await sendNotification({
          user_id: order.customer_id,
          title: "Rider Assigned",
          message: `${event.rider.name} has been assigned to pick up your order #${order.order_number}.`,
          type: "delivery",
          link: `/orders/${order.id}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: true,
      delivery_id: updatedDelivery?.id,
      status: event.status,
    });
  } catch (err: any) {
    console.error("[Shadowfax Webhook Processing Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}
