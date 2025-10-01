import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { createPhonePePayment, storePaymentRecord } from "@/services/phonepeBackendService";

interface PhonePeGatewayProps {
  amount: number;
  userId: string;
  planSlug: string;
  billingCycle: string;
}

export default function PhonePeGateway({ amount, userId, planSlug, billingCycle }: PhonePeGatewayProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("🚀 PhonePeGateway mounted/rendered - CORRECT COMPONENT", {
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

      console.log("Initiating PhonePe production payment:", {
        orderId,
        amount: amountInPaise,
        userId,
        planSlug,
        billingCycle
      });

      // Store initial payment record
      await storePaymentRecord(userId, orderId, amountInPaise, "processing", planSlug, billingCycle);

      // Create PhonePe payment - calls real Edge Function
      const result = await createPhonePePayment(orderId, amountInPaise, userId, planSlug, billingCycle);

      if (result.success && result.redirectUrl) {
        console.log("Redirecting to PhonePe production payment page:", result.redirectUrl);
        
        // Redirect to PhonePe's actual payment page
        window.location.href = result.redirectUrl;
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
            <CardTitle>PhonePe Payment Gateway</CardTitle>
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

          {/* Payment Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800 text-center">
              You will be redirected to PhonePe's secure payment page where you can choose UPI, Cards, Net Banking, or QR Code.
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
                <Smartphone className="w-5 h-5 mr-2" />
                Pay ₹{amount.toFixed(2)} with PhonePe
              </div>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

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

    </div>
  );
}
