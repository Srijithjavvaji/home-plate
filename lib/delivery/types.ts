// ==============================================================================
// HOME PLATE - Delivery Abstraction Layer Types
// Unified multi-provider logistics interface
// ==============================================================================

export type DeliveryProviderName = "shadowfax" | "internal";

export type DeliveryStatus =
  | "pending"                // Order confirmed, awaiting dispatch
  | "serviceability_failed"  // Address outside serviceable zone
  | "requested"              // Dispatch request accepted by provider
  | "assigned"               // Delivery rider allotted
  | "arrived_pickup"         // Rider reached kitchen / pickup point
  | "picked_up"              // Rider picked up food package
  | "out_for_delivery"       // En route to customer drop location
  | "arrived_customer"       // Rider reached customer doorstep
  | "delivered"              // Successfully handed over to customer
  | "cancelled"              // Order or delivery cancelled
  | "failed";                // Delivery attempted but failed / RTO

export interface RiderInfo {
  name?: string;
  phone?: string;
  vehicle_number?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeliveryAddressCoordinates {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface ServiceabilityCheckRequest {
  pickup_pincode: string;
  drop_pincode: string;
  pickup_lat?: number;
  pickup_lng?: number;
  drop_lat?: number;
  drop_lng?: number;
  order_value?: number;
}

export interface ServiceabilityResponse {
  is_serviceable: boolean;
  provider: DeliveryProviderName;
  estimated_delivery_time_minutes?: number;
  estimated_fee?: number;
  reasons?: string[];
  serviceable_tier?: string;
}

export interface CreateDeliveryItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CreateDeliveryRequest {
  order_id: string;
  order_number: string;
  pickup: DeliveryAddressCoordinates;
  drop: DeliveryAddressCoordinates;
  items: CreateDeliveryItem[];
  payment_type: "prepaid" | "cod";
  cod_amount?: number;
  order_value: number;
  prep_time_minutes?: number;
}

export interface CreateDeliveryResponse {
  success: boolean;
  provider: DeliveryProviderName;
  delivery_id: string;
  tracking_id: string;
  status: DeliveryStatus;
  tracking_url?: string;
  estimated_delivery_at?: string;
  error?: string;
  raw_response?: any;
}

export interface StatusHistoryEntry {
  status: DeliveryStatus;
  timestamp: string;
  description: string;
}

export interface TrackingInfo {
  delivery_id: string;
  tracking_id: string;
  provider: DeliveryProviderName;
  status: DeliveryStatus;
  rider?: RiderInfo;
  pickup_lat?: number;
  pickup_lng?: number;
  drop_lat?: number;
  drop_lng?: number;
  estimated_pickup_at?: string;
  estimated_delivery_at?: string;
  actual_pickup_at?: string;
  actual_delivery_at?: string;
  status_history: StatusHistoryEntry[];
  tracking_url?: string;
  raw_response?: any;
}

export interface CancelDeliveryResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface WebhookEventPayload {
  tracking_id: string;
  order_number?: string;
  status: DeliveryStatus;
  rider?: RiderInfo;
  timestamp: string;
  notes?: string;
  raw: any;
}

export interface IDeliveryProvider {
  name: DeliveryProviderName;
  isConfigured(): boolean;
  checkServiceability(req: ServiceabilityCheckRequest): Promise<ServiceabilityResponse>;
  createDelivery(req: CreateDeliveryRequest): Promise<CreateDeliveryResponse>;
  trackDelivery(trackingId: string): Promise<TrackingInfo>;
  cancelDelivery(trackingId: string, reason?: string): Promise<CancelDeliveryResponse>;
  verifyWebhookSignature(signature: string, payload: string): boolean;
  parseWebhookPayload(body: any): WebhookEventPayload;
}
