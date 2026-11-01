export type UserRole = "customer" | "seller" | "admin" | "super_admin" | "operations_admin" | "seller_support";

export type SellerStatus = "pending" | "approved" | "rejected" | "suspended";

export type OrderStatus =
  | "pending"
  | "payment_pending"
  | "paid"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "razorpay" | "cod";

export type DeliveryProviderName = "shadowfax" | "internal";

export type DeliveryStatus =
  | "pending"
  | "serviceability_failed"
  | "requested"
  | "assigned"
  | "arrived_pickup"
  | "picked_up"
  | "out_for_delivery"
  | "arrived_customer"
  | "delivered"
  | "cancelled"
  | "failed";

export interface StatusHistoryEntry {
  status: DeliveryStatus;
  timestamp: string;
  description: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface Seller {
  id: string;
  user_id: string;
  kitchen_name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  fssai_number?: string;
  banner_url?: string;
  logo_url?: string;
  is_verified: boolean;
  status: SellerStatus;
  rating: number;
  total_ratings: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  icon?: string;
  is_active: boolean;
  times_used?: number;
  created_at?: string;
}

export interface Food {
  id: string;
  seller_id: string;
  category_id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  is_veg: boolean;
  is_available: boolean;
  prep_time_minutes: number;
  ingredients: string[];
  allergens?: string[];
  net_weight?: string;
  shelf_life_days?: number;
  prep_date?: string;
  pack_date?: string;
  best_before_date?: string;
  preparation_type?: "freshly_prepared" | "batch_packed" | "sun_cured" | "traditional";
  serving_info: string;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  image_url: string;
  created_at?: string;
  updated_at?: string;
  seller?: Seller;
  category?: Category;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface CartItem {
  id: string;
  food_id: string;
  food: Food;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_id?: string;
  food_name: string;
  food_image?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Delivery {
  id: string;
  order_id: string;
  provider: DeliveryProviderName;
  tracking_id: string;
  status: DeliveryStatus;
  rider_name?: string;
  rider_phone?: string;
  rider_lat?: number;
  rider_lng?: number;
  pickup_address: string;
  pickup_pincode: string;
  pickup_lat?: number;
  pickup_lng?: number;
  drop_address: string;
  drop_pincode: string;
  drop_lat?: number;
  drop_lng?: number;
  estimated_pickup_at?: string;
  estimated_delivery_at?: string;
  actual_pickup_at?: string;
  actual_delivery_at?: string;
  status_history?: StatusHistoryEntry[];
  tracking_url?: string;
  raw_response?: any;
  failure_reason?: string;
  delivery_otp?: string;
  otp_verified?: boolean;
  created_at: string;
  updated_at?: string;
  order?: Order;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  seller_id?: string;
  address_id?: string;
  delivery_address: {
    label?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    name?: string;
    latitude?: number;
    longitude?: number;
  };
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  notes?: string;
  parent_order_id?: string;
  delivery_slot?: "asap" | "scheduled";
  scheduled_at?: string;
  estimated_delivery_at?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  customer?: Profile;
  seller?: Seller;
  delivery?: Delivery;
}

export interface Review {
  id: string;
  user_id: string;
  food_id: string;
  order_id?: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: Profile;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
  times_used?: number;
  created_at?: string;
}


export interface AppSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  updated_at?: string;
}

export interface CategoryCommission {
  id: string;
  category_id: string;
  commission_percentage: number;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export interface SellerBankDetails {
  id: string;
  seller_id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  upi_id?: string;
  is_verified: boolean;
  created_at?: string;
}

export interface SellerDocument {
  id: string;
  seller_id: string;
  doc_type: "fssai_cert" | "gov_id_front" | "gov_id_back" | "kitchen_photo" | "other";
  file_url: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  created_at?: string;
}

export interface SellerPayout {
  id: string;
  seller_id: string;
  amount: number;
  commission_deducted: number;
  status: "pending" | "eligible" | "processing" | "completed" | "failed";
  transaction_id?: string;
  failure_reason?: string;
  period_start?: string;
  period_end?: string;
  processed_at?: string;
  created_at?: string;
}

export type ComplaintCategory =
  | "wrong_product"
  | "damaged_product"
  | "missing_items"
  | "poor_quality"
  | "spoiled"
  | "different_from_desc"
  | "packaging"
  | "delay"
  | "other";

export type ComplaintStatus =
  | "open"
  | "under_investigation"
  | "approved_refund"
  | "rejected"
  | "resolved";

export interface Complaint {
  id: string;
  ticket_number: string;
  order_id: string;
  customer_id: string;
  seller_id?: string;
  category: ComplaintCategory;
  description: string;
  photo_urls?: string[];
  status: ComplaintStatus;
  resolution_notes?: string;
  resolved_by?: string;
  created_at: string;
  updated_at?: string;
  order?: Order;
  customer?: Profile;
  seller?: Seller;
}

export type RefundStatus = "pending_review" | "approved" | "processed" | "failed" | "rejected";

export interface Refund {
  id: string;
  order_id: string;
  complaint_id?: string;
  amount: number;
  razorpay_refund_id?: string;
  reason: string;
  status: RefundStatus;
  reviewed_by?: string;
  created_at: string;
  updated_at?: string;
  order?: Order;
}

export interface AdminAuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_data?: any;
  new_data?: any;
  created_at: string;
  actor?: Profile;
}

export interface WebhookEvent {
  id: string;
  event_id: string;
  provider: "razorpay" | "shadowfax";
  event_type: string;
  payload: any;
  processed_at: string;
}
