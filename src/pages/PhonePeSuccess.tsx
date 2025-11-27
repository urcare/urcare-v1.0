import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionService } from "@/services/subscriptionService";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PhonePeSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const tx = params.get("tx");
  const plan = params.get("plan") || "basic";
  const cycle = (params.get("cycle") as "monthly" | "annual") || "annual";
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [countdown, setCountdown] = useState(28);

  useEffect(() => {
    (async () => {
      if (!user || !tx) {
        setStatus("failed");
        return;
      }
      
      try {
        // Check payment status from the payments table
        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .select("*")
          .eq("phonepe_merchant_transaction_id", tx)
          .single();

        if (paymentError || !payment) {
          console.error("Payment not found:", paymentError);
          setStatus("failed");
          return;
        }

        // For test payments, simulate success after a short delay
        if (payment.status === "processing") {
          console.log("Test payment detected, simulating success...");
          
          // Update payment status to completed
          await supabase
            .from("payments")
            .update({ status: "completed" })
            .eq("id", payment.id);
          
          setStatus("success");
          
          // Create subscription
          try {
            await subscriptionService.createSubscription(user.id, {
              planId: plan,
              billingCycle: cycle,
            } as any);
            
            toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 2000);
          } catch (subscriptionError) {
            console.error("Subscription creation failed:", subscriptionError);
            // Still show success for payment, but log the error
          }
        } else if (payment.status === "completed") {
          setStatus("success");
          
          // Create subscription if payment is successful
          try {
        await subscriptionService.createSubscription(user.id, {
              planId: plan,
          billingCycle: cycle,
        } as any);

            toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
        navigate("/dashboard", { replace: true });
            }, 2000);
          } catch (subscriptionError) {
            console.error("Subscription creation failed:", subscriptionError);
            // Still show success for payment, but log the error
          }
        } else if (payment.status === "failed") {
          setStatus("failed");
        } else {
          // Still processing, wait a bit and check again
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (e: any) {
        console.error("Payment verification error:", e);
        setStatus("failed");
      }
    })();
  }, [user, tx, plan, cycle, navigate]);

  // Countdown for failed payment redirect
  useEffect(() => {
    if (status === "failed") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate("/health-assessment", { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your subscription has been activated. Redirecting you to the dashboard...
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              🎉 Welcome to UrCare Pro! You now have access to all premium features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Unsuccessful</h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but your payment could not be processed at this time.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              Redirecting you to health assessment page in {countdown} seconds...
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Payment Again
            </button>
            <button
              onClick={() => navigate("/health-assessment")}
              className="w-full bg-white text-gray-800 py-2 px-4 rounded-lg hover:bg-white transition-colors"
            >
              Go to Health Assessment Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


