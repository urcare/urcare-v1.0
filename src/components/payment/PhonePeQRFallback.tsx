import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, QrCode, Smartphone, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PhonePeQRFallbackProps {
  orderId: string;
  amount: number;
  planSlug: string;
  billingCycle: string;
  merchantId: string;
}

export default function PhonePeQRFallback({ 
  orderId, 
  amount, 
  planSlug, 
  billingCycle, 
  merchantId 
}: PhonePeQRFallbackProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const amountInRupees = (amount / 100).toFixed(2);
  
  // Generate QR code data for PhonePe UPI
  const qrData = `upi://pay?pa=urcare@phonepe&pn=UrCare&am=${amount}&cu=INR&tr=${orderId}&tn=UrCare Subscription - ${planSlug} ${billingCycle}`;
  
  // Generate QR code using a simple API (you can replace with a proper QR library)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 2000);
  };

  if (isPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">
                Your subscription has been activated successfully.
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-700">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Amount:</strong> ₹{amountInRupees}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Plan:</strong> {planSlug} ({billingCycle})
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Complete Your Payment
          </CardTitle>
          <p className="text-center text-gray-600">
            Scan QR code with PhonePe app to pay
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Order ID:</span>
              <span className="text-sm text-gray-600">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Amount:</span>
              <span className="text-lg font-bold text-green-600">₹{amountInRupees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Plan:</span>
              <span className="text-sm text-gray-600 capitalize">{planSlug} ({billingCycle})</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-dashed border-gray-300">
              <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <img 
                src={qrCodeUrl} 
                alt="PhonePe QR Code" 
                className="mx-auto rounded-lg"
                onError={(e) => {
                  // Fallback if QR code fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-center">
                <div className="bg-gray-100 p-8 rounded-lg">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR Code not available</p>
                  <p className="text-xs text-gray-400 mt-1">Please use manual payment</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Scan with PhonePe app to pay
            </p>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">How to pay:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Open PhonePe app on your phone</li>
              <li>2. Tap on "Scan QR" or "Pay"</li>
              <li>3. Scan the QR code above</li>
              <li>4. Complete the payment</li>
              <li>5. Come back and click "I Have Paid"</li>
            </ol>
          </div>

          {/* Alternative Payment Methods */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Alternative payment methods:</p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => window.open('https://phonepe.com', '_blank')}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                PhonePe Web
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => window.open('https://phonepe.com', '_blank')}
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Other Methods
              </Button>
            </div>
          </div>

          {/* Payment Complete Button */}
          <Button 
            onClick={handlePaymentComplete}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                I Have Paid - Complete Order
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            After payment, your subscription will be activated immediately
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
