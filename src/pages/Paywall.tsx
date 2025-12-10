import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Paywall() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    fetchPlans();
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
        toast.error("Failed to load subscription plans");
        return;
      }

      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (billingCycle: "monthly" | "annual") => {
    if (billingCycle === "monthly") {
      navigate("/payment/monthly");
    } else {
      navigate("/payment/annual");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-logo-text" />
          <p className="text-text-secondary">Loading plans...</p>
        </div>
      </div>
    );
  }

  // Default plans if none found in database
  const defaultPlans = [
    {
      name: "UrCare Monthly",
      slug: "basic",
      price_monthly: "849",
      price_annual: "4999",
      description: "Full access to all UrCare features",
    },
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;
  const plan = displayPlans[0];

  const monthlyPrice = plan?.price_monthly || "849";
  const annualPrice = plan?.price_annual || "4999";
  const monthlySavings = Math.round(((parseFloat(monthlyPrice) * 12 - parseFloat(annualPrice)) / (parseFloat(monthlyPrice) * 12)) * 100);

  const benefits = [
    "Unlimited AI health consultations",
    "Personalized meal plans",
    "Advanced health tracking",
    "Family health dashboard",
    "Priority customer support",
    "Exclusive wellness content",
  ];

  return (
    <div className="min-h-screen bg-app-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h1>
          </div>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setSelectedBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedBillingCycle === "monthly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedBillingCycle("annual")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedBillingCycle === "annual"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              {monthlySavings > 0 && (
                <Badge className="ml-2 bg-green-500 text-white">
                  Save {monthlySavings}%
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Monthly Plan */}
          <Card className={`${selectedBillingCycle === "monthly" ? "border-2 border-blue-500" : ""}`}>
            <CardHeader className="text-center">
              <div className="inline-flex p-3 rounded-full bg-blue-100 mb-4">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">Monthly Plan</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">₹{monthlyPrice}</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <CardDescription className="mt-2">
                Billed monthly, cancel anytime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleSelectPlan("monthly")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                variant={selectedBillingCycle === "monthly" ? "default" : "outline"}
              >
                Choose Monthly
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className={`${selectedBillingCycle === "annual" ? "border-2 border-blue-500" : ""} relative`}>
            {monthlySavings > 0 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1">
                  Best Value - Save {monthlySavings}%
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <div className="inline-flex p-3 rounded-full bg-blue-100 mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">Annual Plan</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">₹{annualPrice}</span>
                <span className="text-gray-500 ml-2">/year</span>
              </div>
              <CardDescription className="mt-2">
                <span className="text-gray-400 line-through">₹{parseFloat(monthlyPrice) * 12}</span>
                {" "}Just ₹{Math.round(parseFloat(annualPrice) / 12)}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleSelectPlan("annual")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                variant={selectedBillingCycle === "annual" ? "default" : "outline"}
              >
                Choose Annual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-600">
          <p>All plans include a 7-day money-back guarantee</p>
          <p className="mt-2">Secure payment via PhonePe, UPI, Cards & Net Banking</p>
        </div>
      </div>
    </div>
  );
}

