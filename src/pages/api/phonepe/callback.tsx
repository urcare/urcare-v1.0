import { paymentService } from "@/services/paymentService";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PhonePeCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get payment details from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId =
          urlParams.get("payment_id") ||
          localStorage.getItem("current_payment_id");

        if (!paymentId) {
          console.error("No payment ID found");
          navigate("/subscription");
          return;
        }

        // Check payment status
        const status = await paymentService.checkPaymentStatus(paymentId);

        if (status.status === "completed") {
          // Payment successful
          localStorage.removeItem("current_payment_id");
          navigate("/dashboard?payment=success");
        } else if (status.status === "failed") {
          // Payment failed
          localStorage.removeItem("current_payment_id");
          navigate("/subscription?payment=failed");
        } else {
          // Still processing
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        console.error("Error handling callback:", error);
        navigate("/subscription?payment=error");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Processing Payment...
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your payment.
        </p>
      </div>
    </div>
  );
};

export default PhonePeCallback;
