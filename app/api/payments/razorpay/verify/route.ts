import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { store } from "@/lib/data/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: "Missing required Razorpay payment identifiers" },
        { status: 400 }
      );
    }

    // SERVER-SIDE HMAC-SHA256 SIGNATURE VERIFICATION
    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature || "",
    });

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // Fetch existing order to check duplicate payment
    const existingOrder = await store.getOrderById(orderId || razorpay_order_id);
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.payment_status === "paid") {
      // Already processed safely
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        orderId: existingOrder.id,
      });
    }

    // Mark order as PAID & CONFIRMED only after signature verification
    const updatedOrder = await store.markOrderPaid(
      existingOrder.id,
      razorpay_payment_id,
      razorpay_signature
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: updatedOrder?.id || existingOrder.id,
      orderNumber: updatedOrder?.order_number || existingOrder.order_number,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal payment verification error" },
      { status: 500 }
    );
  }
}
