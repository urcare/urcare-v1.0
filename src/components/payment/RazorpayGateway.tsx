import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, CreditCard, Smartphone, QrCode, Building2, X } from "lucide-react";
import { toast } from "sonner";
import { createRazorpayOrder, openRazorpayCheckout, verifyRazorpayPayment } from "@/services/razorpayService";

interface RazorpayGatewayProps {
  amount: number;
  userId: string;
  planSlug: string;
  billingCycle: string;
}

export default function RazorpayGateway({ amount, userId, planSlug, billingCycle }: RazorpayGatewayProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRPopup, setShowQRPopup] = useState(false);

  console.log("🚀 RazorpayGateway mounted/rendered", {
    amount,
    userId,
    planSlug,
    billingCycle
  });

  const handlePayment = async () => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Convert amount to paise (₹1 = 100 paise)
      const amountInPaise = Math.round(amount * 100);

      console.log("Initiating Razorpay payment:", {
        orderId,
        amount: amountInPaise,
        userId,
        planSlug,
        billingCycle
      });

      // Create Razorpay order
      const orderData = await createRazorpayOrder(orderId, amountInPaise, userId, planSlug, billingCycle);

      if (orderData.success && orderData.orderId) {
        console.log("Razorpay order created, opening checkout:", orderData);
        
        // Open Razorpay checkout
        await openRazorpayCheckout(
          orderData,
          async (response) => {
            console.log("Payment successful:", response);
            
            try {
              // Verify payment
              const verification = await verifyRazorpayPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
                userId,
                planSlug,
                billingCycle
              );

              if (verification.success && verification.verified) {
                console.log("Payment verified successfully");
                toast.success("Payment successful! Redirecting to dashboard...");
                
                // Redirect to dashboard on success
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              } else {
                console.error("Payment verification failed");
                toast.error("Payment verification failed");
                setError("Payment verification failed");
              }
            } catch (verifyError) {
              console.error("Payment verification error:", verifyError);
              toast.error("Payment verification failed");
              setError("Payment verification failed");
            }
          },
          (error) => {
            console.error("Payment failed:", error);
            toast.error("Payment failed");
            setError("Payment failed");
            setLoading(false);
          }
        );
      } else {
        throw new Error("Failed to create payment order");
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Payment initiation failed");
      setLoading(false);
      toast.error("Payment failed: " + (err.message || "Unknown error"));
    }
  };

  const handleGoBack = () => {
    navigate("/paywall");
  };

  const handlePayByQR = () => {
    setShowQRPopup(true);
  };

  const handleCloseQR = () => {
    setShowQRPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGoBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <CardTitle>Payment Gateway (Razorpay)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="font-medium capitalize">{planSlug} ({billingCycle})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-lg font-bold text-blue-600">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Options Preview */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-3">Available Payment Methods</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Smartphone className="w-4 h-4" />
                <span>UPI</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>Net Banking</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800 text-center">
              You will be redirected to Razorpay's secure payment page where you can choose from multiple payment options including Cards, UPI, QR Code, Net Banking, and Wallets.
            </p>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ₹{amount.toFixed(2)} Now
              </div>
            )}
          </Button>

          {/* Pay by QR Button */}
          <Button
            onClick={handlePayByQR}
            disabled={loading}
            variant="outline"
            className="w-full mt-3 border-purple-300 text-purple-600 hover:bg-purple-50 py-4 text-base font-medium rounded-lg transition-all"
          >
            <QrCode className="w-5 h-5 mr-2" />
            I will Pay by QR
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Powered by Razorpay */}
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-1">
              <span>Powered by</span>
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <span className="font-medium">Razorpay</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Popup */}
      <Dialog open={showQRPopup} onOpenChange={setShowQRPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Pay with QR Code</span>
              <button
                onClick={handleCloseQR}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </DialogTitle>
            <DialogDescription>
              Scan the QR code below with any UPI app to complete your payment
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 py-4">
            {/* QR Code Image */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-lg">
              <img 
                src="/qr-code-upi.svg" 
                alt="QR Code for Payment" 
                className="w-64 h-64 object-contain"
                onError={(e) => {
                  // Fallback to a generated QR code or placeholder
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* Fallback QR Code */}
              <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hidden">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR Code</p>
                  <p className="text-xs text-gray-400 mt-1">Amount: ₹{amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-blue-800">₹{amount.toFixed(2)}</p>
                <p className="text-sm text-blue-600">Plan: {planSlug} ({billingCycle})</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full">
              <div className="text-center">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  📱 Scan with any UPI app
                </p>
                <p className="text-xs text-yellow-700">
                  After payment, please wait sometime. We will activate your subscription once payment is confirmed.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 w-full">
              <Button
                onClick={handleCloseQR}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowQRPopup(false);
                  navigate("/dashboard");
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Payment Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
