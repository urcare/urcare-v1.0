// API endpoint: POST /api/phonepe/notify (webhook)
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPhonePeWebhook, updateOrderStatus, getOrder } from '@/lib/phonepe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-verify'] as string;
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!(await verifyPhonePeWebhook(payload, signature))) {
      console.error('Invalid PhonePe webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { response } = req.body;
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());

    const {
      merchantId,
      merchantTransactionId,
      transactionId,
      amount,
      state,
      code,
      responseCode
    } = decodedResponse;

    console.log('PhonePe webhook received:', {
      merchantId,
      merchantTransactionId,
      transactionId,
      amount,
      state,
      code,
      responseCode
    });

    // Update order status
    const order = getOrder(merchantTransactionId);
    if (order) {
      let newStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

      switch (state) {
        case 'COMPLETED':
          newStatus = 'SUCCESS';
          break;
        case 'FAILED':
        case 'CANCELLED':
          newStatus = 'FAILED';
          break;
        case 'PENDING':
          newStatus = 'PENDING';
          break;
        default:
          newStatus = 'FAILED';
      }

      updateOrderStatus(merchantTransactionId, newStatus);

      console.log(`Order ${merchantTransactionId} status updated to ${newStatus}`);
    } else {
      console.warn(`Order ${merchantTransactionId} not found in local store`);
    }

    // Return success response to PhonePe
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('PhonePe webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
