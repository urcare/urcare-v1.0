import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { razorpayService } from "@/services/razorpayService";
import { subscriptionService } from "@/services/subscriptionService";
import React, { useCallback, useState } from "react";

type BillingCycle = "monthly" | "annual";

interface RazorpayCheckoutProps {
  planSlug: string;
  billingCycle: BillingCycle;
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  planSlug,
  billingCycle,
  onSuccess,
  onError,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.head.appendChild(script);
    });
  };

  const startCheckout = useCallback(async () => {
    if (!user) {
      onError("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const isFirstTime =
        await subscriptionService.isEligibleForFirstTimePricing(user.id);

      const pricing = await razorpayService.calculateAmount(
        planSlug,
        billingCycle,
        isFirstTime,
        user.id
      );

      const order = await razorpayService.createOrder({
        userId: user.id,
        planSlug,
        billingCycle,
        isFirstTime,
        amount: pricing.amount,
        currency: pricing.currency,
        userCurrency: pricing.currency,
        paymentMethods: ["card"],
      });

      await loadRazorpayScript();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "UrCare Health",
        description: `${
          planSlug.charAt(0).toUpperCase() + planSlug.slice(1)
        } Plan - ${billingCycle}`,
        order_id: order.id,
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        notes: {
          userId: user.id,
          planSlug,
          billingCycle,
          isFirstTime: isFirstTime.toString(),
        },
        theme: { color: "#10B981" },
        handler: async (response: any) => {
          try {
            const verified = await razorpayService.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              user.id
            );

            if (!verified) {
              onError("Payment verification failed");
              return;
            }

            await subscriptionService.createSubscription(
              user.id,
              planSlug,
              billingCycle,
              isFirstTime
            );

            onSuccess();
          } catch (e) {
            onError(e instanceof Error ? e.message : "Payment failed");
          }
        },
        modal: {
          ondismiss: () => {
            onCancel();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Unable to start payment");
    } finally {
      setLoading(false);
    }
  }, [user, planSlug, billingCycle, onSuccess, onError, onCancel]);

  return (
    <div className="space-y-4">
      <Button onClick={startCheckout} disabled={loading} className="w-full">
        {loading ? "Processing..." : "Proceed to Secure Payment"}
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
};

export default RazorpayCheckout;
