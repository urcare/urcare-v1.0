import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode, CheckCircle, ArrowLeft } from "lucide-react";
import QRCodeModal from "@/components/payment/QRCodeModal";
import { phonepeService } from "@/services/phonepeService";

export default function PhonePeCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get payment data from location state or URL params
  const { planSlug, billingCycle, amount } = location.state || {};
  const urlParams = new URLSearchParams(location.search);
  const amountFromUrl = urlParams.get('amount');
  const planFromUrl = urlParams.get('plan');
  const cycleFromUrl = urlParams.get('cycle');
  
  // Use data from state or URL params, with defaults for testing
  const finalAmount = amount || parseFloat(amountFromUrl || '1'); // Default to ₹1 for testing
  const finalPlan = planSlug || planFromUrl || 'basic';
  const finalCycle = billingCycle || cycleFromUrl || 'annual';

  const [showQRModal, setShowQRModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/paywall");
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  const handlePayWithQR = async () => {
    setIsProcessing(true);
    try {
      // Create QR payment
      const result = await phonepeService.createQRPayment(finalAmount, `${finalPlan} plan (${finalCycle})`);
      
      if (result.success) {
        setShowQRModal(true);
        toast.success('QR payment created successfully!');
      } else {
        toast.error(result.error || 'Failed to create QR payment');
      }
    } catch (error) {
      console.error('QR payment error:', error);
      toast.error('Failed to create QR payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRComplete = () => {
    toast.success('Payment submitted! We will activate your subscription in 1-2 hours. Please wait.');
    setShowQRModal(false);
    // In a real app, you would check payment status and redirect accordingly
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Complete Your Payment
          </CardTitle>
          <CardDescription className="text-gray-600">
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="font-medium capitalize">{finalPlan}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Billing:</span>
              <span className="font-medium capitalize">{finalCycle}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-lg font-semibold text-gray-900">Amount:</span>
              <span className="text-xl font-bold text-blue-600">₹{finalAmount}</span>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <Button 
              onClick={handlePayWithQR}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-medium disabled:opacity-50"
            >
              <QrCode className="w-5 h-5 mr-2" />
              {isProcessing ? 'Creating QR...' : 'I\'ll pay by QR'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/paymentpage', { state: { planSlug: finalPlan, billingCycle: finalCycle, amount: finalAmount } })}
              className="w-full py-3 text-lg font-medium"
            >
              Use Card/UPI Instead
            </Button>
          </div>

          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="w-full text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Previous Step
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onComplete={handleQRComplete}
        amount={finalAmount}
        planName={finalPlan}
        billingCycle={finalCycle}
        userId={user?.id}
      />
    </div>
  );
}