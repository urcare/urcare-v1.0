// Verify PhonePe Live Credentials
// Run this in browser console to test your credentials

(async () => {
  console.log("🔑 Testing PhonePe Live Credentials...");
  
  const MERCHANT_ID = "M23XRS3XN3QMF";
  const API_KEY = "713219fb-38d0-468d-8268-8b15955468b0";
  const SALT_INDEX = "1";
  const BASE_URL = "https://api.phonepe.com/apis/hermes"; // Production URL

  const orderId = `TEST_ORDER_${Date.now()}`;
  const amount = 100; // 1 Rupee in paise
  const userId = "test_user_123";
  const redirectUrl = "http://localhost:8081/payment/success";
  const callbackUrl = "http://localhost:8081/api/phonepe/callback";

  const payload = {
    merchantId: MERCHANT_ID,
    transactionId: orderId,
    merchantUserId: userId,
    amount: amount,
    redirectUrl: redirectUrl,
    callbackUrl: callbackUrl,
    paymentInstrument: { type: "PAY_PAGE" }
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = btoa(payloadString);

  const endpoint = "/pg/v1/pay";
  const checksumString = base64Payload + endpoint + API_KEY;

  // Generate SHA256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(checksumString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const xVerify = `${hashHex}###${SALT_INDEX}`;

  console.log("📦 Test Payload:", payload);
  console.log("🔐 X-VERIFY:", xVerify.substring(0, 30) + "...");
  console.log("🌐 API URL:", `${BASE_URL}${endpoint}`);

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
      console.log("✅ SUCCESS! Your credentials are working!");
      console.log("🔗 Redirect URL:", result.data.instrumentResponse.redirectInfo.url);
    } else {
      console.log("❌ FAILURE:", result.message || "Payment initiation failed");
      console.log("🔍 Error Code:", result.code);
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }
})();

