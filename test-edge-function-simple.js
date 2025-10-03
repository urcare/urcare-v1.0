// Simple Edge Function Test
// Run this in browser console to test the Edge Function

(async () => {
  console.log("🧪 Testing Edge Function accessibility...");
  
  try {
    // Test with minimal data
    const testData = {
      orderId: `TEST_${Date.now()}`,
      amount: 100,
      userId: "test_user"
    };
    
    console.log("📤 Sending test data:", testData);
    
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHloaHFiaWdmYnoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTU0NDQ0MCwiZXhwIjoyMDUxMTIwNDQwfQ.8J8Q8J8Q8J8Q8J8Q8J8Q8J8Q8J8Q8J8Q8J8Q8J8Q' // Replace with your actual anon key
      },
      body: JSON.stringify(testData)
    });
    
    console.log("📨 Response status:", response.status);
    console.log("📨 Response headers:", Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log("📨 Response body:", result);
    
    try {
      const jsonResult = JSON.parse(result);
      console.log("📨 Parsed JSON:", jsonResult);
    } catch (e) {
      console.log("📨 Response is not JSON:", result);
    }
    
  } catch (error) {
    console.error("❌ Test error:", error);
  }
})();

