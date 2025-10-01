const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// For now, let's use a simple implementation without the TypeScript service
// We'll implement the PhonePe SDK directly in this file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

// Initialize PhonePe service
const phonepeConfig = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || 'M23XRS3XN3QMF',
  apiKey: process.env.PHONEPE_API_KEY || '713219fb-38d0-468d-8268-8b15955468b0',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  environment: process.env.PHONEPE_ENVIRONMENT || 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8081',
  backendCallbackUrl: process.env.BACKEND_CALLBACK_URL || 'http://localhost:5000/api/phonepe/callback'
};

const phonepeService = createPhonePeService(phonepeConfig);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PhonePe SDK Backend is running',
    timestamp: new Date().toISOString(),
    config: phonepeService.getConfig()
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

    // Create payment using PhonePe SDK
    const result = await phonepeService.createPaymentOrder({
      orderId,
      amount: Number(amount),
      userId,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual'
    });

    if (result.success) {
      console.log('✅ Payment created successfully:', result);
      res.json(result);
    } else {
      console.error('❌ Payment creation failed:', result.error);
      res.status(400).json(result);
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

    // Check status using PhonePe SDK
    const result = await phonepeService.checkPaymentStatus(transactionId);

    if (result.success) {
      console.log('✅ Status checked successfully:', result);
      res.json(result);
    } else {
      console.error('❌ Status check failed:', result.error);
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Payment callback endpoint
app.post('/api/phonepe/callback', async (req, res) => {
  try {
    console.log('📥 PhonePe Callback:', req.body);
    
    // Verify callback using PhonePe SDK
    const result = await phonepeService.verifyPaymentCallback(req.body);

    if (result.success) {
      console.log('✅ Callback verified successfully:', result);
      res.json(result);
    } else {
      console.error('❌ Callback verification failed:', result.error);
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PhonePe SDK Backend running on port ${PORT}`);
  console.log(`🔧 Configuration:`, phonepeService.getConfig());
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/phonepe/pay`);
  console.log(`🔍 Status endpoint: http://localhost:${PORT}/api/phonepe/status`);
  console.log(`📞 Callback endpoint: http://localhost:${PORT}/api/phonepe/callback`);
});
