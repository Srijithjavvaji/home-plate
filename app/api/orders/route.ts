import { NextResponse } from "next/server";
import { store } from "@/lib/data/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, deliveryAddress, customerId, notes, couponCode, paymentMethod, deliverySlot, scheduledAt } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Server-side recalculation
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await store.getFoodById(item.food_id || item.food?.id);
      if (!food) {
        return NextResponse.json(
          { error: `Item ${item.food_id} not available` },
          { status: 400 }
        );
      }
      const itemPrice = food.price * item.quantity;
      subtotal += itemPrice;
      validatedItems.push({
        food_id: food.id,
        food_name: food.name,
        food_image: food.image_url,
        unit_price: food.price,
        quantity: item.quantity,
        total_price: itemPrice,
        seller_id: food.seller_id,
      });
    }

    // Configurable Minimum Order Value Enforcement
    const minOrderValue = await store.getAppSetting("min_order_value", 149);
    if (subtotal < minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value is ₹${minOrderValue}. Please add more items (Current: ₹${subtotal})` },
        { status: 400 }
      );
    }

    // Configurable Delivery Fee
    const freeDeliveryThreshold = await store.getAppSetting("free_delivery_threshold", 500);
    const baseDeliveryFee = await store.getAppSetting("base_delivery_fee", 40);
    let deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : baseDeliveryFee;
    let discount = 0;

    if (couponCode) {
      const coupon = await store.getCoupon(couponCode);
      if (coupon && subtotal >= coupon.min_order_amount) {
        if (coupon.code === "FREESHIP") {
          deliveryFee = 0;
        } else if (coupon.discount_type === "fixed") {
          discount = coupon.discount_value;
        } else if (coupon.discount_type === "percentage") {
          discount = (subtotal * coupon.discount_value) / 100;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

    const order = await store.createOrder({
      customer_id: customerId || "u0000000-0000-0000-0000-000000000001",
      delivery_address: deliveryAddress,
      items: validatedItems,
      subtotal,
      delivery_fee: deliveryFee,
      discount_amount: discount,
      total_amount: totalAmount,
      payment_method: paymentMethod || "cod",
      notes,
      delivery_slot: deliverySlot || "asap",
      scheduled_at: scheduledAt,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      parentOrderId: order.parent_order_id,
    });
  } catch (error: any) {
    console.error("Order creation API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const orders = await store.getOrders();
  return NextResponse.json({ orders });
}
