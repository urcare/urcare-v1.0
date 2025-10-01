// Vercel API route for PhonePe payment status check
const crypto = require('crypto');

// PhonePe Live Configuration
const PHONEPE_MERCHANT_ID = 'M23XRS3XN3QMF';
const PHONEPE_SALT_KEY = '713219fb-38d0-468d-8268-8b15955468b0';
const PHONEPE_SALT_INDEX = '1';
const PHONEPE_BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Generate X-VERIFY signature
function generateXVerify(payload, endpoint, saltKey, saltIndex) {
  const stringToHash = `${payload}${endpoint}${saltKey}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${saltIndex}`;
}

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
    const { transactionId } = req.body;

    console.log('🔍 Checking live PhonePe payment status:', transactionId);

    if (!transactionId) {
      return res.status(400).json({ success: false, error: 'Missing required field: transactionId' });
    }

    // Create status check endpoint
    const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
    
    // Generate X-VERIFY signature for status check
    const xVerify = generateXVerify('', endpoint, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX);

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
    console.log('📨 PhonePe Status Response:', JSON.stringify(data, null, 2));

    res.status(200).json({
      success: data.success || false,
      data: data.data,
      transactionId: transactionId
    });

  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
