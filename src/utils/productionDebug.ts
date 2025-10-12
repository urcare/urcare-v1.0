/**
 * Production debugging utilities for authentication issues
 */

export const debugProductionAuth = () => {
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1';
  
  if (!isProduction) return;
  
  console.log('🔧 Production Environment Debug Info:');
  console.log('📍 Current URL:', window.location.href);
  console.log('🌐 Origin:', window.location.origin);
  console.log('🔗 Expected redirect URL:', `${window.location.origin}/auth/callback`);
  console.log('📱 User Agent:', navigator.userAgent);
  console.log('🍪 Cookies enabled:', navigator.cookieEnabled);
  console.log('🌍 Online status:', navigator.onLine);
  
  // Check environment variables
  console.log('🔑 Environment Variables:');
  console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('- NODE_ENV:', import.meta.env.MODE);
};

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Simple timeout to avoid hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection test timeout')), 5000);
    });
    
    const testPromise = async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Supabase connection failed:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Supabase connection successful');
      return { success: true, session: data.session };
    };
    
    return await Promise.race([testPromise(), timeoutPromise]);
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const logAuthFlow = (step: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`🔐 [${timestamp}] Auth Flow - ${step}:`, data);
};
