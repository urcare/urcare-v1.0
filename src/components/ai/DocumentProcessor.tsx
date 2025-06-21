
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Eye, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProcessedDocument {
  id: string;
  name: string;
  type: 'lab_report' | 'prescription' | 'medical_history' | 'insurance' | 'other';
  status: 'processing' | 'completed' | 'error';
  uploadDate: string;
  insights: string[];
  keyFindings: string[];
  aiSummary: string;
  confidence: number;
  size: string;
}

export const DocumentProcessor = () => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([
    {
      id: '1',
      name: 'Blood_Test_Results_Jan2024.pdf',
      type: 'lab_report',
      status: 'completed',
      uploadDate: '2024-01-15',
      insights: [
        'Cholesterol levels slightly elevated',
        'Vitamin D deficiency detected',
        'All other markers within normal range'
      ],
      keyFindings: [
        'Total Cholesterol: 220 mg/dL (Normal: <200)',
        'Vitamin D: 18 ng/mL (Normal: 30-100)',
        'Blood Sugar: 95 mg/dL (Normal)'
      ],
      aiSummary: 'Overall health indicators are good with two areas requiring attention: cholesterol management and vitamin D supplementation.',
      confidence: 94,
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Prescription_Dr_Smith.jpg',
      type: 'prescription',
      status: 'completed',
      uploadDate: '2024-01-10',
      insights: [
        'Medication for hypertension prescribed',
        'Dosage: 10mg daily',
        'Duration: 3 months with follow-up'
      ],
      keyFindings: [
        'Medication: Lisinopril 10mg',
        'Frequency: Once daily',
        'Refills: 2 remaining'
      ],
      aiSummary: 'Blood pressure medication prescribed with standard dosage. Regular monitoring recommended.',
      confidence: 98,
      size: '1.2 MB'
    },
    {
      id: '3',
      name: 'Processing_MRI_Scan.pdf',
      type: 'other',
      status: 'processing',
      uploadDate: '2024-01-20',
      insights: [],
      keyFindings: [],
      aiSummary: '',
      confidence: 0,
      size: '15.8 MB'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    Array.from(files).forEach((file) => {
      const newDoc: ProcessedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: 'other',
        status: 'processing',
        uploadDate: new Date().toISOString().split('T')[0],
        insights: [],
        keyFindings: [],
        aiSummary: '',
        confidence: 0,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };

      setDocuments(prev => [newDoc, ...prev]);

      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? {
                ...doc,
                status: 'completed',
                insights: [
                  'Document processed successfully',
                  'Key medical information extracted',
                  'Ready for review'
                ],
                keyFindings: [
                  'Medical document analyzed',
                  'Information structure identified',
                  'Content verified'
                ],
                aiSummary: 'Document has been successfully processed and analyzed by AI.',
                confidence: 89
              }
            : doc
        ));
        toast.success(`${file.name} processed successfully!`);
      }, 3000);
    });

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab_report': return 'bg-blue-100 text-blue-800';
      case 'prescription': return 'bg-green-100 text-green-800';
      case 'medical_history': return 'bg-purple-100 text-purple-800';
      case 'insurance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Document deleted successfully');
  };

  const completedDocs = documents.filter(doc => doc.status === 'completed');
  const processingDocs = documents.filter(doc => doc.status === 'processing');

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Document Intelligence
          </CardTitle>
          <CardDescription>
            Upload medical documents for AI-powered analysis and insights extraction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{completedDocs.length}</div>
              <p className="text-sm text-gray-600">Documents Processed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{processingDocs.length}</div>
              <p className="text-sm text-gray-600">Currently Processing</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedDocs.length > 0 ? Math.round(completedDocs.reduce((acc, doc) => acc + doc.confidence, 0) / completedDocs.length) : 0}%
              </div>
              <p className="text-sm text-gray-600">Avg. Confidence</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {documents.reduce((acc, doc) => acc + parseFloat(doc.size), 0).toFixed(1)} MB
              </div>
              <p className="text-sm text-gray-600">Total Storage</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Upload Medical Documents</p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, JPG, PNG, DOCX (Max 25MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mb-2"
            >
              {isUploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <p className="text-xs text-gray-400">
              AI will automatically extract key information and provide insights
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="lab_report">Lab Reports</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-500">
                          Uploaded on {doc.uploadDate} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(doc.type)}>
                        {doc.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {getStatusIcon(doc.status)}
                    </div>
                  </div>

                  {doc.status === 'processing' && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">AI Processing Progress</span>
                        <span className="text-sm text-gray-600">Analyzing...</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}

                  {doc.status === 'completed' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                          <span className="text-sm text-gray-600">{doc.confidence}%</span>
                        </div>
                        <Progress value={doc.confidence} className="h-2" />
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">AI Summary</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {doc.aiSummary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {doc.keyFindings.map((finding, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                {finding}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {doc.insights.map((insight, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Analysis
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lab_report">
          <div className="space-y-4">
            {documents
              .filter(doc => doc.type === 'lab_report')
              .map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.aiSummary}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="prescription">
          <div className="space-y-4">
            {documents
              .filter(doc => doc.type === 'prescription')
              .map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.aiSummary}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="processing">
          <div className="space-y-4">
            {documents
              .filter(doc => doc.status === 'processing')
              .map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <h3 className="font-medium">{doc.name}</h3>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">AI is analyzing your document...</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
