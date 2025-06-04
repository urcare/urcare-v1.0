
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Bot, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  Eye
} from 'lucide-react';

interface PreAuthorization {
  id: string;
  patientName: string;
  procedure: string;
  insuranceProvider: string;
  requestDate: string;
  urgency: 'urgent' | 'routine' | 'elective';
  formProgress: number;
  requirementsMet: number;
  totalRequirements: number;
  status: 'analyzing' | 'form_ready' | 'submitted' | 'approved' | 'denied';
  estimatedTime: string;
  aiConfidence: number;
}

const mockPreAuths: PreAuthorization[] = [
  {
    id: 'PA001',
    patientName: 'David Wilson',
    procedure: 'MRI Brain with Contrast',
    insuranceProvider: 'Blue Cross Blue Shield',
    requestDate: '2024-01-22',
    urgency: 'routine',
    formProgress: 85,
    requirementsMet: 7,
    totalRequirements: 8,
    status: 'form_ready',
    estimatedTime: '2-3 days',
    aiConfidence: 91
  },
  {
    id: 'PA002',
    patientName: 'Lisa Chen',
    procedure: 'Cardiac Catheterization',
    insuranceProvider: 'Aetna',
    requestDate: '2024-01-22',
    urgency: 'urgent',
    formProgress: 100,
    requirementsMet: 6,
    totalRequirements: 6,
    status: 'submitted',
    estimatedTime: '24-48 hours',
    aiConfidence: 95
  }
];

export const PreAuthorizationInterface = () => {
  const [preAuths] = useState<PreAuthorization[]>(mockPreAuths);
  const [selectedPreAuth, setSelectedPreAuth] = useState<PreAuthorization | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'routine': return 'bg-blue-500 text-white';
      case 'elective': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing': return 'bg-yellow-500 text-white';
      case 'form_ready': return 'bg-blue-500 text-white';
      case 'submitted': return 'bg-purple-500 text-white';
      case 'approved': return 'bg-green-500 text-white';
      case 'denied': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pre-Authorization Interface
          </CardTitle>
          <CardDescription>
            Insurance requirement analysis with automated form completion and approval tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{preAuths.length}</p>
                    <p className="text-sm text-gray-600">Active Requests</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Bot className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">87%</p>
                    <p className="text-sm text-gray-600">Auto-Completion Rate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">94%</p>
                    <p className="text-sm text-gray-600">Approval Rate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">1.8 days</p>
                    <p className="text-sm text-gray-600">Avg Processing Time</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pre-Authorization Requests</h3>
              {preAuths.map((preAuth) => (
                <Card 
                  key={preAuth.id} 
                  className={`cursor-pointer transition-colors ${selectedPreAuth?.id === preAuth.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                  onClick={() => setSelectedPreAuth(preAuth)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{preAuth.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{preAuth.procedure}</p>
                        <p className="text-sm font-medium text-blue-600">{preAuth.insuranceProvider}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getUrgencyColor(preAuth.urgency)}>
                          {preAuth.urgency.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(preAuth.status)}>
                          {preAuth.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Form Completion</span>
                        <span className="font-bold">{preAuth.formProgress}%</span>
                      </div>
                      <Progress value={preAuth.formProgress} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Requirements</span>
                        <span className="font-bold">{preAuth.requirementsMet}/{preAuth.totalRequirements}</span>
                      </div>
                      <Progress value={(preAuth.requirementsMet / preAuth.totalRequirements) * 100} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Est. {preAuth.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Bot className="h-3 w-3" />
                          <span>{preAuth.aiConfidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedPreAuth ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPreAuth.patientName}</CardTitle>
                    <CardDescription>{selectedPreAuth.procedure} • {selectedPreAuth.insuranceProvider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Request Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Urgency: <strong>{selectedPreAuth.urgency}</strong></p>
                            <p>Request Date: <strong>{selectedPreAuth.requestDate}</strong></p>
                            <p>Est. Time: <strong>{selectedPreAuth.estimatedTime}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Progress Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Form: <strong>{selectedPreAuth.formProgress}%</strong></p>
                            <p>Requirements: <strong>{selectedPreAuth.requirementsMet}/{selectedPreAuth.totalRequirements}</strong></p>
                            <p>AI Confidence: <strong>{selectedPreAuth.aiConfidence}%</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Insurance Requirements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Prior medical records submitted</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Clinical justification provided</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Alternative treatments considered</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-yellow-50 rounded">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <span>Additional imaging results pending</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI-Generated Form Preview</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded space-y-1">
                          <p><strong>Diagnosis Code:</strong> G93.1 - Anoxic brain damage, not elsewhere classified</p>
                          <p><strong>Procedure Code:</strong> 70553 - MRI brain without and with contrast</p>
                          <p><strong>Medical Necessity:</strong> Follow-up imaging for post-anoxic brain injury</p>
                          <p><strong>Prior Authorization:</strong> Required for contrast enhancement</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Send className="h-4 w-4 mr-1" />
                          Submit Request
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview Form
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Add Documents
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a pre-authorization request to view details and requirements</p>
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
