import React from 'react';

export const PayByQRButton = ({ amount, onSuccess, onError }) => {
  const onPayByQR = async () => {
    try {
      const orderId = `order_${Date.now()}`;
      const r = await fetch('/api/payments/phonepe-initiate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, orderId })
      });
      const j = await r.json();
      
      // phonepe response might include a redirect url to their checkout
      const redirectUrl = j?.data?.redirectUrl || j?.response?.redirectUrl || j?.redirectUrl;
      const qr = j?.qrCode; // if API sends QR image/data

      const popup = window.open('', 'phonepe', 'width=420,height=680');
      if (redirectUrl) {
        popup.location = redirectUrl;
      } else if (qr) {
        popup.document.write(`<img src="${qr}" alt="PhonePe QR" />`);
      } else {
        popup.document.write('<p>Unable to open PhonePe. Check logs.</p>');
      }

      if (onSuccess) onSuccess();
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
