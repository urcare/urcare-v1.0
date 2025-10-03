import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PhonePeService, PhonePeUtils } from "@/services/phonepeService";
import { getEnvironmentSettings } from "@/config/phonepe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Star, X, Zap, CreditCard, Smartphone, Building2, Wallet, Loader2 } from "lucide-react";

interface PhonePePaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
  currentPlan?: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: string) => void;
}

const PhonePePaywallModal: React.FC<PhonePePaywallModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  featureName,
  currentPlan = "Free",
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"PAY_PAGE" | "UPI_INTENT" | "UPI_COLLECT" | "UPI_QR" | "CARD" | "NET_BANKING">("PAY_PAGE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [environmentInfo, setEnvironmentInfo] = useState<any>(null);
  const [testDetails, setTestDetails] = useState<any>(null);
  const [error, setError] = useState("");

  // Payment details for specific methods
  const [vpa, setVpa] = useState("");
  const [isVpaValid, setIsVpaValid] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardType: "DEBIT_CARD",
    cardIssuer: "VISA",
    expiryMonth: 12,
    expiryYear: 2023,
    cvv: "",
  });
  const [targetApp, setTargetApp] = useState("phonepe");
  const [bankCode, setBankCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      const envSettings = getEnvironmentSettings();
      setEnvironmentInfo(envSettings);
      setTestDetails(envSettings.testCredentials);
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentMethod === "UPI_COLLECT" && vpa) {
      const validateVpa = async () => {
        if (PhonePeUtils.isValidVPAFormat(vpa)) {
          try {
            const result = await PhonePeService.validateVPA({ vpa });
            setIsVpaValid(result.valid);
          } catch (err) {
            setIsVpaValid(false);
          }
        } else {
          setIsVpaValid(false);
        }
      };
      validateVpa();
    }
  }, [vpa, paymentMethod]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Error fetching plans:", error);
        return;
      }

      setPlans(data || []);
      if (data && data.length > 0) {
        setSelectedPlan(data[0]); // Select first plan by default
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handlePayment = async () => {
    if (!profile?.id || !selectedPlan) {
      setError("Please log in and select a plan");
      return;
    }

    if (paymentMethod === "UPI_COLLECT" && (!vpa || !isVpaValid)) {
      setError("Please enter a valid UPI VPA");
      return;
    }

    if (paymentMethod === "CARD" && (!cardDetails.cardNumber || !cardDetails.cvv)) {
      setError("Please enter complete card details");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const amount = billingCycle === "monthly" 
        ? selectedPlan.price_monthly 
        : selectedPlan.price_annual;

      const paymentData = await PhonePeService.initiatePayment({
        user_id: profile.id,
        plan_id: selectedPlan.id,
        billing_cycle: billingCycle,
        amount: amount,
        currency: "INR",
        payment_method: paymentMethod,
        redirect_url: `${window.location.origin}/payment/success`,
        callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
        user_email: profile.email,
        user_phone: profile.phone,
        upi_vpa: paymentMethod === "UPI_COLLECT" ? vpa : undefined,
        target_app: paymentMethod === "UPI_INTENT" ? targetApp : undefined,
        bank_code: paymentMethod === "NET_BANKING" ? bankCode : undefined,
        card_details: paymentMethod === "CARD" ? cardDetails : undefined,
      });

      if (paymentData.success) {
        // Redirect to PhonePe payment page
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error(paymentData.message || "Payment initiation failed");
      }
    } catch (err: any) {
      setError(err.message);
      onPaymentError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const fillTestData = () => {
    if (!testDetails) return;

    if (paymentMethod === "UPI_COLLECT") {
      setVpa(testDetails.upi.vpa);
    } else if (paymentMethod === "CARD") {
      setCardDetails({
        cardNumber: testDetails.card.number,
        cardType: testDetails.card.type,
        cardIssuer: testDetails.card.issuer,
        expiryMonth: testDetails.card.expiryMonth,
        expiryYear: testDetails.card.expiryYear,
        cvv: testDetails.card.cvv,
      });
    } else if (paymentMethod === "NET_BANKING") {
      setBankCode(testDetails.netbanking.bankCode);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    const iconMap: { [key: string]: any } = {
      PAY_PAGE: <CreditCard className="w-4 h-4" />,
      UPI_INTENT: <Smartphone className="w-4 h-4" />,
      UPI_COLLECT: <Smartphone className="w-4 h-4" />,
      UPI_QR: <Smartphone className="w-4 h-4" />,
      CARD: <CreditCard className="w-4 h-4" />,
      NET_BANKING: <Building2 className="w-4 h-4" />,
    };
    return iconMap[method] || <CreditCard className="w-4 h-4" />;
  };

  const renderPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case "UPI_COLLECT":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI VPA (Virtual Payment Address)
              </label>
              <input
                type="text"
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                placeholder="user@paytm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {vpa && (
                <p className={`text-sm mt-1 ${isVpaValid ? "text-green-600" : "text-red-600"}`}>
                  {isVpaValid ? "✓ Valid VPA" : "✗ Invalid VPA"}
                </p>
              )}
            </div>
            {testDetails && (
              <Button variant="outline" size="sm" onClick={fillTestData}>
                Fill Test VPA
              </Button>
            )}
          </div>
        );

      case "UPI_INTENT":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select UPI App
            </label>
            <select
              value={targetApp}
              onChange={(e) => setTargetApp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {testDetails?.upi.targetApps.map((app: string) => (
                <option key={app} value={app}>
                  {app.charAt(0).toUpperCase() + app.slice(1)}
                </option>
              ))}
            </select>
          </div>
        );

      case "CARD":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Month
                </label>
                <input
                  type="number"
                  value={cardDetails.expiryMonth}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryMonth: parseInt(e.target.value) })}
                  min="1"
                  max="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Year
                </label>
                <input
                  type="number"
                  value={cardDetails.expiryYear}
                  onChange={(e) => setTargetApp(e.target.value)}
                  min="2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {testDetails && (
              <Button variant="outline" size="sm" onClick={fillTestData}>
                Fill Test Card Details
              </Button>
            )}
          </div>
        );

      case "NET_BANKING":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
            </label>
            <select
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your bank</option>
              {testDetails?.banks.map((bank: any) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
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

  const paymentMethods = [
    { id: "PAY_PAGE", name: "All Payment Methods", description: "Cards, UPI, Net Banking, Wallets" },
    { id: "UPI_INTENT", name: "UPI Intent", description: "Pay with UPI apps" },
    { id: "UPI_COLLECT", name: "UPI Collect", description: "Pay with UPI ID" },
    { id: "UPI_QR", name: "UPI QR", description: "Scan QR code to pay" },
    { id: "CARD", name: "Card Payment", description: "Credit/Debit cards" },
    { id: "NET_BANKING", name: "Net Banking", description: "Direct bank transfer" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Upgrade Required
              </h2>
              {environmentInfo && (
                <Badge variant={environmentInfo.isProduction ? "destructive" : "secondary"}>
                  {environmentInfo.isProduction ? "PRODUCTION" : "UAT"}
                </Badge>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plans">Choose Plan</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  <Star className="h-4 w-4 mr-2" />
                  Premium Feature
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {featureName} is a premium feature
                </h3>
                <p className="text-gray-600">
                  Choose a plan to unlock this feature and many more benefits
                </p>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billingCycle === "annual" ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
                <span className={`text-sm font-medium ${billingCycle === "annual" ? "text-gray-900" : "text-gray-500"}`}>
                  Annual
                </span>
                {billingCycle === "annual" && (
                  <span className="text-sm text-green-600 font-medium">
                    Save up to 30%
                  </span>
                )}
              </div>

              {/* Plan Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_annual;
                  const isSelected = selectedPlan?.id === plan.id;
                  
                  return (
                    <Card 
                      key={plan.id} 
                      className={`cursor-pointer transition-all ${
                        isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <CardHeader className="text-center">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{price}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {plan.features.slice(0, 3).map((feature: string, index: number) => (
                            <div key={index} className="flex items-center text-sm">
                              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedPlan && (
                <div className="text-center">
                  <Button onClick={() => document.querySelector('[value="payment"]')?.click()}>
                    Continue to Payment
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              {selectedPlan && (
                <div className="space-y-6">
                  {/* Plan Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{selectedPlan.name}</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {billingCycle} billing
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{billingCycle === "monthly" ? selectedPlan.price_monthly : selectedPlan.price_annual}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            paymentMethod === method.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {getPaymentMethodIcon(method.id)}
                            <div>
                              <div className="font-medium text-sm">{method.name}</div>
                              <div className="text-xs text-gray-500">{method.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method Details */}
                  {paymentMethod !== "PAY_PAGE" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                      {renderPaymentMethodDetails()}
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Test Details Info */}
                  {testDetails && (
                    <Alert>
                      <AlertDescription>
                        <strong>Test Mode:</strong> Use the official PhonePe test credentials for testing payments.
                        <br />
                        <strong>Test Card:</strong> {testDetails.card.number} | CVV: {testDetails.card.cvv} | Expiry: {testDetails.card.expiryMonth}/{testDetails.card.expiryYear}
                        <br />
                        <strong>Test UPI:</strong> {testDetails.upi.vpa}
                        <br />
                        <strong>Test Net Banking:</strong> Username: {testDetails.netbanking.username} | Password: {testDetails.netbanking.password}
                        <br />
                        <strong>Bank Page OTP:</strong> {testDetails.otp.bankPageOtp}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={
                      isProcessing || 
                      (paymentMethod === "UPI_COLLECT" && (!vpa || !isVpaValid)) ||
                      (paymentMethod === "CARD" && (!cardDetails.cardNumber || !cardDetails.cvv)) ||
                      (paymentMethod === "NET_BANKING" && !bankCode)
                    }
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Pay ₹{billingCycle === "monthly" ? selectedPlan.price_monthly : selectedPlan.price_annual}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Premium Benefits
                </h3>
                <p className="text-gray-600">
                  Unlock the full potential of your health journey
                </p>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={() => document.querySelector('[value="plans"]')?.click()}>
                  Choose Your Plan
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Current plan: <span className="font-medium">{currentPlan}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              🔒 Secure payment powered by PhonePe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePePaywallModal;
