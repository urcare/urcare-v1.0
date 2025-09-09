// Development configuration and fallbacks
export const DEV_CONFIG = {
  // Development URLs
  URLS: {
    local: "http://localhost:8080",
    callback: "http://localhost:8080/auth/callback",
    dashboard: "http://localhost:8080/dashboard",
  },

  // Development user for local testing
  DEV_USER: {
    id: "dev-user-123",
    email: "dev@urcare.local",
    user_metadata: {
      full_name: "Development User",
      avatar_url: null,
    },
    app_metadata: {
      provider: "email",
      providers: ["email"],
    },
    aud: "authenticated",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Development profile
  DEV_PROFILE: {
    id: "dev-user-123",
    full_name: "Development User",
    email: "dev@urcare.local",
    age: 25,
    gender: "other",
    height: 170,
    weight: 70,
    activity_level: "moderate",
    health_goals: ["weight_loss", "muscle_gain"],
    dietary_preferences: ["balanced"],
    allergies: [],
    medical_conditions: [],
    medications: [],
    onboarding_completed: true,
    status: "active",
    subscription_status: "active",
    subscription_plan: "premium",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Development settings
  SETTINGS: {
    enableDevMode: true,
    autoLogin: true,
    mockData: true,
    realTimeUpdates: true,
  },
};

// Check if we're in development mode
export const isDevelopment = (): boolean => {
  return (
    import.meta.env.MODE === "development" ||
    import.meta.env.DEV ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

// Development utilities
export const devUtils = {
  // Create a mock session for development
  createMockSession: () => ({
    access_token: "dev-token-123",
    refresh_token: "dev-refresh-123",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: DEV_CONFIG.DEV_USER,
  }),

  // Log development info
  log: (message: string, data?: any) => {
    if (isDevelopment()) {
      console.log(`[DEV] ${message}`, data || "");
    }
  },

  // Warn about development features
  warn: (message: string) => {
    if (isDevelopment()) {
      console.warn(`[DEV WARNING] ${message}`);
    }
  },

  // Error logging for development
  error: (message: string, error?: any) => {
    if (isDevelopment()) {
      console.error(`[DEV ERROR] ${message}`, error || "");
    }
  },
};
