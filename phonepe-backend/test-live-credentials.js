const crypto = require('crypto');
const fetch = require('node-fetch').default;

// Test with your live credentials
const PHONEPE_CONFIG = {
  merchantId: 'M23XRS3XN3QMF', // Your live merchant ID
  apiKey: '713219fb-38d0-468d-8268-8b15955468b0', // Your live API key
  saltIndex: '1',
  baseUrl: 'https://api.phonepe.com/apis/hermes' // Correct production endpoint
};

function generateXVerify(payload, endpoint, saltKey, saltIndex) {
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${saltIndex}`;
}

async function testPhonePeLive() {
  try {
    console.log('🧪 Testing PhonePe Live API...');
    console.log('Configuration:', PHONEPE_CONFIG);

    // Create test payload
    const payload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: 'TEST_ORDER_' + Date.now(),
      merchantUserId: 'test_user_123',
      amount: 100,
      redirectUrl: 'http://localhost:8080/payment/success',
      redirectMode: 'REDIRECT',
      callbackUrl: 'http://localhost:5000/api/phonepe/callback',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Encode payload to Base64
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY signature
    const xVerify = generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_CONFIG.apiKey, PHONEPE_CONFIG.saltIndex);

    console.log('🔐 X-VERIFY:', xVerify.substring(0, 30) + '...');

    // Call PhonePe API
    const response = await fetch(`${PHONEPE_CONFIG.baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const data = await response.json();
    console.log('📨 PhonePe Response Status:', response.status);
    console.log('📨 PhonePe Response:', JSON.stringify(data, null, 2));

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      console.log('✅ Payment created successfully!');
      console.log('Redirect URL:', data.data.instrumentResponse.redirectInfo.url);
    } else {
      console.log('❌ Payment creation failed:', data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPhonePeLive();
