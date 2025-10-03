import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, CreditCard, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const PhonePeTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    signature: 'pending' | 'success' | 'error';
    apiCall: 'pending' | 'success' | 'error';
    overall: 'pending' | 'success' | 'error';
  }>({
    signature: 'pending',
    apiCall: 'pending',
    overall: 'pending'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testPhonePeIntegration = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults({
      signature: 'pending',
      apiCall: 'pending',
      overall: 'pending'
    });

    try {
      // Test 1: Signature Generation
      console.log('🧪 Testing PhonePe signature generation...');
      
      // Test signature generation
      const testPayload = JSON.stringify({
        merchantId: 'M23XRS3XN3QMF',
        merchantTransactionId: 'test_' + Date.now(),
        amount: 100
      });
      
      const encoder = new TextEncoder();
      const data = encoder.encode(testPayload + '713219fb-38d0-468d-8268-8b15955468b0');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const signature = hashHex + '###1';
      
      console.log('✅ Signature generated:', signature.substring(0, 20) + '...');
      setTestResults(prev => ({ ...prev, signature: 'success' }));

      // Test 2: API Call
      console.log('🧪 Testing PhonePe API call...');
      
      const response = await fetch('/api/paycheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountPaise: 100,
          userId: 'test_user'
        })
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        console.log('✅ API call successful:', responseData);
        setTestResults(prev => ({ ...prev, apiCall: 'success' }));
        toast.success('PhonePe integration test successful!');
      } else {
        console.error('❌ API call failed:', responseData);
        setTestResults(prev => ({ ...prev, apiCall: 'error' }));
        setError(responseData.error || 'API call failed');
      }

      // Overall result
      const allSuccess = testResults.signature === 'success' && testResults.apiCall === 'success';
      setTestResults(prev => ({ 
        ...prev, 
        overall: allSuccess ? 'success' : 'error' 
      }));

    } catch (error) {
      console.error('❌ PhonePe test failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setTestResults(prev => ({ 
        ...prev, 
        signature: 'error',
        apiCall: 'error',
        overall: 'error'
      }));
      toast.error('PhonePe integration test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PhonePe Integration Test
          </h1>
          <p className="text-gray-600">
            Test the PhonePe payment integration functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Test Controls
              </CardTitle>
              <CardDescription>
                Run tests to verify PhonePe integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testPhonePeIntegration}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run PhonePe Tests'
                )}
              </Button>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Current status of PhonePe integration tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Signature Test */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults.signature)}
                  <div>
                    <h3 className="font-medium">Signature Generation</h3>
                    <p className="text-sm text-gray-600">
                      Test SHA-256 signature creation
                    </p>
                  </div>
                </div>
                {getStatusBadge(testResults.signature)}
              </div>

              {/* API Call Test */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults.apiCall)}
                  <div>
                    <h3 className="font-medium">API Call</h3>
                    <p className="text-sm text-gray-600">
                      Test /api/paycheck endpoint
                    </p>
                  </div>
                </div>
                {getStatusBadge(testResults.apiCall)}
              </div>

              {/* Overall Status */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults.overall)}
                  <div>
                    <h3 className="font-medium">Overall Status</h3>
                    <p className="text-sm text-gray-600">
                      PhonePe integration status
                    </p>
                  </div>
                </div>
                {getStatusBadge(testResults.overall)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Current PhonePe configuration settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Merchant ID:</strong> M23XRS3XN3QMF
              </div>
              <div>
                <strong>Environment:</strong> Production
              </div>
              <div>
                <strong>Amount:</strong> ₹1 (100 paise)
              </div>
              <div>
                <strong>Business:</strong> UrCare org
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
            <CardDescription>
              How to test the PhonePe integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Click "Run PhonePe Tests" to test signature generation and API calls</p>
            <p>2. Check the test results above for any errors</p>
            <p>3. Visit <code className="bg-gray-100 px-1 rounded">/pay</code> to test the full payment flow</p>
            <p>4. Check browser console for detailed logs</p>
            <p>5. Verify environment variables are set correctly in Vercel</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhonePeTestPage;
