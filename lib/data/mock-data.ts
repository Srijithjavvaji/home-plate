import {
  Category,
  Food,
  Order,
  Profile,
  Review,
  Seller,
  Coupon,
  Delivery,
  AppSetting,
  CategoryCommission,
  SellerBankDetails,
  SellerDocument,
  SellerPayout,
  Complaint,
  Refund,
  AdminAuditLog
} from "../supabase/types";

// ==============================================================================
// 1. PRODUCT CATEGORIES (Per Home Plate Specification)
// Traditional homemade snacks, Homemade sweets, Pickles, Podis, Healthy snacks, Regional specialities
// ==============================================================================
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-snacks",
    name: "Traditional Homemade Snacks",
    slug: "traditional-snacks",
    description: "Crispy hand-rolled murukulu, janthikalu, chekodilu, and savoury teatime crunchies made with cold-pressed oils",
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    icon: "Utensils",
    is_active: true,
  },
  {
    id: "cat-sweets",
    name: "Homemade Sweets",
    slug: "homemade-sweets",
    description: "Pure country cow ghee sunnundalu, melt-in-mouth kaja, besan laddoos, and festive sweets crafted by homemakers",
    image_url: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80",
    icon: "Cake",
    is_active: true,
  },
  {
    id: "cat-pickles",
    name: "Pickles",
    slug: "pickles",
    description: "Sun-cured Andhra avakaya, spicy tangy gongura, tender mango, and citron pachadi aged with stone-ground spices",
    image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
    icon: "Package",
    is_active: true,
  },
  {
    id: "cat-podis",
    name: "Podis",
    slug: "podis",
    description: "Aromatic coarse spice gunpowders: kandi podi, karivepaku podi, nalla karam, and roasted lentil blends for hot rice & ghee",
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
    icon: "Sparkles",
    is_active: true,
  },
  {
    id: "cat-healthy",
    name: "Healthy Snacks",
    slug: "healthy-snacks",
    description: "Diabetic-friendly roasted millet mixtures, flaxseed crackers, jaggery energy bites, and baked high-protein nibbles",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    icon: "Salad",
    is_active: true,
  },
  {
    id: "cat-regional",
    name: "Regional Specialities",
    slug: "regional-specialities",
    description: "Authentic geographical delicacies: Atreyapuram Pootharekulu, Telangana Sakinalu, Bellam Gavvalu, and Madugula Halwa",
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    icon: "Crown",
    is_active: true,
  },
];

// ==============================================================================
// 2. CATEGORY COMMISSIONS (Configurable percentage by category)
// ==============================================================================
export const INITIAL_CATEGORY_COMMISSIONS: CategoryCommission[] = [
  { id: "cc-1", category_id: "cat-snacks", commission_percentage: 12.0 },
  { id: "cc-2", category_id: "cat-sweets", commission_percentage: 15.0 },
  { id: "cc-3", category_id: "cat-pickles", commission_percentage: 18.0 },
  { id: "cc-4", category_id: "cat-podis", commission_percentage: 14.0 },
  { id: "cc-5", category_id: "cat-healthy", commission_percentage: 10.0 },
  { id: "cc-6", category_id: "cat-regional", commission_percentage: 16.0 },
];

// ==============================================================================
// 3. APPLICATION SETTINGS
// ==============================================================================
export const INITIAL_APP_SETTINGS: AppSetting[] = [
  { id: "set-1", key: "min_order_value", value: 149, description: "Minimum order value in INR" },
  { id: "set-2", key: "free_delivery_threshold", value: 500, description: "Free delivery threshold in INR" },
  { id: "set-3", key: "base_delivery_fee", value: 40, description: "Standard base delivery fee in INR" },
  { id: "set-4", key: "tax_percentage", value: 5.0, description: "Standard GST/tax percentage" },
  {
    id: "set-5",
    key: "hyderabad_service_pincodes",
    value: ["500001","500002","500003","500004","500008","500016","500032","500033","500034","500081","500082","500084","500089","500090"],
    description: "Active Hyderabad service PIN codes"
  },
];

// ==============================================================================
// 4. VERIFIED HOME COOKS & HOMEMAKERS (Hyderabad, Telangana)
// ==============================================================================
export const INITIAL_SELLERS: Seller[] = [
  {
    id: "11111111-aaaa-1111-aaaa-111111111111",
    user_id: "s0000000-0000-0000-0000-000000000001",
    kitchen_name: "Ammamma's Traditional Kitchen",
    description: "Homemaker Lakshmi Devi prepares heirloom Godavari-style pickles, stone-ground podis, and pure cow ghee sunnundalu passed down over 3 generations.",
    address: "Flat 302, Green Meadows, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    phone: "+91 98765 11001",
    latitude: 17.4483,
    longitude: 78.3915,
    fssai_number: "23621001000452",
    rating: 4.9,
    total_ratings: 184,
    status: "approved",
    is_verified: true,
    banner_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80",
    logo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "22222222-bbbb-2222-bbbb-222222222222",
    user_id: "s0000000-0000-0000-0000-000000000002",
    kitchen_name: "Gayatri's Millet & Healthy Kitchen",
    description: "Certified nutritionist and passionate home cook crafting guilt-free roasted millet mixtures, organic jaggery dry-fruit laddoos, and diabetic-safe podis.",
    address: "Villa 12, Palm Springs, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    phone: "+91 98765 11002",
    latitude: 17.4319,
    longitude: 78.4073,
    fssai_number: "23621001000891",
    rating: 4.8,
    total_ratings: 128,
    status: "approved",
    is_verified: true,
    banner_url: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1200&auto=format&fit=crop&q=80",
    logo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "33333333-cccc-3333-cccc-333333333333",
    user_id: "s0000000-0000-0000-0000-000000000003",
    kitchen_name: "Godavari Heritage Delicacies",
    description: "Authentic regional culinary treasures including paper-thin Atreyapuram Pootharekulu, crispy Sakinalu, and stone-pressed Gongura Nilva Pachadi.",
    address: "Plot 45, Srinagar Colony, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    phone: "+91 98765 11003",
    latitude: 17.4156,
    longitude: 78.4350,
    fssai_number: "23621001000129",
    rating: 4.95,
    total_ratings: 210,
    status: "approved",
    is_verified: true,
    banner_url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&auto=format&fit=crop&q=80",
    logo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
];

// ==============================================================================
// 5. PRODUCTS (Compliant Homemade Food Catalog)
// ==============================================================================
export const INITIAL_FOODS: Food[] = [
  {
    id: "f0000001-0000-0000-0000-000000000001",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    category_id: "cat-pickles",
    name: "Sun-Cured Andhra Avakaya Mango Pickle",
    slug: "andhra-avakaya-mango-pickle",
    description: "Handcrafted sour raw mangoes cured in cold-pressed gingelly oil, stone-ground Guntur red chili powder, mustard seeds, and sea salt. Aged naturally in porcelain jars.",
    price: 249.00,
    original_price: 299.00,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 15,
    ingredients: ["Raw Mango", "Cold-Pressed Gingelly Oil", "Guntur Red Chili", "Mustard Powder", "Fenugreek", "Garlic", "Sea Salt"],
    allergens: ["Mustard"],
    serving_info: "Jar (500g Net Weight)",
    net_weight: "500g",
    shelf_life_days: 180,
    prep_date: "2026-10-15",
    pack_date: "2026-10-20",
    best_before_date: "2027-04-20",
    preparation_type: "sun_cured",
    rating: 4.9,
    total_reviews: 142,
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "f0000002-0000-0000-0000-000000000002",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    category_id: "cat-podis",
    name: "Grandmother Special Kandi Podi (Gunpowder)",
    slug: "grandmothers-kandi-podi",
    description: "Roasted toor dal, chana dal, cumin, hing, and dried red chilies hand-pounded to perfection. Mix with steaming hot rice and melted pure ghee.",
    price: 180.00,
    original_price: 220.00,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10,
    ingredients: ["Toor Dal", "Chana Dal", "Moong Dal", "Dry Red Chilies", "Cumin", "Asafoetida (Hing)", "Rock Salt"],
    allergens: [],
    serving_info: "Pouch (250g Net Weight)",
    net_weight: "250g",
    shelf_life_days: 90,
    prep_date: "2026-10-25",
    pack_date: "2026-10-26",
    best_before_date: "2027-01-26",
    preparation_type: "traditional",
    rating: 4.95,
    total_reviews: 98,
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "f0000003-0000-0000-0000-000000000003",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    category_id: "cat-sweets",
    name: "Pure Cow Ghee Bellam Sunnundalu",
    slug: "pure-cow-ghee-bellam-sunnundalu",
    description: "Roasted black gram (urad dal) sweetened with organic unrefined palm jaggery and bound with generous aromatic pure desi cow ghee. High in protein & calcium.",
    price: 299.00,
    original_price: 350.00,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 20,
    ingredients: ["Roasted Whole Urad Dal", "Organic Bellam (Jaggery)", "Desi Cow Ghee", "Cardamom"],
    allergens: ["Dairy"],
    serving_info: "Box of 10 Pieces (400g)",
    net_weight: "400g",
    shelf_life_days: 30,
    prep_date: "2026-10-28",
    pack_date: "2026-10-29",
    best_before_date: "2026-11-28",
    preparation_type: "traditional",
    rating: 4.88,
    total_reviews: 64,
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "f0000004-0000-0000-0000-000000000004",
    seller_id: "33333333-cccc-3333-cccc-333333333333",
    category_id: "cat-snacks",
    name: "Traditional Crunchy Chekodilu & Murukulu",
    slug: "traditional-chekodilu-murukulu",
    description: "Golden rice flour ring snacks kneaded with toasted cumin, ajwain, sesame seeds, and butter, crisp-fried in cold-pressed groundnut oil. The authentic festive crunch.",
    price: 160.00,
    original_price: 190.00,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 15,
    ingredients: ["Rice Flour", "Sesame Seeds", "Ajwain", "Cumin", "Butter", "Cold-Pressed Groundnut Oil", "Chili Powder", "Salt"],
    allergens: ["Dairy", "Sesame"],
    serving_info: "Pack (300g Net Weight)",
    net_weight: "300g",
    shelf_life_days: 45,
    prep_date: "2026-10-27",
    pack_date: "2026-10-27",
    best_before_date: "2026-12-11",
    preparation_type: "batch_packed",
    rating: 4.82,
    total_reviews: 73,
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "f0000005-0000-0000-0000-000000000005",
    seller_id: "22222222-bbbb-2222-bbbb-222222222222",
    category_id: "cat-healthy",
    name: "Multi-Millet Roasted Mixture with Curry Leaves",
    slug: "multi-millet-roasted-mixture",
    description: "Lightly roasted foxtail, ragi, and jowar flakes tossed with roasted peanuts, curry leaves, crushed pepper, and turmeric. Zero refined oil, 100% wholesome snacking.",
    price: 199.00,
    original_price: 240.00,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10,
    ingredients: ["Foxtail Millet Flakes", "Ragi Flakes", "Jowar Flakes", "Roasted Peanuts", "Roasted Gram", "Fresh Curry Leaves", "Himalayan Pink Salt", "Turmeric"],
    allergens: ["Peanuts"],
    serving_info: "Pouch (350g Net Weight)",
    net_weight: "350g",
    shelf_life_days: 60,
    prep_date: "2026-10-26",
    pack_date: "2026-10-26",
    best_before_date: "2026-12-26",
    preparation_type: "batch_packed",
    rating: 4.9,
    total_reviews: 51,
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "f0000006-0000-0000-0000-000000000006",
    seller_id: "33333333-cccc-3333-cccc-333333333333",
    category_id: "cat-regional",
    name: "Atreyapuram Bellam Dry Fruit Pootharekulu",
    slug: "atreyapuram-bellam-pootharekulu",
    description: "The pride of East Godavari: wafer-thin rice starch edible paper sheets stuffed with organic jaggery powder, pure melted ghee, crushed cashews, and almonds.",
    price: 349.00,
    original_price: 399.00,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 20,
    ingredients: ["Jaya Rice Starch Paper", "Organic Jaggery", "Pure Cow Ghee", "Cashews", "Almonds", "Cardamom Powder"],
    allergens: ["Dairy", "Tree Nuts"],
    serving_info: "Box of 10 Rolls (350g)",
    net_weight: "350g",
    shelf_life_days: 30,
    prep_date: "2026-10-29",
    pack_date: "2026-10-30",
    best_before_date: "2026-11-29",
    preparation_type: "traditional",
    rating: 5.0,
    total_reviews: 114,
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  },
];

// ==============================================================================
// 6. INITIAL ORDERS & MULTI-SELLER SPLIT MOCK RECORDS
// ==============================================================================
export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord_1001",
    order_number: "HP-20261031-101",
    customer_id: "u0000000-0000-0000-0000-000000000001",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    delivery_address: {
      label: "Home",
      name: "Rahul Sharma",
      phone: "+91 98765 22001",
      address_line1: "Flat 402, Aditya Empress Towers, Shaikpet",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500008",
      latitude: 17.4065,
      longitude: 78.3970,
    },
    status: "delivered",
    subtotal: 429.00,
    delivery_fee: 40.00,
    discount_amount: 50.00,
    total_amount: 419.00,
    payment_method: "razorpay",
    payment_status: "paid",
    razorpay_order_id: "order_mock_1001",
    razorpay_payment_id: "pay_mock_1001",
    notes: "Leave package at security desk if unavailable",
    created_at: "2026-10-31T09:30:00Z",
    items: [
      {
        id: "oi_1001_1",
        order_id: "ord_1001",
        food_id: "f0000001-0000-0000-0000-000000000001",
        food_name: "Sun-Cured Andhra Avakaya Mango Pickle",
        food_image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
        unit_price: 249.00,
        quantity: 1,
        total_price: 249.00,
      },
      {
        id: "oi_1001_2",
        order_id: "ord_1001",
        food_id: "f0000002-0000-0000-0000-000000000002",
        food_name: "Grandmother Special Kandi Podi (Gunpowder)",
        food_image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
        unit_price: 180.00,
        quantity: 1,
        total_price: 180.00,
      },
    ],
  },
  {
    id: "ord_1002",
    order_number: "HP-20261101-202",
    customer_id: "u0000000-0000-0000-0000-000000000001",
    seller_id: "33333333-cccc-3333-cccc-333333333333",
    delivery_address: {
      label: "Home",
      name: "Rahul Sharma",
      phone: "+91 98765 22001",
      address_line1: "Flat 402, Aditya Empress Towers, Shaikpet",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500008",
      latitude: 17.4065,
      longitude: 78.3970,
    },
    status: "preparing",
    subtotal: 509.00,
    delivery_fee: 0.00,
    discount_amount: 0.00,
    total_amount: 509.00,
    payment_method: "razorpay",
    payment_status: "paid",
    razorpay_order_id: "order_mock_1002",
    razorpay_payment_id: "pay_mock_1002",
    created_at: "2026-11-01T04:15:00Z",
    items: [
      {
        id: "oi_1002_1",
        order_id: "ord_1002",
        food_id: "f0000006-0000-0000-0000-000000000006",
        food_name: "Atreyapuram Bellam Dry Fruit Pootharekulu",
        food_image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
        unit_price: 349.00,
        quantity: 1,
        total_price: 349.00,
      },
      {
        id: "oi_1002_2",
        order_id: "ord_1002",
        food_id: "f0000004-0000-0000-0000-000000000004",
        food_name: "Traditional Crunchy Chekodilu & Murukulu",
        food_image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
        unit_price: 160.00,
        quantity: 1,
        total_price: 160.00,
      },
    ],
  },
];

// ==============================================================================
// 7. INITIAL DELIVERIES (Real Logistics State with OTP)
// ==============================================================================
export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: "del_1001",
    order_id: "ord_1001",
    provider: "shadowfax",
    tracking_id: "SFX-HYD-99101",
    status: "delivered",
    rider_name: "Venkatesh Rao",
    rider_phone: "+91 99887 76655",
    pickup_address: "Flat 302, Green Meadows, Madhapur, Hyderabad",
    pickup_pincode: "500081",
    pickup_lat: 17.4483,
    pickup_lng: 78.3915,
    drop_address: "Flat 402, Aditya Empress Towers, Shaikpet, Hyderabad",
    drop_pincode: "500008",
    drop_lat: 17.4065,
    drop_lng: 78.3970,
    delivery_otp: "4829",
    otp_verified: true,
    actual_delivery_at: "2026-10-31T10:45:00Z",
    created_at: "2026-10-31T09:35:00Z",
  },
  {
    id: "del_1002",
    order_id: "ord_1002",
    provider: "shadowfax",
    tracking_id: "SFX-HYD-99202",
    status: "requested",
    pickup_address: "Plot 45, Srinagar Colony, Banjara Hills, Hyderabad",
    pickup_pincode: "500034",
    pickup_lat: 17.4156,
    pickup_lng: 78.4350,
    drop_address: "Flat 402, Aditya Empress Towers, Shaikpet, Hyderabad",
    drop_pincode: "500008",
    drop_lat: 17.4065,
    drop_lng: 78.3970,
    delivery_otp: "7193",
    otp_verified: false,
    estimated_delivery_at: "2026-11-01T05:45:00Z",
    created_at: "2026-11-01T04:20:00Z",
  },
];

// ==============================================================================
// 8. INITIAL COUPONS
// ==============================================================================
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "c-1",
    code: "WELCOME50",
    description: "Flat ₹50 off on your first homemade order above ₹299",
    discount_type: "fixed",
    discount_value: 50.00,
    min_order_amount: 299.00,
    is_active: true,
    times_used: 120,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "c-2",
    code: "HOMEPLATE10",
    description: "10% off up to ₹100 on all authentic treats above ₹400",
    discount_type: "percentage",
    discount_value: 10.00,
    min_order_amount: 400.00,
    max_discount_amount: 100.00,
    is_active: true,
    times_used: 85,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "c-3",
    code: "FREESHIP",
    description: "Free delivery on homemade food orders above ₹349",
    discount_type: "fixed",
    discount_value: 40.00,
    min_order_amount: 349.00,
    is_active: true,
    times_used: 240,
    created_at: "2026-09-01T00:00:00Z",
  },
];

// ==============================================================================
// 9. INITIAL REVIEWS
// ==============================================================================
export const INITIAL_REVIEWS: Review[] = [
  {
    id: "r-1",
    user_id: "u0000000-0000-0000-0000-000000000001",
    food_id: "f0000001-0000-0000-0000-000000000001",
    order_id: "ord_1001",
    rating: 5,
    comment: "This Avakaya pickle tastes exactly like my grandmother's recipe in Rajahmundry! Crisp mango pieces and pure gingelly oil aroma. Absolutely authentic.",
    created_at: "2026-10-31T14:20:00Z",
  },
  {
    id: "r-2",
    user_id: "u0000000-0000-0000-0000-000000000001",
    food_id: "f0000002-0000-0000-0000-000000000002",
    order_id: "ord_1001",
    rating: 5,
    comment: "The Kandi Podi with a spoonful of hot ghee over rice is heavenly. Coarse stone-ground texture, not powdery like commercial brands.",
    created_at: "2026-10-31T14:25:00Z",
  },
];

// ==============================================================================
// 10. INITIAL SELLER BANK DETAILS
// ==============================================================================
export const INITIAL_SELLER_BANK_DETAILS: SellerBankDetails[] = [
  {
    id: "sbd-1",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    account_holder_name: "Lakshmi Devi Javvaji",
    account_number: "••••••••4819",
    ifsc_code: "HDFC0001234",
    bank_name: "HDFC Bank Madhapur",
    upi_id: "lakshmi.kitchen@okhdfcbank",
    is_verified: true,
    created_at: "2026-09-15T10:00:00Z",
  },
  {
    id: "sbd-2",
    seller_id: "22222222-bbbb-2222-bbbb-222222222222",
    account_holder_name: "Gayatri Sharma",
    account_number: "••••••••6021",
    ifsc_code: "SBIN0005432",
    bank_name: "State Bank of India Jubilee Hills",
    upi_id: "gayatri.millet@oksbi",
    is_verified: true,
    created_at: "2026-09-18T11:00:00Z",
  },
];

// ==============================================================================
// 11. INITIAL SELLER DOCUMENTS
// ==============================================================================
export const INITIAL_SELLER_DOCUMENTS: SellerDocument[] = [
  {
    id: "sdoc-1",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    doc_type: "fssai_cert",
    file_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600",
    status: "approved",
    created_at: "2026-09-15T10:30:00Z",
  },
  {
    id: "sdoc-2",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    doc_type: "gov_id_front",
    file_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    status: "approved",
    created_at: "2026-09-15T10:32:00Z",
  },
];

// ==============================================================================
// 12. INITIAL PAYOUTS
// ==============================================================================
export const INITIAL_SELLER_PAYOUTS: SellerPayout[] = [
  {
    id: "payout-1",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    amount: 1450.00,
    commission_deducted: 240.00,
    status: "completed",
    transaction_id: "TXN_HP_PAY_8921",
    period_start: "2026-10-25T00:00:00Z",
    period_end: "2026-10-31T23:59:59Z",
    processed_at: "2026-11-01T02:00:00Z",
    created_at: "2026-11-01T01:30:00Z",
  },
];

// ==============================================================================
// 13. INITIAL COMPLAINTS & REFUNDS
// ==============================================================================
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "comp-1",
    ticket_number: "TKT-HP-8801",
    order_id: "ord_1001",
    customer_id: "u0000000-0000-0000-0000-000000000001",
    seller_id: "11111111-aaaa-1111-aaaa-111111111111",
    category: "packaging",
    description: "Outer cardboard parcel was slightly crushed by courier, but the internal pickle glass jar was safe with bubble wrap.",
    status: "resolved",
    resolution_notes: "Advised delivery partner to handle glass consignments with top priority tags.",
    created_at: "2026-10-31T16:00:00Z",
  },
];

export const INITIAL_REFUNDS: Refund[] = [];

// ==============================================================================
// 14. INITIAL ADMIN AUDIT LOGS
// ==============================================================================
export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: "audit-1",
    actor_id: "a0000000-0000-0000-0000-000000000001",
    action: "approve_seller",
    entity_type: "seller",
    entity_id: "11111111-aaaa-1111-aaaa-111111111111",
    new_data: { status: "approved", is_verified: true, kitchen_name: "Ammamma's Traditional Kitchen" },
    created_at: "2026-09-16T11:00:00Z",
  },
  {
    id: "audit-2",
    actor_id: "a0000000-0000-0000-0000-000000000001",
    action: "update_commission",
    entity_type: "category_commission",
    entity_id: "cat-pickles",
    previous_data: { commission_percentage: 15.0 },
    new_data: { commission_percentage: 18.0 },
    created_at: "2026-10-01T09:00:00Z",
  },
];
