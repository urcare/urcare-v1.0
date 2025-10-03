import React, { useState } from 'react';
import { PhonePeQRModal } from './PhonePeQRModal';

export const PayByQRButton = ({ amount, onSuccess, onError }) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const handlePayByQR = () => {
    // Show QR modal directly without server calls
    setShowQRModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowQRModal(false);
    if (onSuccess) onSuccess();
  };

  const handlePaymentError = (error) => {
    setShowQRModal(false);
    if (onError) onError(error);
  };

  return (
    <>
      <button
        onClick={handlePayByQR}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        I'll pay by QR
      </button>
      
      <PhonePeQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        amount={amount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};
