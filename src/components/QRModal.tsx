import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, QrCode, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  amount: number;
  plan: string;
  cycle: string;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  onPaymentComplete,
  amount,
  plan,
  cycle
}) => {
  const handleDownloadQR = () => {
    try {
      // Create a temporary link to download the QR image
      const link = document.createElement('a');
      link.href = '/images/qr.jpg';
      link.download = `phonepe-qr-${plan}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handlePaymentComplete = () => {
    onPaymentComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <QrCode className="w-6 h-6" />
            Scan QR Code to Pay
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Amount: ₹{amount} • {plan} plan ({cycle})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
              <img 
                src="/images/qr.jpg" 
                alt="Payment QR Code" 
                className="w-64 h-64 object-contain"
                onError={(e) => {
                  console.error('QR image failed to load');
                  e.currentTarget.src = '/qr-code-placeholder.png';
                }}
              />
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Open your PhonePe app</li>
              <li>2. Scan the QR code above</li>
              <li>3. Complete the payment</li>
              <li>4. Click "I've Paid" below</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleDownloadQR}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Image
            </Button>
            
            <Button 
              onClick={handlePaymentComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              I've Paid - Complete
            </Button>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  We will allow your subscription in 1-2 hrs please wait
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Our team continuously works to enhance your experience. Thank you, UrCare Team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
