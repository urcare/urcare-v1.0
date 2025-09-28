import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { paymentService } from "@/services/paymentService";
import { Payment } from "@/types/subscription";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Crown,
  RefreshCw,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    subscription,
    hasActiveSubscription,
    getDaysUntilExpiry,
    isExpiringSoon,
    isTrial,
    refetch,
  } = useSubscription();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const paymentHistory = await paymentService.getPaymentHistory(
        subscription?.subscription_id || ""
      );
      setPayments(paymentHistory);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpgrade = () => {
    navigate("/subscription");
  };

  const handleCancel = async () => {
    // Implement cancellation logic
    console.log("Cancel subscription");
  };

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Active Subscription
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have an active subscription. Upgrade to unlock premium
                features.
              </p>
              <Button
                onClick={handleUpgrade}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Subscription Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your subscription and billing
              </p>
            </div>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Plan */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                  Current Plan
                </CardTitle>
                <Badge className={getStatusColor(subscription?.status || "")}>
                  {subscription?.status?.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {subscription?.plan_name}
                  </h3>
                  <p className="text-gray-600">
                    {subscription?.billing_cycle === "monthly"
                      ? "Monthly"
                      : "Annual"}{" "}
                    billing
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Next billing date</p>
                    <p className="font-medium">
                      {subscription?.current_period_end
                        ? formatDate(subscription.current_period_end)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Days remaining</p>
                    <p className="font-medium">{getDaysUntilExpiry()} days</p>
                  </div>
                </div>

                {isExpiringSoon() && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 text-sm">
                      Your subscription expires soon. Consider renewing to avoid
                      service interruption.
                    </span>
                  </div>
                )}

                {isTrial() && (
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 text-sm">
                      You're currently in a trial period. Your subscription will
                      start after the trial ends.
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleUpgrade}
                className="w-full"
                variant="outline"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button
                onClick={() => navigate("/payment-history")}
                className="w-full"
                variant="outline"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment History
              </Button>
              <Button
                onClick={handleCancel}
                className="w-full"
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" />
                Cancel Subscription
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.plan_name || "Subscription Payment"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{payment.amount}
                      </p>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payment history found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
