import { supabase } from '@/integrations/supabase/client';

/**
 * Production-specific authentication utilities
 */
export const checkProductionAuth = async () => {
  try {
    // Check if we're in production
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1';
    
    if (!isProduction) return { isProduction: false };
    
    console.log('🔧 Production environment detected');
    
    // Test Supabase connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return { 
        isProduction: true, 
        supabaseConnected: false, 
        error: error.message 
      };
    }
    
    console.log('✅ Supabase connected successfully');
    
    // Check redirect URL configuration
    const currentOrigin = window.location.origin;
    const expectedRedirectUrl = `${currentOrigin}/auth/callback`;
    
    console.log('🔧 Redirect URL check:', {
      currentOrigin,
      expectedRedirectUrl,
      isProduction
    });
    
    return {
      isProduction: true,
      supabaseConnected: true,
      redirectUrl: expectedRedirectUrl,
      origin: currentOrigin
    };
    
  } catch (error) {
    console.error('❌ Production auth check failed:', error);
    return {
      isProduction: true,
      supabaseConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Enhanced sign-in with production debugging and timeout
 */
export const productionSignIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Production sign-in attempt:', { email, environment: 'production' });
    
    // Add timeout wrapper for the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Sign-in timeout after 30 seconds')), 30000);
    });
    
    const signInPromise = async () => {
      // Check production environment first
      console.log('🔧 Checking production environment...');
      const envCheck = await checkProductionAuth();
      if (!envCheck.supabaseConnected) {
        throw new Error(`Supabase connection failed: ${envCheck.error}`);
      }
      console.log('✅ Environment check passed');
      
      // Attempt sign-in
      console.log('🔐 Attempting Supabase sign-in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Production sign-in error:', error);
        throw error;
      }
      
      console.log('✅ Production sign-in successful:', data.user?.email);
      
      // Wait for session to be established
      console.log('⏳ Waiting for session establishment...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify session with retry logic
      let session = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      console.log('🔍 Verifying session...');
      while (attempts < maxAttempts && !session) {
        console.log(`🔄 Session verification attempt ${attempts + 1}/${maxAttempts}`);
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error(`Session error (attempt ${attempts + 1}):`, sessionError);
        }
        
        session = currentSession;
        attempts++;
        
        if (!session && attempts < maxAttempts) {
          console.log(`⏳ Waiting for session... (attempt ${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (session?.user) {
        console.log('✅ Production session verified:', session.user.email);
        return { success: true, user: session.user, session };
      } else {
        console.error('❌ Production session verification failed');
        return { success: false, error: 'Session verification failed' };
      }
    };
    
    // Race between sign-in and timeout
    return await Promise.race([signInPromise(), timeoutPromise]);
    
  } catch (error) {
    console.error('❌ Production sign-in failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
