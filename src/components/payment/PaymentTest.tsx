import RazorpayPaymentButton from "@/components/payment/RazorpayPaymentButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export const PaymentTest: React.FC = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const handlePaymentSuccess = (paymentId: string) => {
    toast.success(`Payment successful! Payment ID: ${paymentId}`);
    setShowPayment(false);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    toast.info("Payment cancelled");
    setShowPayment(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Test</CardTitle>
          <CardDescription>
            Test the Razorpay payment integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Billing Cycle</label>
            <div className="flex gap-2">
              <Button
                variant={billingCycle === "monthly" ? "default" : "outline"}
                onClick={() => setBillingCycle("monthly")}
                size="sm"
              >
                Monthly (₹849)
              </Button>
              <Button
                variant={billingCycle === "annual" ? "default" : "outline"}
                onClick={() => setBillingCycle("annual")}
                size="sm"
              >
                Annual (₹4,999)
              </Button>
            </div>
          </div>

          {showPayment ? (
            <div className="space-y-4">
              <RazorpayPaymentButton
                amount={billingCycle === "monthly" ? 849 : 4999}
                planName="Test Health Plan"
                billingCycle={billingCycle}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
                className="w-full"
              />
              <Button
                onClick={() => setShowPayment(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowPayment(true)}
              className="w-full"
            >
              Test Payment
            </Button>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Test Cards:</strong></p>
            <p>Success: 4111 1111 1111 1111</p>
            <p>Failure: 4000 0000 0000 0002</p>
            <p>CVV: Any 3 digits</p>
            <p>Expiry: Any future date</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
