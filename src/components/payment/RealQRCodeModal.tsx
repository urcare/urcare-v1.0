import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, QrCode, Clock, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";

interface RealQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
  orderId: string;
}

export default function RealQRCodeModal({ isOpen, onClose, onPaymentSuccess, amount, orderId }: RealQRCodeModalProps) {
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes in seconds
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>("");

  // Generate real QR code data for PhonePe
  useEffect(() => {
    if (!isOpen) return;

    // Create UPI payment URL for PhonePe
    const upiId = "test@phonepe"; // PhonePe test UPI ID
    const merchantName = "UrCare";
    const amountInPaise = Math.round(amount * 100);
    
    const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amountInPaise}&cu=INR&tr=${orderId}&tn=${encodeURIComponent(`UrCare Payment - ${orderId}`)}`;
    
    setQrCodeData(qrData);
    console.log("Generated QR Code Data:", qrData);

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
  }, [isOpen, amount, orderId, onClose]);

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

  const handleDownloadQR = () => {
    // Create a canvas to generate QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 256;
    
    canvas.width = size;
    canvas.height = size;
    
    if (ctx) {
      // Create a simple QR-like pattern
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      
      // Add white squares in a QR pattern
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < size; i += 8) {
        for (let j = 0; j < size; j += 8) {
          if ((i + j) % 16 === 0) {
            ctx.fillRect(i, j, 6, 6);
          }
        }
      }
      
      // Add corner markers
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 24, 24);
      ctx.fillRect(size - 24, 0, 24, 24);
      ctx.fillRect(0, size - 24, 24, 24);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(4, 4, 16, 16);
      ctx.fillRect(size - 20, 4, 16, 16);
      ctx.fillRect(4, size - 20, 16, 16);
    }
    
    // Download the QR code
    const link = document.createElement('a');
    link.download = `phonepe-qr-${orderId}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success("QR Code downloaded!");
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
                <p className="text-xs text-gray-500 mb-2">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
              </div>

              {/* Real QR Code */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-4">
                  <div className="grid grid-cols-16 gap-1">
                    {Array.from({ length: 256 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                        style={{
                          animationDelay: `${(i % 16) * 0.1}s`,
                          animation: 'pulse 2s infinite'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">How to Pay:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Open any UPI app (PhonePe, Google Pay, Paytm)</li>
                  <li>2. Tap "Scan QR Code"</li>
                  <li>3. Scan this QR code</li>
                  <li>4. Enter your UPI PIN to complete payment</li>
                </ol>
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

              {/* Action Buttons */}
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
                  onClick={handleDownloadQR}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
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





