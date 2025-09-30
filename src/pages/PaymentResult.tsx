import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionService } from "@/services/subscriptionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function PaymentResult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [countdown, setCountdown] = useState(5);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get transaction ID from URL params
  const urlParams = new URLSearchParams(location.search);
  const transactionId = urlParams.get('transactionId');
  const planSlug = urlParams.get('plan') || 'basic';
  const billingCycle = urlParams.get('cycle') as 'monthly' | 'annual' || 'annual';

  useEffect(() => {
    if (!user || !transactionId) {
      setStatus("failed");
      setError("Invalid payment session");
      return;
    }

    checkPaymentStatus();
  }, [user, transactionId]);

  // Countdown timer for success redirect
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      navigate("/dashboard");
    }
  }, [status, countdown, navigate]);

  const checkPaymentStatus = async () => {
    if (!user || !transactionId) return;

    try {
      console.log("Checking payment status for transaction:", transactionId);

      // Try Supabase Edge Function first
      try {
        const { data, error } = await supabase.functions.invoke('phonepe-payment-status', {
          body: {
            transactionId: transactionId,
            userId: user.id
          }
        });

        if (error) {
          throw error;
        }

        console.log("Payment status response:", data);

        if (data && data.code === "PAYMENT_SUCCESS") {
          setStatus("success");
          setPaymentDetails(data);
          
          // Create subscription if payment is successful
          try {
            await subscriptionService.createSubscription(user.id, {
              planId: planSlug,
              billingCycle: billingCycle,
            } as any);
            
            toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
          } catch (subscriptionError) {
            console.error("Subscription creation failed:", subscriptionError);
            // Don't fail the payment flow if subscription creation fails
          }
          return;
        } else {
          setStatus("failed");
          setError(data?.message || "Payment failed or was cancelled");
          return;
        }
      } catch (functionError) {
        console.log("Supabase function not available, using fallback:", functionError);
      }

      // Fallback: Check payment status from database
      console.log("Using fallback payment status check...");
      
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('phonepe_merchant_transaction_id', transactionId)
        .eq('user_id', user.id)
        .single();

      if (paymentError || !payment) {
        console.error("Payment not found:", paymentError);
        setStatus("failed");
        setError("Payment not found");
        return;
      }

      // Check payment status
      if (payment.status === "completed") {
        setStatus("success");
        setPaymentDetails({
          code: "PAYMENT_SUCCESS",
          amount: payment.amount * 100,
          message: "Payment successful",
          transactionId: transactionId
        });

        // Create subscription if payment is successful
        try {
          await subscriptionService.createSubscription(user.id, {
            planId: planSlug,
            billingCycle: billingCycle,
          } as any);
          
          toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
        } catch (subscriptionError) {
          console.error("Subscription creation failed:", subscriptionError);
          // Don't fail the payment flow if subscription creation fails
        }
      } else if (payment.status === "failed") {
        setStatus("failed");
        setError("Payment failed or was cancelled");
      } else {
        // Still processing - wait a bit and check again
        console.log("Payment still processing, waiting...");
        setTimeout(() => {
          checkPaymentStatus();
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error checking payment status:", err);
      setStatus("failed");
      setError(err.message || "Failed to verify payment");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoToHealthAssessment = () => {
    navigate("/health-assessment");
  };

  const handleRetry = () => {
    navigate("/paywall");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment status.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            {/* Success Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-green-200 rounded-full mx-auto animate-ping"></div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully. Welcome to UrCare Pro!
            </p>

            {/* Payment Details */}
            {paymentDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{transactionId?.substring(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">₹{paymentDetails.amount ? (paymentDetails.amount / 100).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-semibold">Completed</span>
                  </div>
                </div>
              </div>
            )}

            {/* Countdown Timer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                Redirecting to Dashboard in {countdown} seconds...
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={handleGoToDashboard} className="w-full bg-green-600 hover:bg-green-700">
                Go to Dashboard Now
              </Button>
              <Button onClick={handleRetry} variant="outline" className="w-full">
                Make Another Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            {/* Failure Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>

            {/* Failure Message */}
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">
              {error || "We're sorry, but your payment could not be processed at this time."}
            </p>

            {/* Transaction Details */}
            {transactionId && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{transactionId.substring(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-red-600 font-semibold">Failed</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button onClick={handleGoToHealthAssessment} variant="outline" className="w-full">
                Go to Health Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
