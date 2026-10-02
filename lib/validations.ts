import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "seller"]).default("customer"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const sellerApplicationSchema = z.object({
  kitchenName: z.string().min(3, "Kitchen name must be at least 3 characters"),
  description: z.string().min(20, "Please provide a description of at least 20 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "Pincode must be exactly 6 digits"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  fssaiNumber: z.string().optional(),
});

export const foodItemSchema = z.object({
  name: z.string().min(3, "Dish name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than zero"),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  prepTimeMinutes: z.number().int().min(5).max(180),
  ingredients: z.array(z.string()).min(1, "Add at least one key ingredient"),
  servingInfo: z.string().min(2, "Please specify serving info (e.g. Serves 1-2)"),
  imageUrl: z.string().url("Please provide a valid image URL"),
});

export const addressSchema = z.object({
  label: z.string().default("Home"),
  name: z.string().min(2, "Contact name is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  addressLine1: z.string().min(5, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  isDefault: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Phone number is required"),
  addressLine1: z.string().min(5, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  paymentMethod: z.enum(["razorpay", "cod"]),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, "Review comment must be at least 3 characters"),
  foodId: z.string(),
});
