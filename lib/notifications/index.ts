// ==============================================================================
// HOME PLATE - Unified Notifications Service
// Handles milestone alerts for customers, sellers, and administrators
// ==============================================================================

import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export interface NotificationPayload {
  user_id: string;
  title: string;
  message: string;
  type?: "order" | "delivery" | "payment" | "system";
  link?: string;
}

// In-memory notifications store fallback
const memoryNotifications: Array<NotificationPayload & { id: string; is_read: boolean; created_at: string }> = [];

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  const item = {
    id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    user_id: payload.user_id,
    title: payload.title,
    message: payload.message,
    type: payload.type || "order",
    link: payload.link || "/orders",
    is_read: false,
    created_at: new Date().toISOString(),
  };

  memoryNotifications.unshift(item);

  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.from("notifications").insert(item);
      } catch (err) {
        console.error("[Notification DB Insert Error]", err);
      }
    }
  }

  // Log notification milestone
  console.info(`[Notification Sent] [${item.type.toUpperCase()}] To: ${item.user_id} - ${item.title}: ${item.message}`);
}

export async function getUserNotifications(userId: string) {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
  }
  return memoryNotifications.filter((n) => n.user_id === userId);
}
