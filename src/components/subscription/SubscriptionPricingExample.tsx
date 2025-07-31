import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuth } from '@/contexts/AuthContext';
import { getPricingForUser, isEligibleForFirstTimePricing } from '@/utils/subscriptionUtils';
import { SubscriptionPlan } from '@/types/subscription';

interface PricingDisplayProps {
  plan: SubscriptionPlan;
  isFirstTime: boolean;
  billingCycle: 'monthly' | 'annual';
  onSelectPlan: (planSlug: string, billingCycle: 'monthly' | 'annual') => void;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  plan,
  isFirstTime,
  billingCycle,
  onSelectPlan
}) => {
  const [userPrice, setUserPrice] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadPricing = async () => {
      if (user?.id) {
        const price = await subscriptionService.getPricingForUser(
          user.id,
          plan.slug,
          billingCycle
        );
        setUserPrice(price);
      }
    };

    loadPricing();
  }, [plan.slug, billingCycle, user?.id]);

  const originalPrice = billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
  const hasDiscount = userPrice < originalPrice;

  return (
    <Card className={`relative ${plan.is_popular ? 'border-2 border-purple-500' : ''}`}>
      {plan.is_popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {plan.name}
          {isFirstTime && (
            <Badge variant="secondary" className="text-xs">
              First Time
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${userPrice.toFixed(2)}</span>
            <span className="text-gray-500">
              /{billingCycle === 'annual' ? 'year' : 'month'}
            </span>
          </div>
          {hasDiscount && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <Badge variant="destructive" className="text-xs">
                Save ${(originalPrice - userPrice).toFixed(2)}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          className="w-full"
          onClick={() => onSelectPlan(plan.slug, billingCycle)}
        >
          Select {plan.name}
        </Button>
      </CardContent>
    </Card>
  );
};

export const SubscriptionPricingExample: React.FC = () => {
  const { user } = useAuth();
  const { subscription, loading } = useSubscription();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPricing, setLoadingPricing] = useState<boolean>(false);

  useEffect(() => {
    const loadPlansAndEligibility = async () => {
      if (user?.id) {
        setLoadingPricing(true);
        try {
          const [plansData, eligibility] = await Promise.all([
            subscriptionService.getSubscriptionPlans(),
            subscriptionService.isEligibleForFirstTimePricing(user.id)
          ]);
          setPlans(plansData);
          setIsFirstTime(eligibility);
        } catch (error) {
          console.error('Error loading plans and eligibility:', error);
        } finally {
          setLoadingPricing(false);
        }
      }
    };

    loadPlansAndEligibility();
  }, [user?.id]);

  const handleSelectPlan = async (planSlug: string, cycle: 'monthly' | 'annual') => {
    if (!user?.id) {
      alert('Please log in to select a plan');
      return;
    }

    try {
      // Here you would typically redirect to a payment processor
      // or integrate with your payment system
      console.log('Selected plan:', { planSlug, billingCycle: cycle, isFirstTime });
      
      // Example: Create subscription
      const subscription = await subscriptionService.createSubscription(user.id, {
        planSlug,
        billingCycle: cycle,
        paymentMethodId: 'example_payment_method', // Replace with actual payment method
        trialDays: isFirstTime ? 7 : 0 // Give first-time users a 7-day trial
      });

      if (subscription) {
        alert('Subscription created successfully!');
        // Refresh subscription data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to create subscription. Please try again.');
    }
  };

  if (loading || loadingPricing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 mb-6">
          {isFirstTime 
            ? "Welcome! You're eligible for special first-time pricing."
            : "Select the plan that best fits your needs."
          }
        </p>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'annual' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('annual')}
          >
            Annual
            <Badge className="ml-2 bg-green-500">Save up to 30%</Badge>
          </Button>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{subscription.plan_name}</p>
                  <p className="text-sm text-gray-500">
                    {subscription.billing_cycle} • Expires {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                  {subscription.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PricingDisplay
            key={plan.id}
            plan={plan}
            isFirstTime={isFirstTime}
            billingCycle={billingCycle}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>All plans include a 30-day money-back guarantee</p>
        <p>Cancel anytime • No setup fees • Secure payment processing</p>
      </div>
    </div>
  );
};

export default SubscriptionPricingExample; 