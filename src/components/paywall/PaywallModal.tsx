import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star, X, Zap } from "lucide-react";
import React, { useState } from "react";
import PhonePePaywallModal from "./PhonePePaywallModal";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
  currentPlan?: string;
}

const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  featureName,
  currentPlan = "Free",
}) => {
  const [showPhonePeModal, setShowPhonePeModal] = useState(false);

  const handlePhonePeUpgrade = () => {
    setShowPhonePeModal(true);
  };

  const handlePhonePeClose = () => {
    setShowPhonePeModal(false);
  };

  const handlePhonePeSuccess = (paymentData: any) => {
    setShowPhonePeModal(false);
    onUpgrade(); // Trigger the original upgrade flow
  };

  const handlePhonePeError = (error: string) => {
    console.error("PhonePe payment error:", error);
    // You can show a toast or error message here
  };

  if (!isOpen) return null;

  const benefits = [
    "Unlimited AI health consultations",
    "Personalized meal plans",
    "Advanced health tracking",
    "Family health dashboard",
    "Priority customer support",
    "Exclusive wellness content",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Upgrade Required
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4 mr-2" />
              Premium Feature
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {featureName} is a premium feature
            </h3>
            <p className="text-gray-600">
              Upgrade to unlock this feature and many more benefits
            </p>
          </div>

          <Card className="mb-6 border-2 border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex p-3 rounded-full bg-blue-100 mb-4">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">Premium Plan</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">₹12</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                or ₹99/year (save 30%)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handlePhonePeUpgrade}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <Zap className="h-5 w-5 mr-2" />
              Upgrade Now
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              Maybe Later
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Current plan: <span className="font-medium">{currentPlan}</span>
            </p>
          </div>
        </div>
      </div>

      {/* PhonePe Payment Modal */}
      <PhonePePaywallModal
        isOpen={showPhonePeModal}
        onClose={handlePhonePeClose}
        onUpgrade={onUpgrade}
        featureName={featureName}
        currentPlan={currentPlan}
        onPaymentSuccess={handlePhonePeSuccess}
        onPaymentError={handlePhonePeError}
      />
    </div>
  );
};

export default PaywallModal;
