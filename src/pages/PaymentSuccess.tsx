import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Sparkles, Shield, CreditCard } from "lucide-react";
import { checkPhonePeStatus, storePaymentRecord } from "@/services/phonepeBackendService";
import { subscriptionService } from "@/services/subscriptionService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [countdown, setCountdown] = useState(5);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');
  const planSlug = searchParams.get('plan') || 'basic';
  const billingCycle = searchParams.get('cycle') || 'annual';
  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!user || !orderId) {
      setStatus("failed");
      setError("Invalid payment session or missing transaction ID.");
      return;
    }

    // If this is a success redirect from PhonePe, handle it immediately
    if (isSuccess) {
      handleSuccessfulPayment();
    } else {
      checkPaymentStatus();
    }
  }, [user, orderId, isSuccess]);

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

  // Handle successful payment from PhonePe redirect
  const handleSuccessfulPayment = async () => {
    try {
      console.log("Handling successful payment from PhonePe redirect");
      
      // Store payment record as completed
      await storePaymentRecord(user!.id, orderId!, 100, "completed", planSlug, billingCycle);
      
      // Create subscription
      await subscriptionService.createSubscription(user!.id, { 
        planId: planSlug, 
        billingCycle: billingCycle 
      } as any);
      
      setStatus("success");
      setPaymentDetails({
        orderId: orderId,
        amount: 100,
        status: "completed",
        plan: planSlug,
        cycle: billingCycle
      });
      
      toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
    } catch (error) {
      console.error("Error handling successful payment:", error);
      setStatus("failed");
      setError("Failed to process payment completion.");
    }
  };

  const checkPaymentStatus = async () => {
    try {
      console.log("Checking PhonePe production payment status for:", orderId);

      // Use production service to check payment status
      const result = await checkPhonePeStatus(orderId!, user!.id);

      if (result.success && result.data && result.data.code === "PAYMENT_SUCCESS") {
        setStatus("success");
        setPaymentDetails(result.data.data);

        // Store payment record in our DB
        await storePaymentRecord(
          user!.id,
          orderId!,
          result.data.data.amount / 100, // Convert paise to rupees
          "completed",
          planSlug,
          billingCycle
        );

        // Create subscription
        await subscriptionService.createSubscription(user!.id, {
          planId: planSlug,
          billingCycle: billingCycle,
        } as any);

        toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
      } else if (result.data?.code === 'PAYMENT_PENDING') {
        // Still processing, check again
        setTimeout(() => {
          checkPaymentStatus();
        }, 2000);
      } else {
        setStatus("failed");
        setError(result.data?.message || "Payment failed or was not successful.");
        
        // Store failed payment record
        await storePaymentRecord(
          user!.id,
          orderId!,
          0,
          "failed",
          planSlug,
          billingCycle
        );
        
        toast.error("Payment failed or was cancelled");
        
        // Redirect to health assessment page after 3 seconds
        setTimeout(() => {
          navigate("/health-assessment");
        }, 3000);
      }
    } catch (err: any) {
      console.error("Error checking payment status:", err);
      setStatus("failed");
      setError(err.message || "Failed to verify payment status.");
      
      // Store failed payment record
      await storePaymentRecord(
        user!.id,
        orderId!,
        0,
        "failed",
        planSlug,
        billingCycle
      );
      
      // Redirect to health assessment page after 3 seconds
      setTimeout(() => {
        navigate("/health-assessment");
      }, 3000);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment status with PhonePe.</p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure verification in progress</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md relative overflow-hidden">
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-yellow-400 animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <CardContent className="p-8 text-center relative z-10">
            {/* Success Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully. Welcome to UrCare Pro!
            </p>

            {/* Payment Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs">{orderId?.substring(0, 20)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold capitalize">{planSlug} ({billingCycle})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">₹{paymentDetails?.amount ? (paymentDetails.amount / 100).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-semibold">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-800">PhonePe</span>
                </div>
              </div>
            </div>

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
            <Button onClick={() => navigate("/dashboard")} className="w-full bg-green-600 hover:bg-green-700">
              Go to Dashboard Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
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

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs">{orderId?.substring(0, 20)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="text-gray-800 capitalize">{planSlug} ({billingCycle})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-red-600 font-semibold">Failed</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={() => navigate("/paywall")} className="w-full">
                Try Again
              </Button>
              <Button onClick={() => navigate("/health-assessment")} variant="outline" className="w-full">
                Continue to Health Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

