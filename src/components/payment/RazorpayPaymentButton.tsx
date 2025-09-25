import React, { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  RazorpayPaymentData,
  razorpayPaymentService,
} from "../../services/razorpayPaymentService";

interface RazorpayPaymentButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
  planType?: "monthly" | "yearly";
}

const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({
  onSuccess,
  onError,
  onCancel,
  className = "",
  planType = "yearly",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Handle payment success/failure callbacks
    const handlePaymentSuccess = async (event: MessageEvent) => {
      if (event.data && event.data.type === "razorpay_payment_success") {
        console.log("Payment successful:", event.data);

        if (!user) {
          console.error("No user found for payment verification");
          onError?.("User not authenticated");
          return;
        }

        try {
          // Extract payment data from Razorpay response
          const paymentData: RazorpayPaymentData = {
            razorpay_payment_id:
              event.data.payment_id || event.data.razorpay_payment_id,
            razorpay_order_id:
              event.data.order_id || event.data.razorpay_order_id,
            razorpay_signature:
              event.data.signature || event.data.razorpay_signature,
            planType: planType,
            userId: user.id,
          };

          console.log("Verifying payment with data:", paymentData);

          // Verify payment and create subscription
          const result = await razorpayPaymentService.handlePaymentSuccess(
            paymentData
          );

          if (result.success) {
            console.log(
              "Payment verified and subscription created:",
              result.subscriptionId
            );
            onSuccess?.();
          } else {
            console.error("Payment verification failed:", result.error);
            onError?.(result.error || "Payment verification failed");
          }
        } catch (error) {
          console.error("Error processing payment success:", error);
          onError?.(
            `Payment processing failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }
    };

    const handlePaymentError = (event: MessageEvent) => {
      if (event.data && event.data.type === "razorpay_payment_error") {
        console.error("Payment failed:", event.data);
        onError?.(event.data.error?.description || "Payment failed");
      }
    };

    const handlePaymentCancel = (event: MessageEvent) => {
      if (event.data && event.data.type === "razorpay_payment_cancel") {
        console.log("Payment cancelled:", event.data);
        onCancel?.();
      }
    };

    // Listen for payment events
    window.addEventListener("message", handlePaymentSuccess);
    window.addEventListener("message", handlePaymentError);
    window.addEventListener("message", handlePaymentCancel);

    // Create the Razorpay payment button
    const createPaymentButton = () => {
      if (containerRef.current) {
        console.log(`Creating Razorpay payment button for ${planType} plan...`);

        // Clear any existing content
        containerRef.current.innerHTML = "";

        // Create form element
        const form = document.createElement("form");
        form.style.width = "100%";

        // Create script element with different subscription button IDs based on plan type
        const script = document.createElement("script");
        script.src =
          "https://cdn.razorpay.com/static/widget/subscription-button.js";
        script.setAttribute(
          "data-subscription_button_id",
          planType === "monthly" ? "pl_RHmjU1PSgrHCTU" : "pl_RIFOlQWqDgiDvL"
        );
        script.setAttribute("data-button_theme", "rzp-outline-standard");
        script.async = true;

        script.onload = () => {
          console.log(
            `Razorpay ${planType} subscription button script loaded successfully`
          );
        };

        script.onerror = () => {
          console.error(
            `Failed to load Razorpay ${planType} subscription button script`
          );
          onError?.("Failed to load payment system");
        };

        // Append script to form
        form.appendChild(script);

        // Append form to container
        containerRef.current.appendChild(form);

        console.log(`Razorpay ${planType} subscription button created`);
      }
    };

    // Create the button
    createPaymentButton();

    return () => {
      window.removeEventListener("message", handlePaymentSuccess);
      window.removeEventListener("message", handlePaymentError);
      window.removeEventListener("message", handlePaymentCancel);
    };
  }, [onSuccess, onError, onCancel, planType]);

  return (
    <div className={`razorpay-payment-button ${className}`}>
      <div ref={containerRef} style={{ width: "100%", minHeight: "50px" }} />
    </div>
  );
};

export default RazorpayPaymentButton;
