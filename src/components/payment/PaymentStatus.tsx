import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface PaymentStatusProps {
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  planName: string;
  billingCycle: string;
  paymentId?: string;
  orderId?: string;
  timestamp?: string;
  errorMessage?: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  amount,
  currency,
  planName,
  billingCycle,
  paymentId,
  orderId,
  timestamp,
  errorMessage
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      case 'cancelled':
        return 'Payment Cancelled';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>
        <CardTitle className="text-xl">{getStatusText()}</CardTitle>
        <CardDescription>
          {status === 'success' 
            ? 'Your subscription has been activated successfully'
            : status === 'failed'
            ? 'Payment could not be processed'
            : status === 'pending'
            ? 'Payment is being processed'
            : 'Payment was cancelled'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Plan:</span>
            <span>{planName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Billing Cycle:</span>
            <span className="capitalize">{billingCycle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Amount:</span>
            <span className="font-semibold">{currency} {amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Transaction Details */}
        {(paymentId || orderId) && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Transaction Details</h4>
            <div className="space-y-2 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-xs">{paymentId}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-xs">{orderId}</span>
                </div>
              )}
              {timestamp && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(timestamp).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Next Steps</p>
                <p className="text-sm text-green-600">
                  You can now access all features included in your {planName} plan. 
                  Check your email for confirmation details.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">What to do next</p>
                <p className="text-sm text-yellow-600">
                  Please try the payment again or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus; 