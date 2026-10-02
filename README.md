# 🍽️ HOME PLATE
> **“Fresh Homemade Food, Delivered to Your Doorstep”**

Home Plate is a full-stack homemade food delivery platform connecting neighborhood food lovers with verified home cooks, mothers, and artisanal food businesses. Built with Next.js 15+ (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL & Auth, Razorpay Payment Gateway, and official **Shadowfax Hyperlocal Logistics Integration**.

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Key Features by User Role](#2-key-features-by-user-role)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Real External Delivery Agency Integration (Shadowfax)](#5-real-external-delivery-agency-integration-shadowfax)
6. [Supabase Setup & Database Schema](#6-supabase-setup--database-schema)
7. [Environment Variables Configuration](#7-environment-variables-configuration)
8. [Razorpay Payment Gateway Setup (Test & Live)](#8-razorpay-payment-gateway-setup)
9. [Shadowfax Logistics Onboarding (Staging & Production)](#9-shadowfax-logistics-onboarding)
10. [Local Development](#10-local-development)
11. [Building for Production (`npm run build`)](#11-building-for-production)
12. [GitHub Deployment & Vercel Hosting](#12-github-deployment--vercel-hosting)
13. [Webhooks Configuration (Razorpay & Shadowfax)](#13-webhooks-configuration)
14. [Security & Workflow Boundaries](#14-security--workflow-boundaries)

---

## 1. Project Overview

Home Plate solves the problem of commercialized, unhealthy restaurant delivery by providing access to authentic home-cooked delicacies—from sun-cured Andhra Avakaya pickles and plate idlis doused in gunpowder ghee podi to slow-cooked earthen claypot biryanis and pure cow ghee halwas.

The platform provides a complete 3-sided ecosystem:
- **Customers**: Discover authentic neighborhood cooks, filter by diet (pure veg/non-veg), order meals, pay via Razorpay or COD, and track cooking & delivery progress with a live interactive route map.
- **Home Cooks / Sellers**: Register their kitchen, manage daily food menus, set portion pricing, accept/reject incoming orders, update live cooking progress, mark food packed & ready, and trigger automated courier dispatch.
- **Administrators**: Review and approve/reject new kitchen applications, manage user roles, oversee platform orders, inspect platform statistics, and supervise external courier deliveries across 11 detailed statuses.

---

## 2. Key Features by User Role

### 🥗 Customer Features
- **Landing Page**: Forest green & warm amber visual identity, hero showcase, category pills, top cook spotlights, how it works, customer testimonials, and cook onboarding CTA.
- **Discovery & Search**: Real-time multi-criteria filtering across names, ingredients, categories, dietary flags (Pure Veg toggle), and sorting (Price, Rating, Prep time).
- **Food Details Page**: High-resolution imagery, portion information, full ingredient transparency, allergens, cook profile card, rating badge, and customer review submission.
- **Cart & Secure Pricing**: Dynamic cart drawer and page with server-calculated subtotal, delivery fee calculation (free above ₹500 or with coupons), and coupon code system (`WELCOME50`, `HOMEPLATE10`, `FREESHIP`).
- **Checkout & Multi-Payment**: Supports Razorpay Payment Gateway (UPI, Cards, NetBanking, Wallets) and Cash on Delivery (COD).
- **Live Order & Route Tracking**: Visual progress tracker and interactive route map displaying pickup point, drop point, assigned rider, and estimated arrival.
- **Profile & Addresses**: Saved delivery locations (Home, Work, Other) with instant add/delete address modal and geographic coordinates support.
- **Wishlist**: 1-click favorite saving with quick cart additions.

### 👩‍🍳 Home Cook / Seller Features
- **Kitchen Onboarding**: Dedicated application workflow with FSSAI registration input, culinary bio, address, and pending admin approval enforcement.
- **Seller Portal**: Accessible via `/seller/dashboard`.
- **Menu Management**: Add, edit, and delete homemade dishes with portion information, preparation time, and instant In Stock / Sold Out stock toggling.
- **Live Kitchen Order Desk**: Accept orders, start cooking (`preparing`), and mark food ready (`ready_for_pickup`).
- **Automated Courier Dispatch**: Marking an order ready for pickup automatically checks serviceability and dispatches the delivery request to Shadowfax.
- **Workflow Boundary Enforcement**: Sellers cannot falsely mark an order as "delivered". Courier handoff and delivery completion are verified exclusively via the official logistics provider callback.
- **Earnings & Financial Analytics**: Gross sales analytics, 15% platform fee deduction, 85% net cook payout calculation, bank settlement records, and early payout request triggers.

### 🛡️ Administrator Features
- **Admin Control Center**: Accessible via `/admin`.
- **Platform Analytics**: Total revenue (GMV), total orders, verified cooks, published foods, registered users, and pending approval alerts.
- **Seller Verification Queue**: Review kitchen applications, check hygiene and FSSAI numbers, and execute 1-click Approve or Reject actions.
- **User Role Management**: Search all user accounts and switch permissions between Customer, Home Cook, and Admin.
- **Logistics Oversight (`/admin/deliveries`)**: Complete delivery management screen with 11 granular status filters, KPI cards, real-time partner sync, and delivery inspection modal.
- **Food Catalog Moderation**: Feature dishes on the homepage or delete non-compliant items.
- **Category Control**: Create, edit, and manage food categories.

---

## 3. Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS with custom Forest Green (`#16a34a`, `#14532d`) & Warm Amber palette
- **Icons**: Lucide React
- **Validation**: Zod
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- **Payments**: Razorpay Node SDK (`razorpay`) with server-side HMAC-SHA256 signature verification & Webhook processing
- **Logistics & Delivery**: Official Shadowfax Hyperlocal APIs with multi-provider abstraction layer, automated dispatch, live tracking, and webhook synchronization
- **Deployment Target**: Vercel & GitHub

---

## 4. Project Structure

```
home-plate/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx               # Login with quick 1-click demo role buttons
│   │   ├── register/page.tsx            # Role selection (Customer / Home Cook)
│   │   └── forgot-password/page.tsx     # Password reset flow
│   ├── (customer)/
│   │   ├── foods/page.tsx               # Food discovery, search, veg & sort filters
│   │   ├── foods/[id]/page.tsx          # Food details, ingredients, reviews
│   │   ├── categories/[id]/page.tsx     # Category filtered listings
│   │   ├── seller/[id]/page.tsx         # Cook kitchen profile & menu
│   │   ├── cart/page.tsx                # Cart management & coupon discounts
│   │   ├── checkout/page.tsx            # Razorpay & COD payment checkout
│   │   ├── order-success/page.tsx       # Confirmation & payment verification
│   │   ├── orders/page.tsx              # Order history
│   │   ├── orders/[id]/page.tsx         # Live visual order tracking & delivery map
│   │   ├── profile/page.tsx             # Saved delivery addresses & profile
│   │   ├── wishlist/page.tsx            # Saved favorite dishes
│   │   └── become-a-seller/page.tsx     # Home cook onboarding application
│   ├── seller/
│   │   ├── layout.tsx                   # Seller portal shell & navigation
│   │   ├── dashboard/page.tsx           # Revenue metrics & active orders
│   │   ├── foods/page.tsx               # Dish catalog, price & stock management
│   │   ├── orders/page.tsx              # Live kitchen order desk (Shadowfax dispatch)
│   │   └── earnings/page.tsx            # Payouts, 85% cook share, bank records
│   ├── admin/
│   │   ├── layout.tsx                   # Admin control center shell
│   │   ├── page.tsx                     # Platform KPIs, GMV & pending approvals
│   │   ├── users/page.tsx               # User role administration
│   │   ├── sellers/page.tsx             # Kitchen approvals & FSSAI verification
│   │   ├── foods/page.tsx               # Food catalog moderation & feature toggle
│   │   ├── orders/page.tsx              # All platform orders oversight
│   │   ├── deliveries/page.tsx          # Logistics oversight (11 status filters)
│   │   └── categories/page.tsx          # Food categories management
│   ├── api/
│   │   ├── delivery/
│   │   │   ├── serviceability/route.ts  # Serviceability check between PIN codes
│   │   │   ├── create/route.ts          # Server-side dispatch to Shadowfax
│   │   │   ├── status/route.ts          # Live tracking synchronization
│   │   │   ├── cancel/route.ts          # External delivery cancellation
│   │   │   └── shadowfax/
│   │   │       └── webhook/route.ts     # Official Shadowfax status webhook
│   │   ├── payments/razorpay/
│   │   │   ├── create-order/route.ts    # Secure server order creation
│   │   │   ├── verify/route.ts          # Server HMAC-SHA256 signature verification
│   │   │   └── webhook/route.ts         # Razorpay webhook listener
│   │   └── orders/route.ts              # Orders API endpoint
│   ├── layout.tsx                       # Root layout with Auth, Cart & Toast providers
│   ├── page.tsx                         # Landing page
│   ├── globals.css                      # Tailwind & base styling
│   └── not-found.tsx                    # Custom 404 page
├── components/
│   ├── ui/                              # Button, Input, Modal, Badge, Skeleton, Toast
│   ├── layout/                          # Navbar, Footer, SellerNav, AdminNav
│   ├── food/                            # FoodCard, VegBadge
│   ├── order/                           # OrderStatusTracker, DeliveryTrackingMap
│   └── home/                            # Hero, Categories, PopularFood, TopCooks, etc.
├── lib/
│   ├── delivery/                        # Multi-provider logistics abstraction
│   │   ├── types.ts                     # DeliveryStatus, interfaces, contracts
│   │   ├── shadowfax.ts                 # Official Shadowfax Hyperlocal API client
│   │   └── provider.ts                  # Provider factory pattern
│   ├── notifications/                   # Multi-channel notification dispatch
│   ├── supabase/                        # Browser, Server client & TypeScript types
│   ├── data/                            # Resilient store & sample seed datasets
│   ├── context/                         # Auth, Cart, Wishlist & Toast contexts
│   ├── razorpay.ts                      # Razorpay client & signature verification
│   ├── utils.ts                         # Currency formatting (₹), date & status helpers
│   └── validations.ts                   # Zod schemas
├── supabase/
│   ├── schema.sql                       # Complete PostgreSQL schema (orders, deliveries, RLS)
│   └── seed.sql                         # Foods, categories, cooks, sample deliveries
└── .env.example                         # Environment variable template with Shadowfax & Razorpay
```

---

## 5. Real External Delivery Agency Integration (Shadowfax)

Home Plate integrates with **Shadowfax**, one of India's leading on-demand hyperlocal logistics networks.

### Architecture Overview

```
Customer Order Placed & Paid
           │
           ▼
Home Cook Prepares Meal in Kitchen
           │
           ▼
Cook clicks "Mark Food Ready & Dispatch Delivery"
           │
           ▼
Server Endpoint: POST /api/delivery/create
           │
           ├──▶ Validates order, kitchen coordinates & drop address
           ├──▶ Calls Shadowfax Hyperlocal API: POST /api/v2/clients/orders/
           ├──▶ Stores delivery record with tracking_id in `deliveries` table
           └──▶ Advances order status to `ready_for_pickup`
           │
           ▼
Shadowfax Rider Allotted ──▶ Arrived at Store ──▶ Picked Up
           │
           ▼ (Webhook Callbacks: POST /api/delivery/shadowfax/webhook)
           │
Rider In Transit (Out for Delivery) ──▶ Arrived at Doorstep ──▶ Delivered
           │
           ▼
Order status automatically transitions to `delivered` via verified Webhook
```

### Official Shadowfax Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v2/clients/orders/serviceability/` | POST | Check PIN code & coordinate serviceability |
| `/api/v2/clients/orders/` | POST | Create hyperlocal delivery dispatch |
| `/api/v2/clients/orders/{sfx_order_id}/` | GET | Real-time rider and tracking query |
| `/api/v2/clients/orders/{sfx_order_id}/cancel/` | POST | Cancel delivery dispatch |
| `/api/delivery/shadowfax/webhook` | POST | Home Plate webhook receiver for Shadowfax events |

### Admin Delivery Status Filters

The Admin Deliveries control center (`/admin/deliveries`) supports all 11 lifecycle statuses:
1. **Pending**: Order confirmed, delivery dispatch not yet initiated.
2. **Serviceability Failed**: Address outside hyperlocal coverage.
3. **Delivery Requested**: Dispatched to Shadowfax queue.
4. **Assigned**: Rider allotted to order.
5. **Arrived at Pickup**: Rider reached kitchen location.
6. **Picked Up**: Package collected from kitchen.
7. **Out for Delivery**: Rider en route to customer doorstep.
8. **Arrived at Customer**: Rider arrived at drop destination.
9. **Delivered**: Handover completed and verified by courier.
10. **Cancelled**: Delivery cancelled by kitchen/admin.
11. **Failed**: Delivery exception or return-to-origin (RTO).

### Safe Reporting & Transparent Credentials

Home Plate follows strict production safety rules:
- **No Fake Simulations**: When live credentials are not set, the platform transparently reports *"Delivery integration configured — production credentials required for live dispatch"*. No synthetic GPS movement or fake rider paths are fabricated.
- **Provider Abstraction**: All logistics logic is encapsulated in `lib/delivery/types.ts` and `lib/delivery/provider.ts`, making it easy to add secondary logistics partners in the future without changing frontend or database code.

---

## 6. Supabase Setup & Database Schema

### Applying the Schema
1. Create a project on [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → **New query**.
3. Copy the contents of `supabase/schema.sql` and click **Run**.
4. To load sample home cooks, foods, categories, and test deliveries, copy and run `supabase/seed.sql`.

---

## 7. Environment Variables Configuration

Create a `.env.local` file by copying `.env.example`:

```bash
cp .env.example .env.local
```

Configure your variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration (Test Mode initially)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourSecretKeyHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere

# Shadowfax Hyperlocal Logistics Configuration
# Staging Sandbox: https://staging-starship.shadowfax.in
# Live Production: https://starship.shadowfax.in
SHADOWFAX_BASE_URL=https://staging-starship.shadowfax.in
SHADOWFAX_API_KEY=your_shadowfax_api_token
SHADOWFAX_CLIENT_CODE=your_shadowfax_client_code
SHADOWFAX_WEBHOOK_SECRET=your_shadowfax_webhook_secret
DEFAULT_DELIVERY_PROVIDER=shadowfax

# Public App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 8. Razorpay Payment Gateway Setup

### Generating Test Mode Keys
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle to **Test Mode** in the top right.
3. Go to **Settings** → **API Keys** → click **Generate Key**.
4. Paste `Key ID` and `Key Secret` into `.env.local`.

---

## 9. Shadowfax Logistics Onboarding

### Staging Sandbox Setup
1. Request sandbox credentials from your Shadowfax Partner Account Manager or sign up on the [Shadowfax Developer Portal](https://developers.shadowfax.in/).
2. Obtain your **API Token** and **Client Code**.
3. Set `SHADOWFAX_BASE_URL=https://staging-starship.shadowfax.in`.
4. Set `SHADOWFAX_API_KEY` in `.env.local` or Vercel Environment Variables.

### Live Production Migration
1. Sign the commercial agreement and complete business KYC with Shadowfax.
2. In your production environment, set:
   ```env
   SHADOWFAX_BASE_URL=https://starship.shadowfax.in
   SHADOWFAX_API_KEY=<production_token>
   SHADOWFAX_WEBHOOK_SECRET=<production_hmac_secret>
   ```
3. Set the webhook destination in Shadowfax Dashboard to:
   ```
   https://your-domain.vercel.app/api/delivery/shadowfax/webhook
   ```

---

## 10. Local Development

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 11. Building for Production

Compile and verify TypeScript and Next.js static optimizations:

```bash
npm run build
```

---

## 12. GitHub Deployment & Vercel Hosting

### Push to GitHub
```bash
git add .
git commit -m "feat: complete delivery integration and production readiness"
git push -u origin main
```

### Deploy on Vercel
1. Log into [vercel.com](https://vercel.com) and import the repository.
2. Add all environment variables from `.env.local`.
3. Click **Deploy**.

---

## 13. Webhooks Configuration

### Razorpay Webhook
- **URL**: `https://your-domain.vercel.app/api/payments/razorpay/webhook`
- **Events**: `order.paid`, `payment.captured`, `payment.failed`

### Shadowfax Logistics Webhook
- **URL**: `https://your-domain.vercel.app/api/delivery/shadowfax/webhook`
- **Events**: Status lifecycle events (`rider_allocated`, `arrived_pickup`, `picked_up`, `out_for_delivery`, `arrived_delivery`, `delivered`, `cancelled`, `failed`)

---

## 14. Security & Workflow Boundaries

- **Sellers Cannot Falsely Mark Delivered**: Sellers can only transition dishes up to *Ready for Pickup*. All subsequent stages (*Assigned*, *Picked Up*, *Out for Delivery*, *Delivered*) are cryptographically verified via Shadowfax webhooks.
- **Server-Side Pricing**: Prices and discounts are calculated strictly on the server to prevent tampering.
- **HMAC Signatures**: Both Razorpay payments and Shadowfax callbacks verify HMAC-SHA256 signatures before modifying database records.
- **Row Level Security**: Supabase RLS policies enforce access control across customers, sellers, and administrators.

---

**Home Plate** — Fresh Homemade Food, Delivered to Your Doorstep. Crafted with Next.js 15, Tailwind CSS, Supabase, Razorpay, and Shadowfax.
