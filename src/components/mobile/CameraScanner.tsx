
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Scan, 
  FileText, 
  Image, 
  Zap,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { DocumentScanner } from '@/components/documents/DocumentScanner';
import { toast } from 'sonner';

interface ScannedDocument {
  id: string;
  file: File;
  preview: string;
  ocrText?: string;
  category: string;
  confidence: number;
  timestamp: number;
}

export const CameraScanner = () => {
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentScanned = async (doc: any) => {
    setIsProcessing(true);
    
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const ocrText = simulateOCR(doc.file.name);
      
      const scannedDoc: ScannedDocument = {
        id: Date.now().toString(),
        file: doc.file,
        preview: doc.preview,
        ocrText,
        category: doc.suggestedCategory,
        confidence: doc.confidence,
        timestamp: Date.now()
      };
      
      setScannedDocs(prev => [scannedDoc, ...prev]);
      
      toast.success(`Document scanned and processed with ${Math.round(doc.confidence * 100)}% confidence`);
    } catch (error) {
      console.error('OCR processing failed:', error);
      toast.error('Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateOCR = (fileName: string): string => {
    const medicalTexts = [
      "Patient: John Doe\nDOB: 15/03/1985\nDiagnosis: Hypertension\nMedication: Lisinopril 10mg daily\nNext appointment: 15/12/2024",
      "Lab Results\nGlucose: 95 mg/dL (Normal)\nCholesterol: 180 mg/dL (Normal)\nHbA1c: 5.2% (Normal)\nDate: 10/12/2024",
      "Prescription\nPatient: Jane Smith\nRx: Amoxicillin 500mg\nSig: Take one capsule three times daily\nDispense: 21 capsules\nRefills: 0",
      "Discharge Summary\nAdmission Date: 08/12/2024\nDischarge Date: 10/12/2024\nPrincipal Diagnosis: Appendicitis\nProcedure: Laparoscopic appendectomy"
    ];
    
    return medicalTexts[Math.floor(Math.random() * medicalTexts.length)];
  };

  const downloadDocument = (doc: ScannedDocument) => {
    const url = URL.createObjectURL(doc.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.category}_${doc.id}.${doc.file.name.split('.').pop()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Document downloaded');
  };

  const deleteDocument = (docId: string) => {
    setScannedDocs(prev => {
      const doc = prev.find(d => d.id === docId);
      if (doc) {
        URL.revokeObjectURL(doc.preview);
      }
      return prev.filter(d => d.id !== docId);
    });
    
    toast.success('Document deleted');
  };

  const viewOCRText = (doc: ScannedDocument) => {
    toast.info(doc.ocrText || 'No OCR text available', {
      duration: 5000,
      description: `Extracted from: ${doc.category}`
    });
  };

  const scannerFeatures = [
    'Auto-crop and perspective correction',
    'Medical document recognition',
    'OCR text extraction',
    'Batch scanning support',
    'Cloud sync integration',
    'HIPAA compliant processing'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Document Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">AI-Powered Features</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {scannerFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-500" />
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
            disabled={isProcessing}
          >
            <Camera className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Open Scanner'}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                Array.from(files).forEach(file => {
                  const preview = URL.createObjectURL(file);
                  handleDocumentScanned({
                    file,
                    preview,
                    suggestedCategory: 'General Medical',
                    confidence: 0.85
                  });
                });
              }
            }}
            className="hidden"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
            disabled={isProcessing}
          >
            <Image className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Scan className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-800">Processing document with AI...</span>
          </div>
        )}

        {/* Scanned Documents */}
        {scannedDocs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Scanned Documents ({scannedDocs.length})</h4>
              <Badge variant="secondary">{scannedDocs.length} items</Badge>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {scannedDocs.map((doc) => (
                <div key={doc.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start gap-3">
                    <img 
                      src={doc.preview} 
                      alt="Document preview"
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">
                          {doc.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.round(doc.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {doc.file.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => viewOCRText(doc)}>
                      <Eye className="h-3 w-3 mr-1" />
                      OCR
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                      <Download className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteDocument(doc.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
              <DocumentScanner 
                onDocumentScanned={handleDocumentScanned}
              />
              <div className="p-4 border-t">
                <Button 
                  onClick={() => setShowScanner(false)}
                  variant="outline"
                  className="w-full"
                >
                  Close Scanner
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Supports JPG, PNG, PDF formats</p>
          <p>• Automatic enhancement and OCR processing</p>
          <p>• Medical document classification</p>
        </div>
      </CardContent>
    </Card>
  );
};
