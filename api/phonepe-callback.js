// Vercel API route for PhonePe callback
export default async function handler(req, res) {
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
    console.log('📞 PhonePe Callback received:', JSON.stringify(req.body, null, 2));
    
    // PhonePe sends callback data here
    const { 
      transactionId, 
      status, 
      amount, 
      merchantId,
      merchantTransactionId 
    } = req.body;

    console.log('📞 Callback details:', {
      transactionId,
      status,
      amount,
      merchantId,
      merchantTransactionId,
      timestamp: new Date().toISOString()
    });

    // In production, you would:
    // 1. Verify the callback signature
    // 2. Update payment status in database
    // 3. Trigger any post-payment actions

    res.status(200).json({
      success: true,
      message: 'Callback received successfully'
    });

  } catch (error) {
    console.error('❌ Callback error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Callback processing failed'
    });
  }
}
