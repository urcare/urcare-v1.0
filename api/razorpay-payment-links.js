// Vercel API route for Razorpay payment links integration
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

// Pre-configured Razorpay payment links
const PAYMENT_LINKS = {
  monthly: "https://razorpay.me/@urcare?amount=vy%2F7jJNxh9pvHsb2%2Bqs52w%3D%3D",
  yearly: "https://razorpay.me/@urcare?amount=6zcPuaHTrIB8Jllw5habFw%3D%3D"
};

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

  if (req.method === 'GET') {
    // Get payment links
    try {
      const { billingCycle } = req.query;
      
      if (!billingCycle || !PAYMENT_LINKS[billingCycle]) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid billing cycle. Use "monthly" or "yearly"' 
        });
      }

      const paymentLink = PAYMENT_LINKS[billingCycle];
      
      console.log(`🔗 Providing Razorpay payment link for ${billingCycle}:`, paymentLink);

      res.status(200).json({
        success: true,
        paymentLink: paymentLink,
        billingCycle: billingCycle,
        amount: billingCycle === 'yearly' ? 4999 : 849, // INR amounts
        currency: 'INR'
      });

    } catch (error) {
      console.error('❌ Error getting payment links:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get payment links'
      });
    }
  } else if (req.method === 'POST') {
    // Create custom payment link or handle payment link creation
    try {
      const { billingCycle, userId, planSlug, customAmount } = req.body;

      console.log('🚀 Creating Razorpay payment link:', { billingCycle, userId, planSlug, customAmount });

      // Check if API keys are properly configured
      if (RAZORPAY_KEY_ID === 'rzp_test_1234567890' || RAZORPAY_KEY_SECRET === 'your_secret_key') {
        console.error('❌ Razorpay API keys not configured properly');
        return res.status(500).json({ 
          success: false, 
          error: 'Razorpay API keys not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel environment variables.' 
        });
      }

      if (!billingCycle || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: billingCycle, userId' 
        });
      }

      // Determine amount based on billing cycle
      const amount = customAmount || (billingCycle === 'yearly' ? 499900 : 84900); // Amount in paise
      
      // Create Razorpay payment link
      const paymentLinkOptions = {
        amount: amount,
        currency: 'INR',
        description: `UrCare ${planSlug || 'basic'} ${billingCycle} subscription`,
        customer: {
          name: 'User',
          email: 'user@example.com',
          contact: '9999999999'
        },
        notify: {
          sms: false,
          email: true
        },
        reminder_enable: true,
        notes: {
          userId: userId,
          planSlug: planSlug || 'basic',
          billingCycle: billingCycle
        }
      };

      console.log('📦 Razorpay Payment Link Options:', JSON.stringify(paymentLinkOptions, null, 2));

      const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
      
      console.log('✅ Razorpay payment link created successfully:', paymentLink.id);

      res.status(200).json({
        success: true,
        paymentLinkId: paymentLink.id,
        shortUrl: paymentLink.short_url,
        amount: paymentLink.amount,
        currency: paymentLink.currency,
        description: paymentLink.description,
        billingCycle: billingCycle,
        planSlug: planSlug || 'basic'
      });

    } catch (error) {
      console.error('❌ Razorpay payment link creation error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create Razorpay payment link'
      });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
};
