import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Crown, Users, Star, Shield, Zap } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  originalPrice: number;
  firstTimePrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

const Paywall: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>('family');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      originalPrice: 12,
      firstTimePrice: 10,
      annualPrice: 99.99,
      features: [
        'AI-powered health insights',
        'Personalized meal plans',
        'Basic health tracking',
        '24/7 health support',
        'Mobile app access'
      ],
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      id: 'family',
      name: 'Family',
      originalPrice: 25,
      firstTimePrice: 15,
      annualPrice: 199.99,
      features: [
        'Everything in Basic',
        'Up to 5 family members',
        'Family health dashboard',
        'Shared meal planning',
        'Family health reports',
        'Priority customer support'
      ],
      popular: true,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      id: 'elite',
      name: 'Elite',
      originalPrice: 40,
      firstTimePrice: 20,
      annualPrice: 399.99,
      features: [
        'Everything in Family',
        'Unlimited health consultations',
        'Advanced AI diagnostics',
        'Personal health coach',
        'Premium meal plans',
        'Exclusive wellness content',
        'VIP customer support'
      ],
      icon: Crown,
      color: 'bg-yellow-500'
    }
  ];

  const selectedTierData = subscriptionTiers.find(tier => tier.id === selectedTier);
  const isAnnual = billingCycle === 'annual';
  
  const getCurrentPrice = (tier: SubscriptionTier) => {
    if (isAnnual) {
      return tier.annualPrice;
    }
    return isFirstTimeUser ? tier.firstTimePrice : tier.originalPrice;
  };

  const getSavings = (tier: SubscriptionTier) => {
    if (isAnnual) {
      const monthlyEquivalent = tier.originalPrice * 12;
      return monthlyEquivalent - tier.annualPrice;
    }
    if (isFirstTimeUser) {
      return tier.originalPrice - tier.firstTimePrice;
    }
    return 0;
  };

  const handleSubscribe = () => {
    // TODO: Implement actual subscription logic
    alert(`Subscribing to ${selectedTierData?.name} plan for $${getCurrentPrice(selectedTierData!)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </Button>
        </div>
        <div className="text-center pt-16 pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Health Journey
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Unlock personalized health insights and take control of your wellness with our premium plans
          </p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          <div className="flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                Save
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionTiers.map((tier) => {
            const currentPrice = getCurrentPrice(tier);
            const savings = getSavings(tier);
            const isSelected = selectedTier === tier.id;
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-xl ${
                  isSelected ? 'border-blue-500 shadow-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                      <Star className="w-3 h-3 inline mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Tier Header */}
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <tier.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${isAnnual ? (currentPrice / 12).toFixed(2) : currentPrice}
                      </span>
                      <span className="text-gray-600">
                        /{isAnnual ? 'mo' : 'month'}
                      </span>
                    </div>
                    
                    {isAnnual && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed annually (${currentPrice})
                      </div>
                    )}
                    
                    {isFirstTimeUser && !isAnnual && (
                      <div className="text-sm text-green-600 mt-1 font-medium">
                        First-time user discount!
                      </div>
                    )}
                    
                    {savings > 0 && (
                      <div className="text-sm text-green-600 mt-1 font-medium">
                        Save ${savings.toFixed(2)} {isAnnual ? 'per year' : 'this month'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Start Your Health Journey?
            </h3>
            <p className="text-gray-600 text-sm">
              Join thousands of users who have transformed their health with UrCare
            </p>
          </div>

          {/* Selected Plan Summary */}
          {selectedTierData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedTierData.name} Plan</h4>
                  <p className="text-sm text-gray-600">
                    {isAnnual ? 'Annual billing' : 'Monthly billing'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${getCurrentPrice(selectedTierData)}
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-500">
                      ${(getCurrentPrice(selectedTierData) / 12).toFixed(2)}/mo
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subscribe Button */}
          <Button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl text-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Your {selectedTierData?.name} Plan
          </Button>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure Payment
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                30-Day Guarantee
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Cancel Anytime
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-500">
          By subscribing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Paywall; 