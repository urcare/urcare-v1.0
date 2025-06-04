
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Bot, 
  Clock, 
  CheckCircle,
  User,
  Stethoscope,
  Eye,
  Download,
  Send
} from 'lucide-react';

interface VisitSummary {
  id: string;
  patientName: string;
  visitDate: string;
  provider: string;
  department: string;
  visitType: string;
  duration: string;
  extractionProgress: number;
  keyPoints: string[];
  status: 'processing' | 'completed' | 'reviewed' | 'distributed';
  aiConfidence: number;
}

const mockSummaries: VisitSummary[] = [
  {
    id: 'VS001',
    patientName: 'Alice Martinez',
    visitDate: '2024-01-22 09:30',
    provider: 'Dr. Sarah Kim',
    department: 'Cardiology',
    visitType: 'Follow-up Consultation',
    duration: '45 min',
    extractionProgress: 100,
    keyPoints: [
      'Blood pressure improved to 125/80 mmHg',
      'Patient reports reduced chest pain episodes',
      'Medication adherence confirmed',
      'Exercise tolerance increased',
      'Next appointment in 3 months'
    ],
    status: 'completed',
    aiConfidence: 94
  },
  {
    id: 'VS002',
    patientName: 'Robert Johnson',
    visitDate: '2024-01-22 11:00',
    provider: 'Dr. Michael Chen',
    department: 'Orthopedics',
    visitType: 'Post-Surgery Review',
    duration: '30 min',
    extractionProgress: 75,
    keyPoints: [
      'Wound healing progressing well',
      'Range of motion exercises recommended',
      'Physical therapy referral issued'
    ],
    status: 'processing',
    aiConfidence: 89
  }
];

export const VisitSummaryAutomation = () => {
  const [summaries] = useState<VisitSummary[]>(mockSummaries);
  const [selectedSummary, setSelectedSummary] = useState<VisitSummary | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'reviewed': return 'bg-green-500 text-white';
      case 'distributed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Visit Summary Automation
          </CardTitle>
          <CardDescription>
            Intelligent documentation extraction with automated key point identification and structured reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Bot className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{summaries.length}</p>
                    <p className="text-sm text-gray-600">Active Extractions</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{summaries.filter(s => s.status === 'completed').length}</p>
                    <p className="text-sm text-gray-600">Completed Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">2.3 min</p>
                    <p className="text-sm text-gray-600">Avg Processing Time</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Bot className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">92%</p>
                    <p className="text-sm text-gray-600">AI Accuracy</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Visit Summaries</h3>
              {summaries.map((summary) => (
                <Card 
                  key={summary.id} 
                  className={`cursor-pointer transition-colors ${selectedSummary?.id === summary.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                  onClick={() => setSelectedSummary(summary)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <h4 className="font-semibold">{summary.patientName}</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Stethoscope className="h-4 w-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{summary.provider}</p>
                        </div>
                        <p className="text-sm font-medium text-blue-600">{summary.visitType}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(summary.status)}>
                          {summary.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Extraction Progress</span>
                        <span className="font-bold">{summary.extractionProgress}%</span>
                      </div>
                      <Progress value={summary.extractionProgress} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{summary.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Bot className="h-3 w-3" />
                          <span>{summary.aiConfidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedSummary ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSummary.patientName} - Visit Summary</CardTitle>
                    <CardDescription>{selectedSummary.visitDate} • {selectedSummary.department}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Visit Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Provider: <strong>{selectedSummary.provider}</strong></p>
                            <p>Type: <strong>{selectedSummary.visitType}</strong></p>
                            <p>Duration: <strong>{selectedSummary.duration}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">AI Analysis</h4>
                          <div className="space-y-1 text-sm">
                            <p>Confidence: <strong>{selectedSummary.aiConfidence}%</strong></p>
                            <p>Status: <strong>{selectedSummary.status}</strong></p>
                            <p>Points: <strong>{selectedSummary.keyPoints.length}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Extracted Key Points</h4>
                        <div className="space-y-2">
                          {selectedSummary.keyPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm bg-blue-50 p-2 rounded">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI-Generated Summary</h4>
                        <div className="text-sm bg-gray-50 p-3 rounded">
                          <p>Patient showed significant improvement in cardiovascular health with normalized blood pressure readings and reduced symptoms. Medication compliance excellent. Recommended continued current treatment plan with follow-up in 3 months.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Eye className="h-4 w-4 mr-1" />
                          Review Summary
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export Report
                        </Button>
                        <Button variant="outline">
                          <Send className="h-4 w-4 mr-1" />
                          Share with Team
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a visit summary to view detailed extraction and key points</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
