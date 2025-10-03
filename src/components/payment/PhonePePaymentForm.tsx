import React, { useEffect, useState } from "react";
import { PhonePeService, PhonePeUtils } from "@/services/phonepeService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";

interface PhonePePaymentFormProps {
  planId: string;
  planName: string;
  amount: number;
  billingCycle: "monthly" | "annual";
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: string) => void;
  onCancel?: () => void;
}

const PhonePePaymentForm: React.FC<PhonePePaymentFormProps> = ({
  planId,
  planName,
  amount,
  billingCycle,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}) => {
  const [user, setUser] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"PAY_PAGE" | "UPI_INTENT" | "UPI_COLLECT" | "UPI_QR" | "CARD" | "NET_BANKING">("PAY_PAGE");
  const [vpa, setVpa] = useState("");
  const [isVpaValid, setIsVpaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<any>(null);
  const [error, setError] = useState("");
  const [environmentInfo, setEnvironmentInfo] = useState<any>(null);
  const [testDetails, setTestDetails] = useState<any>(null);

  // Card details for testing
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardType: "DEBIT_CARD",
    cardIssuer: "VISA",
    expiryMonth: 12,
    expiryYear: 2023,
    cvv: "",
  });

  // UPI target app selection
  const [targetApp, setTargetApp] = useState("phonepe");

  // Net banking bank selection
  const [bankCode, setBankCode] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await PhonePeService.supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Get environment info
    setEnvironmentInfo(PhonePeService.getEnvironmentInfo());
    setTestDetails(PhonePeService.getTestPaymentDetails());
  }, []);

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const options = await PhonePeService.getPaymentOptions({
          amount,
          currency: "INR",
        });
        setPaymentOptions(options.payment_options);
      } catch (err) {
        console.error("Failed to load payment options:", err);
      }
    };
    loadPaymentOptions();
  }, [amount]);

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

  const handlePayment = async () => {
    if (!user) {
      setError("Please log in to continue");
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

    setIsLoading(true);
    setError("");

    try {
      const paymentData = await PhonePeService.initiatePayment({
        user_id: user.id,
        plan_id: planId,
        billing_cycle: billingCycle,
        amount: amount,
        currency: "INR",
        payment_method: paymentMethod,
        redirect_url: `${window.location.origin}/payment/success`,
        callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
        user_email: user.email,
        user_phone: user.phone,
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
      setIsLoading(false);
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
    }
  };

  const renderPaymentMethodOptions = () => {
    if (!paymentOptions) return null;

    const methods = [
      { id: "PAY_PAGE", name: "All Payment Methods", description: "Cards, UPI, Net Banking, Wallets", icon: <CreditCard className="w-4 h-4" /> },
      { id: "UPI_INTENT", name: "UPI Intent", description: "Pay with UPI apps", icon: <Smartphone className="w-4 h-4" /> },
      { id: "UPI_COLLECT", name: "UPI Collect", description: "Pay with UPI ID", icon: <Smartphone className="w-4 h-4" /> },
      { id: "UPI_QR", name: "UPI QR", description: "Scan QR code to pay", icon: <Smartphone className="w-4 h-4" /> },
      { id: "CARD", name: "Card Payment", description: "Credit/Debit cards", icon: <CreditCard className="w-4 h-4" /> },
      { id: "NET_BANKING", name: "Net Banking", description: "Direct bank transfer", icon: <Building2 className="w-4 h-4" /> },
    ];

    return (
      <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
        <div className="grid grid-cols-1 gap-4">
          {methods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  {method.icon}
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    );
  };

  const renderPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case "UPI_COLLECT":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vpa">UPI VPA (Virtual Payment Address)</Label>
              <Input
                id="vpa"
                type="text"
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                placeholder="user@paytm"
                className="mt-1"
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
            <Label htmlFor="targetApp">Select UPI App</Label>
            <Select value={targetApp} onValueChange={setTargetApp}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {testDetails?.upi.targetApps.map((app: string) => (
                  <SelectItem key={app} value={app}>
                    {app.charAt(0).toUpperCase() + app.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "CARD":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryMonth">Expiry Month</Label>
                <Input
                  id="expiryMonth"
                  type="number"
                  value={cardDetails.expiryMonth}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryMonth: parseInt(e.target.value) })}
                  min="1"
                  max="12"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expiryYear">Expiry Year</Label>
                <Input
                  id="expiryYear"
                  type="number"
                  value={cardDetails.expiryYear}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryYear: parseInt(e.target.value) })}
                  min="2024"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                placeholder="123"
                maxLength={4}
                className="mt-1"
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
            <Label htmlFor="bankCode">Select Bank</Label>
            <Select value={bankCode} onValueChange={setBankCode}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SBI">State Bank of India</SelectItem>
                <SelectItem value="HDFC">HDFC Bank</SelectItem>
                <SelectItem value="ICICI">ICICI Bank</SelectItem>
                <SelectItem value="AXIS">Axis Bank</SelectItem>
                <SelectItem value="KOTAK">Kotak Mahindra Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>
            Secure payment powered by PhonePe
            {environmentInfo && (
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                environmentInfo.isProduction 
                  ? "bg-red-100 text-red-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {environmentInfo.environment.toUpperCase()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{planName}</h3>
            <p className="text-sm text-gray-600 capitalize">{billingCycle} billing</p>
            <p className="text-2xl font-bold text-green-600">
              {PhonePeUtils.formatAmount(amount)}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            {renderPaymentMethodOptions()}
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
                <strong>Test Mode:</strong> Use the test details provided for testing payments.
                <br />
                <strong>Test Card:</strong> {testDetails.card.number} | CVV: {testDetails.card.cvv}
                <br />
                <strong>Test UPI:</strong> {testDetails.upi.vpa}
                <br />
                <strong>Test Net Banking:</strong> Username: {testDetails.netbanking.username} | Password: {testDetails.netbanking.password}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handlePayment}
              disabled={
                isLoading || 
                (paymentMethod === "UPI_COLLECT" && (!vpa || !isVpaValid)) ||
                (paymentMethod === "CARD" && (!cardDetails.cardNumber || !cardDetails.cvv)) ||
                (paymentMethod === "NET_BANKING" && !bankCode)
              }
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${PhonePeUtils.formatAmount(amount)}`
              )}
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center">
            <p>🔒 Your payment information is secure and encrypted</p>
            <p>You will be redirected to PhonePe for secure payment processing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhonePePaymentForm;
