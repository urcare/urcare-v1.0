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
    // Redirect to dashboard
    window.location.href = '/dashboard';
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
                  console.error('QR image failed to load, trying placeholder');
                  e.currentTarget.src = '/qr-code-placeholder.png';
                }}
                onLoad={() => {
                  console.log('QR image loaded successfully');
                }}
              />
            </div>
          </div>

          {/* Simple Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              <strong>Please allow us some minutes to activate subscription</strong>
            </p>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handlePaymentComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;