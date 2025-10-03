import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { amount, orderId, callbackUrl } = req.body;
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const salt = process.env.PHONEPE_SALT;
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  const baseUrl = process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg-sandbox';

  const payload = {
    merchantId,
    merchantTransactionId: orderId,
    amount,            // amount in paisa (e.g., 100 = ₹1.00 -> normal PhonePe expects paise)
    redirectUrl: `${process.env.APP_URL}/phonepe-return`,
    callbackUrl: callbackUrl || `${process.env.APP_URL}/api/payments/phonepe-webhook`,
  };

  try {
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const endpoint = '/pg/v1/pay';
    const stringToHash = payloadBase64 + endpoint + salt;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${sha256}###${saltIndex}`;

    const phonepeRes = await fetch(baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-CLIENT-ID': merchantId
      },
      body: JSON.stringify({ request: payloadBase64 })
    });

    const j = await phonepeRes.json();
    // phonepe response typically contains redirect url or qr object; return raw to client for flexibility
    return res.status(phonepeRes.status).json(j);
  } catch (err) {
    console.error('PhonePe-init error', err);
    return res.status(500).json({ error: 'phonepe-init-failed', details: err.message });
  }
}
