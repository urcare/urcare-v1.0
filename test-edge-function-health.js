// Test Edge Function Health Check
// Run this in browser console to test if Edge Function is working

(async () => {
  console.log("🏥 Testing Edge Function Health...");
  
  try {
    // Test GET request (health check)
    const healthResponse = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("🏥 Health check status:", healthResponse.status);
    const healthData = await healthResponse.json();
    console.log("🏥 Health check response:", healthData);
    
    if (healthResponse.ok) {
      console.log("✅ Edge Function is running!");
      console.log("🔧 Configuration:", healthData.config);
    } else {
      console.log("❌ Edge Function health check failed");
    }
    
  } catch (error) {
    console.error("❌ Health check error:", error);
  }
})();

