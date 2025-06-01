
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Scan, 
  User, 
  Shield, 
  Package, 
  AlertTriangle,
  CheckCircle,
  Camera,
  Clock
} from 'lucide-react';

interface DrugIssueRecord {
  id: string;
  barcode: string;
  medication: string;
  batch: string;
  expiry: string;
  patient: {
    name: string;
    id: string;
    ward: string;
  };
  issuedBy: string;
  timestamp: string;
  verified: boolean;
  safetyChecks: {
    rightPatient: boolean;
    rightDrug: boolean;
    rightDose: boolean;
    rightRoute: boolean;
    rightTime: boolean;
    allergyCheck: boolean;
    interactionCheck: boolean;
  };
}

export const DrugIssueSystem = () => {
  const [scanMode, setScanMode] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [currentIssue, setCurrentIssue] = useState<Partial<DrugIssueRecord> | null>(null);

  const recentIssues: DrugIssueRecord[] = [
    {
      id: 'DI001',
      barcode: '1234567890123',
      medication: 'Amoxicillin 500mg',
      batch: 'AMX2024001',
      expiry: '2025-12-31',
      patient: {
        name: 'John Doe',
        id: 'P12345',
        ward: 'ICU-A'
      },
      issuedBy: 'Pharmacist Sarah Wilson',
      timestamp: '2024-06-01 11:00',
      verified: true,
      safetyChecks: {
        rightPatient: true,
        rightDrug: true,
        rightDose: true,
        rightRoute: true,
        rightTime: true,
        allergyCheck: true,
        interactionCheck: true
      }
    },
    {
      id: 'DI002',
      barcode: '1234567890124',
      medication: 'Morphine 10mg',
      batch: 'MOR2024001',
      expiry: '2025-08-15',
      patient: {
        name: 'Jane Wilson',
        id: 'P12346',
        ward: 'Surgery Ward B'
      },
      issuedBy: 'Pharmacist Mike Chen',
      timestamp: '2024-06-01 10:45',
      verified: true,
      safetyChecks: {
        rightPatient: true,
        rightDrug: true,
        rightDose: true,
        rightRoute: true,
        rightTime: true,
        allergyCheck: true,
        interactionCheck: false
      }
    }
  ];

  const handleStartScan = () => {
    setScanMode(true);
    // Simulate barcode scan after 2 seconds
    setTimeout(() => {
      setScannedBarcode('1234567890125');
      setCurrentIssue({
        barcode: '1234567890125',
        medication: 'Paracetamol 500mg',
        batch: 'PAR2024001',
        expiry: '2025-10-31'
      });
      setScanMode(false);
    }, 2000);
  };

  const handleVerifyPatient = () => {
    if (currentIssue) {
      setCurrentIssue({
        ...currentIssue,
        patient: {
          name: 'Alice Johnson',
          id: 'P12348',
          ward: 'Medicine Ward A'
        }
      });
    }
  };

  const handleCompleteIssue = () => {
    console.log('Issue completed:', currentIssue);
    setCurrentIssue(null);
    setScannedBarcode('');
  };

  const SafetyCheckItem = ({ 
    label, 
    checked, 
    warning = false 
  }: { 
    label: string; 
    checked: boolean; 
    warning?: boolean; 
  }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      checked 
        ? warning 
          ? 'bg-orange-50 border-orange-200' 
          : 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}>
      <span className="text-sm font-medium">{label}</span>
      {checked ? (
        warning ? (
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        ) : (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )
      ) : (
        <AlertTriangle className="w-4 h-4 text-red-600" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Barcode Drug Issue System</h2>
          <p className="text-gray-600">Scan, verify, and issue medications safely</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Scan className="w-4 h-4" />
          <span>{recentIssues.length} issues today</span>
        </div>
      </div>

      {/* Scanning Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Drug Scanning & Issue
          </CardTitle>
          <CardDescription>
            Follow the safety protocol for medication dispensing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!scanMode && !currentIssue && (
            <div className="text-center py-12">
              <Button 
                onClick={handleStartScan}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Scan className="w-6 h-6 mr-3" />
                Start Scanning Process
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Click to begin medication barcode scanning
              </p>
            </div>
          )}

          {scanMode && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Scan className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scanning...</h3>
              <p className="text-gray-600">Position barcode in front of scanner</p>
            </div>
          )}

          {currentIssue && (
            <div className="space-y-6">
              {/* Step 1: Medication Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Step 1: Medication Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Barcode</label>
                      <p className="font-mono text-lg">{currentIssue.barcode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Medication</label>
                      <p className="font-semibold text-lg">{currentIssue.medication}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Batch</label>
                        <p className="font-medium">{currentIssue.batch}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Expiry</label>
                        <p className="font-medium">{currentIssue.expiry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Patient Verification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Step 2: Patient Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!currentIssue.patient ? (
                      <div className="text-center py-6">
                        <Button onClick={handleVerifyPatient} variant="outline">
                          <Camera className="w-4 h-4 mr-2" />
                          Scan Patient Wristband
                        </Button>
                        <p className="text-sm text-gray-600 mt-2">
                          Verify patient identity before dispensing
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Patient Name</label>
                          <p className="font-semibold text-lg">{currentIssue.patient.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Patient ID</label>
                            <p className="font-medium">{currentIssue.patient.id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Ward</label>
                            <p className="font-medium">{currentIssue.patient.ward}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Step 3: Safety Checks */}
              {currentIssue.patient && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Step 3: Five Rights Safety Check</CardTitle>
                    <CardDescription>
                      Verify all safety requirements before dispensing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <SafetyCheckItem label="Right Patient" checked={true} />
                      <SafetyCheckItem label="Right Drug" checked={true} />
                      <SafetyCheckItem label="Right Dose" checked={true} />
                      <SafetyCheckItem label="Right Route" checked={true} />
                      <SafetyCheckItem label="Right Time" checked={true} />
                      <SafetyCheckItem label="Allergy Check" checked={true} />
                      <SafetyCheckItem label="Drug Interaction" checked={false} warning={true} />
                    </div>

                    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-800">Drug Interaction Warning</h4>
                          <p className="text-sm text-orange-700 mt-1">
                            Potential interaction with current Warfarin therapy. Consider monitoring INR levels.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button onClick={handleCompleteIssue} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Issue
                      </Button>
                      <Button variant="outline" onClick={() => setCurrentIssue(null)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Dispensing Activity</CardTitle>
          <CardDescription>
            Latest medication issues with verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{issue.medication}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Patient: {issue.patient.name}</span>
                      <span>Ward: {issue.patient.ward}</span>
                      <span>By: {issue.issuedBy}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {issue.timestamp}
                  </div>
                  {issue.verified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
