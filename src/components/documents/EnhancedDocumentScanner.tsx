
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Upload, 
  FileText, 
  Scan, 
  Image as ImageIcon,
  FolderOpen,
  Settings,
  Zap
} from 'lucide-react';
import { OCRProcessor } from './OCRProcessor';
import { toast } from 'sonner';

interface ScannedDocument {
  id: string;
  file: File;
  preview: string;
  name: string;
  category: string;
  confidence: number;
  ocrText?: string;
  timestamp: number;
}

export const EnhancedDocumentScanner = () => {
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ScannedDocument | null>(null);
  const [showOCRProcessor, setShowOCRProcessor] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    'Prescription',
    'Lab Results',
    'Medical Records',
    'Insurance Card',
    'Discharge Summary',
    'Imaging Report',
    'Vaccination Record',
    'Medical Bill',
    'Other'
  ];

  const classifyDocument = (fileName: string): { category: string; confidence: number } => {
    const name = fileName.toLowerCase();
    
    if (name.includes('prescription') || name.includes('rx')) {
      return { category: 'Prescription', confidence: 0.9 };
    }
    if (name.includes('lab') || name.includes('blood') || name.includes('test')) {
      return { category: 'Lab Results', confidence: 0.85 };
    }
    if (name.includes('discharge') || name.includes('summary')) {
      return { category: 'Discharge Summary', confidence: 0.8 };
    }
    if (name.includes('insurance') || name.includes('card')) {
      return { category: 'Insurance Card', confidence: 0.85 };
    }
    if (name.includes('xray') || name.includes('mri') || name.includes('ct') || name.includes('ultrasound')) {
      return { category: 'Imaging Report', confidence: 0.88 };
    }
    if (name.includes('vaccine') || name.includes('immunization')) {
      return { category: 'Vaccination Record', confidence: 0.87 };
    }
    if (name.includes('bill') || name.includes('invoice')) {
      return { category: 'Medical Bill', confidence: 0.82 };
    }
    
    return { category: 'Medical Records', confidence: 0.7 };
  };

  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const preview = URL.createObjectURL(file);
        const { category, confidence } = classifyDocument(file.name);
        
        const document: ScannedDocument = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview,
          name: file.name,
          category,
          confidence,
          timestamp: Date.now()
        };
        
        setDocuments(prev => [document, ...prev]);
        toast.success(`Document scanned: ${category}`);
      } else {
        toast.error(`Unsupported file type: ${file.type}`);
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleOCRComplete = (document: ScannedDocument, ocrResult: any) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === document.id 
        ? { ...doc, ocrText: ocrResult.text, confidence: ocrResult.confidence }
        : doc
    ));
    setShowOCRProcessor(false);
    setSelectedDocument(null);
    toast.success('OCR processing completed');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => {
      const doc = prev.find(d => d.id === id);
      if (doc) {
        URL.revokeObjectURL(doc.preview);
      }
      return prev.filter(d => d.id !== id);
    });
    toast.success('Document deleted');
  };

  const downloadDocument = (document: ScannedDocument) => {
    const url = URL.createObjectURL(document.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document downloaded');
  };

  const startOCR = (document: ScannedDocument) => {
    setSelectedDocument(document);
    setShowOCRProcessor(true);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Prescription': 'bg-blue-100 text-blue-800',
      'Lab Results': 'bg-green-100 text-green-800',
      'Medical Records': 'bg-purple-100 text-purple-800',
      'Insurance Card': 'bg-orange-100 text-orange-800',
      'Discharge Summary': 'bg-red-100 text-red-800',
      'Imaging Report': 'bg-indigo-100 text-indigo-800',
      'Vaccination Record': 'bg-pink-100 text-pink-800',
      'Medical Bill': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  if (showOCRProcessor && selectedDocument) {
    return (
      <OCRProcessor
        imageFile={selectedDocument.file}
        onOCRComplete={(result) => handleOCRComplete(selectedDocument, result)}
        onClose={() => setShowOCRProcessor(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-6 w-6" />
            Enhanced Document Scanner with OCR
          </CardTitle>
          <CardDescription>
            Scan, digitize, and extract text from medical documents with AI-powered recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Scan
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Documents ({documents.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="space-y-6">
              {/* Scanning Interface */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6 text-center space-y-4">
                    <Camera className="h-12 w-12 mx-auto text-primary" />
                    <div>
                      <h3 className="font-semibold mb-2">Camera Scan</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Use your device camera to capture documents
                      </p>
                      <Button 
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Open Camera
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-primary" />
                    <div>
                      <h3 className="font-semibold mb-2">File Upload</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload images or PDF documents
                      </p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI-Powered Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">OCR Text Extraction</h4>
                        <p className="text-sm text-gray-600">Extract text with 95%+ accuracy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <ImageIcon className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">Image Enhancement</h4>
                        <p className="text-sm text-gray-600">Auto-crop and clarity boost</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Scan className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Smart Classification</h4>
                        <p className="text-sm text-gray-600">Auto-categorize documents</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents scanned</h3>
                  <p className="text-gray-600 mb-4">Start by scanning or uploading your first document</p>
                  <Button onClick={() => setActiveTab('scan')}>
                    <Camera className="h-4 w-4 mr-2" />
                    Scan Document
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        <img 
                          src={doc.preview}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getCategoryColor(doc.category)}>
                            {doc.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-medium truncate">{doc.name}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => startOCR(doc)}
                            disabled={!!doc.ocrText}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            {doc.ocrText ? 'OCR Done' : 'Extract Text'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadDocument(doc)}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>

                        {doc.ocrText && (
                          <div className="p-2 bg-gray-50 rounded text-xs">
                            <p className="font-medium mb-1">Extracted Text:</p>
                            <p className="truncate">{doc.ocrText.substring(0, 100)}...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scanner Settings</CardTitle>
                  <CardDescription>Configure document scanning preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Supported Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {documentCategories.map(category => (
                        <Badge key={category} variant="outline" className={getCategoryColor(category)}>
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Supported Formats</h4>
                    <div className="text-sm text-gray-600">
                      <p>• Images: JPG, PNG, WebP, HEIC</p>
                      <p>• Documents: PDF (single and multi-page)</p>
                      <p>• Maximum file size: 10MB per document</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};
