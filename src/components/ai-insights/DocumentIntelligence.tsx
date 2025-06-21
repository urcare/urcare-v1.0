
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Search, 
  Upload, 
  Mic, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Brain,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface HealthDocument {
  id: string;
  name: string;
  type: 'prescription' | 'lab-report' | 'scan' | 'discharge-summary' | 'insurance' | 'voice-note';
  uploadDate: Date;
  expiryDate?: Date;
  category: string;
  status: 'valid' | 'expiring' | 'expired' | 'needs-renewal';
  aiSummary: string;
  keyInsights: string[];
  tags: string[];
  searchableText: string;
}

interface DocumentAlert {
  id: string;
  documentId: string;
  type: 'expiry' | 'renewal' | 'follow-up' | 'missing-info';
  message: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export const DocumentIntelligence = () => {
  const [documents, setDocuments] = useState<HealthDocument[]>([
    {
      id: '1',
      name: 'Blood Test Results - Complete Panel',
      type: 'lab-report',
      uploadDate: new Date('2024-01-15'),
      category: 'Laboratory',
      status: 'valid',
      aiSummary: 'Overall results within normal range. Vitamin D slightly low at 18 ng/mL (normal: 20-50). Consider supplementation.',
      keyInsights: [
        'Hemoglobin: 13.2 g/dL (Normal)',
        'Cholesterol: 185 mg/dL (Good)',
        'Vitamin D: 18 ng/mL (Low - supplement needed)',
        'Blood Sugar: 95 mg/dL (Normal)'
      ],
      tags: ['blood-test', 'vitamin-d', 'cholesterol', 'routine-checkup'],
      searchableText: 'blood test complete panel hemoglobin cholesterol vitamin d glucose'
    },
    {
      id: '2',
      name: 'Lisinopril Prescription',
      type: 'prescription',
      uploadDate: new Date('2024-01-10'),
      expiryDate: new Date('2024-03-10'),
      category: 'Medication',
      status: 'expiring',
      aiSummary: 'ACE inhibitor for blood pressure management. Take 10mg once daily. Monitor for dry cough side effect.',
      keyInsights: [
        'Dosage: 10mg once daily',
        'Duration: 60 days',
        'Refills: 2 remaining',
        'Side effects to watch: Dry cough, dizziness'
      ],
      tags: ['blood-pressure', 'lisinopril', 'prescription', 'cardiovascular'],
      searchableText: 'lisinopril prescription blood pressure ace inhibitor medication'
    }
  ]);

  const [alerts, setAlerts] = useState<DocumentAlert[]>([
    {
      id: '1',
      documentId: '2',
      type: 'expiry',
      message: 'Lisinopril prescription expires in 15 days',
      priority: 'medium',
      dueDate: new Date('2024-03-10')
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');

  const categories = ['all', 'prescription', 'lab-report', 'scan', 'discharge-summary', 'voice-note'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.searchableText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        // Simulate AI processing
        toast.promise(
          new Promise(resolve => setTimeout(resolve, 3000)),
          {
            loading: `AI analyzing ${file.name}...`,
            success: `${file.name} processed and categorized!`,
            error: 'Failed to process document'
          }
        );
      });
    }
  };

  const handleVoiceNote = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Recording voice note...');
      // Simulate voice recording
      setTimeout(() => {
        setIsListening(false);
        toast.success('Voice note saved and transcribed!');
      }, 5000);
    }
  };

  const handleDocumentAction = (docId: string, action: string) => {
    if (action === 'renew') {
      toast.success('Renewal reminder set');
    } else if (action === 'schedule') {
      toast.success('Follow-up appointment scheduled');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring': return 'bg-orange-100 text-orange-800';
      case 'needs-renewal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Upload Documents</div>
                <div className="text-xs text-gray-500">Auto-categorization</div>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleVoiceNote}
                className="h-full w-full flex flex-col items-center gap-2"
              >
                <Mic className={`h-8 w-8 ${isListening ? 'text-red-600 animate-pulse' : 'text-green-600'}`} />
                <div className="text-sm font-medium">
                  {isListening ? 'Recording...' : 'Voice Notes'}
                </div>
                <div className="text-xs text-gray-500">Speech-to-text</div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">AI Analysis</div>
              <div className="text-xs text-gray-500">Smart insights</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search documents, conditions, or medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.replace('-', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Smart Documents</TabsTrigger>
          <TabsTrigger value="alerts">Document Alerts</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <h4 className="font-semibold">{doc.name}</h4>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {doc.uploadDate.toLocaleDateString()}
                      </span>
                      {doc.expiryDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires: {doc.expiryDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-sm mb-1">AI Summary</h5>
                          <p className="text-sm text-gray-700">{doc.aiSummary}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Key Insights:</h5>
                      <ul className="space-y-1">
                        {doc.keyInsights.map((insight, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {doc.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {doc.status === 'expiring' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleDocumentAction(doc.id, 'renew')}
                      >
                        Set Renewal
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDocumentAction(doc.id, 'schedule')}
                    >
                      Follow-up
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={getPriorityColor(alert.priority)}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{alert.message}</div>
                  {alert.dueDate && (
                    <div className="text-sm text-gray-600 mt-1">
                      Due: {alert.dueDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Dismiss
                  </Button>
                  <Button size="sm">
                    Take Action
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Analysis Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Health Trends</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Blood pressure stable over 6 months</li>
                    <li>• Cholesterol improving with medication</li>
                    <li>• Vitamin D deficiency detected</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Action Items</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Schedule vitamin D follow-up test</li>
                    <li>• Renew blood pressure medication</li>
                    <li>• Annual physical due next month</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
