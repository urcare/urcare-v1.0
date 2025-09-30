import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Smartphone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface UPIPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (upiId: string) => void;
  amount: number;
}

export default function UPIPopup({ isOpen, onClose, onPaymentSuccess, amount }: UPIPopupProps) {
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidUPI, setIsValidUPI] = useState(false);

  const validateUPI = (id: string) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(id);
  };

  const handleUPIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpiId(value);
    setIsValidUPI(validateUPI(value));
  };

  const handlePayment = async () => {
    if (!isValidUPI) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate UPI payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      
      if (isSuccess) {
        toast.success("Payment successful!");
        onPaymentSuccess(upiId);
      } else {
        toast.error("Payment failed. Please try again.");
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
          <CardTitle className="text-lg font-semibold">UPI Payment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Enter UPI ID</h3>
            <p className="text-sm text-gray-600 mb-4">
              Amount to be paid: <span className="font-semibold text-green-600">₹{amount}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">UPI ID</label>
            <Input
              type="text"
              placeholder="Enter your UPI ID (e.g., user@paytm)"
              value={upiId}
              onChange={handleUPIChange}
              className={`${isValidUPI && upiId ? 'border-green-500' : ''}`}
            />
            {isValidUPI && upiId && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Valid UPI ID
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handlePayment}
              disabled={!isValidUPI || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
            You will be redirected to your UPI app to complete the payment
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
