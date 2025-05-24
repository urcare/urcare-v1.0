
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, Upload, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ScannedDocument {
  id: string;
  file: File;
  preview: string;
  suggestedCategory: string;
  confidence: number;
}

export const DocumentScanner = ({ onDocumentScanned }: { onDocumentScanned?: (doc: ScannedDocument) => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Medical document categories for AI classification
  const categories = [
    'Lab Results', 'Imaging Reports', 'Prescriptions', 'Discharge Summary',
    'Insurance', 'Referrals', 'Vaccination Records', 'Allergy Information'
  ];

  const simulateAIClassification = (fileName: string): { category: string; confidence: number } => {
    // Simple keyword-based classification simulation
    const keywords = {
      'Lab Results': ['lab', 'blood', 'test', 'result', 'cbc', 'glucose'],
      'Imaging Reports': ['xray', 'mri', 'ct', 'scan', 'ultrasound', 'imaging'],
      'Prescriptions': ['prescription', 'medication', 'pharmacy', 'dose', 'mg'],
      'Discharge Summary': ['discharge', 'summary', 'hospital', 'admission'],
      'Insurance': ['insurance', 'claim', 'coverage', 'policy'],
      'Referrals': ['referral', 'specialist', 'consultation'],
      'Vaccination Records': ['vaccine', 'vaccination', 'immunization', 'shot'],
      'Allergy Information': ['allergy', 'allergic', 'reaction', 'sensitivity']
    };

    const lowerFileName = fileName.toLowerCase();
    
    for (const [category, keywordList] of Object.entries(keywords)) {
      for (const keyword of keywordList) {
        if (lowerFileName.includes(keyword)) {
          return { category, confidence: Math.random() * 0.3 + 0.7 }; // 70-100% confidence
        }
      }
    }
    
    // Default category with lower confidence
    return { category: 'General Medical', confidence: Math.random() * 0.4 + 0.3 };
  };

  const processFile = async (file: File) => {
    setIsScanning(true);
    
    try {
      // Create preview
      const preview = URL.createObjectURL(file);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get AI classification
      const { category, confidence } = simulateAIClassification(file.name);
      
      const scannedDoc: ScannedDocument = {
        id: Date.now().toString(),
        file,
        preview,
        suggestedCategory: category,
        confidence
      };
      
      setScannedDocs(prev => [...prev, scannedDoc]);
      onDocumentScanned?.(scannedDoc);
      
      toast({
        title: "Document Scanned",
        description: `Classified as: ${category} (${Math.round(confidence * 100)}% confidence)`
      });
      
    } catch (error) {
      console.error('Document processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(processFile);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const removeDocument = (id: string) => {
    setScannedDocs(prev => {
      const doc = prev.find(d => d.id === id);
      if (doc) {
        URL.revokeObjectURL(doc.preview);
      }
      return prev.filter(d => d.id !== id);
    });
  };

  const saveDocument = async (doc: ScannedDocument, finalCategory: string) => {
    if (!user) return;
    
    try {
      // In a real app, this would upload to Supabase Storage and save metadata
      console.log('Saving document:', { 
        fileName: doc.file.name, 
        category: finalCategory,
        userId: user.id 
      });
      
      toast({
        title: "Document Saved",
        description: `${doc.file.name} saved to ${finalCategory}`
      });
      
      removeDocument(doc.id);
      
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save document. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Smart Document Scanner
        </CardTitle>
        <CardDescription>
          Scan or upload medical documents for automatic categorization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-2"
            variant="default"
          >
            <Camera className="h-4 w-4" />
            Take Photo
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {isScanning && (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing document...</p>
            </div>
          </div>
        )}

        {scannedDocs.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Scanned Documents</h3>
            {scannedDocs.map(doc => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-start gap-3">
                  <img 
                    src={doc.preview} 
                    alt="Document preview"
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{doc.file.name}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {doc.suggestedCategory}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {Math.round(doc.confidence * 100)}% confidence
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveDocument(doc, doc.suggestedCategory)}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Save
                      </Button>
                      <select 
                        className="text-xs border rounded px-2 py-1"
                        onChange={(e) => {
                          if (e.target.value) {
                            saveDocument(doc, e.target.value);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="">Change category...</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
