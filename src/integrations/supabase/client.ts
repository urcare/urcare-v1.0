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
      debug: import.meta.env.MODE === 'development',
      // Enhanced session handling
      storage: {
        getItem: (key: string) => {
          try {
            return localStorage.getItem(key);
          } catch (error) {
            console.warn('Failed to get item from localStorage:', error);
            return null;
          }
        },
        setItem: (key: string, value: string) => {
          try {
            localStorage.setItem(key, value);
          } catch (error) {
            console.warn('Failed to set item in localStorage:', error);
          }
        },
        removeItem: (key: string) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.warn('Failed to remove item from localStorage:', error);
          }
        }
      },
      // Session timeout handling
      refreshTokenRetryInterval: 1000,
      refreshTokenRetryAttempts: 3
    },
    global: {
      headers: {
        'X-Client-Info': 'urcare-web'
      }
    }
  }
);
