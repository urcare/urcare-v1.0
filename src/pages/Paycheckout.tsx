import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Smartphone, Wallet, Clock, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { PayByQRButton } from '@/components/PayByQRButton';
import QRCodeModal from '@/components/payment/QRCodeModal';

interface PaymentStatus {
  status: 'idle' | 'processing' | 'success' | 'failed' | 'expired';
  orderId?: string;
  phonepeTxnId?: string;
  error?: string;
}

const Paycheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'idle' });
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get plan data from navigation state
  const planData = location.state || {
    planSlug: 'basic',
    billingCycle: 'annual',
    amount: 4999
  };

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
      setPaymentStatus({ status: 'expired' });
    }
  }, [paymentStatus.status, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentMethod = async (method: string) => {
    if (method === 'upi') {
      await handlePayByQR();
    } else {
      toast.info(`${method} payment coming soon!`);
    }
  };

  const handlePayByQR = async () => {
    try {
      setPaymentStatus({ status: 'processing' });
      setIsRedirecting(true);

      const orderId = `order_${Date.now()}`;
      const response = await fetch('/api/phonepe/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: planData.amount,
          orderId: orderId,
          userId: 'demo_user',
          planName: planData.name
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Open PhonePe in popup or show QR modal
        const redirectUrl = result?.data?.redirectUrl || result?.redirectUrl;
        const qr = result?.data?.qrCode || result?.qrCode;

        if (redirectUrl) {
          const popup = window.open(redirectUrl, 'phonepe', 'width=420,height=680');
          if (popup) {
            popup.focus();
          }
        } else if (qr) {
          const popup = window.open('', 'phonepe', 'width=420,height=680');
          popup.document.write(`<img src="${qr}" alt="PhonePe QR" />`);
        } else {
          // Show QR modal instead
          setShowQRModal(true);
        }

        setPaymentStatus({ 
          status: 'processing', 
          orderId: orderId,
          phonepeTxnId: result?.data?.transactionId 
        });
      } else {
        throw new Error(result.error || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({ 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Payment failed' 
      });
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleBack = () => {
    navigate('/paywall');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Payment</h1>
        </div>

        {/* Plan Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Subscription Plan</CardTitle>
            <CardDescription>
              {planData.billingCycle === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(planData.amount)}
              </span>
              <Badge variant="secondary">
                {planData.billingCycle === 'annual' ? 'per year' : 'per month'}
              </Badge>
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
              className="mb-6"
            >
              <Alert className={paymentStatus.status === 'success' ? 'border-green-200 bg-green-50' : 
                               paymentStatus.status === 'failed' ? 'border-red-200 bg-red-50' :
                               paymentStatus.status === 'expired' ? 'border-orange-200 bg-orange-50' :
                               'border-blue-200 bg-blue-50'}>
                <div className="flex items-center">
                  {paymentStatus.status === 'processing' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {paymentStatus.status === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-600" />}
                  {paymentStatus.status === 'failed' && <XCircle className="w-4 h-4 mr-2 text-red-600" />}
                  {paymentStatus.status === 'expired' && <Clock className="w-4 h-4 mr-2 text-orange-600" />}
                  
                  <AlertDescription>
                    {paymentStatus.status === 'processing' && 'Processing payment...'}
                    {paymentStatus.status === 'success' && 'Payment successful!'}
                    {paymentStatus.status === 'failed' && `Payment failed: ${paymentStatus.error}`}
                    {paymentStatus.status === 'expired' && 'Payment expired. Please try again.'}
                  </AlertDescription>
                </div>
                
                {paymentStatus.status === 'processing' && (
                  <div className="mt-2 text-sm text-gray-600">
                    Time remaining: {formatTime(timeLeft)}
                  </div>
                )}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Methods */}
        {paymentStatus.status === 'idle' && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>
                Select your preferred payment option
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handlePaymentMethod(option.id)}
                    disabled={isRedirecting}
                  >
                    <div className="flex items-center w-full">
                      <option.icon className="w-5 h-5 mr-3 text-gray-600" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center">
                          <span className="font-medium">{option.name}</span>
                          {option.popular && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
              
              {/* PhonePe QR Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PayByQRButton
                  amount={planData.amount}
                  onSuccess={() => {
                    setPaymentStatus({ status: 'processing' });
                    toast.success('Payment initiated! Complete payment in the popup.');
                  }}
                  onError={(error) => {
                    setPaymentStatus({ status: 'failed', error });
                    toast.error('Payment failed: ' + error);
                  }}
                />
              </motion.div>
            </CardContent>
          </Card>
        )}

        {/* Success Actions */}
        {paymentStatus.status === 'success' && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your subscription has been activated. Welcome to UrCare Pro!
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onComplete={() => {
          setShowQRModal(false);
          setPaymentStatus({ status: 'success', orderId: paymentStatus.orderId });
          toast.success('Payment submitted! We will activate your subscription in 1-2 hours.');
        }}
        amount={planData.amount}
        planName={planData.name}
        billingCycle="monthly"
        userId="demo_user"
      />
    </div>
  );
};

export default Paycheckout;
