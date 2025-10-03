import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, Clock } from 'lucide-react';
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
  const navigate = useNavigate();

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
    // Use React Router navigation instead of window.location.href
    navigate('/dashboard');
    toast.success('Payment completed! Redirecting to dashboard...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {planName} plan ({billingCycle})
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            ₹{amount}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <img 
                src="/images/qr.jpg" 
                alt="Payment QR Code" 
                className="w-64 h-64 object-contain"
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
          
          {/* Scan instruction */}
          <div className="text-center text-gray-600 text-sm">
            Scan to pay with any UPI app
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h4>
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
              <Clock className="w-4 h-4 inline mr-1" />
              We will allow your subscription in 1-2 hrs please wait
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;