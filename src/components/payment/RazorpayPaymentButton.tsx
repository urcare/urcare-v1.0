import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface RazorpayPaymentButtonProps {
  amount: number;
  currency?: string;
  planName: string;
  billingCycle: "monthly" | "annual";
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  className?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({
  amount,
  currency = "INR",
  planName,
  billingCycle,
  onSuccess,
  onError,
  onCancel,
  className = "",
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const createPaymentOrder = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: amount * 100, // Convert to paise
          currency,
          plan_name: planName,
          billing_cycle: billingCycle,
        },
        headers: {
          Authorization: `Bearer ${
            (await supabase.auth.getSession()).data.session?.access_token
          }`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!user) {
      onError("Please log in to make a payment");
      return;
    }

    if (!razorpayLoaded) {
      onError("Payment system is loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Create payment order
      const orderData = await createPaymentOrder();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "UrCare Health",
        description: `${planName} - ${billingCycle === "monthly" ? "Monthly" : "Annual"} Plan`,
        image: "/brand.png",
        order_id: orderData.id,
        prefill: {
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email,
          contact: user.user_metadata?.phone || "",
        },
        theme: {
          color: "#10B981", // Emerald color matching your brand
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const { data: verificationData, error: verificationError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  plan_name: planName,
                  billing_cycle: billingCycle,
                },
                headers: {
                  Authorization: `Bearer ${
                    (await supabase.auth.getSession()).data.session?.access_token
                  }`,
                },
              }
            );

            if (verificationError) throw verificationError;

            if (verificationData.success) {
              onSuccess(response.razorpay_payment_id);
            } else {
              onError(verificationData.error || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            onError("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            onCancel();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      onError(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !razorpayLoaded}
      className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Pay with Razorpay - ₹{amount.toLocaleString()}
        </>
      )}
    </Button>
  );
};
