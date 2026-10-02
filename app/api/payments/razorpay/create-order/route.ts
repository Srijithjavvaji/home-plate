import { NextResponse } from "next/server";
import { createRazorpayOrder, razorpayKeyId } from "@/lib/razorpay";
import { store } from "@/lib/data/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode, deliveryAddress, customerId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    // SERVER-SIDE CALCULATION: Never trust client-calculated price!
    // Re-fetch food items from database to compute real price
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await store.getFoodById(item.food_id || item.food?.id);
      if (!food) {
        return NextResponse.json(
          { error: `Item ${item.food_id} no longer exists` },
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
      });
    }

    // Delivery fee rule: Free above 500, else 40
    let deliveryFee = calculatedSubtotal >= 500 ? 0 : 40;
    let discount = 0;

    // Validate Coupon securely on server
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

    // Create Home Plate Order in database with status 'payment_pending'
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
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId || "rzp_test_placeholder_key_id",
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
