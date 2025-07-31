import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield, CheckCircle, XCircle, Globe, Currency } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService } from '@/services/subscriptionService';
import { razorpayService } from '@/services/razorpayService';

interface RazorpayCheckoutProps {
  planSlug: string;
  billingCycle: 'monthly' | 'annual';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  planSlug,
  billingCycle,
  onSuccess,
  onError,
  onCancel
}) => {
  const { user } = useAuth();
  const { loading, error, initiatePayment, getUserCurrency, getSupportedPaymentMethods } = useRazorpay();
  const [userCurrency, setUserCurrency] = useState<string>('INR');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [pricing, setPricing] = useState<{ amount: number; currency: string } | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        // Get user's currency
        const currency = await getUserCurrency();
        setUserCurrency(currency);

        // Get supported payment methods
        const methods = await getSupportedPaymentMethods(currency);
        setPaymentMethods(methods);

        // Check first-time eligibility
        const firstTime = await subscriptionService.isEligibleForFirstTimePricing(user.id);
        setIsFirstTime(firstTime);

        // Calculate pricing
        const pricingData = await razorpayService.calculateAmount(planSlug, billingCycle, firstTime, user.id);
        setPricing(pricingData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user, planSlug, billingCycle, getUserCurrency, getSupportedPaymentMethods]);

  const handlePayment = async () => {
    try {
      await initiatePayment(planSlug, billingCycle);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'SGD': 'S$',
      'AED': 'د.إ',
      'SAR': 'ر.س'
    };
    return symbols[currency] || currency;
  };

  const getPaymentMethodNames = (methods: string[]): string[] => {
    const methodNames: Record<string, string> = {
      'card': 'Credit/Debit Card',
      'upi': 'UPI',
      'netbanking': 'Net Banking',
      'wallet': 'Digital Wallet',
      'emi': 'EMI',
      'paypal': 'PayPal',
      'sofort': 'Sofort',
      'giropay': 'Giropay',
      'ideal': 'iDEAL',
      'bacs': 'BACS',
      'interac': 'Interac',
      'bpay': 'BPAY',
      'konbini': 'Konbini',
      'paynow': 'PayNow',
      'mada': 'Mada'
    };

    return methods.map(method => methodNames[method] || method);
  };

  if (!user) {
    return (
      <Alert>
        <XCircle className="h-4 w-4" />
        <AlertDescription>Please log in to proceed with payment.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Payment Summary
          </CardTitle>
          <CardDescription>
            {planSlug.charAt(0).toUpperCase() + planSlug.slice(1)} Plan - {billingCycle} billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pricing Display */}
          {pricing && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount:</span>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  {getCurrencySymbol(pricing.currency)}{pricing.amount}
                </span>
                <span className="text-sm text-gray-500 ml-1">{pricing.currency}</span>
              </div>
            </div>
          )}

          {/* First-time Discount */}
          {isFirstTime && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">First-time subscriber discount applied</span>
            </div>
          )}

          {/* Currency Information */}
          {userCurrency !== 'INR' && (
            <div className="flex items-center gap-2 text-blue-600">
              <Currency className="h-4 w-4" />
              <span className="text-sm">
                Amount converted to {userCurrency} for your region
              </span>
            </div>
          )}

          {/* Payment Methods */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Available Payment Methods:</span>
            <div className="flex flex-wrap gap-2">
              {getPaymentMethodNames(paymentMethods).map((method, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-green-800">Secure Payment</h4>
              <p className="text-sm text-green-700">
                Your payment is processed securely by Razorpay. We never store your payment details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="text-center space-y-2">
        <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
          <span>🔒 SSL Secured</span>
          <span>🛡️ PCI Compliant</span>
          <span>🌍 International</span>
        </div>
        <p className="text-xs text-gray-400">
          By proceeding, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
};

export default RazorpayCheckout; 