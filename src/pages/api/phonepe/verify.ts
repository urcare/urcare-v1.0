// API endpoint: GET /api/phonepe/verify?orderId=...
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPhonePeTransaction, getOrder } from '@/lib/phonepe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Check local store first
    const localOrder = getOrder(orderId);
    if (localOrder && localOrder.status !== 'PENDING') {
      return res.status(200).json({
        success: true,
        status: localOrder.status,
        orderId: localOrder.orderId,
        phonepeTxnId: localOrder.phonepeTxnId,
        amount: localOrder.amount
      });
    }

    // Verify with PhonePe
    const verificationResult = await verifyPhonePeTransaction(orderId);

    if (verificationResult.success) {
      return res.status(200).json({
        success: true,
        status: verificationResult.status,
        orderId: verificationResult.orderId,
        phonepeTxnId: verificationResult.phonepeTxnId,
        amount: verificationResult.amount
      });
    } else {
      return res.status(400).json({
        success: false,
        error: verificationResult.error || 'Failed to verify transaction'
      });
    }
  } catch (error) {
    console.error('PhonePe verify API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
