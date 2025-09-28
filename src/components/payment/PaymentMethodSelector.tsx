import { paymentService } from "@/services/paymentService";
import { Building2, CreditCard, Smartphone, Wallet } from "lucide-react";
import React, { useState } from "react";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onDetailsChange: (details: any) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  onDetailsChange,
}) => {
  const [upiVpa, setUpiVpa] = useState("");
  const [targetApp, setTargetApp] = useState("phonepe");
  const [bankCode, setBankCode] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardType: "DEBIT_CARD",
    cardIssuer: "VISA",
    expiryMonth: 12,
    expiryYear: 2023,
    cvv: "",
  });

  const paymentMethods = paymentService.getAvailablePaymentMethods();
  const testDetails = paymentService.getTestPaymentDetails();

  const handleMethodChange = (method: string) => {
    onMethodChange(method);

    // Set default details based on method
    switch (method) {
      case "UPI_COLLECT":
        onDetailsChange({ vpa: upiVpa });
        break;
      case "UPI_INTENT":
        onDetailsChange({ targetApp });
        break;
      case "CARD":
        onDetailsChange({ cardDetails });
        break;
      case "NET_BANKING":
        onDetailsChange({ bankCode });
        break;
      default:
        onDetailsChange({});
    }
  };

  const handleUpiVpaChange = (vpa: string) => {
    setUpiVpa(vpa);
    onDetailsChange({ vpa });
  };

  const handleTargetAppChange = (app: string) => {
    setTargetApp(app);
    onDetailsChange({ targetApp: app });
  };

  const handleBankCodeChange = (code: string) => {
    setBankCode(code);
    onDetailsChange({ bankCode: code });
  };

  const handleCardDetailsChange = (field: string, value: any) => {
    const newCardDetails = { ...cardDetails, [field]: value };
    setCardDetails(newCardDetails);
    onDetailsChange({ cardDetails: newCardDetails });
  };

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case "PAY_PAGE":
        return <Wallet className="h-5 w-5" />;
      case "UPI_INTENT":
      case "UPI_COLLECT":
      case "UPI_QR":
        return <Smartphone className="h-5 w-5" />;
      case "CARD":
        return <CreditCard className="h-5 w-5" />;
      case "NET_BANKING":
        return <Building2 className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleMethodChange(method.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {getMethodIcon(method.id)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Specific Forms */}
      {selectedMethod === "UPI_COLLECT" && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            UPI Collect Details
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiVpa}
                onChange={(e) => handleUpiVpaChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-xs text-gray-500">
              <p>Test UPI ID: {testDetails.upi.vpa}</p>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "UPI_INTENT" && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">UPI Intent Details</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred UPI App
              </label>
              <select
                value={targetApp}
                onChange={(e) => handleTargetAppChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {testDetails.upi.targetApps.map((app: string) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "CARD" && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Card Details</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    handleCardDetailsChange("cardNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    handleCardDetailsChange("cvv", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  value={cardDetails.expiryMonth}
                  onChange={(e) =>
                    handleCardDetailsChange(
                      "expiryMonth",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={cardDetails.expiryYear}
                  onChange={(e) =>
                    handleCardDetailsChange(
                      "expiryYear",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Type
                </label>
                <select
                  value={cardDetails.cardType}
                  onChange={(e) =>
                    handleCardDetailsChange("cardType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>Test Card: {testDetails.card.cardNumber}</p>
              <p>CVV: {testDetails.card.cvv}</p>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "NET_BANKING" && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            Net Banking Details
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Bank
              </label>
              <select
                value={bankCode}
                onChange={(e) => handleBankCodeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a bank</option>
                <option value="SBIN">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="AXIS">Axis Bank</option>
                <option value="KOTAK">Kotak Mahindra Bank</option>
              </select>
            </div>
            <div className="text-xs text-gray-500">
              <p>
                Test Credentials: Username: {testDetails.netbanking.username},
                Password: {testDetails.netbanking.password}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "UPI_QR" && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">UPI QR Payment</h4>
          <p className="text-sm text-gray-600">
            A QR code will be generated for you to scan with your UPI app.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
