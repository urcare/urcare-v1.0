import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import FeatureGuard from "@/components/paywall/FeatureGuard";
import PaywallModal from "@/components/paywall/PaywallModal";
import PhonePePaywallModal from "@/components/paywall/PhonePePaywallModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BarChart3, Users, Shield, Zap } from "lucide-react";

/**
 * PhonePe Paywall Integration Example
 * 
 * This component demonstrates how to use the PhonePe-integrated paywall system
 * with your existing URCare application.
 */
const PhonePePaywallExample: React.FC = () => {
  const { profile } = useAuth();
  const { hasActiveSubscription, canAccessFeature } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showDirectPayment, setShowDirectPayment] = useState(false);

  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Payment successful:", paymentData);
    setShowPaywall(false);
    setShowDirectPayment(false);
    // Refresh subscription status
    window.location.reload();
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // You can show a toast notification here
  };

  const premiumFeatures = [
    {
      id: "ai_consultations",
      name: "AI Health Consultations",
      description: "Get personalized health advice from our AI health coach",
      icon: <Brain className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "advanced_analytics",
      name: "Advanced Analytics",
      description: "Detailed health insights and progress tracking",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "family_health",
      name: "Family Health Dashboard",
      description: "Manage health for your entire family",
      icon: <Users className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "priority_support",
      name: "Priority Support",
      description: "24/7 priority customer support",
      icon: <Shield className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PhonePe Paywall Integration Demo
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experience the seamless payment integration with PhonePe
        </p>
        
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
            {hasActiveSubscription ? "Premium User" : "Free User"}
          </Badge>
          <Badge variant="outline">
            {profile?.email || "Not logged in"}
          </Badge>
        </div>
      </div>

      {/* Feature Access Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {premiumFeatures.map((feature) => (
          <Card key={feature.id} className="relative">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${feature.bgColor} ${feature.color}`}>
                  {feature.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FeatureGuard 
                featureName={feature.name}
                fallback={
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">
                      This feature requires a premium subscription
                    </p>
                    <Button 
                      onClick={() => setShowPaywall(true)}
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Access
                    </Button>
                  </div>
                }
              >
                <div className="text-center py-4">
                  <div className="text-green-600 mb-2">
                    ✓ You have access to this feature
                  </div>
                  <Button variant="outline" className="w-full">
                    Use Feature
                  </Button>
                </div>
              </FeatureGuard>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Direct Payment Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Standard Paywall Modal</CardTitle>
            <CardDescription>
              Uses the enhanced PaywallModal with PhonePe integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowPaywall(true)}
              className="w-full"
            >
              Show Standard Paywall
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct PhonePe Payment</CardTitle>
            <CardDescription>
              Direct access to PhonePe payment modal with all options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowDirectPayment(true)}
              variant="outline"
              className="w-full"
            >
              Show PhonePe Payment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Integration Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Code examples for integrating PhonePe paywall in your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Feature Guard Usage</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<FeatureGuard featureName="ai_consultations">
  <AIConsultationComponent />
</FeatureGuard>`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Paywall Modal Usage</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<PaywallModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onUpgrade={() => handleUpgrade()}
  featureName="AI Health Consultations"
  currentPlan="Free"
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Direct PhonePe Integration</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<PhonePePaywallModal
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  onUpgrade={() => handleUpgrade()}
  featureName="Premium Subscription"
  currentPlan="Free"
  onPaymentSuccess={(data) => handleSuccess(data)}
  onPaymentError={(error) => handleError(error)}
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Payment Methods</CardTitle>
          <CardDescription>
            PhonePe integration supports multiple payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "All Payment Methods", icon: "💳", description: "Cards, UPI, Net Banking, Wallets" },
              { name: "UPI Intent", icon: "📱", description: "Pay with UPI apps" },
              { name: "UPI Collect", icon: "🏦", description: "Pay with UPI ID" },
              { name: "UPI QR", icon: "📱", description: "Scan QR code to pay" },
              { name: "Card Payment", icon: "💳", description: "Credit/Debit cards" },
              { name: "Net Banking", icon: "🏦", description: "Direct bank transfer" },
            ].map((method, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="font-medium text-sm">{method.name}</div>
                <div className="text-xs text-gray-500">{method.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handlePaymentSuccess}
        featureName="Premium Features"
        currentPlan={hasActiveSubscription ? "Premium" : "Free"}
      />

      <PhonePePaywallModal
        isOpen={showDirectPayment}
        onClose={() => setShowDirectPayment(false)}
        onUpgrade={handlePaymentSuccess}
        featureName="Premium Subscription"
        currentPlan={hasActiveSubscription ? "Premium" : "Free"}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default PhonePePaywallExample;
