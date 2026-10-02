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
