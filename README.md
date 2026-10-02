# 🍽️ HOME PLATE
> **“Fresh Homemade Food, Delivered to Your Doorstep”**

Home Plate is a full-stack homemade food delivery platform connecting neighborhood food lovers with verified home cooks, mothers, and small artisanal food businesses. Built with Next.js 15+ (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL & Auth, and Razorpay Payment Gateway.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features by User Role](#key-features-by-user-role)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites & Installation](#prerequisites--installation)
6. [Supabase Setup & Database Schema](#supabase-setup--database-schema)
7. [Environment Variables Configuration](#environment-variables-configuration)
8. [Razorpay Payment Gateway Setup (Test & Live)](#razorpay-payment-gateway-setup)
9. [Local Development](#local-development)
10. [Building for Production (`npm run build`)](#building-for-production)
11. [GitHub Deployment & Vercel Hosting](#github-deployment--vercel-hosting)
12. [Razorpay Webhook Configuration](#razorpay-webhook-configuration)
13. [Security Architecture & Validation](#security-architecture--validation)

---

## 1. Project Overview

Home Plate solves the problem of commercialized, unhealthy restaurant delivery by providing access to authentic home-cooked delicacies—from sun-cured Andhra Avakaya pickles and plate idlis doused in gunpowder ghee podi to slow-cooked earthen claypot biryanis and pure cow ghee halwas.

The platform provides a 3-sided ecosystem:
- **Customers**: Discover authentic neighborhood cooks, filter by diet (pure veg/non-veg), order meals, pay via Razorpay or COD, and track cooking & delivery progress with a live visual tracker.
- **Home Cooks / Sellers**: Register their kitchen, manage daily food menus, set portion pricing, accept/reject incoming orders, update live preparation steps, and track net earnings (85% payout) with weekly bank settlements.
- **Administrators**: Review and approve/reject new kitchen applications, manage user roles, feature recipes on the homepage, oversee platform-wide orders, and manage food categories.

---

## 2. Key Features by User Role

### 🥗 Customer Features
- **Landing Page**: Original green/white visual identity, hero showcase, category pills, top cook spotlights, how it works, customer testimonials, and cook onboarding CTA.
- **Discovery & Search**: Real-time multi-criteria filtering across names, ingredients, categories, dietary flags (Pure Veg toggle), and sorting (Price, Rating, Prep time).
- **Food Details Page**: High-resolution imagery, portion information, full ingredient transparency, allergens, cook profile card, rating badge, and customer review submission.
- **Cart & Secure Pricing**: Dynamic cart drawer and page with server-calculated subtotal, delivery fee calculation (free above ₹500 or with coupons), and coupon code system (`WELCOME50`, `HOMEPLATE10`, `FREESHIP`).
- **Checkout & Multi-Payment**: Supports Razorpay Payment Gateway (UPI, Cards, NetBanking, Wallets) and Cash on Delivery (COD).
- **Live Order Tracking**: Visual 5-stage progress tracker (Order Confirmed → Kitchen Preparing → Packed Fresh → Out for Delivery → Delivered).
- **Profile & Addresses**: Saved delivery locations (Home, Work, Other) with instant add/delete address modal.
- **Wishlist**: 1-click favorite saving with quick cart additions.

### 👩‍🍳 Home Cook / Seller Features
- **Kitchen Onboarding**: Dedicated application workflow with FSSAI registration input, culinary bio, address, and pending admin approval enforcement.
- **Seller Portal**: Accessible via `/seller/dashboard`.
- **Menu Management**: Add, edit, and delete homemade dishes with portion information, preparation time, and instant In Stock / Sold Out stock toggling.
- **Live Kitchen Order Desk**: Accept orders, reject orders, and progress orders from `Preparing` to `Ready for Pickup`, `Out for Delivery`, and `Delivered`.
- **Earnings & Financial Analytics**: Gross sales analytics, 15% platform fee deduction, 85% net cook payout calculation, bank settlement records, and early payout request triggers.

### 🛡️ Administrator Features
- **Admin Control Center**: Accessible via `/admin`.
- **Platform Analytics**: Total revenue (GMV), total orders, verified cooks, published foods, registered users, and pending approval alerts.
- **Seller Verification Queue**: Review kitchen applications, check hygiene and FSSAI numbers, and execute 1-click Approve or Reject actions.
- **User Role Management**: Search all user accounts and switch permissions between Customer, Home Cook, and Admin.
- **Food Catalog Moderation**: Feature dishes on the homepage or delete non-compliant items.
- **Category Control**: Create, edit, and manage food categories (Breakfast, Meals, Pickles & Podis, Sweets, Healthy & Millet, Regional Specialities).

---

## 3. Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS with custom Forest Green (`#16a34a`, `#14532d`) & Warm Amber color palette
- **Icons**: Lucide React
- **Validation**: Zod
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- **Payments**: Razorpay Node SDK (`razorpay`) with server-side HMAC-SHA256 signature verification & Webhook processing
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
│   │   ├── orders/[id]/page.tsx         # Live visual order tracking
│   │   ├── profile/page.tsx             # Saved delivery addresses & profile
│   │   ├── wishlist/page.tsx            # Saved favorite dishes
│   │   └── become-a-seller/page.tsx     # Home cook onboarding application
│   ├── seller/
│   │   ├── layout.tsx                   # Seller portal shell & navigation
│   │   ├── dashboard/page.tsx           # Revenue metrics & active orders
│   │   ├── foods/page.tsx               # Dish catalog, price & stock management
│   │   ├── orders/page.tsx              # Live kitchen order processing
│   │   └── earnings/page.tsx            # Payouts, 85% cook share, bank records
│   ├── admin/
│   │   ├── layout.tsx                   # Admin control center shell
│   │   ├── page.tsx                     # Platform KPIs, GMV & pending approvals
│   │   ├── users/page.tsx               # User role administration
│   │   ├── sellers/page.tsx             # Kitchen approvals & FSSAI verification
│   │   ├── foods/page.tsx               # Food catalog moderation & feature toggle
│   │   ├── orders/page.tsx              # All platform orders oversight
│   │   └── categories/page.tsx          # Food categories management
│   ├── api/
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
│   ├── order/                           # OrderStatusTracker
│   └── home/                            # Hero, Categories, PopularFood, TopCooks, etc.
├── lib/
│   ├── supabase/                        # Browser, Server client & TypeScript types
│   ├── data/                            # Resilient store & sample seed datasets
│   ├── context/                         # Auth, Cart, Wishlist & Toast contexts
│   ├── razorpay.ts                      # Razorpay client & signature verification
│   ├── utils.ts                         # Currency formatting (₹), date & status helpers
│   └── validations.ts                   # Zod schemas
├── supabase/
│   ├── schema.sql                       # Complete PostgreSQL schema & RLS policies
│   └── seed.sql                         # 10 foods, 5 categories, 3 cooks, reviews
├── .env.example                         # Environment variable template
├── next.config.ts                       # Next.js configuration & image domains
├── package.json                         # Dependencies & npm scripts
├── tailwind.config.ts                   # Custom color themes & shadows
└── tsconfig.json                        # TypeScript configuration
```

---

## 5. Prerequisites & Installation

### Prerequisites
- Node.js 18.18+ or 20+ (LTS recommended)
- npm or yarn or pnpm
- A free [Supabase](https://supabase.com) account
- A free [Razorpay](https://razorpay.com) account (for live/test payments)

### Step 1: Clone or Copy Project
```bash
cd home-plate
```

### Step 2: Install Dependencies
```bash
npm install
```

---

## 6. Supabase Setup & Database Schema

1. Go to [database.new](https://database.new) and create a free project on Supabase.
2. Open the **SQL Editor** from the left sidebar of your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy the full content, paste it into the SQL Editor, and click **Run**.
   - This creates all 14 database tables (`profiles`, `sellers`, `foods`, `categories`, `orders`, `order_items`, `payments`, `reviews`, `coupons`, `addresses`, `wishlists`, etc.).
   - This enables Row Level Security (RLS) policies for customers, cooks, and admins.
   - This registers the PostgreSQL trigger to automatically create profiles when new users sign up.
4. Open `supabase/seed.sql`, paste it into the SQL Editor, and click **Run**.
   - This seeds 5 categories, 3 sample verified home cooks, 10 authentic regional dishes, reviews, and discount coupons (`WELCOME50`, `HOMEPLATE10`, `FREESHIP`).
5. Open your Supabase Dashboard **Project Settings** → **API**:
   - Copy **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - Copy **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Copy **service_role secret key** (`SUPABASE_SERVICE_ROLE_KEY`)

---

## 7. Environment Variables Configuration

Create a `.env.local` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay Configuration (Test Mode initially)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourSecretKeyHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere

# Public App URL (localhost for dev, production domain on Vercel)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: Home Plate has a built-in resilient development fallback. If credentials are not yet configured or you are testing offline, the application will automatically function using the in-memory sample database so that every page, cart, role switcher, and checkout can be explored immediately!

---

## 8. Razorpay Payment Gateway Setup

### Generating Test Mode Keys
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle to **Test Mode** in the top right.
3. Go to **Settings** → **API Keys** → click **Generate Key**.
4. Copy the `Key ID` and `Key Secret` and paste them into `.env.local` as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.

### Secure Payment Architecture
Home Plate follows strict production security guidelines:
1. **Server-Side Order Creation**: The browser never decides the price. `/api/payments/razorpay/create-order` calculates food prices, discounts, and delivery charges securely on the server.
2. **Server-Side Signature Verification**: When a customer completes checkout, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The frontend sends these to `/api/payments/razorpay/verify`, which computes the HMAC-SHA256 digest using `RAZORPAY_KEY_SECRET`. The order is marked **PAID** only after a cryptographic match.
3. **Double-Payment Guard**: Prevents duplicate verification or double-crediting if an order is already marked paid.

---

## 9. Local Development

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quick Role Testing
In the top micro-bar of the application, click any of the **Quick Test Mode** buttons:
- **Customer**: Browse food, add to cart, and checkout.
- **Home Cook**: Access `/seller/dashboard`, add foods, and update live orders.
- **Admin**: Access `/admin`, approve kitchens, and inspect platform GMV.

---

## 10. Building for Production

To build the application for production deployment:

```bash
npm run build
```

This compiles TypeScript, bundles Next.js Server Components, optimizes static routes, and verifies type integrity.

To test the production build locally:

```bash
npm start
```

---

## 11. GitHub Deployment & Vercel Hosting

### Step 1: Initialize Git and Push to GitHub
```bash
git init
git add .
git commit -m "feat: complete production Home Plate web application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/home-plate.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Log into [vercel.com](https://vercel.com) and click **Add New** → **Project**.
2. Select your `home-plate` GitHub repository.
3. In **Environment Variables**, paste the keys from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment URL, e.g. `https://home-plate.vercel.app`)
4. Click **Deploy**. Vercel will build and launch your production application worldwide!

---

## 12. Razorpay Webhook Configuration

To receive real-time webhook updates if a customer pays via external apps:
1. In Razorpay Dashboard, navigate to **Settings** → **Webhooks** → **Add New Webhook**.
2. Set **Webhook URL** to:
   ```
   https://your-domain.vercel.app/api/payments/razorpay/webhook
   ```
3. Set a **Secret** string and save it into your Vercel environment variables as `RAZORPAY_WEBHOOK_SECRET`.
4. Select the following Active Events:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
5. Save the webhook.

---

## 13. Switching from Test Mode to Live Mode

When you are ready to process real payments:
1. Complete Razorpay KYC verification on [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Toggle the dashboard switch from **Test Mode** to **Live Mode**.
3. Generate new **Live API Keys** (`rzp_live_...`).
4. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your Vercel Project Settings.
5. Redeploy or restart your application. Real UPI and credit card transactions will now be routed directly to your business bank account.

---

## 14. Security Notes

- **Secret Keys Isolation**: `RAZORPAY_KEY_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` are strictly server-side variables and are never bundled into client JavaScript.
- **Tamper-Proof Pricing**: Food prices and coupons are always fetched from the database on the server during order creation.
- **Row Level Security**: Database-level PostgreSQL policies safeguard customer address confidentiality and restrict sellers to their own orders.
- **Input Validation**: All forms and endpoints are validated with Zod schemas to protect against injection and invalid payloads.

---

**Home Plate** — Fresh Homemade Food, Delivered to Your Doorstep. Crafted with Next.js 15, Tailwind CSS, Supabase, and Razorpay.
