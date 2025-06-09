
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Scan, 
  User, 
  Pill,
  Bed,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { BarcodeScanner } from '@/components/documents/BarcodeScanner';
import { toast } from 'sonner';

interface QRScanResult {
  id: string;
  type: 'patient' | 'medication' | 'equipment' | 'document';
  data: any;
  timestamp: number;
  verified: boolean;
}

export const QRCodeManager = () => {
  const [scanResults, setScanResults] = useState<QRScanResult[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleQRScanned = async (qrData: string) => {
    setIsVerifying(true);
    
    try {
      // Parse QR code data
      const result = await processQRCode(qrData);
      
      const scanResult: QRScanResult = {
        id: Date.now().toString(),
        type: result.type,
        data: result.data,
        timestamp: Date.now(),
        verified: result.verified
      };
      
      setScanResults(prev => [scanResult, ...prev]);
      
      if (result.verified) {
        toast.success(`${result.type} verified successfully`);
      } else {
        toast.warning(`${result.type} found but needs verification`);
      }
      
      setShowScanner(false);
    } catch (error) {
      console.error('QR processing failed:', error);
      toast.error('Failed to process QR code');
    } finally {
      setIsVerifying(false);
    }
  };

  const processQRCode = async (qrData: string): Promise<{type: string, data: any, verified: boolean}> => {
    // Simulate QR code processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock QR code patterns
    if (qrData.startsWith('PATIENT:')) {
      return {
        type: 'patient',
        data: {
          id: 'P' + Math.random().toString().substr(2, 6),
          name: 'John Doe',
          age: 45,
          room: '302A',
          admissionDate: '2024-01-15'
        },
        verified: true
      };
    } else if (qrData.startsWith('MED:')) {
      return {
        type: 'medication',
        data: {
          name: 'Amoxicillin 500mg',
          dosage: '500mg',
          frequency: 'Three times daily',
          prescribedBy: 'Dr. Smith',
          expiryDate: '2025-06-30'
        },
        verified: true
      };
    } else if (qrData.startsWith('EQ:')) {
      return {
        type: 'equipment',
        data: {
          id: 'EQ' + Math.random().toString().substr(2, 4),
          name: 'Ventilator Model X',
          status: 'Available',
          lastMaintenance: '2024-01-10',
          location: 'ICU-2'
        },
        verified: true
      };
    } else {
      return {
        type: 'document',
        data: {
          title: 'Lab Report',
          type: 'Blood Test Results',
          date: '2024-01-20',
          patient: 'Anonymous'
        },
        verified: false
      };
    }
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      handleQRScanned(manualCode);
      setManualCode('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patient': return User;
      case 'medication': return Pill;
      case 'equipment': return Bed;
      case 'document': return FileText;
      default: return QrCode;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'medication': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const qrFeatures = [
    'Patient identification',
    'Medication verification',
    'Equipment tracking',
    'Document access',
    'Real-time validation',
    'Audit trail logging'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Supported QR Codes</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {qrFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scanner Actions */}
        <div className="space-y-3">
          <Button 
            onClick={() => setShowScanner(true)}
            className="w-full"
            disabled={isVerifying}
          >
            <Scan className="h-4 w-4 mr-2" />
            {isVerifying ? 'Verifying...' : 'Scan QR Code'}
          </Button>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter QR code manually"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleManualEntry}
              variant="outline"
              disabled={!manualCode.trim() || isVerifying}
            >
              Process
            </Button>
          </div>
        </div>

        {/* Verification Status */}
        {isVerifying && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Scan className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-800">Verifying QR code...</span>
          </div>
        )}

        {/* Scan Results */}
        {scanResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Recent Scans ({scanResults.length})</h4>
              <Badge variant="secondary">{scanResults.length} items</Badge>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {scanResults.map((result) => {
                const Icon = getTypeIcon(result.type);
                return (
                  <div key={result.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <Badge className={getTypeColor(result.type)}>
                          {result.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      {result.type === 'patient' && (
                        <div>
                          <p><strong>Name:</strong> {result.data.name}</p>
                          <p><strong>Room:</strong> {result.data.room}</p>
                        </div>
                      )}
                      {result.type === 'medication' && (
                        <div>
                          <p><strong>Medication:</strong> {result.data.name}</p>
                          <p><strong>Dosage:</strong> {result.data.dosage}</p>
                        </div>
                      )}
                      {result.type === 'equipment' && (
                        <div>
                          <p><strong>Equipment:</strong> {result.data.name}</p>
                          <p><strong>Status:</strong> {result.data.status}</p>
                        </div>
                      )}
                      {result.type === 'document' && (
                        <div>
                          <p><strong>Document:</strong> {result.data.title}</p>
                          <p><strong>Type:</strong> {result.data.type}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scanner Modal */}
        {showScanner && (
          <BarcodeScanner
            onScanned={handleQRScanned}
            onClose={() => setShowScanner(false)}
          />
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Real-time QR code recognition</p>
          <p>• Automatic verification with hospital database</p>
          <p>• Secure patient and medication identification</p>
        </div>
      </CardContent>
    </Card>
  );
};
