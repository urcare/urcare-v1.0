import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Subscription: React.FC = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (
    planId: string,
    billingCycle: "monthly" | "annual"
  ) => {
    navigate("/payment", { state: { plan: planId, cycle: billingCycle } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <SubscriptionPlans onPlanSelect={handlePlanSelect} />
      </div>
    </div>
  );
};

export default Subscription;
