import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionService } from "@/services/subscriptionService";
import { toast } from "sonner";

export default function PhonePeSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const tx = params.get("tx");
  const plan = params.get("plan") || "basic";
  const cycle = (params.get("cycle") as "monthly" | "annual") || "annual";

  useEffect(() => {
    (async () => {
      if (!user || !tx) return;
      try {
        const { data, error } = await supabase.functions.invoke(
          "verify-phonepe-payment",
          { body: { merchantTransactionId: tx } },
        );
        if (error || data?.code !== "SUCCESS") {
          toast.error("Payment verification failed");
          navigate("/paywall", { replace: true });
          return;
        }

        await subscriptionService.createSubscription(user.id, {
          planSlug: plan,
          billingCycle: cycle,
        } as any);

        toast.success("Subscription activated!");
        navigate("/dashboard", { replace: true });
      } catch (e: any) {
        toast.error(e?.message || "Payment verification error");
        navigate("/paywall", { replace: true });
      }
    })();
  }, [user, tx]);

  return null;
}


