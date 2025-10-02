import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, QrCode, CheckCircle, ArrowLeft } from "lucide-react";

export default function PhonePeCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get payment data from location state or URL params
  const { planSlug, billingCycle, amount } = location.state || {};
  const urlParams = new URLSearchParams(location.search);
  const amountFromUrl = urlParams.get('amount');
  const planFromUrl = urlParams.get('plan');
  const cycleFromUrl = urlParams.get('cycle');
  
  // Use data from state or URL params, with defaults for testing
  const finalAmount = amount || parseFloat(amountFromUrl || '1'); // Default to ₹1 for testing
  const finalPlan = planSlug || planFromUrl || 'basic';
  const finalCycle = billingCycle || cycleFromUrl || 'annual';

  const [showQRPopup, setShowQRPopup] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/paywall");
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  const handleDownloadQR = () => {
    // Create a temporary link to download the QR image
    const link = document.createElement('a');
    link.href = '/images/qr.jpg';
    link.download = 'urcare-payment-qr.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded successfully!');
  };

  const handlePaymentComplete = () => {
    toast.success('Payment completed! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Complete Your Payment
          </CardTitle>
          <CardDescription className="text-gray-600">
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="font-medium capitalize">{finalPlan}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Billing:</span>
              <span className="font-medium capitalize">{finalCycle}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-lg font-semibold text-gray-900">Amount:</span>
              <span className="text-xl font-bold text-blue-600">₹{finalAmount}</span>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <Button 
              onClick={() => setShowQRPopup(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-medium"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Pay Now with QR
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/paymentpage', { state: { planSlug: finalPlan, billingCycle: finalCycle, amount: finalAmount } })}
              className="w-full py-3 text-lg font-medium"
            >
              Use Card/UPI Instead
            </Button>
          </div>

          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="w-full text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Previous Step
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Popup */}
      <Dialog open={showQRPopup} onOpenChange={setShowQRPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Scan QR Code to Pay
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Amount: ₹{finalAmount} • {finalPlan} plan ({finalCycle})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* QR Code Image */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img 
                  src="/images/qr.jpg" 
                  alt="Payment QR Code" 
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    console.error('QR image failed to load');
                    e.currentTarget.src = '/qr-code-placeholder.png';
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleDownloadQR}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Image
              </Button>
              
              <Button 
                onClick={handlePaymentComplete}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                I've Paid - Complete
              </Button>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Note:</strong> Please download QR image and Pay. 
                Then we allow your subscription. 
                Our team continuously works to enhance your experience. 
                Thank you, UrCare Team.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}