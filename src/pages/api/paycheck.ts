// API endpoint: POST /api/paycheck
import { NextApiRequest, NextApiResponse } from 'next';
import { createPhonePeTransaction, storeOrder } from '@/lib/phonepe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amountPaise = 100, orderId, userId } = req.body;

    // Validate input
    if (amountPaise < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create PhonePe transaction
    const transactionResult = await createPhonePeTransaction({
      amountPaise,
      orderId,
      userId,
      redirectUrl: `${process.env.VERCEL_URL || 'https://urcarebyarsh.vercel.app'}/api/phonepe/callback`
    });

    if (transactionResult.success) {
      // Store order in memory (replace with database in production)
      storeOrder(
        transactionResult.orderId!,
        amountPaise,
        transactionResult.phonepeTxnId,
        userId
      );

      return res.status(200).json({
        success: true,
        redirectUrl: transactionResult.redirectUrl,
        orderId: transactionResult.orderId,
        phonepeTxnId: transactionResult.phonepeTxnId
      });
    } else {
      return res.status(400).json({
        success: false,
        error: transactionResult.error || 'Failed to create transaction'
      });
    }
  } catch (error) {
    console.error('Paycheck API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
