const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();
app.use(express.json());
app.use(cors());

// PhonePe Configuration - SANDBOX
const PHONEPE_HOST = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = "M23XRS3XN3QMF";
const SALT_KEY = "713219fb-38d0-468d-8268-8b15955468b0";
const SALT_INDEX = 1;

// Razorpay Configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_secret_key';

console.log('🔑 Razorpay Key ID:', RAZORPAY_KEY_ID ? 'Configured' : 'Not configured');
console.log('🔑 Razorpay Key Secret:', RAZORPAY_KEY_SECRET ? 'Configured' : 'Not configured');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

// Pre-configured Razorpay payment links
const RAZORPAY_PAYMENT_LINKS = {
  monthly: "https://razorpay.me/@urcare?amount=vy%2F7jJNxh9pvHsb2%2Bqs52w%3D%3D",
  yearly: "https://razorpay.me/@urcare?amount=6zcPuaHTrIB8Jllw5habFw%3D%3D"
};

// Create Payment API
app.post("/api/phonepe/pay", async (req, res) => {
  try {
    const { orderId, amount, userId } = req.body;
    
    console.log("Creating PhonePe payment:", { orderId, amount, userId });

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId || "MUID123",
      amount: amount, // amount in paise (₹100 = 10000)
      redirectUrl: "http://localhost:8080/phonecheckout/result",
      redirectMode: "POST",
      callbackUrl: "http://localhost:5000/api/phonepe/callback",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const checksum = crypto
      .createHash("sha256")
      .update(payloadBase64 + "/pg/v1/pay" + SALT_KEY)
      .digest("hex");
    const finalXVerify = checksum + "###" + SALT_INDEX;

    console.log("PhonePe request payload:", payload);
    console.log("Generated checksum:", finalXVerify);

    const response = await fetch(`${PHONEPE_HOST}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": finalXVerify,
        "accept": "application/json"
      },
      body: JSON.stringify({ request: payloadBase64 })
    });

    const result = await response.json();
    console.log("PhonePe response:", result);

    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      res.json({
        success: true,
        redirectUrl: result.data.instrumentResponse.redirectInfo.url,
        orderId: orderId
      });
    } else {
      res.json({
        success: false,
        message: result.message || "Payment failed",
        error: result
      });
    }
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message
    });
  }
});

// PhonePe Callback (after user completes payment)
app.post("/api/phonepe/callback", (req, res) => {
  console.log("📩 PhonePe Callback Data:", req.body);
  // Save transaction status to DB here
  res.status(200).send("Callback received");
});

// Status Check API
app.get("/api/phonepe/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const url = `/pg/v1/status/${MERCHANT_ID}/${orderId}`;
    const checksum = crypto
      .createHash("sha256")
      .update(url + SALT_KEY)
      .digest("hex");
    const finalXVerify = checksum + "###" + SALT_INDEX;

    const response = await fetch(`${PHONEPE_HOST}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": finalXVerify,
        "X-MERCHANT-ID": MERCHANT_ID,
        "accept": "application/json"
      }
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      success: false,
      error: "Status check failed",
      message: error.message
    });
  }
});

// Razorpay Payment Links API
app.get("/api/razorpay/payment-links", async (req, res) => {
  try {
    const { billingCycle } = req.query;
    
    if (!billingCycle || !RAZORPAY_PAYMENT_LINKS[billingCycle]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid billing cycle. Use "monthly" or "yearly"' 
      });
    }

    const paymentLink = RAZORPAY_PAYMENT_LINKS[billingCycle];
    
    console.log(`🔗 Providing Razorpay payment link for ${billingCycle}:`, paymentLink);

    res.json({
      success: true,
      paymentLink: paymentLink,
      billingCycle: billingCycle,
      amount: billingCycle === 'yearly' ? 4999 : 849, // INR amounts
      currency: 'INR'
    });

  } catch (error) {
    console.error('❌ Error getting Razorpay payment links:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get payment links'
    });
  }
});

// Razorpay Create Order API
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;

    console.log('🚀 Creating Razorpay order:', { orderId, amount, userId, planSlug, billingCycle });

    if (!orderId || !amount || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: orderId, amount, userId' 
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        userId: userId,
        planSlug: planSlug || 'basic',
        billingCycle: billingCycle || 'annual'
      }
    };

    console.log('📦 Razorpay Order Options:', JSON.stringify(options, null, 2));

    const order = await razorpay.orders.create(options);
    
    console.log('✅ Razorpay order created successfully:', order.id);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: RAZORPAY_KEY_ID,
      planSlug: planSlug || 'basic',
      billingCycle: billingCycle || 'annual'
    });

  } catch (error) {
    console.error('❌ Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create Razorpay order'
    });
  }
});

// Razorpay Verify Payment API
app.post("/api/razorpay/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planSlug, billingCycle } = req.body;

    console.log('🔍 Verifying Razorpay payment:', { razorpay_order_id, razorpay_payment_id, userId });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields for verification' 
      });
    }

    // Generate signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log('✅ Payment verification successful');
      
      // Here you would typically:
      // 1. Update your database with payment success
      // 2. Create subscription record
      // 3. Send confirmation email
      
      res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Payment verified successfully'
      });
    } else {
      console.log('❌ Payment verification failed - invalid signature');
      
      res.status(400).json({
        success: false,
        verified: false,
        error: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed'
    });
  }
});

// Razorpay Webhook Handler
app.post("/api/razorpay/webhook", async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';

    console.log('📩 Razorpay Webhook received:', {
      signature: signature ? 'Present' : 'Missing',
      bodyLength: body.length
    });

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('🔍 Processing webhook event:', event.event);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      case 'payment_link.paid':
        await handlePaymentLinkPaid(event);
        break;
      default:
        console.log('ℹ️ Unhandled webhook event:', event.event);
    }

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Webhook processing failed'
    });
  }
});

// Helper functions for webhook handling
async function handlePaymentCaptured(event) {
  try {
    const payment = event.payload.payment.entity;
    const order = event.payload.order.entity;
    
    console.log('✅ Payment captured:', {
      paymentId: payment.id,
      orderId: order.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status
    });

    // Extract user information from order notes
    const userId = order.notes?.userId;
    const planSlug = order.notes?.planSlug || 'basic';
    const billingCycle = order.notes?.billingCycle || 'annual';

    if (userId) {
      // Create subscription in database
      console.log('📝 Creating subscription for:', { userId, planSlug, billingCycle });
      
      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Create subscription record
      const subscriptionData = {
        user_id: userId,
        plan_slug: planSlug,
        billing_cycle: billingCycle,
        payment_id: payment.id,
        order_id: order.id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        created_at: new Date().toISOString()
      };

      // Save to database (implement your database logic here)
      console.log('💾 Saving subscription:', subscriptionData);
      
      // You would implement your database save logic here
      // For example, using your database connection
      // await saveSubscriptionToDatabase(subscriptionData);
      
      console.log('✅ Subscription created successfully');
    }

  } catch (error) {
    console.error('❌ Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(event) {
  try {
    const payment = event.payload.payment.entity;
    
    console.log('❌ Payment failed:', {
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      error: payment.error_description
    });

    // Log failed payment for analysis
    console.log('📝 Logging failed payment for analysis');

  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

async function handlePaymentLinkPaid(event) {
  try {
    const paymentLink = event.payload.payment_link.entity;
    const payment = event.payload.payment.entity;
    
    console.log('✅ Payment link paid:', {
      paymentLinkId: paymentLink.id,
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency
    });

    // Extract user information from payment link notes
    const userId = paymentLink.notes?.userId;
    const planSlug = paymentLink.notes?.planSlug || 'basic';
    const billingCycle = paymentLink.notes?.billingCycle || 'annual';

    if (userId) {
      console.log('📝 Updating user subscription from payment link for:', { userId, planSlug, billingCycle });
      // Implement your database update logic here
    }

  } catch (error) {
    console.error('❌ Error handling payment link paid:', error);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📱 PhonePe integration ready!`);
  console.log(`💳 Razorpay integration ready!`);
  console.log(`🔗 Payment links configured:`, RAZORPAY_PAYMENT_LINKS);
});
