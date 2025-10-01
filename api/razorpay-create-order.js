// Vercel API route for Razorpay payment creation
const Razorpay = require('razorpay');

// Razorpay Configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_secret_key';

console.log('🔑 Razorpay Key ID:', RAZORPAY_KEY_ID ? 'Configured' : 'Not configured');
console.log('🔑 Razorpay Key Secret:', RAZORPAY_KEY_SECRET ? 'Configured' : 'Not configured');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

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
    const { orderId, amount, userId, planSlug, billingCycle } = req.body;

    console.log('🚀 Creating Razorpay order:', { orderId, amount, userId, planSlug, billingCycle });

    if (!orderId || !amount || !userId) {
      return res.status(400).json({ success: false, error: 'Missing required fields: orderId, amount, userId' });
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

    res.status(200).json({
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
}
