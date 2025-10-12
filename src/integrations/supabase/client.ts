import { config } from "@/config";
import { createClient } from "@supabase/supabase-js";

// Enhanced Supabase client configuration for production
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: import.meta.env.MODE === 'development'
    },
    global: {
      headers: {
        'X-Client-Info': 'urcare-web'
      }
    }
  }
);
