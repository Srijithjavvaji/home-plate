import { Category, Food, Order, OrderStatus, Profile, Review, Seller, Coupon, PaymentMethod, Delivery, DeliveryStatus } from "../supabase/types";
import { INITIAL_CATEGORIES, INITIAL_FOODS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_SELLERS, INITIAL_COUPONS, INITIAL_DELIVERIES } from "./mock-data";
import { isSupabaseConfigured, createClient } from "../supabase/client";

// In-memory runtime store for development & mock fallback
class InMemoryStore {
  categories: Category[] = [...INITIAL_CATEGORIES];
  sellers: Seller[] = [...INITIAL_SELLERS];
  foods: Food[] = [...INITIAL_FOODS];
  orders: Order[] = [...INITIAL_ORDERS];
  deliveries: Delivery[] = [...INITIAL_DELIVERIES];
  reviews: Review[] = [...INITIAL_REVIEWS];
  coupons: Coupon[] = [...INITIAL_COUPONS];
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

  // CATEGORIES
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
    return newCat;
  }

  // FOODS
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
    return newFood;
  }

  async updateFood(id: string, updates: Partial<Food>): Promise<Food | null> {
    const idx = this.foods.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    this.foods[idx] = { ...this.foods[idx], ...updates };
    return this.foods[idx];
  }

  async deleteFood(id: string): Promise<boolean> {
    const initialLen = this.foods.length;
    this.foods = this.foods.filter((f) => f.id !== id);
    return this.foods.length < initialLen;
  }

  // SELLERS
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
    return newSeller;
  }

  // ORDERS
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
    }[];
    subtotal: number;
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
    payment_method: PaymentMethod;
    notes?: string;
    razorpay_order_id?: string;
  }): Promise<Order> {
    const orderNumber = `HP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      order_number: orderNumber,
      customer_id: orderInput.customer_id,
      seller_id: orderInput.seller_id || this.sellers[0]?.id,
      delivery_address: orderInput.delivery_address,
      status: orderInput.payment_method === "razorpay" ? "payment_pending" : "confirmed",
      subtotal: orderInput.subtotal,
      delivery_fee: orderInput.delivery_fee,
      discount_amount: orderInput.discount_amount,
      total_amount: orderInput.total_amount,
      payment_method: orderInput.payment_method,
      payment_status: orderInput.payment_method === "cod" ? "pending" : "pending",
      razorpay_order_id: orderInput.razorpay_order_id,
      notes: orderInput.notes,
      estimated_delivery_at: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      items: orderInput.items.map((item, idx) => ({
        id: `oi_${Date.now()}_${idx}`,
        order_id: `ord_${Date.now()}`,
        ...item,
      })),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const ord = this.orders.find((o) => o.id === orderId);
    if (!ord) return null;
    ord.status = status;
    ord.updated_at = new Date().toISOString();
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
    return ord;
  }

  // DELIVERIES
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

  // COUPONS
  async getCoupon(code: string): Promise<Coupon | null> {
    const c = this.coupons.find((item) => item.code.toUpperCase() === code.toUpperCase() && item.is_active);
    return c || null;
  }

  // REVIEWS
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

    // Update food rating
    const food = this.foods.find((f) => f.id === review.food_id);
    if (food) {
      const foodReviews = this.reviews.filter((r) => r.food_id === review.food_id);
      const total = foodReviews.reduce((sum, r) => sum + r.rating, 0);
      food.rating = Number((total / foodReviews.length).toFixed(1));
      food.total_reviews = foodReviews.length;
    }
    return newRev;
  }

  // USERS / PROFILES
  async getProfiles(): Promise<Profile[]> {
    return this.profiles;
  }

  async updateProfileRole(id: string, role: Profile["role"]): Promise<Profile | null> {
    const p = this.profiles.find((item) => item.id === id);
    if (!p) return null;
    p.role = role;
    return p;
  }
}

// Global singleton instance so state persists during session
const globalStore = (globalThis as unknown as { __homePlateStore?: InMemoryStore }).__homePlateStore || new InMemoryStore();
if (process.env.NODE_ENV !== "production") {
  (globalThis as unknown as { __homePlateStore?: InMemoryStore }).__homePlateStore = globalStore;
}

export const store = globalStore;
