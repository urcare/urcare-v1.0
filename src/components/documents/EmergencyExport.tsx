
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, Download, Share2, Smartphone, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyDocument {
  id: string;
  name: string;
  category: string;
  priority: 'critical' | 'high' | 'medium';
  lastUpdated: Date;
  size: string;
}

const emergencyDocuments: EmergencyDocument[] = [
  {
    id: '1',
    name: 'Emergency Contact Information',
    category: 'Emergency Info',
    priority: 'critical',
    lastUpdated: new Date('2024-01-20'),
    size: '45 KB'
  },
  {
    id: '2',
    name: 'Current Medications List',
    category: 'Medications',
    priority: 'critical',
    lastUpdated: new Date('2024-01-15'),
    size: '67 KB'
  },
  {
    id: '3',
    name: 'Allergy Information & Reactions',
    category: 'Allergies',
    priority: 'critical',
    lastUpdated: new Date('2024-01-10'),
    size: '23 KB'
  },
  {
    id: '4',
    name: 'Recent ECG Results',
    category: 'Cardiac',
    priority: 'high',
    lastUpdated: new Date('2024-01-08'),
    size: '234 KB'
  },
  {
    id: '5',
    name: 'Blood Type & Lab Results',
    category: 'Lab Results',
    priority: 'high',
    lastUpdated: new Date('2024-01-05'),
    size: '156 KB'
  },
  {
    id: '6',
    name: 'Insurance Information',
    category: 'Insurance',
    priority: 'medium',
    lastUpdated: new Date('2024-01-01'),
    size: '89 KB'
  }
];

export const EmergencyExport = () => {
  const { toast } = useToast();
  const [selectedDocs, setSelectedDocs] = useState<string[]>(
    emergencyDocuments.filter(doc => doc.priority === 'critical').map(doc => doc.id)
  );
  const [exportFormat, setExportFormat] = useState<'pdf' | 'digital'>('digital');
  const [qrCode, setQrCode] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(false);

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAllCritical = () => {
    const criticalDocs = emergencyDocuments.filter(doc => doc.priority === 'critical').map(doc => doc.id);
    setSelectedDocs(criticalDocs);
  };

  const handleSelectAll = () => {
    setSelectedDocs(emergencyDocuments.map(doc => doc.id));
  };

  const generateEmergencyPackage = () => {
    const selectedDocuments = emergencyDocuments.filter(doc => selectedDocs.includes(doc.id));
    
    // Generate a unique emergency access code
    const emergencyCode = `EMR-${Date.now().toString(36).toUpperCase()}`;
    
    // Create emergency data package
    const emergencyData = {
      code: emergencyCode,
      patientId: 'PATIENT-123', // This would come from user context
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      documents: selectedDocuments.map(doc => ({
        name: doc.name,
        category: doc.category,
        priority: doc.priority
      })),
      emergencyContacts: [
        { name: 'Dr. Sarah Johnson', phone: '+1-555-0123', relationship: 'Primary Care' },
        { name: 'John Doe', phone: '+1-555-0456', relationship: 'Emergency Contact' }
      ],
      criticalInfo: {
        bloodType: 'O+',
        allergies: ['Penicillin', 'Shellfish'],
        conditions: ['Type 2 Diabetes', 'Hypertension'],
        medications: ['Metformin 1000mg', 'Lisinopril 10mg']
      }
    };

    // Generate QR code URL (in real app, this would be a secure server endpoint)
    const qrCodeData = `https://emergency.urcare.com/access/${emergencyCode}`;
    setQrCode(qrCodeData);
    setShowQRCode(true);

    toast({
      title: "Emergency Package Generated",
      description: `Created emergency access package with code: ${emergencyCode}`
    });
  };

  const handleDownloadPDF = () => {
    console.log('Downloading emergency records as PDF...');
    toast({
      title: "Download Started",
      description: "Emergency records PDF is being prepared for download."
    });
  };

  const handleShareDigital = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Medical Records',
        text: 'Access my emergency medical records',
        url: qrCode
      });
    } else {
      navigator.clipboard.writeText(qrCode);
      toast({
        title: "Link Copied",
        description: "Emergency access link copied to clipboard."
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            Emergency Record Export
          </CardTitle>
          <CardDescription className="text-red-700">
            Create a secure, quick-access package of your critical medical information for emergency situations
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Documents</CardTitle>
            <CardDescription>
              Choose which documents to include in your emergency package
            </CardDescription>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSelectAllCritical}>
                Select Critical Only
              </Button>
              <Button size="sm" variant="outline" onClick={handleSelectAll}>
                Select All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selectedDocs.includes(doc.id)}
                  onCheckedChange={() => handleDocumentToggle(doc.id)}
                />
                <FileText className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{doc.name}</p>
                    <Badge className={getPriorityColor(doc.priority)}>
                      {doc.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{doc.category}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Updated {doc.lastUpdated.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>
              Choose how you want to package your emergency records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="digital"
                  name="exportFormat"
                  value="digital"
                  checked={exportFormat === 'digital'}
                  onChange={(e) => setExportFormat(e.target.value as 'digital')}
                />
                <label htmlFor="digital" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Digital QR Code</p>
                    <p className="text-xs text-gray-500">Instant access via smartphone scan</p>
                  </div>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="pdf"
                  name="exportFormat"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value as 'pdf')}
                />
                <label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <div>
                    <p className="font-medium">PDF Document</p>
                    <p className="text-xs text-gray-500">Printable emergency record packet</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Selected: {selectedDocs.length} documents</p>
              <div className="flex gap-2">
                <Button
                  onClick={exportFormat === 'digital' ? generateEmergencyPackage : handleDownloadPDF}
                  className="flex items-center gap-2"
                  disabled={selectedDocs.length === 0}
                >
                  {exportFormat === 'digital' ? (
                    <>
                      <Smartphone className="h-4 w-4" />
                      Generate QR Code
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Display */}
      {showQRCode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Smartphone className="h-5 w-5" />
              Emergency Access QR Code
            </CardTitle>
            <CardDescription className="text-blue-700">
              Scan this code to access emergency medical records. Valid for 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG value={qrCode} size={200} />
            </div>
            
            <div className="text-center space-y-2">
              <p className="font-mono text-sm bg-white px-3 py-1 rounded border">
                {qrCode.split('/').pop()}
              </p>
              <p className="text-xs text-gray-600">
                Emergency access code (expires in 7 days)
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShareDigital}>
                <Share2 className="h-4 w-4 mr-1" />
                Share Code
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-1" />
                Download Backup PDF
              </Button>
            </div>

            <div className="text-xs text-gray-600 text-center max-w-md">
              <p className="font-medium mb-1">⚠️ Security Notice:</p>
              <p>This QR code provides temporary access to your emergency medical information. Only share with authorized medical personnel or emergency responders.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
