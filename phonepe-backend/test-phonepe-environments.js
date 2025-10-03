const crypto = require('crypto');
const fetch = require('node-fetch').default;

// Your live credentials
const credentials = {
  merchantId: 'M23XRS3XN3QMF',
  apiKey: '713219fb-38d0-468d-8268-8b15955468b0',
  saltIndex: '1'
};

// Test different PhonePe environments
const environments = [
  {
    name: 'Production (hermes)',
    baseUrl: 'https://api.phonepe.com/apis/hermes'
  },
  {
    name: 'Production (pg-sandbox)',
    baseUrl: 'https://api.phonepe.com/apis/pg-sandbox'
  },
  {
    name: 'UAT (preprod)',
    baseUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox'
  }
];

function generateXVerify(payload, endpoint, saltKey, saltIndex) {
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${saltIndex}`;
}

async function testEnvironment(env) {
  try {
    console.log(`\n🧪 Testing ${env.name}...`);
    console.log(`🌐 URL: ${env.baseUrl}`);

    // Create test payload
    const payload = {
      merchantId: credentials.merchantId,
      merchantTransactionId: 'TEST_' + Date.now(),
      merchantUserId: 'test_user_123',
      amount: 100,
      redirectUrl: 'https://example.com/success',
      redirectMode: 'REDIRECT',
      callbackUrl: 'https://example.com/callback',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Encode to Base64
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY
    const stringToHash = `${base64Payload}/pg/v1/pay${credentials.apiKey}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${hash}###${credentials.saltIndex}`;

    console.log(`🔐 X-VERIFY: ${xVerify.substring(0, 30)}...`);

    // Make request
    const response = await fetch(`${env.baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': credentials.merchantId,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const data = await response.json();
    console.log(`📨 Status: ${response.status}`);
    console.log(`📨 Response:`, JSON.stringify(data, null, 2));

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      console.log(`✅ SUCCESS! ${env.name} works with your credentials`);
      console.log(`🔗 Redirect URL: ${data.data.instrumentResponse.redirectInfo.url}`);
      return true;
    } else {
      console.log(`❌ ${env.name} failed: ${data.message || data.code || 'Unknown error'}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ ${env.name} error:`, error.message);
    return false;
  }
}

async function testAllEnvironments() {
  console.log('🔍 Testing PhonePe environments with your live credentials...');
  console.log(`📋 Merchant ID: ${credentials.merchantId}`);
  console.log(`🔑 API Key: ${credentials.apiKey.substring(0, 8)}...`);
  console.log(`🔢 Salt Index: ${credentials.saltIndex}`);

  let workingEnv = null;

  for (const env of environments) {
    const works = await testEnvironment(env);
    if (works) {
      workingEnv = env;
      break;
    }
  }

  if (workingEnv) {
    console.log(`\n🎉 Found working environment: ${workingEnv.name}`);
    console.log(`🌐 Use this URL: ${workingEnv.baseUrl}`);
  } else {
    console.log(`\n❌ No working environment found. Your credentials might not be activated yet.`);
    console.log(`💡 Contact PhonePe support to activate your merchant account.`);
  }
}

testAllEnvironments();
