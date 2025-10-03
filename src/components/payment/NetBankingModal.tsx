import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Building2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface NetBankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (bankDetails: any) => void;
  amount: number;
}

export default function NetBankingModal({ isOpen, onClose, onPaymentSuccess, amount }: NetBankingModalProps) {
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    password: "",
    customerId: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidBank, setIsValidBank] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateBankDetails = () => {
    const { bankName, accountNumber, ifscCode, password, customerId } = bankDetails;
    
    // Basic validation
    const isBankNameValid = bankName.trim().length >= 3;
    const isAccountValid = /^\d{9,18}$/.test(accountNumber.replace(/\s/g, ''));
    const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase());
    const isPasswordValid = password.length >= 6;
    const isCustomerIdValid = customerId.trim().length >= 3;
    
    return isBankNameValid && isAccountValid && isIfscValid && isPasswordValid && isCustomerIdValid;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'accountNumber') {
      // Format account number with spaces
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'ifscCode') {
      // Format IFSC code to uppercase
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    
    setBankDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Validate after a short delay
    setTimeout(() => {
      setIsValidBank(validateBankDetails());
    }, 100);
  };

  const handlePayment = async () => {
    if (!isValidBank) {
      toast.error("Please fill all bank details correctly");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate net banking payment processing
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Simulate payment success
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        toast.success("Payment successful!");
        onPaymentSuccess(bankDetails);
      } else {
        toast.error("Payment failed. Please check your bank details.");
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
          <CardTitle className="text-lg font-semibold">Net Banking Payment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Enter Bank Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              Amount to be paid: <span className="font-semibold text-green-600">₹{amount}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bank Name</label>
              <Input
                type="text"
                placeholder="Enter bank name (e.g., State Bank of India)"
                value={bankDetails.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className={`${isValidBank && bankDetails.bankName ? 'border-green-500' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Number</label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={bankDetails.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className={`${isValidBank && bankDetails.accountNumber ? 'border-green-500' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">IFSC Code</label>
              <Input
                type="text"
                placeholder="SBIN0001234"
                value={bankDetails.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                maxLength={11}
                className={`${isValidBank && bankDetails.ifscCode ? 'border-green-500' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Customer ID</label>
              <Input
                type="text"
                placeholder="Enter your customer ID"
                value={bankDetails.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className={`${isValidBank && bankDetails.customerId ? 'border-green-500' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Internet Banking Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your internet banking password"
                  value={bankDetails.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`${isValidBank && bankDetails.password ? 'border-green-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isValidBank && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                All details are valid
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handlePayment}
              disabled={!isValidBank || isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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





