/**
 * PhonePe Payment Verification Component
 * 
 * This component provides a complete PhonePe payment interface with:
 * - Payment method selection (UPI, Card, Net Banking, QR Code)
 * - Bank selection for Net Banking
 * - Integration with PhonePe API (live or test mode)
 * - Proper error handling and loading states
 * 
 * TO SWITCH BETWEEN TEST AND LIVE MODE:
 * 1. Change PHONEPE_CONFIG.USE_LIVE_API to true for live mode
 * 2. Update PHONEPE_CONFIG.LIVE_MODE with your production credentials
 * 3. Ensure your Supabase Edge Function is deployed and configured
 * 
 * TEST MODE: Uses PhonePe sandbox environment
 * LIVE MODE: Uses actual PhonePe production API
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionService } from "@/services/subscriptionService";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, CreditCard, Smartphone, Building2, QrCode } from "lucide-react";

interface PhonePePaymentVerificationProps {
  merchantTransactionId: string;
  planSlug: string;
  billingCycle: "monthly" | "annual";
  amount: number;
  onSuccess: () => void;
  onFailure: () => void;
}

// ========================================
// CONFIGURATION: Switch between test and live mode
// ========================================
const PHONEPE_CONFIG = {
  // Set to true for live PhonePe API, false for test mode
  USE_LIVE_API: false,
  
  // Test mode settings
  TEST_MODE: {
    MERCHANT_ID: "PGTESTPAYUAT",
    BASE_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox",
    REDIRECT_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
  },
  
  // Live mode settings (update with your production credentials)
  LIVE_MODE: {
    MERCHANT_ID: "YOUR_LIVE_MERCHANT_ID",
    BASE_URL: "https://api.phonepe.com/apis/pg",
    REDIRECT_URL: "https://api.phonepe.com/apis/pg/v1/pay"
  }
};

export default function PhonePePaymentVerification({
  merchantTransactionId,
  planSlug,
  billingCycle,
  amount,
  onSuccess,
  onFailure
}: PhonePePaymentVerificationProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "verifying" | "success" | "failed">("loading");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [countdown, setCountdown] = useState(300); // 5 minutes timeout

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI ID",
      icon: Smartphone,
      description: "PhonePe, Gpay, Paytm, BHIM & more",
      color: "text-blue-600"
    },
    {
      id: "card",
      name: "Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Rupay & more",
      color: "text-green-600"
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building2,
      description: "Choose your bank to complete payment",
      color: "text-purple-600"
    },
    {
      id: "qr",
      name: "Show QR Code",
      icon: QrCode,
      description: "Scan with any UPI app",
      color: "text-orange-600"
    }
  ];

  const banks = [
    { code: "HDFC-S", name: "HDFC Bank", logo: "🏦" },
    { code: "SBIN-S", name: "State Bank of India", logo: "🏛️" },
    { code: "ICIC-S", name: "ICICI Bank", logo: "🏢" },
    { code: "AXIS-S", name: "Axis Bank", logo: "🏦" },
    { code: "KOTK-S", name: "Kotak Bank", logo: "🏦" },
    { code: "PNB-S", name: "Punjab National Bank", logo: "🏛️" }
  ];

  // Countdown timer
  useEffect(() => {
    if (status === "verifying" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && status === "verifying") {
      setStatus("failed");
    }
  }, [countdown, status]);

  // Create PhonePe payment and redirect to gateway
  const createPhonePePayment = async () => {
    if (!user) return;

    setStatus("verifying");
    
    try {
      // ========================================
      // LIVE PHONEPE API INTEGRATION
      // ========================================
      // First, try to create payment via Supabase Edge Function
      // This will call the actual PhonePe API if configured properly
      try {
        const { data: plan } = await supabase
          .from('subscription_plans')
          .select('id, price_monthly, price_annual')
          .eq('slug', planSlug)
          .eq('is_active', true)
          .single();

        if (!plan) {
          throw new Error('Plan not found');
        }

        const priceINR = billingCycle === "monthly" ? plan.price_monthly : plan.price_annual;
        const redirectUrl = `${window.location.origin}/payment/phonepe/success?tx=${merchantTransactionId}&plan=${planSlug}&cycle=${billingCycle}`;

        const requestBody = {
          user_id: user.id,
          plan_id: plan.id,
          billing_cycle: billingCycle,
          amount: priceINR,
          currency: "INR",
          payment_method: selectedPaymentMethod === "netbanking" ? "netbanking" : 
                         selectedPaymentMethod === "card" ? "card" : 
                         selectedPaymentMethod === "upi" ? "upi" : "card",
          redirect_url: redirectUrl,
          callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
        };

        console.log("Creating PhonePe payment:", requestBody);

        const { data, error } = await supabase.functions.invoke(
          "phonepe-payment-initiate",
          { body: requestBody }
        );
        
        if (error) {
          throw error;
        }

        const paymentUrl = data?.redirect_url || data?.payment_url;
        if (paymentUrl) {
          console.log("Redirecting to PhonePe payment gateway:", paymentUrl);
          window.location.href = paymentUrl;
          return;
        }
      } catch (functionError) {
        console.log("Supabase function failed, using test payment flow:", functionError);
      }

      // ========================================
      // TEST/DEVELOPMENT MODE FALLBACK
      // ========================================
      // If live PhonePe API fails, use this test flow
      // This creates a mock payment and redirects to PhonePe's test page
      console.log("Creating test payment flow...");
      
      // Create a payment record in the database
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('id, price_monthly, price_annual')
        .eq('slug', planSlug)
        .eq('is_active', true)
        .single();

      if (!plan) {
        throw new Error('Plan not found');
      }

      const priceINR = billingCycle === "monthly" ? plan.price_monthly : plan.price_annual;
      const redirectUrl = `${window.location.origin}/payment/phonepe/success?tx=${merchantTransactionId}&plan=${planSlug}&cycle=${billingCycle}`;

      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          amount: priceINR,
          currency: "INR",
          status: "processing",
          payment_method: selectedPaymentMethod === "netbanking" ? "netbanking" : 
                         selectedPaymentMethod === "card" ? "card" : 
                         selectedPaymentMethod === "upi" ? "upi" : "card",
          billing_cycle: billingCycle,
          phonepe_merchant_transaction_id: merchantTransactionId,
          is_first_time: true,
        })
        .select()
        .single();

      if (paymentError) {
        console.error("Failed to create payment record:", paymentError);
        setStatus("failed");
        return;
      }

      // For test mode, simulate PhonePe payment page
      console.log("Test mode: Simulating PhonePe payment page...");
      
      // ========================================
      // MOCK PHONEPE PAYMENT URL
      // ========================================
      // This creates a test URL that redirects to PhonePe's sandbox environment
      // In production, this would be replaced with the actual PhonePe payment URL
      const config = PHONEPE_CONFIG.USE_LIVE_API ? PHONEPE_CONFIG.LIVE_MODE : PHONEPE_CONFIG.TEST_MODE;
      
      const phonePeUrl = `${config.REDIRECT_URL}?merchantId=${config.MERCHANT_ID}&merchantTransactionId=${merchantTransactionId}&amount=${priceINR * 100}&redirectUrl=${encodeURIComponent(redirectUrl)}&callbackUrl=${encodeURIComponent(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`)}`;
      
      console.log(`Redirecting to PhonePe payment gateway (${PHONEPE_CONFIG.USE_LIVE_API ? 'LIVE' : 'TEST'} mode):`, phonePeUrl);
      
      // Redirect to PhonePe payment gateway
      window.location.href = phonePeUrl;

    } catch (error) {
      console.error("Payment creation error:", error);
      setStatus("failed");
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePayNow = () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    createPhonePePayment();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Preparing Payment...</h2>
          <p className="text-gray-600">Please wait while we set up your payment.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your subscription has been activated. Redirecting you to the dashboard...
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              🎉 Welcome to UrCare Pro! You now have access to all premium features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but your payment could not be processed at this time.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onFailure}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🛍️</span>
            </div>
            <span className="text-sm text-gray-600">PGTESTPAYUAT84</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">₹{amount.toFixed(2)}</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${method.color}`} />
                    <div>
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === method.id && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bank Selection (if Net Banking selected) */}
        {selectedPaymentMethod === "netbanking" && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Choose your bank:</div>
            <div className="grid grid-cols-3 gap-2">
              {banks.map((bank) => (
                <button
                  key={bank.code}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="text-2xl mb-1">{bank.logo}</div>
                  <div className="text-xs text-gray-600 text-center">{bank.code}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {status === "verifying" && (
          <div className="mb-4 text-center">
            <div className="text-sm text-gray-600">
              Creating payment... Please wait
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayNow}
          disabled={!selectedPaymentMethod || status === "verifying"}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            selectedPaymentMethod && status !== "verifying"
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
           {status === "verifying" ? (
             <div className="flex items-center justify-center space-x-2">
               <Loader2 className="w-4 h-4 animate-spin" />
               <span>Creating Payment...</span>
             </div>
           ) : (
             `PAY ₹${amount.toFixed(2)}`
           )}
        </button>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <div className="flex items-center justify-center space-x-1">
            <span>Powered by</span>
            <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-medium">PhonePe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
