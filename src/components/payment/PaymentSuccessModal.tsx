import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  amount: number;
  paymentMethod: string;
  onClose: () => void;
}

export default function PaymentSuccessModal({ isOpen, amount, paymentMethod, onClose }: PaymentSuccessModalProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, navigate]);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Confetti Animation */}
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              
              {/* Animated Confetti */}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-500 animate-bounce" />
              </div>
              <div className="absolute -top-1 -left-2">
                <Sparkles className="w-6 h-6 text-pink-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <Sparkles className="w-7 h-7 text-blue-500 animate-bounce" style={{ animationDelay: '1s' }} />
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Sparkles className="w-5 h-5 text-purple-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
              <div className="absolute -bottom-2 -left-1">
                <Sparkles className="w-6 h-6 text-orange-500 animate-bounce" style={{ animationDelay: '0.8s' }} />
              </div>
              <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                <Sparkles className="w-5 h-5 text-green-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <div className="absolute top-1/2 -left-3 transform -translate-y-1/2">
                <Sparkles className="w-5 h-5 text-red-500 animate-bounce" style={{ animationDelay: '0.7s' }} />
              </div>
            </div>

            {/* Success Message */}
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">
                Your payment of <span className="font-semibold text-green-600">₹{amount}</span> has been processed successfully.
              </p>
              <p className="text-sm text-gray-500">
                Payment method: <span className="font-medium capitalize">{paymentMethod}</span>
              </p>
            </div>

            {/* Countdown */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Redirecting to Dashboard in {countdown} seconds...
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Go to Dashboard Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
