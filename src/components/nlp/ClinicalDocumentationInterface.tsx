
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Zap,
  Download,
  Eye,
  Edit3,
  Clock,
  User
} from 'lucide-react';

export const ClinicalDocumentationInterface = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocument, setProcessedDocument] = useState(null);

  const sampleDocuments = [
    {
      id: 1,
      type: 'Progress Note',
      patient: 'John Smith',
      date: '2024-06-09',
      status: 'processed',
      originalLength: 1200,
      summaryLength: 300,
      keyEntities: ['Hypertension', 'Diabetes', 'Metformin', 'Lisinopril'],
      confidence: 94.2
    },
    {
      id: 2,
      type: 'Discharge Summary',
      patient: 'Sarah Johnson',
      date: '2024-06-08',
      status: 'processing',
      originalLength: 2100,
      summaryLength: 450,
      keyEntities: ['Pneumonia', 'Chest X-ray', 'Antibiotics'],
      confidence: 91.8
    }
  ];

  const processDocument = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockProcessed = {
      summary: "Patient presents with acute exacerbation of chronic conditions. Blood pressure elevated at 160/95. Diabetes management reviewed with HbA1c at 8.2%. Medication adherence discussed. Follow-up in 2 weeks recommended.",
      keyEntities: ['Hypertension', 'Diabetes', 'Blood pressure', 'HbA1c', 'Medication adherence'],
      structure: {
        chief_complaint: "Follow-up for diabetes and hypertension",
        history_present_illness: "Patient reports medication compliance issues",
        assessment: "Uncontrolled diabetes and hypertension",
        plan: "Adjust medications, lifestyle counseling, follow-up"
      },
      confidence: 92.5,
      processingTime: 2.8
    };
    
    setProcessedDocument(mockProcessed);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Document Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter clinical documentation text for AI processing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32"
            />
            <div className="flex gap-2">
              <Button 
                onClick={processDocument} 
                disabled={!inputText.trim() || isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                {isProcessing ? 'Processing...' : 'Process with AI'}
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processed Results */}
      {processedDocument && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              AI Processing Results
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {processedDocument.processingTime}s
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                {processedDocument.confidence}% confidence
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="entities">Key Entities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">AI-Generated Summary</h4>
                  <p className="text-gray-700">{processedDocument.summary}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="structure" className="space-y-4">
                <div className="grid gap-4">
                  {Object.entries(processedDocument.structure).map(([key, value]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm text-blue-600 uppercase tracking-wide mb-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-gray-700">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="entities" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {processedDocument.keyEntities.map((entity, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Processed Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{doc.type}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {doc.patient} • {doc.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {doc.keyEntities.slice(0, 3).map((entity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {entity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="text-gray-600">{doc.originalLength} → {doc.summaryLength} words</div>
                    <div className="text-green-600">{doc.confidence}% confidence</div>
                  </div>
                  <Badge variant={doc.status === 'processed' ? 'default' : 'secondary'}>
                    {doc.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
