import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Smartphone, Wallet, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface PaymentStatus {
  status: 'idle' | 'processing' | 'success' | 'failed' | 'expired';
  orderId?: string;
  phonepeTxnId?: string;
  error?: string;
}

const Pay: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'idle' });
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Payment options
  const paymentOptions = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using UPI apps',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, PhonePe, Google Pay'
    }
  ];

  // Timer countdown
  useEffect(() => {
    if (paymentStatus.status === 'processing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && paymentStatus.status === 'processing') {
      setPaymentStatus({ status: 'expired', error: 'Payment timeout. Please try again.' });
    }
  }, [timeLeft, paymentStatus.status]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle payment initiation
  const handlePayment = async () => {
    try {
      setPaymentStatus({ status: 'processing' });
      setTimeLeft(120);
      setIsRedirecting(true);

      const response = await fetch('/api/paycheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountPaise: 100, // ₹1
          userId: 'urcare_user'
        })
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        setPaymentStatus({
          status: 'processing',
          orderId: data.orderId,
          phonepeTxnId: data.phonepeTxnId
        });

        // Redirect to PhonePe
        window.location.href = data.redirectUrl;
      } else {
        setPaymentStatus({
          status: 'failed',
          error: data.error || 'Failed to initiate payment'
        });
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentStatus({
        status: 'failed',
        error: 'Network error. Please try again.'
      });
      setIsRedirecting(false);
    }
  };

  // Poll for payment status
  useEffect(() => {
    if (paymentStatus.status === 'processing' && paymentStatus.orderId) {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/phonepe/verify?orderId=${paymentStatus.orderId}`);
          const data = await response.json();

          if (data.success) {
            if (data.status === 'SUCCESS') {
              setPaymentStatus({
                status: 'success',
                orderId: paymentStatus.orderId,
                phonepeTxnId: paymentStatus.phonepeTxnId
              });
              clearInterval(pollInterval);
            } else if (data.status === 'FAILED') {
              setPaymentStatus({
                status: 'failed',
                orderId: paymentStatus.orderId,
                error: 'Payment failed'
              });
              clearInterval(pollInterval);
            }
          }
        } catch (error) {
          console.error('Status check failed:', error);
        }
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(pollInterval);
    }
  }, [paymentStatus.status, paymentStatus.orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Secure payment powered by PhonePe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Options Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Options
              </CardTitle>
              <CardDescription>
                Choose your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    option.popular
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <option.icon className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.name}</span>
                        {option.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Summary & Action */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Business</span>
                  <span className="font-medium">UrCare org</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-2xl font-bold text-green-600">₹1.00</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Payment ID</span>
                  <span className="font-mono">
                    {paymentStatus.orderId || 'Will be generated'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <AnimatePresence>
              {paymentStatus.status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {paymentStatus.status === 'processing' && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span>Processing payment...</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">
                              {formatTime(timeLeft)}
                            </span>
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentStatus.status === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Payment successful! Transaction ID: {paymentStatus.phonepeTxnId}
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentStatus.status === 'failed' && (
                    <Alert className="border-red-200 bg-red-50">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {paymentStatus.error || 'Payment failed. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentStatus.status === 'expired' && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        Payment session expired. Please start a new payment.
                      </AlertDescription>
                    </Alert>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={paymentStatus.status === 'processing' || isRedirecting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 text-lg font-medium"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redirecting to PhonePe...
                </>
              ) : paymentStatus.status === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  PAY ₹1
                </>
              )}
            </Button>

            {/* Security Note */}
            <div className="text-center text-sm text-gray-500">
              <p>🔒 Your payment is secured by PhonePe</p>
              <p>256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
