import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Smartphone, Building2, QrCode } from "lucide-react";

export default function PhonePeTest() {
  const navigate = useNavigate();
  const [testAmount, setTestAmount] = useState(4999);

  const handleTestPhonePe = () => {
    navigate("/phonecheckout", {
      state: {
        planSlug: "basic",
        billingCycle: "annual",
        amount: testAmount
      }
    });
  };

  const handleDirectTest = () => {
    navigate("/test-phonepe");
  };

  const handleSimpleTest = () => {
    navigate("/phonepe-simple");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">PhonePe Integration Test</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Amount (₹)
              </label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter test amount"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={handleTestPhonePe} className="w-full bg-purple-600 hover:bg-purple-700">
                Test with State Data
              </Button>
              <Button onClick={handleDirectTest} variant="outline" className="w-full">
                Test Direct Route
              </Button>
              <Button onClick={handleSimpleTest} variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                Simple Test (No Auth)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Available Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Test Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Test Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">/phonecheckout</code>
                  <p className="text-xs text-gray-600">Main PhonePe checkout page</p>
                </div>
                <Button size="sm" onClick={() => navigate("/phonecheckout")}>
                  Test
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">/test-phonepe</code>
                  <p className="text-xs text-gray-600">Direct test route with defaults</p>
                </div>
                <Button size="sm" onClick={() => navigate("/test-phonepe")}>
                  Test
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">/phonecheckout/result</code>
                  <p className="text-xs text-gray-600">Payment result page</p>
                </div>
                <Button size="sm" onClick={() => navigate("/phonecheckout/result?transactionId=test123&plan=basic&cycle=annual")}>
                  Test
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <code className="text-sm font-mono">/phonepe-simple</code>
                  <p className="text-xs text-gray-600">Simple checkout (no auth required)</p>
                </div>
                <Button size="sm" onClick={() => navigate("/phonepe-simple")}>
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current URL:</span>
                <code className="text-purple-600">{window.location.href}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Test Amount:</span>
                <span className="font-mono">₹{testAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Environment:</span>
                <span className="text-green-600">Development</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
