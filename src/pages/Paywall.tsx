import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { trialService } from "@/services/trialService";
import { ArrowLeft, Bell, Check, Crown, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Paywall: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );
  const [isCreatingTrial, setIsCreatingTrial] = useState(false);
  const [trialStatus, setTrialStatus] = useState<any>(null);
  const [canClaimTrial, setCanClaimTrial] = useState(true);

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (!user?.id) return;

      try {
        const status = await trialService.getTrialStatus(user.id);
        setTrialStatus(status);
        setCanClaimTrial(status.canClaimTrial);
      } catch (error) {
        console.error("Error checking trial status:", error);
      }
    };

    checkTrialStatus();
  }, [user]);

  // Handle payment success redirect
  useEffect(() => {
    const handlePaymentSuccess = () => {
      // Check if user came back from successful payment
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get("payment_success");

      if (paymentSuccess === "true") {
        toast.success("🎉 Payment successful! Welcome to UrCare Assistant!");
        // Redirect to dashboard with access unlocked
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    };

    handlePaymentSuccess();
  }, []);

  const handleStartTrial = async () => {
    if (!user?.id) {
      toast.error("Please log in to start your trial");
      return;
    }

    if (!canClaimTrial) {
      toast.error("You have already claimed your trial");
      return;
    }

    setIsCreatingTrial(true);
    try {
      const success = await trialService.startTrial(user.id);

      if (success) {
        toast.success("🎉 Welcome to your 3-day free trial!");
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        toast.error("Failed to start trial. Please try again.");
      }
    } catch (error) {
      console.error("Error starting trial:", error);
      toast.error("Error starting trial. Please try again.");
    } finally {
      setIsCreatingTrial(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }

    // For now, start trial instead of full subscription
    await handleStartTrial();
  };

  // Calculate trial end date (3 days from now)
  const getTrialEndDate = () => {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 3);
    return trialEnd.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
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
      <div className="max-w-md mx-auto px-6 pb-8">
        {/* Main Headline */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Start your 3-day FREE trial to continue.
          </h1>
          <p className="text-gray-600 text-base">
            Unlock all features and get the most out of your health journey
          </p>
        </div>

        {/* Trial Timeline */}
        <div className="space-y-6 mb-8">
          {/* Today */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
                <Lock className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="absolute top-4 left-2 w-0.5 h-8 bg-orange-500"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black text-sm">Today</h3>
              <p className="text-gray-500 text-sm">
                Unlock all the app's features like AI calorie scanning and more.
              </p>
            </div>
          </div>

          {/* In 2 Days */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
                <Bell className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="absolute top-4 left-2 w-0.5 h-8 bg-gray-300"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black text-sm">
                In 2 Days - Reminder
              </h3>
              <p className="text-gray-500 text-sm">
                We'll send you a reminder that your trial is ending soon.
              </p>
            </div>
          </div>

          {/* In 3 Days */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black text-sm">
                In 3 Days - Billing Starts
              </h3>
              <p className="text-gray-500 text-sm">
                You'll be charged on {getTrialEndDate()} unless you cancel
                anytime before.
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Options */}
        <div className="space-y-4 mb-8">
          {/* Monthly Option */}
          <div
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-sm ${
              billingCycle === "monthly"
                ? "border-black shadow-lg"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-black text-lg mb-1">
                  Monthly
                </h3>
                <p className="text-gray-600 text-sm">₹599 /mo</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  billingCycle === "monthly"
                    ? "border-black bg-black"
                    : "border-gray-300 bg-white"
                }`}
              >
                {billingCycle === "monthly" && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Yearly Option */}
          <div
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all bg-white shadow-sm ${
              billingCycle === "annual"
                ? "border-black shadow-lg"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
            onClick={() => setBillingCycle("annual")}
          >
            <div className="absolute -top-3 left-6">
              <div className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                3 DAYS FREE
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-black text-lg mb-1">
                  Yearly
                </h3>
                <p className="text-gray-600 text-sm">₹416.58 /mo</p>
                <p className="text-green-600 text-xs font-medium mt-1">
                  Save 30%
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  billingCycle === "annual"
                    ? "border-black bg-black"
                    : "border-gray-300 bg-white"
                }`}
              >
                {billingCycle === "annual" && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-gray-600 text-sm font-medium">
            No Payment Due Now
          </span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleSubscribe}
          disabled={isCreatingTrial || !canClaimTrial}
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl text-base transition-all duration-200 disabled:bg-gray-400 shadow-lg hover:shadow-xl"
        >
          {isCreatingTrial ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Starting Trial...
            </>
          ) : !canClaimTrial ? (
            "Trial Already Claimed"
          ) : (
            "Start My 3-Day Free Trial"
          )}
        </Button>

        {/* Fine Print */}
        <div className="text-center mt-4 space-y-1">
          <p className="text-gray-500 text-xs">
            3 days free, then ₹4,999 per year (₹416.58/mo)
          </p>
          <p className="text-gray-400 text-xs">
            Cancel anytime. No commitment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
