import { NextResponse } from "next/server";
import { store } from "@/lib/data/store";
import { getDeliveryProvider } from "@/lib/delivery/provider";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");
    const trackingId = searchParams.get("tracking_id");
    const deliveryId = searchParams.get("delivery_id");

    if (!orderId && !trackingId && !deliveryId) {
      return NextResponse.json(
        { error: "Provide either order_id, tracking_id, or delivery_id." },
        { status: 400 }
      );
    }

    let delivery = null;
    if (orderId) {
      delivery = await store.getDeliveryByOrderId(orderId);
    } else if (trackingId) {
      delivery = await store.getDeliveryById(trackingId);
    } else if (deliveryId) {
      delivery = await store.getDeliveryById(deliveryId);
    }

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found." }, { status: 404 });
    }

    const provider = getDeliveryProvider(delivery.provider);

    // If provider is live and tracking_id exists, poll provider for live updates
    if (provider.isConfigured() && delivery.tracking_id) {
      try {
        const liveTrack = await provider.trackDelivery(delivery.tracking_id);
        if (liveTrack && liveTrack.status !== delivery.status) {
          const updated = await store.updateDelivery(delivery.id, {
            status: liveTrack.status,
            rider_name: liveTrack.rider?.name || delivery.rider_name,
            rider_phone: liveTrack.rider?.phone || delivery.rider_phone,
            rider_lat: liveTrack.rider?.latitude || delivery.rider_lat,
            rider_lng: liveTrack.rider?.longitude || delivery.rider_lng,
            actual_pickup_at: liveTrack.actual_pickup_at || delivery.actual_pickup_at,
            actual_delivery_at: liveTrack.actual_delivery_at || delivery.actual_delivery_at,
            status_history: liveTrack.status_history || delivery.status_history,
          });

          if (updated) {
            delivery = updated;
            // Sync order status if delivery reached terminal states
            if (liveTrack.status === "delivered") {
              await store.updateOrderStatus(delivery.order_id, "delivered");
            } else if (liveTrack.status === "out_for_delivery") {
              await store.updateOrderStatus(delivery.order_id, "out_for_delivery");
            }
          }
        }
      } catch (pollErr) {
        console.warn("[Delivery Live Tracking Poll Warning]", pollErr);
      }
    }

    return NextResponse.json({
      success: true,
      delivery,
      provider: delivery.provider,
      is_live_configured: provider.isConfigured(),
    });
  } catch (err: any) {
    console.error("[Delivery Status API Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch delivery status" },
      { status: 500 }
    );
  }
}
