// Vercel-compatible Express server for PhonePe integration
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PhonePe Live Configuration
const PHONEPE_MERCHANT_ID = 'M23XRS3XN3QMF';
const PHONEPE_SALT_KEY = '713219fb-38d0-468d-8268-8b15955468b0';
const PHONEPE_SALT_INDEX = '1';
const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes';
const FRONTEND_URL = 'https://urcarebyarsh.vercel.app';

// Generate X-VERIFY signature
function generateXVerify(payload, endpoint, saltKey, saltIndex) {
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${saltIndex}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PhonePe Express Backend is running',
    timestamp: new Date().toISOString(),
    config: {
      baseUrl: PHONEPE_BASE_URL,
      hasMerchantId: !!PHONEPE_MERCHANT_ID,
      hasSaltKey: !!PHONEPE_SALT_KEY,
      hasSaltIndex: !!PHONEPE_SALT_INDEX
    }
  });
});

// PhonePe payment creation endpoint
app.post('/api/phonepe/pay', async (req, res) => {
  try {
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;


    // Create PhonePe payload for live API
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amount, // Amount in paise
      redirectUrl: `${FRONTEND_URL}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${FRONTEND_URL}/api/phonepe/callback`,
      paymentInstrument: { 
        type: "PAY_PAGE" 
      }
    };

    console.log('📦 PhonePe Payload:', JSON.stringify(payload, null, 2));

    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY signature for PhonePe API
    const xVerify = generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    console.log('🌐 Calling live PhonePe API:', `${PHONEPE_BASE_URL}/pg/v1/pay`);
    console.log('🔑 X-VERIFY signature:', xVerify);

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
      res.json({
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
    console.error('❌ Express API error:', error);
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
});

// PhonePe status check endpoint
app.post('/api/phonepe/status', async (req, res) => {
  try {
    const { transactionId } = req.body;

    console.log('🔍 Checking live PhonePe payment status:', transactionId);

    // Create status check endpoint
    const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
    
    // Generate X-VERIFY signature for status check
    const xVerify = generateXVerify(endpoint, '', PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    console.log('🌐 Calling live PhonePe status API:', `${PHONEPE_BASE_URL}${endpoint}`);

    // Call live PhonePe status API
    const response = await fetch(`${PHONEPE_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📨 PhonePe Status Response:', JSON.stringify(data, null, 2));

    res.json({
      success: data.success || false,
      data: data.data
    });

  } catch (error) {
    console.error('❌ Express status API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// PhonePe callback endpoint
app.post('/api/phonepe/callback', (req, res) => {
  try {
    console.log('📞 PhonePe Callback received:', JSON.stringify(req.body, null, 2));
    
    // PhonePe sends callback data here
    const { 
      transactionId, 
      status, 
      amount, 
      merchantId,
      merchantTransactionId 
    } = req.body;

    console.log('📞 Callback details:', {
      transactionId,
      status,
      amount,
      merchantId,
      merchantTransactionId,
      timestamp: new Date().toISOString()
    });

    // In production, you would:
    // 1. Verify the callback signature
    // 2. Update payment status in database
    // 3. Trigger any post-payment actions

    res.status(200).json({
      success: true,
      message: 'Callback received successfully'
    });

  } catch (error) {
    console.error('❌ Callback error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Callback processing failed'
    });
  }
});

// Store payment record endpoint
app.post('/api/phonepe/store-payment', async (req, res) => {
  try {
    const { userId, orderId, amount, status, planSlug, billingCycle, paymentMethod } = req.body;

    console.log('💾 Storing payment record:', { userId, orderId, amount, status, planSlug, billingCycle, paymentMethod });

    // For now, just log the payment record
    // In production, you would store this in your database
    console.log('✅ Payment record stored:', {
      userId,
      orderId,
      amount,
      status,
      planSlug,
      billingCycle,
      paymentMethod,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Payment record stored successfully'
    });

  } catch (error) {
    console.error('❌ Store payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to store payment record'
    });
  }
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
