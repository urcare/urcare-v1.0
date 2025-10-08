import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionService } from "@/services/subscriptionService";
import { ArrowLeft, Brain, Check, Heart, Lock, TrendingUp } from "lucide-react";
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
  const [priceMonthly, setPriceMonthly] = useState<number | null>(9.57);
  const [priceAnnual, setPriceAnnual] = useState<number | null>(56.36);
  const [originalMonthly, setOriginalMonthly] = useState<number | null>(19.99);
  const [originalAnnual, setOriginalAnnual] = useState<number | null>(149.99);

  // Fixed INR prices
  const priceMonthlyINR = 849;
  const priceAnnualINR = 4999;

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "";
    return `$${amount.toFixed(2)}`;
  };

  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };


  // Load live pricing so cards match checkout
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const plans = await subscriptionService.getSubscriptionPlans();
        const basicPlan: any =
          plans.find((p: any) => p.slug === "basic") ?? plans[0];

        // If no user, treat as not first-time to avoid overpromising
        const isFirstTime = user
          ? await subscriptionService.isEligibleForFirstTimePricing(user.id)
          : false;

        // Use converted USD prices regardless of database values
        const monthly = 9.57; // ₹849 converted to USD
        const yearly = 56.36; // ₹4,999 converted to USD

        setPriceMonthly(monthly);
        setPriceAnnual(yearly);
        setOriginalMonthly(19.99);
        setOriginalAnnual(149.99);

        console.log("Loaded pricing:", {
          monthly: monthly,
          yearly: yearly,
          originalMonthly: 19.99,
          originalAnnual: 149.99,
        });
      } catch (err) {
        // Fallbacks keep UI functional
        setPriceMonthly((prev) => prev ?? 9.57);
        setPriceAnnual((prev) => prev ?? 56.36);
        setOriginalMonthly((prev) => prev ?? 19.99);
        setOriginalAnnual((prev) => prev ?? 149.99);
      }
    };

    loadPricing();
  }, [user]);

  const handleSubscribe = async () => {
    console.log("🔘 Subscribe button clicked!");
    console.log("User:", user);
    console.log("Billing cycle:", billingCycle);
    console.log("Hostname:", window.location.hostname);
    console.log("Current URL:", window.location.href);
    
    // For localhost development, allow navigation without user
    if (!user && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      toast.error("Please log in to subscribe");
      return;
    }

    console.log("✅ Proceeding with Razorpay payment");
    
    // Razorpay payment links
    const monthlyRazorpayLink = "https://razorpay.me/@urcare?amount=vy%2F7jJNxh9pvHsb2%2Bqs52w%3D%3D";
    const yearlyRazorpayLink = "https://razorpay.me/@urcare?amount=6zcPuaHTrIB8Jllw5habFw%3D%3D";
    
    // Redirect to appropriate Razorpay link based on billing cycle
    try {
      const razorpayLink = billingCycle === 'annual' ? yearlyRazorpayLink : monthlyRazorpayLink;
      console.log("Redirecting to Razorpay:", razorpayLink);
      console.log("Billing cycle selected:", billingCycle);
      console.log("Razorpay link being used:", razorpayLink);
      
      // Add success redirect URL to Razorpay link
      const successUrl = `${window.location.origin}/payment-success?plan=${billingCycle === 'annual' ? 'yearly' : 'monthly'}&cycle=${billingCycle}`;
      const finalRazorpayLink = `${razorpayLink}&redirect_url=${encodeURIComponent(successUrl)}`;
      
      console.log("Final Razorpay link with redirect:", finalRazorpayLink);
      console.log("About to redirect to:", finalRazorpayLink);
      
      // Open Razorpay link in the same tab
      console.log("🚀 Executing redirect to Razorpay...");
      window.location.href = finalRazorpayLink;
      
      // Fallback: if redirect doesn't work, try after a short delay
      setTimeout(() => {
        if (window.location.href.includes('paycheckout')) {
          console.log("⚠️ Redirect to paycheckout detected, forcing Razorpay redirect");
          window.location.replace(finalRazorpayLink);
        }
      }, 1000);
      
      console.log("✅ Razorpay redirect successful");
    } catch (error) {
      console.error("❌ Razorpay redirect failed:", error);
      toast.error("Payment redirect failed. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("🎉 Payment successful! Welcome to UrCare Pro!");
    console.log("Payment success callback triggered");

    // Redirect to health plan generation after successful payment
    setTimeout(() => {
      console.log("Redirecting to health plan generation after successful payment");
      window.location.href = "/health-plan-generation";
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
            Your Health Can't Wait—Why Should You?
          </h1>
          <p className="text-gray-600 text-base mb-4">
            In weeks, shift from managing symptoms
            <br />~ to reversing root causes.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-800 text-sm font-medium">
              Created by Doctors for UrCare—backed by clinical research &
              science.
            </p>
          </div>
        </div>

        {/* Offer Highlights - Scrollable */}
        <div className="mb-6">
          <div className="max-h-80 overflow-y-auto space-y-4 scrollbar-hide relative smooth-scroll pb-4">
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
            {/* Gradient fade at top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
            {/* Reverse Lifestyle Disorders */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  Reverse Lifestyle Disorders
                </h3>
                <p className="text-gray-600 text-sm">
                  Target root causes of diabetes, PCOS, hypertension, obesity,
                  stress & more.
                </p>
              </div>
            </div>

            {/* UrHealth Twin */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  UrHealth Twin
                </h3>
                <p className="text-gray-600 text-sm">
                  Adaptive, personalized protocols that evolve daily with you—no
                  one-size-fits-all.
                </p>
              </div>
            </div>

            {/* Pre-Launch Access */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <div className="text-2xl">⚡</div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  Pre-Launch Access
                </h3>
                <p className="text-gray-600 text-sm">
                  Pre-Launch Only: 1,500 Seats. Once filled, doors close.
                </p>
              </div>
            </div>

            {/* Blockchain-Secured Data */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  Blockchain-Secured Data
                </h3>
                <p className="text-gray-600 text-sm">
                  Your health info stays private, always.
                </p>
              </div>
            </div>

            {/* Continuous Major Upgrades */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  Continuous Major Upgrades
                </h3>
                <p className="text-gray-600 text-sm">
                  Monthly additions of new therapies, self-assessments, and
                  science-backed features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Yearly Option - Most Popular */}
          <div
            className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all shadow-md ${
              billingCycle === "annual"
                ? "border-orange-500 bg-white shadow-orange-500/20"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
            onClick={() => setBillingCycle("annual")}
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="bg-orange-500 text-white text-[7px] px-1 py-0.5 rounded-full font-medium text-center">
                VALUE FOR MONEY
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-base mb-1">
                Yearly
              </h3>
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-gray-900 text-base font-bold">
                  {formatCurrency(priceAnnual ?? 56.36)}
                </p>
                <span className="text-gray-500 text-sm">or</span>
                <p className="text-gray-900 text-base font-bold">
                  {formatINR(priceAnnualINR)}
                </p>
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-gray-400 text-xs line-through">
                  {formatCurrency(149.99)}
                </span>
                <span className="bg-orange-100 text-orange-600 text-xs px-1 py-0.5 rounded font-medium">
                  {priceAnnual !== null
                    ? `Save ${formatCurrency(
                        Math.max(0, 149.99 - priceAnnual)
                      )}`
                    : ""}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-1">
                {priceAnnual
                  ? `Only ${formatCurrency((priceAnnual ?? 56.36) / 12)}/month`
                  : ""}
              </p>
              <p className="text-gray-400 text-xs mb-1">
                Only for founding members of UrCare
              </p>
              <p className="text-red-600 text-xs font-medium mb-2">
                Only 300 spots left
              </p>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto ${
                  billingCycle === "annual"
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {billingCycle === "annual" && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Monthly Option */}
          <div
            className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all shadow-md ${
              billingCycle === "monthly"
                ? "border-orange-500 bg-white shadow-orange-500/20"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="bg-orange-500 text-white text-[7px] px-1 py-0.5 rounded-full font-medium text-center">
                FLEXIBLE
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-base mb-1">
                Monthly
              </h3>
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-gray-900 text-base font-bold">
                  {formatCurrency(priceMonthly ?? 9.57)}
                </p>
                <span className="text-gray-500 text-sm">or</span>
                <p className="text-gray-900 text-base font-bold">
                  {formatINR(priceMonthlyINR)}
                </p>
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-gray-400 text-xs line-through">
                  {formatCurrency(originalMonthly ?? 19.99)}
                </span>
                <span className="bg-orange-100 text-orange-600 text-xs px-1 py-0.5 rounded font-medium">
                  {priceMonthly !== null && originalMonthly !== null
                    ? `Save ${formatCurrency(
                        Math.max(0, originalMonthly - priceMonthly)
                      )}`
                    : ""}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-1">per month</p>
              <p className="text-gray-400 text-xs mb-1">Standard pricing</p>
              <p className="text-red-600 text-xs font-medium mb-2">
                Only 1200 spots left
              </p>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto ${
                  billingCycle === "monthly"
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {billingCycle === "monthly" && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔘 Button clicked - event:", e);
            handleSubscribe();
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          type="button"
        >
          Subscribe Now
        </Button>

        {/* Fine Print */}
        <div className="text-center mt-4 space-y-1">
          <p className="text-gray-500 text-xs">
            Doesn't work? Money back guarantee
          </p>
          <p className="text-gray-500 text-xs">
            By subscribing, you agree to our{" "}
            <button
              onClick={() => navigate("/legal")}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Terms & Conditions
            </button>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Paywall;