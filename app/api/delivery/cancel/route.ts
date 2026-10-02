import { NextResponse } from "next/server";
import { store } from "@/lib/data/store";
import { getDeliveryProvider } from "@/lib/delivery/provider";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, delivery_id, reason } = body;

    if (!order_id && !delivery_id) {
      return NextResponse.json(
        { error: "order_id or delivery_id is required." },
        { status: 400 }
      );
    }

    let delivery = null;
    if (order_id) {
      delivery = await store.getDeliveryByOrderId(order_id);
    } else if (delivery_id) {
      delivery = await store.getDeliveryById(delivery_id);
    }

    if (!delivery) {
      return NextResponse.json({ error: "Delivery record not found." }, { status: 404 });
    }

    const provider = getDeliveryProvider(delivery.provider);
    if (delivery.tracking_id) {
      const cancelRes = await provider.cancelDelivery(delivery.tracking_id, reason);
      if (!cancelRes.success) {
        return NextResponse.json(
          { error: cancelRes.message || "Provider refused delivery cancellation." },
          { status: 400 }
        );
      }
    }

    const updated = await store.updateDelivery(delivery.id, {
      status: "cancelled",
      failure_reason: reason || "Cancelled by user / admin request",
    });

    // Notify customer
    const order = await store.getOrderById(delivery.order_id);
    if (order) {
      await sendNotification({
        user_id: order.customer_id,
        title: "Delivery Cancelled",
        message: `Delivery for order #${order.order_number} has been cancelled.`,
        type: "delivery",
        link: `/orders/${order.id}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Delivery successfully cancelled.",
      delivery: updated,
    });
  } catch (err: any) {
    console.error("[Delivery Cancel API Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to cancel delivery" },
      { status: 500 }
    );
  }
}
