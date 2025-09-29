import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PhonePeService, PhonePeUtils } from "@/services/phonepeService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

interface PaymentResultProps {
  onPaymentComplete?: (success: boolean, paymentData?: any) => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({ onPaymentComplete }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<{
    status: "loading" | "success" | "failed" | "pending";
    message: string;
    paymentData?: any;
    transactionId?: string;
  }>({
    status: "loading",
    message: "Checking payment status...",
  });

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get transaction details from URL parameters
        const merchantTransactionId = searchParams.get("merchantTransactionId");
        const transactionId = searchParams.get("transactionId");
        const status = searchParams.get("status");

        if (!merchantTransactionId) {
          setPaymentStatus({
            status: "failed",
            message: "Invalid payment response. Missing transaction details.",
          });
          return;
        }

        // Check payment status with PhonePe
        const statusResponse = await PhonePeService.checkPaymentStatus({
          merchant_transaction_id: merchantTransactionId,
          transaction_id: transactionId || undefined,
        });

        if (statusResponse.success) {
          const payment = statusResponse.payment;
          setPaymentStatus({
            status: payment.status === "completed" ? "success" : payment.status === "failed" ? "failed" : "pending",
            message: getStatusMessage(payment.status),
            paymentData: payment,
            transactionId: payment.id,
          });

          // Notify parent component
          onPaymentComplete?.(payment.status === "completed", payment);
        } else {
          setPaymentStatus({
            status: "failed",
            message: "Failed to verify payment status. Please contact support.",
          });
        }
      } catch (error: any) {
        console.error("Payment status check error:", error);
        setPaymentStatus({
          status: "failed",
          message: error.message || "An error occurred while checking payment status.",
        });
      }
    };

    checkPaymentStatus();
  }, [searchParams, onPaymentComplete]);

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case "completed":
        return "Payment completed successfully! Your subscription is now active.";
      case "failed":
        return "Payment failed. Please try again or contact support.";
      case "pending":
        return "Payment is being processed. Please wait a moment.";
      case "cancelled":
        return "Payment was cancelled. You can try again anytime.";
      default:
        return "Payment status unknown. Please contact support.";
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "failed":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "pending":
        return <Clock className="w-16 h-16 text-yellow-500" />;
      default:
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  const handleRetryPayment = () => {
    navigate("/subscription");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleContactSupport = () => {
    // You can implement support contact logic here
    window.open("mailto:support@urcare.com?subject=Payment Issue", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl ${getStatusColor()}`}>
            {paymentStatus.status === "success" && "Payment Successful!"}
            {paymentStatus.status === "failed" && "Payment Failed"}
            {paymentStatus.status === "pending" && "Payment Pending"}
            {paymentStatus.status === "loading" && "Checking Payment..."}
          </CardTitle>
          <CardDescription className="text-center">
            {paymentStatus.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Details */}
          {paymentStatus.paymentData && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Payment Details</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    {PhonePeUtils.formatAmount(paymentStatus.paymentData.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium">
                    {PhonePeUtils.getPaymentMethodDisplayName(paymentStatus.paymentData.payment_method)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Billing:</span>
                  <span className="font-medium capitalize">
                    {paymentStatus.paymentData.billing_cycle}
                  </span>
                </div>
                {paymentStatus.transactionId && (
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">
                      {PhonePeUtils.formatTransactionId(paymentStatus.transactionId)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {paymentStatus.status === "success" && (
              <Button onClick={handleGoToDashboard} className="w-full">
                Go to Dashboard
              </Button>
            )}
            
            {paymentStatus.status === "failed" && (
              <>
                <Button onClick={handleRetryPayment} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleContactSupport} className="w-full">
                  Contact Support
                </Button>
              </>
            )}
            
            {paymentStatus.status === "pending" && (
              <Button onClick={handleGoToDashboard} variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            )}
            
            {paymentStatus.status === "loading" && (
              <Button disabled className="w-full">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </Button>
            )}
          </div>

          {/* Additional Information */}
          {paymentStatus.status === "success" && (
            <Alert>
              <AlertDescription>
                Your subscription is now active! You can access all premium features.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus.status === "failed" && (
            <Alert variant="destructive">
              <AlertDescription>
                If you continue to experience issues, please contact our support team.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus.status === "pending" && (
            <Alert>
              <AlertDescription>
                Your payment is being processed. You will receive an email confirmation once completed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResult;
