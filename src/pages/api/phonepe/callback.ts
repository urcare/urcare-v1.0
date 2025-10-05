// API endpoint: POST /api/phonepe/callback (return URL)
import { NextApiRequest, NextApiResponse } from 'next';
import { getOrder } from '@/lib/phonepe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { merchantTransactionId } = req.body;

    if (!merchantTransactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    // Get order status
    const order = getOrder(merchantTransactionId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Redirect to payment result page
    const redirectUrl = `${process.env.VERCEL_URL || 'https://urcarebyarsh.vercel.app'}/pay?status=${order.status}&orderId=${merchantTransactionId}`;
    
    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('PhonePe callback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
