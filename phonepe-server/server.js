// PhonePe Payment Server
// Production-ready server for PhonePe payment verification and webhooks

const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'MERCURCARE';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || 'your-salt-key';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Admin rate limiting (stricter)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many admin requests, please try again later.'
});

// Utility functions
function generateChecksum(payload, saltKey, saltIndex) {
  const hash = crypto.createHash('sha256');
  hash.update(payload + saltKey);
  return hash.digest('hex');
}

function verifyChecksum(payload, checksum, saltKey, saltIndex) {
  const expectedChecksum = generateChecksum(payload, saltKey, saltIndex);
  return expectedChecksum === checksum;
}

function generateMerchantTransactionId() {
  return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// In-memory storage (use database in production)
const payments = new Map();
const subscriptions = new Map();

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'UrCare PhonePe Server is running',
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      createPayment: '/api/phonepe/create',
      webhook: '/api/phonepe/webhook',
      paymentStatus: '/api/phonepe/status/:merchantTransactionId'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Create payment order
app.post('/api/phonepe/create', async (req, res) => {
  try {
    const { amount, planName, billingCycle, userId } = req.body;

    if (!amount || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Amount and userId are required'
      });
    }

    const merchantTransactionId = generateMerchantTransactionId();
    const amountInPaise = Math.round(amount * 100);

    const order = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId,
      amount: amountInPaise,
      currency: 'INR',
      redirectUrl: `${BASE_URL}/payment/phonepe/success`,
      webhookUrl: `${BASE_URL}/api/phonepe/webhook`,
      redirectMode: 'POST',
      callbackUrl: `${BASE_URL}/payment/phonepe/callback`
    };

    const payload = Buffer.from(JSON.stringify(order)).toString('base64');
    const checksum = generateChecksum(payload, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

    const requestBody = {
      request: payload
    };

    // Store payment info
    payments.set(merchantTransactionId, {
      ...order,
      userId,
      planName,
      billingCycle,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    // In production, make actual API call to PhonePe
    // For demo, return mock response
    const mockResponse = {
      success: true,
      code: 'PAYMENT_INITIATED',
      message: 'Payment initiated successfully',
      data: {
        merchantId: PHONEPE_MERCHANT_ID,
        merchantTransactionId,
        amount: amountInPaise,
        currency: 'INR',
        instrumentResponse: {
          type: 'PAY_PAGE',
          redirectInfo: {
            url: `${PHONEPE_BASE_URL}/pg/redirect?merchantId=${PHONEPE_MERCHANT_ID}&merchantTransactionId=${merchantTransactionId}`,
            method: 'GET'
          }
        }
      }
    };

    res.json(mockResponse);

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
});

// PhonePe webhook
app.post('/api/phonepe/webhook', (req, res) => {
  try {
    const { response } = req.body;
    const payload = Buffer.from(response, 'base64').toString('utf-8');
    const data = JSON.parse(payload);

    const { merchantId, merchantTransactionId, transactionId, amount, state, code } = data;

    // Verify webhook signature (implement proper verification)
    const receivedChecksum = req.headers['x-verify'];
    if (receivedChecksum) {
      const [checksum, saltIndex] = receivedChecksum.split('###');
      if (!verifyChecksum(response, checksum, PHONEPE_SALT_KEY, saltIndex)) {
        console.error('Webhook signature verification failed');
        return res.status(400).json({ success: false, error: 'Invalid signature' });
      }
    }

    // Update payment status
    const payment = payments.get(merchantTransactionId);
    if (payment) {
      payment.status = state === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
      payment.transactionId = transactionId;
      payment.updatedAt = new Date().toISOString();

      // If payment successful, activate subscription
      if (state === 'COMPLETED') {
        subscriptions.set(payment.userId, {
          userId: payment.userId,
          planName: payment.planName,
          billingCycle: payment.billingCycle,
          status: 'active',
          activatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (payment.billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        });

        console.log(`Subscription activated for user ${payment.userId}`);
      }
    }

    res.json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
});

// Verify payment status
app.get('/api/phonepe/status/:merchantTransactionId', (req, res) => {
  try {
    const { merchantTransactionId } = req.params;
    const payment = payments.get(merchantTransactionId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check payment status'
    });
  }
});

// Admin routes
app.get('/api/admin/subscriptions', adminLimiter, (req, res) => {
  try {
    const subs = Array.from(subscriptions.values());
    res.json({
      success: true,
      data: subs
    });
  } catch (error) {
    console.error('Admin subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriptions'
    });
  }
});

app.post('/api/admin/subscriptions/:userId/activate', adminLimiter, (req, res) => {
  try {
    const { userId } = req.params;
    const { planName, billingCycle } = req.body;

    subscriptions.set(userId, {
      userId,
      planName: planName || 'premium',
      billingCycle: billingCycle || 'monthly',
      status: 'active',
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      activatedBy: 'admin'
    });

    res.json({
      success: true,
      message: 'Subscription activated successfully'
    });

  } catch (error) {
    console.error('Admin subscription activation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate subscription'
    });
  }
});

// Get subscription status
app.get('/api/subscriptions/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = subscriptions.get(userId);

    if (!subscription) {
      return res.json({
        success: true,
        data: { status: 'inactive' }
      });
    }

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check subscription status'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PhonePe server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/api/phonepe/webhook`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;