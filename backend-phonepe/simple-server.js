const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

// PhonePe Configuration
const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || 'M23XRS3XN3QMF',
  apiKey: process.env.PHONEPE_API_KEY || '713219fb-38d0-468d-8268-8b15955468b0',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  environment: process.env.PHONEPE_ENVIRONMENT || 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  backendCallbackUrl: process.env.BACKEND_CALLBACK_URL || 'http://localhost:5000/api/phonepe/callback'
};

console.log('🔧 PhonePe Configuration:', {
  merchantId: PHONEPE_CONFIG.merchantId,
  environment: PHONEPE_CONFIG.environment,
  saltIndex: PHONEPE_CONFIG.saltIndex,
  frontendUrl: PHONEPE_CONFIG.frontendUrl
});

// Initialize PhonePe SDK
let StandardCheckoutClient = null;
let phonepe = null;

async function initializePhonePe() {
  try {
    console.log('🔄 Initializing PhonePe SDK...');
    
    // Load PhonePe SDK
    const phonepeModule = require('phonepe-pg-sdk-node');
    console.log('📦 PhonePe module loaded');

    // Get StandardCheckoutClient
    StandardCheckoutClient = phonepeModule.StandardCheckoutClient;

    if (!StandardCheckoutClient) {
      throw new Error('StandardCheckoutClient not found in module');
    }

    console.log('🔍 StandardCheckoutClient found:', typeof StandardCheckoutClient);

    // Initialize PhonePe SDK with correct environment value
    const environment = PHONEPE_CONFIG.environment === 'production' ? 'PRODUCTION' : 'SANDBOX';
    
    phonepe = new StandardCheckoutClient({
      merchantId: PHONEPE_CONFIG.merchantId,
      saltKey: PHONEPE_CONFIG.apiKey,
      saltIndex: parseInt(PHONEPE_CONFIG.saltIndex),
      environment: environment
    });

    console.log('✅ PhonePe SDK initialized successfully');
    return true;

  } catch (error) {
    console.error('❌ Failed to initialize PhonePe SDK:', error);
    console.error('Error details:', error.stack);
    return false;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PhonePe SDK Backend is running',
    timestamp: new Date().toISOString(),
    config: {
      merchantId: PHONEPE_CONFIG.merchantId,
      environment: PHONEPE_CONFIG.environment,
      saltIndex: PHONEPE_CONFIG.saltIndex,
      frontendUrl: PHONEPE_CONFIG.frontendUrl,
      sdkInitialized: !!phonepe
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

    // Initialize SDK if not already done
    if (!phonepe) {
      const initialized = await initializePhonePe();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Failed to initialize PhonePe SDK'
        });
      }
    }

    // Create payment request payload for PhonePe SDK
    const paymentRequest = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: Number(amount),
      redirectUrl: `${PHONEPE_CONFIG.frontendUrl}/payment/success?orderId=${orderId}&plan=${planSlug || 'basic'}&cycle=${billingCycle || 'annual'}`,
      redirectMode: 'REDIRECT',
      callbackUrl: PHONEPE_CONFIG.backendCallbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('📤 PhonePe Payment Request:', JSON.stringify(paymentRequest, null, 2));

    // Create payment using SDK
    const response = await phonepe.pay(paymentRequest);

    console.log('📨 PhonePe SDK Response:', JSON.stringify(response, null, 2));

    if (response.success && response.data?.instrumentResponse?.redirectInfo?.url) {
      console.log('✅ Payment created successfully:', response);
      res.json({
        success: true,
        redirectUrl: response.data.instrumentResponse.redirectInfo.url,
        orderId: orderId,
        transactionId: orderId,
        merchantId: PHONEPE_CONFIG.merchantId,
        amount: Number(amount),
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual'
      });
    } else {
      console.error('❌ Payment creation failed:', response);
      res.status(400).json({
        success: false,
        error: response.message || 'Payment initiation failed',
        data: response
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

    // Initialize SDK if not already done
    if (!phonepe) {
      const initialized = await initializePhonePe();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Failed to initialize PhonePe SDK'
        });
      }
    }

    // Check status using SDK
    const response = await phonepe.getOrderStatus({
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: transactionId
    });

    console.log('📨 PhonePe Status Response:', JSON.stringify(response, null, 2));

    if (response) {
      console.log('✅ Status checked successfully:', response);
      res.json({
        success: true,
        data: response
      });
    } else {
      console.error('❌ Status check failed:', response);
      res.status(400).json({
        success: false,
        error: 'Status check failed',
        data: response
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

// Payment callback endpoint
app.post('/api/phonepe/callback', async (req, res) => {
  try {
    console.log('📥 PhonePe Callback:', req.body);
    
    // Initialize SDK if not already done
    if (!phonepe) {
      const initialized = await initializePhonePe();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Failed to initialize PhonePe SDK'
        });
      }
    }

    // Verify callback using SDK
    const response = await phonepe.validateCallback(req.body);

    console.log('📨 PhonePe Verification Response:', JSON.stringify(response, null, 2));

    if (response) {
      console.log('✅ Callback verified successfully:', response);
      res.json({
        success: true,
        data: response
      });
    } else {
      console.error('❌ Callback verification failed:', response);
      res.status(400).json({
        success: false,
        error: 'Callback verification failed',
        data: response
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PhonePe SDK Backend running on port ${PORT}`);
  console.log(`🔧 Configuration:`, PHONEPE_CONFIG);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/phonepe/pay`);
  console.log(`🔍 Status endpoint: http://localhost:${PORT}/api/phonepe/status`);
  console.log(`📞 Callback endpoint: http://localhost:${PORT}/api/phonepe/callback`);
});
