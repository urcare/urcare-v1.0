import React from 'react';

export const PayByQRButton = ({ amount, onSuccess, onError }) => {
  const onPayByQR = async () => {
    try {
      const orderId = `order_${Date.now()}`;
      const phonepeServerUrl = 'https://phonepe-server-25jew6ja6-urcares-projects.vercel.app';
      let r;
      
      try {
        r = await fetch(`${phonepeServerUrl}/api/phonepe/create`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ 
            amount: amount * 100, // Convert to paise
            orderId,
            userId: 'demo_user',
            planName: 'Premium Plan'
          })
        });
      } catch (serverError) {
        console.log('PhonePe server unavailable, using fallback API');
        // Fallback to local API
        r = await fetch('/api/phonepe/create', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ 
            amount: amount,
            orderId,
            userId: 'demo_user',
            planName: 'Premium Plan'
          })
        });
      }

      if (!r.ok) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }

      const j = await r.json();
      
      if (j.success) {
        // Open QR modal or redirect to PhonePe
        const redirectUrl = j.data?.redirectUrl || j.redirectUrl;
        
        if (redirectUrl) {
          // Open PhonePe payment page in popup
          const popup = window.open(redirectUrl, 'phonepe', 'width=420,height=680');
          if (popup) {
            popup.focus();
          }
        } else {
          // Show QR code modal
          if (onSuccess) onSuccess();
        }
      } else {
        throw new Error(j.error || 'Payment creation failed');
      }
    } catch (error) {
      console.error('PhonePe payment error:', error);
      if (onError) onError(error.message);
    }
  };

  return (
    <button
      onClick={onPayByQR}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
    >
      I'll pay by QR
    </button>
  );
};
