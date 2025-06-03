
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  FileText,
  Camera,
  AlertCircle,
  User,
  Shield,
  Building,
  Calendar
} from 'lucide-react';

interface VerificationResult {
  policyNumber: string;
  memberName: string;
  memberID: string;
  status: 'active' | 'inactive' | 'suspended';
  coverageAmount: number;
  deductible: number;
  networkTier: string;
  effectiveDate: string;
  expiryDate: string;
  copayPercentage: number;
  preAuthRequired: boolean;
}

interface EligibilityCheck {
  serviceType: string;
  covered: boolean;
  coverageLimit: number;
  copayAmount: number;
  preAuthRequired: boolean;
  priorAuthStatus?: string;
}

export const InsuranceVerificationSystem = () => {
  const [policyNumber, setPolicyNumber] = useState('SH-2024-001234');
  const [memberID, setMemberID] = useState('M001234567');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [scanMode, setScanMode] = useState(false);

  const verificationResult: VerificationResult = {
    policyNumber: 'SH-2024-001234',
    memberName: 'John Doe',
    memberID: 'M001234567',
    status: 'active',
    coverageAmount: 500000,
    deductible: 25000,
    networkTier: 'Tier 1',
    effectiveDate: '2024-01-01',
    expiryDate: '2024-12-31',
    copayPercentage: 20,
    preAuthRequired: true
  };

  const eligibilityChecks: EligibilityCheck[] = [
    {
      serviceType: 'OPD Consultation',
      covered: true,
      coverageLimit: 25000,
      copayAmount: 500,
      preAuthRequired: false
    },
    {
      serviceType: 'IPD Admission',
      covered: true,
      coverageLimit: 400000,
      copayAmount: 0,
      preAuthRequired: true,
      priorAuthStatus: 'required'
    },
    {
      serviceType: 'Emergency Services',
      covered: true,
      coverageLimit: 50000,
      copayAmount: 1000,
      preAuthRequired: false
    },
    {
      serviceType: 'Diagnostic Tests',
      covered: true,
      coverageLimit: 15000,
      copayAmount: 200,
      preAuthRequired: false
    },
    {
      serviceType: 'Maternity Benefits',
      covered: true,
      coverageLimit: 75000,
      copayAmount: 0,
      preAuthRequired: true,
      priorAuthStatus: 'approved'
    }
  ];

  const verificationHistory = [
    {
      date: '2024-06-05 14:30',
      service: 'Cardiology OPD',
      status: 'verified',
      copay: 500,
      preAuth: 'not_required'
    },
    {
      date: '2024-06-03 10:15',
      service: 'Lab Tests',
      status: 'verified',
      copay: 200,
      preAuth: 'not_required'
    },
    {
      date: '2024-05-28 16:45',
      service: 'Emergency Visit',
      status: 'verified',
      copay: 1000,
      preAuth: 'not_required'
    }
  ];

  const networkProviders = [
    { name: 'Apollo Hospitals', tier: 'Tier 1', discount: '100%', distance: '2.5 km' },
    { name: 'Fortis Healthcare', tier: 'Tier 1', discount: '100%', distance: '3.2 km' },
    { name: 'Max Healthcare', tier: 'Tier 2', discount: '80%', distance: '4.1 km' },
    { name: 'Manipal Hospital', tier: 'Tier 1', discount: '100%', distance: '5.8 km' }
  ];

  const handleVerification = () => {
    setVerificationStatus('loading');
    setTimeout(() => {
      setVerificationStatus('success');
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { label: 'Inactive', className: 'bg-red-100 text-red-800', icon: XCircle },
      suspended: { label: 'Suspended', className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getCoverageIcon = (covered: boolean) => {
    return covered ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insurance Verification System</h2>
          <p className="text-gray-600">Real-time eligibility checking and benefits verification</p>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => setScanMode(!scanMode)}
        >
          <Camera className="w-4 h-4 mr-2" />
          {scanMode ? 'Manual Entry' : 'Scan Card'}
        </Button>
      </div>

      {/* Verification Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Insurance Verification
          </CardTitle>
          <CardDescription>Enter policy details or scan insurance card</CardDescription>
        </CardHeader>
        <CardContent>
          {scanMode ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Position insurance card within the frame</p>
              <div className="w-64 h-40 border-2 border-blue-500 rounded-lg mx-auto mb-4 bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600">Camera Preview</span>
              </div>
              <Button>
                Capture Card
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policy">Policy Number</Label>
                <Input
                  id="policy"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="member">Member ID</Label>
                <Input
                  id="member"
                  value={memberID}
                  onChange={(e) => setMemberID(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Button 
                  onClick={handleVerification}
                  disabled={verificationStatus === 'loading'}
                  className="w-full"
                >
                  {verificationStatus === 'loading' ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Insurance
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {verificationStatus === 'success' && (
        <>
          {/* Verification Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Policy Status:</span>
                    {getStatusBadge(verificationResult.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Member Name:</span>
                    <span>{verificationResult.memberName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Member ID:</span>
                    <span>{verificationResult.memberID}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Network Tier:</span>
                    <Badge variant="outline">{verificationResult.networkTier}</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Coverage Amount:</span>
                    <span className="font-semibold">₹{verificationResult.coverageAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Deductible:</span>
                    <span>₹{verificationResult.deductible.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Copay:</span>
                    <span>{verificationResult.copayPercentage}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Policy Expiry:</span>
                    <span>{verificationResult.expiryDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Benefits Eligibility
              </CardTitle>
              <CardDescription>Coverage details by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eligibilityChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getCoverageIcon(check.covered)}
                      <div>
                        <h4 className="font-medium">{check.serviceType}</h4>
                        <p className="text-sm text-gray-600">
                          Coverage: ₹{check.coverageLimit.toLocaleString()} • Copay: ₹{check.copayAmount}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {check.preAuthRequired && (
                        <Badge 
                          className={
                            check.priorAuthStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            check.priorAuthStatus === 'required' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }
                        >
                          {check.priorAuthStatus === 'approved' ? 'Pre-Auth Approved' :
                           check.priorAuthStatus === 'required' ? 'Pre-Auth Required' :
                           'Pre-Auth Needed'}
                        </Badge>
                      )}
                      
                      <Badge className={check.covered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {check.covered ? 'Covered' : 'Not Covered'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Providers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Network Providers
              </CardTitle>
              <CardDescription>Available hospitals and coverage tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {networkProviders.map((provider, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{provider.name}</h4>
                      <Badge 
                        className={
                          provider.tier === 'Tier 1' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {provider.tier}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Coverage: {provider.discount}</span>
                      <span>Distance: {provider.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Verification History
              </CardTitle>
              <CardDescription>Recent verification activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {verificationHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{entry.service}</h4>
                      <p className="text-sm text-gray-600">{entry.date}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Copay: ₹{entry.copay}</span>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
