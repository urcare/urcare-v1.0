import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PhonePeService, PhonePeUtils } from "@/services/phonepeService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Copy,
  ExternalLink,
  TestTube
} from "lucide-react";

/**
 * PhonePe Official Test Component
 * 
 * This component provides comprehensive testing capabilities using the official
 * PhonePe test credentials and documentation.
 */
const PhonePeOfficialTest: React.FC = () => {
  const { profile } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  // Get official test credentials
  const testCredentials = PhonePeUtils.getTestCredentials();
  const testCard = PhonePeUtils.getTestCardDetails();
  const testUPI = PhonePeUtils.getTestUPIDetails();
  const testNetBanking = PhonePeUtils.getTestNetBankingDetails();
  const testBanks = PhonePeUtils.getTestBanks();
  const testOTP = PhonePeUtils.getTestOTP();
  const testScenarios = PhonePeUtils.getTestScenarios();

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setIsLoading(true);
    setActiveTest(testName);
    
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'success',
          result,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setIsLoading(false);
      setActiveTest(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testVPAValidation = async () => {
    return await PhonePeService.validateVPA({ vpa: testUPI.vpa });
  };

  const testPaymentOptions = async () => {
    return await PhonePeService.getPaymentOptions({ amount: 100, currency: "INR" });
  };

  const testPaymentInitiation = async () => {
    if (!profile?.id) throw new Error("User not authenticated");
    
    return await PhonePeService.initiatePayment({
      user_id: profile.id,
      plan_id: "test-plan",
      billing_cycle: "monthly",
      amount: 100,
      currency: "INR",
      payment_method: "PAY_PAGE",
      redirect_url: `${window.location.origin}/payment/success`,
      callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
      user_email: profile.email,
      user_phone: profile.phone,
    });
  };

  const testCardPayment = async () => {
    if (!profile?.id) throw new Error("User not authenticated");
    
    return await PhonePeService.initiatePayment({
      user_id: profile.id,
      plan_id: "test-plan",
      billing_cycle: "monthly",
      amount: 100,
      currency: "INR",
      payment_method: "CARD",
      redirect_url: `${window.location.origin}/payment/success`,
      callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
      user_email: profile.email,
      user_phone: profile.phone,
      card_details: {
        cardNumber: testCard.number,
        cardType: testCard.type,
        cardIssuer: testCard.issuer,
        expiryMonth: testCard.expiryMonth,
        expiryYear: testCard.expiryYear,
        cvv: testCard.cvv,
      },
    });
  };

  const testUPIPayment = async () => {
    if (!profile?.id) throw new Error("User not authenticated");
    
    return await PhonePeService.initiatePayment({
      user_id: profile.id,
      plan_id: "test-plan",
      billing_cycle: "monthly",
      amount: 100,
      currency: "INR",
      payment_method: "UPI_COLLECT",
      redirect_url: `${window.location.origin}/payment/success`,
      callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
      user_email: profile.email,
      user_phone: profile.phone,
      upi_vpa: testUPI.vpa,
    });
  };

  const testNetBankingPayment = async () => {
    if (!profile?.id) throw new Error("User not authenticated");
    
    return await PhonePeService.initiatePayment({
      user_id: profile.id,
      plan_id: "test-plan",
      billing_cycle: "monthly",
      amount: 100,
      currency: "INR",
      payment_method: "NET_BANKING",
      redirect_url: `${window.location.origin}/payment/success`,
      callback_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
      user_email: profile.email,
      user_phone: profile.phone,
      bank_code: testNetBanking.bankCode,
    });
  };

  const getTestStatusIcon = (testName: string) => {
    const result = testResults[testName];
    if (!result) return null;
    
    if (result.status === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (result.status === 'error') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return null;
  };

  const getTestStatusColor = (testName: string) => {
    const result = testResults[testName];
    if (!result) return "text-gray-500";
    
    if (result.status === 'success') return "text-green-600";
    if (result.status === 'error') return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PhonePe Official Test Suite
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Test PhonePe integration using official test credentials and documentation
        </p>
        
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Badge variant="secondary">
            <TestTube className="w-4 h-4 mr-2" />
            Official Test Credentials
          </Badge>
          <Badge variant="outline">
            MID: {testCredentials.merchant.mid}
          </Badge>
          <Badge variant="outline">
            Key Index: {testCredentials.merchant.keyIndex}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="credentials">Test Credentials</TabsTrigger>
          <TabsTrigger value="api-tests">API Tests</TabsTrigger>
          <TabsTrigger value="payment-tests">Payment Tests</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Card Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Test Card Details
                </CardTitle>
                <CardDescription>
                  Official test card from PhonePe documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Card Number:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {testCard.number}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(testCard.number)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">CVV:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {testCard.cvv}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(testCard.cvv)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Expiry:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {testCard.expiryMonth}/{testCard.expiryYear}
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Type:</span>
                  <Badge variant="outline">{testCard.type}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Issuer:</span>
                  <Badge variant="outline">{testCard.issuer}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Test UPI Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Test UPI Details
                </CardTitle>
                <CardDescription>
                  Official test UPI credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">VPA:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {testUPI.vpa}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(testUPI.vpa)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-medium">Target Apps:</span>
                  <div className="flex flex-wrap gap-2">
                    {testUPI.targetApps.map((app) => (
                      <Badge key={app} variant="outline">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Net Banking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Test Net Banking Details
                </CardTitle>
                <CardDescription>
                  Official test net banking credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Username:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {testNetBanking.username}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(testNetBanking.username)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Password:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {testNetBanking.password}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(testNetBanking.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Bank Code:</span>
                  <Badge variant="outline">{testNetBanking.bankCode}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">OTP:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {testOTP}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Available Test Banks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Available Test Banks
                </CardTitle>
                <CardDescription>
                  Banks available for net banking testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {testBanks.map((bank) => (
                    <div key={bank.code} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm font-medium">{bank.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {bank.code}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-tests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VPA Validation Test</CardTitle>
                <CardDescription>
                  Test VPA validation API with official test VPA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runTest('vpa-validation', testVPAValidation)}
                  disabled={isLoading && activeTest === 'vpa-validation'}
                  className="w-full"
                >
                  {isLoading && activeTest === 'vpa-validation' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test VPA Validation
                </Button>
                <div className="mt-3 flex items-center space-x-2">
                  {getTestStatusIcon('vpa-validation')}
                  <span className={getTestStatusColor('vpa-validation')}>
                    {testResults['vpa-validation']?.status || 'Not tested'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Options Test</CardTitle>
                <CardDescription>
                  Test payment options API to get available payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runTest('payment-options', testPaymentOptions)}
                  disabled={isLoading && activeTest === 'payment-options'}
                  className="w-full"
                >
                  {isLoading && activeTest === 'payment-options' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test Payment Options
                </Button>
                <div className="mt-3 flex items-center space-x-2">
                  {getTestStatusIcon('payment-options')}
                  <span className={getTestStatusColor('payment-options')}>
                    {testResults['payment-options']?.status || 'Not tested'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment-tests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Payment Test</CardTitle>
                <CardDescription>
                  Test standard payment initiation with PAY_PAGE method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runTest('standard-payment', testPaymentInitiation)}
                  disabled={isLoading && activeTest === 'standard-payment'}
                  className="w-full"
                >
                  {isLoading && activeTest === 'standard-payment' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test Standard Payment
                </Button>
                <div className="mt-3 flex items-center space-x-2">
                  {getTestStatusIcon('standard-payment')}
                  <span className={getTestStatusColor('standard-payment')}>
                    {testResults['standard-payment']?.status || 'Not tested'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Payment Test</CardTitle>
                <CardDescription>
                  Test card payment with official test card details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runTest('card-payment', testCardPayment)}
                  disabled={isLoading && activeTest === 'card-payment'}
                  className="w-full"
                >
                  {isLoading && activeTest === 'card-payment' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test Card Payment
                </Button>
                <div className="mt-3 flex items-center space-x-2">
                  {getTestStatusIcon('card-payment')}
                  <span className={getTestStatusColor('card-payment')}>
                    {testResults['card-payment']?.status || 'Not tested'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UPI Payment Test</CardTitle>
                <CardDescription>
                  Test UPI payment with official test UPI details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runTest('upi-payment', testUPIPayment)}
                  disabled={isLoading && activeTest === 'upi-payment'}
                  className="w-full"
                >
                  {isLoading && activeTest === 'upi-payment' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test UPI Payment
                </Button>
                <div className="mt-3 flex items-center space-x-2">
                  {getTestStatusIcon('upi-payment')}
                  <span className={getTestStatusColor('upi-payment')}>
                    {testResults['upi-payment']?.status || 'Not tested'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Banking Payment Test</CardTitle>
                <CardDescription>
                  Test net banking payment with official test credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => runTest('netbanking-payment', testNetBankingPayment)}
                  disabled={isLoading && activeTest === 'netbanking-payment'}
                  className="w-full"
                >
                  {isLoading && activeTest === 'netbanking-payment' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test Net Banking Payment
                </Button>
                <div className="mt-3 flex items-center space-x-2">
                  {getTestStatusIcon('netbanking-payment')}
                  <span className={getTestStatusColor('netbanking-payment')}>
                    {testResults['netbanking-payment']?.status || 'Not tested'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="space-y-4">
            {Object.keys(testResults).length === 0 ? (
              <Alert>
                <AlertDescription>
                  No tests have been run yet. Go to the API Tests or Payment Tests tabs to run tests.
                </AlertDescription>
              </Alert>
            ) : (
              Object.entries(testResults).map(([testName, result]) => (
                <Card key={testName}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{testName.replace('-', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        {getTestStatusIcon(testName)}
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Tested at: {new Date(result.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.status === 'success' ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600">Test Passed</h4>
                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {JSON.stringify(result.result, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600">Test Failed</h4>
                        <p className="text-red-600">{result.error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Official Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Official PhonePe Documentation</CardTitle>
          <CardDescription>
            Links to official PhonePe documentation and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">UAT Simulator</h4>
                <p className="text-sm text-gray-600">Test your integration</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(testCredentials.simulator.baseUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">Test Account Setup</h4>
                <p className="text-sm text-gray-600">Set up test account</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(testCredentials.simulator.testApp, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhonePeOfficialTest;
