// Vercel API route for Razorpay webhook handling
const crypto = require('crypto');

// Razorpay Configuration
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';

console.log('🔑 Razorpay Webhook Secret:', RAZORPAY_WEBHOOK_SECRET ? 'Configured' : 'Not configured');

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
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];

    console.log('📩 Razorpay Webhook received:', {
      signature: signature ? 'Present' : 'Missing',
      bodyLength: body.length
    });

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
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
      case 'subscription.charged':
        await handleSubscriptionCharged(event);
        break;
      case 'subscription.completed':
        await handleSubscriptionCompleted(event);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event);
        break;
      default:
        console.log('ℹ️ Unhandled webhook event:', event.event);
    }

    res.status(200).json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Webhook processing failed'
    });
  }
};

// Handle payment captured event
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
      // Update user subscription in database
      await updateUserSubscription({
        userId,
        planSlug,
        billingCycle,
        paymentId: payment.id,
        orderId: order.id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: calculateEndDate(billingCycle)
      });

      console.log('✅ User subscription updated successfully');
    }

  } catch (error) {
    console.error('❌ Error handling payment captured:', error);
  }
}

// Handle payment failed event
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
    await logFailedPayment({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      error: payment.error_description,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

// Handle payment link paid event
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
      // Update user subscription in database
      await updateUserSubscription({
        userId,
        planSlug,
        billingCycle,
        paymentId: payment.id,
        paymentLinkId: paymentLink.id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: calculateEndDate(billingCycle)
      });

      console.log('✅ User subscription updated from payment link');
    }

  } catch (error) {
    console.error('❌ Error handling payment link paid:', error);
  }
}

// Handle subscription charged event
async function handleSubscriptionCharged(event) {
  try {
    const subscription = event.payload.subscription.entity;
    
    console.log('✅ Subscription charged:', {
      subscriptionId: subscription.id,
      amount: subscription.amount,
      currency: subscription.currency,
      status: subscription.status
    });

    // Update subscription status in database
    await updateSubscriptionStatus({
      subscriptionId: subscription.id,
      status: 'active',
      lastCharged: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error handling subscription charged:', error);
  }
}

// Handle subscription completed event
async function handleSubscriptionCompleted(event) {
  try {
    const subscription = event.payload.subscription.entity;
    
    console.log('✅ Subscription completed:', {
      subscriptionId: subscription.id,
      status: subscription.status
    });

    // Update subscription status in database
    await updateSubscriptionStatus({
      subscriptionId: subscription.id,
      status: 'completed',
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error handling subscription completed:', error);
  }
}

// Handle subscription cancelled event
async function handleSubscriptionCancelled(event) {
  try {
    const subscription = event.payload.subscription.entity;
    
    console.log('❌ Subscription cancelled:', {
      subscriptionId: subscription.id,
      status: subscription.status
    });

    // Update subscription status in database
    await updateSubscriptionStatus({
      subscriptionId: subscription.id,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error handling subscription cancelled:', error);
  }
}

// Helper function to calculate end date based on billing cycle
function calculateEndDate(billingCycle) {
  const now = new Date();
  if (billingCycle === 'yearly') {
    return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();
  } else {
    return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
  }
}

// Helper function to update user subscription (implement based on your database)
async function updateUserSubscription(subscriptionData) {
  try {
    console.log('📝 Updating user subscription:', subscriptionData);
    
    // Here you would implement your database update logic
    // For example, using Supabase, MongoDB, or any other database
    
    // Example implementation:
    // await supabase
    //   .from('user_subscriptions')
    //   .upsert(subscriptionData);
    
    console.log('✅ User subscription updated in database');
  } catch (error) {
    console.error('❌ Error updating user subscription:', error);
    throw error;
  }
}

// Helper function to update subscription status
async function updateSubscriptionStatus(statusData) {
  try {
    console.log('📝 Updating subscription status:', statusData);
    
    // Here you would implement your database update logic
    
    console.log('✅ Subscription status updated in database');
  } catch (error) {
    console.error('❌ Error updating subscription status:', error);
    throw error;
  }
}

// Helper function to log failed payments
async function logFailedPayment(failureData) {
  try {
    console.log('📝 Logging failed payment:', failureData);
    
    // Here you would implement your database logging logic
    
    console.log('✅ Failed payment logged in database');
  } catch (error) {
    console.error('❌ Error logging failed payment:', error);
    throw error;
  }
}
