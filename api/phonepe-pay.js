// Vercel API route for PhonePe payment creation
const crypto = require('crypto');

// PhonePe Live Configuration
const PHONEPE_MERCHANT_ID = 'M23XRS3XN3QMF';
const PHONEPE_SALT_KEY = '713219fb-38d0-468d-8268-8b15955468b0';
const PHONEPE_SALT_INDEX = '1';
const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes';
const FRONTEND_URL = 'https://urcare.vercel.app';

// Generate X-VERIFY signature
function generateXVerify(payload, endpoint, saltKey, saltIndex) {
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${saltIndex}`;
}

export default async function handler(req, res) {
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

    // Create PhonePe v3 API payload for live payment
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      amount: amount, // Amount in paise
      merchantUserId: userId,
      callbackUrl: `${FRONTEND_URL}/api/phonepe-callback`,
      saltIndex: parseInt(PHONEPE_SALT_INDEX)
    };

    console.log('📦 PhonePe v3 Payload:', JSON.stringify(payload, null, 2));

    // Generate X-VERIFY signature for PhonePe v3 API
    const xVerify = generateXVerify(JSON.stringify(payload), '', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    console.log('🌐 Calling live PhonePe v3 API:', `${PHONEPE_BASE_URL}/v3/transaction/initiate`);
    console.log('🔑 X-VERIFY signature:', xVerify);

    // Call live PhonePe v3 API
    const response = await fetch(`${PHONEPE_BASE_URL}/v3/transaction/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('📨 PhonePe API Response:', JSON.stringify(data, null, 2));

    if (data.success && data.data?.paymentLink) {
      console.log('✅ Live PhonePe v3 payment successful, redirect URL:', data.data.paymentLink);
      res.status(200).json({
        success: true,
        redirectUrl: data.data.paymentLink,
        orderId: orderId,
        transactionId: orderId,
        merchantId: PHONEPE_MERCHANT_ID,
        amount: amount,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual'
      });
    } else {
      console.error('❌ Live PhonePe v3 payment failed:', data);
      console.error('❌ Response status:', response.status);
      console.error('❌ Response headers:', response.headers);
      
      res.status(400).json({
        success: false,
        error: data.message || 'Live PhonePe v3 payment initiation failed',
        code: data.code,
        data: data,
        debug: {
          responseStatus: response.status,
          responseStatusText: response.statusText,
          hasData: !!data.data,
          hasPaymentLink: !!data.data?.paymentLink,
          merchantId: PHONEPE_MERCHANT_ID,
          baseUrl: PHONEPE_BASE_URL,
          endpoint: '/v3/transaction/initiate'
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
