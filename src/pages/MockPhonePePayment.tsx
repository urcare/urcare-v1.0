import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, CreditCard, Smartphone, Building2, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function MockPhonePePayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [netBankingBank, setNetBankingBank] = useState("");
  const [netBankingPassword, setNetBankingPassword] = useState("");

  const orderId = searchParams.get('orderId');
  const merchantId = searchParams.get('merchantId');
  const amount = searchParams.get('amount');
  const plan = searchParams.get('plan');
  const cycle = searchParams.get('cycle');

  const amountInRupees = amount ? (Number(amount) / 100).toFixed(2) : '0.00';

  useEffect(() => {
    // Simulate PhonePe page loading
    const timer = setTimeout(() => {
      console.log('PhonePe payment page loaded');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePayment = async (method: string) => {
    setSelectedMethod(method);
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate 90% success rate for demo
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      toast.success("🎉 Payment successful!");
      // Redirect to success page
      navigate(`/payment/success?orderId=${orderId}&plan=${plan}&cycle=${cycle}&success=true`);
    } else {
      toast.error("❌ Payment failed. Please try again.");
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using UPI ID',
      color: 'bg-blue-500'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay using card',
      color: 'bg-purple-500'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'Pay using net banking',
      color: 'bg-green-500'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: QrCode,
      description: 'Scan QR to pay',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">PhonePe Payment</CardTitle>
          <p className="text-gray-600">Complete your payment securely</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span className="text-sm font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Merchant:</span>
              <span className="text-sm font-mono">{merchantId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="text-sm capitalize">{plan} ({cycle})</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Amount:</span>
              <span className="text-green-600">₹{amountInRupees}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Choose Payment Method</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={selectedMethod === method.id ? "default" : "outline"}
                    className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                      selectedMethod === method.id ? method.color : ''
                    }`}
                    onClick={() => handlePayment(method.id)}
                    disabled={isProcessing}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{method.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod && !isProcessing && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      type="text"
                      placeholder="Enter your UPI ID (e.g., 1234567890@paytm)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => handlePayment('upi')}
                    className="w-full"
                    disabled={!upiId}
                  >
                    Pay with UPI
                  </Button>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => handlePayment('card')}
                    className="w-full"
                    disabled={!cardNumber || !expiryDate || !cvv || !cardName}
                  >
                    Pay with Card
                  </Button>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bank">Select Bank</Label>
                    <select
                      id="bank"
                      className="w-full p-2 border rounded-md"
                      value={netBankingBank}
                      onChange={(e) => setNetBankingBank(e.target.value)}
                    >
                      <option value="">Select your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="password">Internet Banking Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your internet banking password"
                      value={netBankingPassword}
                      onChange={(e) => setNetBankingPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => handlePayment('netbanking')}
                    className="w-full"
                    disabled={!netBankingBank || !netBankingPassword}
                  >
                    Pay with Net Banking
                  </Button>
                </div>
              )}

              {selectedMethod === 'qr' && (
                <div className="space-y-4 text-center">
                  <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300">
                    <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600">
                      Scan this QR code with your PhonePe app
                    </p>
                  </div>
                  <Button 
                    onClick={() => handlePayment('qr')}
                    className="w-full"
                  >
                    I've Paid via QR
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
              <h3 className="text-lg font-semibold">Processing Payment...</h3>
              <p className="text-gray-600">Please don't close this window</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-center text-sm text-gray-500">
            <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
            <p>Powered by PhonePe</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
