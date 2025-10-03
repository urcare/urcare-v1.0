import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  planSlug?: string;
  billingCycle: "monthly" | "annual";
  onSuccess: () => void;
  onError: (msg: string) => void;
  onCancel: () => void;
  className?: string;
};

export default function PhonePeCheckout({
  planSlug = "basic",
  billingCycle,
  onSuccess,
  onError,
  onCancel,
  className,
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(async () => {
    if (!user) return onError("Not authenticated");
    setLoading(true);
    
    try {
      // Get the actual plan ID from the database using the slug
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id, price_monthly, price_annual')
        .eq('slug', planSlug)
        .eq('is_active', true)
        .single();

      if (planError || !plan) {
        console.error('Plan not found:', planError);
        onError('Subscription plan not found');
        setLoading(false);
        return;
      }

      const priceINR = billingCycle === "monthly" ? plan.price_monthly : plan.price_annual;
      
      console.log("Redirecting to payment page with data:", {
        planSlug,
        billingCycle,
        amount: priceINR
      });

      // Navigate to the payment page with the plan data
      navigate("/paymentpage", {
        state: {
          planSlug: planSlug,
          billingCycle: billingCycle,
          amount: priceINR
        }
      });
      
      setLoading(false);
    } catch (e: any) {
      console.error("Payment initiation error:", e);
      onError(e?.message || "Payment failed");
      setLoading(false);
    }
  }, [user, planSlug, billingCycle, onError, navigate]);

  return (
    <div className="space-y-4">
      <Button onClick={startCheckout} disabled={loading} className={className}>
        {loading ? "Processing..." : "Pay with PhonePe"}
      </Button>
      <Button
        variant="ghost"
        onClick={onCancel}
        disabled={loading}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
}
