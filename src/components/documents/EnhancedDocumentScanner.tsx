
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Upload, 
  FileText, 
  Settings, 
  Trash2, 
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Scan,
  FolderOpen
} from 'lucide-react';
import { OCRProcessor } from './OCRProcessor';
import { toast } from 'sonner';

interface ScannedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  scannedAt: Date;
  ocrResult?: {
    text: string;
    confidence: number;
  };
  file: File;
}

interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x: number; y: number; width: number; height: number };
  }>;
}

export const EnhancedDocumentScanner = () => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showOCRProcessor, setShowOCRProcessor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setShowOCRProcessor(true);
        toast.success('Document selected for processing');
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setShowOCRProcessor(true);
      toast.success('Photo captured for processing');
    }
  };

  const handleOCRComplete = (result: OCRResult) => {
    if (selectedFile) {
      const newDocument: ScannedDocument = {
        id: `doc_${Date.now()}`,
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        scannedAt: new Date(),
        ocrResult: {
          text: result.text,
          confidence: result.confidence
        },
        file: selectedFile
      };
      
      setScannedDocuments(prev => [newDocument, ...prev]);
      setShowOCRProcessor(false);
      setSelectedFile(null);
      toast.success('Document processed and saved successfully');
    }
  };

  const deleteDocument = (id: string) => {
    setScannedDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success('Document deleted');
  };

  const downloadDocument = (doc: ScannedDocument) => {
    if (doc.ocrResult) {
      const blob = new Blob([doc.ocrResult.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.name}_extracted.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Text file downloaded');
    }
  };

  const viewDocument = (doc: ScannedDocument) => {
    const url = URL.createObjectURL(doc.file);
    window.open(url, '_blank');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (showOCRProcessor && selectedFile) {
    return (
      <OCRProcessor
        imageFile={selectedFile}
        onOCRComplete={handleOCRComplete}
        onClose={() => {
          setShowOCRProcessor(false);
          setSelectedFile(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Documents ({scannedDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Scanner
              </CardTitle>
              <CardDescription>
                Scan documents using your camera or upload image files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="h-32 flex-col gap-3"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isScanning}
                >
                  <Camera className="h-8 w-8" />
                  <span>Take Photo</span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-32 flex-col gap-3"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                >
                  <Upload className="h-8 w-8" />
                  <span>Upload File</span>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraCapture}
              />

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Processing document...</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  For best results, ensure good lighting and that the document is flat and clearly visible.
                  Supported formats: JPG, PNG, WEBP
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Scanned Documents
              </CardTitle>
              <CardDescription>
                Manage your scanned documents and extracted text
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scannedDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No documents scanned yet</p>
                  <p className="text-sm text-gray-400">Use the scanner tab to add documents</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scannedDocuments.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={URL.createObjectURL(doc.file)}
                              alt={doc.name}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <div>
                              <h4 className="font-medium">{doc.name}</h4>
                              <p className="text-sm text-gray-600">
                                Scanned {doc.scannedAt.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(doc.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          
                          {doc.ocrResult && (
                            <Badge className={getConfidenceColor(doc.ocrResult.confidence)}>
                              {Math.round(doc.ocrResult.confidence * 100)}% Confidence
                            </Badge>
                          )}
                        </div>

                        {doc.ocrResult && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Extracted Text Preview:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-hidden">
                              {doc.ocrResult.text.substring(0, 150)}
                              {doc.ocrResult.text.length > 150 && '...'}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => viewDocument(doc)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {doc.ocrResult && (
                            <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                              <Download className="h-3 w-3 mr-1" />
                              Download Text
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Scanner Settings
              </CardTitle>
              <CardDescription>
                Configure your document scanning preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">OCR Settings</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Automatic language detection enabled</p>
                  <p>• High confidence threshold: 80%</p>
                  <p>• Auto-save extracted text</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Storage</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Documents stored locally in browser</p>
                  <p>• Clear all documents to free up space</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setScannedDocuments([]);
                    toast.success('All documents cleared');
                  }}
                  className="text-red-600"
                >
                  Clear All Documents
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Quality Settings</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Image preprocessing enabled</p>
                  <p>• Auto-rotation detection</p>
                  <p>• Noise reduction active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
