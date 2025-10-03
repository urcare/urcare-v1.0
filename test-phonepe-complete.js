// Complete PhonePe Integration Test
// Run this in browser console to test the entire flow

(async () => {
  console.log("🧪 COMPLETE PHONEPE INTEGRATION TEST");
  console.log("=====================================");
  
  // Test 1: Verify credentials work with PhonePe API directly
  console.log("\n🔑 Test 1: Direct PhonePe API Test");
  console.log("----------------------------------");
  
  const MERCHANT_ID = "M23XRS3XN3QMF";
  const API_KEY = "713219fb-38d0-468d-8268-8b15955468b0";
  const SALT_INDEX = "1";
  const BASE_URL = "https://api.phonepe.com/apis/hermes";

  const orderId = `TEST_ORDER_${Date.now()}`;
  const amount = 100; // 1 Rupee in paise
  const userId = "test_user_123";
  const redirectUrl = "http://localhost:8081/payment/success";
  const callbackUrl = "http://localhost:8081/api/phonepe/callback";

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: orderId,
    merchantUserId: userId,
    amount: amount,
    redirectUrl: redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: callbackUrl,
    paymentInstrument: { type: "PAY_PAGE" }
  };

  console.log("📦 Payload:", payload);

  const payloadString = JSON.stringify(payload);
  const base64Payload = btoa(payloadString);
  console.log("📦 Base64 Payload:", base64Payload.substring(0, 100) + "...");

  const endpoint = "/pg/v1/pay";
  const stringToHash = `${base64Payload}${endpoint}${API_KEY}`;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToHash);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const xVerify = `${hashHex}###${SALT_INDEX}`;

  console.log("🔐 X-VERIFY:", xVerify.substring(0, 30) + "...");

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        "X-MERCHANT-ID": MERCHANT_ID,
        "accept": "application/json",
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const result = await response.json();
    console.log("📨 PhonePe API Response Status:", response.status);
    console.log("📨 PhonePe API Response:", result);

    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      console.log("✅ SUCCESS! Direct PhonePe API test passed!");
      console.log("🔗 Redirect URL:", result.data.instrumentResponse.redirectInfo.url);
    } else {
      console.log("❌ FAILURE: Direct PhonePe API test failed");
      console.log("🔍 Error:", result.message || "Unknown error");
      console.log("🔍 Code:", result.code);
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }

  // Test 2: Test Edge Function
  console.log("\n🔧 Test 2: Edge Function Test");
  console.log("-----------------------------");
  
  const testData = {
    orderId: `EDGE_TEST_${Date.now()}`,
    amount: 100,
    userId: "test_user_123",
    planSlug: "basic",
    billingCycle: "annual"
  };
  
  console.log("📤 Test data for Edge Function:", testData);
  
  try {
    // You'll need to replace YOUR_ANON_KEY with your actual Supabase anon key
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY_HERE' // Replace with your anon key
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log("📨 Edge Function Response Status:", response.status);
    console.log("📨 Edge Function Response:", result);
    
    if (response.ok) {
      console.log("✅ SUCCESS! Edge Function test passed!");
    } else {
      console.log("❌ FAILURE: Edge Function test failed");
      console.log("🔍 Error:", result.error);
      console.log("🔍 Debug:", result.debug);
    }
  } catch (error) {
    console.error("❌ Edge Function Error:", error);
  }

  console.log("\n🎯 Test Summary:");
  console.log("=================");
  console.log("1. If both tests pass → Integration is working!");
  console.log("2. If only direct API passes → Edge Function issue");
  console.log("3. If both fail → Credentials or network issue");
  console.log("4. Check Supabase Edge Function logs for detailed errors");
})();

