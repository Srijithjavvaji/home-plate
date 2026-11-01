-- ==============================================================================
-- HOME PLATE - Complete Supabase PostgreSQL Database Schema
-- “Fresh Homemade Food, Delivered to Your Doorstep”
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null check (role in ('customer', 'seller', 'admin')) default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. SELLERS (Home Cooks & Small Kitchens)
create table if not exists public.sellers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  kitchen_name text not null,
  description text,
  address text not null,
  city text not null,
  state text not null default 'Telangana',
  pincode text not null,
  phone text not null,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  fssai_number text,
  banner_url text,
  logo_url text,
  is_verified boolean default false,
  status text not null check (status in ('pending', 'approved', 'rejected', 'suspended')) default 'pending',
  rating numeric(3, 2) default 5.0,
  total_ratings integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. ADDRESSES
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text default 'Home',
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  phone text not null,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 4. CATEGORIES
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  icon text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 5. FOODS
create table if not exists public.foods (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.sellers(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  original_price numeric(10, 2),
  is_veg boolean default true,
  is_available boolean default true,
  prep_time_minutes integer default 30,
  ingredients text[] default '{}',
  allergens text[] default '{}',
  serving_info text default 'Serves 1-2',
  rating numeric(3, 2) default 4.8,
  total_reviews integer default 0,
  is_featured boolean default false,
  image_url text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. FOOD IMAGES
create table if not exists public.food_images (
  id uuid primary key default uuid_generate_v4(),
  food_id uuid references public.foods(id) on delete cascade not null,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- 7. CART ITEMS
create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  food_id uuid references public.foods(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, food_id)
);

-- 8. ORDERS
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_id uuid references public.profiles(id) on delete restrict not null,
  seller_id uuid references public.sellers(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  delivery_address jsonb not null,
  status text check (status in (
    'pending',
    'payment_pending',
    'paid',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'out_for_delivery',
    'delivered',
    'cancelled'
  )) default 'pending',
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 40.00,
  discount_amount numeric(10, 2) not null default 0.00,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  payment_method text check (payment_method in ('razorpay', 'cod')) not null,
  payment_status text check (payment_status in ('pending', 'paid', 'failed', 'refunded')) default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  notes text,
  estimated_delivery_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. ORDER ITEMS
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  food_id uuid references public.foods(id) on delete set null,
  food_name text not null,
  food_image text,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  total_price numeric(10, 2) not null
);

-- 10. PAYMENTS
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric(10, 2) not null,
  currency text default 'INR',
  status text not null,
  raw_payload jsonb,
  created_at timestamptz default now()
);

-- 11. REVIEWS
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  food_id uuid references public.foods(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- 12. WISHLISTS
create table if not exists public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  food_id uuid references public.foods(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, food_id)
);

-- 13. COUPONS
create table if not exists public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  description text,
  discount_type text check (discount_type in ('percentage', 'fixed')) not null,
  discount_value numeric(10, 2) not null,
  min_order_amount numeric(10, 2) default 0,
  max_discount_amount numeric(10, 2),
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  usage_limit integer,
  times_used integer default 0,
  created_at timestamptz default now()
);

-- 14. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'order',
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 15. DELIVERIES (External Logistics Partner Dispatches e.g., Shadowfax)
create table if not exists public.deliveries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null unique,
  provider text not null default 'shadowfax',
  tracking_id text,
  status text check (status in (
    'pending',
    'serviceability_failed',
    'requested',
    'assigned',
    'arrived_pickup',
    'picked_up',
    'out_for_delivery',
    'arrived_customer',
    'delivered',
    'cancelled',
    'failed'
  )) default 'pending',
  rider_name text,
  rider_phone text,
  rider_lat numeric(10, 7),
  rider_lng numeric(10, 7),
  pickup_address text not null,
  pickup_pincode text not null,
  pickup_lat numeric(10, 7),
  pickup_lng numeric(10, 7),
  drop_address text not null,
  drop_pincode text not null,
  drop_lat numeric(10, 7),
  drop_lng numeric(10, 7),
  estimated_pickup_at timestamptz,
  estimated_delivery_at timestamptz,
  actual_pickup_at timestamptz,
  actual_delivery_at timestamptz,
  status_history jsonb default '[]'::jsonb,
  tracking_url text,
  raw_response jsonb,
  failure_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES FOR PERFORMANCE
create index if not exists idx_foods_seller on public.foods(seller_id);
create index if not exists idx_foods_category on public.foods(category_id);
create index if not exists idx_foods_is_available on public.foods(is_available);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_seller on public.orders(seller_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_cart_user on public.cart_items(user_id);
create index if not exists idx_reviews_food on public.reviews(food_id);
create index if not exists idx_deliveries_order on public.deliveries(order_id);
create index if not exists idx_deliveries_status on public.deliveries(status);
create index if not exists idx_deliveries_tracking on public.deliveries(tracking_id);

-- TRIGGER FOR NEW USER CREATION IN PROFILES
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Home Plate User'),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.foods enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.coupons enable row level security;
alter table public.notifications enable row level security;
alter table public.deliveries enable row level security;

-- Public read policies
create policy "Allow public read on active categories" on public.categories for select using (is_active = true);
create policy "Allow public read on approved sellers" on public.sellers for select using (status = 'approved');
create policy "Allow public read on available foods" on public.foods for select using (is_available = true);
create policy "Allow public read on reviews" on public.reviews for select using (true);
create policy "Allow public read on active coupons" on public.coupons for select using (is_active = true);

-- User private policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can manage own addresses" on public.addresses for all using (auth.uid() = user_id);
create policy "Users can manage own cart" on public.cart_items for all using (auth.uid() = user_id);
create policy "Users can view own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Users can create own orders" on public.orders for insert with check (auth.uid() = customer_id);
create policy "Users can manage own wishlist" on public.wishlists for all using (auth.uid() = user_id);
create policy "Users can create reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);

-- Seller policies
create policy "Sellers can view and edit own seller profile" on public.sellers for all using (auth.uid() = user_id);
create policy "Sellers can manage own foods" on public.foods for all using (
  exists (select 1 from public.sellers where sellers.id = foods.seller_id and sellers.user_id = auth.uid())
);
create policy "Sellers can view own received orders" on public.orders for select using (
  exists (select 1 from public.sellers where sellers.id = orders.seller_id and sellers.user_id = auth.uid())
);
create policy "Sellers can update own received orders" on public.orders for update using (
  exists (select 1 from public.sellers where sellers.id = orders.seller_id and sellers.user_id = auth.uid())
);

-- Admin full access policies
create policy "Admins have full access to profiles" on public.profiles for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins have full access to sellers" on public.sellers for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins have full access to categories" on public.categories for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins have full access to foods" on public.foods for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins have full access to orders" on public.orders for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Deliveries access policies
create policy "Customers can view deliveries for own orders" on public.deliveries for select using (
  exists (select 1 from public.orders where orders.id = deliveries.order_id and orders.customer_id = auth.uid())
);

create policy "Sellers can view deliveries for received orders" on public.deliveries for select using (
  exists (
    select 1 from public.orders
    join public.sellers on sellers.id = orders.seller_id
    where orders.id = deliveries.order_id and sellers.user_id = auth.uid()
  )
);

create policy "Admins have full access to deliveries" on public.deliveries for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- ==============================================================================
-- HOME PLATE - Phase 1 Schema Additions (Settings, Compliance, Payouts, Governance)
-- ==============================================================================

-- 16. APP SETTINGS (Configurable business variables)
create table if not exists public.app_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null,
  description text,
  updated_at timestamptz default now()
);

-- Seed default application settings
insert into public.app_settings (key, value, description)
values
  ('min_order_value', '149'::jsonb, 'Configurable minimum order value in INR'),
  ('free_delivery_threshold', '500'::jsonb, 'Order value above which delivery is free'),
  ('base_delivery_fee', '40'::jsonb, 'Standard hyperlocal base delivery fee'),
  ('tax_percentage', '5.0'::jsonb, 'Applicable GST/tax rate on food items'),
  ('hyderabad_service_pincodes', '["500001","500002","500003","500004","500008","500016","500032","500033","500034","500081","500082","500084","500089","500090"]'::jsonb, 'Active serviceable pincodes in Hyderabad')
on conflict (key) do nothing;

-- 17. CATEGORY COMMISSIONS (Configurable commission percentages by category)
create table if not exists public.category_commissions (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.categories(id) on delete cascade not null unique,
  commission_percentage numeric(5, 2) not null check (commission_percentage >= 0 and commission_percentage <= 100) default 15.00,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 18. SELLER BANK DETAILS (Encrypted and isolated via strict RLS)
create table if not exists public.seller_bank_details (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.sellers(id) on delete cascade not null unique,
  account_holder_name text not null,
  account_number text not null,
  ifsc_code text not null,
  bank_name text not null,
  upi_id text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 19. SELLER DOCUMENTS (Government IDs, FSSAI certificates, Kitchen photos)
create table if not exists public.seller_documents (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.sellers(id) on delete cascade not null,
  doc_type text not null check (doc_type in ('fssai_cert', 'gov_id_front', 'gov_id_back', 'kitchen_photo', 'other')),
  file_url text not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 20. SELLER PAYOUTS (Daily settlement and commission deduction tracking)
create table if not exists public.seller_payouts (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.sellers(id) on delete cascade not null,
  amount numeric(10, 2) not null check (amount > 0),
  commission_deducted numeric(10, 2) not null default 0,
  status text check (status in ('pending', 'eligible', 'processing', 'completed', 'failed')) default 'pending',
  transaction_id text,
  failure_reason text,
  period_start timestamptz,
  period_end timestamptz,
  processed_at timestamptz,
  created_at timestamptz default now()
);

-- 21. COMPLAINTS & DISPUTES
create table if not exists public.complaints (
  id uuid primary key default uuid_generate_v4(),
  ticket_number text not null unique,
  order_id uuid references public.orders(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  seller_id uuid references public.sellers(id) on delete set null,
  category text check (category in (
    'wrong_product',
    'damaged_product',
    'missing_items',
    'poor_quality',
    'spoiled',
    'different_from_desc',
    'packaging',
    'delay',
    'other'
  )) not null,
  description text not null,
  photo_urls text[] default '{}',
  status text check (status in ('open', 'under_investigation', 'approved_refund', 'rejected', 'resolved')) default 'open',
  resolution_notes text,
  resolved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 22. REFUNDS (Online Razorpay or COD settlement tracking)
create table if not exists public.refunds (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  complaint_id uuid references public.complaints(id) on delete set null,
  amount numeric(10, 2) not null check (amount > 0),
  razorpay_refund_id text,
  reason text not null,
  status text check (status in ('pending_review', 'approved', 'processed', 'failed', 'rejected')) default 'pending_review',
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 23. ADMIN AUDIT LOGS (Immutable record of administrative actions)
create table if not exists public.admin_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  previous_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

-- 24. WEBHOOK EVENTS (Idempotency ledger for Razorpay & Shadowfax callbacks)
create table if not exists public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  event_id text not null unique,
  provider text not null check (provider in ('razorpay', 'shadowfax')),
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz default now()
);

-- Alter existing tables with additive columns (safe migrations)
alter table public.foods add column if not exists net_weight text;
alter table public.foods add column if not exists shelf_life_days integer default 30;
alter table public.foods add column if not exists prep_date date;
alter table public.foods add column if not exists pack_date date;
alter table public.foods add column if not exists best_before_date date;
alter table public.foods add column if not exists preparation_type text default 'freshly_prepared';

alter table public.orders add column if not exists parent_order_id text;
alter table public.orders add column if not exists delivery_slot text default 'asap';
alter table public.orders add column if not exists scheduled_at timestamptz;

alter table public.deliveries add column if not exists delivery_otp text;
alter table public.deliveries add column if not exists otp_verified boolean default false;

-- Enable RLS on new tables
alter table public.app_settings enable row level security;
alter table public.category_commissions enable row level security;
alter table public.seller_bank_details enable row level security;
alter table public.seller_documents enable row level security;
alter table public.seller_payouts enable row level security;
alter table public.complaints enable row level security;
alter table public.refunds enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.webhook_events enable row level security;

-- Policies for app_settings
create policy "Allow public read on app_settings" on public.app_settings for select using (true);
create policy "Admins can manage app_settings" on public.app_settings for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin', 'operations_admin'))
);

-- Policies for category_commissions
create policy "Allow public read on category_commissions" on public.category_commissions for select using (true);
create policy "Admins can manage category_commissions" on public.category_commissions for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin', 'operations_admin'))
);

-- Policies for seller_bank_details (Strictly owner and Super Admin only)
create policy "Sellers can view own bank details" on public.seller_bank_details for select using (
  exists (select 1 from public.sellers where sellers.id = seller_bank_details.seller_id and sellers.user_id = auth.uid())
);
create policy "Sellers can manage own bank details" on public.seller_bank_details for all using (
  exists (select 1 from public.sellers where sellers.id = seller_bank_details.seller_id and sellers.user_id = auth.uid())
);
create policy "Admins can view seller bank details" on public.seller_bank_details for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin'))
);

-- Policies for seller_documents
create policy "Sellers can view own documents" on public.seller_documents for select using (
  exists (select 1 from public.sellers where sellers.id = seller_documents.seller_id and sellers.user_id = auth.uid())
);
create policy "Sellers can upload own documents" on public.seller_documents for insert with check (
  exists (select 1 from public.sellers where sellers.id = seller_documents.seller_id and sellers.user_id = auth.uid())
);
create policy "Admins can manage seller documents" on public.seller_documents for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin', 'operations_admin', 'seller_support'))
);

-- Policies for seller_payouts
create policy "Sellers can view own payouts" on public.seller_payouts for select using (
  exists (select 1 from public.sellers where sellers.id = seller_payouts.seller_id and sellers.user_id = auth.uid())
);
create policy "Admins can manage seller payouts" on public.seller_payouts for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin', 'operations_admin'))
);

-- Policies for complaints
create policy "Customers can view and create own complaints" on public.complaints for all using (auth.uid() = customer_id);
create policy "Sellers can view complaints for own kitchen" on public.complaints for select using (
  exists (select 1 from public.sellers where sellers.id = complaints.seller_id and sellers.user_id = auth.uid())
);
create policy "Admins can manage all complaints" on public.complaints for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin', 'operations_admin', 'seller_support'))
);

-- Policies for refunds
create policy "Customers can view refunds for own orders" on public.refunds for select using (
  exists (select 1 from public.orders where orders.id = refunds.order_id and orders.customer_id = auth.uid())
);
create policy "Admins can manage all refunds" on public.refunds for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin', 'operations_admin'))
);

-- Policies for admin audit logs
create policy "Admins can view audit logs" on public.admin_audit_logs for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin'))
);
create policy "Admins can insert audit logs" on public.admin_audit_logs for insert with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin', 'operations_admin', 'seller_support'))
);
