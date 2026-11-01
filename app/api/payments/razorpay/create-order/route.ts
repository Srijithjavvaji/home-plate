import { NextResponse } from "next/server";
import { createRazorpayOrder, razorpayKeyId } from "@/lib/razorpay";
import { store } from "@/lib/data/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode, deliveryAddress, customerId, deliverySlot, scheduledAt } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    // SERVER-SIDE CALCULATION: Never trust client-calculated price!
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await store.getFoodById(item.food_id || item.food?.id);
      if (!food) {
        return NextResponse.json(
          { error: `Item ${item.food_id} is no longer available` },
          { status: 400 }
        );
      }
      if (!food.is_available) {
        return NextResponse.json(
          { error: `${food.name} is currently sold out` },
          { status: 400 }
        );
      }

      const itemTotal = food.price * item.quantity;
      calculatedSubtotal += itemTotal;
      validatedItems.push({
        food_id: food.id,
        food_name: food.name,
        food_image: food.image_url,
        unit_price: food.price,
        quantity: item.quantity,
        total_price: itemTotal,
        seller_id: food.seller_id,
      });
    }

    // 1. Configurable Minimum Order Value Enforcement
    const minOrderValue = await store.getAppSetting("min_order_value", 149);
    if (calculatedSubtotal < minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value is ₹${minOrderValue}. Please add more items (Current: ₹${calculatedSubtotal})` },
        { status: 400 }
      );
    }

    // 2. Configurable Delivery Fee
    const freeDeliveryThreshold = await store.getAppSetting("free_delivery_threshold", 500);
    const baseDeliveryFee = await store.getAppSetting("base_delivery_fee", 40);
    let deliveryFee = calculatedSubtotal >= freeDeliveryThreshold ? 0 : baseDeliveryFee;
    let discount = 0;

    // 3. Server-side Coupon Validation
    if (couponCode) {
      const coupon = await store.getCoupon(couponCode);
      if (coupon && calculatedSubtotal >= coupon.min_order_amount) {
        if (coupon.code === "FREESHIP") {
          deliveryFee = 0;
        } else if (coupon.discount_type === "fixed") {
          discount = coupon.discount_value;
        } else if (coupon.discount_type === "percentage") {
          const calcDiscount = (calculatedSubtotal * coupon.discount_value) / 100;
          discount = coupon.max_discount_amount
            ? Math.min(calcDiscount, coupon.max_discount_amount)
            : calcDiscount;
        }
      }
    }

    const finalTotal = Math.max(0, calculatedSubtotal + deliveryFee - discount);
    const receiptId = `rcpt_${Date.now()}`;

    // Create server-side Razorpay Order
    const razorpayOrder = await createRazorpayOrder({
      amountInRupees: finalTotal,
      receipt: receiptId,
      notes: {
        customerId: customerId || "guest",
        address: deliveryAddress?.address_line1 || "",
      },
    });

    // Create Home Plate Order (with multi-seller split support)
    const newOrder = await store.createOrder({
      customer_id: customerId || "u0000000-0000-0000-0000-000000000001",
      delivery_address: deliveryAddress,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      discount_amount: discount,
      total_amount: finalTotal,
      payment_method: "razorpay",
      razorpay_order_id: razorpayOrder.id,
      delivery_slot: deliverySlot || "asap",
      scheduled_at: scheduledAt,
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId || "rzp_test_placeholder_key_id",
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      parentOrderId: newOrder.parent_order_id,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
