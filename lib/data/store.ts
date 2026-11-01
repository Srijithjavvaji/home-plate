import {
  Category,
  Food,
  Order,
  OrderStatus,
  Profile,
  Review,
  Seller,
  Coupon,
  PaymentMethod,
  Delivery,
  DeliveryStatus,
  AppSetting,
  CategoryCommission,
  SellerBankDetails,
  SellerDocument,
  SellerPayout,
  Complaint,
  Refund,
  AdminAuditLog,
  WebhookEvent,
} from "../supabase/types";
import {
  INITIAL_CATEGORIES,
  INITIAL_FOODS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_SELLERS,
  INITIAL_COUPONS,
  INITIAL_DELIVERIES,
  INITIAL_APP_SETTINGS,
  INITIAL_CATEGORY_COMMISSIONS,
  INITIAL_SELLER_BANK_DETAILS,
  INITIAL_SELLER_DOCUMENTS,
  INITIAL_SELLER_PAYOUTS,
  INITIAL_COMPLAINTS,
  INITIAL_REFUNDS,
  INITIAL_AUDIT_LOGS,
} from "./mock-data";
import { isSupabaseConfigured, createClient } from "../supabase/client";

class InMemoryStore {
  categories: Category[] = [...INITIAL_CATEGORIES];
  sellers: Seller[] = [...INITIAL_SELLERS];
  foods: Food[] = [...INITIAL_FOODS];
  orders: Order[] = [...INITIAL_ORDERS];
  deliveries: Delivery[] = [...INITIAL_DELIVERIES];
  reviews: Review[] = [...INITIAL_REVIEWS];
  coupons: Coupon[] = [...INITIAL_COUPONS];
  appSettings: AppSetting[] = [...INITIAL_APP_SETTINGS];
  categoryCommissions: CategoryCommission[] = [...INITIAL_CATEGORY_COMMISSIONS];
  sellerBankDetails: SellerBankDetails[] = [...INITIAL_SELLER_BANK_DETAILS];
  sellerDocuments: SellerDocument[] = [...INITIAL_SELLER_DOCUMENTS];
  sellerPayouts: SellerPayout[] = [...INITIAL_SELLER_PAYOUTS];
  complaints: Complaint[] = [...INITIAL_COMPLAINTS];
  refunds: Refund[] = [...INITIAL_REFUNDS];
  auditLogs: AdminAuditLog[] = [...INITIAL_AUDIT_LOGS];
  webhookEvents: WebhookEvent[] = [];

  profiles: Profile[] = [
    {
      id: "u0000000-0000-0000-0000-000000000001",
      email: "customer@homeplate.app",
      full_name: "Rahul Sharma",
      phone: "+91 98765 22001",
      role: "customer",
    },
    {
      id: "s0000000-0000-0000-0000-000000000001",
      email: "lakshmi@ammamma.com",
      full_name: "Lakshmi Devi",
      phone: "+91 98765 11001",
      role: "seller",
    },
    {
      id: "a0000000-0000-0000-0000-000000000001",
      email: "admin@homeplate.app",
      full_name: "Home Plate Admin",
      phone: "+91 98765 00001",
      role: "admin",
    },
  ];

  // ============================================================================
  // APP SETTINGS
  // ============================================================================
  async getAppSettings(): Promise<AppSetting[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.from("app_settings").select("*");
        if (data && data.length > 0) return data as AppSetting[];
      }
    }
    return this.appSettings;
  }

  async getAppSetting(key: string, defaultValue: any = null): Promise<any> {
    const settings = await this.getAppSettings();
    const s = settings.find((item) => item.key === key);
    return s ? s.value : defaultValue;
  }

  async updateAppSetting(key: string, value: any): Promise<AppSetting | null> {
    const idx = this.appSettings.findIndex((item) => item.key === key);
    if (idx >= 0) {
      this.appSettings[idx].value = value;
      this.appSettings[idx].updated_at = new Date().toISOString();
    } else {
      this.appSettings.push({
        id: `set_${Date.now()}`,
        key,
        value,
        updated_at: new Date().toISOString(),
      });
    }

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from("app_settings")
          .upsert({ key, value, updated_at: new Date().toISOString() });
      }
    }

    return this.appSettings.find((item) => item.key === key) || null;
  }

  // ============================================================================
  // CATEGORIES & COMMISSIONS
  // ============================================================================
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from("categories").select("*").eq("is_active", true);
        if (!error && data && data.length > 0) return data as Category[];
      }
    }
    return this.categories.filter((c) => c.is_active);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const list = await this.getCategories();
    return list.find((c) => c.id === id || c.slug === id) || null;
  }

  async addCategory(cat: Omit<Category, "id">): Promise<Category> {
    const newCat: Category = {
      ...cat,
      id: `cat_${Date.now()}`,
    };
    this.categories.push(newCat);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("categories").insert(newCat);
      }
    }
    return newCat;
  }

  async getCategoryCommissions(): Promise<CategoryCommission[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase
          .from("category_commissions")
          .select("*, category:categories(*)");
        if (data && data.length > 0) return data as CategoryCommission[];
      }
    }
    return this.categoryCommissions.map((cc) => ({
      ...cc,
      category: this.categories.find((c) => c.id === cc.category_id),
    }));
  }

  async updateCategoryCommission(categoryId: string, percentage: number): Promise<CategoryCommission | null> {
    const idx = this.categoryCommissions.findIndex((c) => c.category_id === categoryId);
    if (idx >= 0) {
      this.categoryCommissions[idx].commission_percentage = percentage;
      this.categoryCommissions[idx].updated_at = new Date().toISOString();
    } else {
      this.categoryCommissions.push({
        id: `cc_${Date.now()}`,
        category_id: categoryId,
        commission_percentage: percentage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from("category_commissions")
          .upsert({ category_id: categoryId, commission_percentage: percentage, updated_at: new Date().toISOString() });
      }
    }

    return this.categoryCommissions.find((c) => c.category_id === categoryId) || null;
  }

  // ============================================================================
  // FOODS
  // ============================================================================
  async getFoods(): Promise<Food[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("foods")
          .select("*, seller:sellers(*), category:categories(*)");
        if (!error && data && data.length > 0) return data as Food[];
      }
    }
    return this.foods.map((food) => ({
      ...food,
      seller: this.sellers.find((s) => s.id === food.seller_id),
      category: this.categories.find((c) => c.id === food.category_id),
    }));
  }

  async getFoodById(id: string): Promise<Food | null> {
    const foods = await this.getFoods();
    return foods.find((f) => f.id === id || f.slug === id) || null;
  }

  async getFoodsByCategory(categoryId: string): Promise<Food[]> {
    const foods = await this.getFoods();
    return foods.filter(
      (f) =>
        f.category_id === categoryId ||
        (f.category && (f.category.id === categoryId || f.category.slug === categoryId))
    );
  }

  async getFoodsBySeller(sellerId: string): Promise<Food[]> {
    const foods = await this.getFoods();
    return foods.filter((f) => f.seller_id === sellerId);
  }

  async addFood(foodData: Omit<Food, "id" | "rating" | "total_reviews">): Promise<Food> {
    const newFood: Food = {
      ...foodData,
      id: `food_${Date.now()}`,
      rating: 5.0,
      total_reviews: 0,
      created_at: new Date().toISOString(),
    };
    this.foods.unshift(newFood);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("foods").insert(newFood);
      }
    }
    return newFood;
  }

  async updateFood(id: string, updates: Partial<Food>): Promise<Food | null> {
    const idx = this.foods.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    this.foods[idx] = { ...this.foods[idx], ...updates, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("foods").update(updates).eq("id", id);
      }
    }
    return this.foods[idx];
  }

  async deleteFood(id: string): Promise<boolean> {
    const initialLen = this.foods.length;
    this.foods = this.foods.filter((f) => f.id !== id);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("foods").delete().eq("id", id);
      }
    }
    return this.foods.length < initialLen;
  }

  // ============================================================================
  // SELLERS & COMPLIANCE
  // ============================================================================
  async getSellers(): Promise<Seller[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from("sellers").select("*");
        if (!error && data && data.length > 0) return data as Seller[];
      }
    }
    return this.sellers;
  }

  async getSellerById(id: string): Promise<Seller | null> {
    const sellers = await this.getSellers();
    return sellers.find((s) => s.id === id || s.user_id === id) || null;
  }

  async updateSellerStatus(sellerId: string, status: Seller["status"]): Promise<Seller | null> {
    const s = this.sellers.find((item) => item.id === sellerId);
    if (!s) return null;
    s.status = status;
    s.is_verified = status === "approved";
    s.updated_at = new Date().toISOString();

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from("sellers")
          .update({ status, is_verified: s.is_verified, updated_at: s.updated_at })
          .eq("id", sellerId);
      }
    }
    return s;
  }

  async registerSeller(sellerData: Partial<Seller> & { user_id: string; kitchen_name: string }): Promise<Seller> {
    const newSeller: Seller = {
      id: `seller_${Date.now()}`,
      user_id: sellerData.user_id,
      kitchen_name: sellerData.kitchen_name,
      description: sellerData.description || "",
      address: sellerData.address || "",
      city: sellerData.city || "Hyderabad",
      state: sellerData.state || "Telangana",
      pincode: sellerData.pincode || "500001",
      phone: sellerData.phone || "",
      fssai_number: sellerData.fssai_number || "",
      is_verified: false,
      status: "pending",
      rating: 5.0,
      total_ratings: 0,
      banner_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80",
      logo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    };
    this.sellers.unshift(newSeller);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("sellers").insert(newSeller);
      }
    }
    return newSeller;
  }

  async getSellerBankDetails(sellerId: string): Promise<SellerBankDetails | null> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.from("seller_bank_details").select("*").eq("seller_id", sellerId).single();
        if (data) return data as SellerBankDetails;
      }
    }
    return this.sellerBankDetails.find((b) => b.seller_id === sellerId) || null;
  }

  async saveSellerBankDetails(data: Omit<SellerBankDetails, "id" | "created_at">): Promise<SellerBankDetails> {
    const existing = this.sellerBankDetails.findIndex((b) => b.seller_id === data.seller_id);
    const newRecord: SellerBankDetails = {
      ...data,
      id: existing >= 0 ? this.sellerBankDetails[existing].id : `sbd_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    if (existing >= 0) {
      this.sellerBankDetails[existing] = newRecord;
    } else {
      this.sellerBankDetails.push(newRecord);
    }

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("seller_bank_details").upsert(newRecord);
      }
    }
    return newRecord;
  }

  async getSellerDocuments(sellerId: string): Promise<SellerDocument[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.from("seller_documents").select("*").eq("seller_id", sellerId);
        if (data) return data as SellerDocument[];
      }
    }
    return this.sellerDocuments.filter((d) => d.seller_id === sellerId);
  }

  async uploadSellerDocument(data: Omit<SellerDocument, "id" | "created_at">): Promise<SellerDocument> {
    const doc: SellerDocument = {
      ...data,
      id: `sdoc_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.sellerDocuments.push(doc);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("seller_documents").insert(doc);
      }
    }
    return doc;
  }

  // ============================================================================
  // ORDERS (With Multi-Seller Splitting Support)
  // ============================================================================
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*, seller:sellers(*), delivery:deliveries(*)")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) return data as Order[];
      }
    }
    return this.orders.map((ord) => ({
      ...ord,
      seller: this.sellers.find((s) => s.id === ord.seller_id),
      delivery: this.deliveries.find((d) => d.order_id === ord.id),
    }));
  }

  async getOrderById(id: string): Promise<Order | null> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*, seller:sellers(*), items:order_items(*), delivery:deliveries(*)")
          .or(`id.eq.${id},order_number.eq.${id}`)
          .single();
        if (!error && data) return data as Order;
      }
    }
    const ord = this.orders.find((o) => o.id === id || o.order_number === id);
    if (!ord) return null;
    return {
      ...ord,
      seller: this.sellers.find((s) => s.id === ord.seller_id),
      delivery: this.deliveries.find((d) => d.order_id === ord.id),
    };
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.orders.filter((o) => o.customer_id === customerId);
  }

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    return this.orders.filter((o) => o.seller_id === sellerId);
  }

  /**
   * Create an order. If items belong to multiple distinct sellers,
   * intelligently split them into sub-orders linked by parent_order_id.
   */
  async createOrder(orderInput: {
    customer_id: string;
    seller_id?: string;
    delivery_address: Order["delivery_address"];
    items: {
      food_id: string;
      food_name: string;
      food_image?: string;
      unit_price: number;
      quantity: number;
      total_price: number;
      seller_id?: string;
    }[];
    subtotal: number;
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
    payment_method: PaymentMethod;
    notes?: string;
    razorpay_order_id?: string;
    delivery_slot?: "asap" | "scheduled";
    scheduled_at?: string;
  }): Promise<Order> {
    const parentCode = `HP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;

    // Group items by seller
    const sellerItemMap = new Map<string, typeof orderInput.items>();
    for (const it of orderInput.items) {
      let sId = it.seller_id;
      if (!sId) {
        const food = this.foods.find((f) => f.id === it.food_id);
        sId = food?.seller_id || this.sellers[0]?.id || "11111111-aaaa-1111-aaaa-111111111111";
      }
      if (!sellerItemMap.has(sId)) {
        sellerItemMap.set(sId, []);
      }
      sellerItemMap.get(sId)!.push(it);
    }

    const createdOrders: Order[] = [];
    const isMultiSeller = sellerItemMap.size > 1;
    let splitIdx = 1;

    for (const [sellerId, sellerItems] of sellerItemMap.entries()) {
      const sellerSubtotal = sellerItems.reduce((sum, item) => sum + item.total_price, 0);
      const ratio = orderInput.subtotal > 0 ? sellerSubtotal / orderInput.subtotal : 1;
      const sellerDeliveryFee = Math.round(orderInput.delivery_fee * ratio * 100) / 100;
      const sellerDiscount = Math.round(orderInput.discount_amount * ratio * 100) / 100;
      const sellerTotal = Math.max(0, sellerSubtotal + sellerDeliveryFee - sellerDiscount);

      const orderNumber = isMultiSeller ? `${parentCode}-${splitIdx}` : parentCode;
      const orderId = `ord_${Date.now()}_${splitIdx}`;

      const newOrder: Order = {
        id: orderId,
        order_number: orderNumber,
        parent_order_id: isMultiSeller ? parentCode : undefined,
        customer_id: orderInput.customer_id,
        seller_id: sellerId,
        delivery_address: orderInput.delivery_address,
        status: orderInput.payment_method === "razorpay" ? "payment_pending" : "confirmed",
        subtotal: sellerSubtotal,
        delivery_fee: sellerDeliveryFee,
        discount_amount: sellerDiscount,
        total_amount: sellerTotal,
        payment_method: orderInput.payment_method,
        payment_status: orderInput.payment_method === "cod" ? "pending" : "pending",
        razorpay_order_id: orderInput.razorpay_order_id,
        notes: orderInput.notes,
        delivery_slot: orderInput.delivery_slot || "asap",
        scheduled_at: orderInput.scheduled_at,
        estimated_delivery_at: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        items: sellerItems.map((item, idx) => ({
          id: `oi_${Date.now()}_${splitIdx}_${idx}`,
          order_id: orderId,
          ...item,
        })),
      };

      this.orders.unshift(newOrder);

      // Create an accompanying initial delivery record with delivery OTP
      const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const newDel: Delivery = {
        id: `del_${Date.now()}_${splitIdx}`,
        order_id: orderId,
        provider: "shadowfax",
        tracking_id: `SFX-${orderNumber}`,
        status: "pending",
        delivery_otp: deliveryOtp,
        otp_verified: false,
        pickup_address: this.sellers.find((s) => s.id === sellerId)?.address || "Kitchen Pickup",
        pickup_pincode: this.sellers.find((s) => s.id === sellerId)?.pincode || "500001",
        drop_address: `${orderInput.delivery_address.address_line1}, ${orderInput.delivery_address.city}`,
        drop_pincode: orderInput.delivery_address.pincode,
        created_at: new Date().toISOString(),
      };
      this.deliveries.unshift(newDel);

      if (isSupabaseConfigured) {
        const supabase = createClient();
        if (supabase) {
          await supabase.from("orders").insert(newOrder);
          await supabase.from("deliveries").insert(newDel);
        }
      }

      createdOrders.push(newOrder);
      splitIdx++;
    }

    return createdOrders[0];
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const ord = this.orders.find((o) => o.id === orderId);
    if (!ord) return null;
    ord.status = status;
    ord.updated_at = new Date().toISOString();

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("orders").update({ status, updated_at: ord.updated_at }).eq("id", orderId);
      }
    }
    return ord;
  }

  async markOrderPaid(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature?: string
  ): Promise<Order | null> {
    const ord = this.orders.find((o) => o.id === orderId || o.razorpay_order_id === orderId);
    if (!ord) return null;
    ord.status = "confirmed";
    ord.payment_status = "paid";
    ord.razorpay_payment_id = razorpayPaymentId;
    if (razorpaySignature) {
      ord.razorpay_signature = razorpaySignature;
    }
    ord.updated_at = new Date().toISOString();

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("orders").update({
          status: "confirmed",
          payment_status: "paid",
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          updated_at: ord.updated_at,
        }).eq("id", ord.id);
      }
    }
    return ord;
  }

  // ============================================================================
  // DELIVERIES & LOGISTICS
  // ============================================================================
  async getDeliveries(): Promise<Delivery[]> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("deliveries")
          .select("*, order:orders(*)")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) return data as Delivery[];
      }
    }
    return this.deliveries.map((del) => ({
      ...del,
      order: this.orders.find((o) => o.id === del.order_id),
    }));
  }

  async getDeliveryByOrderId(orderId: string): Promise<Delivery | null> {
    const list = await this.getDeliveries();
    return list.find((d) => d.order_id === orderId) || null;
  }

  async getDeliveryById(id: string): Promise<Delivery | null> {
    const list = await this.getDeliveries();
    return list.find((d) => d.id === id || d.tracking_id === id) || null;
  }

  async createDelivery(deliveryData: Omit<Delivery, "id" | "created_at">): Promise<Delivery> {
    const newDelivery: Delivery = {
      ...deliveryData,
      id: `del_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("deliveries").insert(newDelivery);
      }
    }

    const existingIndex = this.deliveries.findIndex((d) => d.order_id === deliveryData.order_id);
    if (existingIndex >= 0) {
      this.deliveries[existingIndex] = newDelivery;
    } else {
      this.deliveries.unshift(newDelivery);
    }

    return newDelivery;
  }

  async updateDelivery(
    deliveryIdOrOrderId: string,
    updates: Partial<Delivery>
  ): Promise<Delivery | null> {
    const idx = this.deliveries.findIndex(
      (d) =>
        d.id === deliveryIdOrOrderId ||
        d.order_id === deliveryIdOrOrderId ||
        d.tracking_id === deliveryIdOrOrderId
    );
    if (idx === -1) return null;

    this.deliveries[idx] = {
      ...this.deliveries[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from("deliveries")
          .update(updates)
          .eq("id", this.deliveries[idx].id);
      }
    }

    return this.deliveries[idx];
  }

  // ============================================================================
  // COUPONS
  // ============================================================================
  async getCoupon(code: string): Promise<Coupon | null> {
    const c = this.coupons.find(
      (item) => item.code.toUpperCase() === code.toUpperCase() && item.is_active
    );
    return c || null;
  }

  // ============================================================================
  // REVIEWS
  // ============================================================================
  async getReviews(foodId: string): Promise<Review[]> {
    return this.reviews.filter((r) => r.food_id === foodId);
  }

  async addReview(review: Omit<Review, "id" | "created_at">): Promise<Review> {
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.reviews.unshift(newRev);

    const food = this.foods.find((f) => f.id === review.food_id);
    if (food) {
      const foodReviews = this.reviews.filter((r) => r.food_id === review.food_id);
      const total = foodReviews.reduce((sum, r) => sum + r.rating, 0);
      food.rating = Number((total / foodReviews.length).toFixed(1));
      food.total_reviews = foodReviews.length;
    }
    return newRev;
  }

  // ============================================================================
  // PROFILES & ROLES
  // ============================================================================
  async getProfiles(): Promise<Profile[]> {
    return this.profiles;
  }

  async updateProfileRole(id: string, role: Profile["role"]): Promise<Profile | null> {
    const p = this.profiles.find((item) => item.id === id);
    if (!p) return null;
    p.role = role;
    return p;
  }

  // ============================================================================
  // SELLER PAYOUTS
  // ============================================================================
  async getSellerPayouts(sellerId?: string): Promise<SellerPayout[]> {
    if (sellerId) {
      return this.sellerPayouts.filter((p) => p.seller_id === sellerId);
    }
    return this.sellerPayouts;
  }

  async createSellerPayout(data: Omit<SellerPayout, "id" | "created_at">): Promise<SellerPayout> {
    const payout: SellerPayout = {
      ...data,
      id: `payout_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.sellerPayouts.unshift(payout);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("seller_payouts").insert(payout);
      }
    }
    return payout;
  }

  // ============================================================================
  // COMPLAINTS & REFUNDS
  // ============================================================================
  async getComplaints(sellerId?: string): Promise<Complaint[]> {
    let list = this.complaints;
    if (sellerId) {
      list = list.filter((c) => c.seller_id === sellerId);
    }
    return list.map((c) => ({
      ...c,
      order: this.orders.find((o) => o.id === c.order_id),
      seller: this.sellers.find((s) => s.id === c.seller_id),
    }));
  }

  async createComplaint(data: Omit<Complaint, "id" | "ticket_number" | "created_at">): Promise<Complaint> {
    const ticketNumber = `TKT-HP-${Math.floor(1000 + Math.random() * 9000)}`;
    const comp: Complaint = {
      ...data,
      id: `comp_${Date.now()}`,
      ticket_number: ticketNumber,
      created_at: new Date().toISOString(),
    };
    this.complaints.unshift(comp);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("complaints").insert(comp);
      }
    }
    return comp;
  }

  async updateComplaintStatus(
    id: string,
    status: Complaint["status"],
    notes?: string,
    resolvedBy?: string
  ): Promise<Complaint | null> {
    const comp = this.complaints.find((c) => c.id === id || c.ticket_number === id);
    if (!comp) return null;
    comp.status = status;
    if (notes) comp.resolution_notes = notes;
    if (resolvedBy) comp.resolved_by = resolvedBy;
    comp.updated_at = new Date().toISOString();

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("complaints").update({
          status,
          resolution_notes: comp.resolution_notes,
          resolved_by: comp.resolved_by,
          updated_at: comp.updated_at,
        }).eq("id", comp.id);
      }
    }
    return comp;
  }

  async getRefunds(orderId?: string): Promise<Refund[]> {
    let list = this.refunds;
    if (orderId) {
      list = list.filter((r) => r.order_id === orderId);
    }
    return list.map((r) => ({
      ...r,
      order: this.orders.find((o) => o.id === r.order_id),
    }));
  }

  async createRefund(data: Omit<Refund, "id" | "created_at">): Promise<Refund> {
    const ref: Refund = {
      ...data,
      id: `ref_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.refunds.unshift(ref);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("refunds").insert(ref);
      }
    }
    return ref;
  }

  // ============================================================================
  // ADMIN AUDIT LOGS
  // ============================================================================
  async getAdminAuditLogs(): Promise<AdminAuditLog[]> {
    return this.auditLogs.map((log) => ({
      ...log,
      actor: this.profiles.find((p) => p.id === log.actor_id),
    }));
  }

  async logAdminAction(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    previousData?: any,
    newData?: any
  ): Promise<AdminAuditLog> {
    const log: AdminAuditLog = {
      id: `audit_${Date.now()}`,
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      previous_data: previousData,
      new_data: newData,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("admin_audit_logs").insert(log);
      }
    }
    return log;
  }

  // ============================================================================
  // WEBHOOK IDEMPOTENCY
  // ============================================================================
  async isWebhookEventProcessed(eventId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.from("webhook_events").select("id").eq("event_id", eventId).single();
        if (data) return true;
      }
    }
    return this.webhookEvents.some((ev) => ev.event_id === eventId);
  }

  async recordWebhookEvent(eventId: string, provider: "razorpay" | "shadowfax", eventType: string, payload: any): Promise<void> {
    const event: WebhookEvent = {
      id: `whe_${Date.now()}`,
      event_id: eventId,
      provider,
      event_type: eventType,
      payload,
      processed_at: new Date().toISOString(),
    };
    this.webhookEvents.push(event);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("webhook_events").insert(event);
      }
    }
  }
}

export const store = new InMemoryStore();
