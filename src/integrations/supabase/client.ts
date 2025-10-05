import { config } from "@/config";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Use development redirect URL for local development
      redirectTo: config.supabase.redirectUrl,
      // Use implicit flow for better compatibility
      flowType: "implicit",
      debug: false, // Disable verbose auth logs
    },
  }
);
