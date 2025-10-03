import React, { useState, useEffect } from "react";
import { PhonePeService, PhonePeUtils } from "@/services/phonepeService";
import { getEnvironmentSettings } from "@/config/phonepe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from "lucide-react";

interface TestResult {
  test: string;
  status: "pending" | "success" | "failed";
  message: string;
  details?: any;
}

const PhonePeIntegrationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [environmentInfo, setEnvironmentInfo] = useState<any>(null);

  useEffect(() => {
    const envSettings = getEnvironmentSettings();
    setEnvironmentInfo(envSettings);
  }, []);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setTestResults(prev => [...prev, {
      test: testName,
      status: "pending",
      message: "Running test...",
    }]);

    try {
      const result = await testFunction();
      setTestResults(prev => prev.map(t => 
        t.test === testName 
          ? { ...t, status: "success", message: "Test passed", details: result }
          : t
      ));
    } catch (error: any) {
      setTestResults(prev => prev.map(t => 
        t.test === testName 
          ? { ...t, status: "failed", message: error.message, details: error }
          : t
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Environment Configuration
    await runTest("Environment Configuration", async () => {
      const envSettings = getEnvironmentSettings();
      if (envSettings.validationErrors.length > 0) {
        throw new Error(`Configuration errors: ${envSettings.validationErrors.join(", ")}`);
      }
      return envSettings;
    });

    // Test 2: Payment Options
    await runTest("Payment Options", async () => {
      const options = await PhonePeService.getPaymentOptions();
      if (!options.success) {
        throw new Error("Failed to get payment options");
      }
      return options;
    });

    // Test 3: VPA Validation
    await runTest("VPA Validation", async () => {
      const result = await PhonePeService.validateVPA({ vpa: "test@upi" });
      if (!result.success) {
        throw new Error("VPA validation failed");
      }
      return result;
    });

    // Test 4: Payment Initiation (Test Mode)
    await runTest("Payment Initiation", async () => {
      // This is a mock test - in real scenario, you'd need a valid user and plan
      const mockRequest = {
        user_id: "test-user-id",
        plan_id: "test-plan-id",
        billing_cycle: "monthly" as const,
        amount: 100,
        currency: "INR",
        payment_method: "PAY_PAGE" as const,
      };

      try {
        const result = await PhonePeService.initiatePayment(mockRequest);
        return result;
      } catch (error: any) {
        // Expected to fail in test mode, but we can check if the error is expected
        if (error.message.includes("User not found") || error.message.includes("Plan not found")) {
          return { success: false, message: "Expected error in test mode", error: error.message };
        }
        throw error;
      }
    });

    // Test 5: Payment Status Check
    await runTest("Payment Status Check", async () => {
      try {
        const result = await PhonePeService.checkPaymentStatus({
          merchant_transaction_id: "test-txn-id",
        });
        return result;
      } catch (error: any) {
        // Expected to fail with invalid transaction ID
        if (error.message.includes("Payment record not found")) {
          return { success: false, message: "Expected error with test transaction ID", error: error.message };
        }
        throw error;
      }
    });

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>PhonePe Integration Test</span>
            {environmentInfo && (
              <Badge variant={environmentInfo.isProduction ? "destructive" : "secondary"}>
                {environmentInfo.isProduction ? "PRODUCTION" : "UAT"}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Test the PhonePe payment gateway integration to ensure everything is working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tests">Test Results</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Environment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {environmentInfo ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Environment:</span>
                          <Badge variant={environmentInfo.isProduction ? "destructive" : "secondary"}>
                            {environmentInfo.isProduction ? "Production" : "UAT"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Base URL:</span>
                          <span className="text-sm font-mono">{environmentInfo.config.baseUrl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Merchant ID:</span>
                          <span className="text-sm font-mono">{environmentInfo.config.merchantId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Test Credentials:</span>
                          <span className="text-sm">
                            {environmentInfo.testCredentials ? "Available" : "Not Available"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>Loading environment information...</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Test Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tests Run:</span>
                        <span>{testResults.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passed:</span>
                        <span className="text-green-600">
                          {testResults.filter(t => t.status === "success").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed:</span>
                        <span className="text-red-600">
                          {testResults.filter(t => t.status === "failed").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="text-blue-600">
                          {testResults.filter(t => t.status === "pending").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  className="flex-1"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tests" className="space-y-4">
              {testResults.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No tests have been run yet. Click "Run All Tests" to start testing.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(result.status)}
                            <span className="font-medium">{result.test}</span>
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{result.message}</p>
                          {result.details && (
                            <details className="mt-2">
                              <summary className="text-sm text-blue-600 cursor-pointer">
                                View Details
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              {environmentInfo ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuration Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(environmentInfo.config, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>

                  {environmentInfo.testCredentials && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Test Credentials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                          {JSON.stringify(environmentInfo.testCredentials, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}

                  {environmentInfo.validationErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div>
                          <p className="font-medium">Configuration Errors:</p>
                          <ul className="list-disc list-inside mt-2">
                            {environmentInfo.validationErrors.map((error: string, index: number) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div>Loading configuration...</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhonePeIntegrationTest;
