import { config } from "@/config";
import { createClient } from "@supabase/supabase-js";

// Simple Supabase client configuration
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
);
