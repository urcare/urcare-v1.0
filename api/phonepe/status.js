// Vercel API route for PhonePe payment status check
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { transactionId } = req.body;

    // PhonePe live credentials
    const PHONEPE_MERCHANT_ID = 'M23XRS3XN3QMF';
    const PHONEPE_SALT_KEY = '713219fb-38d0-468d-8268-8b15955468b0';
    const PHONEPE_SALT_INDEX = '1';
    const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/hermes';

    console.log('🔍 Checking live PhonePe payment status:', transactionId);

    // Create status check endpoint
    const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
    
    // Generate X-VERIFY signature for status check
    const crypto = require('crypto');
    const stringToHash = `${endpoint}${PHONEPE_SALT_KEY}`;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${hash}###${PHONEPE_SALT_INDEX}`;

    console.log('🌐 Calling live PhonePe status API:', `${PHONEPE_BASE_URL}${endpoint}`);

    // Call live PhonePe status API
    const response = await fetch(`${PHONEPE_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📨 Live PhonePe Status Response:', JSON.stringify(data, null, 2));

    res.status(200).json({
      success: data.success || false,
      data: data.data
    });

  } catch (error) {
    console.error('❌ Vercel status API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
