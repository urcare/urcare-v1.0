import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import PaymentIntegrationTest from "./PaymentIntegrationTest";
import RazorpayPaymentButton from "./RazorpayPaymentButton";

const RazorpayTestPage: React.FC = () => {
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const handlePaymentSuccess = () => {
    toast.success("🎉 Payment successful!");
    setShowPaymentButton(false);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
    setShowPaymentButton(false);
  };

  const handlePaymentCancel = () => {
    toast.info("Payment cancelled");
    setShowPaymentButton(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Integration Test */}
        <PaymentIntegrationTest />

        {/* Razorpay Payment Test */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">
              Razorpay Payment Test
            </h1>
            <p className="text-gray-600">
              Test the Razorpay payment button integration
            </p>
          </div>

          {showPaymentButton ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2">
                  Complete Your Payment
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Secure payment powered by Razorpay
                </p>
              </div>

              <RazorpayPaymentButton
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
                className="w-full"
              />

              <Button
                onClick={() => setShowPaymentButton(false)}
                variant="outline"
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => setShowPaymentButton(true)}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl text-base transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Test Razorpay Payment
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>Payment Button ID: pl_RLX2AcqCC9YyXE</p>
                <p>This will open the Razorpay payment interface</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RazorpayTestPage;
