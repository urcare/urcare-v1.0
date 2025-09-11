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
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
          Restore
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full">
        {/* Main Headline */}
        <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-8">
          Start your 3-day FREE trial to continue.
        </h1>

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
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Monthly Option */}
          <div
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              billingCycle === "monthly"
                ? "border-black"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            <div className="text-center">
              <h3 className="font-medium text-black text-sm mb-1">Monthly</h3>
              <p className="text-black text-sm">$12.99 /mo</p>
            </div>
            <div
              className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 ${
                billingCycle === "monthly"
                  ? "border-black bg-black"
                  : "border-gray-300 bg-white"
              }`}
            >
              {billingCycle === "monthly" && (
                <Check className="w-2.5 h-2.5 text-white mx-auto mt-0.5" />
              )}
            </div>
          </div>

          {/* Yearly Option */}
          <div
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              billingCycle === "annual"
                ? "border-black"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setBillingCycle("annual")}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                3 DAYS FREE
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-black text-sm mb-1">Yearly</h3>
              <p className="text-black text-sm">$3.33/mo</p>
            </div>
            <div
              className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 ${
                billingCycle === "annual"
                  ? "border-black bg-black"
                  : "border-gray-300 bg-white"
              }`}
            >
              {billingCycle === "annual" && (
                <Check className="w-2.5 h-2.5 text-white mx-auto mt-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Check className="w-4 h-4 text-black" />
          <span className="text-black text-sm">No Payment Due Now</span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleSubscribe}
          disabled={isCreatingTrial || !canClaimTrial}
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-lg text-base transition-colors disabled:bg-gray-400"
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
        <p className="text-center text-gray-500 text-xs mt-3">
          3 days free, then $39.99 per year ($3.33/mo)
        </p>
      </div>

      {/* iOS Home Indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default Paywall;
