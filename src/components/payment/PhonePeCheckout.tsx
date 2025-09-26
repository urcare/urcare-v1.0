import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionService } from "@/services/subscriptionService";

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
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(async () => {
    if (!user) return onError("Not authenticated");
    setLoading(true);
    try {
      const merchantTransactionId = `${user.id}-${Date.now()}`;

      // Get INR price (fallback) then convert to paise
      const price = await subscriptionService.getPricingForUser(
        user.id,
        planSlug,
        billingCycle,
      );
      const amountPaise = Math.round((price || 0) * 100);

      const redirectUrl = `${window.location.origin}/payment/phonepe/success?tx=${merchantTransactionId}&plan=${planSlug}&cycle=${billingCycle}`;

      const { data, error } = await supabase.functions.invoke(
        "create-phonepe-payment",
        {
          body: {
            amount: amountPaise,
            merchantTransactionId,
            redirectUrl,
          },
        },
      );
      if (error) throw new Error(error.message);

      const url: string | undefined =
        data?.data?.instrumentResponse?.redirectInfo?.url;
      if (!url) throw new Error("Unable to start PhonePe payment");

      window.location.href = url;
    } catch (e: any) {
      onError(e?.message || "Payment failed");
      setLoading(false);
    }
  }, [user, planSlug, billingCycle]);

  return (
    <div className="space-y-4">
      <Button onClick={startCheckout} disabled={loading} className={className}>
        {loading ? "Processing..." : "Pay with PhonePe"}
      </Button>
      <Button variant="ghost" onClick={onCancel} disabled={loading} className="w-full">
        Cancel
      </Button>
    </div>
  );
}


