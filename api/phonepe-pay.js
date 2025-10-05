// Vercel API route for PhonePe payment creation
const crypto = require('crypto');

// PhonePe UAT Test Configuration
const PHONEPE_MERCHANT_ID = 'PHONEPEPGUAT';
const PHONEPE_SALT_KEY = 'c817ffaf-8471-48b5-a7e2-a27e5b7efbd3';
const PHONEPE_SALT_INDEX = '1';
const PHONEPE_BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const FRONTEND_URL = 'https://urcarebyarsh.vercel.app';

// Generate X-VERIFY signature
function generateXVerify(payload, endpoint, saltKey, saltIndex) {
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${saltIndex}`;
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;

    console.log('🚀 Creating live PhonePe payment:', { orderId, amount, userId, planSlug, billingCycle });

    if (!orderId || !amount || !userId) {
      return res.status(400).json({ success: false, error: 'Missing required fields: orderId, amount, userId' });
    }

    // Create PhonePe API payload (correct structure)
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      amount: amount, // Amount in paise
      merchantUserId: userId,
      redirectUrl: `${FRONTEND_URL}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${FRONTEND_URL}/api/phonepe-callback`,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    console.log('📦 PhonePe Payload:', JSON.stringify(payload, null, 2));

    // Convert payload to base64
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY signature
    const xVerify = generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    console.log('🌐 Calling live PhonePe API:', `${PHONEPE_BASE_URL}/pg/v1/pay`);
    console.log('🔑 X-VERIFY signature:', xVerify);
    console.log('📦 Base64 payload:', base64Payload);
    console.log('📦 Request body:', JSON.stringify({ request: base64Payload }));

    // Call live PhonePe API
    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const data = await response.json();
    console.log('📨 PhonePe API Response:', JSON.stringify(data, null, 2));

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      console.log('✅ Live PhonePe payment successful, redirect URL:', data.data.instrumentResponse.redirectInfo.url);
      res.status(200).json({
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        orderId: orderId,
        transactionId: orderId,
        merchantId: PHONEPE_MERCHANT_ID,
        amount: amount,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual'
      });
    } else {
      console.error('❌ Live PhonePe payment failed:', data);
      console.error('❌ Response status:', response.status);
      console.error('❌ Response headers:', response.headers);
      
      res.status(400).json({
        success: false,
        error: data.message || 'Live PhonePe payment initiation failed',
        code: data.code,
        data: data,
        debug: {
          responseStatus: response.status,
          responseStatusText: response.statusText,
          hasData: !!data.data,
          hasInstrumentResponse: !!data.data?.instrumentResponse,
          hasRedirectInfo: !!data.data?.instrumentResponse?.redirectInfo,
          hasUrl: !!data.data?.instrumentResponse?.redirectInfo?.url,
          merchantId: PHONEPE_MERCHANT_ID,
          baseUrl: PHONEPE_BASE_URL,
          endpoint: '/pg/v1/pay'
        }
      });
    }

  } catch (error) {
    console.error('❌ API error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error name:', error.name);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      debug: {
        errorName: error.name,
        errorMessage: error.message,
        merchantId: PHONEPE_MERCHANT_ID,
        baseUrl: PHONEPE_BASE_URL,
        endpoint: '/pg/v1/pay'
      }
    });
  }
}
