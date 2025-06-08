
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Search,
  RefreshCw,
  DollarSign,
  FileText,
  Eye,
  Download,
  User,
  Calendar
} from 'lucide-react';

export const InsuranceVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('idle');

  const recentVerifications = [
    {
      id: 'INS001',
      patient: 'John Doe',
      mrn: '123456',
      payer: 'Anthem Blue Cross',
      status: 'verified',
      eligibility: 'Active',
      copay: '$25',
      deductible: '$1,500',
      timestamp: '14:32:15'
    },
    {
      id: 'INS002',
      patient: 'Jane Smith',
      mrn: '789012',
      payer: 'Kaiser Permanente',
      status: 'pending',
      eligibility: 'Checking',
      copay: 'N/A',
      deductible: 'N/A',
      timestamp: '14:30:22'
    },
    {
      id: 'INS003',
      patient: 'Mike Johnson',
      mrn: '345678',
      payer: 'Aetna',
      status: 'failed',
      eligibility: 'Inactive',
      copay: 'N/A',
      deductible: 'N/A',
      timestamp: '14:28:45'
    }
  ];

  const payerConnections = [
    {
      name: 'Anthem Blue Cross',
      status: 'connected',
      apiVersion: 'v2.1',
      lastTest: '2 mins ago',
      responseTime: '245ms',
      successRate: '99.2%'
    },
    {
      name: 'Kaiser Permanente',
      status: 'connected',
      apiVersion: 'v1.8',
      lastTest: '5 mins ago',
      responseTime: '312ms',
      successRate: '98.7%'
    },
    {
      name: 'Aetna',
      status: 'error',
      apiVersion: 'v2.0',
      lastTest: '1 hour ago',
      responseTime: 'Timeout',
      successRate: '85.3%'
    },
    {
      name: 'UnitedHealthcare',
      status: 'connected',
      apiVersion: 'v2.2',
      lastTest: '3 mins ago',
      responseTime: '198ms',
      successRate: '99.5%'
    }
  ];

  const authorizationRequests = [
    {
      id: 'AUTH001',
      patient: 'Sarah Wilson',
      procedure: 'MRI Brain',
      payer: 'Anthem',
      status: 'approved',
      authNumber: 'AUTH123456',
      validUntil: '2024-02-15',
      estimatedCost: '$1,200'
    },
    {
      id: 'AUTH002',
      patient: 'Robert Davis',
      procedure: 'Cardiac Catheterization',
      payer: 'Kaiser',
      status: 'pending',
      authNumber: 'Pending',
      validUntil: 'N/A',
      estimatedCost: '$3,500'
    },
    {
      id: 'AUTH003',
      patient: 'Lisa Brown',
      procedure: 'Physical Therapy',
      payer: 'Aetna',
      status: 'denied',
      authNumber: 'N/A',
      validUntil: 'N/A',
      estimatedCost: '$150/session'
    }
  ];

  const benefitSummaries = [
    {
      category: 'Inpatient Services',
      coverage: '80%',
      deductible: '$1,500',
      maxBenefit: '$50,000',
      status: 'active'
    },
    {
      category: 'Outpatient Services',
      coverage: '70%',
      deductible: '$500',
      maxBenefit: '$25,000',
      status: 'active'
    },
    {
      category: 'Emergency Services',
      coverage: '90%',
      deductible: '$250',
      maxBenefit: 'Unlimited',
      status: 'active'
    },
    {
      category: 'Prescription Drugs',
      coverage: '75%',
      deductible: '$100',
      maxBenefit: '$10,000',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Insurance Verification</h3>
          <p className="text-gray-600">Real-time insurance eligibility and benefit verification</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Verify Patient
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="payers">Payer Connections</TabsTrigger>
          <TabsTrigger value="authorization">Prior Auth</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">156</p>
                <p className="text-sm text-blue-700">Verifications Today</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">142</p>
                <p className="text-sm text-green-700">Successful</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-900">8</p>
                <p className="text-sm text-orange-700">Pending</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-900">6</p>
                <p className="text-sm text-red-700">Failed</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Verifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Verifications</CardTitle>
              <CardDescription>Latest insurance eligibility checks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVerifications.map((verification, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        verification.status === 'verified' ? 'bg-green-100' :
                        verification.status === 'pending' ? 'bg-orange-100' :
                        'bg-red-100'
                      }`}>
                        {verification.status === 'verified' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                         verification.status === 'pending' ? <Clock className="h-4 w-4 text-orange-600" /> :
                         <AlertTriangle className="h-4 w-4 text-red-600" />}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{verification.patient}</h5>
                        <p className="text-sm text-gray-600">MRN: {verification.mrn} • {verification.payer}</p>
                        <p className="text-xs text-gray-500">Copay: {verification.copay} • Deductible: {verification.deductible}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        verification.status === 'verified' ? 'border-green-500 text-green-700' :
                        verification.status === 'pending' ? 'border-orange-500 text-orange-700' :
                        'border-red-500 text-red-700'
                      }`}>
                        {verification.eligibility}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{verification.timestamp}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payer API Connections</CardTitle>
              <CardDescription>Status and performance of insurance payer integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payerConnections.map((payer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        payer.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900">{payer.name}</h5>
                        <p className="text-sm text-gray-600">API {payer.apiVersion} • Last test: {payer.lastTest}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">Response: {payer.responseTime}</span>
                          <span className="text-xs text-gray-500">Success: {payer.successRate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        payer.status === 'connected' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                      }`}>
                        {payer.status}
                      </Badge>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">Test</Button>
                        <Button variant="outline" size="sm">Config</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authorization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prior Authorization Requests</CardTitle>
              <CardDescription>Track and manage prior authorization requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authorizationRequests.map((auth, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{auth.patient}</h5>
                        <p className="text-sm text-gray-600">{auth.procedure}</p>
                      </div>
                      <Badge variant="outline" className={`${
                        auth.status === 'approved' ? 'border-green-500 text-green-700' :
                        auth.status === 'pending' ? 'border-orange-500 text-orange-700' :
                        'border-red-500 text-red-700'
                      }`}>
                        {auth.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Payer:</span>
                        <p className="font-medium">{auth.payer}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Auth Number:</span>
                        <p className="font-medium">{auth.authNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Valid Until:</span>
                        <p className="font-medium">{auth.validUntil}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Cost:</span>
                        <p className="font-medium">{auth.estimatedCost}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {auth.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Check Status
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benefit Summary</CardTitle>
              <CardDescription>Detailed coverage information and benefit limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefitSummaries.map((benefit, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{benefit.category}</h5>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        {benefit.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-blue-600 font-medium text-lg">{benefit.coverage}</p>
                        <p className="text-gray-600">Coverage</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <p className="text-orange-600 font-medium text-lg">{benefit.deductible}</p>
                        <p className="text-gray-600">Deductible</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-green-600 font-medium text-lg">{benefit.maxBenefit}</p>
                        <p className="text-gray-600">Max Benefit</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
