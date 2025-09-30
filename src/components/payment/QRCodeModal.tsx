import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, QrCode, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
}

export default function QRCodeModal({ isOpen, onClose, onPaymentSuccess, amount }: QRCodeModalProps) {
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes in seconds
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate a mock QR code data
  const qrData = `upi://pay?pa=test@phonepe&pn=UrCare&am=${amount}&cu=INR&tr=${Date.now()}`;

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Payment timeout. Please try again.");
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentCheck = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate checking payment status
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success (30% chance for demo)
      const isSuccess = Math.random() > 0.7;
      
      if (isSuccess) {
        setIsPaymentCompleted(true);
        toast.success("Payment completed successfully!");
        
        // Show success for 3 seconds then redirect
        setTimeout(() => {
          onPaymentSuccess();
        }, 3000);
      } else {
        toast.info("Payment not completed yet. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Failed to check payment status. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isPaymentCompleted) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">QR Code Payment</CardTitle>
          {!isPaymentCompleted && (
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isPaymentCompleted ? (
            // Success State
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">Your payment of ₹{amount} has been processed successfully.</p>
              </div>
              <div className="text-sm text-gray-500">
                Redirecting to dashboard...
              </div>
            </div>
          ) : (
            // QR Code State
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Scan QR Code to Pay</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Amount: <span className="font-semibold text-green-600">₹{amount}</span>
                </p>
              </div>

              {/* Mock QR Code */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-sm ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Time remaining to complete payment
                </p>
              </div>

              {/* Payment Check Button */}
              <div className="space-y-2">
                <Button
                  onClick={handlePaymentCheck}
                  disabled={isProcessing}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Checking Payment...
                    </div>
                  ) : (
                    "I've Made the Payment"
                  )}
                </Button>
                
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="w-full"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Scan this QR code with any UPI app to complete payment
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
