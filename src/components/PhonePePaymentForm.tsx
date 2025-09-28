import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { PhonePeService, PhonePeUtils } from "../services/phonepeService";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface PhonePePaymentFormProps {
  planId: string;
  planName: string;
  amount: number;
  billingCycle: "monthly" | "annual";
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: string) => void;
}

const PhonePePaymentForm: React.FC<PhonePePaymentFormProps> = ({
  planId,
  planName,
  amount,
  billingCycle,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [user, setUser] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "upi" | "netbanking" | "wallet"
  >("card");
  const [vpa, setVpa] = useState("");
  const [isVpaValid, setIsVpaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const options = await PhonePeService.getPaymentOptions({
          amount,
          currency: "INR",
        });
        setPaymentOptions(options.payment_options);
      } catch (err) {
        console.error("Failed to load payment options:", err);
      }
    };
    loadPaymentOptions();
  }, [amount]);

  useEffect(() => {
    if (paymentMethod === "upi" && vpa) {
      const validateVpa = async () => {
        if (PhonePeUtils.isValidVPAFormat(vpa)) {
          try {
            const result = await PhonePeService.validateVPA({ vpa });
            setIsVpaValid(result.valid);
          } catch (err) {
            setIsVpaValid(false);
          }
        } else {
          setIsVpaValid(false);
        }
      };
      validateVpa();
    }
  }, [vpa, paymentMethod]);

  const handlePayment = async () => {
    if (!user) {
      setError("Please log in to continue");
      return;
    }

    if (paymentMethod === "upi" && (!vpa || !isVpaValid)) {
      setError("Please enter a valid UPI VPA");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const paymentData = await PhonePeService.initiatePayment({
        user_id: user.id,
        plan_id: planId,
        billing_cycle: billingCycle,
        amount: amount,
        currency: "INR",
        payment_method: paymentMethod,
        redirect_url: `${window.location.origin}/payment/success`,
        callback_url: `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/phonepe-payment-callback`,
      });

      // Redirect to PhonePe payment page
      window.location.href = paymentData.payment_url;
    } catch (err: any) {
      setError(err.message);
      onPaymentError?.(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentMethodOptions = () => {
    if (!paymentOptions) return null;

    return (
      <div className="space-y-4">
        {paymentOptions.card?.enabled && (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">Credit/Debit Card</span>
          </label>
        )}

        {paymentOptions.upi?.enabled && (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">UPI</span>
          </label>
        )}

        {paymentOptions.netbanking?.enabled && (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="netbanking"
              checked={paymentMethod === "netbanking"}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">Net Banking</span>
          </label>
        )}

        {paymentOptions.wallet?.enabled && (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="wallet"
              checked={paymentMethod === "wallet"}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">Digital Wallet</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Complete Payment
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Plan Details
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">{planName}</p>
          <p className="text-sm text-gray-600 capitalize">
            {billingCycle} billing
          </p>
          <p className="text-xl font-bold text-green-600">
            {PhonePeUtils.formatAmount(amount)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Payment Method
        </h3>
        {renderPaymentMethodOptions()}
      </div>

      {paymentMethod === "upi" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UPI VPA (Virtual Payment Address)
          </label>
          <input
            type="text"
            value={vpa}
            onChange={(e) => setVpa(e.target.value)}
            placeholder="user@paytm"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {vpa && (
            <p
              className={`text-sm mt-1 ${
                isVpaValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {isVpaValid ? "✓ Valid VPA" : "✗ Invalid VPA"}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={
          isLoading || (paymentMethod === "upi" && (!vpa || !isVpaValid))
        }
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading
          ? "Processing..."
          : `Pay ${PhonePeUtils.formatAmount(amount)}`}
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Secure payment powered by PhonePe</p>
        <p>You will be redirected to PhonePe for payment</p>
      </div>
    </div>
  );
};

export default PhonePePaymentForm;
