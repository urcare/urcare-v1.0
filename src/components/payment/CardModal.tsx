import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CreditCard, CheckCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (cardDetails: any) => void;
  amount: number;
}

export default function CardModal({ isOpen, onClose, onPaymentSuccess, amount }: CardModalProps) {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidCard, setIsValidCard] = useState(false);

  const validateCard = () => {
    const { number, expiry, cvv, name } = cardDetails;
    
    // Basic validation
    const isNumberValid = /^\d{16}$/.test(number.replace(/\s/g, ''));
    const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
    const isCvvValid = /^\d{3,4}$/.test(cvv);
    const isNameValid = name.trim().length >= 2;
    
    return isNumberValid && isExpiryValid && isCvvValid && isNameValid;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'expiry') {
      // Format expiry date
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
    } else if (field === 'cvv') {
      // Limit CVV to 4 digits
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Validate after a short delay
    setTimeout(() => {
      setIsValidCard(validateCard());
    }, 100);
  };

  const handlePayment = async () => {
    if (!isValidCard) {
      toast.error("Please fill all card details correctly");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate card payment processing
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate payment success
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        toast.success("Payment successful!");
        onPaymentSuccess(cardDetails);
      } else {
        toast.error("Payment failed. Please check your card details.");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Card Payment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Enter Card Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              Amount to be paid: <span className="font-semibold text-green-600">₹{amount}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Card Number</label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                maxLength={19}
                className={`${isValidCard && cardDetails.number ? 'border-green-500' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  maxLength={5}
                  className={`${isValidCard && cardDetails.expiry ? 'border-green-500' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <Input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  maxLength={4}
                  className={`${isValidCard && cardDetails.cvv ? 'border-green-500' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`${isValidCard && cardDetails.name ? 'border-green-500' : ''}`}
              />
            </div>

            {isValidCard && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                All details are valid
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handlePayment}
              disabled={!isValidCard || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing Payment...
                </div>
              ) : (
                `Pay ₹${amount}`
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Your payment is secured with 256-bit SSL encryption
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
