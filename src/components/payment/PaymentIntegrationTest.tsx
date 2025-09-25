import React, { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { razorpayPaymentService } from "../../services/razorpayPaymentService";
import { subscriptionService } from "../../services/subscriptionService";
import { Button } from "../ui/button";

const PaymentIntegrationTest: React.FC = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }

    setLoading(true);
    try {
      const status = await subscriptionService.getSubscriptionStatus(user.id);
      setSubscriptionStatus(status);
      console.log("Subscription status:", status);

      if (status.isActive) {
        toast.success("✅ Active subscription found!");
      } else {
        toast.info("ℹ️ No active subscription");
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast.error("Error checking subscription status");
    } finally {
      setLoading(false);
    }
  };

  const testPaymentVerification = async () => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }

    // This is a mock test - in real scenario, this would be called by Razorpay
    const mockPaymentData = {
      razorpay_payment_id: "pay_test_" + Date.now(),
      razorpay_order_id: "order_test_" + Date.now(),
      razorpay_signature: "test_signature",
      planType: "monthly" as const,
      userId: user.id,
    };

    try {
      const result = await razorpayPaymentService.handlePaymentSuccess(
        mockPaymentData
      );
      if (result.success) {
        toast.success("✅ Payment verification test passed!");
        console.log("Payment verification result:", result);
      } else {
        toast.error(`❌ Payment verification failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Payment verification test failed:", error);
      toast.error("Payment verification test failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Payment Integration Test
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Current User: {user?.email || "Not logged in"}
          </h3>
        </div>

        <Button
          onClick={checkSubscriptionStatus}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Checking..." : "Check Subscription Status"}
        </Button>

        <Button
          onClick={testPaymentVerification}
          disabled={!user}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Test Payment Verification
        </Button>

        {subscriptionStatus && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">
              Subscription Status:
            </h4>
            <pre className="text-sm text-gray-600 overflow-auto">
              {JSON.stringify(subscriptionStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentIntegrationTest;

