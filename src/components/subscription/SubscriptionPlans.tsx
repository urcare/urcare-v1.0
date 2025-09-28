import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/subscription";
import { Check, Crown, Heart, Star, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SubscriptionPlansProps {
  onPlanSelect: (planId: string, billingCycle: "monthly" | "annual") => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onPlanSelect,
}) => {
  const { profile } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [loading, setLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    fetchPlans();
    checkFirstTimeUser();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Error fetching plans:", error);
        return;
      }

      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkFirstTimeUser = async () => {
    if (!profile?.id) return;

    try {
      const { data: existingPayments } = await supabase
        .from("payments")
        .select("id")
        .eq("user_id", profile.id)
        .eq("status", "completed")
        .limit(1);

      setIsFirstTime(!existingPayments || existingPayments.length === 0);
    } catch (error) {
      console.error("Error checking first-time user:", error);
    }
  };

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case "basic":
        return <Heart className="h-6 w-6" />;
      case "family":
        return <Users className="h-6 w-6" />;
      case "elite":
        return <Crown className="h-6 w-6" />;
      default:
        return <Heart className="h-6 w-6" />;
    }
  };

  const getPlanColor = (slug: string) => {
    switch (slug) {
      case "basic":
        return "text-blue-500";
      case "family":
        return "text-green-500";
      case "elite":
        return "text-purple-500";
      default:
        return "text-blue-500";
    }
  };

  const calculatePrice = (plan: SubscriptionPlan) => {
    if (isFirstTime) {
      return billingCycle === "monthly"
        ? plan.price_first_time_monthly ?? plan.price_monthly
        : plan.price_first_time_annual ?? plan.price_annual;
    }

    return billingCycle === "monthly" ? plan.price_monthly : plan.price_annual;
  };

  const calculateSavings = (plan: SubscriptionPlan) => {
    if (billingCycle === "annual") {
      const monthlyTotal = plan.price_monthly * 12;
      return monthlyTotal - plan.price_annual;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Health Plan
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Unlock the full potential of your health journey
        </p>

        {isFirstTime && (
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Special first-time pricing available!
          </div>
        )}

        <div className="flex items-center justify-center space-x-4 mb-8">
          <span
            className={`text-sm font-medium ${
              billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === "annual" ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              billingCycle === "annual" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Annual
          </span>
          {billingCycle === "annual" && (
            <span className="text-sm text-green-600 font-medium">
              Save up to 30%
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price = calculatePrice(plan);
          const savings = calculateSavings(plan);
          const isPopular = plan.is_popular;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-8 ${
                isPopular
                  ? "border-blue-500 shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300"
              } transition-all duration-200`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`inline-flex p-3 rounded-full bg-gray-100 mb-4 ${getPlanColor(
                    plan.slug
                  )}`}
                >
                  {getPlanIcon(plan.slug)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="text-green-600 font-medium mb-2">
                    Save ₹{savings} per year
                  </div>
                )}

                {isFirstTime &&
                  (plan.price_first_time_monthly ||
                    plan.price_first_time_annual) && (
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="line-through">
                        ₹
                        {billingCycle === "monthly"
                          ? plan.price_monthly
                          : plan.price_annual}
                      </span>
                      <span className="ml-2 text-green-600 font-medium">
                        First-time discount!
                      </span>
                    </div>
                  )}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onPlanSelect(plan.id, billingCycle)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {isFirstTime ? "Start Free Trial" : "Get Started"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Secure payments
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Cancel anytime
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            24/7 support
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
