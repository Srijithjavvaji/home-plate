import { NextResponse } from "next/server";
import { store } from "@/lib/data/store";
import { getDeliveryProvider } from "@/lib/delivery/provider";
import { CreateDeliveryRequest } from "@/lib/delivery/types";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "order_id is required." }, { status: 400 });
    }

    const order = await store.getOrderById(order_id);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Check if delivery is already active
    const existingDelivery = await store.getDeliveryByOrderId(order.id);
    if (existingDelivery && existingDelivery.status !== "failed" && existingDelivery.status !== "cancelled") {
      return NextResponse.json({
        success: true,
        message: "Delivery request already registered for this order.",
        delivery: existingDelivery,
      });
    }

    // Resolve seller information
    let seller = order.seller;
    if (!seller && order.seller_id) {
      seller = (await store.getSellerById(order.seller_id)) || undefined;
    }
    if (!seller) {
      const sellers = await store.getSellers();
      seller = sellers[0];
    }

    const pickupAddress = seller
      ? `${seller.address}, ${seller.city}, ${seller.state} - ${seller.pincode}`
      : "Home Plate Kitchen Hub, Madhapur, Hyderabad, Telangana - 500081";

    const pickupPincode = seller?.pincode || "500081";
    const pickupLat = seller?.latitude || 17.4483;
    const pickupLng = seller?.longitude || 78.3915;

    const drop = order.delivery_address;
    const dropAddress = `${drop.address_line1}${drop.address_line2 ? ", " + drop.address_line2 : ""}, ${drop.city}, ${drop.state} - ${drop.pincode}`;
    const dropPincode = drop.pincode || "500081";
    const dropLat = drop.latitude || 17.4435;
    const dropLng = drop.longitude || 78.3772;

    const provider = getDeliveryProvider();
    const deliveryReq: CreateDeliveryRequest = {
      order_id: order.id,
      order_number: order.order_number,
      pickup: {
        name: seller?.kitchen_name || "Home Plate Kitchen",
        phone: seller?.phone || "+919876511001",
        address: pickupAddress,
        city: seller?.city || "Hyderabad",
        state: seller?.state || "Telangana",
        pincode: pickupPincode,
        latitude: pickupLat,
        longitude: pickupLng,
      },
      drop: {
        name: drop.name || "Customer",
        phone: drop.phone || "+919876522001",
        address: dropAddress,
        city: drop.city || "Hyderabad",
        state: drop.state || "Telangana",
        pincode: dropPincode,
        latitude: dropLat,
        longitude: dropLng,
        notes: order.notes,
      },
      items: (order.items || []).map((it) => ({
        name: it.food_name,
        quantity: it.quantity,
        price: it.unit_price,
      })),
      payment_type: order.payment_method === "cod" ? "cod" : "prepaid",
      cod_amount: order.payment_method === "cod" ? order.total_amount : 0,
      order_value: order.total_amount,
    };

    const res = await provider.createDelivery(deliveryReq);

    if (!res.success) {
      // Record failed delivery attempt
      const failedDelivery = await store.createDelivery({
        order_id: order.id,
        provider: provider.name,
        tracking_id: `SFX-ERR-${Date.now()}`,
        status: "failed",
        pickup_address: pickupAddress,
        pickup_pincode: pickupPincode,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        drop_address: dropAddress,
        drop_pincode: dropPincode,
        drop_lat: dropLat,
        drop_lng: dropLng,
        failure_reason: res.error,
        raw_response: res.raw_response,
        status_history: [
          {
            status: "failed",
            timestamp: new Date().toISOString(),
            description: res.error || "Shadowfax dispatch failed",
          },
        ],
      });

      return NextResponse.json(
        {
          success: false,
          error: res.error || "Failed to create delivery with provider",
          delivery: failedDelivery,
        },
        { status: 502 }
      );
    }

    // Save successful delivery in store
    const createdDelivery = await store.createDelivery({
      order_id: order.id,
      provider: provider.name,
      tracking_id: res.tracking_id,
      status: res.status,
      pickup_address: pickupAddress,
      pickup_pincode: pickupPincode,
      pickup_lat: pickupLat,
      pickup_lng: pickupLng,
      drop_address: dropAddress,
      drop_pincode: dropPincode,
      drop_lat: dropLat,
      drop_lng: dropLng,
      estimated_delivery_at: res.estimated_delivery_at,
      tracking_url: res.tracking_url,
      raw_response: res.raw_response,
      status_history: [
        {
          status: res.status,
          timestamp: new Date().toISOString(),
          description: `Dispatched to ${provider.name.toUpperCase()} Hyperlocal delivery network.`,
        },
      ],
    });

    // Update order status to ready_for_pickup
    await store.updateOrderStatus(order.id, "ready_for_pickup");

    // Send notifications to customer and seller
    await sendNotification({
      user_id: order.customer_id,
      title: "Food Ready for Pickup",
      message: `Your meal from ${seller?.kitchen_name || "the kitchen"} is packed! Delivery dispatched with ${provider.name.toUpperCase()} (Tracking: ${res.tracking_id}).`,
      type: "delivery",
      link: `/orders/${order.id}`,
    });

    if (seller?.user_id) {
      await sendNotification({
        user_id: seller.user_id,
        title: "Rider Dispatched",
        message: `Delivery requested for order #${order.order_number}. Rider will arrive for pickup shortly.`,
        type: "delivery",
        link: `/seller/orders`,
      });
    }

    return NextResponse.json({
      success: true,
      delivery: createdDelivery,
      provider: provider.name,
      tracking_id: res.tracking_id,
    });
  } catch (err: any) {
    console.error("[Delivery Create API Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to initiate delivery dispatch" },
      { status: 500 }
    );
  }
}
