import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { razorpaySubscriptionService } from '@/services/razorpaySubscriptionService';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!user) {
        console.error('No user found for payment success');
        navigate('/');
        return;
      }

      try {
        // Get payment data from URL parameters or location state
        const urlParams = new URLSearchParams(location.search);
        const paymentId = urlParams.get('payment_id') || location.state?.paymentId;
        const orderId = urlParams.get('order_id') || location.state?.orderId;
        const amount = urlParams.get('amount') || location.state?.amount;
        const planSlug = urlParams.get('plan') || location.state?.planSlug || 'basic';
        const billingCycle = urlParams.get('cycle') || location.state?.billingCycle || 'monthly';

        console.log('🎉 Payment success data:', {
          paymentId,
          orderId,
          amount,
          planSlug,
          billingCycle
        });

        if (!paymentId) {
          console.error('No payment ID found');
          toast.error('Payment verification failed');
          navigate('/paywall');
          return;
        }

        // Create subscription from payment
        const paymentData = {
          paymentId,
          orderId,
          amount: amount ? parseInt(amount) : 0,
          currency: 'INR',
          status: 'captured' as const,
          userId: user.id,
          planSlug,
          billingCycle: billingCycle as 'monthly' | 'yearly',
          timestamp: new Date().toISOString()
        };

        console.log('💳 Creating subscription from payment:', paymentData);

        const success = await razorpaySubscriptionService.createSubscriptionFromPayment(paymentData);

        if (success) {
          setSubscriptionCreated(true);
          toast.success('🎉 Payment successful! Your subscription is now active!');
          
          // Wait a moment then redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          toast.error('Failed to create subscription. Please contact support.');
          navigate('/paywall');
        }

      } catch (error) {
        console.error('❌ Error processing payment success:', error);
        toast.error('Error processing payment. Please contact support.');
        navigate('/paywall');
      } finally {
        setIsProcessing(false);
      }
    };

    handlePaymentSuccess();
  }, [user, navigate, location]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#88ba82] to-[#95c190]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
          <p className="text-white/80">Please wait while we verify your payment and activate your subscription.</p>
        </div>
      </div>
    );
  }

  if (subscriptionCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#88ba82] to-[#95c190]">
        <div className="text-center max-w-md mx-auto px-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-white/90 text-lg mb-6">
            Your subscription has been activated successfully. You now have access to all UrCare features.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <p className="text-white text-sm">
              Redirecting you to your dashboard in a moment...
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-[#88ba82] px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#88ba82] to-[#95c190]">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-4">Payment Processing</h1>
        <p className="text-white/90 text-lg mb-6">
          We're setting up your subscription. Please wait...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;