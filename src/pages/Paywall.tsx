import RazorpayPaymentButton from "@/components/payment/RazorpayPaymentButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Bell, Check, Heart, Watch } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Paywall: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  // Handle payment success redirect
  useEffect(() => {
    const handlePaymentSuccess = () => {
      // Check if user came back from successful payment
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get("payment_success");

      if (paymentSuccess === "true") {
        toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
        // Redirect to dashboard with access unlocked
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    };

    handlePaymentSuccess();
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }

    console.log("Subscribe button clicked, showing payment button");
    // Show payment button
    setShowPaymentButton(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
    console.log("Payment success callback triggered");

    // Redirect to dashboard with access unlocked
    setTimeout(() => {
      console.log("Redirecting to dashboard after successful payment");
      window.location.href = "/dashboard";
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
    setShowPaymentButton(false);
  };

  const handlePaymentCancel = () => {
    toast.info("Payment cancelled");
    setShowPaymentButton(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium">
          Restore
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 pb-6">
        {/* App Icon */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/brand.png" alt="UrCare Logo" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscribe to UrCare Pro
          </h1>
          <p className="text-gray-600 text-base">
            Choose your plan and start your health journey today.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-6">
          {/* All Features */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Bell className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                All Features
              </h3>
              <p className="text-gray-600 text-sm">
                Nutrition, Journal, Insights, and more
              </p>
            </div>
          </div>

          {/* Historical Data */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                Historical Data
              </h3>
              <p className="text-gray-600 text-sm">
                View all data, insights, and trends
              </p>
            </div>
          </div>

          {/* Apple Watch */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Watch className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                Apple Watch
              </h3>
              <p className="text-gray-600 text-sm">
                Access to strength training and smart alarms
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Monthly Option */}
          <div
            className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-lg ${
              billingCycle === "monthly"
                ? "border-emerald-500 shadow-emerald-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-2xl mb-2">
                Monthly
              </h3>
              <p className="text-emerald-600 text-base font-bold mb-1">
                $9.99/mo
              </p>
              <p className="text-red-500 text-xs font-medium mb-2">
                Only 300 spots left
              </p>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto ${
                  billingCycle === "monthly"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {billingCycle === "monthly" && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Yearly Option */}
          <div
            className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-lg ${
              billingCycle === "annual"
                ? "border-emerald-500 shadow-emerald-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setBillingCycle("annual")}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Save 50%
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-2xl mb-2">
                Yearly
              </h3>
              <p className="text-emerald-600 text-base font-bold mb-1">
                $59.99
              </p>
              <p className="text-red-500 text-xs font-medium mb-2">
                Only 1200 spots left
              </p>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto ${
                  billingCycle === "annual"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {billingCycle === "annual" && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button or Payment Button */}
        {showPaymentButton ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Complete Your Subscription
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Secure payment powered by Razorpay
              </p>
            </div>
            <RazorpayPaymentButton
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
              planType={billingCycle}
              className="w-full"
            />
            <Button
              onClick={() => setShowPaymentButton(false)}
              variant="outline"
              className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
              Back to Plans
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleSubscribe}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            Subscribe Now
          </Button>
        )}

        {/* Fine Print */}
        <div className="text-center mt-4 space-y-1">
          <p className="text-gray-500 text-xs">
            Doesn't work? Money back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
