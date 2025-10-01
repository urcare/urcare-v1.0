const crypto = require('crypto');
const fetch = require('node-fetch').default;

// Simple test with minimal payload
async function testSimple() {
  try {
    console.log('🧪 Simple PhonePe Test...');

    const merchantId = 'M23XRS3XN3QMF';
    const apiKey = '713219fb-38d0-468d-8268-8b15955468b0';
    const saltIndex = '1';
    const baseUrl = 'https://api.phonepe.com/apis/hermes';

    // Minimal payload
    const payload = {
      merchantId: merchantId,
      merchantTransactionId: 'TEST_' + Date.now(),
      merchantUserId: 'user123',
      amount: 100,
      redirectUrl: 'https://example.com/success',
      redirectMode: 'REDIRECT',
      callbackUrl: 'https://example.com/callback',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Encode to Base64
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY
    const stringToHash = `${base64Payload}/pg/v1/pay${apiKey}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${hash}###${saltIndex}`;

    console.log('🔐 X-VERIFY:', xVerify.substring(0, 30) + '...');

    // Make request
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
    console.log('📨 Response Status:', response.status);
    console.log('📨 Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSimple();
