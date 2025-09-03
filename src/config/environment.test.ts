// Simple test file for environment configuration
// This helps verify the configuration works in different environments

import { env, isDevelopment, isProduction, isTest } from './environment';

// Test environment detection
console.log('Environment Test Results:');
console.log('NODE_ENV:', env.NODE_ENV);
console.log('isDevelopment():', isDevelopment());
console.log('isProduction():', isProduction());
console.log('isTest():', isTest());
console.log('hasOpenAI:', !!env.OPENAI_API_KEY);
console.log('hasSupabase:', !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY));

// Test safe access
console.log('process check:', typeof process !== 'undefined' ? 'Node.js' : 'Browser');
console.log('window check:', typeof window !== 'undefined' ? 'Browser' : 'Node.js');

// Export for testing
export const testEnvironment = {
  env,
  isDevelopment,
  isProduction,
  isTest,
  processType: typeof process !== 'undefined' ? 'Node.js' : 'Browser',
  windowType: typeof window !== 'undefined' ? 'Browser' : 'Node.js',
};
