// Vercel API route for Razorpay payment verification
const crypto = require('crypto');

// Razorpay Configuration
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_secret_key'; // Replace with your actual secret

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planSlug, billingCycle } = req.body;

    console.log('🔍 Verifying Razorpay payment:', { razorpay_order_id, razorpay_payment_id, userId });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing required fields for verification' });
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
      
      res.status(200).json({
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
}
