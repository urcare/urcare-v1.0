import { useAuth } from "@/contexts/AuthContext";
import { PhonePeService, PhonePeUtils } from "@/services/phonepeService";
import { ArrowLeft, CheckCircle, Loader2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface PaymentFormProps {
  planId: string;
  planName: string;
  billingCycle: "monthly" | "annual";
  amount: number;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  planId,
  planName,
  billingCycle,
  amount,
  onBack,
}) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<"PAY_PAGE" | "UPI_INTENT" | "UPI_COLLECT" | "UPI_QR" | "CARD" | "NET_BANKING">("PAY_PAGE");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed" | "failed"
  >("pending");

  useEffect(() => {
    // Poll payment status if payment is processing
    if (paymentId && paymentStatus === "processing") {
      const interval = setInterval(async () => {
        try {
          const status = await PhonePeService.checkPaymentStatus({
            merchant_transaction_id: paymentId,
          });
          setPaymentStatus(status.payment.status as any);

          if (status.payment.status === "completed") {
            toast.success(
              "Payment successful! Your subscription is now active."
            );
            navigate("/dashboard");
          } else if (status.payment.status === "failed") {
            toast.error("Payment failed. Please try again.");
            setIsProcessing(false);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [paymentId, paymentStatus, navigate]);

  const handlePayment = async () => {
    if (!profile?.id) {
      toast.error("Please log in to continue");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      const result = await PhonePeService.initiatePayment({
        user_id: profile.id,
        plan_id: planId,
        billing_cycle: billingCycle,
        amount: amount,
        currency: "INR",
        payment_method: selectedMethod,
        redirect_url: `${window.location.origin}/payment/success`,
        callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
        user_email: profile.email,
        user_phone: profile.phone,
        ...paymentDetails,
      });

      if (result.success) {
        setPaymentId(result.merchant_transaction_id);

        if (result.payment_url) {
          // Redirect to PhonePe payment page
          window.location.href = result.payment_url;
        } else {
          // For UPI Intent, show success message
          toast.success("Payment initiated successfully!");
        }
      } else {
        toast.error(result.message || "Payment initiation failed");
        setIsProcessing(false);
        setPaymentStatus("pending");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      setPaymentStatus("pending");
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "failed":
        return <XCircle className="h-8 w-8 text-red-500" />;
      case "processing":
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "completed":
        return "Payment successful!";
      case "failed":
        return "Payment failed. Please try again.";
      case "processing":
        return "Processing payment...";
      default:
        return "Ready to pay";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to plans
        </button>

        <h2 className="text-2xl font-bold text-gray-900">
          Complete Your Payment
        </h2>
        <p className="text-gray-600 mt-2">
          {planName} - {billingCycle === "monthly" ? "Monthly" : "Annual"}{" "}
          subscription
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">₹{amount}</span>
        </div>

        <div className="text-sm text-gray-600">
          <p>Billing: {billingCycle === "monthly" ? "Monthly" : "Annual"}</p>
          <p>Currency: INR</p>
        </div>
      </div>

      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
        onDetailsChange={setPaymentDetails}
      />

      <div className="mt-8">
        <button
          onClick={handlePayment}
          disabled={isProcessing || paymentStatus === "processing"}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${amount}`
          )}
        </button>
      </div>

      {paymentStatus !== "pending" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-3">
            {getStatusIcon()}
            <span className="font-medium">{getStatusMessage()}</span>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>Secure payment powered by PhonePe</p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default PaymentForm;
