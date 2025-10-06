import { config } from "@/config";
import { createClient } from "@supabase/supabase-js";

// Determine redirect URL based on environment
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const redirectUrl = isLocalhost 
  ? `${window.location.origin}/auth/callback`
  : config.supabase.redirectUrl;

console.log('🔧 Supabase Client Configuration:', {
  hostname: window.location.hostname,
  port: window.location.port,
  origin: window.location.origin,
  isLocalhost,
  redirectUrl,
  configRedirectUrl: config.supabase.redirectUrl
});

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Force localhost redirect for development
      redirectTo: redirectUrl,
      // Use implicit flow for better compatibility
      flowType: "implicit",
      debug: false, // Disable verbose auth logs
    },
    global: {
      headers: {
        'X-Client-Info': 'urrcare.vercel.app',
      },
    },
  }
);
