const express = require('express');
const cors = require('cors');
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
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  backendCallbackUrl: process.env.BACKEND_CALLBACK_URL || 'http://localhost:5000/api/phonepe/callback'
};

console.log('🔧 PhonePe Mock Configuration:', {
  merchantId: PHONEPE_CONFIG.merchantId,
  frontendUrl: PHONEPE_CONFIG.frontendUrl
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PhonePe Mock Backend is running',
    timestamp: new Date().toISOString(),
    config: {
      merchantId: PHONEPE_CONFIG.merchantId,
      frontendUrl: PHONEPE_CONFIG.frontendUrl
    }
  });
});

// Create payment order (Mock implementation)
app.post('/api/phonepe/pay', async (req, res) => {
  try {
    console.log('📥 PhonePe Mock Payment Request:', req.body);
    
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

    // Mock PhonePe payment creation
    console.log('🎭 Creating mock PhonePe payment...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock redirect URL - redirect to your success page for testing
    const mockRedirectUrl = `${PHONEPE_CONFIG.frontendUrl}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}&mock=true`;
    
    console.log('✅ Mock payment created successfully');
    console.log('🔗 Mock redirect URL:', mockRedirectUrl);

    res.json({
      success: true,
      redirectUrl: mockRedirectUrl,
      orderId: orderId,
      transactionId: orderId,
      merchantId: PHONEPE_CONFIG.merchantId,
      amount: amountInPaise,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual'
    });

  } catch (error) {
    console.error('❌ Mock Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Check payment status (Mock implementation)
app.post('/api/phonepe/status', async (req, res) => {
  try {
    console.log('📥 PhonePe Mock Status Request:', req.body);
    
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: transactionId'
      });
    }

    // Mock status check
    console.log('🎭 Checking mock payment status...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful payment status
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

    console.log('✅ Mock status check completed');

    res.json({
      success: true,
      data: mockStatus
    });

  } catch (error) {
    console.error('❌ Mock Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Payment callback endpoint
app.post('/api/phonepe/callback', (req, res) => {
  try {
    console.log('📥 PhonePe Mock Callback:', req.body);
    
    // Process callback data
    const callbackData = req.body;
    
    console.log('✅ Mock callback processed successfully');
    res.json({
      success: true,
      message: 'Mock callback processed successfully'
    });

  } catch (error) {
    console.error('❌ Mock Callback Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PhonePe Mock Backend running on port ${PORT}`);
  console.log(`🔧 Configuration:`, PHONEPE_CONFIG);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/phonepe/pay`);
  console.log(`🔍 Status endpoint: http://localhost:${PORT}/api/phonepe/status`);
  console.log(`📞 Callback endpoint: http://localhost:${PORT}/api/phonepe/callback`);
  console.log(`\n🎭 This is a MOCK implementation for testing purposes.`);
  console.log(`🔗 To use real PhonePe, configure your credentials and replace this with the real implementation.`);
});
