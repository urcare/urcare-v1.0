// Environment configuration utility
// Handles both browser and Node.js environments safely

interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  OPENAI_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

// Safe environment variable access
const getEnvVar = (key: string): string | undefined => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In browser, try to get from window.__ENV__ or similar
    return (window as any).__ENV__?.[key];
  }
  
  // Check if we're in Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  return undefined;
};

// Environment configuration
export const env: EnvironmentConfig = {
  NODE_ENV: (getEnvVar('NODE_ENV') as any) || 'development',
  OPENAI_API_KEY: getEnvVar('REACT_APP_OPENAI_API_KEY'),
  SUPABASE_URL: getEnvVar('REACT_APP_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('REACT_APP_SUPABASE_ANON_KEY'),
};

// Environment check utilities
export const isDevelopment = (): boolean => env.NODE_ENV === 'development';
export const isProduction = (): boolean => env.NODE_ENV === 'production';
export const isTest = (): boolean => env.NODE_ENV === 'test';

// Feature flags
export const isFeatureEnabled = (feature: string): boolean => {
  const flag = getEnvVar(`REACT_APP_FEATURE_${feature.toUpperCase()}`);
  return flag === 'true' || flag === '1';
};

// Debug mode
export const isDebugMode = (): boolean => {
  return isDevelopment() || getEnvVar('REACT_APP_DEBUG') === 'true';
};

// API configuration
export const getApiConfig = () => ({
  openai: {
    apiKey: env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
  },
});

// Log environment info in development
if (isDevelopment()) {
  console.log('Environment Configuration:', {
    NODE_ENV: env.NODE_ENV,
    hasOpenAI: !!env.OPENAI_API_KEY,
    hasSupabase: !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
    debugMode: isDebugMode(),
  });
}
