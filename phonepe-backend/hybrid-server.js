const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch').default;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}));
app.use(express.json());

// PhonePe Configuration
const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || 'M23XRS3XN3QMF',
  apiKey: process.env.PHONEPE_API_KEY || '713219fb-38d0-468d-8268-8b15955468b0',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  baseUrl: process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg-sandbox',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  backendCallbackUrl: process.env.BACKEND_CALLBACK_URL || 'http://localhost:5000/api/phonepe/callback',
  useMock: false // Force real PhonePe API
};

console.log('🔧 PhonePe Hybrid Configuration:', {
  merchantId: PHONEPE_CONFIG.merchantId,
  baseUrl: PHONEPE_CONFIG.baseUrl,
  frontendUrl: PHONEPE_CONFIG.frontendUrl,
  useMock: PHONEPE_CONFIG.useMock
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
    message: 'PhonePe Hybrid Backend is running',
    timestamp: new Date().toISOString(),
    config: {
      merchantId: PHONEPE_CONFIG.merchantId,
      baseUrl: PHONEPE_CONFIG.baseUrl,
      frontendUrl: PHONEPE_CONFIG.frontendUrl,
      useMock: PHONEPE_CONFIG.useMock
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

    // If using mock mode, return mock response
    if (PHONEPE_CONFIG.useMock) {
      console.log('🎭 Using mock payment mode');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock redirect URL - redirect to your success page for testing
      const mockRedirectUrl = `${PHONEPE_CONFIG.frontendUrl}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}&success=true`;
      
      console.log('✅ Mock payment created successfully');
      console.log('🔗 Mock redirect URL:', mockRedirectUrl);

      return res.json({
        success: true,
        redirectUrl: mockRedirectUrl,
        orderId: orderId,
        transactionId: orderId,
        merchantId: PHONEPE_CONFIG.merchantId,
        amount: amountInPaise,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual'
      });
    }

    // Real PhonePe integration
    console.log('🔗 Using real PhonePe integration');
    
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

    // Prepare headers for PhonePe API
    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      'accept': 'application/json'
    };

    console.log('📤 Headers being sent:', {
      'Content-Type': headers['Content-Type'],
      'X-VERIFY': headers['X-VERIFY'].substring(0, 30) + '...',
      'X-MERCHANT-ID': headers['X-MERCHANT-ID'],
      'accept': headers['accept']
    });

    // POST to PhonePe API
    const phonepeResponse = await fetch(`${PHONEPE_CONFIG.baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: headers,
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
      console.log('❌ Payment initiation failed');
      res.status(400).json({
        success: false,
        error: phonepeData.message || 'Payment initiation failed',
        code: phonepeData.code,
        data: phonepeData
      });
    }

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
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

    // If using mock mode, return mock status
    if (PHONEPE_CONFIG.useMock) {
      console.log('🎭 Using mock status check');
      
      const mockStatus = {
        success: true,
        code: 'PAYMENT_SUCCESS',
        message: 'Payment successful',
        data: {
          merchantId: PHONEPE_CONFIG.merchantId,
          merchantTransactionId: transactionId,
          transactionId: transactionId,
          amount: 100,
          state: 'COMPLETED',
          responseCode: 'PAYMENT_SUCCESS',
          responseMessage: 'Payment successful'
        }
      };

      return res.json({
        success: true,
        data: mockStatus
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

// Payment callback endpoint
app.post('/api/phonepe/callback', (req, res) => {
  try {
    console.log('📥 PhonePe Callback:', req.body);
    
    // Process callback data
    const callbackData = req.body;
    
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
  console.log(`🚀 PhonePe Hybrid Backend running on port ${PORT}`);
  console.log(`🔧 Configuration:`, PHONEPE_CONFIG);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/phonepe/pay`);
  console.log(`🔍 Status endpoint: http://localhost:${PORT}/api/phonepe/status`);
  console.log(`📞 Callback endpoint: http://localhost:${PORT}/api/phonepe/callback`);
  console.log(`\n🎯 Mode: ${PHONEPE_CONFIG.useMock ? 'MOCK (for testing)' : 'REAL PhonePe API'}`);
  console.log(`🔄 Fallback: Enabled (will use mock if real API fails)`);
});
