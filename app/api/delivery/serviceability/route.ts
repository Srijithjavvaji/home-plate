import { NextResponse } from "next/server";
import { getDeliveryProvider } from "@/lib/delivery/provider";
import { ServiceabilityCheckRequest } from "@/lib/delivery/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pickup_pincode, drop_pincode, pickup_lat, pickup_lng, drop_lat, drop_lng, order_value } = body;

    if (!pickup_pincode || !drop_pincode) {
      return NextResponse.json(
        { error: "Both pickup_pincode and drop_pincode are required." },
        { status: 400 }
      );
    }

    const provider = getDeliveryProvider();
    const checkReq: ServiceabilityCheckRequest = {
      pickup_pincode: String(pickup_pincode),
      drop_pincode: String(drop_pincode),
      pickup_lat: pickup_lat ? Number(pickup_lat) : undefined,
      pickup_lng: pickup_lng ? Number(pickup_lng) : undefined,
      drop_lat: drop_lat ? Number(drop_lat) : undefined,
      drop_lng: drop_lng ? Number(drop_lng) : undefined,
      order_value: order_value ? Number(order_value) : undefined,
    };

    const result = await provider.checkServiceability(checkReq);

    return NextResponse.json({
      success: true,
      serviceability: result,
      provider: provider.name,
      is_live_configured: provider.isConfigured(),
    });
  } catch (err: any) {
    console.error("[Delivery Serviceability API Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to check delivery serviceability" },
      { status: 500 }
    );
  }
}
