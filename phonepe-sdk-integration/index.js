import express from 'express';
import cors from 'cors';
import PhonePeService from './phonepe-service.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize PhonePe Service
const phonepeService = new PhonePeService();

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PhonePe SDK Integration Server is running',
    timestamp: new Date().toISOString(),
    config: phonepeService.getConfig()
  });
});

// Create Payment Order
app.post('/api/phonepe/create-order', async (req, res) => {
  try {
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;

    console.log('📥 Create Order Request:', { orderId, amount, userId, planSlug, billingCycle });

    const result = await phonepeService.createPaymentOrder({
      orderId,
      amount,
      userId,
      planSlug,
      billingCycle
    });

    res.json(result);

  } catch (error) {
    console.error('❌ Create Order Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Check Payment Status
app.get('/api/phonepe/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    console.log('📥 Status Check Request:', transactionId);

    const result = await phonepeService.checkPaymentStatus(transactionId);

    res.json(result);

  } catch (error) {
    console.error('❌ Status Check Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PhonePe Callback Handler
app.post('/api/phonepe/callback', async (req, res) => {
  try {
    const callbackData = req.body;

    console.log('📥 PhonePe Callback:', callbackData);

    const result = await phonepeService.verifyPaymentCallback(callbackData);

    res.json(result);

  } catch (error) {
    console.error('❌ Callback Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PhonePe SDK Integration Server running on port ${PORT}`);
  console.log(`🔧 Configuration:`, phonepeService.getConfig());
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/phonepe/create-order - Create payment order`);
  console.log(`   GET  /api/phonepe/status/:transactionId - Check payment status`);
  console.log(`   POST /api/phonepe/callback - PhonePe callback handler`);
});

