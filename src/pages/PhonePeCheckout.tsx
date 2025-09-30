import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CreditCard, Smartphone, Building2, QrCode } from "lucide-react";
import { toast } from "sonner";
import phonePeClient from "@/utils/phonepeClient";
import UPIPopup from "@/components/payment/UPIPopup";
import CardModal from "@/components/payment/CardModal";
import QRCodeModal from "@/components/payment/QRCodeModal";
import PaymentSuccessModal from "@/components/payment/PaymentSuccessModal";

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
  
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Payment method modals
  const [showUPIPopup, setShowUPIPopup] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Use data from state or URL params, with defaults for testing
  const finalAmount = amount || parseFloat(amountFromUrl || '4999'); // Default to annual price
  const finalPlan = planSlug || planFromUrl || 'basic';
  const finalCycle = billingCycle || cycleFromUrl || 'annual';

  useEffect(() => {
    if (!user) {
      navigate("/paywall");
      return;
    }

    // Don't auto-create payment order, let user click the button
  }, [user, navigate]);

  const createPaymentOrder = async () => {
    if (!user) return;
    
    if (!finalAmount || finalAmount <= 0) {
      setError("Invalid payment amount");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating PhonePe payment order with data:", {
        amount: finalAmount,
        plan: finalPlan,
        cycle: finalCycle,
        userId: user.id
      });

      // Try PhonePe client first
      try {
        const result = await phonePeClient.initiatePayment(
          finalAmount,
          user.id,
          finalPlan,
          finalCycle
        );

        if (result.success && result.checkoutUrl) {
          console.log("PhonePe payment initiated successfully:", result);
          
          // Store payment data for reference
          setPaymentData({
            orderId: result.orderId,
            amount: finalAmount,
            plan: finalPlan,
            cycle: finalCycle
          });

          // Redirect to PhonePe PayPage
          console.log("Redirecting to PhonePe PayPage:", result.checkoutUrl);
          window.location.href = result.checkoutUrl;
          return;
        } else {
          throw new Error("Failed to initiate payment");
        }
      } catch (phonepeError) {
        console.log("PhonePe client failed, using fallback:", phonepeError);
        
        // Fallback: Create a mock payment for testing
        const mockOrderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store payment data
        setPaymentData({
          orderId: mockOrderId,
          amount: finalAmount,
          plan: finalPlan,
          cycle: finalCycle
        });

        // For testing: Show a mock PhonePe page
        console.log("Using mock PhonePe payment for testing");
        
        // Create a mock PhonePe URL for testing
        const mockPhonePeUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay?merchantId=M23XRS3XN3QMF&merchantOrderId=${mockOrderId}&amount=${Math.round(finalAmount * 100)}&redirectUrl=${encodeURIComponent(`${window.location.origin}/phonecheckout/result?orderId=${mockOrderId}&plan=${finalPlan}&cycle=${finalCycle}`)}`;
        
        // For now, redirect to result page for testing
        // In production, this would redirect to the actual PhonePe PayPage
        console.log("Mock PhonePe URL:", mockPhonePeUrl);
        
        // Redirect to result page for testing
        window.location.href = `/phonecheckout/result?orderId=${mockOrderId}&plan=${finalPlan}&cycle=${finalCycle}`;
      }
      
    } catch (err: any) {
      console.error("Error creating payment order:", err);
      setError(err.message || "Failed to create payment order");
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/paywall");
  };

  const handleUPIPayment = () => {
    setShowUPIPopup(true);
  };

  const handleCardPayment = () => {
    setShowCardModal(true);
  };

  const handleQRPayment = () => {
    setShowQRModal(true);
  };

  const handlePaymentSuccess = (method: string, details: any) => {
    setPaymentDetails({ method, details });
    setShowSuccessModal(true);
    // Close other modals
    setShowUPIPopup(false);
    setShowCardModal(false);
    setShowQRModal(false);
  };

  const handleUPISuccess = (upiId: string) => {
    handlePaymentSuccess("UPI", { upiId });
  };

  const handleCardSuccess = (cardDetails: any) => {
    handlePaymentSuccess("Card", cardDetails);
  };

  const handleQRSuccess = () => {
    handlePaymentSuccess("QR Code", {});
  };

  const handleRetry = () => {
    setError(null);
    createPaymentOrder();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Payment Order...</h2>
            <p className="text-gray-600">Please wait while we set up your PhonePe payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGoBack}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <CardTitle className="text-red-600">Payment Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Setup Failed</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button onClick={handleGoBack} variant="outline" className="w-full">
                Back to Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGoBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <CardTitle>PhonePe Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="font-medium capitalize">{finalPlan} ({finalCycle})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-lg font-bold text-blue-600">₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Choose Payment Method:</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleUPIPayment}
                  variant="outline"
                  className="flex items-center space-x-2 p-3 h-auto hover:bg-blue-50 hover:border-blue-300"
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">UPI</span>
                </Button>
                <Button
                  onClick={handleCardPayment}
                  variant="outline"
                  className="flex items-center space-x-2 p-3 h-auto hover:bg-green-50 hover:border-green-300"
                >
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Cards</span>
                </Button>
                <Button
                  onClick={handleQRPayment}
                  variant="outline"
                  className="flex items-center space-x-2 p-3 h-auto hover:bg-orange-50 hover:border-orange-300"
                >
                  <QrCode className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">QR Code</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 p-3 h-auto opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Net Banking</span>
                </Button>
              </div>
            </div>

          {/* Status */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              You will be redirected to PhonePe's secure payment page to complete your transaction.
            </p>
          </div>

          {/* Powered by PhonePe */}
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-1">
              <span>Powered by</span>
              <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="font-medium">PhonePe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modals */}
      <UPIPopup
        isOpen={showUPIPopup}
        onClose={() => setShowUPIPopup(false)}
        onPaymentSuccess={handleUPISuccess}
        amount={finalAmount}
      />

      <CardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onPaymentSuccess={handleCardSuccess}
        amount={finalAmount}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onPaymentSuccess={handleQRSuccess}
        amount={finalAmount}
      />

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={finalAmount}
        paymentMethod={paymentDetails?.method || "Unknown"}
      />
    </div>
  );
}
