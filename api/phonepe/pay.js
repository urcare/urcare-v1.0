// Vercel API route for PhonePe payment creation
export default async function handler(req, res) {
  console.log('📥 Vercel API received request:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('📤 Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    res.status(405).json({ 
      error: 'Method not allowed',
      receivedMethod: req.method,
      expectedMethod: 'POST'
    });
    return;
  }

  try {
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;

    console.log('📥 Vercel API processing payment request:', { orderId, amount, userId, planSlug, billingCycle });

    // PhonePe live credentials
    const PHONEPE_MERCHANT_ID = 'M23XRS3XN3QMF';
    const PHONEPE_SALT_KEY = '713219fb-38d0-468d-8268-8b15955468b0';
    const PHONEPE_SALT_INDEX = '1';
    const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes';

    console.log('🚀 Creating live PhonePe payment via Vercel API:', { orderId, amount, userId });

    // Create PhonePe payload
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amount,
      redirectUrl: `${req.headers.origin || 'https://urcare.vercel.app'}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${req.headers.origin || 'https://urcare.vercel.app'}/api/phonepe/callback`,
      paymentInstrument: { 
        type: "PAY_PAGE" 
      }
    };

    console.log('📦 Live PhonePe Payload:', JSON.stringify(payload, null, 2));

    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY signature
    const crypto = require('crypto');
    const stringToHash = `${base64Payload}/pg/v1/pay${PHONEPE_SALT_KEY}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${hash}###${PHONEPE_SALT_INDEX}`;

    console.log('🌐 Calling live PhonePe API:', `${PHONEPE_BASE_URL}/pg/v1/pay`);

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
    console.log('📨 Live PhonePe API Response:', JSON.stringify(data, null, 2));

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
      
      // Return detailed error information
      res.status(400).json({
        success: false,
        error: data.message || 'Live PhonePe payment initiation failed',
        code: data.code,
        data: data,
        debug: {
          responseStatus: response.status,
          hasData: !!data.data,
          hasInstrumentResponse: !!data.data?.instrumentResponse,
          hasRedirectInfo: !!data.data?.instrumentResponse?.redirectInfo,
          hasUrl: !!data.data?.instrumentResponse?.redirectInfo?.url
        }
      });
    }

  } catch (error) {
    console.error('❌ Vercel API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
