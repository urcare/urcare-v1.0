// Simple test to verify PhonePe credentials
// Run this in browser console to test credentials

const testPhonePeCredentials = async () => {
  const merchantId = 'M23XRS3XN3QMF';
  const saltKey = '713219fb-38d0-468d-8268-8b15955468b0';
  const saltIndex = '1';
  const baseUrl = 'https://api.phonepe.com/apis/hermes';
  
  // Test payload
  const payload = {
    merchantId: merchantId,
    merchantTransactionId: 'TEST_' + Date.now(),
    merchantUserId: 'test-user',
    amount: 100, // ₹1 in paise
    redirectUrl: 'http://localhost:8081/payment/success',
    redirectMode: 'REDIRECT',
    callbackUrl: 'http://localhost:8081/api/phonepe/callback',
    paymentInstrument: { type: 'PAY_PAGE' }
  };
  
  console.log('Testing PhonePe credentials...');
  console.log('Payload:', payload);
  
  // Generate checksum
  const payloadString = JSON.stringify(payload);
  const base64Payload = btoa(payloadString);
  const checksumString = base64Payload + '/pg/v1/pay' + saltKey;
  
  // Simple SHA-256 hash (this is a basic implementation)
  const encoder = new TextEncoder();
  const data = encoder.encode(checksumString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const xVerify = hashHex + '###' + saltIndex;
  
  console.log('X-VERIFY:', xVerify.substring(0, 30) + '...');
  
  try {
    const response = await fetch(`${baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': merchantId,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });
    
    const data = await response.json();
    console.log('PhonePe Response:', data);
    
    if (data.success) {
      console.log('✅ Credentials work! Redirect URL:', data.data?.instrumentResponse?.redirectInfo?.url);
    } else {
      console.log('❌ Error:', data.code, data.message);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
};

// Run the test
testPhonePeCredentials();

