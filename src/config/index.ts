// Centralized configuration with fallbacks
export const config = {
  // Supabase Configuration
  supabase: {
    url:
      import.meta.env.VITE_SUPABASE_URL ||
      "https://lvnkpserdydhnqbigfbz.supabase.co",
    anonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc",
    // Dynamic redirect URL based on current origin
    redirectUrl: `${window.location.origin}/auth/callback`,
    // Production domain for specific configurations
    productionUrl: 'https://urrcare.vercel.app',
  },

  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  },

  // Razorpay Configuration
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
  },

  // App Configuration
  app: {
    name: "UrCare Health",
    version: "1.0.0",
    environment: import.meta.env.MODE || "development",
  },

  // API Configuration - Using internal API calls
  api: {
    baseUrl: '', // Empty for relative paths - no external API calls needed
  },
};

// OpenAI functionality removed

// Helper function to get environment info
export const getEnvironmentInfo = () => {
  return {
    isDevelopment: config.app.environment === "development",
    isProduction: config.app.environment === "production",
    hasSupabase: !!config.supabase.url && !!config.supabase.anonKey,
  };
};
