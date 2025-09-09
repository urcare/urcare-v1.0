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
    // Development redirect URL
    redirectUrl:
      import.meta.env.MODE === "development"
        ? "http://localhost:8080/auth/callback"
        : import.meta.env.VITE_SUPABASE_REDIRECT_URL ||
          "https://urcare-v1-0.vercel.app/auth/callback",
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

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
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
