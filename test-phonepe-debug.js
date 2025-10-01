// Test PhonePe Edge Function directly
// Run this in browser console to test the Edge Function

(async () => {
  console.log("🧪 Testing PhonePe Edge Function...");
  
  const testData = {
    orderId: `TEST_ORDER_${Date.now()}`,
    amount: 100, // 1 Rupee in paise
    userId: "test_user_123",
    planSlug: "basic",
    billingCycle: "annual"
  };
  
  console.log("📤 Test data:", testData);
  
  try {
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY_HERE' // Replace with your anon key
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log("📨 Response status:", response.status);
    console.log("📨 Response data:", result);
    
    if (response.ok) {
      console.log("✅ Test successful!");
    } else {
      console.log("❌ Test failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Test error:", error);
  }
})();

