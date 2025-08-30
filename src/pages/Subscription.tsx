import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Crown, 
  Users, 
  Zap, 
  Shield, 
  Heart,
  Activity,
  Target,
  Calendar,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: billingCycle === 'monthly' ? '$12' : '$99',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      originalPrice: billingCycle === 'annual' ? '$144' : undefined,
      features: [
        'AI-powered health insights',
        'Personalized meal plans',
        'Basic health tracking',
        '24/7 health support',
        'Mobile app access'
      ],
      icon: <Heart className="h-6 w-6" />,
      color: 'text-blue-500'
    },
    {
      id: 'family',
      name: 'Family',
      price: billingCycle === 'monthly' ? '$25' : '$199',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      originalPrice: billingCycle === 'annual' ? '$300' : undefined,
      features: [
        'Everything in Basic',
        'Up to 5 family members',
        'Family health dashboard',
        'Shared meal planning',
        'Family health reports',
        'Priority customer support'
      ],
      popular: true,
      icon: <Users className="h-6 w-6" />,
      color: 'text-green-500'
    },
    {
      id: 'elite',
      name: 'Elite',
      price: billingCycle === 'monthly' ? '$40' : '$399',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      originalPrice: billingCycle === 'annual' ? '$480' : undefined,
      features: [
        'Everything in Family',
        'Unlimited health consultations',
        'Advanced AI diagnostics',
        'Personal health coach',
        'Premium meal plans',
        'Exclusive wellness content',
        'VIP customer support'
      ],
      icon: <Crown className="h-6 w-6" />,
      color: 'text-purple-500'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    
    // Navigate to payment page or handle subscription
    toast.success('Redirecting to payment...');
    navigate('/payment', { state: { plan: selectedPlan, cycle: billingCycle } });
  };

  const savings = billingCycle === 'annual' ? 'Save up to 30%' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-800">Choose Your Plan</h1>
            <p className="text-xs text-gray-500">Unlock your full health potential</p>
          </div>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Billing Toggle */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-green-600' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  billingCycle === 'annual' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-green-600' : 'text-gray-500'}`}>
                Annual
              </span>
            </div>
            
            {savings && (
              <div className="text-center mt-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {savings}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`border-2 transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-green-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${plan.color}`}>
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-800">{plan.price}</span>
                        <span className="text-sm text-gray-500">{plan.period}</span>
                        {plan.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{plan.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {plan.popular && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  {selectedPlan === plan.id && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span>What's Included</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm">AI Health Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Personalized Plans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Progress Tracking</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Data Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Smart Reminders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Premium Support</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscribe Button */}
        <div className="sticky bottom-4">
          <Button
            onClick={handleSubscribe}
            disabled={!selectedPlan}
            className={`w-full py-4 text-lg font-semibold ${
              selectedPlan
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedPlan ? `Subscribe to ${plans.find(p => p.id === selectedPlan)?.name}` : 'Select a Plan'}
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            Cancel anytime. No commitment required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
