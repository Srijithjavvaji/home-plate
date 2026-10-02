import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder"));

export function createClient() {
  if (!isSupabaseConfigured) {
    // Return null or placeholder client if not configured yet
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
