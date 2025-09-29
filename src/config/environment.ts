// Environment configuration utility
// Handles both browser and Node.js environments safely

interface EnvironmentConfig {
  NODE_ENV: "development" | "production" | "test";
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
}

// Safe environment variable access
const getEnvVar = (key: string): string | undefined => {
  // Check if we're in a browser environment with Vite
  if (
    typeof window !== "undefined" &&
    typeof import.meta !== "undefined" &&
    import.meta.env
  ) {
    return import.meta.env[key];
  }

  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // In browser, try to get from window.__ENV__ or similar
    return (window as any).__ENV__?.[key];
  }

  // Check if we're in Node.js environment
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }

  return undefined;
};

// Environment configuration
export const env: EnvironmentConfig = {
  NODE_ENV: (getEnvVar("NODE_ENV") as any) || "development",
  SUPABASE_URL: getEnvVar("VITE_SUPABASE_URL"),
  SUPABASE_ANON_KEY: getEnvVar("VITE_SUPABASE_ANON_KEY"),
  RAZORPAY_KEY_ID: getEnvVar("VITE_RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: getEnvVar("VITE_RAZORPAY_KEY_SECRET"),
};

// Environment check utilities
export const isDevelopment = (): boolean => env.NODE_ENV === "development";
export const isProduction = (): boolean => env.NODE_ENV === "production";
export const isTest = (): boolean => env.NODE_ENV === "test";

// Feature flags
export const isFeatureEnabled = (feature: string): boolean => {
  const flag = getEnvVar(`VITE_FEATURE_${feature.toUpperCase()}`);
  return flag === "true" || flag === "1";
};

// Debug mode
export const isDebugMode = (): boolean => {
  return isDevelopment() || getEnvVar("VITE_DEBUG") === "true";
};

// API configuration
export const getApiConfig = () => ({
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
  },
  razorpay: {
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
  },
});

// Log environment info in development
if (isDevelopment()) {
  console.log("Environment Configuration:", {
    NODE_ENV: env.NODE_ENV,
    hasSupabase: !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
    hasRazorpay: !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
    debugMode: isDebugMode(),
  });
}
