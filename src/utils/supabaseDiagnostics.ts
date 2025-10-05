import { supabase } from "@/integrations/supabase/client";

export const runSupabaseDiagnostics = async () => {
  console.log("🔍 Running Supabase Diagnostics...");
  
  try {
    // Check Supabase connection
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("📊 Session Status:", session ? "Active" : "None");
    if (sessionError) {
      console.error("❌ Session Error:", sessionError);
    }

    // Check current URL
    console.log("🌐 Current URL:", window.location.href);
    console.log("🌐 Current Origin:", window.location.origin);
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    console.log("🔍 URL Parameters:");
    console.log("- Code:", code ? "Present" : "Missing");
    console.log("- Error:", error || "None");
    console.log("- Error Description:", errorDescription || "None");

    // Check Supabase configuration
    console.log("⚙️ Supabase Configuration:");
    console.log("- URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("- Anon Key:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Present" : "Missing");
    
    // Test a simple query
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error("❌ Database Query Error:", error);
      } else {
        console.log("✅ Database Connection: Working");
      }
    } catch (dbError) {
      console.error("❌ Database Connection Error:", dbError);
    }

    // Check OAuth redirect URL
    const expectedRedirectUrl = `${window.location.origin}/auth/callback`;
    console.log("🔄 Expected Redirect URL:", expectedRedirectUrl);
    
    // Check if we're in the right callback path
    const isCallbackPath = window.location.pathname === '/auth/callback' || window.location.pathname === '/auth';
    console.log("📍 Is Callback Path:", isCallbackPath);

    return {
      hasSession: !!session,
      hasCode: !!code,
      hasError: !!error,
      isCallbackPath,
      expectedRedirectUrl,
      currentUrl: window.location.href
    };

  } catch (error) {
    console.error("❌ Diagnostics Error:", error);
    return null;
  }
};

// Auto-run diagnostics in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    runSupabaseDiagnostics();
  }, 1000);
}
