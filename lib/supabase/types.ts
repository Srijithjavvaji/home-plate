export type UserRole = "customer" | "seller" | "admin";

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
  serving_info: string;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  image_url: string;
  created_at?: string;
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
  estimated_delivery_at?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  customer?: Profile;
  seller?: Seller;
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
}
