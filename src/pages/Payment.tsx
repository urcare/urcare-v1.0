import PaymentForm from "@/components/payment/PaymentForm";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/subscription";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  useEffect(() => {
    const { plan: planId, cycle } = location.state || {};

    if (!planId) {
      toast.error("No plan selected");
      navigate("/subscription");
      return;
    }

    setBillingCycle(cycle || "monthly");
    fetchPlan(planId);
  }, [location.state, navigate]);

  const fetchPlan = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error || !data) {
        toast.error("Plan not found");
        navigate("/subscription");
        return;
      }

      setPlan(data);
    } catch (error) {
      console.error("Error fetching plan:", error);
      toast.error("Failed to load plan details");
      navigate("/subscription");
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = (plan: SubscriptionPlan) => {
    return billingCycle === "monthly" ? plan.price_monthly : plan.price_annual;
  };

  const handleBack = () => {
    navigate("/subscription");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Plan not found
          </h2>
          <button
            onClick={() => navigate("/subscription")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PaymentForm
        planId={plan.id}
        planName={plan.name}
        billingCycle={billingCycle}
        amount={calculateAmount(plan)}
        onBack={handleBack}
      />
    </div>
  );
};

export default Payment;
