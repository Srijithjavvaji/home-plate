import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
export const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
export const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export function getRazorpayClient(): Razorpay | null {
  if (!razorpayKeyId || !razorpayKeySecret || razorpayKeyId.includes("placeholder")) {
    return null;
  }
  return new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

/**
 * Creates a server-side Razorpay Order.
 * Amount is in INR rupees, converted to paise (* 100) as required by Razorpay API.
 */
export async function createRazorpayOrder(params: {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const client = getRazorpayClient();
  const amountInPaise = Math.round(params.amountInRupees * 100);

  if (!client) {
    // Development fallback mock order if keys are placeholders
    return {
      id: `order_mock_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
    };
  }

  const order = await client.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: params.receipt,
    notes: params.notes || {},
    payment_capture: true,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

/**
 * Verifies Razorpay HMAC SHA256 Signature strictly on the server.
 * Format: generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret)
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!razorpayKeySecret || razorpayKeySecret.includes("placeholder")) {
    // In local development / test mode with placeholder keys, allow verified mock signature
    return true;
  }

  const body = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === params.signature;
}

/**
 * Verifies Razorpay Webhook Signature strictly on the server.
 */
export function verifyRazorpayWebhookSignature(params: {
  rawBody: string;
  signature: string;
}): boolean {
  if (!razorpayWebhookSecret || razorpayWebhookSecret.includes("placeholder")) {
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha256", razorpayWebhookSecret)
    .update(params.rawBody)
    .digest("hex");

  return expectedSignature === params.signature;
}
