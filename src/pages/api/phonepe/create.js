// Fallback PhonePe API endpoint
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, orderId, userId, planName } = req.body;
    
    // For now, just return a success response with QR modal data
    // In production, this would call the actual PhonePe server
    const response = {
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId,
        amount,
        userId,
        planName,
        qrCode: '/images/qr.jpg', // Use the existing QR image
        redirectUrl: null // No redirect, use QR modal
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('PhonePe create error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to create payment order',
      details: error.message 
    });
  }
}
