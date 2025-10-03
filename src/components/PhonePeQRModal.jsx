import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, X, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode.react';

export const PhonePeQRModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate a mock QR code data for PhonePe
  const generateQRData = () => {
    const orderId = `order_${Date.now()}`;
    const merchantId = 'URCARE';
    const transactionId = `TXN_${Date.now()}`;
    
    // This is a mock QR data structure - in real implementation, this would come from PhonePe API
    return {
      orderId,
      merchantId,
      transactionId,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      merchantName: 'UrCare Health',
      qrData: `upi://pay?pa=urcare@phonepe&pn=UrCare%20Health&am=${amount * 100}&cu=INR&tr=${transactionId}&tn=Health%20Plan%20Payment`
    };
  };

  const qrData = generateQRData();

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      // Create a canvas element to generate QR code image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const qrCodeElement = document.getElementById('qr-code');
      
      if (qrCodeElement) {
        // Get the SVG content
        const svgElement = qrCodeElement.querySelector('svg');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Download the image
            const link = document.createElement('a');
            link.download = `phonepe-qr-${qrData.orderId}.png`;
            link.href = canvas.toDataURL();
            link.click();
          };
          
          img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePaymentComplete = () => {
    setIsPaid(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 2000);
  };

  const handleContinueToDashboard = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  if (isPaid) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Payment Successful! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Payment Completed</p>
            <p className="text-gray-600 mb-4">
              Your health plan has been activated successfully!
            </p>
            <Button 
              onClick={handleContinueToDashboard}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Pay with PhonePe QR</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
            <div className="flex justify-center">
              <img 
                src="/images/qr.jpg" 
                alt="PhonePe QR Code" 
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  // Fallback to generated QR if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }} id="qr-code">
                <QRCode
                  value={qrData.qrData}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <p className="text-lg font-semibold">₹{amount}</p>
            <p className="text-sm text-gray-600">
              Order ID: {qrData.orderId}
            </p>
            <p className="text-sm text-gray-600">
              Merchant: {qrData.merchantName}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownloadQR}
              disabled={isDownloading}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download QR Code'}
            </Button>
            
            <Button
              onClick={handlePaymentComplete}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              I've Paid - Continue
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Cancel Payment
            </Button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Instructions:</strong><br />
              1. Open PhonePe app on your phone<br />
              2. Scan this QR code or download and scan<br />
              3. Complete the payment<br />
              4. Click "I've Paid - Continue" button
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
