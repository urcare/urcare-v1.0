import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CreditCard, Smartphone, Building2, QrCode } from "lucide-react";
import UPIPopup from "@/components/payment/UPIPopup";
import CardModal from "@/components/payment/CardModal";
import QRCodeModal from "@/components/payment/QRCodeModal";
import PaymentSuccessModal from "@/components/payment/PaymentSuccessModal";

export default function PhonePeCheckoutSimple() {
  console.log("❌ PhonePeCheckoutSimple rendered - OLD COMPONENT WITH MULTIPLE BUTTONS");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Payment method modals
  const [showUPIPopup, setShowUPIPopup] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const handleUPIPayment = () => {
    setShowUPIPopup(true);
  };

  const handleCardPayment = () => {
    setShowCardModal(true);
  };

  const handleQRPayment = () => {
    setShowQRModal(true);
  };

  const handlePaymentSuccess = (method: string, details: any) => {
    setPaymentDetails({ method, details });
    setShowSuccessModal(true);
    // Close other modals
    setShowUPIPopup(false);
    setShowCardModal(false);
    setShowQRModal(false);
  };

  const handleUPISuccess = (upiId: string) => {
    handlePaymentSuccess("UPI", { upiId });
  };

  const handleCardSuccess = (cardDetails: any) => {
    handlePaymentSuccess("Card", cardDetails);
  };

  const handleQRSuccess = () => {
    handlePaymentSuccess("QR Code", {});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">PhonePe Payment</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold text-gray-900 capitalize">Basic (Annual)</span>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-gray-600 text-lg font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">₹4,999</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choose Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* UPI Payment */}
            <Button
              onClick={handleUPIPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg shadow-md flex items-center justify-center space-x-3"
            >
              <Smartphone className="w-5 h-5" />
              <span>Pay with UPI</span>
            </Button>

            {/* Card Payment */}
            <Button
              onClick={handleCardPayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-lg shadow-md flex items-center justify-center space-x-3"
            >
              <CreditCard className="w-5 h-5" />
              <span>Pay with Card</span>
            </Button>

            {/* QR Code Payment */}
            <Button
              onClick={handleQRPayment}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold rounded-lg shadow-md flex items-center justify-center space-x-3"
            >
              <QrCode className="w-5 h-5" />
              <span>Pay with QR Code</span>
            </Button>

            {/* Net Banking (Placeholder) */}
            <Button
              variant="outline"
              className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-3"
              disabled
            >
              <Building2 className="w-5 h-5" />
              <span>Net Banking (Coming Soon)</span>
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-white border rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">UPI</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-white border rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Cards</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-white border rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Net Banking</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-white border rounded-lg">
                <QrCode className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">QR Code</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Secure Payment</p>
                  <p className="text-xs text-green-700 mt-1">
                    Your payment is processed securely by PhonePe. We don't store your payment details.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PhonePe Branding */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <span className="text-sm">Powered by</span>
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-sm font-medium">PhonePe</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Payment Modals */}
      <UPIPopup
        isOpen={showUPIPopup}
        onClose={() => setShowUPIPopup(false)}
        onPaymentSuccess={handleUPISuccess}
        amount={4999}
      />

      <CardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onPaymentSuccess={handleCardSuccess}
        amount={4999}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onPaymentSuccess={handleQRSuccess}
        amount={4999}
      />

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={4999}
        paymentMethod={paymentDetails?.method || "Unknown"}
      />
    </div>
  );
}
