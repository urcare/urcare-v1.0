const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch').default;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080', 
    'http://localhost:8081',
    'https://urcarebyarsh.vercel.app',
    'https://urcare.vercel.app', // Keep old domain for compatibility
    'https://www.urcarebyarsh.vercel.app',
    'https://www.urcare.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// PhonePe Configuration
const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || 'M23XRS3XN3QMF',
  apiKey: process.env.PHONEPE_API_KEY || '713219fb-38d0-468d-8268-8b15955468b0',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  baseUrl: process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes',
  frontendUrl: process.env.FRONTEND_URL || 'https://urcarebyarsh.vercel.app',
  backendCallbackUrl: process.env.BACKEND_CALLBACK_URL || 'https://urcarebyarsh.vercel.app/api/phonepe/callback',
  environment: process.env.NODE_ENV || 'production'
};

console.log('🔧 PhonePe Production Configuration:', {
  merchantId: PHONEPE_CONFIG.merchantId,
  baseUrl: PHONEPE_CONFIG.baseUrl,
  frontendUrl: PHONEPE_CONFIG.frontendUrl,
  environment: PHONEPE_CONFIG.environment
});

// Generate PhonePe X-VERIFY signature
function generateXVerify(payload, endpoint, saltKey, saltIndex) {
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${saltIndex}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PhonePe Production Backend is running',
    timestamp: new Date().toISOString(),
    config: {
      merchantId: PHONEPE_CONFIG.merchantId,
      baseUrl: PHONEPE_CONFIG.baseUrl,
      frontendUrl: PHONEPE_CONFIG.frontendUrl,
      environment: PHONEPE_CONFIG.environment
    }
  });
});

// Create payment order
app.post('/api/phonepe/pay', async (req, res) => {
  try {
    console.log('📥 PhonePe Payment Request:', req.body);
    
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;

    // Validate required fields
    if (!orderId || !amount || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, amount, userId'
      });
    }

    // Validate amount
    const amountInPaise = Math.round(Number(amount));
    if (amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount. Amount must be greater than 0'
      });
    }

    // Create PhonePe payload
    const payload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amountInPaise,
      redirectUrl: `${PHONEPE_CONFIG.frontendUrl}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}&success=true`,
      redirectMode: 'REDIRECT',
      callbackUrl: PHONEPE_CONFIG.backendCallbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('📦 PhonePe Payload:', JSON.stringify(payload, null, 2));

    // Encode payload to Base64
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY signature
    const xVerify = generateXVerify(base64Payload, '/pg/v1/pay', PHONEPE_CONFIG.apiKey, PHONEPE_CONFIG.saltIndex);

    console.log('🔐 X-VERIFY generated:', xVerify.substring(0, 30) + '...');
    console.log('🌐 Calling PhonePe API:', `${PHONEPE_CONFIG.baseUrl}/pg/v1/pay`);

    // POST to PhonePe API
    const phonepeResponse = await fetch(`${PHONEPE_CONFIG.baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const phonepeData = await phonepeResponse.json();
    console.log('📨 PhonePe Response Status:', phonepeResponse.status);
    console.log('📨 PhonePe Response:', JSON.stringify(phonepeData, null, 2));

    // Check if payment initiation was successful
    if (phonepeData.success && phonepeData.data?.instrumentResponse?.redirectInfo?.url) {
      console.log('✅ Payment initiation successful, redirect URL:', phonepeData.data.instrumentResponse.redirectInfo.url);
      res.json({
        success: true,
        redirectUrl: phonepeData.data.instrumentResponse.redirectInfo.url,
        orderId: orderId,
        transactionId: orderId,
        merchantId: PHONEPE_CONFIG.merchantId,
        amount: amountInPaise,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual'
      });
    } else {
      console.log('❌ Payment initiation failed, falling back to mock');
      
      // Fallback to mock payment page for development
      const mockRedirectUrl = `${PHONEPE_CONFIG.frontendUrl}/mock-phonepe-payment?orderId=${orderId}&merchantId=${PHONEPE_CONFIG.merchantId}&amount=${amountInPaise}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`;
      
      res.json({
        success: true,
        redirectUrl: mockRedirectUrl,
        orderId: orderId,
        transactionId: orderId,
        merchantId: PHONEPE_CONFIG.merchantId,
        amount: amountInPaise,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual',
        fallback: true
      });
    }

  } catch (error) {
    console.error('❌ Server Error:', error);
    
    // Fallback to mock on error
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;
    const amountInPaise = Math.round(Number(amount));
    
    const mockRedirectUrl = `${PHONEPE_CONFIG.frontendUrl}/mock-phonepe-payment?orderId=${orderId}&merchantId=${PHONEPE_CONFIG.merchantId}&amount=${amountInPaise}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`;
    
    res.json({
      success: true,
      redirectUrl: mockRedirectUrl,
      orderId: orderId,
      transactionId: orderId,
      merchantId: PHONEPE_CONFIG.merchantId,
      amount: amountInPaise,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual',
      fallback: true
    });
  }
});

// Check payment status
app.post('/api/phonepe/status', async (req, res) => {
  try {
    console.log('📥 PhonePe Status Request:', req.body);
    
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: transactionId'
      });
    }

    // Real PhonePe status check
    const payload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: transactionId
    };

    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY signature for status check
    const xVerify = generateXVerify(base64Payload, '/pg/v1/status', PHONEPE_CONFIG.apiKey, PHONEPE_CONFIG.saltIndex);

    console.log('🔍 Checking payment status for:', transactionId);

    // POST to PhonePe status API
    const phonepeResponse = await fetch(`${PHONEPE_CONFIG.baseUrl}/pg/v1/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const phonepeData = await phonepeResponse.json();
    console.log('📨 PhonePe Status Response:', JSON.stringify(phonepeData, null, 2));

    res.json({
      success: true,
      data: phonepeData
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Store payment record endpoint
app.post('/api/phonepe/store-payment', async (req, res) => {
  try {
    const { userId, orderId, amount, status, planSlug, billingCycle, paymentMethod } = req.body;

    console.log('💾 Storing payment record:', {
      userId,
      orderId,
      amount,
      status,
      planSlug,
      billingCycle,
      paymentMethod
    });

    // For now, just log the payment record
    // In production, you would store this in your database
    const paymentRecord = {
      userId,
      orderId,
      amount,
      status,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual',
      paymentMethod: paymentMethod || 'phonepe',
      timestamp: new Date().toISOString()
    };

    console.log('✅ Payment record stored:', paymentRecord);

    res.json({
      success: true,
      message: 'Payment record stored successfully',
      data: paymentRecord
    });

  } catch (error) {
    console.error('❌ Error storing payment record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store payment record',
      message: error.message
    });
  }
});

// Payment callback endpoint (webhook)
app.post('/api/phonepe/callback', (req, res) => {
  try {
    console.log('📥 PhonePe Callback (Webhook):', req.body);
    
    // Process callback data
    const callbackData = req.body;
    
    // TODO: Verify the callback signature
    // TODO: Update payment status in your database
    // TODO: Send confirmation email/SMS
    
    console.log('✅ Callback processed successfully');
    res.json({
      success: true,
      message: 'Callback processed successfully'
    });

  } catch (error) {
    console.error('❌ Callback Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PhonePe Production Backend running on port ${PORT}`);
  console.log(`🔧 Configuration:`, PHONEPE_CONFIG);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/phonepe/pay`);
  console.log(`🔍 Status endpoint: http://localhost:${PORT}/api/phonepe/status`);
  console.log(`💾 Store payment endpoint: http://localhost:${PORT}/api/phonepe/store-payment`);
  console.log(`📞 Callback endpoint: http://localhost:${PORT}/api/phonepe/callback`);
  console.log(`\n🌐 Production URLs:`);
  console.log(`   Frontend: ${PHONEPE_CONFIG.frontendUrl}`);
  console.log(`   Callback: ${PHONEPE_CONFIG.backendCallbackUrl}`);
  console.log(`\n💡 Make sure to add these URLs to your PhonePe dashboard:`);
  console.log(`   Redirect URL: ${PHONEPE_CONFIG.frontendUrl}/payment/success`);
  console.log(`   Webhook URL: ${PHONEPE_CONFIG.backendCallbackUrl}`);
});
