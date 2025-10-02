import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  amount: number;
  planName: string;
  billingCycle: string;
  userId?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  amount,
  planName,
  billingCycle,
  userId = 'user'
}) => {
  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = '/images/qr.jpg';
    link.download = `phonepe-qr-${userId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded successfully!');
  };

  const handlePaymentComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Pay with QR Code
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Amount: ₹{amount} • {planName} plan ({billingCycle})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <img 
                src="/images/qr.jpg" 
                alt="Payment QR Code" 
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  console.error('QR image failed to load');
                  e.currentTarget.src = '/qr-code-placeholder.png';
                }}
              />
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 mb-2">How to pay:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Open PhonePe app on your phone</li>
              <li>2. Scan this QR code</li>
              <li>3. Enter amount: ₹{amount}</li>
              <li>4. Complete payment</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleDownloadQR}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Image
            </Button>
            
            <Button 
              onClick={handlePaymentComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              I've Paid - Complete
            </Button>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Note:</strong> We will allow your subscription in 1-2 hrs please wait.
            </p>
          </div>

          {/* Close Button */}
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;