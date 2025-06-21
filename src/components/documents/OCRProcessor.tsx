
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Eye, 
  Copy, 
  Download, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

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

interface OCRProcessorProps {
  imageFile: File;
  onOCRComplete: (result: OCRResult) => void;
  onClose: () => void;
}

export const OCRProcessor = ({ imageFile, onOCRComplete, onClose }: OCRProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const simulateOCRProcessing = async (): Promise<OCRResult> => {
    // Simulate progressive OCR processing
    const steps = [
      { progress: 20, message: 'Preprocessing image...' },
      { progress: 40, message: 'Detecting text regions...' },
      { progress: 60, message: 'Extracting characters...' },
      { progress: 80, message: 'Analyzing text structure...' },
      { progress: 95, message: 'Finalizing results...' }
    ];

    for (const step of steps) {
      setProgress(step.progress);
      toast.info(step.message);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate realistic medical document text based on filename
    const fileName = imageFile.name.toLowerCase();
    let extractedText = '';
    let confidence = 0.85 + Math.random() * 0.12; // 85-97% confidence

    if (fileName.includes('prescription') || fileName.includes('rx')) {
      extractedText = `PRESCRIPTION

Patient: John Doe
DOB: 03/15/1980
Address: 123 Main Street, Anytown, ST 12345

Rx: Lisinopril 10mg
Sig: Take one tablet by mouth once daily
Disp: #30 tablets
Refills: 2

Dr. Sarah Johnson, MD
License: MD12345
DEA: BJ1234567

Date: ${new Date().toLocaleDateString()}

Pharmacist: Please dispense as written
Generic substitution permitted`;
    } else if (fileName.includes('lab') || fileName.includes('blood')) {
      extractedText = `LABORATORY RESULTS

Patient: Jane Smith
DOB: 07/22/1975
MRN: 987654321

Collection Date: ${new Date().toLocaleDateString()}
Received: ${new Date().toLocaleDateString()}

COMPLETE BLOOD COUNT
White Blood Cells: 7.2 K/uL (Normal: 4.0-11.0)
Red Blood Cells: 4.5 M/uL (Normal: 4.2-5.4)
Hemoglobin: 13.8 g/dL (Normal: 12.0-16.0)
Hematocrit: 41.2% (Normal: 36.0-46.0)
Platelets: 285 K/uL (Normal: 150-450)

BASIC METABOLIC PANEL
Glucose: 95 mg/dL (Normal: 70-100)
BUN: 18 mg/dL (Normal: 7-20)
Creatinine: 0.9 mg/dL (Normal: 0.6-1.3)
Sodium: 140 mEq/L (Normal: 136-145)

Dr. Michael Chen, MD
Pathologist`;
    } else if (fileName.includes('discharge') || fileName.includes('summary')) {
      extractedText = `DISCHARGE SUMMARY

Patient: Robert Wilson
Medical Record #: 456789
Admission Date: ${new Date(Date.now() - 3*24*60*60*1000).toLocaleDateString()}
Discharge Date: ${new Date().toLocaleDateString()}

PRINCIPAL DIAGNOSIS:
Acute appendicitis

PROCEDURES PERFORMED:
Laparoscopic appendectomy

HOSPITAL COURSE:
Patient presented with acute onset right lower quadrant pain. CT scan confirmed acute appendicitis. Patient underwent uncomplicated laparoscopic appendectomy. Post-operative course was unremarkable.

DISCHARGE MEDICATIONS:
1. Ibuprofen 600mg every 8 hours as needed for pain
2. Augmentin 875mg twice daily for 7 days

FOLLOW-UP:
Return to clinic in 2 weeks for wound check.

Dr. Emily Rodriguez, MD
General Surgery`;
    } else {
      extractedText = `MEDICAL DOCUMENT

Patient Information:
Name: [Patient Name]
Date of Birth: [DOB]
Medical Record Number: [MRN]

Clinical Notes:
Patient presents with chief complaint of [symptoms].
Physical examination reveals [findings].
Assessment and plan: [treatment plan].

Provider: [Doctor Name], MD
Date: ${new Date().toLocaleDateString()}

This document contains medical information that should be kept confidential and secure.`;
    }

    // Generate word-level data
    const words = extractedText.split(/\s+/).map((word, index) => ({
      text: word,
      confidence: 0.8 + Math.random() * 0.19,
      bbox: {
        x: (index % 10) * 80,
        y: Math.floor(index / 10) * 25,
        width: word.length * 8,
        height: 20
      }
    }));

    return {
      text: extractedText,
      confidence,
      language: 'en',
      words
    };
  };

  const handleStartOCR = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await simulateOCRProcessing();
      setProgress(100);
      setOcrResult(result);
      onOCRComplete(result);
      
      toast.success(`OCR completed with ${Math.round(result.confidence * 100)}% confidence`);
    } catch (error) {
      console.error('OCR processing failed:', error);
      toast.error('OCR processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    if (ocrResult) {
      await navigator.clipboard.writeText(ocrResult.text);
      toast.success('Text copied to clipboard');
    }
  };

  const downloadText = () => {
    if (ocrResult) {
      const blob = new Blob([ocrResult.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ocr-result-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Text file downloaded');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              OCR Text Extraction
            </CardTitle>
            <CardDescription>
              Extract text from scanned documents using AI
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Preview */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img 
              src={URL.createObjectURL(imageFile)}
              alt="Document to process"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-medium">{imageFile.name}</p>
            <p className="text-sm text-gray-600">
              Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-sm text-gray-600">
              Type: {imageFile.type}
            </p>
          </div>
        </div>

        {/* Processing Controls */}
        {!ocrResult && (
          <div className="space-y-4">
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing document...</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
            
            <Button 
              onClick={handleStartOCR}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Start OCR Processing
                </>
              )}
            </Button>
          </div>
        )}

        {/* OCR Results */}
        {ocrResult && (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">OCR Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getConfidenceColor(ocrResult.confidence)}>
                  {Math.round(ocrResult.confidence * 100)}% Confidence
                </Badge>
                <Badge variant="outline">
                  {ocrResult.words.length} words
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowFullText(!showFullText)}>
                <Eye className="h-4 w-4 mr-1" />
                {showFullText ? 'Hide' : 'View'} Full Text
              </Button>
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                Copy Text
              </Button>
              <Button size="sm" variant="outline" onClick={downloadText}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>

            {/* Text Preview */}
            <div className="space-y-2">
              <h4 className="font-medium">Extracted Text:</h4>
              <div className={`p-4 border rounded-lg bg-gray-50 ${showFullText ? '' : 'max-h-32 overflow-hidden'}`}>
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {ocrResult.text}
                </pre>
              </div>
              {!showFullText && ocrResult.text.length > 200 && (
                <Button 
                  size="sm" 
                  variant="link" 
                  onClick={() => setShowFullText(true)}
                  className="p-0 h-auto"
                >
                  Show more...
                </Button>
              )}
            </div>

            {/* Confidence Warning */}
            {ocrResult.confidence < 0.8 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Low Confidence Warning</p>
                  <p>The OCR confidence is below 80%. Please review the extracted text carefully for accuracy.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
